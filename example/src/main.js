import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAcl from '../../source/vue-acl'

import App from './App.vue'
import PublicPage from './pages/PublicPage.vue'
import DashPage from './pages/DashPage.vue'
import ClientPage from './pages/ClientPage.vue'
import ManagerPage from './pages/ManagerPage.vue'
import ErrorPage from './pages/ErrorPage.vue'
import ErrorDashPage from './pages/ErrorDashPage.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: PublicPage,
      meta: {
        permission: 'public',
      }
    },
    {
      path: '/dash',
      component: DashPage,
      meta: {
        permission: 'client|manager',
        fail: '/error-dash'
      }
    },
    {
      path: '/client',
      component: ClientPage,
      meta: {
        permission: 'client',
      }
    },
    {
      path: '/manager',
      component: ManagerPage,
      meta: {
        permission: 'manager',
      }
    },
    {
      path: '/error',
      component: ErrorPage,
      meta: {
        permission: 'public'
      }
    },
    {
      path: '/error-dash',
      component: ErrorDashPage,
      meta: {
        permission: 'public'
      }
    },
  ]
})

Vue.use(VueAcl, {
  init: 'public',
  router: router,
  fail: '/error',
  save: true
})

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
})

