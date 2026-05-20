# SMG Automotive Configuration

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

It loads configuration for a specific stage via `dotenv` from `.env/<CONFIG_ENV>`. If no environment is provided it defaults to `NODE_ENV`.

You can add local overrides in `.env/<CONFIG_ENV>.local`. This is useful for temporary or local changes.

## Usage
```
npm install @smg-automotive/configuration
```

The package exports a `loadConfiguration` function.

Add the following line to your `.gitignore`
```
/.env/*.local
```

The configuration environment can be passed via `CONFIG_ENV` environment variable:

```
$ CONFIG_ENV=stage-prod npm run dev
```

## Upgrading

The package no longer eagerly loads configuration when imported. The root export is now a
`loadConfiguration` function, so update existing imports to call it explicitly:

```
// Before
const configuration = require("@smg-automotive/configuration")

// After
const loadConfiguration = require("@smg-automotive/configuration")
const configuration = loadConfiguration()
```

For side-effect only usage, call the required function:

```
// Before
require("@smg-automotive/configuration")

// After
require("@smg-automotive/configuration")()
```

If the config can be loaded from a different working directory than the app directory, pass
`envDir` explicitly:

```
const path = require("path")
const loadConfiguration = require("@smg-automotive/configuration")

const configuration = loadConfiguration({
  envDir: path.join(__dirname, ".env")
})
```

In a nextjs project, you can call `loadConfiguration()` in `next.config.js` and pass the result to next as `env`, see https://nextjs.org/docs/api-reference/next.config.js/environment-variables - configuration values will be available on `process.env` both client- and server-side

```
const loadConfiguration = require("@smg-automotive/configuration")

const configuration = loadConfiguration()

module.exports = {
  env: configuration
}
```

If your `next.config.js` can be required by tooling from a different working directory, load the
configuration from an explicit `.env` directory instead:

```
const path = require("path")
const loadConfiguration = require("@smg-automotive/configuration")

const configuration = loadConfiguration({
  envDir: path.join(__dirname, ".env")
})

module.exports = {
  env: configuration
}
```

In any node process, call the package in your entry point and access variables on `process.env`. Do this as early in the file as possible, ie. before requiring any files that are accessing config variables

```
require("@smg-automotive/configuration")()
```

## Development
```
npm run build
```

You can link your local npm package to integrate it with any local project:
```
cd configuration-pkg
npm run build

cd project
npm link ../configuration-pkg/dist
```

## Release a new version

New versions are released on the ci using semantic-release as soon as you merge into master. Please
make sure your merge commit message adheres to the corresponding conventions.


## Circle CI

You will need to enable the repository in circle CI ui to be able to build it.

For slack notifications to work you will need to provide the token in circle settings.
