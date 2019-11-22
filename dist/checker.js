'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Test a rule with a permission group
 * @param {Array} current current permissions
 * @param {Array} rules rule to test
 * @return {boolean} valided rule
 */
var testPermission = exports.testPermission = function testPermission(current, rules) {
  if (rules.generate === undefined && !Array.isArray(rules)) {
    return console.error('[vue-acl] you have invalid rules');
  }

  if (!Array.isArray(rules)) {
    rules = rules.generate();
  }

  var hasAllowed = false;
  rules.forEach(function (rule) {
    if (rule === '*') hasAllowed = true;
  });

  if (hasAllowed) return true;

  var checkAnds = void 0;
  // If current rule is an array then use the Array.prototype.include
  if (Array.isArray(current)) {
    checkAnds = rules.map(function (rule) {
      return rule.reduce(function (validator, ruleValue) {
        return validator && current.includes(ruleValue);
      }, true);
    });
  } else {
    // If it's string, check rule by === operator to get the absolute equal rule.
    checkAnds = rules.map(function (rule) {

      return rule.reduce(function (validator, ruleValue) {
        return validator && current === ruleValue;
      }, true);
    });
  }

  // Check 'OR'
  var result = checkAnds.some(function (or) {
    return or;
  });

  return result;
};