'use strict';
const fs = require('fs');
const path = require('path');
const execa = require('execa');
const hasYarn = require('has-yarn');
const readPkgUp = require('read-pkg-up');
const writePkg = require('write-pkg');
const arrExclude = require('arr-exclude');

const DEFAULT_TEST_SCRIPT = 'echo "Error: no test specified" && exit 1';

module.exports = opts => {
	opts = opts || {};

	const ret = readPkgUp.sync({
		cwd: opts.cwd,
		normalize: false
	});
	const pkg = ret.pkg || {};
	const pkgPath = ret.path || path.resolve(opts.cwd || process.cwd(), 'package.json');
	const pkgCwd = path.dirname(pkgPath);
	const cli = opts.args || process.argv.slice(2);
	const args = arrExclude(cli, ['--init', '--unicorn']);
	const cmd = 'ava' + (args.length > 0 ? ' ' + args.join(' ') : '');

	pkg.scripts = pkg.scripts ? pkg.scripts : {};

	const s = pkg.scripts;
	if (s.test && s.test !== DEFAULT_TEST_SCRIPT) {
		s.test = s.test.replace(/\bnode (test\/)?test\.js\b/, cmd);

		if (!/\bava\b/.test(s.test)) {
			s.test += ` && ${cmd}`;
		}
	} else {
		s.test = cmd;
	}

	writePkg.sync(pkgPath, pkg);

	const post = () => {
		// For personal use
		if (cli.indexOf('--unicorn') !== -1) {
			const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
			pkg.devDependencies.ava = '*';
			writePkg.sync(pkgPath, pkg);
		}
	};

	if (opts.skipInstall) {
		return Promise.resolve(post);
	}

	if (hasYarn(pkgCwd)) {
		return execa('yarn', ['add', '--dev', 'ava'], {cwd: pkgCwd}).then(post);
	}

	return execa('npm', ['install', '--save-dev', 'ava'], {
		cwd: pkgCwd,
		stdio: 'inherit'
	}).then(post);
};
