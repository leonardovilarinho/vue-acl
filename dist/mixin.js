'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = undefined;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _checker = require('./checker');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var EventBus = new _vue2.default();

var currentGlobal = [];
var not = false;

var register = exports.register = function register(initial, acceptLocalRules, globalRules, router, notfound, middleware) {
  currentGlobal = Array.isArray(initial) ? initial : [initial];

  if (router !== null && middleware) {
    router.beforeEach(async function (to, from, next) {

      await middleware({
        change: function change(a) {
          currentGlobal = a;
        }
      });

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
      var _this = this;

      var self = this;

      this.$acl = {
        /**
         * Change current permission
         * @param {string|Array} param 
         */
        change: function change(param) {
          param = Array.isArray(param) ? param : [param];

          if (currentGlobal.toString() !== param.toString()) {
            EventBus.$emit('vueacl-permission-changed', param);
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

      EventBus.$on('vueacl-permission-changed', function (newPermission) {
        currentGlobal = newPermission;
        _this.$forceUpdate();
      });
    },
    beforeDestroy: function beforeDestroy() {
      EventBus.$off('vueacl-permission-changed');
    }
  };
};