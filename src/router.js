import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'ViewIndex',
      component: () => import('@/views/dashboard/Index'),
      redirect: '/products',
      children: [
        // Products Listing
        {
          name: 'Products Listing',
          path: '/products',
          component: () => import('@/views/products/ProductsListing'),
        },
        // Pages
        {
          name: 'Transactions Management',
          path: '/transactions',
          component: () => import('@/views/transactions/TransactionManagement'),
        },
        {
          name: 'Fee Settings',
          path: '/fees',
          component: () => import('@/views/fees/FeesSetting'),
        },
      ],
      meta: {
        auth: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login'),
      meta: {
        guest: true,
      },
    },
  ],
})
