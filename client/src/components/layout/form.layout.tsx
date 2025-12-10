import { Outlet } from 'react-router';

import RootLayout from '@/components/layout/root.layout';

const FormLayout = () => {
  return (
    <RootLayout>
      <div className="p-3 xs:p-6 h-screen overflow-y-auto">
        <Outlet />
      </div>
    </RootLayout>
  );
};

export default FormLayout;
