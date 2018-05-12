// @ts-check
import { VueConstructor } from 'vue'
import { _install } from './install'
import VueRouter from 'vue-router'

/**
 * @typedef {Object} VueAclParams
 * @property {string|Array} initial
 * @property {VueRouter} router
 * @property {string} notfound
 * @property {Object} [globalRules]
 * @property {Boolean} [acceptLocalRules]
 */

/**  @type {VueAclParams} */
let options = {
  initial: '',
  router: null,
  notfound: ''
}

/** @type {VueConstructor} */
let Vue

export const AclInstaller = 
/**
   * function for install plugin with Vue.use
   * @param {VueConstructor} _Vue Vue constructor
   */
(_Vue) => {
  Vue = _Vue
  _install(_Vue, options)
}

export class AclCreate {
  /**
   * Constructor
   * @param {VueAclParams} _options object of settings
   */
  constructor(_options) {
    options = _options
    _install(Vue, options)
  }
}
  
export class AclRule {
  /**
   * Starter query builder
   * @param {string} permission permission initial
   */
  constructor(permission) {
    this.current = permission
  }

  /**
   * Add OR condition in permission to builder
   * @param {string} permission permission to add
   * @return {AclRule} rule builder
   */
  or(permission) {
    this.current += this.current === '' ? permission : `||${permission}`
    return this
  }

  /**
   * Add AND condition in permission to builder
   * @param {string} permission permission to add
   * @return {AclRule} rule builder
   */
  and(permission) {
    this.current += this.current === '' ? permission : `&&${permission}`
    return this
  }

  /**
   * Create array of permissions
   * @return {Array} array of rules
   */
  generate() {
    const splitOrs = this.current.split('||')
    return splitOrs.map(o => o.split('&&'))
  }
}