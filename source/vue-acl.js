// @ts-check
import { VueConstructor } from 'vue'
import { install } from './install'
import query from './query'

/**
 * @typedef {Object} VueAclParams
 * @property {string} initial
 * @property {Object} router
 * @property {string} notfound
 * @property {function} [rules]
 * @property {Boolean} [acceptLocalRules]
 */

/**  @type {VueAclParams} */
let options = {
  initial: '',
  notfound: '',
  router: {}
}

let Vue

export default {
  install: (_Vue) => {
    Vue = _Vue
    install(_Vue, options)
  },
  Create: class Create {
    /**
     * Constructor
     * @param {VueAclParams} _options 
     */
    constructor(_options) {
      _options.rules = _options.rules(query)
      options = _options
      install(Vue, options)
    }
  }
}
