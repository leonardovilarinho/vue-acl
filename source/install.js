// @ts-check
import { VueConstructor } from 'vue'
import mixin from './mixin'

/**
 * @function
 * @param {VueConstructor} _Vue
 */
export const install = (_Vue) => {
  _Vue.mixin(mixin)
}