'use strict'

const path = require('path')

const parseJson5 = require('json5').parse

const errors = require('./errors')
const readSafe = require('./readSafe')

function makeValid (source, options) {
  // Arrays are never valid options.
  if (Array.isArray(options)) throw new errors.InvalidFileError(source)

  // Force options to be an object. Babel itself ignores falsy values when
  // resolving config chains. Here such files still need to be included
  // for cache busting purposes.
  if (!options || typeof options !== 'object') return {}

  return options
}

function parseFile (source, buffer) {
  let options
  try {
    options = parseJson5(buffer.toString('utf8'))
  } catch (err) {
    throw new errors.ParseError(source, err)
  }

  return makeValid(source, options)
}

function parsePackage (source, buffer) {
  let options
  try {
    const pkg = JSON.parse(buffer.toString('utf8'))
    options = pkg && pkg.babel
  } catch (err) {
    throw new errors.ParseError(source, err)
  }

  return makeValid(source, options)
}

class Config {
  constructor (dir, env, hash, json5, options, source) {
    this.dir = dir
    this.env = env
    this.hash = hash
    this.json5 = json5
    this.options = options
    this.source = source

    this.babelrcPointer = null
    this.envPointers = new Map()
    this.extends = null
    this.extendsPointer = null
  }

  copyWithEnv (env, options) {
    return new this.constructor(this.dir, env, this.hash, this.json5, options, this.source)
  }

  extend (config) {
    const clause = this.takeExtends()
    if (clause) {
      throw new TypeError(`Cannot extend config: there is an extends clause in the current options: ${clause}`)
    }
    if (this.extends) {
      throw new Error('Cannot extend config: already extended')
    }

    this.extends = config
  }

  takeEnvs () {
    const env = this.options.env
    delete this.options.env

    return env
      ? new Map(
          Object.keys(env)
            .filter(Boolean)
            .map(name => [name, env[name]]))
      : new Map()
  }

  takeExtends () {
    const clause = this.options.extends
    delete this.options.extends
    return clause
  }
}
exports.Config = Config

function resolveDirectory (dir, cache) {
  const fileSource = path.join(dir, '.babelrc')
  const packageSource = path.join(dir, 'package.json')

  const fromFile = readSafe(fileSource, cache)
    .then(contents => contents && {
      json5: true,
      parse () { return parseFile(fileSource, contents) },
      source: fileSource
    })

  const fromPackage = readSafe(packageSource, cache)
    .then(contents => contents && {
      json5: false,
      parse () { return parsePackage(packageSource, contents) },
      source: packageSource
    })

  return fromFile
    .then(fileResult => fileResult || fromPackage)
    .then(result => {
      // .babelrc or package.json files may not exist, and that's OK.
      if (!result) return null

      return new Config(dir, null, null, result.json5, result.parse(), result.source)
    })
}

function resolveFile (source, cache) {
  return readSafe(source, cache)
    .then(contents => {
      // The file *must* exist. Causes a proper error to be propagated to
      // where "extends" directives are resolved.
      if (!contents) throw new errors.NoSourceFileError(source)

      return new Config(path.dirname(source), null, null, true, parseFile(source, contents), source)
    })
}

class Chains {
  constructor (babelrcDir, defaultChain, envChains) {
    this.babelrcDir = babelrcDir
    this.defaultChain = defaultChain
    this.envChains = envChains
  }

  * [Symbol.iterator] () {
    yield this.defaultChain
    for (const chain of this.envChains.values()) {
      yield chain
    }
  }
}

class Collector {
  constructor (cache) {
    this.cache = cache
    this.configs = []
    this.envNames = new Set()
    this.pointers = new Map()
  }

  get initialConfig () {
    return this.configs[0]
  }

