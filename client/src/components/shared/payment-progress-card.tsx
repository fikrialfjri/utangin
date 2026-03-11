import { useEffect, useState } from 'react';

import { formatCurrency, joinClassnames } from '@/utils/commons';

import CheckCircleIcon from '@/assets/icons/check-circle.svg?react';
import PaymentIcon from '@/assets/icons/payment.svg?react';

interface PaymentProgressCardProps {
  label: string;
  remaining: number;
  totalPaid: number;
  amount: number;
  percentage: number;
  paymentCount: number;
  isDebt?: boolean;
  isPaid?: boolean;
  onEdit?: () => void;
}

const PaymentProgressCard = ({
  label,
  remaining,
  totalPaid,
  amount,
  percentage,
  paymentCount,
  isDebt = true,
  isPaid = false,
  onEdit,
}: PaymentProgressCardProps) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(Math.min(percentage, 100));
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  const remainColor = isPaid
    ? 'text-success'
    : isDebt
      ? 'text-danger'
      : 'text-warning';

  return (
    <div className="relative flex flex-col gap-4 rounded-[18px] bg-primary-50 p-4 shadow-primary-3">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute top-4 right-4 flex items-center justify-center rounded-full p-1 cursor-pointer transition-opacity hover:opacity-70"
        >
          <PaymentIcon className="w-6 h-6 text-primary" />
        </button>
      )}
      <div className="flex flex-col items-center">
        {isPaid ? (
          <div className="flex items-center gap-1.5">
            <CheckCircleIcon className="w-[18px] h-[18px] text-success" />
            <span className="typo-body-md font-semibold! text-success">
              Lunas
            </span>
          </div>
        ) : (
          <span className="typo-caption-md text-neutral-3">{label}</span>
        )}
        {!isPaid && (
          <h3
            className={joinClassnames([
              'typo-title-md font-bold!',
              remainColor,
            ])}
          >
            {formatCurrency(remaining)}
          </h3>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-1">
          <h4
            className={joinClassnames([
              'typo-headline-lg font-bold! leading-none!',
              totalPaid > 0 ? 'text-primary' : 'text-neutral-3',
            ])}
          >
            {formatCurrency(totalPaid)}
          </h4>
          <span className="typo-caption-md font-medium! text-neutral-3">/</span>
          <h5 className="typo-caption-md font-medium! text-neutral-3">
            {formatCurrency(amount)}
          </h5>
        </div>
        <span className="typo-caption-md text-neutral-3">
          {paymentCount} pembayaran
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-neutral-5 overflow-hidden">
        <div
          className={joinClassnames([
            'h-full rounded-full transition-all duration-700 ease-out',
            isPaid ? 'bg-success' : 'bg-primary',
          ])}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  );
};

export default PaymentProgressCard;
