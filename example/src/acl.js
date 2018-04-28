import Vue from 'vue'
import VueAcl from '../../source/vue-acl'
import router from './router'

Vue.use(VueAcl)

export default new VueAcl.Create({
  initial: 'public',
  notfound: '/e404',
  router,
  acceptLocalRules: true,
  rules: (acl) => ({
    isAdmin: acl('admin').or('user').and('create').query(),
    isPublic: acl('public').query()
  })
  // v-show="$acl('isAdmin')"
})
