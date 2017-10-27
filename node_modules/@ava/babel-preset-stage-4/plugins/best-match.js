'use strict';
/* eslint-disable import/no-dynamic-require, import/no-unresolved */
const process = require('process');

function getClosestVersion() {
	const version = parseFloat(process.versions.node);
	if (version >= 8) {
		return 8;
	}

	if (version >= 6) {
		return 6;
	}

	// Node.js 4 is the minimal supported version.
	return 4;
}

module.exports = require(`./${getClosestVersion()}.json`);
