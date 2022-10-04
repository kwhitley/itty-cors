interface CorsOptions {
  origins: string[],
  maxAge: number,
  methods: string[],
  headers: any,
}

export const createCors = (options?: CorsOptions) => {
  const {
    origins = ['*'],
    maxAge = 3600,
    methods = ['GET'],
    headers = {},
  } = options

  let allowOrigin

  const responseHeaders = {
    'content-type': 'application/json',
    'Access-Control-Allow-Methods': methods.join(', '),
    'Access-Control-Max-Age': maxAge,
    ...headers,
  }

  const preflight = (r) => {
    const useMethods = [...new Set(['OPTIONS', ...methods])]

    const origin = r.headers.get('origin')

    // set allowOrigin globally
    allowOrigin = (origins.includes(origin) || origins.includes('*')) &&
      { 'Access-Control-Allow-Origin': origin }
    console.log('OPTIONS request, setting allowOrigin to', allowOrigin)

    if (r.method === 'OPTIONS') {
      // Make sure the necessary headers are present
      // for this to be a valid pre-flight request
      if (
        r.headers.get('Origin') !== null &&
        r.headers.get('Access-Control-Request-Method') !== null &&
        r.headers.get('Access-Control-Request-Headers') !== null
      ) {
        // Handle CORS pre-flight request.
        // If you want to check or reject the requested method + headers
        // you can do that here.
        const headers = {
          ...responseHeaders,
          'Access-Control-Allow-Methods': useMethods.join(', '),
          'Access-Control-Allow-Headers': r.headers.get('Access-Control-Request-Headers'),
          ...allowOrigin,
        }

        return new Response(null, { headers })
      }

      // Handle standard OPTIONS request.
      // If you want to allow other HTTP Methods, you can do that here.
      return new Response(null, {
        headers: {
          Allow: useMethods.join(', '),
        },
      })
    }
  }

  const corsify = (response) => {
    const { headers, status, body } = response

    if (headers.get('access-control-allow-origin') || [301, 302, 308].includes(status)) {
      return response // terminate immediately if CORS already set
    }

    console.log('corsifying response', { allowOrigin })

    return new Response(body, {
      status,
      headers: {
        ...headers,
        ...responseHeaders,
        ...allowOrigin,
      },
    })
  }

  return {
    corsify,
    preflight,
  }
}
