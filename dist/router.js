'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upRouter = undefined;

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _checker = require('./checker');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Up vue router middleware
 * @param {VueRouter} router  router object
 * @param {Array} currentGlobal global current permissions
 * @param {string} notfound not fount route path
 */
// @ts-check
var upRouter = exports.upRouter = function upRouter(router, currentGlobal, notfound) {
  if (router === null) return;
  router.beforeEach(function (to, from, next) {

    /** @type {Array} */
    var routePermission = to.meta.rule;

    if (!(0, _checker.testPermission)(currentGlobal, routePermission)) return next(notfound);

    return next();
  });
};