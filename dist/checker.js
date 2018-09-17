'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testPermission = undefined;

var _assert = require('assert');

// @ts-check

/**
 * Test a rule with a permission group
 * @param {Array} current current permissions
 * @param {Array} rules rule to test
 * @return {boolean} valided rule
 */
var testPermission = exports.testPermission = function testPermission(current, rules) {
  if (rules.generate === undefined && !Array.isArray(rules)) {
    return console.error('[vue-acl] your have invalid rules');
  }

  if (!Array.isArray(rules)) {
    rules = rules.generate();
  }

  var hasAllowed = false;
  rules.forEach(function (rule) {
    if (rule.includes('*')) hasAllowed = true;
  });

  if (hasAllowed) return true;

  var checkAnds = rules.map(function (rule) {
    var valid = true;
    rule.forEach(function (and) {
      return valid = valid && current.includes(and);
    });
    return valid;
  });

  var result = false;
  checkAnds.forEach(function (or) {
    if (or) result = or;
  });

  return result;
};