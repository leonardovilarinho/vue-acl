'use strict';
const packageHash = require('package-hash');

const plugins = require('./plugins/best-match')
	.map(module => require.resolve(`${module}/package.json`));

module.exports = packageHash.sync([require.resolve('./package.json')].concat(plugins));
