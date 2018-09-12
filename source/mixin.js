// @ts-check
import EventBus from 'vue-e-bus'
import Vue from 'vue'

import { testPermission } from './checker'
import VueRouter from 'vue-router'

/** @type {Array} */
let currentGlobal = []
let not = false

EventBus.$on('vueacl-permission-changed', (newPermission) => {
        currentGlobal = newPermission
      })

/**
 * Register all plugin actions
 * 
 * @param {string|Array} initial initial permission
 * @param {boolean} acceptLocalRules if accept local rules
 * @param {Object} globalRules definition of global rules
 * @param {VueRouter} router router object
 * @param {string} notfound path for 404 error
 */
export const register = (initial, acceptLocalRules, globalRules, router, notfound) => {
  currentGlobal = Array.isArray(initial) ? initial : [initial]

  if (router !== null) {
    router.beforeEach((to, from, next) => {

      if (to.path === notfound) return next()

      /** @type {Array} */
      if (!('rule' in to.meta)) {
        return console.error(`[vue-acl] ${to.path} not have rule`)
      }
      let routePermission = to.meta.rule

      if (routePermission in globalRules) {
        routePermission = globalRules[routePermission]
      }

      if (!testPermission(currentGlobal, routePermission)) return next(notfound)
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
         * Change current language
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

      EventBus.$on('vueacl-permission-changed', (newPermission) => {
        currentGlobal = newPermission
        this.$forceUpdate()
      })
    }
  }
}
