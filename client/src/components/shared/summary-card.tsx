import type {
  ReactNodeMap,
  StringMap,
  SummaryCardVariant,
} from '@/types/commons';
import type { ISummary } from '@/types/services';

import { TRANSACTION_TYPES } from '@/libs/constants';

import { isMinusNumber, isZeroNumber, joinClassnames } from '@/utils/commons';

import CurrentSaldoIcon from '@/assets/icons/current-saldo.svg?react';
import DebtIcon from '@/assets/icons/debt.svg?react';
import PotentialSaldoIcon from '@/assets/icons/potential-saldo.svg?react';
import ReceivableDebtIcon from '@/assets/icons/receivable-debt.svg?react';
import ReceivableIcon from '@/assets/icons/receivable.svg?react';

import { AvatarGroup } from './avatar';

interface IProps {
  variant: SummaryCardVariant;
  data: ISummary;
  withShadow?: boolean;
  withColorValue?: boolean;
  className?: string;
}

const SummaryCard = ({
  variant,
  data,
  withShadow,
  withColorValue,
  className,
}: IProps) => {
  const wrapperClassnames: StringMap = {
    POTENTIAL: 'bg-primary text-shades-white',
    CURRENT: 'bg-primary-50 text-neutral-2',
    RECEIVABLE_DEBT: 'bg-primary-50 text-neutral-2',
    DEBT: 'bg-danger text-shades-white',
    RECEIVABLE: 'bg-warning text-shades-white',
  };

  const renderedIcons: ReactNodeMap = {
    POTENTIAL: <PotentialSaldoIcon />,
    CURRENT: <CurrentSaldoIcon />,
    RECEIVABLE_DEBT: <ReceivableDebtIcon />,
    DEBT: <DebtIcon />,
    RECEIVABLE: <ReceivableIcon />,
  };

  const renderedLabel: StringMap = {
    POTENTIAL: 'Saldo Potential',
    CURRENT: 'Saldo Saat Ini',
    RECEIVABLE_DEBT: 'Piutang - Hutang',
    DEBT: 'Total Hutang',
    RECEIVABLE: 'Total Piutang',
  };

  return (
    <div
      className={joinClassnames([
        'p-3 rounded-[18px] flex flex-col gap-2.5 hover:scale-105 transition hover:shadow-primary-4',
        wrapperClassnames[variant],
        withShadow ? 'shadow-primary-3' : '',
        className,
      ])}
    >
      <div>
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
              ? isMinusNumber(data?.nominal ?? 0)
                ? 'text-danger'
                : isZeroNumber(data?.nominal ?? 0)
                  ? ''
                  : 'text-success'
              : '',
          ])}
        >
          {isMinusNumber(data?.nominal ?? 0) ? '-' : ''}Rp
          {Math.abs(data?.nominal ?? 0)?.toLocaleString()}
        </h3>
      </div>
      {variant === TRANSACTION_TYPES.DEBT ||
      variant === TRANSACTION_TYPES.RECEIVABLE
        ? data?.recent_contacts && (
            <div>
              <AvatarGroup data={data.recent_contacts} />
            </div>
          )
        : null}
    </div>
  );
};

export default SummaryCard;
