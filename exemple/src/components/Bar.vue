<template lang="html">
  <div class="">
    <h1>Bar</h1>
    <p>Contagem total: {{ count }}</p>
    <button type="button" name="increment" @click="increment()">Increment</button>
    <button type="button" name="index" @click="goIndex()">Go Index</button>
  </div>
</template>

<script>
export default {
  name: 'bar-component',
  methods: {
    goIndex () {
      this.$router.push('/')
    },
    increment () {
      this.$store.commit('increment')
    }
  },
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
</script>

<style lang="css">
</style>
