<template>
  <main>
    <h1>Public Page</h1>
    <button v-if="!$acl.check('isAdmin')" @click="$acl.change('admin')">
      Set admin permisson
    </button>
    <button v-else @click="$acl.change('public')">
      Set public permission
    </button>
  </main>
</template>

<script>
export default {
  name: 'home'
}
</script>
