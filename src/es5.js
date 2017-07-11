"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Acl = function () {
    function Acl() {
        _classCallCheck(this, Acl);
    }

    _createClass(Acl, [{
        key: 'init',
        value: function init(router, permissions) {
            this.router = router;
            this.permissions = Array.isArray(permissions) ? permissions : [permissions];
        }
    }, {
        key: 'check',
        value: function check(permission) {
            var _this = this;

            if (typeof permission != 'undefined') {
                var permissions = permission.indexOf('|') !== -1 ? permission.split('|') : [permission];

                return permissions.find(function (permission) {
                        console.log('Checking: ', permission);

                        var needed = permission.indexOf('&') !== -1 ? permission.split('&') : permission;

                        if (Array.isArray(needed)) {
                            return needed.every(function (need) {
                                return _this.permissions.indexOf(need) !== -1;
                            });
                        }

                        return _this.permissions.indexOf(needed) !== -1 ? true : false;
                    }) !== undefined;
            }
            return false;
        }
    }, {
        key: 'router',
        set: function set(router) {
            var _this2 = this;

            router.beforeEach(function (to, from, next) {
                var fail = to.meta.fail || '/';
                if (typeof to.meta.permission == 'undefined') return next(fail);else {
                    if (!_this2.check(to.meta.permission)) return next(fail);
                    next();
                }
            });
        }
    }]);

    return Acl;
}();

var acl = new Acl();

Acl.install = function (Vue, _ref) {
    var router = _ref.router,
        init = _ref.init;


    acl.init(router, init);

    Vue.prototype.$can = function (permission) {
        return acl.check(permission);
    };

    Vue.prototype.$access = function () {
        var newAccess = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (newAccess != null) {
            if (Array.isArray(newAccess))
                acl.permissions = newAccess;
            else if (newAccess.indexOf('&') !== -1)
                acl.permissions = newAccess.split('&')
            else
                acl.permissions = [newAccess];
        } else return acl.permissions;
    };
};

exports.default = Acl;