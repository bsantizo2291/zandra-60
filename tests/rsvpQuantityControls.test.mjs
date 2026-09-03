import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

test('guest RSVP plus and minus controls cannot submit the reservation form', async () => {
  const source = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(source, /type="button" formNoValidate data-quantity-control="decrease"/)
  assert.match(source, /type="button" formNoValidate data-quantity-control="increase"/)
  assert.match(source, /event\.preventDefault\(\); event\.stopPropagation\(\); onChange/)
})
