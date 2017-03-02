<template lang="html">
  <div class="">
    <h1>Foo</h1>
    <button type="button" name="foo" @click="goIndex()">Go Index</button>
  </div>
</template>

<script>
export default {
  name: 'foo-component',
  methods: {
    goIndex () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="css">
</style>
