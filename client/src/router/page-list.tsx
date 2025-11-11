import { lazy } from 'react';

const pageList = {
  private: [
    {
      path: '/',
      component: lazy(() => import('@/pages/private/home')),
    },
  ],
  auth: [
    {
      path: 'login',
      component: lazy(() => import('@/pages/auth/login')),
    },
  ],
};

export default pageList;
