# vue-acl: access control list in vuejs

> We will help you to control the permission of access in your app for yours components and routes 

## Installation

```bash
# yarn
yarn add vue-acl
# npm
npm install vue-acl --save
```

## Get Started

Create the `acl.js` file to define your acl settings and global rules:

```javascript
import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
import router from './router'

Vue.use(AclInstaller)

export default new AclCreate({
  initial: 'public',
  notfound: '/error',
  router,
  acceptLocalRules: true,
  globalRules: {
    isAdmin: new AclRule('admin').generate(),
    isPublic: new AclRule('public').or('admin').generate(),
    isLogged: new AclRule('user').and('inside').generate()
  }
})
```

More details:

- **AclInstaller**: plugin class for install in Vue with Vue.use
- **AclCreate**: class to define acl settings
  - **initial**: first permission, for startup with your app
  - **notfound**: route for 404 error
  - **router**: your VueRouter instance
  - **acceptLocalRules**: if you can define new rules inside vue components
  - **globalRules**: define globals rules for access in routes and any components
- **AclRule**: class with rule builder, the instance receive initial permission.
  - **or**: method for add OR condition in rule, e.g: if current permission is public OR admin the rule isPublic equals true
  - **and**: method for add AND condition in rule, e.g: if current permission contains user AND inside the rule isLogged equals true
  - **generate**: this method should called to create and compile your rule query

In your `router.js` file, you can define permissions for yours routes:

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import { AclRule } from 'vue-acl'

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
        rule: new AclRule('admin').generate()
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
```

More details:
- Define `rule` meta for link a route with a permission, your can use name of the global rule e.g `isPublic` or use `AclRule` for create new rule orr use `*` for define allowed route.

For finish, in your `main.js` import the `acl` and pass to Vue root instance:

```javascript
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
```

## Use in components

If you defined `acceptLocalRules` as `true`, you can define computed properties with new rules, but this rules works only in component:

```javascript
import { AclRule } from 'vue-acl'

export default {
  computed: {
    isLocalRule () {
      return new AclRule('create').generate()
    }
  }
}
```

You can also check rules for display custom elements in your layout:

```html
<button v-if="$acl.not.check('isAdmin')">
  Set admin permisson
</button>
<button v-else>
  Set public permission
</button>
```

E.g: if `isAdmin` is **not** true the button 'Set admin permisson' is displayed.

Finish, you can change current permission in any component using `change` method:

```html
<button v-if="$acl.not.check('isAdmin')" @click="$acl.change('admin')">
  Set admin permisson
</button>
<button v-else @click="$acl.change('public')">
  Set public permission
</button>
```