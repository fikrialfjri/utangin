import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';

import type { ISelectOption } from '@/types/commons';

import Input from '@/components/shared/input';

import { joinClassnames } from '@/utils/commons';

import Empty from './empty';

interface SelectProps {
  name: string;
  options: ISelectOption[];
  value?: string | number | null;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  block?: boolean;
  disabled?: boolean;
  onCreate?: (keyword: string) => void;
  required?: boolean;
}

const Select = ({
  name,
  options,
  value,
  onChange,
  placeholder = 'Pilih...',
  label,
  className = '',
  block = false,
  disabled = false,
  onCreate,
  required,
}: SelectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasTyped, setHasTyped] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const hasSelection = !!selectedOption;
  const displayValue = hasSelection ? selectedOption.label : '';

  const inputValue = isOpen
    ? hasTyped
      ? searchQuery
      : displayValue
    : displayValue;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpen = () => {
    setIsOpen(true);
    setHasTyped(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setHasTyped(true);
  };

  const handleSelect = useCallback(
    (optionValue: string | number) => {
      const event = {
        target: { name, value: optionValue },
      } as ChangeEvent<HTMLInputElement>;

      onChange?.(event);
      setIsOpen(false);
      setSearchQuery('');
      setHasTyped(false);
      inputRef.current?.blur();
    },
    [name, onChange],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={joinClassnames([
        'relative',
        block ? 'w-full' : 'w-fit',
        className,
      ])}
    >
      <Input
        id={name}
        type="text"
        label={label ?? ''}
        value={inputValue}
        placeholder={!hasSelection ? placeholder : ''}
        onChange={handleChange}
        onFocus={handleOpen}
        onClick={handleOpen}
        readOnly={!isOpen}
        disabled={disabled}
        required={required}
        autoComplete="off"
        suffix={
          <span
            className={joinClassnames([
              'flex items-center justify-center transition-transform duration-200',
              isOpen ? 'rotate-180' : '',
            ])}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="stroke-current"
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        }
      />

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-5 rounded-2xl shadow-xl max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={joinClassnames([
                'px-4 py-3 cursor-pointer transition-colors duration-200',
                option.value === value
                  ? 'bg-primary-50 text-primary'
                  : 'hover:bg-neutral-5/50',
              ])}
              onClick={() => handleSelect(option.value)}
            >
              <div className="typo-body-lg">{option.label}</div>
            </div>
          ))}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-5 rounded-2xl shadow-xl py-3 flex flex-col gap-3">
          <Empty illustrationClassName="w-1/4 h-1/4" />
          <button
            type="button"
            className={joinClassnames([
              'w-full text-left px-4 py-2 typo-body-sm text-primary cursor-pointer hover:bg-neutral-6 active:bg-primary-50 transition-colors disabled:cursor-not-allowed disabled:active:bg-neutral-6',
            ])}
            onClick={() => {
              if (!onCreate) return;
              const keyword = searchQuery.trim();
              if (!keyword) return;
              onCreate(keyword);
              setIsOpen(false);
              setSearchQuery('');
            }}
            disabled={!searchQuery.length}
          >
            {!searchQuery.length
              ? 'Ketik untuk tambahkan data'
              : `Tambahkan data "${searchQuery}"`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Select;
