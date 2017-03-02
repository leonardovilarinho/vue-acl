import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueAcl from 'vue-acl'
import store from './store'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [
  {
    path: '/',
    component: require('./components/Index.vue'),
    meta: {permission: 'admin.any', fail: '/'}
  },
  {
    path: '/foo',
    component: require('./components/Foo.vue'),
    meta: {permission: 'admin.any', fail: '/'}
  },
  {
    path: '/bar',
    component: require('./components/Bar.vue'),
    meta: {permission: 'admin', fail: '/'}
  }
]

const router = new VueRouter({
  routes
})

Vue.use(VueAcl, {router: router, d_permission: 'admin', store: store})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
