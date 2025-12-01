import { useState, type ChangeEvent, type InputHTMLAttributes } from 'react';

import { joinClassnames } from '@/utils/commons';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type: 'text' | 'password' | 'email';
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?:
    | { status: boolean | undefined; message: string | undefined }
    | string
    | null
    | undefined;
}

const Input = ({
  id,
  type = 'text',
  label = '',
  onChange,
  error = null,
  ...rest
}: InputProps) => {
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    onChange(e);
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const normalizedError =
    typeof error === 'string' || error === undefined || error === null
      ? {
          status: !!error,
          message: error ?? '',
        }
      : error;

  const showError = normalizedError.status && isTouched;

  return (
    <div>
      <label
        htmlFor={id}
        className={joinClassnames([
          'block typo-body-md font-medium mb-2 ml-2',
          showError ? 'text-danger' : 'text-neutral-1',
        ])}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={joinClassnames([
          'h-11 px-4 block w-full border rounded-2xl typo-body-lg text-neutral-1 disabled:opacity-50 disabled:pointer-events-none',
          showError
            ? 'border-danger  focus:outline-danger'
            : 'border-neutral-4 focus:outline-primary',
        ])}
        {...rest}
      />
      {showError && (
        <div className="ml-2 mt-1 typo-body-md text-danger">
          *{normalizedError.message}
        </div>
      )}
    </div>
  );
};

export default Input;
