'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._install = undefined;

var _vue = require('vue');

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _mixin = require('./mixin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var _install = exports._install = function _install(_Vue, options) {
  var initial = options.initial,
      acceptLocalRules = options.acceptLocalRules,
      globalRules = options.globalRules,
      router = options.router,
      notfound = options.notfound;


  _Vue.mixin((0, _mixin.register)(initial, acceptLocalRules || false, globalRules || {}, router, notfound));
}; // @ts-check