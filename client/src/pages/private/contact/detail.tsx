import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import dayjs from 'dayjs';

import type { IContactDetail, ITransaction } from '@/types/services';

import BottomDrawer from '@/components/shared/bottom-drawer';
import Badge from '@/components/shared/badge';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import Empty from '@/components/shared/empty';
import FloatButton from '@/components/shared/float-button';
import List from '@/components/shared/list';
import PaymentProgressCard from '@/components/shared/payment-progress-card';
import SummaryCard from '@/components/shared/summary-card';

import { usePageHeaderAction, usePageTitle } from '@/hooks/use-page-header';
import { useDelete, useGet } from '@/hooks/use-services';

import {
  EMPTY_STATE_VARIANTS,
  SUMMARY_CARD_VARIANTS,
  TRANSACTION_TYPES,
} from '@/libs/constants';

import { formatCurrency, joinClassnames } from '@/utils/commons';

import EditIcon from '@/assets/icons/edit.svg?react';
import TrashIcon from '@/assets/icons/trash.svg?react';

const ContactDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data: contact } = useGet(`/contact/${id}`) as {
    data: IContactDetail;
  };
  const { handleDelete, loadingDelete } = useDelete(`/contact/${id}`, {
    onSuccess: () => {
      navigate('/contact');
    },
  });

  usePageTitle('Detail Kontak');
  usePageHeaderAction(() => setActionDrawerOpen(true));

  const hasTransactions = !!(contact?.transactions?.length);
  const isLunas = hasTransactions && !contact?.has_active_transactions;
  const statusLabel =
    contact?.status === TRANSACTION_TYPES.DEBT ? 'Hutang' : 'Piutang';

  const getContactDescription = () => {
    if (contact?.last_payment)
      return `Pembayaran terakhir: ${dayjs(contact.last_payment).format('DD MMM YYYY')} (${statusLabel})`;
    if (hasTransactions) return 'Belum ada pembayaran';
    return undefined;
  };

  const handleNavigateTransaction = () => {
    navigate({
      pathname: '/form/transaction/create',
      search: `contact_id=${id}`,
    });
  };

  const actionItems = [
    {
      icon: <EditIcon className="w-5 h-5" />,
      label: 'Edit Kontak',
      onClick: () => {
        setActionDrawerOpen(false);
        navigate(`/form/contact/${id}/edit`);
      },
    },
    {
      icon: <TrashIcon className="w-5 h-5" />,
      label: 'Hapus Kontak',
      danger: true,
      onClick: () => {
        setActionDrawerOpen(false);
        setConfirmDeleteOpen(true);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SummaryCard
        variant={SUMMARY_CARD_VARIANTS.CONTACT_DETAIL}
        data={{ nominal: contact?.net_total ?? 0 }}
        withColorValue={hasTransactions && !isLunas}
        centered
        withShadow
        titleClassName="typo-title-sm font-bold!"
        hideNominal
        contactInfo={{
          name: contact?.name ?? '',
          avatar: contact?.avatar,
          status: contact?.status,
          description: getContactDescription(),
        }}
      />

      {hasTransactions && (
        <PaymentProgressCard
          label={statusLabel ? `Sisa ${statusLabel}` : 'Sisa Keseluruhan'}
          remaining={contact.remaining ?? 0}
          totalPaid={contact.total_paid ?? 0}
          amount={contact.total_amount ?? 0}
          percentage={contact.percentage ?? 0}
          paymentCount={contact.payment_count ?? 0}
          transactionCount={contact.transaction_count ?? 0}
          isDebt={contact.status === TRANSACTION_TYPES.DEBT}
          isPaid={isLunas}
        />
      )}

      <section className="flex flex-col gap-3">
        <h2 className="typo-headline-md font-bold! text-neutral-2">
          List Hutang / Piutang
        </h2>
        {!hasTransactions ? (
          <Empty
            variant={EMPTY_STATE_VARIANTS.DEBT_RECEIVABLE}
            showButton
            buttonLabel="Tambah Transaksi"
            onButtonClick={handleNavigateTransaction}
          />
        ) : (
          <List
            data={contact.transactions}
            renderItem={(item: ITransaction) => (
              <div
                key={item.id}
                className="cursor-pointer"
                onClick={() => navigate(`/transaction/${item.id}`)}
              >
                <List.Item variant={item.type}>
                  <div className="flex flex-col">
                    <h4 className="typo-body-md font-semibold! text-neutral-2">
                      {dayjs(item.date).format('DD MMMM YYYY')}
                    </h4>
                    <span className="typo-caption-sm text-neutral-3">
                      {item.last_payment
                        ? `Pembayaran terakhir: ${dayjs(item.last_payment).format('DD MMM YYYY')}`
                        : 'Belum ada pembayaran'}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span
                      className={
                        item.status === 'PAID'
                          ? 'line-through text-neutral-3'
                          : ''
                      }
                    >
                      {formatCurrency(item.amount)}
                    </span>
                    {item.status === 'PAID' && (
                      <Badge variant="success">Lunas</Badge>
                    )}
                  </div>
                </List.Item>
              </div>
            )}
          />
        )}
      </section>

      <FloatButton onClick={handleNavigateTransaction} withBottomNav={false} />

      {/* Action Drawer */}
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
        title="Yakin ingin menghapus kontak ini?"
        message="Semua data transaksi dan pembayaran yang terkait juga akan ikut terhapus."
        confirmLabel="Ya, Hapus"
        loading={loadingDelete}
      />
    </div>
  );
};

export default ContactDetailPage;
