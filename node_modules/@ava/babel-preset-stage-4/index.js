'use strict';
/* eslint-disable import/no-dynamic-require */
module.exports = () => {
	const plugins = require(`./plugins/best-match`)
		.map(module => require(module));

	return {plugins};
};
