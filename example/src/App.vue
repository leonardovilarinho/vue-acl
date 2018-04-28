<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    console.log('public', this.$acl.check('isPublic'))
    console.log('admin', this.$acl.check('isAdmin'))

    this.$acl.change('admin')
    console.log('')
    console.log('public', this.$acl.check('isPublic'))
    console.log('admin', this.$acl.check('isAdmin'))

    this.$acl.change(['user'])
    console.log('')
    console.log('public', this.$acl.check('isPublic'))
    console.log('admin', this.$acl.check('isAdmin'))

    this.$acl.change(['user', 'create'])
    console.log('')
    console.log('public', this.$acl.check('isPublic'))
    console.log('admin', this.$acl.check('isAdmin'))

    this.$acl.change('guesta')
    console.log('')
    console.log('public', this.$acl.check('isPublic'))
    console.log('guest', this.$acl.check('isGuest'))
  },
  computed: {
    isGuest () {
      return this.$acl.make('guest').or('public').query()
    }
  }
}
</script>
