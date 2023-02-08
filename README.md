# ![itty-cors](https://user-images.githubusercontent.com/865416/193479569-da9e4d63-cd0e-44da-ab00-43322bf4cd51.png)

[![Version](https://img.shields.io/npm/v/itty-cors.svg?style=flat-square)](https://npmjs.com/package/itty-cors)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/itty-cors?style=flat-square)](https://bundlephobia.com/result?p=itty-cors)
[![Build Status](https://img.shields.io/github/actions/workflow/status/kwhitley/itty-cors/verify.yml?branch=v0.x&style=flat-square)](https://github.com/kwhitley/itty-cors/actions/workflows/verify.yml)
[![Coverage Status](https://img.shields.io/coveralls/github/kwhitley/itty-cors/v0.x?style=flat-square)](https://coveralls.io/github/kwhitley/itty-cors?branch=v0.x)
[![NPM Weekly Downloads](https://img.shields.io/npm/dw/itty-cors?style=flat-square)](https://npmjs.com/package/itty-cors)
[![Open Issues](https://img.shields.io/github/issues/kwhitley/itty-cors?style=flat-square)](https://github.com/kwhitley/itty-cors/issues)

[![Discord](https://img.shields.io/discord/832353585802903572?style=flat-square)](https://discord.com/channels/832353585802903572)
[![GitHub Repo stars](https://img.shields.io/github/stars/kwhitley/itty-cors?style=social)](https://github.com/kwhitley/itty-cors)
[![Twitter](https://img.shields.io/twitter/follow/kevinrwhitley.svg?style=social&label=Follow)](https://www.twitter.com/kevinrwhitley)

Simple CORS-handling for any [itty-router](https://npmjs.com/package/itty-router) API.  Designed on Cloudflare Workers, but works anywhere.

## Features
- Tiny. Currently ~600 bytes, with zero-dependencies.
- Fully Typed/TypeScript
- Granular control over allowed methods, origins, etc.
- handles OPTIONS preflight requests
- response processor (`corsify`) can be used per-response, or globally downstream

## !! Breaking API Changes (pre v1.x)!!
You're using an early-access package.  Until itty-cors hits a stable v1.0 release, API changes will be broadcasted as minor version bumps.
- **v0.3.0** - `preflight` now **MUST** be included on the `.all` channel (all methods), rather than `.options` alone, to allow for origin-checking.
- **v0.2.0** - `allowOrigins: string` has been replaced with `origins: string[]` to accept an array of origins, and multi-origin support is now correctly implemented.
  ```js
  // previously
  const { preflight, corsify } = createCors({ allowOrigin: '*' })

  // now
  const { preflight, corsify } = createCors({ origins: ['*'] })
  ```

## Simple Usage
```js
import { Router } from 'itty-router'
import { error, json, missing } from 'itty-router-extras'
import { createCors } from 'itty-cors'

// create CORS handlers
const { preflight, corsify } = createCors()

const router = Router()

// register v2 API plus all routes
router
  .all('*', preflight)                                  // handle CORS preflight/OPTIONS requests
  .get('/version', () => json({ version: '0.1.0' }))    // GET release version
  .get('/stuff', () => json(['foo', 'bar', 'baz']))     // GET some other random stuff
  .all('*', () => missing('Are you sure about that?'))  // 404 for all else

// CF ES6 module syntax
export default {
  fetch: (...args) => router
                        .handle(...args)
                        .catch(err => error(500, err.stack))
                        .then(corsify) // cors should be applied to error responses as well
}
```

## CORS enabled on a single route (and advanced options)
```js
import { Router } from 'itty-router'
import { error, json, missing } from 'itty-router-extras'
import { createCors } from 'itty-cors'

// create CORS handlers
const { preflight, corsify } = createCors({
  methods: ['GET', 'POST', 'DELETE'], // GET is included by default... omit this if only using GET
  origins: ['*'],                     // defaults to allow all (most common).  Restrict if needed.
  maxAge: 3600,
  headers: {
    'my-custom-header': 'will be injected with each CORS-enabled response',
  },
})

const router = Router()

// register v2 API plus all routes
router
  .all('*', preflight)                                  // handle CORS preflight/OPTIONS requests
  .get('/version', () => corsify(json({ version: '0.1.0' })))  // GET release version (CORS-enabled)
  .get('/stuff', () => json(['foo', 'bar', 'baz']))     // GET some other random stuff (no CORS allowed)
  .all('*', () => missing('Are you sure about that?'))  // 404 for all else

// CF ES6 module syntax
export default {
  fetch: (...args) => router
                        .handle(...args)
                        .catch(err => error(500, err.stack))
}
```

# API

### `createCors(options?) => { preflight: function, corsify: function }`
Returns an object with two properties, `preflight` (a preflight OPTIONS middleware), and `corsify` (a response-handling function).

| Option | Type(s) | Default | Description |
| --- | --- | --- | --- |
| **origins** | `string[]` | `['*']` | By default, all origins are allowed (most common).  Modify this to restrict to specific origins.
| **maxAge** | `number` | `3600` | Set the expiry of responses
| **methods** | `string[]` | `['GET']` | Define which methods are allowed.  `OPTIONS` will be automatically added.
| **headers** | `object` | `{}` | Add any custom headers to be injected with CORS-enabled responses.

### `preflight(request: Request) => Response`
This is the preflight middleware to be injected upstream on options requests. Since v0.3.0, `preflight` **MUST** be included on the `.all` channel (all methods), rather than `.options` alone, to allow for origin-checking.
```js
router.all('*', preflight) // that's it!
```

### `corsify(response: Response) => Response`
This wrapper injects CORS headers into a response, if not already set (upstream).  Use this at the end of the `router.handle` Promise chain to CORS-enable all responses/the entire API, or wrap any response generator (e.g. `json()` from itty-router-extras) to make a single CORS-enabled response.
