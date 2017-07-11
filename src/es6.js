"use strict"

class Acl {

    init(router, permissions) {
        this.router = router
        this.permissions = Array.isArray(permissions) ? permissions : [permissions]
    }

    check(permission) {
        if (typeof permission != 'undefined') {
            const permissions = (permission.indexOf('|') !== -1) ? permission.split('|') : [permission]

            return permissions.find((permission) => {
                    const needed = (permission.indexOf('&') !== -1) ? permission.split('&') : permission

                    if (Array.isArray(needed)) {
                        return needed.every(need => {
                            return this.permissions.indexOf(need) !== -1
                        });
                    }

                    return (this.permissions.indexOf(needed) !== -1) ? true : false
                }) !== undefined;
        }
        return false;
    }

    set router(router) {
        router.beforeEach((to, from, next) => {
            const fail = to.meta.fail || '/'
            if (typeof to.meta.permission == 'undefined')
                return next(fail)
            else {
                if (!this.check(to.meta.permission))
                    return next(fail)
                next()
            }
        })
    }
}

let acl = new Acl()

Acl.install = function (Vue, {router, init}) {

    acl.init(router, init)

    Vue.prototype.$can = function (permission) {
        return acl.check(permission)
    }

    Vue.prototype.$access = function (newAccess = null) {
        if (newAccess != null) {
            if (Array.isArray(newAccess))
                acl.permissions = newAccess
            else if (newAccess.indexOf('&') !== -1)
                acl.permissions = newAccess.split('&')
            else
                acl.permissions = [newAccess]
        }
        else
            return acl.permissions
    }
}

export default Acl
