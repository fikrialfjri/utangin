import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { joinClassnames } from '@/utils/commons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'link';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: ReactNode;
  block?: boolean;
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
  ...rest
}: ButtonProps) => {
  const variants = {
    primary:
      'bg-primary text-shades-white hover:brightness-90 active:brightness-75 disabled:bg-neutral-5 disabled:text-neutral-3 disabled:hover:brightness-100',
    link: 'text-primary underline underline-offset-3 p-0! m-0! h-auto! hover:brightness-90 active:brightness-75 disabled:bg-neutral-5 disabled:text-neutral-3 disabled:hover:brightness-100',
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
      disabled={disabled}
      className={joinClassnames([
        'inline-flex items-center justify-center cursor-pointer rounded-2xl font-medium transition-all duration-300 active:scale-[97%] disabled:cursor-not-allowed disabled:active:scale-100 disabled:transform-none disabled:transition-none',
        variants[variant],
        sizes[size],
        block ? 'w-full' : 'w-fit',
        className,
      ])}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
