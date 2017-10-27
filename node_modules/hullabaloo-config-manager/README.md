# hullabaloo-config-manager

Manages complex [Babel] config chains, avoiding duplicated work and enabling
effective caching.

> Hullabaloo: informal of "babel" (noun)
>
> A confused noise, typically that made by a number
of voices: *the babel of voices on the road.*

Use this package to resolve [Babel] config chains. The resulting options result
in equivalent compilation behavior as if `babel-core` had resolved the config.

A Node.js-compatible JavaScript module can be generated which exports a function
that provides the options object, applicable for the current environment. This
module can be written to disk and reused.

Config sources and plugin and preset dependencies can be hashed and used as
cache keys. The cache keys and generated module can be verified to avoid having
to repeatedly resolve the config chains, and to be sure a previously
transformation result can be reused.

This module is used by [AVA].

## Installation

```console
$ npm install --save hullabaloo-config-manager
```

## Usage

```js
const configManager = require('hullabaloo-config-manager')
```

## API

### `currentEnv(): string`

Returns the current environment value, just like `babel-core` would determine
it.

### `fromDirectory(dir: string, options?: {cache: Cache}): Promise<null | ResolvedConfig>`

Asynchronously resolves config chains from the `dir` directory. If no config can
be found the promise is resolved with `null`. Otherwise it is resolved with the
[resulting config object](#resolvedconfig). The promise is rejected if
[errors](#errors) occur.

A `cache` object may be provided.

### `createConfig(options: {options: BabelOptions, source: string, dir?: string, hash?: string, json5?: false}): Config`

Creates and returns an in-memory [config object](#config). The first argument
must be provided, and it must have a valid [`options` object](#babeloptions) and
`source` value.

If the `dir` value is not provided it's derived from the `source` value.
Dependencies are resolved relative to this `dir`.

If the config source does not exist on disk the `hash` value should be provided,
otherwise hashes cannot be created for the config.

The `json5` property can be set to `false` if the `options` object can be
serialized using `JSON.stringify()`.

Note that the `options` object is cloned (deeply) before use.

### `fromConfig(baseConfig: Config, options?: {cache: Cache}): Promise<ResolvedConfig>`

Asynchronously resolves config chains, starting with the `baseConfig`. The
`baseConfig` must be created using the `createConfig()` method. The promise is
resolved with the [resulting config object](#resolvedconfig). The promise is
rejected if [errors](#errors) occur.

A `cache` object may be provided.

### `restoreVerifier(buffer: Buffer): Verifier`

Deserializes a [`Verifier`](#verifier). The `buffer` should be created using
`Verifier#toBuffer()`.

### `prepareCache(): Cache`

Creates a cache object that can be passed to the above functions. This may
improve performance by avoiding repeatedly reading files from disk or computing
hashes.

---

### `Config`

Use `createConfig()` to create this object.

#### `Config#extend(config: Config)`

Extend the config with another config. Throws a `TypeError` if the config was
created with an `extends` clause in its `options`. It throws an `Error` if it
has already been extended.

---

### `BabelOptions`

See <https://babeljs.io/docs/usage/api/#options>.

---

### `ResolvedConfig`

Returned by `fromConfig()` and `fromDirectory()`.

#### `ResolvedConfig#generateModule(): string`

Generates a Node.js-compatible JavaScript module which exports a `getOptions()`
function. This function returns a unique options object, applicable for the
current environment, that can be passed to `babel-core` methods.

This module needs to evaluated before the `getOptions()` method can be accessed.

#### `ResolvedConfig#createVerifier(): Promise<Verifier>`

Asynchronously hashes plugin and preset dependencies of the resolved config, as
well as config sources, and resolves the promise with a [`Verifier`](#verifier)
object.

---

### `Verifier`

Use `restoreVerifier()` or `ResolvedConfig#createVerifier()` to create this
object.

#### `Verifier#cacheKeysForCurrentEnv(): {dependencies: string, sources: string}`

Synchronously returns cache keys for the plugin and preset dependencies, and
config sources, that are applicable to the current environment. Use these values
to cache the result of `babel-core` transforms.

#### `Verifier#verifyCurrentEnv(fixedHashes?: {sources: {[source: string]: string}}, cache?: Cache): Promise<{badDependency: true} | {missingSource: true} | {sourcesChanged: true} |  {cacheKeys: {dependencies: string, sources: string}, dependenciesChanged: boolean, sourcesChanged: false, verifier: Verifier}>`

Asynchronously verifies whether the config is still valid for the current
environment.

Provide `fixedHashes` if the verifier was derived from a created config with a
fixed `hash` value. A `cache` object may also be provided.

The promise is resolved with an object describing the verification result:

* If the object has a `badDependency` property then a plugin or preset
dependency could not be hashed, presumably because it no longer exists.

* If it has a `missingSource` property then a config source no longer exists.

* If its `sourcesChanged` property is `true` then config sources have changed
and the config is no longer valid.

* If its `dependenciesChanged` property is `true` then plugin or preset
dependencies have changed, but the config itself is still valid. The `verifier`
property holds a new `Verifier` object which takes the new dependencies into
account. The `cacheKeys` property contains the same result as calling
`Verifier#cacheKeysForCurrentEnv()` on the returned `verifier`.

* If its `sourcesChanged` and `dependenciesChanged` properties are both `false`
then the config is valid and cache keys won't have changed. The `verifier`
property holds the same `Verifier` object. The `cacheKeys` properties contains
the same result as calling `Verifier#cacheKeysForCurrentEnv()`.

#### `Verifier#toBuffer()`

Serializes the verifier state into a `Buffer` object. Use `restoreVerifier()`
to deserialize.

---

### Errors

Error constructors are not publicly available, but errors can be identified by
their `name` property.

#### `BadDependencyError`

Used when a plugin or preset dependency couldn't be resolved. The corresponding
package or file name is available through the `source` property. There may be
another error with more details, available through the `parent` property.

#### `ExtendsError`

Used when an `extends` clause points at a non-existent file. The config file
that contains the clause is available through the `source` property. The clause
itself is available through the `clause` property. Has a `parent` property that
contains a `NoSourceFile` error.

#### `InvalidFileError`

Used when a config file is invalid. The file path is available through the
`source` property.

#### `NoSourceFileError`

Used when a file does not exist. The file path is available through the `source`
property.

#### `ParseError`

Used when a config file cannot be parsed (this is different from it being
invalid). The file path is available through the `source` property. The parsing
error is available through the `parent` property.

[AVA]: https://ava.li/
[Babel]: https://babeljs.io/
