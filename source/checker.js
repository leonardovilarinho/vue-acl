// @ts-check

/**
 * Test a rule with a permission group
 * @param {Array} current current permissions
 * @param {Array} rules rule to test
 * @return {boolean} valided rule
 */
export const testPermission =(current, rules) => {
  const checkAnds = rules.map(rule => {
    let valid = true
    rule.forEach(and => valid = current.includes(and))
    return valid
  })

  let result = false
  checkAnds.forEach(or => {
    if (or)
      result = or
  })

  return result
}
