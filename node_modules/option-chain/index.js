'use strict';
module.exports = (options, fn, target) => {
	const chainables = options.chainableMethods || {};
	const spread = options.spread;
	const defaults = Object.assign({}, options.defaults);

	function extend(target, getter, ctx) {
		for (const key of Object.keys(chainables)) {
			Object.defineProperty(target, key, {
				enumerable: true,
				configurable: true,
				get() {
					return wrap(getter, chainables[key], ctx || this);
				}
			});
		}
	}

	function wrap(createOpts, extensionOpts, ctx) {
		function wrappedOpts() {
			return Object.assign(createOpts(), extensionOpts);
		}

		function wrappedFn() {
			let args = new Array(arguments.length);

			for (let i = 0; i < args.length; i++) {
				args[i] = arguments[i];
			}

			if (spread) {
				args.unshift(wrappedOpts());
			} else {
				args = [wrappedOpts(), args];
			}

			return fn.apply(ctx || this, args);
		}

		extend(wrappedFn, wrappedOpts, ctx);

		return wrappedFn;
	}

	function copyDefaults() {
		return Object.assign({}, defaults);
	}

	if (target) {
		extend(target, copyDefaults);
		return target;
	}

	return wrap(copyDefaults);
};
