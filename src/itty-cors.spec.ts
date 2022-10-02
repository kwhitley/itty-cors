import { createCors } from './itty-cors'
import { describe, expect, it } from 'vitest'

describe('fetcher', () => {
  it('exports { createCors: function } as a named export', () => {
    expect(typeof createCors).toBe('function')
  })
})
