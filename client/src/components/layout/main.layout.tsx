import { Outlet } from 'react-router';

import RootLayout from '@/components/layout/root.layout';

import BottomNavigation from './components/bottom-navigation';

const MainLayout = () => {
  return (
    <RootLayout>
      <div className="p-3 xs:p-6 h-[calc(100vh-83px)] overflow-y-auto">
        <Outlet />
      </div>
      <BottomNavigation />
    </RootLayout>
  );
};

export default MainLayout;
