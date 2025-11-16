import { Outlet } from 'react-router';

import RootLayout from '@/components/layout/root.layout';

import BottomNavigation from './components/bottom-navigation';

const MainLayout = () => {
  return (
    <RootLayout>
      <div className="p-3 xs:p-6">
        <Outlet />
      </div>
      <BottomNavigation />
    </RootLayout>
  );
};

export default MainLayout;