  add (config) {
    // Avoid adding duplicate configs. Note that configs that came from an
    // "env" directive share their source with their parent config.
    if (!config.env && this.pointers.has(config.source)) {
      return Promise.resolve(this.pointers.get(config.source))
    }

    const pointer = this.configs.push(config) - 1
    // Make sure not to override the pointer to an environmental
    // config's parent.
    if (!config.env) this.pointers.set(config.source, pointer)

    const envs = config.takeEnvs()
    const extendsClause = config.takeExtends()
    const waitFor = []

    if (config.extends) {
      const promise = this.add(config.extends)
        .then(extendsPointer => (config.extendsPointer = extendsPointer))
      waitFor.push(promise)
    } else if (extendsClause) {
      const extendsSource = path.resolve(config.dir, extendsClause)

      if (this.pointers.has(extendsSource)) {
        // Point at existing config.
        config.extendsPointer = this.pointers.get(extendsSource)
      } else {
        // Different configs may concurrently resolve the same extends source.
        // While only one such resolution is added to the config list, this
        // does lead to extra file I/O and parsing. Optimizing this is not
        // currently considered worthwhile.
        const promise = resolveFile(extendsSource, this.cache)
          .then(parentConfig => this.add(parentConfig))
          .then(extendsPointer => (config.extendsPointer = extendsPointer))
          .catch(err => {
            if (err.name === 'NoSourceFileError') {
              throw new errors.ExtendsError(config.source, extendsClause, err)
            }

            throw err
          })

        waitFor.push(promise)
      }
    }

    for (const pair of envs) {
      const name = pair[0]
      const options = pair[1]

      this.envNames.add(name)
      const promise = this.add(config.copyWithEnv(name, options))
        .then(envPointer => config.envPointers.set(name, envPointer))
      waitFor.push(promise)
    }

    return Promise.all(waitFor)
      .then(() => pointer)
  }

  resolveChains (babelrcDir) {
    if (this.configs.length === 0) return null

    // Resolves a config chain, correctly ordering parent configs and recursing
    // through environmental configs, while avoiding cycles and repetitions.
    const resolveChain = (from, envName) => {
      const chain = new Set()
      const knownParents = new Set()

      /* eslint-disable no-use-before-define */
      const addWithEnv = config => {
        // Avoid unnecessary work in case the `from` list contains configs that
        // have already been added through an environmental config's parent.
        if (chain.has(config)) return
        chain.add(config)

        if (config.envPointers.has(envName)) {
          const pointer = config.envPointers.get(envName)
          const envConfig = this.configs[pointer]
          addAfterParents(envConfig)
        }
      }

      const addAfterParents = config => {
        // Avoid cycles by ignoring those parents that are already being added.
        if (knownParents.has(config)) return
        knownParents.add(config)

        if (config.babelrcPointer !== null) {
          const parent = this.configs[config.babelrcPointer]
          addAfterParents(parent)
        }
        if (config.extendsPointer !== null) {
          const parent = this.configs[config.extendsPointer]
          addAfterParents(parent)
        }

        if (envName) {
          addWithEnv(config)
        } else {
          chain.add(config)
        }
      }
      /* eslint-enable no-use-before-define */

      for (const config of from) {
        if (envName) {
          addWithEnv(config)
        } else {
          addAfterParents(config)
        }
      }

      return chain
    }

    // Start with the first config. This is either the base config provided
    // to fromConfig(), or the config derived from .babelrc / package.json
    // found in fromDirectory().
    const defaultChain = resolveChain([this.initialConfig])

    // For each environment, augment the default chain with environmental
    // configs.
    const envChains = new Map(Array.from(this.envNames, name => {
      return [name, resolveChain(defaultChain, name)]
    }))

    return new Chains(babelrcDir, defaultChain, envChains)
  }
}

function fromConfig (baseConfig, cache) {
  let babelrcConfig = null
  for (let config = baseConfig; config; config = config.extends) {
    if (config.options.babelrc === false) continue

    if (babelrcConfig) {
      throw new TypeError(`${config.source}: Cannot resolve babelrc option, already resolved by ${babelrcConfig.source}`)
    }

    babelrcConfig = config
  }

  const collector = new Collector(cache)
  return Promise.all([
    collector.add(baseConfig),
    // Resolve the directory concurrently. Assumes that in the common case,
    // the babelrcConfig doesn't extend from a .babelrc file while also leaving
    // the babelrc option enabled. Worst case the resolved config is discarded
    // as a duplicate.
    babelrcConfig && resolveDirectory(babelrcConfig.dir, cache)
      .then(parentConfig => {
        if (!parentConfig) return

        return collector.add(parentConfig)
          .then(babelrcPointer => (babelrcConfig.babelrcPointer = babelrcPointer))
      })
  ])
    .then(() => collector.resolveChains(babelrcConfig && babelrcConfig.dir))
}
exports.fromConfig = fromConfig

function fromDirectory (dir, cache) {
  dir = path.resolve(dir)

  const collector = new Collector(cache)
  return resolveDirectory(dir, cache)
    .then(config => config && collector.add(config))
    .then(() => collector.resolveChains(dir))
}
exports.fromDirectory = fromDirectory
