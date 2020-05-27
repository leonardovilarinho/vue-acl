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

    <p style="padding: 10px">
      Current permission: {{ $acl.get }}.
      <span v-if="$acl.check('isLocalRule')">This span can be seen if have 'write' permission.</span>
    </p>

    <p style="padding: 10px" v-if="$acl.check($router.currentRoute.meta.rule)">Always Ture
    </p>

    <section style="display: flex; padding: 10px">
      <button @click="assignCheckConditionToWriteOnly()">Change check condition to 'write only'</button>
      <button
        @click="assignCheckConditionToReadAndWrite()"
      >Change check condition to 'read and write'</button>
      <button @click="assignCheckConditionToReadOrWrite()">Change check condition to 'read or write'</button>
    </section>

    <p style="padding-left: 10px">Current check condition is: '{{ checkRuleInfo }}'</p>
    <p style="padding-left: 10px">Check result is: '{{ $acl.check(checkRuleVariable) }}'</p>

    <hr />
    <p>
      <small>Page content:</small>
    </p>
    <router-view />
  </div>
</template>

<script>
import { AclRule } from "../../source";
export default {
  name: "App",
  data() {
    return {
      checkRuleVariable: null,
      checkRuleInfo: ""
    };
  },
  computed: {
    isLocalRule() {
      return new AclRule("write").generate();
    }
  },
  methods: {
    assignCheckConditionToWriteOnly() {
      this.checkRuleVariable = new AclRule("write").generate();
      this.checkRuleInfo = "write only";
    },
    assignCheckConditionToReadAndWrite() {
      this.checkRuleVariable = new AclRule("read").and("write").generate();
      this.checkRuleInfo = "read and write";
    },
    assignCheckConditionToReadOrWrite() {
      this.checkRuleVariable = new AclRule("read").or("write").generate();
      this.checkRuleInfo = "read or write";
    }
  }
};
</script>
