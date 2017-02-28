# Plugin of Access Control List from Vue JS 2

>This plugin aims to control the layout of the system and block access to certain routes of the vue-router, that according to the current active permission on the system.

### Dependencies:
- VueJS version 2
- vue-router
- Vuex version 2

### Installation

We have two methods of installed, you can use the npm or a standalone.

#### To install with NPM

Use the following command to install as dependency:

    npm install vue-acl --save

#### For standalone installation

To install just copy the file src/Acl.js to your plugins directory.

### Get Started:

**[1]:** The state of your Vuex set a variable called `acl_current`, it defines what the current permission on your system.:

    ...
  	state: {
  	  acl_current: ''
  	}
    ...

**[2]:** Import the plugin and register it on VueJS, it is necessary to send as a parameter the vue router-router, the default system permission and store the Vuex:


    import Store from '../vuex/store'
    import Router from '../routes/router'
    import Acl from 'vue-acl'
    Vue.use( Acl, { router: Router, d_permission: 'any', store: Store } )


**[3]:** Add metadata in their routes saying which permission required to access the route, use dot (.) to separate more than one permission, other metadata used is the ' fail ', which will indicate which route to redirect on error:

  export default [
    { path: '/'                   , component: Example              , meta: { permission: 'admin.any' } },
    { path: '/resource'           , component: Resource             , meta: { permission: 'admin.any', fail: '/' } },
    { path: '/vuex'               , component: Vuex                 , meta: { permission: 'admin', fail: '/' } }
  ]




**[4]:** The components use the global method `can()` to verify that the system gives access to permission passed by parameter:

	<router-link v-show='can("admin.any")' to='/'>Router test</router-link> |
	<router-link v-show='can("admin.any")' to='/resource'>Resource test</router-link> |
	<router-link v-show='can("admin")' to='/vuex'>Vuex test</router-link>

This method receives a parameter with the permissions to check, separated by a dot (.), and returns a `bool` saying if permission has been granted.

To change the current system permission use the global method `checkPermission()`, passing as parameter the new permission:

	this.changeAccess('admin')

**NOTE:** This method is a shortcut for `$store.state.acl_current`

### Contributing

To help in the development and expansion of this repository take a FORK to your account, after you have made your modifications do a PULL REQUEST, it will be parsed and included here since it helps the plugin.

If you prefer, write code to ES5 ES6 and transpile it using the Babel.