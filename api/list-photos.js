import { readFileSync } from 'node:fs'

// Vercel Serverless Function — LIST photos by tag using authenticated Cloudinary API
// Used by both the public gallery and the admin panel. Cloudinary's Admin API is
// rate limited, so use both short edge-cache headers and a warm-function cache.

const GALLERY_CACHE_MS = {
  memories: 5 * 60 * 1000,
  'party-live': 15 * 1000,
}

// Complete original-memory album preserved from a successful live gallery
// response. This is used only if the upstream listing is temporarily rate
// limited before the cache can warm. No image bytes, tags, or originals change.
const EMERGENCY_MEMORIES = JSON.parse(
  readFileSync(new URL('./data/memories-fallback.json', import.meta.url), 'utf8')
).photos

const galleryCache = new Map()
const inFlightLoads = new Map()

export function __resetGalleryCacheForTests() {
  galleryCache.clear()
  inFlightLoads.clear()
}

export function __expireGalleryCacheForTests(collection) {
  const cached = galleryCache.get(collection)
  if (cached) cached.cachedAt = 0
}

function edgeCacheHeader(collection) {
  return collection === 'party-live'
    ? 'public, max-age=5, s-maxage=15, stale-while-revalidate=60'
    : 'public, max-age=30, s-maxage=300, stale-while-revalidate=900'
}

function toGalleryPayload(data, cloudName, collection) {
  const photos = (data.resources || []).map(r => {
    // Deliver the untransformed Cloudinary asset. Both normal gallery and
    // slideshow therefore begin with the full, original-resolution frame.
    const originalUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${r.public_id}`
    const context = r.context?.custom || r.context || {}
    return {
      public_id: r.public_id,
      url: originalUrl,
      full_url: originalUrl,
      created_at: r.created_at,
      settings: {
        order: Number(context.zv_order) || null,
        rotation: Number(context.zv_rotation) || 0,
        brightness: Number(context.zv_brightness) || 100,
        zoom: Math.max(50, Math.min(150, Number(context.zv_zoom) || 100)),
        caption: context.zv_caption || '',
        visible: context.zv_visible !== '0',
      },
    }
  })

  return { photos, total: photos.length, collection }
}

function emergencyMemoriesPayload() {
  return {
    photos: EMERGENCY_MEMORIES,
    total: EMERGENCY_MEMORIES.length,
    collection: 'memories',
    fallback: true,
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'duo4dukq4'
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const collection = req.query.collection === 'party-live' ? 'party-live' : 'memories'
  const tag = collection === 'party-live' ? 'zandra60party-live' : 'zandra60party'
  const cacheMs = GALLERY_CACHE_MS[collection]
  const cached = galleryCache.get(collection)

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Missing Cloudinary credentials' })
  }

  res.setHeader('Cache-Control', edgeCacheHeader(collection))
  res.setHeader('Vary', 'Accept-Encoding')

  if (cached && Date.now() - cached.cachedAt < cacheMs) {
    res.setHeader('X-Gallery-Cache', 'HIT')
    return res.status(200).json({ ...cached.payload, cached: true })
  }

  try {
    let loader = inFlightLoads.get(collection)
    if (!loader) {
      loader = (async () => {
        const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${tag}?max_results=500&direction=-1&context=true`
        const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } })
        if (!response.ok) {
          const error = new Error(await response.text())
          error.status = response.status
          throw error
        }
        const payload = toGalleryPayload(await response.json(), cloudName, collection)
        galleryCache.set(collection, { payload, cachedAt: Date.now() })
        return payload
      })()
      inFlightLoads.set(collection, loader)
    }

    const payload = await loader
    res.setHeader('X-Gallery-Cache', 'MISS')
    return res.status(200).json(payload)
  } catch (err) {
    // A previously loaded gallery is safer than a blank slideshow when the
    // upstream listing limit is temporarily reached.
    if (cached?.payload) {
      res.setHeader('X-Gallery-Cache', 'STALE')
      return res.status(200).json({ ...cached.payload, cached: true, stale: true })
    }
    if (collection === 'memories' && Number(err.status) === 420) {
      res.setHeader('X-Gallery-Cache', 'EMERGENCY')
      return res.status(200).json(emergencyMemoriesPayload())
    }
    const status = Number(err.status) || 500
    return res.status(status).json({ error: 'Cloudinary error', details: err.message })
  } finally {
    inFlightLoads.delete(collection)
  }
}
