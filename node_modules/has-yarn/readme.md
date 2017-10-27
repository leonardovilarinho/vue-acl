# has-yarn [![Build Status](https://travis-ci.org/sindresorhus/has-yarn.svg?branch=master)](https://travis-ci.org/sindresorhus/has-yarn)

> Check if a project is using [Yarn](https://yarnpkg.com)

Useful for tools that needs to know whether to use `yarn` or `npm` to install dependencies.


## Install

```
$ npm install --save has-yarn
```


## Usage

```
.
├── foo
│   └── package.json
└── bar
    ├── package.json
    └── yarn.lock
```

```js
const hasYarn = require('has-yarn');

hasYarn('foo');
//=> false

hasYarn('bar');
//=> true
```


## API

### hasYarn([cwd])

Returns a `boolean`.

#### cwd

Type: `string`<br>
Default: `process.cwd()`

Current working directory.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
