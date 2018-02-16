<template>
  <div id="app">
    <header class="header-page">
      <section class="github-panel">
        <a class="github-button" href="https://github.com/leonardovilarinho/vue-acl" data-icon="octicon-star" data-show-count="true" aria-label="Star leonardovilarinho/vue-acl on GitHub">Star</a>
        <a class="github-button" href="https://github.com/leonardovilarinho/vue-acl/fork" data-icon="octicon-repo-forked" data-show-count="true" aria-label="Fork leonardovilarinho/vue-acl on GitHub">Fork</a>
      </section>

      <h1>vue-acl</h1>
      <h2>Have control over your users.</h2>
    </header>

    <nav>
      <small>No Vuex. No server. No difficulty. Only 4kb</small>
    </nav>

    <main>
      <section>
        <header>Why</header>
        <article>
          <p>The most from web systems is complex, with multiple users types, therefore it your management it will be very laborious and slow. If you have a Vue.js application and want control your user permissions, we go help you!</p>

          <p>With simplicity and this plugin your earn power over your permissions <span class="love">●﹏●</span></p>
        </article>
      </section>

      <section>
        <header>Install</header>
        <article>
          <p>You can install <i>vue-acl</i> with the <i>npm</i>:</p>

          <pre v-highlightjs>
            <code class="shell">npm install vue-acl --save</code>
          </pre>

          Or get with download <a href="https://raw.githubusercontent.com/leonardovilarinho/vue-acl/master/dist/vue-acl.js">this file</a>.
        </article>
      </section>

      <section>
        <header>Setup</header>
        <article>
          <p>Let's go it, with your Vue application opened and your VueRouter installed and configured. Modify your <strong>setup</strong> file, let it as follows:</p>

          <pre v-highlightjs>
            <code class="javascript">import Vue from 'vue'
import VueAcl from 'vue-acl'

Vue.use(VueAcl, { router: /*router-instance*/, init: 'public' })</code>
          </pre>

          <p>We use the <i>init</i> attribute for define default permission from your website, you can define any name unique for your permissions.</p>

          <p>The router instance is same from Vue Router, but we need define an permission for each route. See how the routes definitions must be:</p>

          <pre v-highlightjs>
            <code class="javascript">routes: [
  { path: '/'    , component: Login, meta: { permission: 'public' } },
  { path: '/home', component: Home , meta: { permission: 'client' } }
]</code>
          </pre>

          <p>Like this only <i>client</i>s can access the internal environment from system, but all the <i>public</i> can see login page <span class="love">◕‿◕</span></p>
        </article>
      </section>

      <section>
        <header>Usage</header>
        <article>
          <p>We're almost finished<span class="love"> ¯\_(ツ)_/¯</span>, after configure and import <i>vue-acl</i>, you can use <strong>$can</strong> method for handle elements in your screen. For example, hidden the manager menu to clients users, and display to managers users:</p>
          <pre v-highlightjs>
            <code class="html">&lt;router-link v-show="$can('client')" to="/profile"&gt;Profile&lt;/router-link&gt;
&lt;router-link v-show="$can('manager')" to="/manager"&gt;Manager&lt;/router-link&gt;</code>
          </pre>

          <p>In any component, you too can use <strong>access</strong> variable for get or change current permission:</p>

          <pre v-highlightjs>
            <code class="html">&lt;h1&gt;Current permission: {{ accessVar }}&lt;/h1&gt;</code>
          </pre>

          <pre v-highlightjs>
            <code class="javascript">alert(`Current permission: ${this.access}`)
this.access = 'new-permission'</code>
          </pre>
        </article>
      </section>

      <section>
        <header>Advance Usage</header>
        <article>
          <p>If you want be the king of acl in Vue, read more this doc...</p>

          <p>The vue-acl allows you work with multiple permissions same time, use <strong>&</strong> (AND) or <strong>|</strong> (OR) character to create or validate permissions unions. Now your user can be a chameleon, a client and a manager same time, see:</p>

          <pre v-highlightjs>
            <code class="javascript">this.access = 'client&manager'
//or
this.access = ['client', 'manager']</code>
          </pre>

           <pre v-highlightjs>
            <code class="html">&lt;router-link v-show="$can('client|manager')" to="/profile"&gt;Profile&lt;/router-link&gt;</code>
          </pre>

          <p>To finish off, you can define some input attributes in vue-acl declaration:</p>

          <ul>
            <li>The <strong>fail</strong> attribute can used to define the route called case the current user can't access current page, this attribute can used in route object, for an fail page specific.</li>
            <li>The <strong>save</strong> attribute can used to define if your current permission be stored in SessionStorage. <span class="love" style="font-size:11pt">(not recommend)</span></li>
          </ul>
        </article>
      </section>

    </main>

    <footer>
      Made with <span class="love">♥</span> by <a href="https://github.com/leonardovilarinho">Leonardo Vilarinho</a>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'VueAclDocs',
  data: () => ({
    accessVar: '{{ access }}'
  })
}
</script>

<style lang="css">

.github-panel {
  float: right;
  padding: 5px;
}

.header-page {
  min-width: 100%;
  min-height: 20vh;
  text-align: center;
  background: linear-gradient(to left, #41b883 , #7cddb1);
  color: #fff;
}

.header-page > h1, .header-page > h2 {
  letter-spacing: 2px;
  margin: 0;
}

.header-page > h1 {
  font-weight: 600;
  padding: 5% 0% 0% 0%;
  font-size: 46pt;
}

.header-page > h2 {
  font-weight: 300;
  padding: 0% 0% 5% 0%;
  opacity: 0.9;
  font-size: 16pt;
}

nav {
  display: block;
  background: linear-gradient(to right, #35495e, #5c758e);
  padding: 1%;
  color: #fff;
  text-align: center;
}

nav > small {
  font-size: 16pt;
}

@media only screen and (min-width: 768px) {
  main {
    margin: 1% 24% 2% 24%;
  }
}

main > section {
  margin: 0;
  padding: 1% 2%;
}

main > section > header {
  color: #41b883;
  font-size: 24pt;
  margin-bottom: 4%;
  letter-spacing: 1px;
}

main > section > article {
  text-align: justify;
  text-justify: inter-word;
}

main > section > article > p {
  margin-bottom: 4px;
}

footer {
  display: block;
  text-align: center;
  letter-spacing: 1px;
  padding: 2%;
  color: #35495e;
}

footer > a, a {
  color: #41b883;
  text-decoration: none;
}

.love {
  color: #d33b3b;
  font-size: 18pt;
}

pre {
  margin: 0;
}

</style>
