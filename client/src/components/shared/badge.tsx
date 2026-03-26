import { joinClassnames } from '@/utils/commons';

import DebtIcon from '@/assets/icons/debt.svg?react';
import ReceivableIcon from '@/assets/icons/receivable.svg?react';

interface BadgeProps {
  variant?:
    | 'success'
    | 'danger'
    | 'warning'
    | 'neutral'
    | 'debt'
    | 'receivable';
  size?: 'sm' | 'md' | 'lg' | 'xs';
  children?: React.ReactNode;
  className?: string;
}

const badgeVariants: Record<string, string> = {
  success: 'text-success bg-success-50 border border-success',
  danger: 'text-danger bg-danger-50 border border-danger',
  warning: 'text-warning bg-warning-50 border border-warning',
  neutral: 'text-neutral-4 bg-neutral-6 border border-neutral-4',
  debt: 'text-danger bg-danger-50 border border-danger',
  receivable: 'text-warning bg-warning-50 border border-warning',
};

const badgeSizes: Record<string, string> = {
  xs: 'text-[8px] px-2',
  sm: 'typo-caption-sm px-2 py-0.5',
  md: 'typo-caption-sm px-2.5 py-1',
  lg: 'typo-body-md px-3 py-1.5',
};

const badgeIcons: Record<string, React.ReactNode> = {
  debt: <DebtIcon />,
  receivable: <ReceivableIcon />,
};

const badgeLabels: Record<string, string> = {
  debt: 'Hutang',
  receivable: 'Piutang',
};

const Badge = ({
  variant = 'neutral',
  size = 'md',
  children,
  className,
}: BadgeProps) => {
  const icon = badgeIcons[variant];
  const label = badgeLabels[variant];

  return (
    <span
      className={joinClassnames([
        'font-semibold! rounded-full whitespace-nowrap min-w-12 inline-flex items-center justify-center gap-1',
        badgeVariants[variant],
        badgeSizes[size],
        className,
      ])}
    >
      {icon && <span className="*:w-3.5 *:h-3.5">{icon}</span>}
      {children ?? label}
    </span>
  );
};

export default Badge;
