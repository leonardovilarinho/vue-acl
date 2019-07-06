'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AclRule = exports.AclCreate = exports.AclInstaller = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _install2 = require('./install');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var options = {
  initial: '',
  router: null,
  notfound: {
    path: '',
    forwardQueryParams: false
  }
};

var Vue = void 0;

var AclInstaller = exports.AclInstaller = function AclInstaller(_Vue) {
  Vue = _Vue;
  (0, _install2._install)(_Vue, options);
};

var AclCreate = exports.AclCreate = function AclCreate(_options) {
  _classCallCheck(this, AclCreate);

  options = _options;
  (0, _install2._install)(Vue, options);
};

var AclRule = exports.AclRule = function () {
  function AclRule(permission) {
    _classCallCheck(this, AclRule);

    this.current = permission;
  }

  _createClass(AclRule, [{
    key: 'or',
    value: function or(permission) {
      this.current += this.current === '' ? permission : '||' + permission;
      return this;
    }
  }, {
    key: 'and',
    value: function and(permission) {
      this.current += this.current === '' ? permission : '&&' + permission;
      return this;
    }
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