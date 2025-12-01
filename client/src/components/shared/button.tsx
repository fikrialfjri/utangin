import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { joinClassnames } from '@/utils/commons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: ReactNode;
  block?: boolean;
}

const Button = ({
  type = 'button',
  onClick,
  children,
  block = false,
  disabled = false,
  className = '',
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={joinClassnames([
        'inline-block cursor-pointer rounded-2xl bg-primary h-11 px-6 py-3 typo-body-lg font-medium! text-shades-white duration-200 hover:brightness-90 active:brightness-75 active:scale-[98%] disabled:bg-neutral-5 disabled:text-neutral-3 disabled:hover:brightness-100 disabled:transform-none disabled:transition-none disabled:cursor-not-allowed disabled:active:scale-100 disabled:active:brightness-100',
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
