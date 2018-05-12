import Vue from 'vue'

/**
 * @typedef {Object} Options
 * @property {string|Array} initial initial permission
 * @property {boolean} acceptLocalRules if accept local rules
 * @property {Object} globalRules definition of global rules
 * @property {VueRouter} router router object
 * @property {string} notfound path for 404 error
 */

export class Acl {
  /**
   * @param {Options} options 
   */
  constructor(options) {
    this.options = options
    const { initial } = this.options

    this.vm = new Vue({
      data: () => ({
        access: Array.isArray(initial) ? initial : [initial]
      })
    })
  }
}
