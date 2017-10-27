'use strict'

const cloneDeepWith = require('lodash.clonedeepwith')
const merge = require('lodash.merge')

const resolvePluginsAndPresets = require('./resolvePluginsAndPresets')

function trackDependency (dependencies, filename, fromPackage, envName) {
  if (dependencies.has(filename)) {
    const existing = dependencies.get(filename)
    if (envName) {
      existing.envs.add(envName)
    } else {
      existing.default = true
    }
    return
  }

  const item = {
    default: !envName,
    envs: new Set(envName ? [envName] : []),
    filename,
    fromPackage
  }
  dependencies.set(filename, item)
}

function trackSource (sources, source, envName) {
  if (sources.has(source)) {
    const existing = sources.get(source)
    if (envName) {
      existing.envs.add(envName)
    } else {
      existing.default = true
    }
    return
  }

  const item = {
    default: !envName,
    envs: new Set(envName ? [envName] : []),
    source
  }
  sources.set(source, item)
}

function createOptions (plugins, presets) {
  const options = {}
  if (plugins) options.plugins = plugins
  // istanbul ignore else
  if (presets) options.presets = presets
  return options
}

function compressOptions (orderedOptions) {
  const remaining = orderedOptions.slice(0, 1)
  remaining[0].babelrc = false

  for (let index = 1; index < orderedOptions.length; index++) {
    const options = orderedOptions[index]
    delete options.babelrc

    const plugins = options.plugins
    delete options.plugins

    const presets = options.presets
    delete options.presets

    merge(remaining[0], options)

    if (plugins || presets) {
      remaining.push(createOptions(plugins, presets))
    }
  }

  return remaining
}

function reduceOptions (chain, envName, pluginsAndPresets, dependencies, sources, fixedSourceHashes) {
  let json5 = false

  const orderedOptions = Array.from(chain, config => {
    trackSource(sources, config.source, envName)
    if (config.hash) {
      fixedSourceHashes.set(config.source, config.hash)
    }

    if (config.json5) json5 = true

    const lookup = pluginsAndPresets.get(config)
    const mapPluginOrPreset = (getEntry, ref) => {
      if (Array.isArray(ref)) {
        return ref.length === 1
          ? mapPluginOrPreset(getEntry, ref[0])
          : [mapPluginOrPreset(getEntry, ref[0]), ref[1]]
      }

      const entry = getEntry(ref)
      trackDependency(dependencies, entry.filename, entry.fromPackage, envName)
      return entry.filename
    }

    return cloneDeepWith(config.options, (value, key, object) => {
      if (object === config.options && (key === 'plugins' || key === 'presets')) {
        const getEntry = ref => lookup[key].get(ref)
        return Array.isArray(value)
          ? value.map(ref => mapPluginOrPreset(getEntry, ref))
          : []
      }
    })
  })

  const unflattenedOptions = compressOptions(orderedOptions)
  unflattenedOptions.json5 = json5
  return unflattenedOptions
}

function reduceChains (chains, cache) {
  const pluginsAndPresets = resolvePluginsAndPresets(chains, cache)

  const dependencies = new Map()
  const envNames = new Set()
  const fixedSourceHashes = new Map()
  const sources = new Map()

  const unflattenedDefaultOptions = reduceOptions(
    chains.defaultChain, null, pluginsAndPresets, dependencies, sources, fixedSourceHashes
  )

  const unflattenedEnvOptions = new Map()
  for (const pair of chains.envChains) {
    const envName = pair[0]
    const chain = pair[1]

    envNames.add(envName)
    unflattenedEnvOptions.set(
      envName,
      reduceOptions(chain, envName, pluginsAndPresets, dependencies, sources, fixedSourceHashes)
    )
  }

  return {
    dependencies:
      Array.from(dependencies.keys())
        .sort()
        .map(filename => dependencies.get(filename)),
    envNames,
    fixedSourceHashes,
    sources:
      Array.from(sources.keys())
        .sort()
        .map(source => sources.get(source)),
    unflattenedDefaultOptions,
    unflattenedEnvOptions
  }
}

module.exports = reduceChains
