export const LIVE_PHOTO_REFRESH_MS = 15_000

export function livePhotoArrivalMessage(seconds = LIVE_PHOTO_REFRESH_MS / 1000) {
  return `Tu foto llegará a la pantalla grande automáticamente, normalmente en menos de ${seconds} segundos.`
}
