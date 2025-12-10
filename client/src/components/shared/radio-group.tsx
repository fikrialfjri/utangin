import { useEffect, useRef, useState } from 'react';

import { TRANSACTION_TYPES } from '@/libs/constants';

import { joinClassnames } from '@/utils/commons';

interface RadioOption {
  id: string;
  value: string;
  label: string;
  selected_label?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  block?: boolean;
}

const RadioGroup = ({
  name,
  options,
  value,
  onChange,
  className = '',
  block = false,
}: RadioGroupProps) => {
  const [selectedValue, setSelectedValue] = useState(
    value || options[0]?.value,
  );
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
    top: 0,
    height: 0,
  });
  const labelRefs = useRef<(HTMLLabelElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const selectedIndex = options.findIndex(
      (option) => option.value === selectedValue,
    );
    const selectedLabel = labelRefs.current[selectedIndex];
    const container = containerRef.current;

    if (selectedLabel && container) {
      const containerRect = container.getBoundingClientRect();
      const labelRect = selectedLabel.getBoundingClientRect();

      setIndicatorStyle({
        width: labelRect.width,
        height: labelRect.height,
        left: labelRect.left - containerRect.left,
        top: labelRect.top - containerRect.top,
      });
    }
  }, [selectedValue, options]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    onChange?.(e);
  };

  const getColorClasses = (optionValue: string, isSelected?: boolean) => {
    if (!isSelected) {
      return {
        text: 'text-neutral-1',
        bg: '',
      };
    }

    if (optionValue === TRANSACTION_TYPES.DEBT) {
      return {
        text: 'text-danger',
        bg: 'bg-danger-50',
      };
    }

    if (optionValue === TRANSACTION_TYPES.RECEIVABLE) {
      return {
        text: 'text-warning',
        bg: 'bg-warning-50',
      };
    }

    return {
      text: 'text-primary',
      bg: 'bg-primary-50',
    };
  };

  return (
    <div
      ref={containerRef}
      className={joinClassnames([
        'relative flex gap-2 p-1 bg-neutral-6 rounded-2xl',
        block ? 'w-full' : 'w-fit',
        className,
      ])}
    >
      <div
        className={joinClassnames([
          'absolute rounded-2xl transition-all duration-300 ease-out',
          getColorClasses(selectedValue, true).bg,
        ])}
        style={{
          width: `${indicatorStyle.width}px`,
          height: `${indicatorStyle.height}px`,
          left: `${indicatorStyle.left}px`,
          top: `${indicatorStyle.top}px`,
        }}
      />

      {options.map((option, index) => {
        const isSelected = selectedValue === option.value;
        const colors = getColorClasses(option.value, isSelected);

        return (
          <div key={option.id} className="relative z-10 w-full">
            <input
              type="radio"
              id={option.id}
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={handleChange}
              className="hidden peer"
            />
            <label
              ref={(el) => {
                labelRefs.current[index] = el;
              }}
              htmlFor={option.id}
              className={joinClassnames([
                'flex items-center justify-center h-11 px-6 py-3 rounded-2xl cursor-pointer transition-all duration-300 hover:brightness-125 relative overflow-hidden',
                colors.text,
              ])}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <span
                  className={joinClassnames([
                    'typo-body-lg font-semibold whitespace-nowrap absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out origin-center',
                    isSelected
                      ? '-translate-y-2 scale-90 opacity-0'
                      : 'translate-y-0 scale-100 opacity-100',
                  ])}
                >
                  {option.label}
                </span>

                <span
                  className={joinClassnames([
                    'typo-body-lg font-semibold whitespace-nowrap transition-all duration-400 ease-out origin-center',
                    isSelected
                      ? 'translate-y-0 scale-100 opacity-100 relative z-10'
                      : 'translate-y-3 scale-90 opacity-0',
                  ])}
                >
                  {option.selected_label || option.label}
                </span>
              </div>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioGroup;
