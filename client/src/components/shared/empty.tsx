/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EmptyVariants, ReactNodeMap } from '@/types/commons';

import { VARIANT_LABELS } from '@/libs/constants';

import EmptyContact from '@/assets/illustrations/empty-contact.svg?react';
import EmptyDebt from '@/assets/illustrations/empty-debt.svg?react';
import EmptyReceivable from '@/assets/illustrations/empty-receivable.svg?react';
import EmptyTransaction from '@/assets/illustrations/empty-transaction.svg?react';

import Button from './button';

interface EmptyProps {
  variant: EmptyVariants;
  showButton?: boolean;
  onButtonClick?: () => void;
  illustrationClassName?: string;
}

const Empty = ({
  variant,
  showButton,
  onButtonClick,
  illustrationClassName,
}: EmptyProps) => {
  const renderedIllustration: ReactNodeMap = {
    TRANSACTION: (
      <EmptyTransaction
        className={illustrationClassName || 'w-1/3 h-1/3 mx-auto mt-10'}
      />
    ),
    DEBT: (
      <EmptyDebt
        className={illustrationClassName || 'w-1/3 h-1/3 mx-auto mt-10'}
      />
    ),
    RECEIVABLE: (
      <EmptyReceivable
        className={illustrationClassName || 'w-1/3 h-1/3 mx-auto mt-10'}
      />
    ),
    CONTACT: (
      <EmptyContact
        className={illustrationClassName || 'w-1/3 h-1/3 mx-auto mt-10'}
      />
    ),
  };

  return (
    <div className="flex flex-col gap-1 items-center">
      {renderedIllustration[variant]}
      <div className="flex flex-col gap-5 items-center">
        <p className="typo-body-lg font-medium! text-neutral-3">
          Tidak ada data{' '}
          <span className="text-primary font-semibold!">
            {(VARIANT_LABELS as any)[variant]}
          </span>
        </p>
        {showButton && (
          <Button size="sm" onClick={onButtonClick}>
            Tambah Data Baru
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;
