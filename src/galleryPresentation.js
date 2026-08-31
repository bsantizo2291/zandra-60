export function photoSettings(photo) {
  return { order: null, rotation: 0, brightness: 100, zoom: 100, caption: '', ...(photo?.settings || {}) }
}

export function presentationOrder(photos) {
  return [...photos].sort((a, b) => {
    const aOrder = photoSettings(a).order ?? new Date(a.created_at).getTime()
    const bOrder = photoSettings(b).order ?? new Date(b.created_at).getTime()
    return bOrder - aOrder
  })
}

export function photoStyle(photo) {
  const settings = photoSettings(photo)
  return {
    transform: `rotate(${settings.rotation}deg) scale(${settings.zoom / 100})`,
    filter: `brightness(${settings.brightness}%)`,
  }
}
