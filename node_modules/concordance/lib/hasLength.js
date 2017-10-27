'use strict'

const hop = Object.prototype.hasOwnProperty
function hasLength (obj) {
  return Array.isArray(obj) || (hop.call(obj, 'length') && typeof obj.length === 'number')
}
module.exports = hasLength
