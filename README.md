# Plugin of Access Control List from Vue JS 2

>This plugin aims to control the layout of the system and block access to certain routes of the vue-router, that according to the current active permission on the system.

### Dependencies:
- Vue.js version 2
- vue-router

### Installation

We have two methods of installed, you can use the npm or a standalone.

#### To install with NPM

Use the following command to install as dependency:
```bash
npm install vue-acl --save
```
#### For standalone installation

To install just copy the file `source/vue-acl.js` to your plugins directory.

### Get Started:

**[1]:** Import the plugin and register it on VueJS, it is necessary to send as a parameter the vue router-router and the default system permission:

```js
import Router from '../routes/router'
import Acl from 'vue-acl'
Vue.use( Acl, { router: Router, init: 'public' } )
```

**[2]:** Add metadata in their routes saying which permission, or group of permissions is required to access the route, use pipe (|) to do an OR check for more than one permission, use (&) to do an AND check for multiple permissions (these can be used in combination for more complex situations). Use the ' fail ' metadata to indicate which this route to redirect on error:
```js
[
  {
    path: '/',
    component: require('./components/Public.vue'),
    meta: {
      permission: 'public',
      fail: '/error-public'
    }
  },
  {
    path: '/manager',
    component: require('./components/Manager.vue'),
    meta: {
      permission: 'manager',
    }
  },
  {
    path: '/client',
    component: require('./components/Client.vue'),
    meta: {
      permission: 'client',
    }
  },
  {
    path: '/error',
    component: require('./components/Error.vue'),
    meta: {
      permission: 'public'
    }
  },
]
```

*Note1:* Use `public` permission to users not logged, the `vue-acl` handler automatic this route to public users.

*Note2:* Use `fail` to declare redirect error excluvise to this route.

#### Use public fail route

Use `Vue.use( Acl, { router: Router, init: 'public', fail: '/error' } )` to redirect default erros to `/error` route.

#### Save permission to refresh page

Use flag `save` to save permission in SessionStorage, but your app can insecure. Example: `Vue.use( Acl, { router: Router, init: 'public', save: true } )`


**[3]:** The components use the global method `$can()` to verify that the system gives access to permission passed by parameter:

```vue
<router-link v-show='$can("client|manager")'  to='/client'>To client</router-link> |
<router-link v-show='$can("manager")'         to='/manager'>To manager</router-link> |
<router-link v-show='$can("public")'          to='/'>To Public</router-link>
```

This method receives a parameter with the permissions to check, separated by a pipe (|) or ampersand (&), and returns a `bool` saying if permission has been granted.

To change the current system permission use the global attribute `access`, passing the new permission, or array of permissions:
```js
 this.access = 'admin'
```
or:
```js
 this.access = ['edit', 'delete']
```
or with & operator:
```js
 this.access = 'edit&delete'
```

To see the current system permission, just print `this.access` variable.

### Contributing

To help in the development and expansion of this repository take a FORK to your account, after you have made your modifications do a PULL REQUEST, it will be parsed and included here since it helps the plugin.

Before send PR, run `npm run build` to transpile es6 to es5 code.