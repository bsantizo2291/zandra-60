import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

test('party photo album uses a standalone page route and is not embedded in the invitation', async () => {
  const source = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(source, /function PartyPhotoPage\(\)/)
  assert.match(source, /params\.get\('party-photos'\) === '1'\) return <PartyPhotoPage \/>/)
  assert.doesNotMatch(source, /id="fotos-en-vivo"/)
  assert.doesNotMatch(source, /Subir fotos de la fiesta/)
})
