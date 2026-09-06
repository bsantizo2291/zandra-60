import assert from 'node:assert/strict'
import test from 'node:test'
import handler from '../api/move-photos-to-party.js'

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

test('move route refuses unauthenticated requests before reaching Cloudinary', async () => {
  const { response, output } = createResponse()
  await handler({ method: 'POST', body: { public_ids: ['party-photo'] } }, response)
  assert.equal(output.status, 401)
  assert.equal(output.body.error, 'Unauthorized')
})

test('move route adds the party tag then removes the memories tag without deleting the original', async () => {
  const originalFetch = global.fetch
  const oldKey = process.env.CLOUDINARY_API_KEY
  const oldSecret = process.env.CLOUDINARY_API_SECRET
  process.env.CLOUDINARY_API_KEY = 'test-key'
  process.env.CLOUDINARY_API_SECRET = 'test-secret'
  const calls = []
  global.fetch = async (url, options = {}) => {
    calls.push({ url, options })
    if (calls.length === 1) return { ok: true, json: async () => ({ resources: [{ public_id: 'party-photo' }] }) }
    return { ok: true, json: async () => ({}) }
  }
  const { response, output } = createResponse()
  try {
    await handler({ method: 'POST', body: { password: 'zandra60party', public_ids: ['party-photo'] } }, response)
    assert.equal(output.status, 200)
    assert.deepEqual(output.body, { success: true, moved: 1, public_ids: ['party-photo'] })
    assert.equal(calls.length, 3)
    assert.match(calls[1].options.body, /command=add/)
    assert.match(calls[1].options.body, /tag%5B%5D=zandra60party-live/)
    assert.match(calls[2].options.body, /command=remove/)
    assert.match(calls[2].options.body, /tag%5B%5D=zandra60party/)
  } finally {
    global.fetch = originalFetch
    if (oldKey === undefined) delete process.env.CLOUDINARY_API_KEY
    else process.env.CLOUDINARY_API_KEY = oldKey
    if (oldSecret === undefined) delete process.env.CLOUDINARY_API_SECRET
    else process.env.CLOUDINARY_API_SECRET = oldSecret
  }
})
