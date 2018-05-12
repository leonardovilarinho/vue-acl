<template>
  <div id="app">
    <header>
      <router-link to="/">Public page</router-link> |
      <router-link to="/admin">Admin page</router-link>
    </header>

    {{ $acl.get }}

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
