// @ts-check
import { VueConstructor } from 'vue'
import mixin from './mixin'

/**
 * @typedef {Object} VueAclParams
 * @property {string} initial
 * @property {Object} router
 * @property {string} notfound
 * @property {Object} [rules]
 * @property {Boolean} [acceptLocalRules]
 */

/**
 * @function
 * @param {VueConstructor} _Vue
 * @param {VueAclParams} options
 */
export const install = (_Vue, options) => {
  const { initial, acceptLocalRules, rules } = options
  _Vue.mixin(mixin(initial, acceptLocalRules || false, rules || {}))
}