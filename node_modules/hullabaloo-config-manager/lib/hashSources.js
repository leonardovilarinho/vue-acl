'use strict'

const path = require('path')

const dotProp = require('dot-prop')
const md5Hex = require('md5-hex')

const errors = require('./errors')
const readSafe = require('./readSafe')

function hashSource (source, cache) {
  if (cache && cache.sourceHashes && cache.sourceHashes.has(source)) {
    return cache.sourceHashes.get(source)
  }

  const basename = path.basename(source)
  const parts = basename.split('#')
  const filename = parts[0]
  const filepath = path.join(path.dirname(source), filename)

  const pkgAccessor = filename === 'package.json'
    ? parts[1] || 'babel'
    : null

  const promise = readSafe(filepath, cache)
    .then(contents => {
      if (!contents) throw new errors.NoSourceFileError(source)

      if (!pkgAccessor) {
        return md5Hex(contents)
      }

      const json = JSON.parse(contents.toString('utf8'))
      const value = dotProp.get(json, pkgAccessor) || {}
      return md5Hex(JSON.stringify(value))
    })

  if (cache && cache.sourceHashes) {
    cache.sourceHashes.set(source, promise)
  }
  return promise
}

function hashSources (sources, fixedHashes, cache) {
  const promises = sources.map(item => {
    if (fixedHashes && fixedHashes.has(item.source)) return fixedHashes.get(item.source)
    return hashSource(item.source, cache)
  })
  return Promise.all(promises)
}
module.exports = hashSources
