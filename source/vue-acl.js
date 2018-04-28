// @ts-check
import { VueConstructor } from 'vue'
import { install } from './install'

/**
 * @typedef {Object} VueAclParams
 * @property {string} initial
 * @property {Object} router
 * @property {string} notfound
 */


export default {
  install,
  Create: class Create {
    /**
     * Constructor
     * @param {VueAclParams} options 
     */
    constructor(options) {
      console.log(options)
    }
  }
}
