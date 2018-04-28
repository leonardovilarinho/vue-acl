import Vue from 'vue'
import App from './App.vue'
import router from './router'
import acl from './acl'

Vue.config.productionTip = false

new Vue({
  router,
  acl,
  render: h => h(App)
}).$mount('#app')
