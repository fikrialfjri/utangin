import React from 'react';

import { UTANGIN_ASSETS_BASE_URL } from '@/libs/constants';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const Image = ({ src, alt, ...props }: ImageProps) => {
  const transformedSrc = src.startsWith('/uploads/')
    ? `${UTANGIN_ASSETS_BASE_URL}${src}`
    : src;

  return <img src={transformedSrc} alt={alt} {...props} />;
};
