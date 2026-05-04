// api/rsvp.js — Save and retrieve RSVPs stored in Cloudinary as a raw .txt file
import crypto from 'crypto';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'duo4dukq4';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const ADMIN_PW = process.env.ADMIN_PASSWORD || 'zandra60party';
const RSVP_PUBLIC_ID = 'zandra60party/rsvp_data';

// Correct Cloudinary signature: sort params alphabetically (exclude api_key, file, resource_type)
function cloudinarySign(params) {
  const str = Object.keys(params).sort()
    .map(k => `${k}=${params[k]}`)
    .join('&') + API_SECRET;
  return crypto.createHash('sha1').update(str).digest('hex');
}

async function getRSVPs() {
  try {
    // Add cache-busting to avoid stale CDN responses
    const url = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${RSVP_PUBLIC_ID}.txt?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const text = await res.text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function saveRSVPs(rsvps) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signParams = { overwrite: 'true', public_id: RSVP_PUBLIC_ID, timestamp };
  const signature = cloudinarySign(signParams);

  const formData = new FormData();
  formData.append('file', new Blob([JSON.stringify(rsvps)], { type: 'text/plain' }), 'rsvp_data.txt');
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('public_id', RSVP_PUBLIC_ID);
  formData.append('overwrite', 'true');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Cloudinary save error:', err);
  }
  return res.ok;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — list all RSVPs (admin only)
  if (req.method === 'GET') {
    const { password } = req.query;
    if (password !== ADMIN_PW) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    const rsvps = await getRSVPs();
    return res.status(200).json({ rsvps });
  }

  // POST — add a new RSVP
  if (req.method === 'POST') {
    const { name, plusOne, plusOneName } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nombre requerido' });
    }
    const rsvps = await getRSVPs();
    const newRSVP = {
      id: Date.now().toString(),
      name: name.trim(),
      plusOne: !!plusOne,
      plusOneName: plusOneName?.trim() || '',
      confirmedAt: new Date().toISOString(),
      total: plusOne ? 2 : 1,
    };
    rsvps.push(newRSVP);
    const saved = await saveRSVPs(rsvps);
    if (!saved) return res.status(500).json({ error: 'Error al guardar RSVP' });
    return res.status(200).json({ success: true, rsvp: newRSVP });
  }

  // DELETE — remove an RSVP by id (admin only)
  if (req.method === 'DELETE') {
    const { id, password } = req.body || {};
    if (password !== ADMIN_PW) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    const rsvps = await getRSVPs();
    const updated = rsvps.filter(r => r.id !== id);
    await saveRSVPs(updated);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
