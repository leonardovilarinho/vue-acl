import Vue from 'vue'
import Router from 'vue-router'
import { AclRule } from '../../source'

import Public from './views/Public.vue'
import Admin from './views/Admin.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'public',
      component: Public,
      meta: {
        rule: 'isPublic'
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        rule: new AclRule('write').generate()
      }
    },
    {
      path: '/error',
      name: 'notfound',
      component: NotFound,
      meta: {
        rule: '*'
      }
    }
  ]
})
