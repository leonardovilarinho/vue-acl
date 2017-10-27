# @ava/babel-preset-transform-test-files [![Build Status](https://travis-ci.org/avajs/babel-preset-transform-test-files.svg?branch=master)](https://travis-ci.org/avajs/babel-preset-transform-test-files)

> [Babel] preset for use with [AVA] test files

Currently contains:

- [`babel-plugin-espower`](https://github.com/power-assert-js/babel-plugin-espower) and the patterns that should be enhanced
- [`@ava/babel-plugin-throws-helper`](https://github.com/avajs/babel-plugin-throws-helper/)


## Install

```console
$ npm install --save @ava/babel-preset-transform-test-files
```


## Usage

Add `@ava/transform-test-files` to your [Babel] presets. You can disable `babel-plugin-espower` by setting the `powerAssert` option to `false`:

```json
{
  "presets": [
    ["@ava/transform-test-files", {"powerAsssert": false}]
  ]
}
```

Require `@ava/babel-preset-transform-test-files/package-hash` to get a combined hash for the installed version of the preset, as well as the plugins used.


[AVA]: https://ava.li
[Babel]: https://babeljs.io
