import assert from 'node:assert/strict'
import test from 'node:test'
import { isSlideshowVisible, photoSettings, photoStyle } from '../src/galleryPresentation.js'

test('new photos use an unchanged full-frame presentation by default', () => {
  assert.deepEqual(photoSettings({}), {
    order: null,
    rotation: 0,
    brightness: 100,
    zoom: 100,
    caption: '',
    visible: true,
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

test('a hidden photo remains an intact gallery photo but is excluded from the slideshow', () => {
  assert.equal(isSlideshowVisible({}), true)
  assert.equal(isSlideshowVisible({ settings: { visible: false } }), false)
  assert.equal(isSlideshowVisible({ settings: { visible: true } }), true)
})
