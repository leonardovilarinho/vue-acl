// @ts-check
import Vue from 'vue'

import { testPermission } from './checker'




const EventBus = new Vue()

let currentGlobal = []
let not = false


export const register = (initial, acceptLocalRules, globalRules, router, notfound, middleware) => {
  currentGlobal = Array.isArray(initial) ? initial : [initial]

  if (router !== null) {
    router.beforeEach(async (to, from, next) => {
      if (middleware) {
        await middleware({change (a) {
          currentGlobal = a
        }})
      }

      // to be backwards compatible (notfound could be string)
      const notFoundPath = notfound.path || notfound;
      if (to.path === notFoundPath) return next()

      /** @type {Array} */
      if (!('rule' in to.meta)) {
        return console.error(`[vue-acl] ${to.path} not have rule`)
      }
      let routePermission = to.meta.rule

      if (routePermission in globalRules) {
        routePermission = globalRules[routePermission]
      }

      if (!testPermission(currentGlobal, routePermission)) {
        // check if forwardQueryParams is set
        if (notfound.forwardQueryParams) {
          return next({path: notFoundPath, query: to.query})
        }
        return next(notFoundPath)
      }
      return next()
    })
  }

  return {
    /**
     * Called before create component
     */
    beforeCreate () {
      const self = this

      this.$acl = {
        /**
         * Change current permission
         * @param {string|Array} param
         */
        change(param) {
          param = Array.isArray(param) ? param : [param]
          if (currentGlobal.toString() !== param.toString()) {
            EventBus.$emit('vueacl-permission-changed', param)
          }
        },

        /**
         * get current permission
         */
        get get () {
          return currentGlobal
        },

        /**
         * reverse current acl check
         */
        get not() {
          not = true
          return this
        },

        /**
         * Check if rule is valid currently
         * @param {string} ruleName rule name
         */
        check(ruleName) {
          const hasNot = not
          not = false

          if (ruleName in globalRules) {
            const result = testPermission(this.get, globalRules[ruleName])
            return hasNot ? !result : result
          }


          if (ruleName in self) {
            if (!acceptLocalRules) {
              return console.error('[vue-acl] acceptLocalRules is not enabled')
            }

            const result = testPermission(this.get, self[ruleName])
            return hasNot ? !result : result
          }

          return false
        }
      }
    },
    created () {
      EventBus.$on('vueacl-permission-changed', this.vue_aclOnChange)
    },
    destroyed() {
      EventBus.$off('vueacl-permission-changed', this.vue_aclOnChange)
    },
    methods: {
      vue_aclOnChange (newPermission) {
        currentGlobal = newPermission
        if ('onChange' in this.$acl) {
          this.$acl.onChange(currentGlobal)
        }
        this.$forceUpdate()
      }
    }
  }
}
