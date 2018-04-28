// @ts-check

/**
 * @typedef {Object} VueAclCreate
 * @property {string} initial
 * @property {Object} router
 * @property {string} notfound
 */


export class Create {
  /**
   * Constructor
   * @param {VueAclParams} options 
   */
  constructor (options) {
    console.log(options)
  }

  /**
   * Change current language
   * @param {string|Array} param 
   */
  change (param) {
    console.log('trocando', param)
  }
}