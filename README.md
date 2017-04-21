# Plugin of Access Control List from Vue JS 2

>This plugin aims to control the layout of the system and block access to certain routes of the vue-router, that according to the current active permission on the system.

### Dependencies:
- VueJS version 2
- vue-router

### Installation

We have two methods of installed, you can use the npm or a standalone.

#### To install with NPM

Use the following command to install as dependency:

    npm install vue-acl --save

#### For standalone installation

To install just copy the file `src/es6.js` to your plugins directory.

### Get Started:

**[1]:** Import the plugin and register it on VueJS, it is necessary to send as a parameter the vue router-router and the default system permission:


    import Router from '../routes/router'
    import Acl from 'vue-acl'
    Vue.use( Acl, { router: Router, init: 'any' } )


**[2]:** Add metadata in their routes saying which permission required to access the route, use pipe (|) to separate more than one permission, other metadata used is the ' fail ', which will indicate which route to redirect on error:

    [
      {
        path: '/',
        component: require('./components/Public.vue'),
        meta: {permission: 'admin|any', fail: '/error'}
      },
      {
        path: '/manager',
        component: require('./components/Manager.vue'),
        meta: {permission: 'admin', fail: '/error'}
      },
      {
        path: '/client',
        component: require('./components/Client.vue'),
        meta: {permission: 'any', fail: '/error'}
      },
      {
        path: '/error',
        component: require('./components/Error.vue'),
        meta: {permission: 'admin|any'}
      },
    ]




**[3]:** The components use the global method `$can()` to verify that the system gives access to permission passed by parameter:

    <router-link v-show='$can("any")' to='/client'>To client</router-link> |
    <router-link v-show='$can("admin")' to='/manager'>To manager</router-link> |
    <router-link v-show='$can("admin|any")' to='/'>To Public</router-link>

This method receives a parameter with the permissions to check, separated by a pipe (|), and returns a `bool` saying if permission has been granted.

To change the current system permission use the global method `$access()`, passing as parameter the new permission:

	 this.$access('admin')

To see the current system permission, just call the `$access()` method with no parameter.

### Contributing

To help in the development and expansion of this repository take a FORK to your account, after you have made your modifications do a PULL REQUEST, it will be parsed and included here since it helps the plugin.

If you prefer, write code ES5 and transpile to ES6 using the Babel.

Node dependencies need to be written in ES5, but chose to write the plugin in ES6, using so the Babel to convert the code:

https://babeljs.io/repl/

### Demo
To install demo run:

    npm run demo:install

To execute, run:

    npm run demo