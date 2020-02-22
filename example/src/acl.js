import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from '../../source'
import router from './router'

Vue.use(AclInstaller)

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

export default new AclCreate({
  initial: 'public',
  notfound: {
    path: '/error'
  },
  router,
  acceptLocalRules: true,
  globalRules: {
    isAdmin: new AclRule('admin').generate(),
    isPublic: new AclRule('public').or('admin').generate()
  }
})
