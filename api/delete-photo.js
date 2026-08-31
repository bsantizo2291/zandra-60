// Vercel Serverless Function — photo deletion is intentionally disabled.
// Guest-uploaded memories are preserved for the celebration and cannot be
// removed through a public request by accident.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  return res.status(403).json({ error: 'Photo deletion is disabled for this celebration.' })
}
