import { Router } from 'itty-router'
import { error, json, missing, status } from 'itty-router-extras'

// response-modifying middleware to add CORS headers (including in OPTIONS requests)
const addCorsheaders = response => {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'authorization, referer, origin, content-type')
  response.headers.set('Access-Control-Max-Age', '3600')

  return response
}

// create a router
const router = Router()

// 204 CORS response for all options requests
router.options('*', () => status(204))

// add routes
router.get('/test', () => json({ success: true }))

// 404 for all other routes
router.get('*', () => missing('Are you sure about that?'))

export default {
  fetch: (...args) => router
                        .handle(...args)
                        .then(addCorsheaders)
                        .catch(error),
}
