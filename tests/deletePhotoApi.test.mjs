import assert from 'node:assert/strict'
import test from 'node:test'
import handler from '../api/delete-photo.js'

function createResponse() {
  const output = { headers: {}, status: null, body: null }
  const response = {
    setHeader(key, value) { output.headers[key] = value },
    status(code) { output.status = code; return response },
    json(body) { output.body = body; return response },
    end() { output.ended = true; return response },
  }
  return { response, output }
}

test('delete route refuses unauthenticated requests before reaching Cloudinary', async () => {
  const { response, output } = createResponse()
  await handler({ method: 'POST', body: { public_id: 'test-image' } }, response)
  assert.equal(output.status, 401)
  assert.equal(output.body.error, 'Unauthorized')
})

test('delete route permanently deletes only a verified gallery photo and invalidates cached copies', async () => {
  const originalFetch = global.fetch
  const oldKey = process.env.CLOUDINARY_API_KEY
  const oldSecret = process.env.CLOUDINARY_API_SECRET
  process.env.CLOUDINARY_API_KEY = 'test-key'
  process.env.CLOUDINARY_API_SECRET = 'test-secret'
  const calls = []
  global.fetch = async (url, options = {}) => {
    calls.push({ url, options })
    if (calls.length === 1) return { ok: true, json: async () => ({ resources: [{ public_id: 'test-image' }] }) }
    return { ok: true, json: async () => ({ deleted: { 'test-image': 'deleted' } }) }
  }
  const { response, output } = createResponse()
  try {
    await handler({ method: 'POST', body: { password: 'zandra60party', public_id: 'test-image' } }, response)
    assert.equal(output.status, 200)
    assert.deepEqual(output.body, { success: true, public_id: 'test-image' })
    assert.equal(calls.length, 2)
    assert.equal(calls[1].options.method, 'DELETE')
    assert.match(calls[1].options.body, /invalidate=true/)
    assert.match(calls[1].options.body, /public_ids%5B%5D=test-image/)
  } finally {
    global.fetch = originalFetch
    if (oldKey === undefined) delete process.env.CLOUDINARY_API_KEY
    else process.env.CLOUDINARY_API_KEY = oldKey
    if (oldSecret === undefined) delete process.env.CLOUDINARY_API_SECRET
    else process.env.CLOUDINARY_API_SECRET = oldSecret
  }
})
