/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC, ReactNode } from 'react';

import type { StringMap, TransactionType } from '@/types/commons';

import { formatCurrency, joinClassnames } from '@/utils/commons';

import Avatar, { type IAvatarProps } from './avatar';
import Badge from './badge';

type ListDataItem = any;
type RenderItemFn = (item: ListDataItem, index: number) => ReactNode;

interface IListProps {
  data: ListDataItem[];
  renderItem: RenderItemFn;
}
interface IListItemProps {
  variant?: TransactionType;
  children: ReactNode;
  onClick?: () => void;
  withProgress?: boolean;
  percentage?: number;
}
interface IListItemMetaProps {
  avatar?: IAvatarProps;
  title?: ReactNode;
  description?: ReactNode;
}
interface IListItemTransactionNominalProps {
  status: string;
  type: TransactionType;
  amount: number;
  remaining: number;
  totalPaid: number;
}

type ListComponent = FC<IListProps> & {
  Item: FC<IListItemProps> & {
    Meta: FC<IListItemMetaProps>;
    TransactionNominal: FC<IListItemTransactionNominalProps>;
  };
};

const List: ListComponent = ({ data, renderItem }) => {
  return (
    <ul className="flex flex-col gap-3">
      {data?.map((item: any, idx: number) => (
        <li
          key={item.id ?? idx}
          className={joinClassnames([
            'border border-neutral-5 bg-shades-white rounded-[18px] relative overflow-hidden',
          ])}
        >
          {renderItem(item, idx)}
        </li>
      ))}
    </ul>
  );
};

const ListItem = ({
  variant,
  children,
  onClick,
  withProgress,
  percentage,
}: IListItemProps) => {
  const wrapperClassnames: StringMap = {
    DEBT: 'text-danger!',
    RECEIVABLE: 'text-warning!',
  };

  return (
    <div
      className={joinClassnames([
        'typo-body-md font-bold! flex items-center justify-between gap-3 text-neutral-2 w-full h-full p-3 relative',
        variant && wrapperClassnames[variant],
        onClick && 'cursor-pointer',
      ])}
      onClick={onClick}
    >
      {children}
      {withProgress && (percentage ?? 0) > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent overflow-hidden">
          <div className="h-full w-full bg-neutral-5" />
          <div
            className="absolute bottom-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

const ListItemMeta = ({ avatar, title, description }: IListItemMetaProps) => {
  return (
    <div className="flex items-center gap-3">
      {avatar && (
        <Avatar src={avatar.src} name={avatar.name} size={avatar.size} />
      )}
      <div className="text-neutral-2 overflow-hidden">
        <h4 className="typo-body-md font-semibold! truncate">{title}</h4>
        {description && (
          <div className="typo-caption-sm truncate line-clamp-1">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

const ListItemTransactionNominal = ({
  status,
  type,
  amount,
  remaining,
  totalPaid,
}: IListItemTransactionNominalProps) => {
  const remainingAmountClassnames: StringMap = {
    DEBT: 'text-danger!',
    RECEIVABLE: 'text-warning!',
  };

  return (
    <div className="flex flex-col items-end gap-1 relative z-10 text-right shrink-0">
      {status === 'PAID' ? (
        <div className="flex flex-col items-end gap-0.5 relative">
          <span
            className={joinClassnames([
              'font-bold line-through opacity-50',
              remainingAmountClassnames[type],
            ])}
          >
            {formatCurrency(amount)}
          </span>
          <Badge variant="success" size="xs">
            Lunas
          </Badge>
        </div>
      ) : (
        <div className="flex flex-col items-end gap-0.5">
          {totalPaid === 0 ? (
            <>
              <span
                className={joinClassnames([
                  'font-bold',
                  remainingAmountClassnames[type],
                ])}
              >
                {formatCurrency(amount)}
              </span>
              <Badge variant="neutral" size="xs">
                Belum ada Pembayaran
              </Badge>
            </>
          ) : (
            <>
              <span
                className={joinClassnames([
                  'font-bold -mb-1',
                  remainingAmountClassnames[type],
                ])}
              >
                {formatCurrency(remaining)}
              </span>
              <span className="typo-caption-sm text-neutral-3 flex items-baseline gap-1">
                <span className="text-primary font-semibold typo-caption-md">
                  {formatCurrency(totalPaid)}
                </span>
                <span>/</span>
                <span>{formatCurrency(amount)}</span>
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

List.Item = Object.assign(ListItem, {
  Meta: ListItemMeta,
  TransactionNominal: ListItemTransactionNominal,
});
export default List;
