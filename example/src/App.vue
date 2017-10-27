<template>
  <div id="app">

    <header class="navbar">
      <div class="brand">
        <strong>{{ access }}</strong>
      </div>
      <div class="pages">
        <router-link :class="inPage('/')"         v-show="$can('public')"         to="/">Home Page</router-link>
        <router-link :class="inPage('/dash')"     v-show="$can('client|manager')" to="/dash">Dash Page</router-link>
        <router-link :class="inPage('/client')"   v-show="$can('client')"         to="/client">Client Page</router-link>
        <router-link :class="inPage('/manager')"  v-show="$can('manager')"        to="/manager">Manager Page</router-link>
      </div>
      <div class="access">
        <a :class="inPermission('public')"              @click.prevent="access = 'public'">Is public</a>
        <a :class="inPermission('client&edit')"         @click.prevent="access = 'client&edit'">Is client</a>
        <a :class="inPermission('manager&edit&delete')" @click.prevent="access = 'manager&edit&delete'">Is manager</a>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    inPermission(perm) {
      if(this.$can(perm))
        return 'selected'
      return ''
    },
    inPage(link) {
      if(this.$route.path == link)
        return 'selected'
      return ''
    }
  }
}
</script>

<style>
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
}

.navbar {
  display: flex;
  width: 100%;
  border-bottom: 1px solid  #42b983;
}

.navbar .brand {
  flex-grow: 1;
  padding: 10px 0px;
  background: ;
}

.navbar .pages {
  flex-grow: 2;
  padding: 10px 0px;
  background: #2c3e50;
}

.navbar .access {
  flex-grow: 2;
  padding: 10px 0px;
  background: #42b983;
}

a {
  padding: 2px;
  color: #ffffff;
  text-decoration: none;
  border: 1px solid #fff;
  cursor: pointer;
}

a.selected {
  background: rgba(255, 255, 255, .5) !important;
}

a:target:not(.selected), a:hover:not(.selected) {
  background: rgba(255, 255, 255, .5);
}

</style>
