import { useRef, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

import { joinClassnames } from '@/utils/commons';

type InputBaseProps = InputHTMLAttributes<HTMLInputElement>;

interface InputProps extends Omit<InputBaseProps, 'prefix'> {
  id: string;
  type: 'text' | 'password' | 'email' | 'date' | 'textarea';
  label: string;
  error?:
    | { status: boolean | undefined; message: string | undefined }
    | string
    | null
    | undefined;
  required?: true | false;
  requiredMessage?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const Input = ({
  id,
  type = 'text',
  label = '',
  onChange,
  error = null,
  required = false,
  requiredMessage,
  value,
  prefix,
  suffix,
  ...rest
}: InputProps) => {
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    if (onChange) onChange(e);
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const handleWrapperClick = () => {
    inputRef.current?.focus();
  };

  const normalizedError =
    typeof error === 'string' || error === undefined || error === null
      ? {
          status: !!error,
          message: error ?? '',
        }
      : error;

  const showValidatorError = normalizedError.status && isTouched;
  const showRequiredError =
    required && isTouched && !value && !showValidatorError;

  const finalMessage = showValidatorError
    ? normalizedError.message
    : showRequiredError
      ? requiredMessage || `${label} wajib diisi`
      : '';

  const showError = showValidatorError || showRequiredError;

  return (
    <div>
      <label
        htmlFor={id}
        className={joinClassnames([
          'inline-block typo-body-md font-medium mb-2 ml-2',
          showError ? 'text-danger' : 'text-neutral-1',
        ])}
      >
        {label}
        {required && <span className="text-danger">*</span>}
      </label>

      <div
        className={joinClassnames([
          'flex items-center gap-2 h-11 px-4 border rounded-2xl transition-all duration-300 pointer cursor-text',
          showError
            ? 'border-danger focus-within:border-danger focus-within:ring-1 focus-within:ring-danger'
            : 'border-neutral-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
        ])}
        onClick={handleWrapperClick}
      >
        {prefix && (
          <span className="typo-body-lg *:text-neutral-3 text-neutral-3 shrink-0">
            {prefix}
          </span>
        )}

        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="flex-1 typo-body-lg text-neutral-1 bg-transparent outline-none disabled:opacity-50 disabled:pointer-events-none"
          {...rest}
        />

        {suffix && (
          <span className="typo-body-lg *:text-neutral-3 text-neutral-3 shrink-0">
            {suffix}
          </span>
        )}
      </div>

      {showError && (
        <div className="ml-2 mt-1 typo-body-md text-danger">{finalMessage}</div>
      )}
    </div>
  );
};

export default Input;
