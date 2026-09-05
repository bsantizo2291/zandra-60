import assert from 'node:assert/strict'
import test from 'node:test'
import {
  LIVE_PARTY_COLLECTION,
  LIVE_PARTY_TAG,
  LIVE_PHOTO_REFRESH_MS,
  livePartyPhotosApiUrl,
  livePhotoArrivalMessage,
} from '../src/livePartyPhotos.js'

test('live party photos refresh the big screen on a short interval', () => {
  assert.equal(LIVE_PHOTO_REFRESH_MS, 15_000)
})

test('live party upload confirmation explains the automatic big-screen arrival', () => {
  assert.equal(
    livePhotoArrivalMessage(),
    'Tu foto llegará a la pantalla grande automáticamente, normalmente en menos de 15 segundos.'
  )
})

test('party-day uploads use a separate collection and tag from the memories gallery', () => {
  assert.equal(LIVE_PARTY_COLLECTION, 'party-live')
  assert.equal(LIVE_PARTY_TAG, 'zandra60party-live')
  assert.equal(livePartyPhotosApiUrl(), '/api/list-photos?collection=party-live')
})
