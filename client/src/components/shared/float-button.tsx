import type { ButtonHTMLAttributes } from 'react';

import PlusIcon from '@/assets/icons/plus.svg?react';

interface FloatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  loading?: boolean;
}

const FloatButton = ({
  onClick,
  disabled = false,
  loading = false,
}: FloatButtonProps) => {
  return (
    <div className="fixed z-999 -translate-x-1/2 left-1/2 w-full flex justify-end bottom-3 pr-3 xs:max-w-xl xs:pr-6 xs:bottom-[calc(83px+24px)]">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="flex items-center justify-center bg-primary w-12 h-12 rounded-full text-shades-white cursor-pointer transition-all duration-300 hover:brightness-125 active:scale-[97%] active:brightness-75 disabled:bg-neutral-5 disabled:text-neutral-3 disabled:hover:brightness-100 disabled:cursor-not-allowed disabled:active:scale-100 disabled:transform-none disabled:transition-none"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default FloatButton;
