'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AclRule = exports.AclCreate = exports.AclInstaller = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vue = require('vue');

var _install2 = require('./install');

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // @ts-check


/**
 * @typedef {Object} VueAclParams
 * @property {string|Array} initial
 * @property {VueRouter} router
 * @property {string} notfound
 * @property {Object} [globalRules]
 * @property {Boolean} [acceptLocalRules]
 */

/**  @type {VueAclParams} */
var options = {
  initial: '',
  router: null,
  notfound: ''

  /** @type {VueConstructor} */
};var Vue = void 0;

var AclInstaller =
/**
   * function for install plugin with Vue.use
   * @param {VueConstructor} _Vue Vue constructor
   */
exports.AclInstaller = function AclInstaller(_Vue) {
  Vue = _Vue;
  (0, _install2._install)(_Vue, options);
};

var AclCreate =
/**
 * Constructor
 * @param {VueAclParams} _options object of settings
 */
exports.AclCreate = function AclCreate(_options) {
  _classCallCheck(this, AclCreate);

  options = _options;
  (0, _install2._install)(Vue, options);
};

var AclRule = exports.AclRule = function () {
  /**
   * Starter query builder
   * @param {string} permission permission initial
   */
  function AclRule(permission) {
    _classCallCheck(this, AclRule);

    this.current = permission;
  }

  /**
   * Add OR condition in permission to builder
   * @param {string} permission permission to add
   * @return {AclRule} rule builder
   */


  _createClass(AclRule, [{
    key: 'or',
    value: function or(permission) {
      this.current += this.current === '' ? permission : '||' + permission;
      return this;
    }

    /**
     * Add AND condition in permission to builder
     * @param {string} permission permission to add
     * @return {AclRule} rule builder
     */

  }, {
    key: 'and',
    value: function and(permission) {
      this.current += this.current === '' ? permission : '&&' + permission;
      return this;
    }

    /**
     * Create array of permissions
     * @return {Array} array of rules
     */

  }, {
    key: 'generate',
    value: function generate() {
      var splitOrs = this.current.split('||');
      return splitOrs.map(function (o) {
        return o.split('&&');
      });
    }
  }]);

  return AclRule;
}();