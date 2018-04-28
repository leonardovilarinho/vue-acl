// @ts-check
import EventBus from 'vue-e-bus'
import query from './query'
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

function testPermission(current, rules) {
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

export default (initial, acceptLocalRules, globalRules) => ({
  /**
   * Called before create component
   */
  beforeCreate() {
    const self = this

    this.$acl = {
      /**
       * Change current language
       * @param {string|Array} param 
       */
      change (param) {
        EventBus.$emit('multilanguage-language-changed', param)
      },
      check (ruleOrPermission) {
        if (ruleOrPermission in globalRules)
          return testPermission(this.current, globalRules[ruleOrPermission])

        if (ruleOrPermission in self) {
          if (!acceptLocalRules)
            throw '[vue-multilanguage] acceptLocalRules is not enabled'
          return testPermission(this.current, self[ruleOrPermission])
        }

        return false
      },
      make: (start) => (!acceptLocalRules) ? null : query(start),
      current: Array.isArray(initial) ? initial : [initial], 
    }

    EventBus.$on('multilanguage-language-changed', (newLanguage) => {
      this.$acl.current = Array.isArray(newLanguage) ? newLanguage : [newLanguage]
    })
  }
})