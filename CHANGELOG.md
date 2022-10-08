## Changelog
Until this library makes it to a production release of v1.x, **minor versions may contain breaking changes to the API**.  After v1.x, semantic versioning will be honored, and breaking changes will only occur under the umbrella of a major version bump.

- **v0.3.0** - `preflight` now **MUST** be included on the `.all` channel (all methods), rather than `.options` alone, to allow for origin-checking.
  ```js
  // previously
  router.options('*', preflight)

  // now
  router.all('*', preflight)
  ```
- **v0.2.0 (API CHANGE)** - `allowOrigins: string` has been replaced with `origins: string[]` to accept an array of origins, and multi-origin support is now correctly implemented.
  ```js
  // previously
  const { preflight, corsify } = createCors({ allowOrigin: '*' })

  // now
  const { preflight, corsify } = createCors({ origins: ['*'] })
  ```
- **v0.1.0** - first public release
