import type { IContact, StringMap } from '@/types/commons';

import { joinClassnames } from '@/utils/commons';

import { Image } from './image';

const avatarSizes: StringMap = {
  small: 'w-6 h-6 text-[10px]',
  default: 'w-8 h-8 text-xs',
};

interface BaseProps {
  size?: 'small' | 'default';
  className?: string;
}

interface IAvatarProps extends BaseProps {
  src?: string | null;
  name: string;
}

const Avatar = ({ src, name, size = 'default', className }: IAvatarProps) => {
  return (
    <Image
      className={joinClassnames([
        'rounded-full aspect-auto bg-primary-50',
        avatarSizes[size],
        className,
      ])}
      src={
        src?.length
          ? src
          : `https://avatar.iran.liara.run/username?username=${name}`
      }
      alt="avatar"
      loading="lazy"
    />
  );
};

interface IAvatarGroupProps extends BaseProps {
  data: IContact[];
}

const AvatarGroup = ({
  data,
  size = 'small',
  className,
}: IAvatarGroupProps) => {
  const count = data.length;
  const showExcess = count > 4;
  const visible = showExcess ? data.slice(0, 3) : data.slice(0, 4);
  const excess = showExcess ? count - 3 : 0;

  return (
    <div className={joinClassnames(['flex items-center', className])}>
      {visible.map((item, idx) => {
        return (
          <div
            key={item.id}
            className={joinClassnames([
              'inline-flex border border-shades-white rounded-full',
              idx === 0 ? '' : '-ml-2',
            ])}
            title={item.name}
          >
            <Avatar src={item.avatar} name={item.name} size={size} />
          </div>
        );
      })}

      {showExcess ? (
        <span
          className={joinClassnames([
            'inline-flex items-center justify-center rounded-full select-none bg-neutral-5 text-neutral-2 -ml-2 border border-shades-white',
            avatarSizes[size],
          ])}
          title={`${excess} more`}
        >
          +{Math.min(excess, 99)}
        </span>
      ) : null}
    </div>
  );
};

export { AvatarGroup };
export default Avatar;
