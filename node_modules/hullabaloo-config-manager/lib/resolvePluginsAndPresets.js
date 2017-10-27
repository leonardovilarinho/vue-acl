'use strict'

const path = require('path')

const ExtendableError = require('es6-error')
const pkgDir = require('pkg-dir')
const resolveFrom = require('resolve-from')

class ResolveError extends ExtendableError {
  constructor (source, kind, ref) {
    super(`${source}: Couldn't find ${kind} ${JSON.stringify(ref)} relative to directory`)
    this.source = source
    this.ref = ref
    this.isPlugin = kind === 'plugin'
    this.isPreset = kind === 'preset'
  }
}

function normalize (arr) {
  if (!Array.isArray(arr)) return []

  return arr.map(item => Array.isArray(item) ? item[0] : item)
}

function isFilePath (ref) {
  return path.isAbsolute(ref) || ref.startsWith('./') || ref.startsWith('../')
}

function resolveName (name, fromDir, cache) {
  if (cache.has(name)) return cache.get(name)

  const filename = resolveFrom.silent(fromDir, name)
  cache.set(name, filename)
  return filename
}

function resolvePackage (filename, fromFile) {
  if (fromFile) return null

  return pkgDir.sync(filename)
}

function resolvePluginsAndPresets (chains, sharedCache) {
  const dirCaches = (sharedCache && sharedCache.pluginsAndPresets) || new Map()
  const getCache = dir => {
    if (dirCaches.has(dir)) return dirCaches.get(dir)

    const cache = new Map()
    dirCaches.set(dir, cache)
    return cache
  }

  const byConfig = new Map()
  for (const chain of chains) {
    for (const config of chain) {
      if (byConfig.has(config)) continue

      const plugins = new Map()
      const presets = new Map()
      byConfig.set(config, { plugins, presets })

      const fromDir = config.dir
      const cache = getCache(fromDir)
      const resolve = (kind, ref) => {
        const possibleNames = []
        if (isFilePath(ref)) {
          possibleNames.push({ fromFile: true, name: ref })
        } else {
          if (kind === 'plugin') {
            // Expand possible plugin names, see
            // https://github.com/babel/babel/blob/510e93b2bd434f05c816fe6639137b35bac267ed/packages/babel-core/src/helpers/get-possible-plugin-names.js

            // Babel doesn't expand scoped plugin references. @ is only valid at
            // the start of a package name, so disregard refs that would result
            // in `babel-plugin-@scope/name`.
            if (!ref.startsWith('@')) {
              const name = `babel-plugin-${ref}`
              possibleNames.push({ fromFile: false, name })
            }
          } else {
            // Expand possible preset names, see
            // https://github.com/babel/babel/blob/510e93b2bd434f05c816fe6639137b35bac267ed/packages/babel-core/src/helpers/get-possible-preset-names.js

            if (ref.startsWith('@')) {
              const matches = /^(@.+?)\/([^/]+)(.*)/.exec(ref)
              const scope = matches[1]
              const partialName = matches[2]
              const remainder = matches[3]

              const name = `${scope}/babel-preset-${partialName}${remainder}`
              possibleNames.push({ fromFile: false, name })
            } else {
              const name = `babel-preset-${ref}`
              possibleNames.push({ fromFile: false, name })
            }
          }

          possibleNames.push({ fromFile: false, name: ref })
        }

        let entry = null
        for (const possibility of possibleNames) {
          const filename = resolveName(possibility.name, fromDir, cache)
          if (filename) {
            const fromPackage = resolvePackage(filename, possibility.fromFile)
            entry = { filename, fromPackage }
            break
          }
        }
        if (!entry) {
          throw new ResolveError(config.source, kind, ref)
        }

        if (kind === 'plugin') {
          plugins.set(ref, entry)
        } else {
          presets.set(ref, entry)
        }
      }

      for (const ref of normalize(config.options.plugins)) {
        resolve('plugin', ref)
      }
      for (const ref of normalize(config.options.presets)) {
        resolve('preset', ref)
      }
    }
  }

  return byConfig
}

module.exports = resolvePluginsAndPresets
