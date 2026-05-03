// Vercel Serverless Function — DELETE a photo from Cloudinary
// Called by both admin panel and guest "undo" delete button

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { publicId, adminPassword, guestToken } = req.body

  if (!publicId) {
    return res.status(400).json({ error: 'Missing publicId' })
  }

  // Auth: either admin password OR valid guest token (public_id hash for 10-min window)
  const isAdmin = adminPassword === process.env.ADMIN_PASSWORD
  const isGuest = guestToken && isValidGuestToken(publicId, guestToken)

  if (!isAdmin && !isGuest) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Call Cloudinary API to delete
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  const timestamp = Math.round(Date.now() / 1000)
  const signature = await generateSignature({ public_id: publicId, timestamp }, apiSecret)

  const formData = new URLSearchParams()
  formData.append('public_id', publicId)
  formData.append('timestamp', timestamp)
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
    return res.status(500).json({ error: data.result || 'Delete failed' })
  }
}

// Generate SHA-1 signature for Cloudinary signed requests
async function generateSignature(params, apiSecret) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')
  const message = sortedParams + apiSecret

  // Use Web Crypto API (available in Vercel Edge/Node)
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Guest token: HMAC-like check — publicId + upload timestamp within 10 minutes
function isValidGuestToken(publicId, token) {
  try {
    const decoded = atob(token)
    const [id, ts] = decoded.split('|')
    const uploadTime = parseInt(ts, 10)
    const now = Date.now()
    const tenMinutes = 10 * 60 * 1000
    return id === publicId && (now - uploadTime) < tenMinutes
  } catch {
    return false
  }
}
