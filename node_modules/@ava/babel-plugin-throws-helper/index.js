'use strict';

module.exports = babelCore => {
	const t = babelCore.types;
	const wrapArg = babelCore.template('(START(t, ASSERTION, FILE, LINE), END(t, ARG))');
	const helpers = babelCore.template(`function START(t, assertion, file, line) {
  if (t._throwsArgStart) {
    t._throwsArgStart(assertion, file, line);
  }
}

function END(t, arg) {
  if (t._throwsArgEnd) {
    t._throwsArgEnd();
  }

  return arg;
}`);

	const assertionVisitor = {
		CallExpression(path, state) {
			const callee = path.get('callee');
			if (!callee.isMemberExpression() || !callee.get('object').isIdentifier({name: 't'}) || !callee.get('property').isIdentifier()) {
				return;
			}

			const assertion = callee.get('property').get('name').node;
			if (assertion !== 'throws' && assertion !== 'notThrows') {
				return;
			}

			const arg0 = path.node.arguments[0];
			if (!(arg0 && arg0.loc && (typeof arg0.start === 'number') && (typeof arg0.end === 'number'))) {
				return;
			}

			// Wrap the argument expression, so that the stack trace of the assertion
			// isn't affected.
			path.node.arguments[0] = wrapArg(Object.assign({
				ARG: arg0,
				ASSERTION: t.stringLiteral(assertion),
				FILE: t.stringLiteral(state.file.opts.filename),
				LINE: t.numericLiteral(arg0.loc.start.line)
			}, this.installHelper())).expression;
		}
	};

	return {
		visitor: {
			Program(path, state) {
				const START = t.identifier(path.scope.generateUid('avaThrowsHelperStart'));
				const END = t.identifier(path.scope.generateUid('avaThrowsHelperEnd'));
				const helperIdentifiers = {START, END};

				let created = false;
				path.traverse(assertionVisitor, {
					installHelper() {
						if (!created) {
							created = true;
							path.unshiftContainer('body', helpers(helperIdentifiers));
						}

						return helperIdentifiers;
					},
					file: state.file
				});
			}
		}
	};
};
