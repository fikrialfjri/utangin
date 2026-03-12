import { joinClassnames } from '@/utils/commons';

interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xs';
  children: React.ReactNode;
  className?: string;
}

const badgeVariants: Record<string, string> = {
  success: 'text-success bg-success-50 border border-success',
  danger: 'text-danger bg-danger-50 border border-danger',
  warning: 'text-warning bg-warning-50 border border-warning',
  neutral: 'text-neutral-4 bg-neutral-6 border border-neutral-4',
};

const badgeSizes: Record<string, string> = {
  xs: 'text-[8px] px-2',
  sm: 'typo-caption-sm px-2 py-0.5',
  md: 'typo-caption-sm px-2.5 py-1',
  lg: 'typo-body-md px-3 py-1.5',
};

const Badge = ({
  variant = 'neutral',
  size = 'md',
  children,
  className,
}: BadgeProps) => {
  return (
    <span
      className={joinClassnames([
        'font-semibold! rounded-full whitespace-nowrap text-center min-w-12',
        badgeVariants[variant],
        badgeSizes[size],
        className,
      ])}
    >
      {children}
    </span>
  );
};

export default Badge;
