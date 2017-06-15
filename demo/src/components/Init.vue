<template>
    <div>
        <h1>Welcome the vue-acl demo</h1>
        <small>Accessing with {{ active }}</small>
        <hr>
        <button @click="change('admin')">Change to admin access</button>
        <button @click="change('any')">Change to any access</button>
        <hr>
        <button @click="add('edit')">Add edit permission</button>
        <button @click="add('delete')">Add delete permission</button>
        <hr>
        <router-link to="/">To public page</router-link>
        <hr>
        <router-view></router-view>
    </div>
</template>

<script>
    export default{
        name: 'lv-init',
        data() {
            return {active: this.$access()}
        },
        methods: {
            change(access) {
                this.$access(access)
                this.active = this.$access()

                if (this.$can('admin'))
                    alert('Hello, admin')
                else
                    alert('No is admin')
            },
            add(permission) {
                if (this.active.indexOf(permission) === -1) {
                    this.active.push(permission);
                    this.$access(this.active);
                }
            }
        }
    }
</script>