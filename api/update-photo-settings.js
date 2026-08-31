// Vercel Serverless Function — saves presentation-only metadata for one image.
// It does not replace, resize, crop, or delete the original Cloudinary asset.

function cleanValue(value, maxLength = 255) {
  return String(value ?? '')
    .replace(/[|=]/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { password, public_id: publicId, settings = {} } = req.body || {}
  if (password !== 'zandra60party') return res.status(401).json({ error: 'Unauthorized' })
  if (!publicId || typeof publicId !== 'string') return res.status(400).json({ error: 'Photo ID is required' })

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'duo4dukq4'
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!apiKey || !apiSecret) return res.status(500).json({ error: 'Missing Cloudinary credentials' })

  const order = Math.max(1, Math.min(9999999999999, Number.parseInt(settings.order, 10) || 1))
  const rotation = [-180, -90, 0, 90, 180].includes(Number(settings.rotation)) ? Number(settings.rotation) : 0
  const brightness = Math.max(60, Math.min(140, Number.parseInt(settings.brightness, 10) || 100))
  const zoom = Math.max(50, Math.min(150, Number.parseInt(settings.zoom, 10) || 100))
  const caption = cleanValue(settings.caption, 120)
  const context = `zv_order=${order}|zv_rotation=${rotation}|zv_brightness=${brightness}|zv_zoom=${zoom}|zv_caption=${caption}`

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${encodeURIComponent(publicId)}`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ context }).toString(),
    })
    if (!response.ok) return res.status(response.status).json({ error: 'Cloudinary update failed', details: await response.text() })
    return res.status(200).json({
      success: true,
      settings: { order, rotation, brightness, zoom, caption },
    })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to save photo settings' })
  }
}
