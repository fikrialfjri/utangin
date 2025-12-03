import { lazy } from 'react';

const pageList = {
  private: [
    {
      path: '/',
      component: lazy(() => import('@/pages/private/home')),
    },
    {
      path: '/debt',
      component: lazy(() => import('@/pages/private/debt')),
    },
    {
      path: '/receivable',
      component: lazy(() => import('@/pages/private/receivable')),
    },
    {
      path: '/contact',
      component: lazy(() => import('@/pages/private/contact')),
    },
    {
      path: '/setting',
      component: lazy(() => import('@/pages/private/setting')),
    },
  ],
  auth: [
    {
      path: 'login',
      component: lazy(() => import('@/pages/auth/login')),
    },
    {
      path: 'register',
      component: lazy(() => import('@/pages/auth/register')),
    },
  ],
};

export default pageList;
