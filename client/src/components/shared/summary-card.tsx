import type { ReactNodeMap, StringMap } from '@/types/commons';

import { isMinusNumber, isZeroNumber, joinClassnames } from '@/utils/commons';

import CurrentSaldoIcon from '@/assets/icons/current-saldo.svg?react';
import DebtIcon from '@/assets/icons/debt.svg?react';
import PotentialSaldoIcon from '@/assets/icons/potential-saldo.svg?react';
import ReceivableDebtIcon from '@/assets/icons/receivable-debt.svg?react';
import ReceivableIcon from '@/assets/icons/receivable.svg?react';

interface IProps {
  variant: 'potential' | 'current' | 'receivable-debt' | 'debt' | 'receivable';
  value: number;
  withShadow?: boolean;
  withColorValue?: boolean;
  className?: string;
}

const SummaryCard = ({
  variant,
  value,
  withShadow,
  withColorValue,
  className,
}: IProps) => {
  const wrapperClassnames: StringMap = {
    potential: 'bg-primary text-shades-white',
    current: 'bg-primary-50 text-neutral-2',
    'receivable-debt': 'bg-primary-50 text-neutral-2',
    debt: 'bg-danger text-shades-white',
    receivable: 'bg-warning text-shades-white',
  };

  const renderedIcons: ReactNodeMap = {
    potential: <PotentialSaldoIcon />,
    current: <CurrentSaldoIcon />,
    'receivable-debt': <ReceivableDebtIcon />,
    debt: <DebtIcon />,
    receivable: <ReceivableIcon />,
  };

  const renderedLabel: StringMap = {
    potential: 'Saldo Potential',
    current: 'Saldo Saat Ini',
    'receivable-debt': 'Piutang - Hutang',
    debt: 'Total Hutang',
    receivable: 'Total Piutang',
  };

  return (
    <div
      className={joinClassnames([
        'p-3 rounded-[18px]',
        wrapperClassnames[variant],
        withShadow ? 'shadow-primary-3' : '',
        className,
      ])}
    >
      <div className="flex items-center gap-1">
        <div className="*:w-3.5 *:h-3.5">{renderedIcons[variant]}</div>
        <label className="typo-body-md font-normal!">
          {renderedLabel[variant]}
        </label>
      </div>
      <h3
        className={joinClassnames([
          'typo-headline-md font-bold!',
          withColorValue
            ? isMinusNumber(value)
              ? 'text-danger'
              : isZeroNumber(value)
                ? ''
                : 'text-success'
            : '',
        ])}
      >
        {isMinusNumber(value) ? '-' : ''}Rp{Math.abs(value)?.toLocaleString()}
      </h3>
    </div>
  );
};

export default SummaryCard;
