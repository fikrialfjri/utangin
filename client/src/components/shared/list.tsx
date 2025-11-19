/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC, ReactNode } from 'react';

import type { StringMap } from '@/types/commons';

import { joinClassnames } from '@/utils/commons';

import Avatar, { type IAvatarProps } from './avatar';

type ListDataItem = any;
type RenderItemFn = (item: ListDataItem, index: number) => ReactNode;

interface IListProps {
  data: ListDataItem[];
  renderItem: RenderItemFn;
}
interface IListItemProps {
  variant?: 'debt' | 'receivable';
  children: ReactNode;
}
interface IListItemMetaProps {
  avatar?: IAvatarProps;
  title?: ReactNode;
  description?: ReactNode;
}

type ListComponent = FC<IListProps> & {
  Item: FC<IListItemProps> & {
    Meta: FC<IListItemMetaProps>;
  };
};

const List: ListComponent = ({ data, renderItem }) => {
  return (
    <div className="flex flex-col gap-3">
      {data.map((item: any, idx: number) => (
        <div
          key={idx}
          className="p-3 border border-neutral-5 bg-shades-white rounded-[18px]"
        >
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  );
};

const ListItem = ({ variant, children }: IListItemProps) => {
  const wrapperClassnames: StringMap = {
    debt: 'text-danger',
    receivable: 'text-warning',
  };

  return (
    <div
      className={joinClassnames([
        'typo-body-md font-bold! flex items-center justify-between gap-3',
        wrapperClassnames[variant!],
      ])}
    >
      {children}
    </div>
  );
};

const ListItemMeta = ({ avatar, title, description }: IListItemMetaProps) => {
  return (
    <div className="flex items-center gap-3">
      {avatar && (
        <Avatar src={avatar.src} name={avatar.name} size={avatar.size} />
      )}
      <div className="text-neutral-2">
        <h4 className="typo-body-md font-semibold!">{title}</h4>
        {description && <div className="typo-caption-sm">{description}</div>}
      </div>
    </div>
  );
};

List.Item = Object.assign(ListItem, { Meta: ListItemMeta });
export default List;
