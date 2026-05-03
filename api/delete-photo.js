// Vercel Serverless Function — DELETE a photo from Cloudinary

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Accept both public_id and publicId for compatibility
  const public_id = req.body?.public_id || req.body?.publicId
  const adminPassword = req.body?.adminPassword || req.body?.admin_password
  const guestToken = req.body?.guestToken

  if (!public_id) {
    return res.status(400).json({ error: 'Missing public_id' })
  }

  // Auth: admin password OR valid guest token
  const isAdmin = adminPassword === process.env.ADMIN_PASSWORD
  const isGuest = guestToken && isValidGuestToken(public_id, guestToken)

  if (!isAdmin && !isGuest) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'duo4dukq4'
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Missing Cloudinary credentials' })
  }

  try {
    const timestamp = Math.round(Date.now() / 1000)
    const signature = await generateSignature({ public_id, timestamp }, apiSecret)

    const formData = new URLSearchParams()
    formData.append('public_id', public_id)
    formData.append('timestamp', String(timestamp))
    formData.append('api_key', apiKey)
    formData.append('signature', signature)

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      { method: 'POST', body: formData }
    )
    const data = await cloudRes.json()

    if (data.result === 'ok') {
      return res.status(200).json({ success: true })
    } else {
      return res.status(500).json({ error: data.result || 'Delete failed', details: data })
    }
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

async function generateSignature(params, apiSecret) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')
  const message = sortedParams + apiSecret
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function isValidGuestToken(public_id, token) {
  try {
    const decoded = atob(token)
    const [id, ts] = decoded.split('|')
    const uploadTime = parseInt(ts, 10)
    const now = Date.now()
    return id === public_id && (now - uploadTime) < 10 * 60 * 1000
  } catch {
    return false
  }
}
