import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import dayjs from 'dayjs';

import type { IContactDetail, ITransaction } from '@/types/services';

import BottomDrawer from '@/components/shared/bottom-drawer';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import Empty from '@/components/shared/empty';
import FloatButton from '@/components/shared/float-button';
import List from '@/components/shared/list';
import { PaymentProgress } from '@/components/shared/payment-progress-card';
import SummaryCard from '@/components/shared/summary-card';
import Switch from '@/components/shared/switch';

import { usePageHeaderAction, usePageTitle } from '@/hooks/use-page-header';
import { useDelete, useGet } from '@/hooks/use-services';
import { useGlobalFilter } from '@/hooks/use-global-filter';

import {
  EMPTY_STATE_VARIANTS,
  SUMMARY_CARD_VARIANTS,
  TRANSACTION_TYPES,
} from '@/libs/constants';

import { joinClassnames } from '@/utils/commons';

import EditIcon from '@/assets/icons/edit.svg?react';
import TrashIcon from '@/assets/icons/trash.svg?react';

const ContactDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hidePaid } = useGlobalFilter();

  const [localHidePaid, setLocalHidePaid] = useState(hidePaid);
  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data: contact } = useGet(`/contact/${id}`, {
    status: localHidePaid ? 'ACTIVE' : undefined,
  }) as {
    data: IContactDetail;
  };
  const { handleDelete, loadingDelete } = useDelete(`/contact/${id}`, {
    onSuccess: () => {
      navigate('/contact');
    },
  });

  usePageTitle('Detail Kontak');
  usePageHeaderAction(() => setActionDrawerOpen(true));

  const hasTransactions = !!contact?.transactions?.length;
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

      {contact && (
        <PaymentProgress
          debtProgress={contact.debt_progress}
          receivableProgress={contact.receivable_progress}
        />
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="typo-headline-md font-bold! text-neutral-2">
            List Hutang / Piutang
          </h2>
          {hasTransactions && (
            <Switch
              label="Sembunyikan Transaksi Lunas"
              checked={localHidePaid}
              onCheckedChange={setLocalHidePaid}
            />
          )}
        </div>
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
              <List.Item
                key={item.id}
                variant={item.type}
                withProgress
                percentage={item.percentage}
                onClick={() => navigate(`/transaction/${item.id}`)}
              >
                <List.Item.Meta
                  title={dayjs(item.date).format('DD MMMM YYYY')}
                  description={
                    item.last_payment &&
                    `Pembayaran terakhir: ${dayjs(item.last_payment).format('DD MMM YYYY')}`
                  }
                />
                <List.Item.TransactionNominal
                  status={item.status}
                  type={item.type}
                  amount={item.amount}
                  remaining={item.remaining}
                  totalPaid={item.total_paid}
                />
              </List.Item>
            )}
          />
        )}
      </section>

      <FloatButton onClick={handleNavigateTransaction} withBottomNav={false} />

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
