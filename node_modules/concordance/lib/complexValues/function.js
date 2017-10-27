'use strict'

const functionNameSupport = require('function-name-support')

const constants = require('../constants')
const getStringTag = require('../getStringTag')
const isEnumerable = require('../isEnumerable')
const formatUtils = require('../formatUtils')
const lineBuilder = require('../lineBuilder')
const NOOP_RECURSOR = require('../recursorUtils').NOOP_RECURSOR
const object = require('./object')

const UNEQUAL = constants.UNEQUAL
const SHALLOW_EQUAL = constants.SHALLOW_EQUAL

// Node.js 4 provides Function, more recent versions use GeneratorFunction
const generatorsHaveGeneratorTag = getStringTag(function * () {}) === 'GeneratorFunction'

function describe (props) {
  const fn = props.value
  return new DescribedFunctionValue(Object.assign({
    nameIsEnumerable: isEnumerable(fn, 'name'),
    name: typeof fn.name === 'string' ? fn.name : null
  }, props))
}
exports.describe = describe

function deserialize (state, recursor) {
  return new DeserializedFunctionValue(state, recursor)
}
exports.deserialize = deserialize

const tag = Symbol('FunctionValue')
exports.tag = tag

class FunctionValue extends object.ObjectValue {
  constructor (props) {
    super(props)
    this.name = props.name
  }

  formatShallow (theme, indent) {
    const string = formatUtils.wrap(theme.function.stringTag, this.stringTag) +
      (this.name ? ' ' + formatUtils.wrap(theme.function.name, this.name) : '') +
      ' ' + theme.object.openBracket

    return super.formatShallow(theme, indent).customize({
      finalize (innerLines) {
        return innerLines.isEmpty
          ? lineBuilder.single(string + theme.object.closeBracket)
          : lineBuilder.first(string)
              .concat(innerLines.withFirstPrefixed(indent.increase()).stripFlags())
              .append(lineBuilder.last(indent + theme.object.closeBracket))
      },

      maxDepth () {
        return lineBuilder.single(string + ' ' + theme.maxDepth + ' ' + theme.object.closeBracket)
      }
    })
  }
}
Object.defineProperty(FunctionValue.prototype, 'tag', { value: tag })

class DescribedFunctionValue extends object.DescribedMixin(FunctionValue) {
  constructor (props) {
    super(props)
    this.nameIsEnumerable = props.nameIsEnumerable
  }

  compare (expected) {
    if (this.tag !== expected.tag) return UNEQUAL
    if (this.name !== expected.name) return UNEQUAL
    if (this.value && expected.value && this.value !== expected.value) return UNEQUAL

    return super.compare(expected)
  }

  createPropertyRecursor () {
    const recursor = super.createPropertyRecursor()

    const skipName = this.nameIsEnumerable
    if (!skipName) return recursor

    let size = recursor.size
    if (skipName) {
      size -= 1
    }

    if (size === 0) return NOOP_RECURSOR

    const next = () => {
      const property = recursor.next()
      if (property) {
        if (skipName && property.key.value === 'name') {
          return next()
        }
        return property
      }

      return null
    }

    return { size, next }
  }

  serialize () {
    return [this.name, generatorsHaveGeneratorTag, super.serialize()]
  }
}

class DeserializedFunctionValue extends object.DeserializedMixin(FunctionValue) {
  constructor (state, recursor) {
    super(state[2], recursor)
    this.name = state[0]
    this.trustStringTag = state[1]
  }

  compare (expected) {
    if (this.tag !== expected.tag) return UNEQUAL

    if (this.name !== expected.name) {
      if (this.functionNameSupportFlags === functionNameSupport.bitFlags) {
        // The engine used to create the serialization supports the same
        // function name inference as the current engine. That said, unless
        // the engine has full support for name inference, it's possible that
        // names were lost simply due to refactoring. Names are unequal if
        // the engine has full support, or if names were inferred.
        if (functionNameSupport.hasFullSupport === true || (this.name !== '' && expected.name !== '')) return UNEQUAL
      } else if (functionNameSupport.isSubsetOf(this.functionNameSupportFlags)) {
        // The engine used to create the serialization could infer more function
        // names than the current engine. Assume `expected.name` comes from the
        // current engine and treat the names as unequal only if the current
        // engine could infer a name.
        if (expected.name !== '') return UNEQUAL
      } else {
        /* istanbul ignore else */
        if (functionNameSupport.isSupersetOf(this.functionNameSupportFlags)) {
          // The engine used to create the serialization could infer fewer
          // function names than the current engine. Treat the names as unequal
          // only if a name was in the serialization.
          if (this.name !== '') return UNEQUAL
        }
      }
    }

    // Assume `stringTag` is either 'Function' or 'GeneratorFunction', and that
    // it always equals `ctor`. Since Node.js 4 only provides 'Function', even
    // for generator functions, only compare `stringTag` if the serialized value
    // legitimately would have been `Function`, and the expected `stringTag` can
    // reliably be inferred.
    if (this.trustStringTag && generatorsHaveGeneratorTag && this.stringTag !== expected.stringTag) return UNEQUAL

    return SHALLOW_EQUAL
  }

  serialize () {
    return [this.name, this.trustStringTag, super.serialize()]
  }
}
