
/**
 * Test a rule with a permission group
 * @param {Array} current current permissions
 * @param {Array} rules rule to test
 * @return {boolean} valided rule
 */
export const testPermission =(current, rules) => {
  if (rule === '*') {
    return true;
  }
  
  if (rules.generate === undefined && !Array.isArray(rules)) {
    return console.error('[vue-acl] you have invalid rules: ' + JSON.stringify(rules));
  }

  if (!Array.isArray(rules)) {
    rules = rules.generate();
  }

  let hasAllowed = false;
  let checkAnds;
  // If current rule is an array then use the Array.prototype.include
  if (Array.isArray(current)) {
    checkAnds = rules.map((rule) => {
      return rule.reduce((validator, ruleValue) => validator && current.includes(ruleValue), true);
    });
  } else {
    // If it's string, check rule by === operator to get the absolute equal rule.
    checkAnds = rules.map((rule) => {

      return rule.reduce((validator, ruleValue) => validator && (current === ruleValue), true);
    });
  }

  // Check 'OR'
  const result = checkAnds.some((or) => or);

  return result;
}
