import { Outlet } from 'react-router';

import RootLayout from '@/components/layout/root.layout';

import BottomNavigation from './components/bottom-navigation';

const MainLayout = () => {
  return (
    <RootLayout>
      <Outlet />
      <BottomNavigation />
    </RootLayout>
  );
};

export default MainLayout;
