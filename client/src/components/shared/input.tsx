import { useState, type ChangeEvent } from 'react';

import { joinClassnames } from '@/utils/commons';

interface IProps {
  id: string;
  name: string;
  type: 'text' | 'password' | 'email';
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: { status: boolean; message: string } | null;
}

const Input = ({
  id,
  name,
  type = 'text',
  label = '',
  placeholder = '',
  onChange,
  error = null,
}: IProps) => {
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    onChange(e);
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className={joinClassnames([
          'block typo-body-md text-neutral-1 font-medium mb-2 ml-2',
          error?.status && isTouched ? 'text-danger' : '',
        ])}
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={joinClassnames([
          'h-11 px-4 block w-full border rounded-2xl typo-body-lg text-neutral-1 disabled:opacity-50 disabled:pointer-events-none',
          error?.status && isTouched
            ? 'border-danger  focus:outline-danger'
            : 'border-neutral-4 focus:outline-primary',
        ])}
      />
      {error?.status && isTouched && (
        <div className="ml-2 mt-1 typo-body-md text-danger">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default Input;
