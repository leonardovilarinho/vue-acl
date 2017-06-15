<template>
    <div>
        <h1>Welcome to public page</h1>
        <hr>
        <router-link to="/manager">To manager page</router-link>
        <router-link to="/client">To client page</router-link>
        <router-link to="/edit-delete">To edit and delete page</router-link>
        <router-link to="/edit-delete-admin">To edit and delete or manager page</router-link>
    </div>
</template>

<script>
    export default{
        name: 'lv-public',
    }
</script>