<template>
    <section>
        <h1>Dash Page</h1>
        <p>You can:</p>
        <ul>
            <li v-show="$can('edit')">Edit items</li>
            <li v-show="$can('delete')">Delete items</li>
        </ul>
    </section>
</template>

<script>
export default {
    name: 'DashPage'
}
</script>