import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

test('party photo album has its own route and is restored as a live invitation section', async () => {
  const source = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(source, /function PartyPhotoPage\(\)/)
  assert.match(source, /params\.get\('party-photos'\) === '1'\) return <PartyPhotoPage \/>/)
  assert.match(source, /id="fotos-en-vivo"/)
  assert.match(source, /<LivePartyGallery \/>/)
})
