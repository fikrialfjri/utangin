import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { joinClassnames } from '@/utils/commons';

import LoadingIcon from '@/assets/icons/loading.svg?react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: ReactNode;
  block?: boolean;
  loading?: boolean;
}

const Button = ({
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  block = false,
  disabled = false,
  className = '',
  loading = false,
  ...rest
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary text-shades-white',
    secondary:
      'bg-primary-50 border border-primary text-primary disabled:border-neutral-3',
    link: 'text-primary underline underline-offset-3 p-0! m-0! h-auto! disabled:bg-transparent!',
  };

  const sizes = {
    sm: 'h-9 px-4 py-2 typo-body-md',
    md: 'h-11 px-6 py-3 typo-body-lg',
    lg: 'h-14 px-8 py-4 typo-body-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={joinClassnames([
        'flex gap-0.5 items-center justify-center cursor-pointer rounded-2xl font-semibold! transition-all duration-300 hover:brightness-125 active:brightness-75 active:scale-[97%] disabled:text-neutral-3 disabled:hover:brightness-100 disabled:bg-neutral-5 disabled:cursor-not-allowed disabled:active:scale-100 disabled:transform-none disabled:transition-none',
        loading ? 'cursor-progress' : '',
        variants[variant],
        sizes[size],
        block ? 'w-full' : 'w-fit',
        className,
      ])}
      {...rest}
    >
      {loading && <LoadingIcon />}
      {children}
    </button>
  );
};

export default Button;
