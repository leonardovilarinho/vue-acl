<template>
  <div id="app">
    <header>
      <router-link to="/">Public page</router-link> |
      <router-link to="/admin">Admin page</router-link>
    </header>

    <section style="display: flex; padding: 10px">
      <button @click="$acl.change(['read', 'write'])">Turn admin</button>
      <button @click="$acl.change('read')">Turn public</button>
    </section>

    <p style="padding: 10px">Current permission: {{ $acl.get }}</p>

    <hr>
    <p><small>Page content:</small></p>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
