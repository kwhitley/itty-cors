import { createCors } from './itty-cors'
import { describe, expect, it } from 'vitest'

describe('fetcher', () => {
  it('exports { createCors: function } as a named export', () => {
    expect(typeof createCors).toBe('function')
  })
})

describe('corsify', () => {
  it('throws when provided an unhandled request', () => {
    const { corsify } = createCors({});
    expect(corsify).toThrowErrorMatchingInlineSnapshot(
      '"No fetch handler responded and no upstream to proxy to specified."',
    );
  })
})
