import { joinClassnames } from '@/utils/commons';

interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

const badgeVariants: Record<string, string> = {
  success: 'text-success bg-success/10',
  danger: 'text-danger bg-danger/10',
  warning: 'text-warning bg-warning/10',
  neutral: 'text-neutral-3 bg-neutral-5',
};

const Badge = ({ variant = 'neutral', children, className }: BadgeProps) => {
  return (
    <span
      className={joinClassnames([
        'typo-caption-sm font-semibold! px-2.5 py-1 rounded-full whitespace-nowrap',
        badgeVariants[variant],
        className,
      ])}
    >
      {children}
    </span>
  );
};

export default Badge;
