'use strict'

const gfs = require('graceful-fs')

function readSafe (source, cache) {
  if (cache && cache.files && cache.files.has(source)) {
    return cache.files.get(source)
  }

  const promise = new Promise((resolve, reject) => {
    gfs.readFile(source, (err, contents) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(null)
        } else {
          reject(err)
        }
      } else {
        resolve(contents)
      }
    })
  })

  if (cache && cache.files) {
    cache.files.set(source, promise)
  }
  return promise
}
module.exports = readSafe
