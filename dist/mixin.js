'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = undefined;

var _vueEBus = require('vue-e-bus');

var _vueEBus2 = _interopRequireDefault(_vueEBus);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _checker = require('./checker');

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @type {Array} */
// @ts-check
var currentGlobal = [];
var not = false;

var permissionChanged = function permissionChanged(newPermission) {
  currentGlobal = newPermission;
  this.$forceUpdate();
};

_vueEBus2.default.$on('vueacl-permission-changed', permissionChanged);

/**
 * Register all plugin actions
 * 
 * @param {string|Array} initial initial permission
 * @param {boolean} acceptLocalRules if accept local rules
 * @param {Object} globalRules definition of global rules
 * @param {VueRouter} router router object
 * @param {string} notfound path for 404 error
 */
var register = exports.register = function register(initial, acceptLocalRules, globalRules, router, notfound) {
  currentGlobal = Array.isArray(initial) ? initial : [initial];

  if (router !== null) {
    router.beforeEach(function (to, from, next) {

      if (to.path === notfound) return next();

      /** @type {Array} */
      if (!('rule' in to.meta)) {
        return console.error('[vue-acl] ' + to.path + ' not have rule');
      }
      var routePermission = to.meta.rule;

      if (routePermission in globalRules) {
        routePermission = globalRules[routePermission];
      }

      if (!(0, _checker.testPermission)(currentGlobal, routePermission)) return next(notfound);
      return next();
    });
  }

  return {
    /**
     * Called before create component
     */
    beforeCreate: function beforeCreate() {
      var self = this;

      this.$acl = {
        /**
         * Change current permission
         * @param {string|Array} param 
         */
        change: function change(param) {
          param = Array.isArray(param) ? param : [param];

          if (currentGlobal.toString() !== param.toString()) {
            _vueEBus2.default.$emit('vueacl-permission-changed', param);
          }
        },


        /**
         * get current permission
         */
        get get() {
          return currentGlobal;
        },

        /**
         * reverse current acl check
         */
        get not() {
          not = true;
          return this;
        },

        /**
         * Check if rule is valid currently
         * @param {string} ruleName rule name
         */
        check: function check(ruleName) {
          var hasNot = not;
          not = false;

          if (ruleName in globalRules) {
            var result = (0, _checker.testPermission)(this.get, globalRules[ruleName]);
            return hasNot ? !result : result;
          }

          if (ruleName in self) {
            if (!acceptLocalRules) {
              return console.error('[vue-acl] acceptLocalRules is not enabled');
            }

            var _result = (0, _checker.testPermission)(this.get, self[ruleName]);
            return hasNot ? !_result : _result;
          }

          return false;
        }
      };

      _vueEBus2.default.$on('vueacl-permission-changed', permissionChanged);
    },
    beforeDestroy: function beforeDestroy() {
      _vueEBus2.default.$off('vueacl-permission-changed', permissionChanged);
    }
  };
};