import { Suspense } from 'react';
import { Outlet } from 'react-router';

import RootLayout from '@/components/layout/root.layout';

const AuthLayout = () => {
  return (
    <RootLayout>
      <section className="flex h-screen items-center justify-center p-6">
        <Suspense fallback={<p>Loading...</p>}>
          <div className="relative flex items-center justify-center w-full">
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </Suspense>
      </section>
    </RootLayout>
  );
};

export default AuthLayout;
