import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import dayjs from 'dayjs';

import type { IPayment, ITransactionDetail } from '@/types/services';

import Avatar from '@/components/shared/avatar';
import Badge from '@/components/shared/badge';
import BottomDrawer from '@/components/shared/bottom-drawer';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import Empty from '@/components/shared/empty';
import List from '@/components/shared/list';
import PaymentProgressCard from '@/components/shared/payment-progress-card';

import { usePageHeaderAction, usePageTitle } from '@/hooks/use-page-header';
import { useDelete, useGet } from '@/hooks/use-services';

import { TRANSACTION_TYPES } from '@/libs/constants';

import { formatCurrency, joinClassnames } from '@/utils/commons';

import EditIcon from '@/assets/icons/edit.svg?react';
import PaymentIcon from '@/assets/icons/payment.svg?react';
import TrashIcon from '@/assets/icons/trash.svg?react';

const TransactionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data: transaction } = useGet(`/transaction/${id}`) as {
    data: ITransactionDetail;
  };
  const { handleDelete, loadingDelete } = useDelete(`/transaction/${id}`, {
    onSuccess: () => {
      navigate('/');
    },
  });

  const isDebt = transaction?.type === TRANSACTION_TYPES.DEBT;
  const typeLabel = isDebt ? 'Hutang' : 'Piutang';

  usePageTitle('Detail Transaksi');
  usePageHeaderAction(() => setActionDrawerOpen(true));

  const navigateToPaymentForm = (payment?: IPayment) => {
    if (payment) {
      navigate(`/form/transaction/${id}/payment/${payment.id}/edit`, {
        state: { remaining: transaction?.remaining ?? 0 },
      });
    } else {
      navigate(`/form/transaction/${id}/payment`, {
        state: { remaining: transaction?.remaining ?? 0 },
      });
    }
  };

  const actionItems = [
    {
      icon: <EditIcon className="w-5 h-5" />,
      label: `Edit ${typeLabel}`,
      onClick: () => {
        setActionDrawerOpen(false);
        navigate(`/form/transaction/${id}/edit`);
      },
    },
    {
      icon: <PaymentIcon className="w-5 h-5" />,
      label: 'Tambah Pembayaran',
      onClick: () => {
        setActionDrawerOpen(false);
        navigateToPaymentForm();
      },
    },
    {
      icon: <TrashIcon className="w-5 h-5" />,
      label: `Hapus ${typeLabel}`,
      danger: true,
      onClick: () => {
        setActionDrawerOpen(false);
        setConfirmDeleteOpen(true);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <section className="relative overflow-hidden flex flex-col rounded-[22px] bg-linear-to-br from-primary to-primary-300/90 border border-primary/50 p-5 shadow-md shadow-primary/10">
          <div className="absolute -top-12 -right-10 w-40 h-40 rounded-full blur-2xl pointer-events-none bg-white/20"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-xl pointer-events-none bg-black/10"></div>

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar
                  src={transaction?.contact?.avatar}
                  name={transaction?.contact?.name ?? ''}
                  size="default"
                />
                <div className="flex-1">
                  <h4 className="typo-body-md font-bold! text-shades-white">
                    {transaction?.contact?.name}
                  </h4>
                  <p className="typo-caption-sm text-shades-white/75">
                    Tanggal Transaksi:{' '}
                    <span className="font-semibold!">
                      {transaction?.date
                        ? dayjs(transaction.date).format('DD MMM YYYY')
                        : '-'}
                    </span>
                  </p>
                </div>
              </div>
              <Badge variant={isDebt ? 'debt' : 'receivable'} size="sm" />
            </div>
            {transaction?.note && (
              <p className="typo-caption-md text-shades-white/90">
                {transaction.note}
              </p>
            )}
          </div>
        </section>

        <PaymentProgressCard
          data={{
            total_amount: transaction?.amount ?? 0,
            total_paid: transaction?.total_paid ?? 0,
            remaining: transaction?.remaining ?? 0,
            percentage: transaction?.percentage ?? 0,
            payment_count: transaction?.payments?.length ?? 0,
            transaction_count: 1,
            is_paid: transaction?.status === 'PAID',
            has_data: true,
          }}
          isDebt={isDebt}
          onPaymentClick={
            transaction?.status === 'ACTIVE'
              ? () => navigateToPaymentForm()
              : undefined
          }
          paymentCountLabelOnly
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="typo-headline-md font-bold! text-neutral-2">
          Riwayat Pembayaran
        </h2>
        {transaction?.payments?.length ? (
          <List
            data={transaction.payments}
            renderItem={(item: IPayment) => (
              <List.Item
                key={item.id}
                onClick={() => navigateToPaymentForm(item)}
              >
                <div className="flex flex-col">
                  <h4 className="typo-body-md font-semibold! text-neutral-2">
                    {dayjs(item.date).format('DD MMMM YYYY')}
                  </h4>
                  {item.note && (
                    <span className="typo-caption-sm text-neutral-3">
                      {item.note}
                    </span>
                  )}
                </div>
                {formatCurrency(item.amount)}
              </List.Item>
            )}
          />
        ) : (
          <Empty
            variant="TRANSACTION"
            customMessage={
              <>
                <span className="text-primary font-semibold!">Pembayaran</span>{' '}
                masih kosong nih
              </>
            }
            showButton={transaction?.status === 'ACTIVE'}
            buttonLabel="Tambah Pembayaran"
            onButtonClick={() => navigateToPaymentForm()}
          />
        )}
      </section>

      <BottomDrawer
        isOpen={actionDrawerOpen}
        onClose={() => setActionDrawerOpen(false)}
      >
        <div className="flex flex-col">
          {actionItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className={joinClassnames([
                'flex items-center gap-4 py-3.5 cursor-pointer transition-opacity hover:opacity-70',
                item.danger ? 'text-danger' : 'text-neutral-2',
              ])}
            >
              {item.icon}
              <span className="typo-body-md font-medium!">{item.label}</span>
            </button>
          ))}
        </div>
      </BottomDrawer>

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => handleDelete()}
        title={`Yakin ingin menghapus ${typeLabel.toLowerCase()} ini?`}
        message="Semua data pembayaran yang terkait juga akan ikut terhapus."
        confirmLabel="Ya, Hapus"
        loading={loadingDelete}
      />
    </div>
  );
};

export default TransactionDetailPage;
