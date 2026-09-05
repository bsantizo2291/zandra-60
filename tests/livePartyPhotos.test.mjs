import assert from 'node:assert/strict'
import test from 'node:test'
import { LIVE_PHOTO_REFRESH_MS, livePhotoArrivalMessage } from '../src/livePartyPhotos.js'

test('live party photos refresh the big screen on a short interval', () => {
  assert.equal(LIVE_PHOTO_REFRESH_MS, 15_000)
})

test('live party upload confirmation explains the automatic big-screen arrival', () => {
  assert.equal(
    livePhotoArrivalMessage(),
    'Tu foto llegará a la pantalla grande automáticamente, normalmente en menos de 15 segundos.'
  )
})
