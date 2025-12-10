import { Navigate, Outlet, Route, Routes } from 'react-router';

import AuthLayout from '@/components/layout/auth.layout';
import FormLayout from '@/components/layout/form.layout';
import MainLayout from '@/components/layout/main.layout';

import { getToken } from '@/utils/storages';

import pageList from './page-list';

const token = getToken();

const PrivateWrapper = () => {
  return token ? <Outlet /> : <Navigate to="auth/login" replace={true} />;
};

const AuthWrapper = () => {
  return token ? <Navigate to="/" replace={true} /> : <Outlet />;
};

const MainRouter = () => {
  return (
    <Routes>
      <Route element={<PrivateWrapper />}>
        <Route path="/" element={<MainLayout />}>
          {pageList.private.map((li) => {
            const Element = li.component;
            return <Route key={li.path} path={li.path} element={<Element />} />;
          })}
        </Route>

        <Route path="/form" element={<FormLayout />}>
          {pageList.privateForm.map((li) => {
            const Element = li.component;
            return <Route key={li.path} path={li.path} element={<Element />} />;
          })}
        </Route>
      </Route>

      <Route element={<AuthWrapper />}>
        <Route path="/auth" element={<AuthLayout />}>
          {pageList.auth.map((li) => {
            const Element = li.component;
            return <Route key={li.path} path={li.path} element={<Element />} />;
          })}
        </Route>
      </Route>
    </Routes>
  );
};

export default MainRouter;
