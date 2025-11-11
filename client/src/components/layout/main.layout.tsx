import { Outlet } from 'react-router';

import RootLayout from '@/components/layout/root.layout';

const MainLayout = () => {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
};

export default MainLayout;
