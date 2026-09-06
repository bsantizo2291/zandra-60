// Vercel Serverless Function — returns verified live-party photos to the
// memories collection by changing tags only; original image assets stay intact.

const ADMIN_PASSWORD = 'zandra60party'
const MEMORIES_TAG = 'zandra60party'
const LIVE_PARTY_TAG = 'zandra60party-live'

function isValidPublicId(value) {
  return typeof value === 'string' && value.length > 0 && value.length <= 255 && /^[A-Za-z0-9_./-]+$/.test(value)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { password, public_ids: publicIds } = req.body || {}
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' })
  if (!Array.isArray(publicIds) || !publicIds.length || publicIds.length > 100 || !publicIds.every(isValidPublicId)) {
    return res.status(400).json({ error: 'One to 100 valid photo IDs are required' })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'duo4dukq4'
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!apiKey || !apiSecret) return res.status(500).json({ error: 'Missing Cloudinary credentials' })

  const headers = { Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}` }
  try {
    const partyResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${encodeURIComponent(LIVE_PARTY_TAG)}?max_results=500`,
      { headers },
    )
    if (!partyResponse.ok) return res.status(partyResponse.status).json({ error: 'Unable to verify live party photos', details: await partyResponse.text() })
    const party = await partyResponse.json()
    const knownIds = new Set((party.resources || []).map(resource => resource.public_id))
    if (!publicIds.every(id => knownIds.has(id))) return res.status(404).json({ error: 'A selected photo was not found in the live party collection' })

    const tagRequest = async (tag, command) => {
      const body = new URLSearchParams({ command })
      body.append('tag[]', tag)
      publicIds.forEach(id => body.append('public_ids[]', id))
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/tags`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error?.message || `Unable to ${command} collection tag`)
    }

    await tagRequest(MEMORIES_TAG, 'add')
    await tagRequest(LIVE_PARTY_TAG, 'remove')
    return res.status(200).json({ success: true, restored: publicIds.length, public_ids: publicIds })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to restore selected photos' })
  }
}
