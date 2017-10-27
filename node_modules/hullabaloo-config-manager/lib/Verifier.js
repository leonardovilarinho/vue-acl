'use strict'

const fs = require('fs')
const path = require('path')

const isEqual = require('lodash.isequal')
const md5Hex = require('md5-hex')
const SafeBuffer = require('safe-buffer').Buffer

const currentEnv = require('./currentEnv')
const hashDependencies = require('./hashDependencies')
const hashSources = require('./hashSources')

function ensureMissingBabelrcFile (file, cache) {
  if (cache && cache.fileExistence && cache.fileExistence.has(file)) {
    return cache.fileExistence.get(file)
  }

  const promise = new Promise((resolve, reject) => {
    fs.access(file, err => {
      if (err) {
        if (err.code !== 'ENOENT') {
          reject(err)
        } else {
          resolve(true)
        }
      } else {
        resolve(false)
      }
    })
  })

  if (cache && cache.fileExistence) {
    cache.fileExistence.set(file, promise)
  }
  return promise
}

class Verifier {
  constructor (babelrcDir, envNames, dependencies, sources) {
    Object.assign(this, { babelrcDir, envNames, dependencies, sources })
  }

  selectByEnv (arr, envName, mapFn) {
    const selectDefault = !this.envNames.has(envName)
    return arr
      .filter(item => selectDefault ? item.default : item.envs.has(envName))
      .map(mapFn || (item => item))
  }

  cacheKeysForCurrentEnv () {
    const envName = currentEnv()
    const getHash = item => item.hash

    const dependencyHashes = this.selectByEnv(this.dependencies, envName, getHash)
    const sourceHashes = this.selectByEnv(this.sources, envName, getHash)

    return {
      dependencies: md5Hex(dependencyHashes),
      sources: md5Hex(sourceHashes)
    }
  }

  verifyCurrentEnv (fixedHashes, cache) {
    const envName = currentEnv()

    const sourcesToHash = this.selectByEnv(this.sources, envName)
    const expectedSourceHashes = sourcesToHash.map(item => item.hash)
    const pendingSourceHashes = hashSources(sourcesToHash, fixedHashes && fixedHashes.sources, cache)

    let checkedBabelrcFile = true
    if (this.babelrcDir) {
      const babelrcFile = path.join(this.babelrcDir, '.babelrc')
      if (!sourcesToHash.some(item => item.source === babelrcFile)) {
        checkedBabelrcFile = ensureMissingBabelrcFile(babelrcFile, cache)
      }
    }

    const dependenciesToHash = this.selectByEnv(this.dependencies, envName)
    const expectedDependencyHashes = dependenciesToHash.map(item => item.hash)
    const pendingDependencyHashes = hashDependencies(dependenciesToHash, cache)

    return Promise.all([
      pendingSourceHashes,
      checkedBabelrcFile
    ])
      .then(result => {
        const sourceHashes = result[0]
        const babelrcFileIsSame = result[1]

        if (!babelrcFileIsSame || !isEqual(sourceHashes, expectedSourceHashes)) {
          return { sourcesChanged: true }
        }

        return pendingDependencyHashes
          .then(dependencyHashes => {
            const dependenciesChanged = !isEqual(dependencyHashes, expectedDependencyHashes)

            let verifier = this
            if (dependenciesChanged) {
              const dependencies = this.dependencies.map((item, index) => {
                const hash = dependencyHashes[index]
                return Object.assign({}, item, { hash })
              })

              verifier = new Verifier(this.babelrcDir, this.envNames, dependencies, this.sources)
            }

            return {
              sourcesChanged: false,
              dependenciesChanged,
              cacheKeys: {
                dependencies: md5Hex(dependencyHashes),
                sources: md5Hex(sourceHashes)
              },
              verifier
            }
          })
      })
      .catch(err => {
        if (err.name === 'NoSourceFileError') {
          return {
            missingSource: true
          }
        }

        if (err.name === 'BadDependencyError') {
          return {
            badDependency: true
          }
        }

        throw err
      })
  }

  toBuffer () {
    return SafeBuffer.from(JSON.stringify({
      babelrcDir: this.babelrcDir,
      envNames: this.envNames,
      dependencies: this.dependencies,
      sources: this.sources
    }, (key, value) => {
      return key === 'envNames' || key === 'envs'
        ? Array.from(value)
        : value
    }, 2))
  }

  static fromBuffer (buffer) {
    const json = JSON.parse(buffer.toString('utf8'), (key, value) => {
      return key === 'envNames' || key === 'envs'
        ? new Set(value)
        : value
    })
    return new this(json.babelrcDir, json.envNames, json.dependencies, json.sources)
  }

  static hashAndCreate (babelrcDir, envNames, dependencies, sources, fixedSourceHashes, cache) {
    return Promise.all([
      hashDependencies(dependencies, cache),
      hashSources(sources, fixedSourceHashes, cache)
    ])
      .then(results => {
        const dependencyHashes = results[0]
        const sourceHashes = results[1]

        dependencies.forEach((item, index) => {
          item.hash = dependencyHashes[index]
        })
        sources.forEach((item, index) => {
          item.hash = sourceHashes[index]
        })

        return new this(babelrcDir, envNames, dependencies, sources)
      })
  }
}
module.exports = Verifier
