'use strict'

const codegen = require('./codegen')
const reduceChains = require('./reduceChains')
const Verifier = require('./Verifier')

class ResolvedConfig {
  constructor (chains, cache) {
    this.cache = cache
    this.babelrcDir = chains.babelrcDir

    const reduced = reduceChains(chains, cache)
    this.dependencies = reduced.dependencies
    this.envNames = reduced.envNames
    this.fixedSourceHashes = reduced.fixedSourceHashes
    this.sources = reduced.sources
    this.unflattenedDefaultOptions = reduced.unflattenedDefaultOptions
    this.unflattenedEnvOptions = reduced.unflattenedEnvOptions
  }

  createVerifier () {
    return Verifier.hashAndCreate(
      this.babelrcDir,
      this.envNames,
      this.dependencies,
      this.sources,
      this.fixedSourceHashes,
      this.cache)
  }

  generateModule () {
    return codegen(this)
  }
}
module.exports = ResolvedConfig
