import { Outlet } from 'react-router';

import RootLayout from '@/components/layout/root.layout';

import { PageTitleProvider } from '@/hooks/use-page-header';

import PageHeader from './components/page-header';

const SubPageLayout = () => {
  return (
    <RootLayout>
      <PageTitleProvider>
        <PageHeader />
        <div className="p-3 xs:px-6 xs:pb-6 xs:pt-5 h-[calc(100vh-56px)] overflow-y-auto">
          <Outlet />
        </div>
      </PageTitleProvider>
    </RootLayout>
  );
};

export default SubPageLayout;
