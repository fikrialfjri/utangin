import { useEffect, useState } from 'react';

import { formatCurrency, joinClassnames } from '@/utils/commons';

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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <div className="flex flex-col items-center">
        {isPaid ? (
          <div className="flex items-center gap-1.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" className="fill-success" />
              <path
                d="M7 12.5L10.5 16L17 9"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
              totalPaid > 0 ? 'text-success' : 'text-neutral-3',
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
