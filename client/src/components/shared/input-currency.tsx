import { useEffect, useState } from 'react';

import Input from './input';

interface InputCurrencyProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    'value' | 'onChange' | 'type' | 'prefix'
  > {
  value?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputCurrency = ({
  value = 0,
  onChange,
  placeholder = '0',
  ...rest
}: InputCurrencyProps) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const formatted = new Intl.NumberFormat('id-ID').format(value);
    setDisplayValue(formatted);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const cleaned = inputValue.replaceAll(/\D/g, '');
    const numericValue = cleaned === '' ? 0 : Number.parseInt(cleaned, 10);

    const formatted = new Intl.NumberFormat('id-ID').format(numericValue);
    setDisplayValue(formatted);

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: numericValue.toString(),
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(syntheticEvent);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <Input
      {...rest}
      type="text"
      prefix="Rp"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      inputMode="numeric"
    />
  );
};

export default InputCurrency;
