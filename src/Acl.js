"use strict"

class Acl {

  init(router, permission, store) {
    this.router = router
    this._store = store
    this._store.state.acl_current = permission
  }

  check(permission) {
    if(Array.isArray(permission))
      return (permission.indexOf(this._store.state.acl_current) !== -1) ? true : false
    else
      return this._store.state.acl_current == permission
  }

  set active(active) {
    this._store.state.acl_current = active || null
  }

  get active() {
    return this._store.state.acl_current
  }

  set router(router) {
    router.beforeEach((to, from, next) => {
      let permission = (to.meta.permission.indexOf('.') !== -1) ? to.meta.permission.split('.') : to.meta.permission
      if(!this.check(permission))
        return false
      next()
    })
  }
}

let acl = new Acl()

Acl.install = function(Vue, {router, d_permission, store}) {
  acl.init(router, d_permission, store)

  Vue.prototype.can = function(permission) {
    permission = (permission.indexOf('.') !== -1) ? permission.split('.') : permission
    return acl.check(permission)
  }

  Vue.prototype.changeAccess = function(newAccess) {
    acl.active = newAccess
  }

}

export default Acl
