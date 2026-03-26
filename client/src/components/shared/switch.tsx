import type { InputHTMLAttributes } from 'react';

import { joinClassnames } from '@/utils/commons';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  labelPosition?: 'left' | 'right';
}

const Switch = ({
  label,
  checked,
  onCheckedChange,
  className,
  labelPosition = 'left',
  ...props
}: SwitchProps) => {
  return (
    <label
      className={joinClassnames([
        'relative flex items-center cursor-pointer shrink-0',
        className,
      ])}
    >
      {label && labelPosition === 'left' && (
        <span className="mr-3 typo-caption-md font-semibold text-neutral-3 transition-colors peer-checked:text-primary">
          {label}
        </span>
      )}
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        {...props}
      />
      <div className="relative w-11 h-6 bg-neutral-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-neutral-5 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
      
      {label && labelPosition === 'right' && (
        <span className="ml-3 typo-caption-md font-semibold text-neutral-3 transition-colors peer-checked:text-primary">
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;
