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
        value: function init(router, permissions, fail, save) {
            this.router = router;
            this.save = save;
            var perms = window.sessionStorage.getItem('vue-acl-permissions');
            if (perms != null) permissions = atob(perms);

            this.permissions = this.clearPermissions(permissions);
            this.savePermissions();
            this.fail = fail;
        }
    }, {
        key: 'check',
        value: function check(permission) {

            if (permission == undefined) return false;

            var permissions = permission.indexOf('|') !== -1 ? permission.split('|') : [permission];

            return this.findPermission(permissions) !== undefined;
        }
    }, {
        key: 'findPermission',
        value: function findPermission(pem) {
            var _this = this;

            return pem.find(function (permission) {
                var needed = permission.indexOf('&') !== -1 ? permission.split('&') : permission;
                if (Array.isArray(needed)) return needed.every(function (need) {
                    return _this.permissions.indexOf(need) !== -1;
                });

                return _this.permissions.indexOf(needed) !== -1;
            });
        }
    }, {
        key: 'clearPermissions',
        value: function clearPermissions(permissions) {
            if (permissions.indexOf('&') !== -1) permissions = permissions.split('&');

            return Array.isArray(permissions) ? permissions : [permissions];
        }
    }, {
        key: 'savePermissions',
        value: function savePermissions() {
            if (this.save != true) return;

            var perm = this.permissions;
            if (Array.isArray(this.permissions)) perm = this.permissions.join('&');

            window.sessionStorage.setItem('vue-acl-permissions', btoa(perm));
        }
    }, {
        key: 'router',
        set: function set(router) {
            var _this2 = this;

            router.beforeEach(function (to, from, next) {
                if (to.meta.permission == 'public') return next();

                var fail = to.meta.fail || _this2.fail || from.fullPath;

                if (!_this2.check(to.meta.permission)) return next(fail);

                return next();
            });
        }
    }]);

    return Acl;
}();

var acl = new Acl();

Acl.install = function (Vue, _ref) {
    var router = _ref.router,
        init = _ref.init,
        fail = _ref.fail,
        save = _ref.save;


    var bus = new Vue();

    acl.init(router, init, fail, save);

    Vue.prototype.$can = function (permission) {
        return acl.check(permission);
    };

    Vue.mixin({
        data: function data() {
            return {
                access: acl.clearPermissions(init)
            };
        },

        watch: {
            access: function access(value) {
                acl.permissions = acl.clearPermissions(value);
                bus.$emit('access-changed', acl.permissions);
                acl.savePermissions();
                this.$forceUpdate();
            }
        },
        mounted: function mounted() {
            var _this3 = this;

            bus.$on('access-changed', function (permission) {
                return _this3.access = permission;
            });
        }
    });
};

exports.default = Acl;
