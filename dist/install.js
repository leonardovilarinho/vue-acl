'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._install = undefined;

var _mixin = require('./mixin');

var _install = exports._install = function _install(_Vue, options) {
  var initial = options.initial,
      acceptLocalRules = options.acceptLocalRules,
      globalRules = options.globalRules,
      router = options.router,
      notfound = options.notfound,
      middleware = options.middleware;


  _Vue.mixin((0, _mixin.register)(initial, acceptLocalRules || false, globalRules || {}, router, notfound, middleware));
};