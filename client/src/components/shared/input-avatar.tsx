import { useRef } from 'react';

import Avatar from '@/components/shared/avatar';

import { joinClassnames } from '@/utils/commons';

import EditIcon from '@/assets/icons/edit.svg?react';

interface InputAvatarProps {
  name: string;
  label?: string;
  value?: File | null;
  previewUrl?: string | null;
  defaultName?: string;
  onChange?: (file: File | null) => void;
  error?: string | null;
  accept?: string;
  maxSize?: number;
}

const InputAvatar = ({
  name,
  label,
  value,
  previewUrl,
  defaultName = '',
  onChange,
  error,
  accept = 'image/jpeg,image/png,image/webp,image/avif',
  maxSize = 2 * 1024 * 1024,
}: InputAvatarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const filePreview = value ? URL.createObjectURL(value) : null;
  const avatarSrc = filePreview || previewUrl || null;
  const hasCustomImage = !!avatarSrc;
  const showError = !!error;

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      e.target.value = '';
      return;
    }

    onChange?.(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {label && (
        <label
          className={joinClassnames([
            'inline-block typo-body-md font-medium mb-2 ml-2',
            showError ? 'text-danger' : 'text-neutral-2',
          ])}
        >
          {label}
        </label>
      )}

      <div className="relative w-fit">
        <div className="relative cursor-pointer group" onClick={handleClick}>
          <Avatar
            src={avatarSrc}
            name={defaultName || '?'}
            size="large"
            className={joinClassnames([
              'border-2 w-24! h-24! text-3xl!',
              showError ? 'border-danger' : 'border-neutral-5',
            ])}
          />
          <div className="absolute inset-0 rounded-full bg-shades-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <EditIcon className="w-5 h-5 text-shades-white" />
          </div>
        </div>

        {hasCustomImage && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-danger text-shades-white cursor-pointer transition-all hover:brightness-125 active:brightness-75 duration-200 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {showError && (
        <div className="ml-2 mt-1 typo-body-md text-danger">{error}</div>
      )}
    </div>
  );
};

export default InputAvatar;
