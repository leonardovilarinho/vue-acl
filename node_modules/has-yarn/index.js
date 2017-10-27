'use strict';
const path = require('path');
const fs = require('fs');

module.exports = cwd => fs.existsSync(path.resolve(cwd || process.cwd(), 'yarn.lock'));
