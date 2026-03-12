import type { ReactNode } from 'react';

import type {
  ReactNodeMap,
  StringMap,
  SummaryCardVariants,
  TransactionType,
} from '@/types/commons';
import type { ISummary } from '@/types/services';

import { SUMMARY_CARD_VARIANTS, TRANSACTION_TYPES } from '@/libs/constants';

import { isMinusNumber, isZeroNumber, joinClassnames } from '@/utils/commons';

import CurrentSaldoIcon from '@/assets/icons/current-saldo.svg?react';
import DebtIcon from '@/assets/icons/debt.svg?react';
import PotentialSaldoIcon from '@/assets/icons/potential-saldo.svg?react';
import ReceivableDebtIcon from '@/assets/icons/receivable-debt.svg?react';
import ReceivableIcon from '@/assets/icons/receivable.svg?react';

import Avatar, { AvatarGroup } from './avatar';

interface IContactInfo {
  name: string;
  avatar?: string | null;
  description?: string;
  status?: TransactionType;
}

interface IProps {
  variant: SummaryCardVariants;
  data: ISummary;
  withShadow?: boolean;
  withColorValue?: boolean;
  className?: string;
  centered?: boolean;
  titleClassName?: string;
  withoutRecentContacts?: boolean;
  contactInfo?: IContactInfo;
  hideNominal?: boolean;
  statusBadge?: ReactNode;
}

const SummaryCard = ({
  variant,
  data,
  withShadow,
  withColorValue,
  className,
  centered,
  titleClassName,
  withoutRecentContacts,
  contactInfo,
  hideNominal,
  statusBadge,
}: IProps) => {
  const wrapperClassnames: StringMap = {
    POTENTIAL: 'bg-primary text-shades-white',
    CURRENT: 'bg-primary-50 text-neutral-2',
    RECEIVABLE_DEBT: 'bg-primary-50 text-neutral-2',
    CONTACT_DETAIL: 'bg-primary-50 text-neutral-2',
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

  const isContactDetail = variant === SUMMARY_CARD_VARIANTS.CONTACT_DETAIL;

  const resolvedIcon: ReactNode = isContactDetail
    ? contactInfo?.status === TRANSACTION_TYPES.DEBT
      ? renderedIcons[TRANSACTION_TYPES.DEBT]
      : renderedIcons[TRANSACTION_TYPES.RECEIVABLE]
    : renderedIcons[variant];

  const resolvedLabel: string = isContactDetail
    ? contactInfo?.status === TRANSACTION_TYPES.DEBT
      ? 'Sisa Hutang'
      : 'Sisa Piutang'
    : renderedLabel[variant];

  return (
    <div
      className={joinClassnames([
        'p-3 rounded-[18px] flex flex-col gap-2.5 hover:scale-105 transition hover:shadow-primary-4',
        wrapperClassnames[variant],
        withShadow ? 'shadow-primary-3' : '',
        className,
      ])}
    >
      {isContactDetail && contactInfo ? (
        <div className="flex items-center gap-3">
          <Avatar
            src={contactInfo.avatar}
            name={contactInfo.name}
            size="default"
          />
          <div className="text-neutral-2">
            <h4 className="typo-body-md font-semibold!">{contactInfo.name}</h4>
            {contactInfo.description && (
              <p className="typo-caption-sm text-neutral-3">
                {contactInfo.description}
              </p>
            )}
          </div>
        </div>
      ) : null}
      {!hideNominal && (
        <div
          className={joinClassnames([
            'flex flex-col',
            centered ? 'justify-center items-center' : 'items-start',
          ])}
        >
          <div className="flex items-center gap-1">
            <div className="*:w-3.5 *:h-3.5">{resolvedIcon}</div>
            <label className="typo-body-md font-normal!">{resolvedLabel}</label>
          </div>
          <h3
            className={joinClassnames([
              'typo-headline-md font-bold!',
              withColorValue
                ? isMinusNumber(data?.nominal ?? 0) ||
                  contactInfo?.status === TRANSACTION_TYPES.DEBT
                  ? 'text-danger'
                  : isZeroNumber(data?.nominal ?? 0)
                    ? ''
                    : 'text-success'
                : '',
              titleClassName,
            ])}
          >
            {isMinusNumber(data?.nominal ?? 0) ||
            contactInfo?.status === TRANSACTION_TYPES.DEBT
              ? '-'
              : ''}
            Rp
            {Math.abs(data?.nominal ?? 0)?.toLocaleString()}
          </h3>
        </div>
      )}
      {hideNominal && statusBadge && (
        <div
          className={joinClassnames([
            'flex',
            centered ? 'justify-center' : 'justify-start',
          ])}
        >
          {statusBadge}
        </div>
      )}
      {!withoutRecentContacts &&
      (variant === TRANSACTION_TYPES.DEBT ||
        variant === TRANSACTION_TYPES.RECEIVABLE)
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
