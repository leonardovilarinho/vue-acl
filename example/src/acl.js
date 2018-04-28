import Vue from 'vue'
import VueAcl from '../../source/vue-acl'
import router from './router'

Vue.use(VueAcl)

export default new VueAcl.Create({
  initial: 'public',
  router,
  notfound: '/e404'
})
