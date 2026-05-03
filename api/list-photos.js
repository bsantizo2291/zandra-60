// Vercel Serverless Function — LIST all photos (admin only)
// Returns full list with public_ids for admin management

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { adminPassword } = req.body

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  // Use Cloudinary Admin API to search by tag
  const timestamp = Math.round(Date.now() / 1000)
  const expression = 'tags=zandra60party'
  const signature = await generateSignature({ expression, max_results: 500, timestamp }, apiSecret)

  const formData = new URLSearchParams()
  formData.append('expression', expression)
  formData.append('max_results', '500')
  formData.append('timestamp', timestamp)
  formData.append('api_key', apiKey)
  formData.append('signature', signature)

  const cloudRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
    { method: 'POST', body: formData }
  )
  const data = await cloudRes.json()

  return res.status(200).json({
    resources: (data.resources || []).map(r => ({
      public_id: r.public_id,
      url: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_400,c_fill,q_auto/${r.public_id}`,
      created_at: r.created_at,
      bytes: r.bytes,
    }))
  })
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
