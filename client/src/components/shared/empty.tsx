/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';

import type { EmptyVariants, ReactNodeMap } from '@/types/commons';

import { VARIANT_LABELS } from '@/libs/constants';

import EmptyContact from '@/assets/illustrations/empty-contact.svg?react';
import EmptyDebt from '@/assets/illustrations/empty-debt.svg?react';
import EmptyDebtReceivable from '@/assets/illustrations/empty-debt-receivable.svg?react';
import EmptyDefault from '@/assets/illustrations/empty-default.svg?react';
import EmptyReceivable from '@/assets/illustrations/empty-receivable.svg?react';
import EmptyTransaction from '@/assets/illustrations/empty-transaction.svg?react';

import Button from './button';

interface EmptyProps {
  variant?: EmptyVariants;
  showButton?: boolean;
  onButtonClick?: () => void;
  illustrationClassName?: string;
  customMessage?: ReactNode;
  buttonLabel?: string;
}

const Empty = ({
  variant = 'DEFAULT',
  showButton,
  onButtonClick,
  illustrationClassName,
  customMessage,
  buttonLabel,
}: EmptyProps) => {
  const renderedIllustration: ReactNodeMap = {
    DEFAULT: (
      <EmptyDefault
        className={illustrationClassName || 'w-1/3 h-1/3 mx-auto mt-10'}
      />
    ),
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
    DEBT_RECEIVABLE: (
      <EmptyDebtReceivable
        className={illustrationClassName || 'w-1/3 h-1/3 mx-auto mt-10'}
      />
    ),
  };

  return (
    <div className="flex flex-col gap-1 items-center">
      {renderedIllustration[variant]}
      <div className="flex flex-col gap-5 items-center">
        <p className="typo-body-lg font-medium! text-neutral-3">
          {customMessage ?? (
            <>
              Tidak ada data{' '}
              <span className="text-primary font-semibold!">
                {(VARIANT_LABELS as any)[variant]}
              </span>
            </>
          )}
        </p>
        {showButton && (
          <Button size="sm" onClick={onButtonClick}>
            {buttonLabel ?? 'Tambah Data Baru'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;
