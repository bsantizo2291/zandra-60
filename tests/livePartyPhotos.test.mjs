import assert from 'node:assert/strict'
import test from 'node:test'
import {
  LIVE_PARTY_COLLECTION,
  LIVE_PARTY_REFRESH_MS,
  LIVE_PARTY_TAG,
  LIVE_PHOTO_REFRESH_MS,
  MEMORIES_COLLECTION,
  livePartyArrivalMessage,
  livePartyPhotosApiUrl,
  livePhotoArrivalMessage,
  memoriesPhotosApiUrl,
} from '../src/livePartyPhotos.js'

test('memories use a low-frequency refresh while the party screen remains near-live', () => {
  assert.equal(LIVE_PHOTO_REFRESH_MS, 300_000)
  assert.equal(LIVE_PARTY_REFRESH_MS, 10_000)
})

test('memories upload confirmation reflects its rate-limit-safe refresh', () => {
  assert.equal(
    livePhotoArrivalMessage(),
    'Tu foto llegará a la pantalla grande automáticamente, normalmente en menos de 300 segundos.'
  )
})

test('party upload confirmation reflects the near-live Gatsby-screen refresh', () => {
  assert.equal(
    livePartyArrivalMessage(),
    'Tu foto llegará a la pantalla Gatsby automáticamente, normalmente en menos de 10 segundos.'
  )
})

test('party-day uploads use a separate collection and tag from the memories gallery', () => {
  assert.equal(MEMORIES_COLLECTION, 'memories')
  assert.equal(LIVE_PARTY_COLLECTION, 'party-live')
  assert.equal(LIVE_PARTY_TAG, 'zandra60party-live')
  assert.equal(memoriesPhotosApiUrl(), '/api/list-photos?collection=memories')
  assert.equal(livePartyPhotosApiUrl(), '/api/list-photos?collection=party-live')
  assert.notEqual(memoriesPhotosApiUrl(), livePartyPhotosApiUrl())
})
