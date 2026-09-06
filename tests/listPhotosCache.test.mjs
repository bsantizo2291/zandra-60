import assert from 'node:assert/strict'
import test from 'node:test'
import handler, { __expireGalleryCacheForTests, __resetGalleryCacheForTests } from '../api/list-photos.js'

function createResponse() {
  const output = { headers: {}, status: null, body: null }
  const response = {
    setHeader(key, value) { output.headers[key] = value },
    status(code) { output.status = code; return response },
    json(body) { output.body = body; return response },
    end() { return response },
  }
  return { response, output }
}

test('gallery route caches a successful memories response instead of listing Cloudinary again', async () => {
  const originalFetch = global.fetch
  const oldKey = process.env.CLOUDINARY_API_KEY
  const oldSecret = process.env.CLOUDINARY_API_SECRET
  process.env.CLOUDINARY_API_KEY = 'test-key'
  process.env.CLOUDINARY_API_SECRET = 'test-secret'
  __resetGalleryCacheForTests()
  let calls = 0
  global.fetch = async () => {
    calls += 1
    return { ok: true, json: async () => ({ resources: [{ public_id: 'memory-photo', created_at: '2026-09-05T00:00:00Z' }] }) }
  }
  try {
    const first = createResponse()
    const second = createResponse()
    await handler({ method: 'GET', query: { collection: 'memories' } }, first.response)
    await handler({ method: 'GET', query: { collection: 'memories' } }, second.response)
    assert.equal(calls, 1)
    assert.equal(first.output.body.photos[0].public_id, 'memory-photo')
    assert.equal(second.output.body.cached, true)
    assert.equal(second.output.headers['X-Gallery-Cache'], 'HIT')
  } finally {
    global.fetch = originalFetch
    if (oldKey === undefined) delete process.env.CLOUDINARY_API_KEY
    else process.env.CLOUDINARY_API_KEY = oldKey
    if (oldSecret === undefined) delete process.env.CLOUDINARY_API_SECRET
    else process.env.CLOUDINARY_API_SECRET = oldSecret
    __resetGalleryCacheForTests()
  }
})

test('gallery route serves its last successful response during a temporary Cloudinary limit', async () => {
  const originalFetch = global.fetch
  const oldKey = process.env.CLOUDINARY_API_KEY
  const oldSecret = process.env.CLOUDINARY_API_SECRET
  process.env.CLOUDINARY_API_KEY = 'test-key'
  process.env.CLOUDINARY_API_SECRET = 'test-secret'
  __resetGalleryCacheForTests()
  let shouldLimit = false
  global.fetch = async () => shouldLimit
    ? { ok: false, status: 420, text: async () => 'Rate Limit Exceeded' }
    : { ok: true, json: async () => ({ resources: [{ public_id: 'memory-photo', created_at: '2026-09-05T00:00:00Z' }] }) }
  try {
    const first = createResponse()
    await handler({ method: 'GET', query: { collection: 'memories' } }, first.response)
    __expireGalleryCacheForTests('memories')
    shouldLimit = true
    const limited = createResponse()
    await handler({ method: 'GET', query: { collection: 'memories' } }, limited.response)
    assert.equal(limited.output.status, 200)
    assert.equal(limited.output.body.stale, true)
    assert.equal(limited.output.body.photos[0].public_id, 'memory-photo')
    assert.equal(limited.output.headers['X-Gallery-Cache'], 'STALE')
  } finally {
    global.fetch = originalFetch
    if (oldKey === undefined) delete process.env.CLOUDINARY_API_KEY
    else process.env.CLOUDINARY_API_KEY = oldKey
    if (oldSecret === undefined) delete process.env.CLOUDINARY_API_SECRET
    else process.env.CLOUDINARY_API_SECRET = oldSecret
    __resetGalleryCacheForTests()
  }
})

test('memories route returns a preserved read-only fallback if a rate limit happens before cache warmup', async () => {
  const originalFetch = global.fetch
  const oldKey = process.env.CLOUDINARY_API_KEY
  const oldSecret = process.env.CLOUDINARY_API_SECRET
  process.env.CLOUDINARY_API_KEY = 'test-key'
  process.env.CLOUDINARY_API_SECRET = 'test-secret'
  __resetGalleryCacheForTests()
  global.fetch = async () => ({ ok: false, status: 420, text: async () => 'Rate Limit Exceeded' })
  try {
    const result = createResponse()
    await handler({ method: 'GET', query: { collection: 'memories' } }, result.response)
    assert.equal(result.output.status, 200)
    assert.equal(result.output.body.fallback, true)
    assert.equal(result.output.body.photos.length, 213)
    assert.equal(result.output.body.photos[0].public_id, 'fy2vls6eeobdorrmr4uk')
    assert.equal(result.output.headers['X-Gallery-Cache'], 'EMERGENCY')
  } finally {
    global.fetch = originalFetch
    if (oldKey === undefined) delete process.env.CLOUDINARY_API_KEY
    else process.env.CLOUDINARY_API_KEY = oldKey
    if (oldSecret === undefined) delete process.env.CLOUDINARY_API_SECRET
    else process.env.CLOUDINARY_API_SECRET = oldSecret
    __resetGalleryCacheForTests()
  }
})
