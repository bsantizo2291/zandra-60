export const LIVE_PHOTO_REFRESH_MS = 15_000
export const LIVE_PARTY_TAG = 'zandra60party-live'
export const LIVE_PARTY_COLLECTION = 'party-live'
export const LIVE_PARTY_SCREEN_URL = '?live-party=1'

export function livePhotoArrivalMessage(seconds = LIVE_PHOTO_REFRESH_MS / 1000) {
  return `Tu foto llegará a la pantalla grande automáticamente, normalmente en menos de ${seconds} segundos.`
}

export function livePartyPhotosApiUrl() {
  return `/api/list-photos?collection=${LIVE_PARTY_COLLECTION}`
}
