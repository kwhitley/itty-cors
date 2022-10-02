interface CorsOptions {
  allowOrigin: string,
  maxAge: number,
  methods: string[],
  headers: any,
}

export const createCors = (options?: CorsOptions) => {
  const {
    allowOrigin = '*',
    maxAge = 3600,
    methods = ['GET'],
    headers = {},
  } = options


  // unroll existing headers to object
  const mappedHeaders = (headers) => [...headers].reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

  const responseHeaders = {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': methods.join(', '),
    'Access-Control-Max-Age': maxAge,
    ...headers,
  }

  const preflight = (r) => {
    const useMethods = [...new Set(['OPTIONS', ...methods])]

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
      let headers = {
        ...responseHeaders,
        'Access-Control-Allow-Methods': useMethods.join(', '),
        // Allow all future content Request headers to go back to browser
        // such as Authorization (Bearer) or X-Client-Name-Version
        'Access-Control-Allow-Headers': r.headers.get('Access-Control-Request-Headers'),
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

  const corsify = (response) => {
    if (response.headers.get('access-control-allow-origin')) {
      return response // terminate immediately if CORS already set
    }

    const { method, headers, status, body } = response

    return new Response(body, {
      status,
      headers: {
        ...headers,
        ...responseHeaders,
      },
    })
  }

  return {
    corsify,
    preflight,
  }
}
