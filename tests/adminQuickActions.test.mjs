import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

test('photo organizer keeps urgent move and delete actions in the sticky quick-action strip', async () => {
  const source = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(source, /Acciones rápidas de la foto seleccionada/)
  assert.match(source, /sticky top-2 z-40/)
  assert.match(source, /Mover diez lugares antes/)
  assert.match(source, /Mover diez lugares después/)
  assert.match(source, /Eliminar foto #\{selectedIndex \+ 1\}/)
  assert.match(source, /id="photo-detail-editor"/)
})
