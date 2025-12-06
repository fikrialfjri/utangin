import { useEffect, useState } from 'react';

import { DESKTOP_BREAKPOINT } from '@/libs/constants';

export const useDesktopScreen = (): boolean => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery: MediaQueryList = window.matchMedia(
      `(min-width: ${DESKTOP_BREAKPOINT})`,
    );

    const handleResize = (e: MediaQueryListEvent | MediaQueryList): void => {
      setIsDesktop(e.matches);
    };

    handleResize(mediaQuery);

    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return isDesktop;
};
