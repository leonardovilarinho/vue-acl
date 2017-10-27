'use strict'

const vm = require('vm')

const context = vm.createContext()
function test (code) {
  try {
    return vm.runInContext(`(function () {
      'use strict'
      ${code}
    })()`, context) === true
  } catch (err) {
    return false
  }
}

const support = {}

// Tests from <https://github.com/kangax/compat-table/blob/c0a3b882b27e4e9f4ef449a1c985ee7857326b94/data-es6.js#L12733:L13115>.
support.functionStatements = test(`
  function foo(){};
  return foo.name === 'foo' &&
    (function(){}).name === '';
`)

support.functionExpressions = test(`
  return (function foo(){}).name === 'foo' &&
    (function(){}).name === '';
`)

support.newFunction = test(`
  return (new Function).name === "anonymous";
`)

support.boundFunctions = test(`
  function foo() {};
  return foo.bind({}).name === "bound foo" &&
    (function(){}).bind({}).name === "bound ";
`)

support.functionVariables = test(`
  var foo = function() {};
  var bar = function baz() {};
  return foo.name === "foo" && bar.name === "baz";
`)

support.functionObjectMethods = test(`
  var o = { foo: function(){}, bar: function baz(){}};
  o.qux = function(){};
  return o.foo.name === "foo" &&
         o.bar.name === "baz" &&
         o.qux.name === "";
`)

support.accessorProperties = test(`
  var o = { get foo(){}, set foo(x){} };
  var descriptor = Object.getOwnPropertyDescriptor(o, "foo");
  return descriptor.get.name === "get foo" &&
         descriptor.set.name === "set foo";
`)

support.shorthandMethods = test(`
  var o = { foo(){} };
  return o.foo.name === "foo"
`)

support.symbolKeyedMethods = test(`
  var sym1 = Symbol("foo");
  var sym2 = Symbol();
  var o = {
    [sym1]: function(){},
    [sym2]: function(){}
  };

  return o[sym1].name === "[foo]" &&
         o[sym2].name === "";
`)

support.classStatements = test(`
  class foo {};
  class bar { static name() {} };
  return foo.name === "foo" &&
    typeof bar.name === "function";
`)

support.classExpressions = test(`
  return class foo {}.name === "foo" &&
    typeof class bar { static name() {} }.name === "function";
`)

support.classVariables = test(`
  var foo = class {};
  var bar = class baz {};
  var qux = class { static name() {} };
  return foo.name === "foo" &&
         bar.name === "baz" &&
         typeof qux.name === "function";
`)

support.classObjectMethods = test(`
  var o = { foo: class {}, bar: class baz {}};
  o.qux = class {};
  return o.foo.name === "foo" &&
         o.bar.name === "baz" &&
         o.qux.name === "";
`)

support.classPrototypeMethods = test(`
  class C { foo(){} };
  return (new C).foo.name === "foo";
`)

support.classStaticMethods = test(`
  class C { static foo(){} };
  return C.foo.name === "foo";
`)

exports.support = Object.freeze(support)

const hasFullSupport =
  support.functionStatements &&
  support.functionExpressions &&
  support.newFunction &&
  support.boundFunctions &&
  support.functionVariables &&
  support.functionObjectMethods &&
  support.accessorProperties &&
  support.shorthandMethods &&
  support.symbolKeyedMethods &&
  support.classStatements &&
  support.classExpressions &&
  support.classVariables &&
  support.classObjectMethods &&
  support.classPrototypeMethods &&
  support.classStaticMethods
exports.hasFullSupport = hasFullSupport

const bitFlags = [
  'functionStatements',
  'functionExpressions',
  'newFunction',
  'boundFunctions',
  'functionVariables',
  'functionObjectMethods',
  'accessorProperties',
  'shorthandMethods',
  'symbolKeyedMethods',
  'classStatements',
  'classExpressions',
  'classVariables',
  'classObjectMethods',
  'classPrototypeMethods',
  'classStaticMethods'
  // Add new flags at the end. Reordering flags is a breaking change.
].reduce((acc, key, index) => {
  return support[key] === true
    ? acc + (1 << index)
    : acc
}, 0b0)
exports.bitFlags = bitFlags

exports.isSubsetOf = otherFlags => (bitFlags & otherFlags) === bitFlags
exports.isSupersetOf = otherFlags => (bitFlags & otherFlags) === otherFlags
