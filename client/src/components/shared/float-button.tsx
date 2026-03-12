import type { ButtonHTMLAttributes } from 'react';

import { joinClassnames } from '@/utils/commons';

import PlusIcon from '@/assets/icons/plus.svg?react';

interface FloatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  loading?: boolean;
  withBottomNav?: boolean;
}

const FloatButton = ({
  onClick,
  disabled = false,
  loading = false,
  withBottomNav = true,
}: FloatButtonProps) => {
  return (
    <div
      className={joinClassnames([
        'fixed z-40 -translate-x-1/2 left-1/2 w-full flex justify-end pr-3 xs:max-w-xl xs:pr-6 pointer-events-none',
        withBottomNav
          ? 'bottom-[calc(83px+12px)] xs:bottom-[calc(83px+24px)]'
          : 'bottom-3 xs:bottom-6',
      ])}
    >
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="pointer-events-auto flex items-center justify-center bg-primary w-12 h-12 rounded-full text-shades-white cursor-pointer transition-all duration-300 hover:brightness-125 active:scale-[97%] active:brightness-75 disabled:bg-neutral-5 disabled:text-neutral-3 disabled:hover:brightness-100 disabled:cursor-not-allowed disabled:active:scale-100 disabled:transform-none disabled:transition-none"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default FloatButton;
