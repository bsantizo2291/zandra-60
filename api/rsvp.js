// api/rsvp.js — Save and retrieve RSVPs stored in Cloudinary as a raw JSON file
import crypto from 'crypto';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'duo4dukq4';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const RSVP_PUBLIC_ID = 'zandra60party/rsvp_list';

function cloudinaryAuth(params) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  const toSign = sorted + API_SECRET;
  return crypto.createHash('sha1').update(toSign).digest('hex');
}

async function getRSVPs() {
  try {
    const url = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${RSVP_PUBLIC_ID}.json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function saveRSVPs(rsvps) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    public_id: RSVP_PUBLIC_ID,
    overwrite: 'true',
    resource_type: 'raw',
    timestamp,
  };
  const signature = cloudinaryAuth(params);

  const formData = new FormData();
  formData.append('file', new Blob([JSON.stringify(rsvps)], { type: 'application/json' }), 'rsvp_list.json');
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('public_id', RSVP_PUBLIC_ID);
  formData.append('overwrite', 'true');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, {
    method: 'POST',
    body: formData,
  });
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
    if (password !== process.env.ADMIN_PASSWORD) {
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
    await saveRSVPs(rsvps);
    return res.status(200).json({ success: true, rsvp: newRSVP });
  }

  // DELETE — remove an RSVP by id (admin only)
  if (req.method === 'DELETE') {
    const { id, password } = req.body || {};
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    const rsvps = await getRSVPs();
    const updated = rsvps.filter(r => r.id !== id);
    await saveRSVPs(updated);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
