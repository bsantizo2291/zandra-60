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
    // Use authenticated Cloudinary API to bypass CDN cache entirely
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/raw/upload?public_ids[]=${RSVP_PUBLIC_ID}.txt&type=upload`;
    const metaRes = await fetch(url, {
      headers: { 'Authorization': `Basic ${auth}` },
    });
    if (!metaRes.ok) return [];

    // Fetch the actual file using the secure URL from the API response
    const meta = await metaRes.json();
    const resource = meta.resources?.[0];
    if (!resource) return [];

    // Use the secure URL with a version-busting query param
    const fileUrl = `${resource.secure_url}?v=${resource.version}&t=${Date.now()}`;
    const fileRes = await fetch(fileUrl, {
      headers: { 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache' },
    });
    if (!fileRes.ok) return [];
    const text = await fileRes.text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('getRSVPs error:', e);
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
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
    const { name, plusOne, plusOneName, adults, kids } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nombre requerido' });
    }
    const PARTY_CAP = 80;
    const rsvps = await getRSVPs();
    const currentTotal = rsvps.reduce((sum, r) => sum + (r.total || 1), 0);
    const adultCount = adults != null ? parseInt(adults) : (plusOne ? 2 : 1);
    const kidsCount  = kids  != null ? parseInt(kids)  : 0;
    const newTotal   = adultCount + kidsCount;
    if (currentTotal + newTotal > PARTY_CAP) {
      const spotsLeft = Math.max(0, PARTY_CAP - currentTotal);
      return res.status(400).json({
        error: spotsLeft === 0
          ? 'Lo sentimos, el evento ha alcanzado su capacidad maxima de 80 personas.'
          : `Solo quedan ${spotsLeft} lugar${spotsLeft !== 1 ? 'es' : ''} disponible${spotsLeft !== 1 ? 's' : ''}. Tu grupo de ${newTotal} no cabe. Por favor ajusta el numero de personas.`,
        spotsLeft,
        atCapacity: spotsLeft === 0,
      });
    }
    const newRSVP = {
      id: Date.now().toString(),
      name: name.trim(),
      plusOne: adultCount > 1 || kidsCount > 0,
      plusOneName: plusOneName?.trim() || '',
      adults: adultCount,
      kids: kidsCount,
      confirmedAt: new Date().toISOString(),
      total: adultCount + kidsCount,
    };
    rsvps.push(newRSVP);
    const saved = await saveRSVPs(rsvps);
    if (!saved) return res.status(500).json({ error: 'Error al guardar RSVP' });
    return res.status(200).json({ success: true, rsvp: newRSVP });
  }

  // PATCH — update an existing RSVP (admin only)
  if (req.method === 'PATCH') {
    const { id, password, adults, kids, name } = req.body || {};
    if (password !== ADMIN_PW) return res.status(401).json({ error: 'No autorizado' });
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const rsvps = await getRSVPs();
    const idx = rsvps.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ error: 'RSVP no encontrado' });
    if (name  != null) rsvps[idx].name  = name.trim();
    if (adults != null) rsvps[idx].adults = parseInt(adults);
    if (kids   != null) rsvps[idx].kids   = parseInt(kids);
    rsvps[idx].total   = (rsvps[idx].adults || 1) + (rsvps[idx].kids || 0);
    rsvps[idx].plusOne = rsvps[idx].total > 1;
    const saved = await saveRSVPs(rsvps);
    if (!saved) return res.status(500).json({ error: 'Error al guardar' });
    return res.status(200).json({ success: true, rsvp: rsvps[idx] });
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
