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
  privateSubPage: [
    {
      path: '/contact/:id',
      component: lazy(() => import('@/pages/private/contact/detail')),
    },
    {
      path: '/transaction/:id',
      component: lazy(() => import('@/pages/private/transaction/detail')),
    },
  ],
  privateForm: [
    {
      path: 'transaction/create',
      component: lazy(() => import('@/pages/private/transaction/form')),
    },
    {
      path: 'transaction/:id/edit',
      component: lazy(() => import('@/pages/private/transaction/form')),
    },
    {
      path: 'transaction/:id/payment',
      component: lazy(() => import('@/pages/private/transaction/payment-form')),
    },
    {
      path: 'transaction/:id/payment/:paymentId/edit',
      component: lazy(() => import('@/pages/private/transaction/payment-form')),
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
