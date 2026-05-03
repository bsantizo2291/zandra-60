import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, Camera, ChevronDown, Trash2, Lock, LogOut, RefreshCw, Navigation } from 'lucide-react'
import { Toaster, toast } from 'sonner'

// ─── Cloudinary Config ────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD = 'duo4dukq4'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`
const CLOUDINARY_FETCH_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload`
const UPLOAD_PRESET = 'zandra60'
const GALLERY_TAG = 'zandra60party'
const ADMIN_PASSWORD = 'zandra60party'

// ─── Client-side image compression ───────────────────────────────────────────
async function compressImage(file, maxSizeMB = 8, maxDimension = 2400) {
  return new Promise((resolve) => {
    if (file.size <= maxSizeMB * 1024 * 1024 && file.type === 'image/jpeg') {
      resolve(file); return
    }
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      const tryQuality = (q) => {
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return }
          if (blob.size <= maxSizeMB * 1024 * 1024 || q <= 0.3)
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
          else tryQuality(q - 0.1)
        }, 'image/jpeg', q)
      }
      tryQuality(0.85)
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
    const createBubble = () => {
      const id = Math.random().toString(36).slice(2)
      const size = Math.random() * 14 + 4
      const left = Math.random() * 100
      const duration = Math.random() * 5 + 4
      const drift = (Math.random() - 0.5) * 60
      setBubbles(prev => [...prev.slice(-25), { id, size, left, duration, drift }])
      setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== id)), duration * 1000)
    }
    const createDrop = () => {
      const id = Math.random().toString(36).slice(2)
      const left = Math.random() * 100
      const duration = Math.random() * 2 + 1.2
      const w = Math.random() * 2.5 + 1
      const h = w * 3
      setDrops(prev => [...prev.slice(-18), { id, left, duration, w, h }])
      setTimeout(() => setDrops(prev => prev.filter(d => d.id !== id)), duration * 1000)
    }
    const bi = setInterval(createBubble, 450)
    const di = setInterval(createDrop, 280)
    return () => { clearInterval(bi); clearInterval(di) }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
      {bubbles.map(b => (
        <div key={b.id} className="bubble" style={{
          width: b.size, height: b.size, left: `${b.left}%`, bottom: 0,
          '--drift': `${b.drift}px`,
          animationName: 'bubble-rise',
          animationDuration: `${b.duration}s`,
          animationTimingFunction: 'ease-out',
          animationFillMode: 'forwards',
        }} />
      ))}
      {drops.map(d => (
        <div key={d.id} style={{
          position: 'absolute', left: `${d.left}%`, top: 0,
          width: d.w, height: d.h,
          borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
          background: 'linear-gradient(180deg, rgba(212,160,23,0.6), rgba(180,134,11,0.2))',
          pointerEvents: 'none',
          animationName: 'champagne-drop',
          animationDuration: `${d.duration}s`,
          animationTimingFunction: 'linear',
          animationFillMode: 'forwards',
        }} />
      ))}
    </div>
  )
}

// ─── Art Deco Divider ─────────────────────────────────────────────────────────
function ArtDecoDivider({ dark = false }) {
  const color = dark ? 'rgba(212,160,23,0.7)' : 'rgba(26,39,68,0.5)'
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <polygon points="14,1 16,11 26,14 16,17 14,27 12,17 2,14 12,11" fill={dark ? '#d4a017' : '#1a2744'} opacity="0.8" />
        <polygon points="14,5 15.5,11 21,14 15.5,17 14,23 12.5,17 7,14 12.5,11" fill={dark ? '#f5d76e' : '#2d4a8a'} opacity="0.6" />
      </svg>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  )
}

// ─── Peacock SVG Feather ──────────────────────────────────────────────────────
function PeacockFeather({ className = '', flip = false }) {
  return (
    <img
      src="/peacock_left.png"
      alt=""
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined, opacity: 0.85 }}
    />
  )
}

// ─── Art Deco Corner ──────────────────────────────────────────────────────────
function ArtDecoCorners({ dark = false }) {
  const c = dark ? '#d4a017' : '#1a2744'
  const Corner = ({ style }) => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={style} className="absolute">
      <path d="M2 2 L2 20 M2 2 L20 2" stroke={c} strokeWidth="2" opacity="0.7"/>
      <path d="M8 8 L8 16 M8 8 L16 8" stroke={c} strokeWidth="1" opacity="0.5"/>
      <circle cx="2" cy="2" r="2" fill={c} opacity="0.8"/>
    </svg>
  )
  return (
    <>
      <Corner style={{ top: 0, left: 0 }} />
      <Corner style={{ top: 0, right: 0, transform: 'scaleX(-1)' }} />
      <Corner style={{ bottom: 0, left: 0, transform: 'scaleY(-1)' }} />
      <Corner style={{ bottom: 0, right: 0, transform: 'scale(-1,-1)' }} />
    </>
  )
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const target = new Date('2026-09-05T19:00:00').getTime()
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])

  const labels = ['Días', 'Horas', 'Minutos', 'Segundos']
  const values = [time.days, time.hours, time.minutes, time.seconds]

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {values.map((val, i) => (
        <motion.div
          key={labels[i]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="countdown-box navy-card rounded-2xl px-6 py-5 text-center min-w-[90px]"
        >
          <div className="shimmer-text font-serif text-5xl md:text-6xl font-black leading-none mb-1">
            {String(val).padStart(2, '0')}
          </div>
          <div className="text-amber-300 text-xs uppercase tracking-[0.2em] font-cormorant mt-2">{labels[i]}</div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Photo Gallery (with guest delete token) ─────────────────────────────────
function PhotoGallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [uploaderName, setUploaderName] = useState('')
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
          .map(r => ({
            public_id: r.public_id,
            url: `${CLOUDINARY_FETCH_URL}/w_400,h_400,c_fill,q_auto/${r.public_id}`,
            created_at: r.created_at,
          })))
      }
    } catch (_) {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchPhotos() }, [fetchPhotos])

  const handleUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    let ok = 0
    const newDeletable = {}
    for (let i = 0; i < files.length; i++) {
      setUploadProgress(`Preparando foto ${i + 1} de ${files.length}...`)
      const compressed = await compressImage(files[i])
      setUploadProgress(`Subiendo foto ${i + 1} de ${files.length}...`)
      const fd = new FormData()
      fd.append('file', compressed)
      fd.append('upload_preset', UPLOAD_PRESET)
      fd.append('tags', GALLERY_TAG)
      if (uploaderName.trim()) fd.append('context', `uploader=${uploaderName.trim()}`)
      try {
        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd })
        const data = await res.json()
        if (data.public_id) {
          ok++
          newDeletable[data.public_id] = Date.now() + 10 * 60 * 1000
        } else {
          toast.error(`Error: ${data.error?.message || 'No se pudo subir la foto'}`)
        }
      } catch (err) {
        toast.error('Error de conexión al subir la foto')
      }
    }
    setUploading(false)
    setUploadProgress('')
    if (ok > 0) {
      setDeletable(prev => ({ ...prev, ...newDeletable }))
      toast.success(`${ok} foto${ok > 1 ? 's' : ''} compartida${ok > 1 ? 's' : ''} exitosamente`)
      fetchPhotos()
    }
  }, [uploaderName, fetchPhotos])

  const handleChange = (e) => { handleUpload(e); e.target.value = '' }

  const deletePhoto = async (publicId) => {
    setDeleting(publicId)
    try {
      const res = await fetch('/api/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId }),
      })
      if (res.ok) {
        toast.success('Foto eliminada')
        setPhotos(prev => prev.filter(p => p.public_id !== publicId))
        setDeletable(prev => { const n = { ...prev }; delete n[publicId]; return n })
      } else {
        toast.error('No se pudo eliminar')
      }
    } catch (_) { toast.error('Error de conexión') }
    setDeleting(null)
  }

  const canDelete = (id) => deletable[id] && Date.now() < deletable[id]

  return (
    <div className="space-y-8">
      {/* Uploader name */}
      <div className="max-w-sm mx-auto">
        <label className="block text-center font-serif text-xs uppercase tracking-widest text-amber-700 mb-2">Tu nombre (opcional)</label>
        <input
          type="text"
          value={uploaderName}
          onChange={e => setUploaderName(e.target.value)}
          placeholder="Tu nombre"
          className="w-full bg-amber-50/80 border border-amber-600/40 rounded-xl px-4 py-3 text-navy-800 placeholder-amber-400 focus:outline-none focus:border-amber-600 transition-colors text-center font-cormorant text-lg"
          style={{ color: '#1a2744' }}
        />
      </div>

      {/* Upload area */}
      <label className="block cursor-pointer">
        <input type="file" accept="image/*" multiple onChange={handleChange} className="hidden" />
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="glass-card rounded-2xl p-10 text-center border-2 border-dashed border-amber-500/50 hover:border-amber-600 transition-colors relative overflow-hidden"
        >
          <ArtDecoCorners />
          <Camera className="w-12 h-12 mx-auto mb-4" style={{ color: '#1a2744' }} />
          <p className="font-serif text-xl mb-1" style={{ color: '#1a2744' }}>
            {uploading ? (uploadProgress || 'Procesando...') : 'Comparte un recuerdo con Zandra'}
          </p>
          {uploading ? (
            <div className="mt-4">
              <div className="w-48 h-1.5 bg-amber-200 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          ) : (
            <p className="font-cormorant text-amber-700 text-sm mt-1">Toca para seleccionar · JPG · PNG · HEIC · Múltiples fotos</p>
          )}
        </motion.div>
      </label>

      {/* Refresh */}
      <div className="text-center">
        <button onClick={fetchPhotos} disabled={loading}
          className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-widest text-amber-700 hover:text-amber-900 transition-colors disabled:opacity-50">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Cargando...' : 'Actualizar galería'}
        </button>
      </div>

      {/* Gallery grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.public_id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: deleting === photo.public_id ? 0.3 : 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="relative group rounded-xl overflow-hidden aspect-square border border-amber-400/30"
              style={{ boxShadow: '0 4px 16px rgba(26,39,68,0.15)' }}
            >
              <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              {canDelete(photo.public_id) && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => deletePhoto(photo.public_id)}
                    disabled={deleting === photo.public_id}
                    className="flex items-center gap-1 bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 font-serif uppercase tracking-wide"
                  >
                    <Trash2 className="w-3 h-3" />
                    {deleting === photo.public_id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        !uploading && (
          <div className="text-center py-16">
            <p className="font-cormorant text-amber-700 text-lg italic">Sé el primero en compartir un recuerdo</p>
          </div>
        )
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
      const res = await fetch(`/api/list-photos`)
      if (res.ok) {
        const d = await res.json()
        setPhotos(d.photos || [])
      }
    } catch (_) { toast.error('Error al cargar fotos') }
    setLoading(false)
  }

  const deletePhoto = async (publicId) => {
    setDeleting(publicId)
    try {
      const res = await fetch('/api/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId, admin: true }),
      })
      if (res.ok) {
        toast.success('Foto eliminada')
        setPhotos(prev => prev.filter(p => p.public_id !== publicId))
      } else toast.error('No se pudo eliminar')
    } catch (_) { toast.error('Error de conexión') }
    setDeleting(null)
  }

  useEffect(() => { if (auth) fetchPhotos() }, [auth])

  if (!auth) {
    return (
      <div className="min-h-screen navy-section flex items-center justify-center p-4">
        <Toaster position="top-center" richColors />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="navy-card rounded-2xl p-10 w-full max-w-sm text-center relative">
          <ArtDecoCorners dark />
          <Lock className="w-10 h-10 mx-auto mb-4 text-amber-400" />
          <h2 className="font-serif text-2xl text-amber-300 mb-2">Panel de Administración</h2>
          <p className="font-cormorant text-amber-500 text-sm mb-8">Celebración Zandra Veliz · 60 Años</p>
          <form onSubmit={login} className="space-y-4">
            <input type="password" value={pw} onChange={e => setPw(e.target.value)}
              placeholder="Contraseña"
              className="w-full bg-black/40 border border-amber-600/40 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-400 transition-colors text-center font-cormorant text-lg" />
            <button type="submit"
              className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-black font-serif font-bold py-3 rounded-xl transition-all tracking-widest text-sm uppercase">
              {loading ? 'Entrando...' : '✦ Entrar ✦'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen navy-section p-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between py-6 mb-6 border-b border-amber-700/30">
          <div>
            <h1 className="font-serif text-2xl text-amber-300">Panel de Administración</h1>
            <p className="font-cormorant text-amber-600 text-sm">Celebración Zandra Veliz · 60 Años</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchPhotos} disabled={loading}
              className="flex items-center gap-2 border border-amber-600/40 text-amber-400 hover:text-amber-300 px-4 py-2 rounded-xl text-sm font-serif uppercase tracking-wide transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 border border-amber-600/40 text-amber-400 hover:text-amber-300 px-4 py-2 rounded-xl text-sm font-serif uppercase tracking-wide transition-colors">
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>

        <p className="text-amber-500 font-cormorant text-sm mb-6">{photos.length} foto{photos.length !== 1 ? 's' : ''} en la galería</p>

        <div className="p-4 max-w-6xl mx-auto">
          {photos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-amber-600 font-cormorant text-lg italic">No hay fotos aún</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
              {photos.map(photo => (
                <motion.div key={photo.public_id} layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: deleting === photo.public_id ? 0.3 : 1, scale: 1 }}
                  className="relative group rounded-xl overflow-hidden border border-amber-800/30 aspect-square">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <p className="text-amber-600 text-xs">{photo.created_at ? new Date(photo.created_at).toLocaleDateString('es-GT') : ''}</p>
                    <button onClick={() => deletePhoto(photo.public_id)} disabled={deleting === photo.public_id}
                      className="flex items-center gap-1 bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 font-serif uppercase tracking-wide">
                      <Trash2 className="w-3 h-3" />
                      {deleting === photo.public_id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Slideshow Mode ───────────────────────────────────────────────────────────
function Slideshow() {
  const [photos, setPhotos] = useState([])
  const [current, setCurrent] = useState(0)

  const fetchPhotos = async () => {
    try {
      const res = await fetch(`https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/list/${GALLERY_TAG}.json`)
      if (res.ok) {
        const d = await res.json()
        setPhotos((d.resources || []).map(r => `${CLOUDINARY_FETCH_URL}/w_1920,h_1080,c_fill,q_auto/${r.public_id}`))
      }
    } catch (_) {}
  }

  useEffect(() => {
    fetchPhotos()
    const id = setInterval(fetchPhotos, 20000)
    return () => clearInterval(id)
  }, [])

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
            exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-amber-400 text-3xl font-serif text-center px-8">
              Esperando fotos de los invitados...<br />
              <span className="text-lg text-amber-600 mt-4 block font-cormorant italic">Escanea el código QR para subir fotos</span>
            </p>
          </div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
        <p className="text-amber-300 font-serif text-4xl glow-text mb-2">Celebración 60 Años · Zandra Veliz</p>
        <p className="text-amber-500 text-lg tracking-widest uppercase font-cormorant">5 de Septiembre · 2026 · Club Español · Fuentecilla</p>
        {photos.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {photos.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'bg-amber-400 w-8' : 'bg-amber-800 w-2'}`} />
            ))}
          </div>
        )}
      </div>
      <ChampagneBubbles />
    </div>
  )
}

