// @ts-check
import { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import { register } from './mixin'

/**
 * @typedef {Object} VueAclParams
 * @property {string|Array} initial
 * @property {VueRouter} router
 * @property {string} notfound
 * @property {Object} [globalRules]
 * @property {Boolean} [acceptLocalRules]
 */

/**
 * Function for install plugin with Vue.use
 * @function
 * @param {VueConstructor} _Vue
 * @param {VueAclParams} options
 */
export const _install = (_Vue, options) => {
  const { initial, acceptLocalRules, globalRules, router, notfound } = options

  _Vue.mixin(
    register(
      initial,
      acceptLocalRules || false,
      globalRules || {},
      router,
      notfound
    )
  )
}