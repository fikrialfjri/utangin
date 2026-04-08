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
    POTENTIAL:
      'bg-linear-to-br from-primary to-primary-300 text-shades-white border-primary/50',
    CURRENT:
      'bg-linear-to-br from-primary-50 to-shades-white text-neutral-2 border-primary/50',
    RECEIVABLE_DEBT:
      'bg-linear-to-br from-primary-50 to-shades-white text-neutral-2 border-primary/50',
    CONTACT_DETAIL:
      'bg-linear-to-br from-primary-50 to-shades-white text-neutral-2 border-primary/50',
    DEBT: 'bg-linear-to-br from-danger to-danger-100 text-shades-white border-danger/50',
    RECEIVABLE:
      'bg-linear-to-br from-warning to-warning-100 text-shades-white border-warning/50',
  };

  const wrapperBgAccents1: StringMap = {
    POTENTIAL: 'bg-white/20',
    CURRENT: 'bg-primary/10',
    RECEIVABLE_DEBT: 'bg-primary/10',
    CONTACT_DETAIL: 'bg-primary/10',
    DEBT: 'bg-danger/75',
    RECEIVABLE: 'bg-warning/75',
  };

  const wrapperBgAccents2: StringMap = {
    POTENTIAL: 'bg-primary/10',
    CURRENT: 'bg-primary/5',
    RECEIVABLE_DEBT: 'bg-primary/5',
    CONTACT_DETAIL: 'bg-primary/5',
    DEBT: 'bg-danger/75',
    RECEIVABLE: 'bg-warning/75',
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
        'relative overflow-hidden p-3 rounded-[22px] transition-all hover:scale-[1.01] hover:shadow-lg border',
        wrapperClassnames[variant],
        withShadow ? 'shadow-md shadow-primary/10' : 'shadow-sm',
        className,
      ])}
    >
      <div
        className={joinClassnames([
          'absolute -top-12 -left-6 w-40 h-40 rounded-full blur-2xl pointer-events-none transition-colors',
          wrapperBgAccents1[variant],
        ])}
      ></div>
      <div
        className={joinClassnames([
          'absolute -bottom-10 -right-6 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-colors',
          wrapperBgAccents2[variant],
        ])}
      ></div>

      <div className="relative z-10 flex flex-col gap-2.5">
        {isContactDetail && contactInfo ? (
          <div className="flex items-center gap-3">
            <Avatar
              src={contactInfo.avatar}
              name={contactInfo.name}
              size="default"
            />
            <div className="text-neutral-2">
              <h4 className="typo-body-md font-semibold!">
                {contactInfo.name}
              </h4>
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
            <div className="flex items-center gap-1.5 opacity-90">
              <div className="*:w-4 *:h-4">{resolvedIcon}</div>
              <label className="typo-body-md font-normal!">
                {resolvedLabel}
              </label>
            </div>
            <h3
              className={joinClassnames([
                'typo-headline-md font-bold! tracking-tight mt-0.5',
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
    </div>
  );
};

export default SummaryCard;
