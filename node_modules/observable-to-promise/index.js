'use strict';
const isObservable = require('is-observable');
const symbolObservable = require('symbol-observable').default;

module.exports = val => {
	if (!isObservable(val)) {
		throw new TypeError('Expected an Observable');
	}

	const ret = [];

	return new Promise((resolve, reject) => {
		val[symbolObservable]().subscribe({
			next: x => {
				ret.push(x);
			},
			error: reject,
			complete: () => {
				resolve(ret);
			}
		});
	});
};
