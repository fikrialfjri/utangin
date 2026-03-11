import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import {
  usePageHeaderActionValue,
  usePageTitleValue,
} from '@/hooks/use-page-header';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';

interface PageHeaderProps {
  title?: string;
  action?: ReactNode;
  onBack?: () => void;
}

const PageHeader = ({ title, action, onBack }: PageHeaderProps) => {
  const navigate = useNavigate();
  const contextTitle = usePageTitleValue();
  const contextAction = usePageHeaderActionValue();
  const displayTitle = title ?? contextTitle;
  const displayAction = action ?? contextAction;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="flex items-center justify-between h-14 px-3 xs:px-6 bg-primary">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-opacity hover:opacity-70"
        >
          <ChevronLeftIcon className="w-5 h-5 text-shades-white" />
        </button>
        {displayTitle && (
          <h1 className="typo-body-lg font-semibold! text-shades-white">
            {displayTitle}
          </h1>
        )}
      </div>
      <div className="w-8 h-8 flex items-center justify-center">
        {displayAction ?? null}
      </div>
    </header>
  );
};

export default PageHeader;
