<template lang="html">
  <div class="">
    <h1>Index</h1>
    <p>Esta é a página inicial da Aplicação.</p>
    <button type="button" name="foo" @click="goFoo()">Go Foo</button>
    <button type="button" name="bar" @click="goBar()">Go Bar</button>
    <button type="button" name="chP" @click="changeAdmin()">Admin</button>
    <button type="button" name="chP" @click="changeUser()">User</button>
  </div>
</template>

<script>
export default {
  name: 'index-component',
  methods: {
    goFoo () {
      this.$router.push('/foo')
    },
    goBar () {
      if (this.$store.state.acl_current === 'admin') {
        console.log('Ok')
      }
      else {
        console.log('Access Denied!')
      }
      this.$router.push('/bar')
    },
    changeAdmin () {
      this.changeAccess('admin')
    },
    changeUser () {
      this.changeAccess('any')
    }
  }
}
</script>

<style lang="css">
</style>
