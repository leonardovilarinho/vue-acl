'use strict';
const ESPOWER_PATTERNS = require('./espower-patterns.json');

module.exports = (context, options) => {
	const plugins = [];

	if (!options || options.powerAssert !== false) {
		plugins.push(require('babel-plugin-espower/create')(context, {
			embedAst: true,
			patterns: ESPOWER_PATTERNS
		}));
	}

	plugins.push(require('@ava/babel-plugin-throws-helper'));

	return {plugins};
};
