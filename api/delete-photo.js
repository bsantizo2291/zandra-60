// Vercel Serverless Function — permanently deletes one administrator-selected
// gallery original only after the protected admin UI requests it.

const ADMIN_PASSWORD = 'zandra60party'
const GALLERY_TAG = 'zandra60party'

function isValidPublicId(value) {
  return typeof value === 'string' && value.length > 0 && value.length <= 255 && /^[A-Za-z0-9_./-]+$/.test(value)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { password, public_id: publicId } = req.body || {}
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' })
  if (!isValidPublicId(publicId)) return res.status(400).json({ error: 'A valid photo ID is required' })

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'duo4dukq4'
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!apiKey || !apiSecret) return res.status(500).json({ error: 'Missing Cloudinary credentials' })

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  const headers = { Authorization: `Basic ${auth}` }

  try {
    // Confirm that this is one of the invitation's tagged gallery originals
    // before the destructive request. This prevents the panel from deleting
    // unrelated Cloudinary account assets even if an ID is supplied manually.
    const galleryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${encodeURIComponent(GALLERY_TAG)}?max_results=500`,
      { headers },
    )
    if (!galleryResponse.ok) return res.status(galleryResponse.status).json({ error: 'Unable to verify gallery photo', details: await galleryResponse.text() })
    const gallery = await galleryResponse.json()
    if (!(gallery.resources || []).some(resource => resource.public_id === publicId)) {
      return res.status(404).json({ error: 'The selected photo was not found in this invitation gallery' })
    }

    const body = new URLSearchParams({ invalidate: 'true' })
    body.append('public_ids[]', publicId)
    const deleteResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`,
      {
        method: 'DELETE',
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      },
    )
    const deleteResult = await deleteResponse.json().catch(() => ({}))
    if (!deleteResponse.ok) return res.status(deleteResponse.status).json({ error: 'Cloudinary deletion failed', details: deleteResult })
    if (deleteResult.deleted?.[publicId] !== 'deleted') {
      return res.status(409).json({ error: 'The selected photo could not be deleted', details: deleteResult })
    }
    return res.status(200).json({ success: true, public_id: publicId })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to delete photo' })
  }
}
