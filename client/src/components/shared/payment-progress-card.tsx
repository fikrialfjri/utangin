import { useEffect, useState } from 'react';

import type { ITransactionProgress } from '@/types/services';

import Badge from '@/components/shared/badge';

import { formatCurrency, joinClassnames } from '@/utils/commons';

import CheckCircleIcon from '@/assets/icons/check-circle.svg?react';
import PaymentIcon from '@/assets/icons/payment.svg?react';

interface PaymentProgressCardProps {
  data: ITransactionProgress;
  isDebt: boolean;
  compact?: boolean;
  badgePosition?: 'absolute' | 'inline' | 'none';
  className?: string;
  paymentCountLabelOnly?: boolean;
  onPaymentClick?: () => void;
}

const PaymentProgressCard = ({
  data,
  isDebt,
  compact = false,
  badgePosition = 'none',
  className,
  paymentCountLabelOnly = false,
  onPaymentClick,
}: PaymentProgressCardProps) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(Math.min(data.percentage, 100));
    }, 100);

    return () => clearTimeout(timer);
  }, [data.percentage]);

  const remainColor = data.is_paid
    ? 'text-success'
    : isDebt
      ? 'text-danger'
      : 'text-warning';

  const badgeNode = (
    <Badge variant={isDebt ? 'debt' : 'receivable'} size="sm" />
  );

  const remainingContent = data.is_paid ? (
    <div className="flex items-center gap-1.5">
      <CheckCircleIcon className="w-[18px] h-[18px] text-success" />
      <span className="typo-body-md font-semibold! text-success">Lunas</span>
    </div>
  ) : (
    <h3
      className={joinClassnames([
        compact ? 'typo-headline-md font-bold!' : 'typo-title-md font-bold!',
        remainColor,
      ])}
    >
      {formatCurrency(data.remaining)}
    </h3>
  );

  return (
    <div
      className={joinClassnames([
        'relative overflow-hidden flex flex-col gap-3.5 rounded-[22px] p-5 shadow-sm border transition-shadow hover:shadow-md',
        'bg-linear-to-br from-primary-50 to-shades-white border-primary/50',
        className,
      ])}
    >
      <div className="absolute -top-12 -right-8 w-40 h-40 rounded-full blur-[28px] pointer-events-none transition-colors bg-primary/10"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-xl pointer-events-none bg-primary/5"></div>

      <div className="relative z-10 flex flex-col gap-3">
        {onPaymentClick && (
          <button
            type="button"
            onClick={onPaymentClick}
            className="absolute top-0 right-0 flex items-center justify-center rounded-full p-1 cursor-pointer transition-opacity hover:opacity-70"
          >
            <PaymentIcon className="w-6 h-6 text-primary" />
          </button>
        )}

        {badgePosition === 'absolute' && (
          <div className="absolute top-0 right-0">{badgeNode}</div>
        )}

        {badgePosition === 'inline' ? (
          <div className="flex items-center justify-between">
            {remainingContent}
            {badgeNode}
          </div>
        ) : (
          <div
            className={joinClassnames([
              compact ? undefined : 'flex flex-col items-center',
            ])}
          >
            {remainingContent}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between text-neutral-3">
            <div className="flex items-end gap-1">
              <h4
                className={joinClassnames([
                  compact
                    ? 'typo-body-md font-bold!'
                    : 'typo-headline-lg font-bold!',
                  data.total_paid > 0 ? 'text-primary' : 'text-neutral-3',
                ])}
              >
                {formatCurrency(data.total_paid)}
              </h4>
              <span
                className={joinClassnames([
                  compact ? 'typo-caption-sm' : 'typo-caption-md',
                ])}
              >
                /
              </span>
              <h5
                className={joinClassnames([
                  compact
                    ? 'typo-caption-sm'
                    : 'typo-caption-md tracking-tight',
                ])}
              >
                {formatCurrency(data.total_amount)}
              </h5>
            </div>

            {paymentCountLabelOnly && (
              <span
                className={joinClassnames([
                  compact ? 'typo-caption-sm' : 'typo-caption-md',
                ])}
              >
                {data.payment_count} pembayaran
              </span>
            )}
          </div>

          <div className="h-2 w-full rounded-full bg-white border border-neutral-6/50 overflow-hidden shadow-inner">
            <div
              className={joinClassnames([
                'h-full rounded-full transition-all duration-700 ease-out',
                data.is_paid
                  ? 'bg-success'
                  : 'bg-linear-to-r from-primary-300 to-primary shadow-sm',
              ])}
              style={{ width: `${animatedWidth}%` }}
            />
          </div>

          {!paymentCountLabelOnly && (
            <div className="flex items-center justify-between text-neutral-3">
              <span
                className={joinClassnames([
                  compact ? 'typo-caption-sm' : 'typo-caption-md',
                ])}
              >
                {data.transaction_count} transaksi
              </span>
              <span
                className={joinClassnames([
                  compact ? 'typo-caption-sm' : 'typo-caption-md',
                ])}
              >
                {data.payment_count} pembayaran
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PaymentProgressProps {
  debtProgress: ITransactionProgress;
  receivableProgress: ITransactionProgress;
  paymentCountLabelOnly?: boolean;
}

const PaymentProgress = ({
  debtProgress,
  receivableProgress,
  paymentCountLabelOnly = false,
}: PaymentProgressProps) => {
  const showDebt = debtProgress.has_data;
  const showReceivable = receivableProgress.has_data;

  if (!showDebt && !showReceivable) return null;

  const isSingle = showDebt !== showReceivable;
  const badgePosition = isSingle ? 'absolute' : 'inline';
  const compact = !isSingle;

  return (
    <div className="flex gap-3">
      {showDebt && (
        <PaymentProgressCard
          data={debtProgress}
          isDebt
          compact={compact}
          badgePosition={badgePosition}
          className="flex-1"
          paymentCountLabelOnly={paymentCountLabelOnly}
        />
      )}
      {showReceivable && (
        <PaymentProgressCard
          data={receivableProgress}
          isDebt={false}
          compact={compact}
          badgePosition={badgePosition}
          className="flex-1"
          paymentCountLabelOnly={paymentCountLabelOnly}
        />
      )}
    </div>
  );
};

export { PaymentProgress };
export default PaymentProgressCard;
