// Vercel Serverless Function — LIST photos by tag using authenticated Cloudinary API
// Used by both the public gallery and the admin panel

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'duo4dukq4'
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const tag = 'zandra60party'

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Missing Cloudinary credentials' })
  }

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

    // Use resources by tag endpoint — most reliable
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${tag}?max_results=500&direction=-1`

    const response = await fetch(url, {
      headers: { 'Authorization': `Basic ${auth}` },
    })

    if (!response.ok) {
      const errText = await response.text()
      return res.status(response.status).json({ error: 'Cloudinary error', details: errText })
    }

    const data = await response.json()
    const photos = (data.resources || []).map(r => ({
      public_id: r.public_id,
      url: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_400,c_fill,q_auto/${r.public_id}`,
      full_url: `https://res.cloudinary.com/${cloudName}/image/upload/q_auto/${r.public_id}`,
      created_at: r.created_at,
    }))

    return res.status(200).json({ photos, total: photos.length })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
