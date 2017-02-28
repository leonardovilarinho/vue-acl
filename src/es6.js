"use strict"

class Acl {

	init(router, permission, store) {
		this.router = router
		this._store = store
		if(sessionStorage.getItem('acl_current') == null) {
			sessionStorage.setItem('acl_current', permission)
			this._store.state.acl_current = permission
		} else {
			this._store.state.acl_current = sessionStorage.getItem('acl_current')
		}


	}

	check(permission) {
		if(Array.isArray(permission))
			return (permission.indexOf(this._store.state.acl_current) !== -1) ? true : false
		else
			return this._store.state.acl_current == permission
	}

	set active(active) {
		sessionStorage.setItem('acl_current', active || null)
		this._store.state.acl_current = sessionStorage.getItem('acl_current')
	}

	get active() {
		return this._store.state.acl_current
	}

	set router(router) {
		router.beforeEach((to, from, next) => {
			const fail = to.meta.fail || false
			if(typeof to.meta.permission == 'undefined')
				return next(fail)
			else {
				let permission = (to.meta.permission.indexOf('.') !== -1) ? to.meta.permission.split('.') : to.meta.permission
				if(!this.check(permission))
					return next(fail)
				next()
			}
		})
	}
}

let acl = new Acl()

Acl.install = function(Vue, {router, d_permission, store}) {
	acl.init(router, d_permission, store)

	Vue.prototype.can = function(permission) {
		if(typeof permission != 'undefined')
			permission = (permission.indexOf('.') !== -1) ? permission.split('.') : permission
		return acl.check(permission)
	}

	Vue.prototype.changeAccess = function(newAccess) {
		acl.active = newAccess
	}

}

export default Acl
