import type { StringMap } from '@/types/commons';
import type { IContact } from '@/types/services';

import { getColors } from '@/utils/colors';
import { getInitials, joinClassnames } from '@/utils/commons';

import { Image } from './image';

const avatarSizes: StringMap = {
  small: 'w-6 h-6 text-[10px]',
  default: 'w-8 h-8 text-xs',
};

interface BaseProps {
  size?: 'small' | 'default';
  className?: string;
}

export interface IAvatarProps extends BaseProps {
  src?: string | null;
  name: string;
}

const Avatar = ({ src, name, size = 'default', className }: IAvatarProps) => {
  const initials = getInitials(name);
  const { bgColor, textColor } = getColors(name);
  const sizeClass = avatarSizes[size];

  if (src && src.length > 0) {
    return (
      <Image
        className={joinClassnames([
          'rounded-full aspect-auto',
          sizeClass,
          className,
        ])}
        src={src}
        alt={`${name} avatar`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={joinClassnames([
        'inline-flex items-center justify-center rounded-full select-none font-semibold',
        bgColor,
        textColor,
        sizeClass,
        className,
      ])}
      aria-label={name}
    >
      {initials}
    </div>
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
