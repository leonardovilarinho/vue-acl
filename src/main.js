import Vue from 'vue'
import VueAcl from 'vue-acl'

import App from './App.vue'
import router from './router'

Vue.use(VueAcl, { router, init: 'public', error: '/e404' })

import VueHighlightJS from 'vue-highlightjs'
Vue.use(VueHighlightJS)

new Vue({
  el: '#app',
  render: h => h(App)
})
