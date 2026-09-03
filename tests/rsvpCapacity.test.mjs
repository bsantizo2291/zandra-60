import assert from 'node:assert/strict'
import test from 'node:test'
import rsvpHandler, { availabilityFor, currentGuestTotal, normalizedGuestCounts } from '../api/rsvp.js'

function createResponse() {
  const output = { status: null, body: null, headers: {} }
  const response = {
    setHeader(key, value) { output.headers[key] = value },
    status(code) { output.status = code; return response },
    json(body) { output.body = body; return response },
    end() { output.ended = true; return response },
  }
  return { response, output }
}

function mockRsvpStorage(initialRsvps) {
  const calls = []
  const originalFetch = global.fetch
  global.fetch = async (url, options = {}) => {
    calls.push({ url, options })
    if (calls.length === 1) return { ok: true, json: async () => ({ resources: [{ secure_url: 'https://example.test/rsvp_data.txt', version: 1 }] }) }
    if (calls.length === 2) return { ok: true, text: async () => JSON.stringify(initialRsvps) }
    return { ok: true, text: async () => '' }
  }
  return { calls, restore: () => { global.fetch = originalFetch } }
}

test('reservation availability counts confirmed guests and reports the remaining capacity', () => {
  const rsvps = [{ total: 2 }, { total: 4 }, { total: 1 }]
  assert.equal(currentGuestTotal(rsvps), 7)
  assert.deepEqual(availabilityFor(rsvps), { partyCap: 85, confirmed: 7, spotsLeft: 78 })
})

test('reservation guest counts reject zero adults, negative children, and non-numeric values', () => {
  assert.deepEqual(normalizedGuestCounts(2, 3, false), { adults: 2, kids: 3, total: 5 })
  assert.equal(normalizedGuestCounts(0, 0, false), null)
  assert.equal(normalizedGuestCounts(1, -1, false), null)
  assert.equal(normalizedGuestCounts('two', 0, false), null)
})

test('reservation handler saves a valid guest through the expected Cloudinary route without using live data', async () => {
  const storage = mockRsvpStorage([])
  const { response, output } = createResponse()
  try {
    await rsvpHandler({ method: 'POST', body: { name: 'Test Reservation', adults: 1, kids: 0 } }, response)
    assert.equal(output.status, 200)
    assert.equal(output.body.success, true)
    assert.equal(output.body.rsvp.name, 'Test Reservation')
    assert.equal(output.body.rsvp.total, 1)
    assert.equal(storage.calls.length, 3)
    assert.equal(storage.calls[2].options.method, 'POST')
  } finally {
    storage.restore()
  }
})

test('reservation handler returns a clear remaining-seat message before writing an over-capacity request', async () => {
  const storage = mockRsvpStorage([{ total: 79 }])
  const { response, output } = createResponse()
  try {
    await rsvpHandler({ method: 'POST', body: { name: 'Capacity Test', adults: 7, kids: 0 } }, response)
    assert.equal(output.status, 400)
    assert.equal(output.body.spotsLeft, 6)
    assert.match(output.body.error, /Solo quedan 6 lugares/)
    assert.equal(storage.calls.length, 2)
  } finally {
    storage.restore()
  }
})
