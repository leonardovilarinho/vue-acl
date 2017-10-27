'use strict'

const path = require('path')

const cloneDeep = require('lodash.clonedeep')

const collector = require('./lib/collector')
const currentEnv = require('./lib/currentEnv')
const ResolvedConfig = require('./lib/ResolvedConfig')
const Verifier = require('./lib/Verifier')

function createConfig (options) {
  if (!options || !options.options || !options.source) {
    throw new TypeError("Expected 'options' and 'source' options")
  }
  if (typeof options.options !== 'object' || Array.isArray(options.options)) {
    throw new TypeError("'options' must be an actual object")
  }

  const source = options.source
  const dir = options.dir || path.dirname(source)
  const hash = options.hash || null
  const json5 = options.json5 !== false
  const babelOptions = cloneDeep(options.options)

  return new collector.Config(dir, null, hash, json5, babelOptions, source)
}
exports.createConfig = createConfig

exports.currentEnv = currentEnv

function fromConfig (baseConfig, options) {
  options = options || {}
  return collector.fromConfig(baseConfig, options.cache)
    .then(chains => new ResolvedConfig(chains, options.cache))
}
exports.fromConfig = fromConfig

function fromDirectory (dir, options) {
  options = options || {}
  return collector.fromDirectory(dir, options.cache)
    .then(chains => chains && new ResolvedConfig(chains, options.cache))
}
exports.fromDirectory = fromDirectory

function prepareCache () {
  return {
    dependencyHashes: new Map(),
    fileExistence: new Map(),
    files: new Map(),
    pluginsAndPresets: new Map(),
    sourceHashes: new Map()
  }
}
exports.prepareCache = prepareCache

function restoreVerifier (buffer) {
  return Verifier.fromBuffer(buffer)
}
exports.restoreVerifier = restoreVerifier
