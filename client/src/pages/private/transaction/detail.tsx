import { useNavigate, useParams } from 'react-router';

import type { IPayment, ITransactionDetail } from '@/types/services';
import dayjs from 'dayjs';

import Avatar from '@/components/shared/avatar';
import Empty from '@/components/shared/empty';
import List from '@/components/shared/list';
import PaymentProgressCard from '@/components/shared/payment-progress-card';

import { useGet } from '@/hooks/use-services';

import { TRANSACTION_TYPES } from '@/libs/constants';

import { formatCurrency, joinClassnames } from '@/utils/commons';

import DebtIcon from '@/assets/icons/debt.svg?react';
import ReceivableIcon from '@/assets/icons/receivable.svg?react';

const TransactionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: transaction } = useGet(`/transaction/${id}`) as {
    data: ITransactionDetail;
  };

  const isDebt = transaction?.type === TRANSACTION_TYPES.DEBT;
  const typeLabel = isDebt ? 'Hutang' : 'Piutang';
  const remainLabel = isDebt ? 'Sisa Hutang' : 'Sisa Piutang';

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <section className="flex flex-col gap-4 rounded-[18px] bg-primary p-4 shadow-primary-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar
                src={transaction?.contact?.avatar}
                name={transaction?.contact?.name ?? ''}
                size="default"
              />
              <div className="flex-1">
                <h4 className="typo-body-md font-semibold! text-shades-white">
                  {transaction?.contact?.name}
                </h4>
                <p className="typo-caption-sm text-shades-white/60">
                  {transaction?.date
                    ? dayjs(transaction.date).format('DD MMM YYYY')
                    : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-shades-white/15">
              <div className="*:w-3.5 *:h-3.5 text-white">
                {isDebt ? <DebtIcon /> : <ReceivableIcon />}
              </div>
              <span className="typo-caption-sm font-semibold! text-shades-white">
                {typeLabel}
              </span>
            </div>
          </div>
          {transaction?.note && (
            <p className="typo-caption-md text-shades-white/60">
              {transaction.note}
            </p>
          )}
        </section>

        <PaymentProgressCard
          label={remainLabel}
          remaining={transaction?.remaining ?? 0}
          totalPaid={transaction?.total_paid ?? 0}
          amount={transaction?.amount ?? 0}
          percentage={transaction?.percentage ?? 0}
          paymentCount={transaction?.payments?.length ?? 0}
          isDebt={isDebt}
          onEdit={
            transaction?.status === 'ACTIVE'
              ? () => navigate(`/form/transaction/${id}/payment`)
              : undefined
          }
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
              <List.Item key={item.id} variant={transaction.type}>
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
            onButtonClick={() => navigate(`/form/transaction/${id}/payment`)}
          />
        )}
      </section>
    </div>
  );
};

export default TransactionDetailPage;
