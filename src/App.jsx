import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, Camera, ChevronDown, Trash2, Lock, LogOut, RefreshCw, Navigation } from 'lucide-react'
import { Toaster, toast } from 'sonner'

// ─── Config ───────────────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD = 'duo4dukq4'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`
const CLOUDINARY_FETCH_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload`
const UPLOAD_PRESET = 'zandra60'
const GALLERY_TAG = 'zandra60party'
const ADMIN_PASSWORD = 'zandra60party'

// ─── Image compression ────────────────────────────────────────────────────────
async function compressImage(file, maxSizeMB = 8, maxDim = 2400) {
  return new Promise((resolve) => {
    if (file.size <= maxSizeMB * 1024 * 1024 && file.type === 'image/jpeg') { resolve(file); return }
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width: w, height: h } = img
      if (w > maxDim || h > maxDim) { const r = Math.min(maxDim/w, maxDim/h); w = Math.round(w*r); h = Math.round(h*r) }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      const tryQ = (q) => canvas.toBlob((blob) => {
        if (!blob) { resolve(file); return }
        if (blob.size <= maxSizeMB*1024*1024 || q <= 0.3)
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
        else tryQ(q - 0.1)
      }, 'image/jpeg', q)
      tryQ(0.85)
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

// ─── Champagne Bubbles ────────────────────────────────────────────────────────
function ChampagneBubbles() {
  const [bubbles, setBubbles] = useState([])
  const [drops, setDrops] = useState([])
  useEffect(() => {
    const bi = setInterval(() => {
      const id = Math.random().toString(36).slice(2)
      const size = Math.random() * 12 + 3
      const left = Math.random() * 100
      const dur = Math.random() * 5 + 4
      const drift = (Math.random() - 0.5) * 50
      setBubbles(p => [...p.slice(-28), { id, size, left, dur, drift }])
      setTimeout(() => setBubbles(p => p.filter(b => b.id !== id)), dur * 1000)
    }, 420)
    const di = setInterval(() => {
      const id = Math.random().toString(36).slice(2)
      const left = Math.random() * 100
      const dur = Math.random() * 2 + 1
      const w = Math.random() * 2 + 1
      setDrops(p => [...p.slice(-20), { id, left, dur, w, h: w * 3 }])
      setTimeout(() => setDrops(p => p.filter(d => d.id !== id)), dur * 1000)
    }, 260)
    return () => { clearInterval(bi); clearInterval(di) }
  }, [])
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
      {bubbles.map(b => (
        <div key={b.id} className="bubble" style={{
          width: b.size, height: b.size, left: `${b.left}%`, bottom: 0,
          '--drift': `${b.drift}px`,
          animationName: 'bubble-rise', animationDuration: `${b.dur}s`,
          animationTimingFunction: 'ease-out', animationFillMode: 'forwards',
        }} />
      ))}
      {drops.map(d => (
        <div key={d.id} style={{
          position: 'absolute', left: `${d.left}%`, top: 0,
          width: d.w, height: d.h,
          borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
          background: 'linear-gradient(180deg, rgba(212,160,23,0.7), rgba(180,134,11,0.2))',
          pointerEvents: 'none',
          animationName: 'champagne-drop', animationDuration: `${d.dur}s`,
          animationTimingFunction: 'linear', animationFillMode: 'forwards',
        }} />
      ))}
    </div>
  )
}

// ─── Art Deco SVG Medallion ───────────────────────────────────────────────────
function Medallion({ size = 180 }) {
  const r = size / 2
  const rays = 24
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="medallion-glow">
      {/* Outer ring */}
      <circle cx={r} cy={r} r={r - 4} fill="none" stroke="#d4a017" strokeWidth="1.5" opacity="0.6" />
      <circle cx={r} cy={r} r={r - 10} fill="none" stroke="#d4a017" strokeWidth="0.8" opacity="0.4" />
      {/* Rays */}
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (i * 360) / rays
        const rad = (angle * Math.PI) / 180
        const inner = r * 0.32
        const outer = r * 0.78
        const x1 = r + inner * Math.cos(rad)
        const y1 = r + inner * Math.sin(rad)
        const x2 = r + outer * Math.cos(rad)
        const y2 = r + outer * Math.sin(rad)
        const isMain = i % 3 === 0
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#d4a017" strokeWidth={isMain ? 1.5 : 0.8}
            opacity={isMain ? 0.9 : 0.5} />
        )
      })}
      {/* Art Deco spokes (every 6th) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180
        const len = r * 0.55
        const x2 = r + len * Math.cos(angle)
        const y2 = r + len * Math.sin(angle)
        return <line key={`spoke-${i}`} x1={r} y1={r} x2={x2} y2={y2}
          stroke="#d4a017" strokeWidth="2" opacity="0.7" />
      })}
      {/* Center circle */}
      <circle cx={r} cy={r} r={r * 0.22} fill="url(#goldGrad)" />
      <circle cx={r} cy={r} r={r * 0.28} fill="none" stroke="#d4a017" strokeWidth="1.5" opacity="0.8" />
      <defs>
        <radialGradient id="goldGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#f5d76e" />
          <stop offset="50%" stopColor="#d4a017" />
          <stop offset="100%" stopColor="#8B6914" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// ─── Art Deco Border Frame ────────────────────────────────────────────────────
function ArtDecoFrame({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer border */}
      <div className="absolute inset-0 border border-gold-500 border-glow pointer-events-none"
        style={{ border: '1px solid rgba(212,160,23,0.6)' }} />
      <div className="absolute inset-2 pointer-events-none"
        style={{ border: '1px solid rgba(212,160,23,0.25)' }} />
      {/* Corner fans */}
      {[
        { pos: 'top-0 left-0', rot: '0deg' },
        { pos: 'top-0 right-0', rot: '90deg' },
        { pos: 'bottom-0 right-0', rot: '180deg' },
        { pos: 'bottom-0 left-0', rot: '270deg' },
      ].map(({ pos, rot }) => (
        <svg key={rot} width="40" height="40" viewBox="0 0 40 40"
          className={`absolute ${pos}`}
          style={{ transform: `rotate(${rot})` }}>
          <path d="M2 2 L2 18 M2 2 L18 2" stroke="#d4a017" strokeWidth="1.5" opacity="0.8" />
          <path d="M6 6 L6 14 M6 6 L14 6" stroke="#d4a017" strokeWidth="0.8" opacity="0.5" />
          {/* Fan */}
          {[0,15,30,45].map(a => {
            const rad = (a * Math.PI) / 180
            return <line key={a} x1="2" y1="2" x2={2 + 12*Math.cos(rad)} y2={2 + 12*Math.sin(rad)}
              stroke="#d4a017" strokeWidth="0.8" opacity="0.6" />
          })}
          <circle cx="2" cy="2" r="2" fill="#d4a017" opacity="0.9" />
        </svg>
      ))}
      {/* Side diamonds */}
      {[
        { style: { top: '50%', left: -6, transform: 'translateY(-50%) rotate(45deg)' } },
        { style: { top: '50%', right: -6, transform: 'translateY(-50%) rotate(45deg)' } },
        { style: { left: '50%', top: -6, transform: 'translateX(-50%) rotate(45deg)' } },
        { style: { left: '50%', bottom: -6, transform: 'translateX(-50%) rotate(45deg)' } },
      ].map((d, i) => (
        <div key={i} className="absolute w-3 h-3 pointer-events-none"
          style={{ ...d.style, background: '#d4a017', opacity: 0.8 }} />
      ))}
      {children}
    </div>
  )
}

// ─── Gold Divider ─────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-6 md:my-8">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #d4a017, transparent)' }} />
      <svg width="32" height="32" viewBox="0 0 32 32">
        <polygon points="16,2 18,13 29,16 18,19 16,30 14,19 3,16 14,13" fill="#d4a017" opacity="0.9" />
        <polygon points="16,6 17.5,13 23,16 17.5,19 16,26 14.5,19 9,16 14.5,13" fill="#f5d76e" opacity="0.6" />
      </svg>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #d4a017, transparent)' }} />
    </div>
  )
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function CountdownTimer() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date('2026-09-05T19:00:00').getTime() - Date.now())
      setT({ days: Math.floor(diff/86400000), hours: Math.floor((diff%86400000)/3600000),
             minutes: Math.floor((diff%3600000)/60000), seconds: Math.floor((diff%60000)/1000) })
    }
    calc(); const id = setInterval(calc, 1000); return () => clearInterval(id)
  }, [])
  const items = [['Días', t.days], ['Horas', t.hours], ['Minutos', t.minutes], ['Segundos', t.seconds]]
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-6">
      {items.map(([label, val], i) => (
        <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="countdown-box rounded-xl px-4 py-4 md:px-8 md:py-6 text-center min-w-[72px] md:min-w-[110px]">
          <div className="shimmer-text font-serif font-black leading-none"
            style={{ fontSize: 'clamp(2.2rem, 8vw, 3.5rem)', fontFamily: 'Cinzel, serif' }}>
            {String(val).padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-[0.2em] mt-2 font-serif" style={{ color: 'rgba(212,160,23,0.6)' }}>
            {label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Photo Gallery ────────────────────────────────────────────────────────────
function PhotoGallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [name, setName] = useState('')
  const [deletable, setDeletable] = useState({})
  const [deleting, setDeleting] = useState(null)

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/list/${GALLERY_TAG}.json`)
      if (res.ok) {
        const d = await res.json()
        setPhotos((d.resources || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map(r => ({ public_id: r.public_id, url: `${CLOUDINARY_FETCH_URL}/w_400,h_400,c_fill,q_auto/${r.public_id}` })))
      }
    } catch (_) {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchPhotos() }, [fetchPhotos])

  const handleUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    let ok = 0; const nd = {}
    for (let i = 0; i < files.length; i++) {
      setProgress(`Preparando foto ${i+1} de ${files.length}...`)
      const compressed = await compressImage(files[i])
      setProgress(`Subiendo foto ${i+1} de ${files.length}...`)
      const fd = new FormData()
      fd.append('file', compressed); fd.append('upload_preset', UPLOAD_PRESET)
      fd.append('tags', GALLERY_TAG)
      if (name.trim()) fd.append('context', `uploader=${name.trim()}`)
      try {
        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd })
        const data = await res.json()
        if (data.public_id) { ok++; nd[data.public_id] = Date.now() + 10 * 60 * 1000 }
        else toast.error(`Error: ${data.error?.message || 'No se pudo subir'}`)
      } catch (_) { toast.error('Error de conexión') }
    }
    setUploading(false); setProgress('')
    if (ok > 0) {
      setDeletable(p => ({ ...p, ...nd }))
      toast.success(`${ok} foto${ok > 1 ? 's' : ''} compartida${ok > 1 ? 's' : ''} exitosamente`)
      fetchPhotos()
    }
  }, [name, fetchPhotos])

  const handleChange = (e) => { handleUpload(e); e.target.value = '' }

  const deletePhoto = async (id) => {
    setDeleting(id)
    try {
      const res = await fetch('/api/delete-photo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: id }),
      })
      if (res.ok) {
        toast.success('Foto eliminada')
        setPhotos(p => p.filter(x => x.public_id !== id))
        setDeletable(p => { const n = { ...p }; delete n[id]; return n })
      } else toast.error('No se pudo eliminar')
    } catch (_) { toast.error('Error de conexión') }
    setDeleting(null)
  }

  return (
    <div className="space-y-8">
      <div className="max-w-sm mx-auto">
        <label className="block text-center font-serif text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(212,160,23,0.7)' }}>
          Tu nombre (opcional)
        </label>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Tu nombre" className="gatsby-input w-full rounded-xl px-4 py-3 text-center font-serif text-lg" />
      </div>

      <label className="block cursor-pointer">
        <input type="file" accept="image/*" multiple onChange={handleChange} className="hidden" />
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="gold-card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
          style={{ borderStyle: 'dashed', borderColor: 'rgba(212,160,23,0.4)' }}>
          <Camera className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-4" style={{ color: '#d4a017' }} />
          <p className="font-serif text-lg md:text-xl mb-1" style={{ color: '#d4a017' }}>
            {uploading ? (progress || 'Procesando...') : 'Comparte un recuerdo con Zandra'}
          </p>
          {uploading ? (
            <div className="mt-4 w-48 h-1 bg-yellow-900 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          ) : (
            <p className="font-serif text-xs uppercase tracking-widest mt-2" style={{ color: 'rgba(212,160,23,0.5)' }}>
              JPG · PNG · HEIC · Multiples fotos
            </p>
          )}
        </motion.div>
      </label>

      <div className="text-center">
        <button onClick={fetchPhotos} disabled={loading}
          className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-widest transition-colors disabled:opacity-40"
          style={{ color: 'rgba(212,160,23,0.6)' }}>
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Cargando...' : 'Actualizar galeria'}
        </button>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <motion.div key={photo.public_id} layout
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: deleting === photo.public_id ? 0.3 : 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="relative group rounded-xl overflow-hidden aspect-square"
              style={{ border: '1px solid rgba(212,160,23,0.25)' }}>
              <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              {deletable[photo.public_id] && Date.now() < deletable[photo.public_id] && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => deletePhoto(photo.public_id)} disabled={deleting === photo.public_id}
                    className="flex items-center gap-1 bg-red-800 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-full font-serif uppercase tracking-wide transition-colors">
                    <Trash2 className="w-3 h-3" />
                    {deleting === photo.public_id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : !uploading && (
        <div className="text-center py-16">
          <p className="font-serif italic" style={{ color: 'rgba(212,160,23,0.4)' }}>
            Se el primero en compartir un recuerdo
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const login = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) setAuth(true)
    else toast.error('Contraseña incorrecta')
  }

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/list-photos')
      if (res.ok) { const d = await res.json(); setPhotos(d.photos || []) }
    } catch (_) { toast.error('Error al cargar fotos') }
    setLoading(false)
  }

  const deletePhoto = async (id) => {
    setDeleting(id)
    try {
      const res = await fetch('/api/delete-photo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: id, admin: true }),
      })
      if (res.ok) { toast.success('Foto eliminada'); setPhotos(p => p.filter(x => x.public_id !== id)) }
      else toast.error('No se pudo eliminar')
    } catch (_) { toast.error('Error de conexión') }
    setDeleting(null)
  }

  useEffect(() => { if (auth) fetchPhotos() }, [auth])

  if (!auth) return (
    <div className="min-h-screen noir-section flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />
      <ArtDecoFrame className="w-full max-w-sm rounded-2xl p-10 gold-card text-center">
        <Lock className="w-10 h-10 mx-auto mb-4" style={{ color: '#d4a017' }} />
        <h2 className="font-serif text-2xl mb-1" style={{ color: '#d4a017' }}>Panel de Administracion</h2>
        <p className="font-serif text-xs tracking-widest uppercase mb-8" style={{ color: 'rgba(212,160,23,0.5)' }}>
          Celebracion Zandra Veliz · 60 Anos
        </p>
        <form onSubmit={login} className="space-y-4">
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            placeholder="Contrasena" className="gatsby-input w-full rounded-xl px-4 py-3 text-center font-serif text-lg" />
          <button type="submit"
            className="w-full font-serif font-bold py-3 rounded-xl transition-all tracking-widest text-sm uppercase text-black"
            style={{ background: 'linear-gradient(135deg, #8B6914, #d4a017, #f5d76e, #d4a017, #8B6914)' }}>
            Entrar
          </button>
        </form>
      </ArtDecoFrame>
    </div>
  )

  return (
    <div className="min-h-screen noir-section p-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between py-6 mb-6" style={{ borderBottom: '1px solid rgba(212,160,23,0.2)' }}>
          <div>
            <h1 className="font-serif text-2xl" style={{ color: '#d4a017' }}>Panel de Administracion</h1>
            <p className="font-serif text-xs tracking-widest uppercase mt-1" style={{ color: 'rgba(212,160,23,0.5)' }}>
              {photos.length} foto{photos.length !== 1 ? 's' : ''} en la galeria
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchPhotos} disabled={loading}
              className="flex items-center gap-2 font-serif text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-colors"
              style={{ border: '1px solid rgba(212,160,23,0.3)', color: 'rgba(212,160,23,0.7)' }}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 font-serif text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-colors"
              style={{ border: '1px solid rgba(212,160,23,0.3)', color: 'rgba(212,160,23,0.7)' }}>
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map(photo => (
            <motion.div key={photo.public_id} layout
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: deleting === photo.public_id ? 0.3 : 1, scale: 1 }}
              className="relative group rounded-xl overflow-hidden aspect-square"
              style={{ border: '1px solid rgba(212,160,23,0.2)' }}>
              <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => deletePhoto(photo.public_id)} disabled={deleting === photo.public_id}
                  className="flex items-center gap-1 bg-red-800 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-full font-serif uppercase tracking-wide">
                  <Trash2 className="w-3 h-3" />
                  {deleting === photo.public_id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        {photos.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="font-serif italic" style={{ color: 'rgba(212,160,23,0.4)' }}>No hay fotos aun</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Slideshow ────────────────────────────────────────────────────────────────
function Slideshow() {
  const [photos, setPhotos] = useState([])
  const [current, setCurrent] = useState(0)
  const fetch_ = async () => {
    try {
      const res = await fetch(`https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/list/${GALLERY_TAG}.json`)
      if (res.ok) {
        const d = await res.json()
        setPhotos((d.resources || []).map(r => `${CLOUDINARY_FETCH_URL}/w_1920,h_1080,c_fill,q_auto/${r.public_id}`))
      }
    } catch (_) {}
  }
  useEffect(() => { fetch_(); const id = setInterval(fetch_, 20000); return () => clearInterval(id) }, [])
  useEffect(() => {
    if (!photos.length) return
    const id = setInterval(() => setCurrent(c => (c + 1) % photos.length), 5000)
    return () => clearInterval(id)
  }, [photos.length])
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {photos.length > 0 ? (
          <motion.img key={current} src={photos[current]}
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="font-serif text-3xl text-center px-8" style={{ color: '#d4a017' }}>
              Esperando fotos de los invitados...
            </p>
          </div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
        <p className="font-serif text-4xl md:text-6xl shimmer-text mb-2">Celebracion 60 Anos · Zandra Veliz</p>
        <p className="font-serif text-sm md:text-lg tracking-widest uppercase" style={{ color: 'rgba(212,160,23,0.7)' }}>
          5 de Septiembre · 2026 · Club Espanol · Fuentecilla
        </p>
      </div>
      <ChampagneBubbles />
    </div>
  )
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────
function RSVPForm() {
  const [name, setName] = useState('')
  const [plusOne, setPlusOne] = useState(false)
  const [plusOneName, setPlusOneName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Por favor ingresa tu nombre'); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    setSubmitting(false); setSubmitted(true)
    toast.success('Confirmacion recibida. Te esperamos.')
  }

  if (submitted) return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
      <Medallion size={80} />
      <p className="font-serif text-2xl font-bold mt-4 mb-2" style={{ color: '#d4a017' }}>
        Nos vemos el 5 de Septiembre
      </p>
      <p className="font-serif text-sm" style={{ color: 'rgba(212,160,23,0.6)' }}>
        {name}{plusOne && plusOneName ? ` y ${plusOneName}` : plusOne ? ' y acompanante' : ''} — confirmado{plusOne ? 's' : ''}
      </p>
    </motion.div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-serif text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(212,160,23,0.6)' }}>
          Tu nombre completo
        </label>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Nombre y apellido" required className="gatsby-input w-full rounded-xl px-4 py-3 font-serif text-lg" />
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <button type="button" onClick={() => setPlusOne(p => !p)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${plusOne ? '' : ''}`}
            style={{ background: plusOne ? '#d4a017' : 'rgba(212,160,23,0.2)', border: '1px solid rgba(212,160,23,0.4)' }}>
            <span className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all duration-300 ${plusOne ? 'left-7' : 'left-1'}`}
              style={{ background: plusOne ? '#0a0a0a' : '#d4a017' }} />
          </button>
          <span className="font-serif text-sm" style={{ color: 'rgba(212,160,23,0.8)' }}>
            Voy con acompanante <span style={{ color: '#d4a017' }}>(+1)</span>
          </span>
        </label>
      </div>

      <AnimatePresence>
        {plusOne && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <label className="block font-serif text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(212,160,23,0.6)' }}>
              Nombre de tu acompanante
            </label>
            <input type="text" value={plusOneName} onChange={e => setPlusOneName(e.target.value)}
              placeholder="Nombre y apellido" className="gatsby-input w-full rounded-xl px-4 py-3 font-serif text-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <span className="inline-block font-serif text-xs uppercase tracking-widest px-4 py-1 rounded-full"
          style={{ border: '1px solid rgba(212,160,23,0.3)', color: 'rgba(212,160,23,0.6)' }}>
          {plusOne ? 'Dos personas confirmadas' : 'Una persona confirmada'}
        </span>
      </div>

      <motion.button type="submit" disabled={submitting}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="w-full font-serif font-bold py-4 rounded-xl transition-all disabled:opacity-50 tracking-widest text-sm uppercase text-black"
        style={{ background: 'linear-gradient(135deg, #8B6914, #d4a017, #f5d76e, #d4a017, #8B6914)' }}>
        {submitting ? 'Confirmando...' : '✦  Confirmar Asistencia  ✦'}
      </motion.button>

      <div className="pt-4 text-center" style={{ borderTop: '1px solid rgba(212,160,23,0.2)' }}>
        <p className="font-serif text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(212,160,23,0.4)' }}>
          Preguntas — contacta al organizador
        </p>
        <p className="font-serif font-semibold" style={{ color: '#d4a017' }}>Brayan Santizo</p>
        <a href="tel:+12015987303" className="font-serif text-base transition-colors" style={{ color: 'rgba(212,160,23,0.7)' }}>
          +1 (201) 598-7303
        </a>
      </div>
    </form>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('slideshow') === '1') return <Slideshow />
  if (params.get('admin') === '1') return <AdminPanel />

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0a0a0a', color: '#d4a017' }}>
      <Toaster position="top-center" richColors />
      <ChampagneBubbles />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #080808 0%, #0d0b05 100%)' }}>

        {/* Hero background image */}
        <div className="absolute inset-0"
          style={{ backgroundImage: 'url(/hero_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.55 }} />

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.1) 40%, rgba(8,8,8,0.5) 100%)' }} />

        {/* Art Deco border frame overlay */}
        <div className="absolute inset-4 md:inset-8 pointer-events-none" style={{ border: '1px solid rgba(212,160,23,0.5)' }}>
          <div className="absolute inset-2" style={{ border: '1px solid rgba(212,160,23,0.2)' }} />
          {/* Corner diamonds */}
          {[
            { cls: 'top-0 left-0', t: '-translate-x-1/2 -translate-y-1/2' },
            { cls: 'top-0 right-0', t: 'translate-x-1/2 -translate-y-1/2' },
            { cls: 'bottom-0 left-0', t: '-translate-x-1/2 translate-y-1/2' },
            { cls: 'bottom-0 right-0', t: 'translate-x-1/2 translate-y-1/2' },
          ].map(({ cls, t }, i) => (
            <div key={i} className={`absolute ${cls} w-3 h-3 rotate-45 transform ${t}`} style={{ background: '#d4a017', opacity: 0.9 }} />
          ))}
          {/* Corner fans */}
          {[
            { cls: 'top-0 left-0', rot: '0deg' },
            { cls: 'top-0 right-0', rot: '90deg' },
            { cls: 'bottom-0 right-0', rot: '180deg' },
            { cls: 'bottom-0 left-0', rot: '270deg' },
          ].map(({ cls, rot }) => (
            <svg key={rot} width="50" height="50" viewBox="0 0 50 50" className={`absolute ${cls}`}
              style={{ transform: `rotate(${rot})` }}>
              <path d="M3 3 L3 22 M3 3 L22 3" stroke="#d4a017" strokeWidth="1.5" opacity="0.7" />
              {[0,20,40,60].map(a => {
                const rad = (a * Math.PI) / 180
                return <line key={a} x1="3" y1="3" x2={3 + 16*Math.cos(rad)} y2={3 + 16*Math.sin(rad)}
                  stroke="#d4a017" strokeWidth="0.8" opacity="0.5" />
              })}
            </svg>
          ))}
        </div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full" style={{ overflow: 'visible' }}>

          <motion.p initial={{ opacity: 0, letterSpacing: '0.05em' }} animate={{ opacity: 1, letterSpacing: '0.4em' }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-serif text-xs uppercase mb-6 md:mb-8" style={{ color: 'rgba(212,160,23,0.6)' }}>
            Con mucho amor te invita a celebrar
          </motion.p>

          {/* ZANDRA */}
          <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, type: 'spring', stiffness: 60 }}
            className="shimmer-text font-serif font-black leading-none mb-2 w-full"
            style={{ fontSize: 'clamp(3.2rem, 14vw, 9rem)', fontFamily: 'Cinzel, serif', letterSpacing: '0.08em', paddingLeft: '0.04em', paddingRight: '0.04em', overflow: 'visible', wordBreak: 'keep-all', whiteSpace: 'nowrap' }}>
            ZANDRA
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="font-serif tracking-[0.6em] mb-6 md:mb-8"
            style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1.4rem)', color: 'rgba(212,160,23,0.55)' }}>
            V E L I Z
          </motion.p>

          <GoldDivider />

          {/* Medallion + 60 */}
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.9, duration: 0.9, type: 'spring' }}
            className="flex flex-col items-center mb-6 md:mb-8">
            <div className="relative inline-flex items-center justify-center">
              <Medallion size={typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 180} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="shimmer-text font-serif font-black leading-none"
                  style={{ fontSize: 'clamp(2.2rem, 7vw, 3.5rem)', fontFamily: 'Cinzel, serif' }}>60</span>
                <span className="font-serif text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(212,160,23,0.6)' }}>Anos</span>
              </div>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            className="gold-card rounded-2xl px-6 py-4 md:px-10 md:py-6 inline-block max-w-lg relative">
            <p className="font-serif text-base md:text-xl" style={{ color: '#d4a017' }}>
              ✦ &nbsp; Una noche de elegancia y celebracion &nbsp; ✦
            </p>
            <p className="font-serif text-xs tracking-widest uppercase mt-2" style={{ color: 'rgba(212,160,23,0.5)' }}>
              Sabado · 5 de Septiembre · 2026
            </p>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-40">
          <ChevronDown className="w-8 h-8" style={{ color: '#d4a017' }} />
        </motion.div>
      </section>

      {/* ══ COUNTDOWN ═════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 noir-section-alt relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <p className="font-serif text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(212,160,23,0.5)' }}>
              ✦ Cuenta Regresiva ✦
            </p>
            <h2 className="font-serif font-bold mb-10 md:mb-14"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#d4a017' }}>
              La Gran Noche se Acerca
            </h2>
            <CountdownTimer />
          </motion.div>
        </div>
      </section>

      {/* ══ EVENT DETAILS ═════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 noir-section">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="font-serif text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(212,160,23,0.5)' }}>
              ✦ Detalles del Evento ✦
            </p>
            <h2 className="font-serif font-bold" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#d4a017' }}>
              La Invitacion
            </h2>
            <GoldDivider />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              { icon: Calendar, title: 'Fecha', lines: ['Sabado', '5 de Septiembre', '2026'] },
              { icon: Clock, title: 'Horario', lines: ['19:00 — 24:00', 'Cinco horas de', 'pura celebracion'] },
              { icon: MapPin, title: 'Lugar', lines: ['Club Espanol', 'Calzada Roosevelt Km. 13.5', 'Zona 7 · Guatemala'] },
            ].map(({ icon: Icon, title, lines }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.8 }} viewport={{ once: true }}>
                <ArtDecoFrame className="gold-card-light rounded-2xl p-8 text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                    style={{ border: '1px solid rgba(212,160,23,0.4)', background: 'rgba(212,160,23,0.06)' }}>
                    <Icon className="w-6 h-6" style={{ color: '#d4a017' }} />
                  </div>
                  <h3 className="font-serif text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(212,160,23,0.6)' }}>
                    {title}
                  </h3>
                  {lines.map((l, j) => (
                    <p key={j} className={`font-serif ${j === 0 ? 'text-xl font-semibold' : 'text-sm'} leading-relaxed`}
                      style={{ color: j === 0 ? '#d4a017' : 'rgba(212,160,23,0.55)' }}>
                      {l}
                    </p>
                  ))}
                </ArtDecoFrame>
              </motion.div>
            ))}
          </div>

          {/* Maps buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a href="https://www.google.com/maps/search/?api=1&query=Club+Español+Calzada+Roosevelt+Km+13.5+Zona+7+Guatemala"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-serif text-xs uppercase tracking-widest px-8 py-3 rounded-full transition-all hover:scale-105 text-black"
              style={{ background: 'linear-gradient(135deg, #8B6914, #d4a017, #f5d76e)' }}>
              <MapPin className="w-4 h-4" />
              Google Maps
            </a>
            <a href="https://waze.com/ul?q=Club+Español+Calzada+Roosevelt+Km+13.5+Zona+7+Guatemala&navigate=yes"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-serif text-xs uppercase tracking-widest px-8 py-3 rounded-full transition-all hover:scale-105"
              style={{ border: '1px solid rgba(212,160,23,0.5)', color: '#d4a017' }}>
              <Navigation className="w-4 h-4" />
              Waze
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══ DRESS CODE ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 noir-section-alt">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <p className="font-serif text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(212,160,23,0.5)' }}>
              ✦ Vestimenta ✦
            </p>
            <h2 className="font-serif font-bold mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#d4a017' }}>
              Codigo de Vestimenta
            </h2>
            <GoldDivider />

            <ArtDecoFrame className="gold-card-light rounded-2xl p-8 md:p-12">
              <p className="font-serif italic text-xl md:text-2xl mb-2" style={{ color: 'rgba(212,160,23,0.8)' }}>
                "Viste con el esplendor de los anos dorados"
              </p>
              <p className="font-serif text-xs tracking-widest uppercase mb-10" style={{ color: 'rgba(212,160,23,0.4)' }}>
                Colores Gatsby
              </p>

              <div className="flex flex-wrap justify-center gap-5 md:gap-8 mb-10">
                {[
                  { color: '#d97706', name: 'Dorado' },
                  { color: '#111111', name: 'Negro', border: '#333' },
                  { color: '#b0b0b0', name: 'Plateado' },
                  { color: '#8B6914', name: 'Champan' },
                  { color: '#fef3c7', name: 'Marfil' },
                  { color: '#1e3a5f', name: 'Azul Noche' },
                ].map(({ color, name, border }) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg"
                      style={{ background: color, border: `2px solid ${border || 'rgba(212,160,23,0.4)'}` }} />
                    <span className="font-serif text-xs" style={{ color: 'rgba(212,160,23,0.6)' }}>{name}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  { title: 'Damas', desc: 'Vestidos largos o coctel con flecos, lentejuelas o plumas. Guantes, tocados, diademas y accesorios de los anos 20.' },
                  { title: 'Caballeros', desc: 'Traje oscuro o smoking con corbata o mono. Sombrero fedora o bombin. Chaleco y panuelo de bolsillo.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="rounded-xl p-5" style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.15)' }}>
                    <p className="font-serif text-xs uppercase tracking-widest mb-2" style={{ color: '#d4a017' }}>{title}</p>
                    <p className="font-serif text-sm leading-relaxed" style={{ color: 'rgba(212,160,23,0.6)' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </ArtDecoFrame>
          </motion.div>
        </div>
      </section>

      {/* ══ PHOTO GALLERY ═════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 noir-section">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="font-serif text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(212,160,23,0.5)' }}>
              ✦ Galeria ✦
            </p>
            <h2 className="font-serif font-bold mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#d4a017' }}>
              Recuerdos con Zandra
            </h2>
            <p className="font-serif italic text-base md:text-lg max-w-xl mx-auto" style={{ color: 'rgba(212,160,23,0.5)' }}>
              Sube tus fotos favoritas con la festejada. El dia del evento se proyectaran en pantalla grande durante la fiesta.
            </p>
            <GoldDivider />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <PhotoGallery />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }} viewport={{ once: true }} className="mt-12 text-center">
            <a href="?slideshow=1" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-widest px-8 py-3 rounded-full transition-all hover:scale-105"
              style={{ border: '1px solid rgba(212,160,23,0.5)', color: '#d4a017' }}>
              <Camera className="w-5 h-5" />
              Modo Pantalla Grande — Fiesta
            </a>
            <p className="font-serif text-xs mt-2 italic" style={{ color: 'rgba(212,160,23,0.4)' }}>
              Abre este enlace en la pantalla del evento para el slideshow
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ RSVP ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 noir-section-alt">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-10">
            <p className="font-serif text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(212,160,23,0.5)' }}>
              ✦ Confirmacion ✦
            </p>
            <h2 className="font-serif font-bold" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#d4a017' }}>
              Confirma tu Asistencia
            </h2>
            <GoldDivider />
          </motion.div>
          <ArtDecoFrame className="gold-card-light rounded-2xl p-8 md:p-10">
            <RSVPForm />
          </ArtDecoFrame>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="py-12 px-4 text-center noir-section relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(212,160,23,0.2)' }}>
        <GoldDivider />
        <p className="shimmer-text font-serif font-bold mb-2" style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>
          Zandra Veliz · 60 Anos
        </p>
        <p className="font-serif text-xs tracking-widest uppercase" style={{ color: 'rgba(212,160,23,0.5)' }}>
          5 de Septiembre · 2026 · Club Espanol · Fuentecilla, Guatemala
        </p>
        <p className="font-serif italic text-sm mt-3" style={{ color: 'rgba(212,160,23,0.35)' }}>
          Una noche de elegancia, amistad y nostalgia · Estilo Gran Gatsby
        </p>
      </footer>
    </div>
  )
}
