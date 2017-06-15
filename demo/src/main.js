import Vue from 'vue'
import Init from './components/Init.vue'
import VueRouter from 'vue-router'
import VueAcl from '../../src/es6'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: require('./components/Public.vue'),
    meta: {permission: 'admin|any', fail: '/error'}
  },
  {
    path: '/manager',
    component: require('./components/Manager.vue'),
    meta: {permission: 'admin', fail: '/error'}
  },
  {
    path: '/client',
    component: require('./components/Client.vue'),
    meta: {permission: 'any', fail: '/error'}
  },
  {
    path: '/edit-delete',
    component: require('./components/EditDelete.vue'),
    meta: {permission: 'edit&delete', fail: '/error'}
  },
  {
    path: '/edit-delete-admin',
    component: require('./components/EditDeleteAdmin.vue'),
    meta: {permission: 'edit&delete|admin', fail: '/error'}
  },
  {
    path: '/error',
    component: require('./components/Error.vue'),
    meta: {permission: 'admin|any'}
  },
]

const router = new VueRouter({
  routes
})

Vue.use(VueAcl, {router: router, init: 'any'})

new Vue({
  el: '#app',
  router,
  render: h => h(Init)
})
