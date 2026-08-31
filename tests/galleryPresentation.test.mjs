import assert from 'node:assert/strict'
import test from 'node:test'
import { photoSettings, photoStyle } from '../src/galleryPresentation.js'

test('new photos use an unchanged full-frame presentation by default', () => {
  assert.deepEqual(photoSettings({}), {
    order: null,
    rotation: 0,
    brightness: 100,
    zoom: 100,
    caption: '',
  })
  assert.deepEqual(photoStyle({}), {
    transform: 'rotate(0deg) scale(1)',
    filter: 'brightness(100%)',
  })
})

test('zoom can scale a presentation down while retaining rotation and brightness settings', () => {
  assert.deepEqual(photoStyle({ settings: { zoom: 50, rotation: 90, brightness: 110 } }), {
    transform: 'rotate(90deg) scale(0.5)',
    filter: 'brightness(110%)',
  })
})
