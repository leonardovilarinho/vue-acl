'use strict'

const env = require('process').env

function currentEnv () {
  return env.BABEL_ENV || env.NODE_ENV || 'development'
}
module.exports = currentEnv
