import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
        {
          name: 'Product Details',
          path: '/products/:id',
          component: () => import('@/views/products/ProductDetails'),
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
    {
      path: '/logout',
      name: 'Logout',
      props: true,
      component: () => import('@/views/auth/Logout'),
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: () => import('@/views/NotFoundPage'),
    },
  ],
})
