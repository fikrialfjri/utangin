import { useState, type ReactNode } from 'react';

import { joinClassnames } from '@/utils/commons';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Accordion = ({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={joinClassnames([
        'rounded-2xl border border-neutral-5 bg-shades-white overflow-hidden',
        className,
      ])}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 cursor-pointer transition-colors hover:bg-neutral-6"
      >
        <span className="typo-body-md font-semibold! text-neutral-2">
          {title}
        </span>
        <ChevronLeftIcon
          className={joinClassnames([
            'w-4 h-4 text-neutral-3 transition-transform duration-200',
            isOpen ? '-rotate-90' : '-rotate-180',
          ])}
        />
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
};

export default Accordion;
