"use strict"

class Acl {

    init(router, permissions, fail, save) {
        this.router = router
        this.save = save
        const perms = window.sessionStorage.getItem('vue-acl-permissions')
        if(perms != null)
            permissions = atob(perms)

        this.permissions = this.clearPermissions(permissions)
        this.savePermissions()
        this.fail = fail
    }

    check(permission) {
        
        if (permission == undefined)
            return false
        
        const permissions = (permission.indexOf('|') !== -1) ? permission.split('|') : [permission]
            
        return this.findPermission(permissions) !== undefined;
    }

    findPermission(pem) {
        return pem.find((permission) => {
            const needed = (permission.indexOf('&') !== -1) ? permission.split('&') : permission
            if (Array.isArray(needed))
                return needed.every( need => (this.permissions.indexOf(need) !== -1) )

            return this.permissions.indexOf(needed) !== -1
        })
    }

    clearPermissions(permissions) {
        if (permissions.indexOf('&') !== -1)
            permissions = permissions.split('&')

        return Array.isArray(permissions) ? permissions : [permissions]
    }

    savePermissions() {
        if(this.save != true)
            return

        let perm = this.permissions
        if (Array.isArray(this.permissions))
            perm = this.permissions.join('&')

        window.sessionStorage.setItem('vue-acl-permissions', btoa(perm))
    }

    set router(router) {
        router.beforeEach((to, from, next) => {
            if(to.meta.permission == 'public')
                return next()

            let fail = to.meta.fail || this.fail || from.fullPath

            if (!this.check(to.meta.permission))
                return next(fail)

            return next()
        })
    }
}

let acl = new Acl()

Acl.install = (Vue, {router, init, fail, save}) => {

    const bus = new Vue()

    acl.init(router, init, fail, save)

    Vue.prototype.$can = (permission) => acl.check(permission)

    Vue.mixin({
        data() {
            return {
                access: acl.clearPermissions(init)
            }
        },
        watch: {
            access(value) {
                acl.permissions = acl.clearPermissions(value)
                bus.$emit('access-changed', acl.permissions)
                acl.savePermissions()
                this.$forceUpdate()
            }
        },
        mounted() {
            bus.$on('access-changed', (permission) => this.access = permission)
        }
    })
}

export default Acl