// ─── RSVP Form ────────────────────────────────────────────────────────────────
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
    setSubmitting(false)
    setSubmitted(true)
    toast.success('Confirmación recibida. Te esperamos.')
  }

  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
        <div className="shimmer-text font-serif text-4xl mb-4">✦</div>
        <p className="font-serif text-2xl font-bold mb-2" style={{ color: '#1a2744' }}>Nos vemos el 5 de Septiembre</p>
        <p className="font-cormorant text-amber-700 text-base italic">
          {name}{plusOne && plusOneName ? ` y ${plusOneName}` : plusOne ? ' y acompañante' : ''} — confirmado{plusOne ? 's' : ''}
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div>
        <label className="block font-serif text-xs uppercase tracking-widest mb-2" style={{ color: '#8B6914' }}>Tu nombre completo</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Nombre y apellido" required
          className="w-full bg-amber-50/80 border border-amber-500/40 rounded-xl px-4 py-3 placeholder-amber-400 focus:outline-none focus:border-amber-600 transition-colors font-cormorant text-lg"
          style={{ color: '#1a2744' }} />
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <button type="button" onClick={() => setPlusOne(p => !p)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${plusOne ? 'bg-amber-600' : 'bg-amber-200 border border-amber-400'}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${plusOne ? 'left-7' : 'left-1'}`} />
          </button>
          <span className="font-cormorant text-base" style={{ color: '#1a2744' }}>Voy con acompañante <span className="text-amber-600">(+1)</span></span>
        </label>
      </div>

      <AnimatePresence>
        {plusOne && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <label className="block font-serif text-xs uppercase tracking-widest mb-2" style={{ color: '#8B6914' }}>Nombre de tu acompañante</label>
            <input type="text" value={plusOneName} onChange={e => setPlusOneName(e.target.value)}
              placeholder="Nombre y apellido"
              className="w-full bg-amber-50/80 border border-amber-500/40 rounded-xl px-4 py-3 placeholder-amber-400 focus:outline-none focus:border-amber-600 transition-colors font-cormorant text-lg"
              style={{ color: '#1a2744' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <span className="inline-block border border-amber-500/40 rounded-full px-4 py-1 font-cormorant text-amber-700 text-sm italic">
          {plusOne ? 'Dos personas confirmadas' : 'Una persona confirmada'}
        </span>
      </div>

      <motion.button type="submit" disabled={submitting}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-black font-serif font-bold py-3 rounded-xl transition-all disabled:opacity-50 tracking-widest text-sm uppercase">
        {submitting ? 'Confirmando...' : '✦ Confirmar Asistencia ✦'}
      </motion.button>

      <div className="pt-4 border-t border-amber-400/30 text-center">
        <p className="font-cormorant text-amber-600 text-sm mb-1 italic">Preguntas — contacta al organizador</p>
        <p className="font-serif font-semibold text-sm" style={{ color: '#1a2744' }}>Brayan Santizo</p>
        <a href="tel:+12015987303" className="font-cormorant text-amber-700 hover:text-amber-900 text-base transition-colors">+1 (201) 598-7303</a>
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
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#f5e6c8', color: '#1a2744' }}>
      <Toaster position="top-center" richColors />
      <ChampagneBubbles />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center peacock-hero overflow-hidden">
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 via-transparent to-amber-100/50 pointer-events-none" />

        {/* Navy Art Deco border frame */}
        <div className="absolute inset-4 md:inset-8 pointer-events-none"
          style={{ border: '2px solid rgba(26,39,68,0.5)', borderRadius: '4px' }}>
          <div className="absolute inset-2" style={{ border: '1px solid rgba(180,134,11,0.4)', borderRadius: '2px' }} />
          {/* Corner diamonds */}
          {[['top-0 left-0', '-translate-x-1/2 -translate-y-1/2'],
            ['top-0 right-0', 'translate-x-1/2 -translate-y-1/2'],
            ['bottom-0 left-0', '-translate-x-1/2 translate-y-1/2'],
            ['bottom-0 right-0', 'translate-x-1/2 translate-y-1/2']].map(([pos, tr], i) => (
            <div key={i} className={`absolute ${pos} w-3 h-3 bg-amber-600 rotate-45 transform ${tr}`} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        >
          {/* Invitation header */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.05em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-serif text-xs uppercase mb-6"
            style={{ color: '#1a2744', opacity: 0.8 }}
          >
            Con mucho amor te invita a celebrar
          </motion.p>

          {/* Main name */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, type: 'spring', stiffness: 70 }}
            className="shimmer-navy font-serif font-black leading-none mb-1"
            style={{ fontSize: 'clamp(4rem, 16vw, 10rem)', fontFamily: 'Cinzel, serif' }}
          >
            ZANDRA
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-serif font-semibold tracking-[0.6em] mb-4"
            style={{ fontSize: 'clamp(0.9rem, 3vw, 1.8rem)', color: '#1a2744', opacity: 0.75 }}
          >
            V E L I Z
          </motion.h2>

          <ArtDecoDivider />

          {/* 60 medallion */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.9, duration: 0.9, type: 'spring' }}
            className="oval-frame inline-flex items-center justify-center w-36 h-36 md:w-44 md:h-44 rounded-full mb-6 relative"
            style={{ background: 'rgba(245,230,200,0.7)' }}
          >
            <div className="text-center">
              <div className="shimmer-text font-serif font-black" style={{ fontSize: '4rem', lineHeight: 1 }}>60</div>
              <div className="font-serif text-xs tracking-[0.3em] uppercase mt-1" style={{ color: '#1a2744' }}>Años</div>
            </div>
          </motion.div>

          {/* Tagline card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="glass-card rounded-2xl px-8 py-5 inline-block max-w-lg relative"
          >
            <ArtDecoCorners />
            <p className="font-serif text-lg md:text-xl glow-text" style={{ color: '#1a2744' }}>
              ✦ &nbsp; Una noche de elegancia y celebración &nbsp; ✦
            </p>
            <p className="font-cormorant text-amber-700 text-sm mt-2 tracking-widest italic">Sábado · 5 de Septiembre · 2026</p>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-50">
          <ChevronDown className="w-8 h-8" style={{ color: '#1a2744' }} />
        </motion.div>
      </section>

      {/* ══ COUNTDOWN ═════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 navy-section relative overflow-hidden">
        {/* Decorative peacock feathers in background */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 opacity-10 pointer-events-none overflow-hidden">
          <PeacockFeather className="h-full w-auto feather-left" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 opacity-10 pointer-events-none overflow-hidden">
          <PeacockFeather className="h-full w-auto feather-right" flip />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-amber-400 mb-3">Cuenta Regresiva</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-amber-300 mb-12">
              La Gran Noche se Acerca
            </h2>
            <CountdownTimer />
          </motion.div>
        </div>
      </section>

      {/* ══ EVENT DETAILS ═════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 deco-tile relative">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-amber-700 mb-3">✦ Detalles del Evento ✦</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1a2744' }}>La Invitación</h2>
            <ArtDecoDivider />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Calendar, title: 'Fecha', lines: ['Sábado', '5 de Septiembre', '2026'] },
              { icon: Clock, title: 'Horario', lines: ['19:00 — 24:00', 'Cinco horas de', 'pura celebración'] },
              { icon: MapPin, title: 'Lugar', lines: ['Club Español', 'Calzada Roosevelt Km. 13.5', 'Zona 7 · Guatemala'] },
            ].map(({ icon: Icon, title, lines }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.8 }} viewport={{ once: true }}
                className="glass-card rounded-2xl p-8 text-center relative overflow-hidden">
                <ArtDecoCorners />
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-amber-500/50 mb-4"
                  style={{ background: 'rgba(26,39,68,0.08)' }}>
                  <Icon className="w-6 h-6" style={{ color: '#1a2744' }} />
                </div>
                <h3 className="font-serif text-sm uppercase tracking-widest mb-3 text-amber-700">{title}</h3>
                {lines.map((l, j) => (
                  <p key={j} className={`font-cormorant ${j === 0 ? 'text-xl font-semibold' : 'text-base'}`}
                    style={{ color: '#1a2744', opacity: j === 0 ? 1 : 0.75 }}>{l}</p>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Maps buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a href="https://www.google.com/maps/search/?api=1&query=Club+Español+Calzada+Roosevelt+Km+13.5+Zona+7+Guatemala"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-serif text-sm uppercase tracking-widest px-8 py-3 rounded-full transition-all hover:scale-105"
              style={{ background: '#1a2744', color: '#f5e6c8', border: '1px solid rgba(180,134,11,0.4)' }}>
              <MapPin className="w-4 h-4" />
              Google Maps
            </a>
            <a href="https://waze.com/ul?q=Club+Español+Calzada+Roosevelt+Km+13.5+Zona+7+Guatemala&navigate=yes"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-serif text-sm uppercase tracking-widest px-8 py-3 rounded-full transition-all hover:scale-105"
              style={{ background: 'rgba(26,39,68,0.08)', color: '#1a2744', border: '1px solid rgba(26,39,68,0.3)' }}>
              <Navigation className="w-4 h-4" />
              Waze
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══ DRESS CODE ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 navy-section relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-40 opacity-8 pointer-events-none">
          <PeacockFeather className="w-full feather-left" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 opacity-8 pointer-events-none">
          <PeacockFeather className="w-full feather-right" flip />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-amber-400 mb-3">✦ Vestimenta ✦</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-amber-300 mb-4">Código de Vestimenta</h2>
            <ArtDecoDivider dark />

            <motion.div whileHover={{ scale: 1.005 }} className="navy-card rounded-2xl p-10 relative">
              <ArtDecoCorners dark />
              <p className="font-cormorant text-amber-200 text-2xl italic mb-1">
                "Viste con el esplendor de los años dorados"
              </p>
              <p className="font-serif text-xs tracking-widest text-amber-500 mb-8 uppercase">Colores Gatsby</p>

              <div className="flex flex-wrap justify-center gap-5 mb-8">
                {[
                  { color: '#d97706', name: 'Dorado' },
                  { color: '#111111', name: 'Negro' },
                  { color: '#b0b0b0', name: 'Plateado' },
                  { color: '#8B6914', name: 'Champán' },
                  { color: '#fef3c7', name: 'Marfil' },
                  { color: '#1e3a5f', name: 'Azul Noche' },
                ].map(({ color, name }) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-2 border-amber-500/40 shadow-lg"
                      style={{ background: color }} />
                    <span className="font-cormorant text-amber-400 text-sm">{name}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="rounded-xl p-5 border border-amber-700/20" style={{ background: 'rgba(180,134,11,0.08)' }}>
                  <p className="font-serif text-amber-300 text-sm uppercase tracking-widest mb-2">Damas</p>
                  <p className="font-cormorant text-amber-200 text-base leading-relaxed">Vestidos largos o cóctel con flecos, lentejuelas o plumas. Guantes, tocados, diademas y accesorios de los años 20.</p>
                </div>
                <div className="rounded-xl p-5 border border-amber-700/20" style={{ background: 'rgba(180,134,11,0.08)' }}>
                  <p className="font-serif text-amber-300 text-sm uppercase tracking-widest mb-2">Caballeros</p>
                  <p className="font-cormorant text-amber-200 text-base leading-relaxed">Traje oscuro o smoking con corbata o moño. Sombrero fedora o bombín. Chaleco y pañuelo de bolsillo.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ PHOTO GALLERY ═════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 deco-tile">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-amber-700 mb-3">✦ Galería ✦</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1a2744' }}>
              Recuerdos con Zandra
            </h2>
            <p className="font-cormorant text-amber-700 text-lg max-w-xl mx-auto italic">
              Sube tus fotos favoritas con la festejada. El día del evento se proyectarán en pantalla grande durante la fiesta.
            </p>
            <ArtDecoDivider />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <PhotoGallery />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }} viewport={{ once: true }}
            className="mt-14 text-center">
            <a href="?slideshow=1" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-serif text-sm uppercase tracking-widest px-8 py-3 rounded-full transition-all hover:scale-105 shadow-lg"
              style={{ background: '#1a2744', color: '#f5e6c8', border: '1px solid rgba(180,134,11,0.4)' }}>
              <Camera className="w-5 h-5" />
              Modo Pantalla Grande — Fiesta
            </a>
            <p className="font-cormorant text-amber-700 text-sm mt-2 italic">Abre este enlace en la pantalla del evento para el slideshow</p>
          </motion.div>
        </div>
      </section>

      {/* ══ RSVP ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 navy-section">
        <div className="max-w-md mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-amber-400 mb-3">✦ Confirmación ✦</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-amber-300 mb-4">
              Confirma tu Asistencia
            </h2>
            <ArtDecoDivider dark />
            <motion.div whileHover={{ scale: 1.005 }} className="navy-card rounded-2xl p-10 relative">
              <ArtDecoCorners dark />
              <RSVPForm />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="relative py-12 px-4 text-center deco-tile border-t-2 border-amber-500/30 overflow-hidden">
        <div className="relative z-10">
          <ArtDecoDivider />
          <p className="shimmer-navy font-serif text-2xl font-bold mb-2">Zandra Veliz · 60 Años</p>
          <p className="font-serif text-xs tracking-widest uppercase text-amber-700">5 de Septiembre · 2026 · Club Español · Fuentecilla, Guatemala</p>
          <p className="font-cormorant text-amber-600 text-sm mt-3 italic">Una noche de elegancia, amistad y nostalgia · Estilo Gran Gatsby</p>
        </div>
      </footer>
    </div>
  )
}
