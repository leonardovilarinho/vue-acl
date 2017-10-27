'use strict'

const packageHash = require('package-hash')
const md5Hex = require('md5-hex')

const errors = require('./errors')
const readSafe = require('./readSafe')

function hashFile (filename, cache) {
  return readSafe(filename, cache)
    .then(contents => {
      if (!contents) throw new errors.BadDependencyError(filename)

      return md5Hex(contents)
    })
}

function hashPackage (filename, fromPackage) {
  return packageHash(`${fromPackage}/package.json`)
    .catch(err => {
      throw new errors.BadDependencyError(filename, err)
    })
}

function hashDependency (filename, fromPackage, cache) {
  if (cache && cache.dependencyHashes && cache.dependencyHashes.has(filename)) {
    return cache.dependencyHashes.get(filename)
  }

  const promise = fromPackage
    ? hashPackage(filename, fromPackage)
    : hashFile(filename, cache)

  if (cache && cache.dependencyHashes) {
    cache.dependencyHashes.set(filename, promise)
  }
  return promise
}

function hashDependencies (dependencies, cache) {
  const promises = dependencies.map(item => hashDependency(item.filename, item.fromPackage, cache))
  return Promise.all(promises)
}
module.exports = hashDependencies
