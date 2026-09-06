import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, Camera, ChevronDown, Trash2, Lock, LogOut, RefreshCw, Navigation, ArrowLeft, ArrowRight, RotateCcw, Sun, MonitorPlay, ZoomIn, ZoomOut, Eye, EyeOff, Search } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { isSlideshowVisible, photoSettings, presentationOrder, photoStyle } from './galleryPresentation'
import { LIVE_PARTY_REFRESH_MS, LIVE_PARTY_SCREEN_URL, LIVE_PARTY_TAG, LIVE_PHOTO_REFRESH_MS, livePartyArrivalMessage, livePartyPhotosApiUrl, memoriesPhotosApiUrl } from './livePartyPhotos'

// ─── Config ───────────────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD = 'duo4dukq4'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`
const CLOUDINARY_FETCH_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload`
const UPLOAD_PRESET = 'zandra60'
const ADMIN_PASSWORD = 'zandra60party'

// Photos are uploaded as the original browser-selected files. This preserves the
// complete frame and highest available resolution instead of resizing, converting,
// or cropping guest memories before they reach the gallery.

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

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(memoriesPhotosApiUrl())
      if (res.ok) {
        const d = await res.json()
        setPhotos(presentationOrder(d.photos || []))
      }
    } catch (_) {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchPhotos() }, [fetchPhotos])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <button onClick={fetchPhotos} disabled={loading}
          className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-widest transition-colors disabled:opacity-40"
          style={{ color: 'rgba(212,160,23,0.6)' }}>
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Cargando...' : 'Actualizar galeria'}
        </button>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, i) => (
            <motion.div key={photo.public_id} layout
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="relative rounded-xl overflow-hidden flex items-center justify-center"
              style={{ border: '1px solid rgba(212,160,23,0.25)', aspectRatio: '4/3', background: 'rgba(0,0,0,0.42)' }}>
              <img src={photo.full_url || photo.url} alt="" className="w-full h-full object-contain" style={photoStyle(photo)} loading="lazy" />
              {photoSettings(photo).caption && (
                <p className="absolute bottom-0 inset-x-0 px-2 py-1.5 text-center font-serif text-xs" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: '#f5d76e' }}>
                  {photoSettings(photo).caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-serif italic" style={{ color: 'rgba(212,160,23,0.4)' }}>
            Se el primero en compartir un recuerdo
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Separate Live Party Photos ──────────────────────────────────────────────
function GatsbyPartyPhotoFrame({ children, className = '' }) {
  return (
    <div className={`relative ${className}`} style={{ background: 'linear-gradient(135deg, #070809, #15262b 50%, #070809)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ border: '3px solid #d4a017', boxShadow: '0 0 28px rgba(212,160,23,0.28), inset 0 0 28px rgba(0,0,0,0.72)' }} />
      <div className="absolute inset-3 pointer-events-none" style={{ border: '1px solid rgba(245,215,110,0.78)' }} />
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 right-0', 'bottom-0 left-0'].map((position, index) => (
        <div key={position} className={`absolute ${position} w-16 h-16 pointer-events-none`} style={{ transform: `rotate(${index * 90}deg)` }}>
          <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
            <path d="M5 5 H42 V9 H10 V42 H5 Z" fill="#d4a017" opacity="0.95" />
            <path d="M12 12 L30 12 L12 30 Z" fill="#f5d76e" opacity="0.58" />
            <path d="M16 16 Q31 21 36 36" fill="none" stroke="#d4a017" strokeWidth="2" opacity="0.8" />
          </svg>
        </div>
      ))}
      {children}
    </div>
  )
}

function LivePartyGallery() {
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [name, setName] = useState('')

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(livePartyPhotosApiUrl())
      if (res.ok) {
        const data = await res.json()
        setPhotos(presentationOrder(data.photos || []))
      }
    } catch (_) { toast.error('No se pudieron cargar las fotos en vivo') }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPhotos()
    const id = setInterval(fetchPhotos, LIVE_PARTY_REFRESH_MS)
    return () => clearInterval(id)
  }, [fetchPhotos])

  const handleUpload = useCallback(async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    setUploading(true)
    setProgress(`Subiendo ${files.length} foto${files.length > 1 ? 's' : ''} directamente a la pantalla de fiesta...`)
    const results = await Promise.all(files.map(async file => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)
      formData.append('tags', LIVE_PARTY_TAG)
      if (name.trim()) formData.append('context', `uploader=${name.trim()}|zv_collection=party-live`)
      try {
        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData })
        const data = await res.json()
        if (data.public_id) return true
        toast.error(`Error: ${data.error?.message || 'No se pudo subir la foto'}`)
      } catch (_) { toast.error('Error de conexión al subir la foto') }
      return false
    }))
    const ok = results.filter(Boolean).length
    setUploading(false)
    setProgress('')
    if (ok > 0) {
      toast.success(`${ok} foto${ok > 1 ? 's' : ''} de la fiesta ${ok > 1 ? 'subidas' : 'subida'}: ${livePartyArrivalMessage()}`)
      fetchPhotos()
    }
  }, [fetchPhotos, name])

  const handleChange = event => { handleUpload(event); event.target.value = '' }

  return (
    <div className="space-y-7" aria-live="polite">
      <GatsbyPartyPhotoFrame className="rounded-2xl overflow-hidden p-6 md:p-8">
        <div className="relative text-center px-4 py-4">
          <p className="font-serif text-xs uppercase tracking-[0.28em]" style={{ color: 'rgba(245,215,110,0.74)' }}>Colección independiente</p>
          <h3 className="font-serif text-2xl md:text-3xl font-bold mt-3" style={{ color: '#f5d76e' }}>Fotos en Vivo de la Fiesta</h3>
          <p className="font-serif text-sm md:text-base leading-relaxed max-w-xl mx-auto mt-3" style={{ color: 'rgba(212,160,23,0.78)' }}>
            Sube momentos de esta noche. Estas fotos no se mezclan con los recuerdos de Zandra: aparecen solo en la pantalla especial de la fiesta.
          </p>
        </div>
      </GatsbyPartyPhotoFrame>

      <div className="max-w-sm mx-auto">
        <label className="block text-center font-serif text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(212,160,23,0.72)' }}>Tu nombre o mesa (opcional)</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Mesa 4" className="gatsby-input w-full rounded-xl px-4 py-3 text-center font-serif text-lg" />
      </div>

      <label className="block cursor-pointer">
        <input type="file" accept="image/*" capture="environment" multiple onChange={handleChange} className="hidden" />
        <GatsbyPartyPhotoFrame className="rounded-2xl overflow-hidden p-8 md:p-12">
          <div className="relative text-center">
            <Camera className="w-11 h-11 md:w-14 md:h-14 mx-auto mb-4" style={{ color: '#f5d76e' }} />
            <p className="font-serif text-xl md:text-2xl font-bold" style={{ color: '#f5d76e' }}>{uploading ? (progress || 'Procesando...') : 'Tomar o subir fotos de la fiesta'}</p>
            <p className="font-serif text-xs uppercase tracking-widest mt-3" style={{ color: 'rgba(212,160,23,0.72)' }}>Cámara o galería · JPG · PNG · HEIC · Múltiples fotos</p>
            <p className="font-serif text-sm mt-4" style={{ color: 'rgba(245,215,110,0.74)' }}>{livePartyArrivalMessage()}</p>
          </div>
        </GatsbyPartyPhotoFrame>
      </label>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <button onClick={fetchPhotos} disabled={loading} className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-widest px-5 py-3 rounded-full disabled:opacity-50" style={{ border: '1px solid rgba(212,160,23,0.44)', color: '#d4a017' }}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> {loading ? 'Actualizando...' : 'Actualizar fotos en vivo'}
        </button>
        <a href={LIVE_PARTY_SCREEN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-serif text-xs uppercase tracking-widest px-5 py-3 rounded-full" style={{ background: 'linear-gradient(135deg, #8B6914, #d4a017)', color: '#090909' }}>
          <MonitorPlay className="w-4 h-4" /> Abrir pantalla de fiesta
        </a>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.slice(0, 18).map(photo => (
            <GatsbyPartyPhotoFrame key={photo.public_id} className="rounded-xl overflow-hidden aspect-square p-3">
              <img src={photo.full_url || photo.url} alt="Foto en vivo de la fiesta" className="relative w-full h-full object-contain" loading="lazy" style={{ ...photoStyle(photo), background: 'rgba(0,0,0,0.36)' }} />
            </GatsbyPartyPhotoFrame>
          ))}
        </div>
      ) : !uploading && (
        <GatsbyPartyPhotoFrame className="rounded-2xl overflow-hidden p-10 text-center">
          <p className="relative font-serif italic" style={{ color: 'rgba(245,215,110,0.72)' }}>Sé de los primeros en compartir un momento de la fiesta.</p>
        </GatsbyPartyPhotoFrame>
      )}
    </div>
  )
}

// ─── Dedicated Guest Party Photo Page ─────────────────────────────────────────
function PartyPhotoPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'radial-gradient(circle at 50% 0%, #183b42 0%, #080a0b 42%, #030303 100%)', color: '#d4a017' }}>
      <Toaster position="top-center" richColors />
      <ChampagneBubbles />
      <main className="relative px-4 py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-serif text-xs uppercase tracking-[0.34em]" style={{ color: 'rgba(245,215,110,0.72)' }}>Zandra Veliz · 60 Años</p>
            <h1 className="font-serif font-bold mt-4" style={{ fontSize: 'clamp(2.1rem, 8vw, 4rem)', color: '#f5d76e', letterSpacing: '0.08em' }}>FOTOS DE LA FIESTA</h1>
            <p className="font-serif text-base md:text-lg max-w-2xl mx-auto mt-4" style={{ color: 'rgba(212,160,23,0.78)' }}>
              Comparte tus momentos favoritos de esta noche. Este álbum es independiente de los recuerdos de Zandra.
            </p>
          </div>
          <LivePartyGallery />
        </div>
      </main>
    </div>
  )
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('photos')
  const [rsvps, setRsvps] = useState([])
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [deletingRsvp, setDeletingRsvp] = useState(null)
  const [editingRsvp, setEditingRsvp] = useState(null)   // id of rsvp being edited
  const [editValues, setEditValues] = useState({})        // { name, adults, kids }
  const [savingRsvp, setSavingRsvp] = useState(null)
  const [selectedPhotoId, setSelectedPhotoId] = useState(null)
  const [photoDraft, setPhotoDraft] = useState({ order: 1, rotation: 0, brightness: 100, zoom: 100, caption: '', visible: true })
  const [savingPhoto, setSavingPhoto] = useState(false)
  const [photoQuery, setPhotoQuery] = useState('')
  const [targetPosition, setTargetPosition] = useState('')
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('')
  const [deletingPhoto, setDeletingPhoto] = useState(false)

  const login = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) setAuth(true)
    else toast.error('Contraseña incorrecta')
  }

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const res = await fetch(memoriesPhotosApiUrl())
      if (res.ok) {
        const d = await res.json()
        const ordered = presentationOrder(d.photos || [])
        setPhotos(ordered)
        setSelectedPhotoId(current => current || ordered[0]?.public_id || null)
      }
    } catch (_) { toast.error('Error al cargar fotos') }
    setLoading(false)
  }

  const fetchRSVPs = async () => {
    setRsvpLoading(true)
    try {
      const res = await fetch(`/api/rsvp?password=${encodeURIComponent(ADMIN_PASSWORD)}`)
      if (res.ok) { const d = await res.json(); setRsvps(d.rsvps || []) }
      else toast.error('Error al cargar RSVPs')
    } catch (_) { toast.error('Error de conexion') }
    setRsvpLoading(false)
  }

  const startEdit = (r) => {
    setEditingRsvp(r.id)
    setEditValues({ name: r.name, adults: r.adults ?? 1, kids: r.kids ?? 0 })
  }

  const cancelEdit = () => { setEditingRsvp(null); setEditValues({}) }

  const saveEdit = async (id) => {
    setSavingRsvp(id)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password: ADMIN_PASSWORD, ...editValues }),
      })
      if (res.ok) {
        const { rsvp } = await res.json()
        setRsvps(p => p.map(r => r.id === id ? rsvp : r))
        toast.success('Reservacion actualizada')
        cancelEdit()
      } else {
        const err = await res.json().catch(() => ({}))
        toast.error('Error: ' + (err.error || res.status))
      }
    } catch (_) { toast.error('Error de conexion') }
    setSavingRsvp(null)
  }

  const deleteRSVP = async (id) => {
    setDeletingRsvp(id)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password: ADMIN_PASSWORD }),
      })
      if (res.ok) {
        toast.success('RSVP eliminado')
        setRsvps(p => p.filter(r => r.id !== id))
      } else toast.error('No se pudo eliminar')
    } catch (_) { toast.error('Error de conexion') }
    setDeletingRsvp(null)
  }

  const selectPhoto = (photo, index) => {
    const settings = photoSettings(photo)
    setSelectedPhotoId(photo.public_id)
    setPhotoDraft({
      order: settings.order ?? new Date(photo.created_at).getTime(),
      rotation: settings.rotation,
      brightness: settings.brightness,
      zoom: settings.zoom,
      caption: settings.caption,
      visible: settings.visible,
      position: index + 1,
    })
    setTargetPosition(String(index + 1))
  }

  const savePhotoSettings = async (photo, nextSettings, quiet = false) => {
    const res = await fetch('/api/update-photo-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD, public_id: photo.public_id, settings: nextSettings }),
    })
    if (!res.ok) throw new Error('No se pudieron guardar los ajustes')
    const data = await res.json()
    if (!quiet) toast.success('Ajustes de proyección guardados')
    return data.settings
  }

  const saveSelectedPhoto = async () => {
    const photo = photos.find(p => p.public_id === selectedPhotoId)
    if (!photo) return
    setSavingPhoto(true)
    try {
      const settings = await savePhotoSettings(photo, photoDraft)
      const updated = presentationOrder(photos.map(p => p.public_id === photo.public_id ? { ...p, settings } : p))
      setPhotos(updated)
      selectPhoto(updated.find(p => p.public_id === photo.public_id), updated.findIndex(p => p.public_id === photo.public_id))
    } catch (error) {
      toast.error(error.message)
    }
    setSavingPhoto(false)
  }

  const moveSelectedPhoto = async (direction) => {
    const ordered = presentationOrder(photos)
    const currentIndex = ordered.findIndex(p => p.public_id === selectedPhotoId)
    const targetIndex = Math.max(0, Math.min(ordered.length - 1, currentIndex + direction))
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= ordered.length) return
    if (currentIndex === targetIndex) return
    const currentPhoto = ordered[currentIndex]
    const targetPhoto = ordered[targetIndex]
    const currentSettings = photoSettings(currentPhoto)
    const targetSettings = photoSettings(targetPhoto)
    const currentOrder = currentSettings.order ?? new Date(currentPhoto.created_at).getTime()
    const targetOrder = targetSettings.order ?? new Date(targetPhoto.created_at).getTime()
    setSavingPhoto(true)
    try {
      const [savedCurrent, savedTarget] = await Promise.all([
        savePhotoSettings(currentPhoto, { ...currentSettings, order: targetOrder }, true),
        savePhotoSettings(targetPhoto, { ...targetSettings, order: currentOrder }, true),
      ])
      const updated = presentationOrder(ordered.map(p => {
        if (p.public_id === currentPhoto.public_id) return { ...p, settings: savedCurrent }
        if (p.public_id === targetPhoto.public_id) return { ...p, settings: savedTarget }
        return p
      }))
      setPhotos(updated)
      selectPhoto(updated.find(p => p.public_id === currentPhoto.public_id), updated.findIndex(p => p.public_id === currentPhoto.public_id))
      toast.success(direction < 0 ? 'Foto movida hacia el inicio de la proyección' : 'Foto movida hacia el final de la proyección')
    } catch (error) {
      toast.error(error.message)
    }
    setSavingPhoto(false)
  }

  const moveSelectedToPosition = () => {
    const ordered = presentationOrder(photos)
    const currentIndex = ordered.findIndex(p => p.public_id === selectedPhotoId)
    const targetIndex = Number.parseInt(targetPosition, 10) - 1
    if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= ordered.length) {
      toast.error(`Escribe una posición entre 1 y ${ordered.length}`)
      return
    }
    moveSelectedPhoto(targetIndex - currentIndex)
  }

  const selectPhotoByPosition = () => {
    const ordered = presentationOrder(photos)
    const targetIndex = Number.parseInt(photoQuery.replace('#', ''), 10) - 1
    if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= ordered.length) {
      toast.error(`Escribe un número entre 1 y ${ordered.length}`)
      return
    }
    const photo = ordered[targetIndex]
    selectPhoto(photo, targetIndex)
    document.getElementById(`organizer-photo-${photo.public_id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const toggleSelectedSlideshowVisibility = async () => {
    const photo = photos.find(p => p.public_id === selectedPhotoId)
    if (!photo) return
    const currentSettings = photoSettings(photo)
    const preservedOrder = currentSettings.order ?? new Date(photo.created_at).getTime()
    setSavingPhoto(true)
    try {
      const settings = await savePhotoSettings(photo, { ...currentSettings, order: preservedOrder, visible: !currentSettings.visible })
      const updated = presentationOrder(photos.map(p => p.public_id === photo.public_id ? { ...p, settings } : p))
      setPhotos(updated)
      selectPhoto(updated.find(p => p.public_id === photo.public_id), updated.findIndex(p => p.public_id === photo.public_id))
      toast.success(settings.visible ? 'La foto vuelve a mostrarse en pantalla grande' : 'La foto quedó oculta solo de pantalla grande')
    } catch (error) {
      toast.error(error.message)
    }
    setSavingPhoto(false)
  }

  const closeDeleteConfirmation = () => {
    if (deletingPhoto) return
    setDeleteConfirmationOpen(false)
    setDeleteConfirmationText('')
  }

  const deleteSelectedPhoto = async () => {
    const photo = photos.find(p => p.public_id === selectedPhotoId)
    if (!photo) return
    if (deleteConfirmationText.trim().toUpperCase() !== 'ELIMINAR') {
      toast.error('Escribe ELIMINAR para confirmar el borrado permanente')
      return
    }
    setDeletingPhoto(true)
    try {
      const res = await fetch('/api/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: ADMIN_PASSWORD, public_id: photo.public_id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudo eliminar la foto')
      const ordered = presentationOrder(photos)
      const deletedIndex = ordered.findIndex(p => p.public_id === photo.public_id)
      const remaining = ordered.filter(p => p.public_id !== photo.public_id)
      setPhotos(remaining)
      const nextPhoto = remaining[Math.min(Math.max(0, deletedIndex), remaining.length - 1)]
      setSelectedPhotoId(nextPhoto?.public_id || null)
      setDeleteConfirmationOpen(false)
      setDeleteConfirmationText('')
      toast.success('Foto eliminada permanentemente')
    } catch (error) {
      toast.error(error.message)
    }
    setDeletingPhoto(false)
  }

  useEffect(() => { if (auth) { fetchPhotos(); fetchRSVPs() } }, [auth])

  useEffect(() => {
    const selectedIndex = photos.findIndex(photo => photo.public_id === selectedPhotoId)
    if (selectedIndex < 0) return
    const selected = photos[selectedIndex]
    const settings = photoSettings(selected)
    setPhotoDraft({
      order: settings.order ?? new Date(selected.created_at).getTime(),
      rotation: settings.rotation,
      brightness: settings.brightness,
      zoom: settings.zoom,
      caption: settings.caption,
      visible: settings.visible,
      position: selectedIndex + 1,
    })
    setTargetPosition(String(selectedIndex + 1))
  }, [photos, selectedPhotoId])

  if (!auth) return (
    <div className="min-h-screen noir-section flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />
      <ArtDecoFrame className="w-full max-w-sm rounded-2xl p-10 gold-card text-center">
        <Lock className="w-10 h-10 mx-auto mb-4" style={{ color: '#d4a017' }} />
        <h2 className="font-serif text-2xl mb-1" style={{ color: '#d4a017' }}>Panel de Administracion</h2>
        <p className="font-serif text-xs tracking-widest uppercase mb-8" style={{ color: 'rgba(212,160,23,0.5)' }}>
          Celebracion Zandra Veliz · 60 Años
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

  const PARTY_CAP = 85
  const totalGuests = rsvps.reduce((sum, r) => sum + (r.total || 1), 0)
  const totalAdults = rsvps.reduce((sum, r) => sum + (r.adults ?? (r.plusOne ? 2 : 1)), 0)
  const totalKids   = rsvps.reduce((sum, r) => sum + (r.kids ?? 0), 0)
  const spotsLeft   = Math.max(0, PARTY_CAP - totalGuests)
  const pct         = Math.min(100, Math.round((totalGuests / PARTY_CAP) * 100))
  const barColor    = pct >= 100 ? '#ef4444' : pct >= 85 ? '#f97316' : pct >= 60 ? '#eab308' : '#d4a017'
  const selectedPhoto = photos.find(p => p.public_id === selectedPhotoId) || photos[0]
  const selectedIndex = selectedPhoto ? presentationOrder(photos).findIndex(p => p.public_id === selectedPhoto.public_id) : -1
  const orderedPhotos = presentationOrder(photos)
  const normalizedQuery = photoQuery.trim().toLowerCase().replace('#', '')
  const filteredPhotos = orderedPhotos.map((photo, index) => ({ photo, index })).filter(({ photo, index }) => {
    if (!normalizedQuery) return true
    return `${index + 1} ${photo.public_id} ${photoSettings(photo).caption}`.toLowerCase().includes(normalizedQuery)
  })
  const slideshowPhotoCount = photos.filter(isSlideshowVisible).length

  return (
    <div className="min-h-screen noir-section p-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between py-6 mb-6" style={{ borderBottom: '1px solid rgba(212,160,23,0.2)' }}>
          <div>
            <h1 className="font-serif text-2xl" style={{ color: '#d4a017' }}>Panel de Administracion</h1>
            <p className="font-serif text-xs tracking-widest uppercase mt-1" style={{ color: 'rgba(212,160,23,0.5)' }}>
              Celebracion Zandra Veliz · 60 Años
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { fetchPhotos(); fetchRSVPs() }} disabled={loading || rsvpLoading}
              className="flex items-center gap-2 font-serif text-xs uppercase tracking-widest px-4 py-2 rounded-xl transition-colors"
              style={{ border: '1px solid rgba(212,160,23,0.3)', color: 'rgba(212,160,23,0.7)' }}>
              <RefreshCw className={`w-4 h-4 ${(loading || rsvpLoading) ? 'animate-spin' : ''}`} />
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

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {[['photos', `Fotos (${photos.length})`], ['rsvps', `Invitados (${rsvps.length})`]].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="font-serif text-sm uppercase tracking-widest px-6 py-2 rounded-xl transition-all"
              style={activeTab === tab
                ? { background: 'linear-gradient(135deg, #8B6914, #d4a017)', color: '#0a0a0a', fontWeight: 700 }
                : { border: '1px solid rgba(212,160,23,0.3)', color: 'rgba(212,160,23,0.6)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <>
            <div className="rounded-2xl p-5 mb-6 gold-card">
              <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
                <div>
                  <p className="font-serif text-lg" style={{ color: '#d4a017' }}>Orden de proyección</p>
                  <p className="font-serif text-sm mt-1" style={{ color: 'rgba(212,160,23,0.58)' }}>
                    Selecciona una foto y muévela para crear tu propia historia. El orden se usa también en Modo Pantalla Grande.
                  </p>
                </div>
                <button onClick={() => window.open('/?slideshow=1', '_blank')}
                  className="inline-flex items-center justify-center gap-2 font-serif text-xs uppercase tracking-widest px-4 py-3 rounded-xl"
                  style={{ border: '1px solid rgba(212,160,23,0.45)', color: '#d4a017' }}>
                  <MonitorPlay className="w-4 h-4" /> Vista de pantalla grande
                </button>
              </div>
            </div>

            <div className="rounded-2xl p-4 mb-6 gold-card" style={{ border: '1px solid rgba(212,160,23,0.22)' }}>
              <div className="flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
                <div>
                  <p className="font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.64)' }}>Selección rápida</p>
                  <p className="font-serif text-sm mt-1" style={{ color: 'rgba(212,160,23,0.48)' }}>{slideshowPhotoCount} fotos visibles en pantalla grande · {photos.length - slideshowPhotoCount} ocultas de la proyección</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <input value={photoQuery} onChange={e => setPhotoQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') selectPhotoByPosition() }} placeholder="Número, pie o ID" className="gatsby-input min-w-0 sm:w-48 rounded-lg px-3 py-2 font-serif" aria-label="Buscar o seleccionar una foto" />
                  <button onClick={selectPhotoByPosition} className="inline-flex items-center justify-center gap-2 font-serif text-xs uppercase tracking-widest px-4 py-2 rounded-lg" style={{ border: '1px solid rgba(212,160,23,0.42)', color: '#d4a017' }}><Search className="w-4 h-4" /> Ir a foto</button>
                </div>
              </div>
            </div>

            {selectedPhoto && (
              <section className="sticky top-2 z-40 mb-5 rounded-2xl p-3 sm:p-4 shadow-2xl" style={{ background: 'rgba(10,10,10,0.96)', border: '1px solid rgba(245,215,110,0.7)', backdropFilter: 'blur(14px)', boxShadow: '0 8px 30px rgba(0,0,0,0.48)' }} aria-label="Acciones rápidas de la foto seleccionada">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-serif text-[10px] uppercase tracking-[0.22em]" style={{ color: 'rgba(245,215,110,0.68)' }}>Foto seleccionada</p>
                    <p className="font-serif text-lg sm:text-xl leading-tight truncate" style={{ color: '#f5d76e' }}>Foto #{selectedIndex + 1} de {photos.length}</p>
                  </div>
                  <button type="button" onClick={() => document.getElementById('photo-detail-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="shrink-0 font-serif text-xs uppercase tracking-widest px-3 py-2 rounded-lg" style={{ border: '1px solid rgba(212,160,23,0.42)', color: '#d4a017' }}>Editar</button>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input type="number" min="1" max={photos.length} value={targetPosition} onChange={e => setTargetPosition(e.target.value)} className="gatsby-input min-w-0 rounded-lg px-3 py-2.5 font-serif" aria-label="Nueva posición de proyección" placeholder="Posición" />
                  <button type="button" onClick={moveSelectedToPosition} disabled={savingPhoto} className="font-serif text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg font-bold disabled:opacity-35" style={{ background: 'linear-gradient(135deg, #8B6914, #d4a017)', color: '#0a0a0a' }}>Mover</button>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <button type="button" onClick={() => moveSelectedPhoto(-10)} disabled={savingPhoto || selectedIndex <= 0} className="font-serif text-xs uppercase tracking-widest py-2.5 rounded-lg disabled:opacity-35" style={{ border: '1px solid rgba(212,160,23,0.38)', color: '#f5d76e' }} aria-label="Mover diez lugares antes">← 10</button>
                  <button type="button" onClick={() => moveSelectedPhoto(-1)} disabled={savingPhoto || selectedIndex <= 0} className="font-serif text-xs uppercase tracking-widest py-2.5 rounded-lg disabled:opacity-35" style={{ border: '1px solid rgba(212,160,23,0.38)', color: '#f5d76e' }} aria-label="Mover un lugar antes">← 1</button>
                  <button type="button" onClick={() => moveSelectedPhoto(1)} disabled={savingPhoto || selectedIndex >= photos.length - 1} className="font-serif text-xs uppercase tracking-widest py-2.5 rounded-lg disabled:opacity-35" style={{ border: '1px solid rgba(212,160,23,0.38)', color: '#f5d76e' }} aria-label="Mover un lugar después">1 →</button>
                  <button type="button" onClick={() => moveSelectedPhoto(10)} disabled={savingPhoto || selectedIndex >= photos.length - 1} className="font-serif text-xs uppercase tracking-widest py-2.5 rounded-lg disabled:opacity-35" style={{ border: '1px solid rgba(212,160,23,0.38)', color: '#f5d76e' }} aria-label="Mover diez lugares después">10 →</button>
                </div>
                <button type="button" onClick={() => { setDeleteConfirmationText(''); setDeleteConfirmationOpen(true) }} disabled={savingPhoto || deletingPhoto} className="w-full flex items-center justify-center gap-2 font-serif text-xs uppercase tracking-widest px-3 py-3 rounded-lg mt-2 font-bold disabled:opacity-35" style={{ border: '1px solid rgba(239,68,68,0.9)', color: '#fee2e2', background: 'rgba(127,29,29,0.46)' }}>
                  <Trash2 className="w-4 h-4" /> Eliminar foto #{selectedIndex + 1}
                </button>
              </section>
            )}

            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredPhotos.map(({ photo, index }) => (
                <motion.div key={photo.public_id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={() => selectPhoto(photo, index)}
                  id={`organizer-photo-${photo.public_id}`}
                  role="button" tabIndex={0} aria-pressed={selectedPhotoId === photo.public_id} aria-label={`Foto ${index + 1}${isSlideshowVisible(photo) ? '' : ', oculta de pantalla grande'}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPhoto(photo, index) } }}
                  className="relative rounded-xl overflow-hidden aspect-square flex items-center justify-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  style={{ border: `2px solid ${selectedPhotoId === photo.public_id ? '#f5d76e' : 'rgba(212,160,23,0.2)'}`, background: 'rgba(0,0,0,0.42)', opacity: isSlideshowVisible(photo) ? 1 : 0.55, boxShadow: selectedPhotoId === photo.public_id ? '0 0 22px rgba(245,215,110,0.34)' : 'none', transform: selectedPhotoId === photo.public_id ? 'scale(1.02)' : 'scale(1)' }}>
                  <img src={photo.full_url || photo.url} alt="" className="w-full h-full object-contain" style={photoStyle(photo)} loading="lazy" />
                  <span className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center font-serif text-xs font-bold" style={{ background: '#0a0a0a', border: '1px solid rgba(212,160,23,0.6)', color: '#f5d76e' }}>{index + 1}</span>
                  {selectedPhotoId === photo.public_id && <span className="absolute top-2 right-2 px-2 py-1 rounded font-serif text-[10px] uppercase tracking-wider" style={{ background: '#f5d76e', color: '#0a0a0a' }}>Seleccionada</span>}
                  {!isSlideshowVisible(photo) && <span className="absolute top-2 right-2 px-2 py-1 rounded font-serif text-[10px] uppercase tracking-wider" style={{ background: 'rgba(0,0,0,0.82)', border: '1px solid rgba(212,160,23,0.5)', color: '#f5d76e' }}>Oculta</span>}
                  {photoSettings(photo).caption && <span className="absolute bottom-0 inset-x-0 px-2 py-1 text-center font-serif text-xs truncate" style={{ background: 'rgba(0,0,0,0.76)', color: '#f5d76e' }}>{photoSettings(photo).caption}</span>}
                </motion.div>
              ))}
              {filteredPhotos.length === 0 && <p className="col-span-full text-center py-10 font-serif italic" style={{ color: 'rgba(212,160,23,0.5)' }}>No encontramos una foto con esa búsqueda.</p>}
              </div>

              {selectedPhoto && (
                <aside id="photo-detail-editor" className="rounded-2xl p-5 gold-card lg:sticky lg:top-4 scroll-mt-4">
                  <p className="font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.58)' }}>Editor de presentación</p>
                  <p className="font-serif text-xl mt-1" style={{ color: '#d4a017' }}>Foto {selectedIndex + 1} de {photos.length}</p>
                  <div className="relative mt-4 rounded-xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: '4 / 3', background: '#070707' }}>
                    <img src={selectedPhoto.full_url || selectedPhoto.url} alt="Vista previa" className="w-full h-full object-contain" style={photoStyle({ ...selectedPhoto, settings: { ...photoSettings(selectedPhoto), ...photoDraft } })} />
                  </div>
                  <p className="font-serif text-xs leading-relaxed mt-4" style={{ color: 'rgba(212,160,23,0.46)' }}>Usa la barra fija encima de las fotos para mover o eliminar esta imagen rápidamente. Aquí puedes ajustar solo su presentación.</p>
                  <label className="block mt-5 font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.6)' }}>Brillo</label>
                  <div className="flex items-center gap-3 mt-2">
                    <Sun className="w-4 h-4" style={{ color: '#d4a017' }} />
                    <input type="range" min="60" max="140" value={photoDraft.brightness} onChange={e => setPhotoDraft(v => ({ ...v, brightness: Number(e.target.value) }))} className="flex-1 accent-yellow-500" />
                    <span className="font-serif text-sm w-9 text-right" style={{ color: '#f5d76e' }}>{photoDraft.brightness}%</span>
                  </div>
                  <label className="block mt-5 font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.6)' }}>Tamaño en pantalla</label>
                  <div className="flex items-center gap-3 mt-2">
                    <ZoomOut className="w-4 h-4" style={{ color: '#d4a017' }} />
                    <input type="range" min="50" max="150" step="5" value={photoDraft.zoom} onChange={e => setPhotoDraft(v => ({ ...v, zoom: Number(e.target.value) }))} className="flex-1 accent-yellow-500" aria-label="Tamaño de la foto en pantalla" />
                    <ZoomIn className="w-4 h-4" style={{ color: '#d4a017' }} />
                    <span className="font-serif text-sm w-10 text-right" style={{ color: '#f5d76e' }}>{photoDraft.zoom}%</span>
                  </div>
                  <p className="font-serif text-xs leading-relaxed mt-2" style={{ color: 'rgba(212,160,23,0.46)' }}>Reduce el tamaño para ver más de la foto; aumenta solo si deseas un acercamiento.</p>
                  <label className="block mt-5 font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.6)' }}>Rotación</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => setPhotoDraft(v => ({ ...v, rotation: v.rotation === -180 ? 90 : v.rotation - 90 }))}
                      className="font-serif text-xs uppercase tracking-widest px-3 py-2.5 rounded-lg" style={{ border: '1px solid rgba(212,160,23,0.35)', color: '#d4a017' }}>↶ Girar izquierda</button>
                    <button onClick={() => setPhotoDraft(v => ({ ...v, rotation: v.rotation === 180 ? -90 : v.rotation + 90 }))}
                      className="font-serif text-xs uppercase tracking-widest px-3 py-2.5 rounded-lg" style={{ border: '1px solid rgba(212,160,23,0.35)', color: '#d4a017' }}>Girar derecha ↷</button>
                  </div>
                  <label className="block mt-5 font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.6)' }}>Pie de foto opcional</label>
                  <input value={photoDraft.caption} maxLength={120} onChange={e => setPhotoDraft(v => ({ ...v, caption: e.target.value }))} placeholder="Ej. Recuerdo familiar" className="gatsby-input w-full rounded-lg px-3 py-2 mt-2 font-serif" />
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setPhotoDraft({ order: photoSettings(selectedPhoto).order ?? new Date(selectedPhoto.created_at).getTime(), rotation: 0, brightness: 100, zoom: 100, caption: '', visible: photoSettings(selectedPhoto).visible })}
                      className="flex items-center justify-center gap-2 font-serif text-xs uppercase tracking-widest px-3 py-2.5 rounded-lg" style={{ border: '1px solid rgba(212,160,23,0.3)', color: 'rgba(212,160,23,0.7)' }}><RotateCcw className="w-4 h-4" /> Restaurar</button>
                    <button onClick={saveSelectedPhoto} disabled={savingPhoto} className="flex-1 font-serif text-xs uppercase tracking-widest px-3 py-2.5 rounded-lg font-bold disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #8B6914, #d4a017)', color: '#0a0a0a' }}>{savingPhoto ? 'Guardando...' : 'Guardar'}</button>
                  </div>
                  <button onClick={toggleSelectedSlideshowVisibility} disabled={savingPhoto} className="w-full flex items-center justify-center gap-2 font-serif text-xs uppercase tracking-widest px-3 py-2.5 rounded-lg mt-2 disabled:opacity-35" style={{ border: `1px solid ${photoSettings(selectedPhoto).visible ? 'rgba(212,160,23,0.55)' : 'rgba(104,211,145,0.65)'}`, color: photoSettings(selectedPhoto).visible ? '#f5d76e' : '#8ee6b2' }}>
                    {photoSettings(selectedPhoto).visible ? <><EyeOff className="w-4 h-4" /> Ocultar de pantalla grande</> : <><Eye className="w-4 h-4" /> Mostrar en pantalla grande</>}
                  </button>
                  <p className="font-serif text-xs leading-relaxed mt-2" style={{ color: 'rgba(212,160,23,0.46)' }}>Ocultar solo salta esta foto en el slideshow. La foto se conserva en la galería pública y no se elimina.</p>
                  <p className="font-serif text-xs leading-relaxed mt-4" style={{ color: 'rgba(212,160,23,0.46)' }}>Los originales no se recortan, sustituyen ni eliminan. Estos ajustes solo cambian la presentación.</p>
                </aside>
              )}
            </div>
            {photos.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="font-serif italic" style={{ color: 'rgba(212,160,23,0.4)' }}>No hay fotos aun</p>
              </div>
            )}
            {deleteConfirmationOpen && selectedPhoto && (
              <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-photo-title" style={{ background: 'rgba(0,0,0,0.82)' }}>
                <ArtDecoFrame className="w-full max-w-md rounded-2xl p-7 gold-card" >
                  <Trash2 className="w-9 h-9 mb-4" style={{ color: '#f87171' }} />
                  <h3 id="delete-photo-title" className="font-serif text-2xl" style={{ color: '#fca5a5' }}>¿Eliminar esta foto?</h3>
                  <p className="font-serif leading-relaxed mt-3" style={{ color: 'rgba(255,235,235,0.82)' }}>Esta acción elimina permanentemente la foto {selectedIndex + 1} de la galería y de Cloudinary. No se puede deshacer.</p>
                  <p className="font-serif text-sm leading-relaxed mt-4" style={{ color: 'rgba(252,165,165,0.84)' }}>Para confirmar, escribe <strong>ELIMINAR</strong> abajo.</p>
                  <input value={deleteConfirmationText} onChange={e => setDeleteConfirmationText(e.target.value)} placeholder="ELIMINAR" autoFocus className="gatsby-input w-full rounded-lg px-3 py-3 mt-2 font-serif" aria-label="Escribe ELIMINAR para confirmar" />
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <button onClick={closeDeleteConfirmation} disabled={deletingPhoto} className="font-serif text-xs uppercase tracking-widest px-4 py-3 rounded-lg disabled:opacity-35" style={{ border: '1px solid rgba(212,160,23,0.4)', color: '#d4a017' }}>Cancelar</button>
                    <button onClick={deleteSelectedPhoto} disabled={deletingPhoto || deleteConfirmationText.trim().toUpperCase() !== 'ELIMINAR'} className="font-serif text-xs uppercase tracking-widest px-4 py-3 rounded-lg font-bold disabled:opacity-35" style={{ background: '#b91c1c', color: '#fff1f2' }}>{deletingPhoto ? 'Eliminando...' : 'Eliminar permanentemente'}</button>
                  </div>
                </ArtDecoFrame>
              </div>
            )}
          </>
        )}

        {/* RSVPs Tab */}
        {activeTab === 'rsvps' && (
          <>
            {/* Capacity Bar */}
            <div className="rounded-2xl p-6 mb-6 gold-card">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.6)' }}>Capacidad del Evento</p>
                  <p className="font-serif text-4xl font-bold mt-1" style={{ fontFamily: 'Cinzel, serif', color: barColor }}>
                    {totalGuests} <span className="text-xl font-normal" style={{ color: 'rgba(212,160,23,0.5)' }}>/ {PARTY_CAP}</span>
                  </p>
                </div>
                <div className="text-right">
                  {spotsLeft > 0 ? (
                    <>
                      <p className="font-serif text-3xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: barColor }}>{spotsLeft}</p>
                      <p className="font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.5)' }}>lugares disponibles</p>
                    </>
                  ) : (
                    <p className="font-serif text-lg font-bold uppercase tracking-widest" style={{ color: '#ef4444' }}>¡Cupo Lleno!</p>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full rounded-full overflow-hidden" style={{ height: 10, background: 'rgba(212,160,23,0.15)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ height: '100%', borderRadius: 9999, background: `linear-gradient(to right, #8B6914, ${barColor})` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="font-serif text-xs" style={{ color: 'rgba(212,160,23,0.4)' }}>{pct}% ocupado</p>
                <p className="font-serif text-xs" style={{ color: 'rgba(212,160,23,0.4)' }}>
                  {totalAdults} adultos · {totalKids} niños
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Confirmaciones', value: rsvps.length },
                { label: 'Adultos', value: totalAdults },
                { label: 'Niños', value: totalKids },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-5 text-center gold-card">
                  <p className="font-serif text-4xl font-bold shimmer-text" style={{ fontFamily: 'Cinzel, serif' }}>{value}</p>
                  <p className="font-serif text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(212,160,23,0.6)' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Guest List */}
            <div className="space-y-3">
              {rsvps.length === 0 && !rsvpLoading && (
                <div className="text-center py-20">
                  <p className="font-serif italic" style={{ color: 'rgba(212,160,23,0.4)' }}>Aun no hay confirmaciones</p>
                </div>
              )}
              {rsvps.map((r, i) => {
                const isEditing = editingRsvp === r.id
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="rounded-xl px-5 py-4"
                    style={{ border: `1px solid ${isEditing ? 'rgba(212,160,23,0.6)' : 'rgba(212,160,23,0.2)'}`, background: isEditing ? 'rgba(212,160,23,0.08)' : 'rgba(212,160,23,0.04)' }}>

                    {/* Normal view */}
                    {!isEditing && (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-serif font-semibold" style={{ color: '#d4a017' }}>{r.name}</p>
                          <p className="font-serif text-sm mt-0.5" style={{ color: 'rgba(212,160,23,0.7)' }}>
                            {r.adults ?? 1} adulto{(r.adults ?? 1) !== 1 ? 's' : ''}
                            {(r.kids ?? 0) > 0 ? ` · ${r.kids} niño${r.kids !== 1 ? 's' : ''}` : ''}
                            {' · '}<span style={{ color: '#d4a017', fontWeight: 700 }}>{r.total || 1} total</span>
                          </p>
                          <p className="font-serif text-xs mt-1" style={{ color: 'rgba(212,160,23,0.35)' }}>
                            {new Date(r.confirmedAt).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button onClick={() => startEdit(r)}
                            className="font-serif text-xs px-3 py-1.5 rounded-lg transition-colors"
                            style={{ border: '1px solid rgba(212,160,23,0.4)', color: '#d4a017' }}>
                            Editar
                          </button>
                          <button onClick={() => deleteRSVP(r.id)} disabled={deletingRsvp === r.id}
                            className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-40">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Edit mode */}
                    {isEditing && (
                      <div className="space-y-3">
                        <div>
                          <label className="font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.6)' }}>Nombre</label>
                          <input
                            value={editValues.name}
                            onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))}
                            className="gatsby-input w-full rounded-lg px-3 py-2 font-serif mt-1"
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.6)' }}>Adultos</label>
                            <div className="flex items-center gap-2 mt-1">
                              <button onClick={() => setEditValues(v => ({ ...v, adults: Math.max(1, (v.adults || 1) - 1) }))}
                                className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center"
                                style={{ border: '1px solid rgba(212,160,23,0.4)', color: '#d4a017' }}>−</button>
                              <span className="font-serif text-xl font-bold w-6 text-center" style={{ color: '#d4a017' }}>{editValues.adults ?? 1}</span>
                              <button onClick={() => setEditValues(v => ({ ...v, adults: (v.adults || 1) + 1 }))}
                                className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center"
                                style={{ border: '1px solid rgba(212,160,23,0.4)', color: '#d4a017' }}>+</button>
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.6)' }}>Niños</label>
                            <div className="flex items-center gap-2 mt-1">
                              <button onClick={() => setEditValues(v => ({ ...v, kids: Math.max(0, (v.kids || 0) - 1) }))}
                                className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center"
                                style={{ border: '1px solid rgba(212,160,23,0.4)', color: '#d4a017' }}>−</button>
                              <span className="font-serif text-xl font-bold w-6 text-center" style={{ color: '#d4a017' }}>{editValues.kids ?? 0}</span>
                              <button onClick={() => setEditValues(v => ({ ...v, kids: (v.kids || 0) + 1 }))}
                                className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center"
                                style={{ border: '1px solid rgba(212,160,23,0.4)', color: '#d4a017' }}>+</button>
                            </div>
                          </div>
                          <div className="flex items-end pb-1">
                            <span className="font-serif text-sm" style={{ color: 'rgba(212,160,23,0.5)' }}>
                              Total: <strong style={{ color: '#d4a017' }}>{(editValues.adults ?? 1) + (editValues.kids ?? 0)}</strong>
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => saveEdit(r.id)} disabled={savingRsvp === r.id}
                            className="flex-1 font-serif text-sm py-2 rounded-lg font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #8B6914, #d4a017)', color: '#0a0a0a' }}>
                            {savingRsvp === r.id ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button onClick={cancelEdit}
                            className="font-serif text-sm px-5 py-2 rounded-lg uppercase tracking-widest transition-colors"
                            style={{ border: '1px solid rgba(212,160,23,0.3)', color: 'rgba(212,160,23,0.6)' }}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Slideshow ────────────────────────────────────────────────────────────────
// Ken Burns animation variants — each slide gets a random zoom/pan effect
const KB_VARIANTS = [
  { initial: { scale: 1.15, x: '3%',  y: '2%'  }, animate: { scale: 1,    x: '0%',  y: '0%'  } },
  { initial: { scale: 1,    x: '0%',  y: '0%'  }, animate: { scale: 1.12, x: '-2%', y: '-2%' } },
  { initial: { scale: 1.1,  x: '-3%', y: '0%'  }, animate: { scale: 1,    x: '2%',  y: '2%'  } },
  { initial: { scale: 1,    x: '2%',  y: '-2%' }, animate: { scale: 1.1,  x: '-1%', y: '1%'  } },
  { initial: { scale: 1.08, x: '0%',  y: '3%'  }, animate: { scale: 1,    x: '0%',  y: '-1%' } },
]

function Slideshow() {
  const [photos, setPhotos] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const SLIDE_DURATION = 7000 // ms per slide

  const fetchPhotos = async () => {
    try {
      const res = await fetch(memoriesPhotosApiUrl())
      if (res.ok) {
        const d = await res.json()
        const ordered = presentationOrder(d.photos || []).filter(isSlideshowVisible)
        if (ordered.length > 0) setPhotos(ordered)
      }
    } catch (_) {}
    setLoading(false)
  }

  // Fetch on mount and every 30 seconds for new photos
  useEffect(() => {
    fetchPhotos()
    const id = setInterval(fetchPhotos, LIVE_PHOTO_REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  // Advance slide every SLIDE_DURATION ms
  useEffect(() => {
    if (!photos.length) return
    const id = setInterval(() => setCurrent(c => (c + 1) % photos.length), SLIDE_DURATION)
    return () => clearInterval(id)
  }, [photos.length])

  const kbVariant = KB_VARIANTS[current % KB_VARIANTS.length]

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#080808' }}>

      <ChampagneBubbles />

      <AnimatePresence mode="crossfade">
        {photos.length > 0 ? (
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Ken Burns blurred background — zoom/pan only on the blurred fill */}
            <motion.div
              className="absolute inset-0"
              initial={kbVariant.initial}
              animate={kbVariant.animate}
              transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
              style={{
                backgroundImage: `url(${photos[current].full_url || photos[current].url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(36px) brightness(0.28)',
                transform: 'scale(1.2)',
              }}
            />
            {/* Main photo — object-contain preserves the original full frame; the host may only scale it for presentation. */}
            <img
              src={photos[current].full_url || photos[current].url}
              alt=""
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: 'contain', objectPosition: 'center', ...photoStyle(photos[current]) }}
            />
            {photoSettings(photos[current]).caption && (
              <div className="absolute bottom-20 left-8 right-8 text-center" style={{ zIndex: 5 }}>
                <p className="inline-block px-6 py-3 font-serif text-xl md:text-3xl" style={{ color: '#f5d76e', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,160,23,0.35)' }}>{photoSettings(photos[current]).caption}</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ backgroundImage: 'url(/hero_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0" style={{ background: 'rgba(8,8,8,0.6)' }} />
            <div className="relative z-10 text-center px-8">
              <Medallion size={180} />
              <p className="font-serif text-3xl md:text-5xl shimmer-text mt-8 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                ZANDRA VELIZ
              </p>
              <p className="font-serif text-xl md:text-2xl mb-8" style={{ color: '#d4a017' }}>60 Años</p>
              {loading ? (
                <p className="font-serif text-lg tracking-widest uppercase" style={{ color: 'rgba(212,160,23,0.6)' }}>
                  Cargando fotos...
                </p>
              ) : (
                <p className="font-serif text-lg tracking-widest uppercase" style={{ color: 'rgba(212,160,23,0.6)' }}>
                  Esperando fotos de los invitados...
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.4) 100%)'
      }} />

      {/* Gold Art Deco border */}
      <div className="absolute inset-4 pointer-events-none" style={{ border: '1px solid rgba(212,160,23,0.4)' }}>
        <div className="absolute inset-2" style={{ border: '1px solid rgba(212,160,23,0.18)' }} />
        {/* Corner ornaments */}
        {[['top-0 left-0', '0 0'], ['top-0 right-0', '0 90deg'], ['bottom-0 right-0', '0 180deg'], ['bottom-0 left-0', '0 270deg']].map(([pos, rot], i) => (
          <div key={i} className={`absolute ${pos} w-8 h-8`} style={{ transform: `rotate(${rot})` }}>
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M2 2 L14 2 L14 4 L4 4 L4 14 L2 14 Z" fill="rgba(212,160,23,0.7)" />
            </svg>
          </div>
        ))}
      </div>

      {/* Top title */}
      <div className="absolute top-0 left-0 right-0 pt-8 text-center" style={{ zIndex: 10 }}>
        <p className="font-serif shimmer-text" style={{ fontSize: 'clamp(1.2rem, 3vw, 2.5rem)', fontFamily: 'Cinzel, serif', letterSpacing: '0.2em' }}>
          ZANDRA VELIZ
        </p>
        <p className="font-serif tracking-widest uppercase mt-1" style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.9rem)', color: 'rgba(212,160,23,0.55)' }}>
          60 Años ❖ 5 de Septiembre 2026
        </p>
      </div>

      {/* Bottom caption */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 text-center" style={{ zIndex: 10 }}>
        <p className="font-serif tracking-widest uppercase" style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.85rem)', color: 'rgba(212,160,23,0.5)' }}>
          Club Español · Fuentecilla · Guatemala
        </p>
        {photos.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-2">
            {photos.map((_, i) => (
              <div key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                className="rounded-full cursor-pointer transition-all"
                style={{ width: i === current ? 20 : 6, height: 6,
                  background: i === current ? '#d4a017' : 'rgba(212,160,23,0.3)' }} />
            ))}
          </div>
        )}
      </div>


    </div>
  )
}

// ─── Dedicated Gatsby-Framed Live Party Screen ────────────────────────────────
function LivePartyScreen() {
  const [photos, setPhotos] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const SLIDE_DURATION = 7000

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch(livePartyPhotosApiUrl())
      if (res.ok) {
        const data = await res.json()
        const ordered = presentationOrder(data.photos || []).filter(isSlideshowVisible)
        setPhotos(ordered)
        setCurrent(index => ordered.length ? Math.min(index, ordered.length - 1) : 0)
      }
    } catch (_) {}
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPhotos()
    const id = setInterval(fetchPhotos, LIVE_PARTY_REFRESH_MS)
    return () => clearInterval(id)
  }, [fetchPhotos])

  useEffect(() => {
    if (!photos.length) return
    const id = setInterval(() => setCurrent(index => (index + 1) % photos.length), SLIDE_DURATION)
    return () => clearInterval(id)
  }, [photos.length])

  const activePhoto = photos[current]

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center" style={{ background: 'radial-gradient(circle at 50% 25%, #183b42 0%, #080b0c 42%, #020303 100%)' }}>
      <ChampagneBubbles />
      {activePhoto && <div className="absolute inset-0" style={{ backgroundImage: `url(${activePhoto.full_url || activePhoto.url})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(44px) brightness(0.18)', transform: 'scale(1.18)' }} />}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.78) 100%)' }} />

      <div className="absolute top-0 left-0 right-0 pt-7 text-center" style={{ zIndex: 10 }}>
        <p className="font-serif tracking-[0.34em] uppercase" style={{ fontSize: 'clamp(0.72rem, 1.3vw, 1rem)', color: 'rgba(245,215,110,0.76)' }}>Celebración en vivo</p>
        <p className="font-serif font-bold mt-2" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.6rem)', color: '#f5d76e', letterSpacing: '0.16em' }}>FOTOS DE LA FIESTA</p>
      </div>

      <AnimatePresence mode="wait">
        {activePhoto ? (
          <motion.div key={activePhoto.public_id} initial={{ opacity: 0, scale: 0.965 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.025 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} className="relative" style={{ width: 'min(84vw, 1220px)', height: 'min(72vh, 790px)', zIndex: 5 }}>
            <GatsbyPartyPhotoFrame className="w-full h-full rounded-2xl overflow-hidden p-12 md:p-16">
              <img src={activePhoto.full_url || activePhoto.url} alt="Foto en vivo de la fiesta" className="relative w-full h-full object-contain" style={photoStyle(activePhoto)} />
            </GatsbyPartyPhotoFrame>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative text-center px-8" style={{ zIndex: 5, width: 'min(76vw, 800px)' }}>
            <GatsbyPartyPhotoFrame className="rounded-2xl overflow-hidden p-12 md:p-16">
              <div className="relative">
                <Camera className="w-16 h-16 mx-auto mb-6" style={{ color: '#f5d76e' }} />
                <p className="font-serif text-2xl md:text-4xl font-bold" style={{ color: '#f5d76e' }}>{loading ? 'Cargando fotos en vivo...' : 'La fiesta acaba de empezar'}</p>
                <p className="font-serif text-base md:text-xl mt-4" style={{ color: 'rgba(212,160,23,0.78)' }}>Las nuevas fotos aparecerán aquí automáticamente.</p>
              </div>
            </GatsbyPartyPhotoFrame>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 pb-7 text-center" style={{ zIndex: 10 }}>
        <p className="font-serif uppercase tracking-[0.22em]" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.85rem)', color: 'rgba(212,160,23,0.68)' }}>Zandra Veliz · 60 Años · Club Español</p>
        <p className="font-serif mt-2" style={{ fontSize: 'clamp(0.65rem, 1vw, 0.88rem)', color: 'rgba(245,215,110,0.56)' }}>Actualización automática cada 5 segundos</p>
      </div>
    </div>
  )
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────
function RSVPForm() {
  const [name, setName] = useState('')
  const [adults, setAdults] = useState(1)
  const [kids, setKids] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [availability, setAvailability] = useState(null)

  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch('/api/rsvp?availability=1')
      if (res.ok) setAvailability(await res.json())
    } catch (_) {}
  }, [])

  useEffect(() => { fetchAvailability() }, [fetchAvailability])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Por favor ingresa tu nombre'); return }
    const groupSize = adults + kids
    if (availability && groupSize > availability.spotsLeft) {
      toast.error(availability.spotsLeft === 0
        ? 'Lo sentimos, ya no hay lugares disponibles.'
        : `Solo quedan ${availability.spotsLeft} lugares. Ajusta tu grupo para confirmar.`)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), adults, kids, total: adults + kids, plusOne: adults > 1 || kids > 0, plusOneName: '' }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSubmitted(true)
        toast.success('Confirmación recibida. ¡Te esperamos!')
        setAvailability(current => current ? { ...current, confirmed: current.confirmed + groupSize, spotsLeft: Math.max(0, current.spotsLeft - groupSize) } : current)
      } else {
        if (typeof data.spotsLeft === 'number') {
          setAvailability(current => current ? { ...current, confirmed: Math.max(0, current.partyCap - data.spotsLeft), spotsLeft: data.spotsLeft } : current)
        }
        toast.error(data.error || 'No fue posible confirmar en este momento. Intenta de nuevo.')
      }
    } catch (_) {
      toast.error('Error de conexión. Intenta de nuevo.')
    }
    setSubmitting(false)
  }

  const Counter = ({ label, value, onChange, min = 0 }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="font-serif text-xs uppercase tracking-widest" style={{ color: 'rgba(212,160,23,0.6)' }}>{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" formNoValidate data-quantity-control="decrease" aria-label={`Reducir ${label}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); onChange(Math.max(min, value - 1)) }}
          className="w-9 h-9 rounded-full font-bold text-lg flex items-center justify-center transition-all"
          style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.35)', color: '#d4a017' }}>
          −
        </button>
        <span className="font-serif text-2xl font-bold w-8 text-center" style={{ color: '#d4a017' }}>{value}</span>
        <button type="button" formNoValidate data-quantity-control="increase" aria-label={`Aumentar ${label}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); onChange(value + 1) }}
          className="w-9 h-9 rounded-full font-bold text-lg flex items-center justify-center transition-all"
          style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.35)', color: '#d4a017' }}>
          +
        </button>
      </div>
    </div>
  )

  if (submitted) return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
      <Medallion size={80} />
      <p className="font-serif text-2xl font-bold mt-4 mb-2" style={{ color: '#d4a017' }}>
        Nos vemos el 5 de Septiembre
      </p>
      <p className="font-serif text-sm" style={{ color: 'rgba(212,160,23,0.6)' }}>
        {name} — {adults} adulto{adults !== 1 ? 's' : ''}{kids > 0 ? ` y ${kids} niño${kids !== 1 ? 's' : ''}` : ''} confirmado{adults + kids !== 1 ? 's' : ''}
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

      {/* Guest count selectors */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.15)' }}>
        <p className="font-serif text-xs uppercase tracking-widest text-center mb-4" style={{ color: 'rgba(212,160,23,0.5)' }}>¿Cuántas personas asistirán?</p>
        <div className="flex justify-around">
          <Counter label="Adultos" value={adults} onChange={setAdults} min={1} />
          <div style={{ width: 1, background: 'rgba(212,160,23,0.2)' }} />
          <Counter label="Niños" value={kids} onChange={setKids} min={0} />
        </div>
      </div>

      <div className="text-center">
        <span className="inline-block font-serif text-xs uppercase tracking-widest px-4 py-1 rounded-full"
          style={{ border: '1px solid rgba(212,160,23,0.3)', color: 'rgba(212,160,23,0.6)' }}>
          {adults + kids} persona{adults + kids !== 1 ? 's' : ''} confirmada{adults + kids !== 1 ? 's' : ''}
        </span>
      </div>

      {availability && (
        <p className="text-center font-serif text-xs leading-relaxed" style={{ color: availability.spotsLeft > 0 ? 'rgba(212,160,23,0.64)' : '#fca5a5' }}>
          {availability.spotsLeft > 0
            ? `${availability.spotsLeft} lugar${availability.spotsLeft !== 1 ? 'es' : ''} disponible${availability.spotsLeft !== 1 ? 's' : ''} para esta celebración.`
            : 'Lo sentimos, la celebración ya alcanzó su capacidad.'}
        </p>
      )}

      <motion.button type="submit" disabled={submitting}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="w-full font-serif font-bold py-4 rounded-xl transition-all disabled:opacity-50 tracking-widest text-sm uppercase text-black"
        style={{ background: 'linear-gradient(135deg, #8B6914, #d4a017, #f5d76e, #d4a017, #8B6914)' }}>
        {submitting ? 'Confirmando...' : 'Confirmar Asistencia'}
      </motion.button>

      <div className="pt-4 text-center" style={{ borderTop: '1px solid rgba(212,160,23,0.2)' }}>
        <p className="font-serif text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(212,160,23,0.4)' }}>
          Preguntas — contacta al organizador
        </p>
        <p className="font-serif font-semibold mb-3" style={{ color: '#d4a017' }}>Brayan Santizo</p>
        <a
          href="https://wa.me/12015987303"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-serif text-sm font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: '#fff',
            boxShadow: '0 0 18px rgba(37,211,102,0.35)',
            letterSpacing: '0.05em',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20, flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Escríbeme por WhatsApp
        </a>
      </div>
    </form>
  )
}

// ─── Art Deco Door SVG Panel ───────────────────────────────────────────────────
function DoorPanel({ initial, flip }) {
  const gold = '#e8b820'
  const goldDim = '#c49a14'
  const navy = '#040608'
  // viewBox 200x520, flip=true mirrors for right door
  return (
    <svg
      viewBox="0 0 200 520"
      width="100%" height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      {/* Background */}
      <rect width="200" height="520" fill={navy} />
      {/* Subtle texture overlay */}
      <rect width="200" height="520" fill="url(#grain)" opacity="0.03" />

      {/* Outer border */}
      <rect x="4" y="4" width="192" height="512" fill="none" stroke={gold} strokeWidth="3.5" />
      {/* Inner borders */}
      <rect x="10" y="10" width="180" height="500" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.7" />
      <rect x="15" y="15" width="170" height="490" fill="none" stroke={gold} strokeWidth="0.8" opacity="0.4" />

      {/* Corner fan ornaments */}
      {[
        [15, 15, [0,20,40,60,80]],
        [185, 15, [100,120,140,160,180]],
        [15, 505, [280,300,320,340,360]],
        [185, 505, [200,220,240,260,280]],
      ].map(([cx, cy, angles], gi) =>
        angles.map(a => {
          const r = a * Math.PI / 180
          return <line key={`g${gi}a${a}`} x1={cx} y1={cy} x2={cx + 24*Math.cos(r)} y2={cy + 24*Math.sin(r)} stroke={gold} strokeWidth="0.9" opacity="0.55" />
        })
      )}

      {/* Top horizontal rule */}
      <line x1="15" y1="96" x2="185" y2="96" stroke={gold} strokeWidth="2" />
      <line x1="15" y1="100" x2="185" y2="100" stroke={gold} strokeWidth="0.6" opacity="0.4" />

      {/* Monogram circle */}
      <circle cx="100" cy="54" r="34" fill={navy} stroke={gold} strokeWidth="2.5" />
      <circle cx="100" cy="54" r="27" fill="none" stroke={gold} strokeWidth="0.8" opacity="0.45" />
      {Array.from({length: 12}, (_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180
        return <line key={`tick${i}`}
          x1={100 + 27*Math.cos(a)} y1={54 + 27*Math.sin(a)}
          x2={100 + 32*Math.cos(a)} y2={54 + 32*Math.sin(a)}
          stroke={gold} strokeWidth="1" opacity="0.6" />
      })}
      <text x="100" y="54" textAnchor="middle" dominantBaseline="central"
        fontFamily="'Cinzel', serif" fontSize="36" fontWeight="700"
        letterSpacing="3"
        fill={gold}>{initial}</text>

      {/* Vertical side rails */}
      <line x1="28" y1="100" x2="28" y2="278" stroke={gold} strokeWidth="1" opacity="0.45" />
      <line x1="172" y1="100" x2="172" y2="278" stroke={gold} strokeWidth="1" opacity="0.45" />
      <line x1="38" y1="100" x2="38" y2="278" stroke={gold} strokeWidth="0.5" opacity="0.25" />
      <line x1="162" y1="100" x2="162" y2="278" stroke={gold} strokeWidth="0.5" opacity="0.25" />

      {/* Palm / torch motif — center */}
      {/* Main stem */}
      <line x1="100" y1="270" x2="100" y2="162" stroke={gold} strokeWidth="2.5" />
      <line x1="93" y1="270" x2="93" y2="182" stroke={gold} strokeWidth="1.2" opacity="0.6" />
      <line x1="107" y1="270" x2="107" y2="182" stroke={gold} strokeWidth="1.2" opacity="0.6" />
      <line x1="86" y1="270" x2="86" y2="200" stroke={gold} strokeWidth="0.8" opacity="0.35" />
      <line x1="114" y1="270" x2="114" y2="200" stroke={gold} strokeWidth="0.8" opacity="0.35" />
      {/* Fronds */}
      <path d="M100 162 Q84 142 76 118" fill="none" stroke={gold} strokeWidth="1.8" />
      <path d="M100 162 Q116 142 124 118" fill="none" stroke={gold} strokeWidth="1.8" />
      <path d="M100 158 Q78 140 66 120" fill="none" stroke={gold} strokeWidth="1.2" opacity="0.7" />
      <path d="M100 158 Q122 140 134 120" fill="none" stroke={gold} strokeWidth="1.2" opacity="0.7" />
      <path d="M100 160 Q95 135 94 112" fill="none" stroke={gold} strokeWidth="1" opacity="0.8" />
      <path d="M100 160 Q105 135 106 112" fill="none" stroke={gold} strokeWidth="1" opacity="0.8" />
      {/* Teardrop tips */}
      <ellipse cx="76" cy="115" rx="4.5" ry="7" fill={gold} opacity="0.85" />
      <ellipse cx="124" cy="115" rx="4.5" ry="7" fill={gold} opacity="0.85" />
      <ellipse cx="66" cy="117" rx="3.5" ry="5.5" fill={gold} opacity="0.6" />
      <ellipse cx="134" cy="117" rx="3.5" ry="5.5" fill={gold} opacity="0.6" />
      <ellipse cx="94" cy="109" rx="3" ry="5" fill={gold} opacity="0.75" />
      <ellipse cx="106" cy="109" rx="3" ry="5" fill={gold} opacity="0.75" />

      {/* Middle horizontal rules */}
      <line x1="15" y1="278" x2="185" y2="278" stroke={gold} strokeWidth="2" />
      <line x1="15" y1="282" x2="185" y2="282" stroke={gold} strokeWidth="0.6" opacity="0.4" />
      <line x1="15" y1="286" x2="185" y2="286" stroke={gold} strokeWidth="1.5" />

      {/* Scroll curls at sides */}
      <path d="M28 300 Q18 312 22 326 Q28 336 40 328" fill="none" stroke={gold} strokeWidth="1.3" opacity="0.7" />
      <path d="M172 300 Q182 312 178 326 Q172 336 160 328" fill="none" stroke={gold} strokeWidth="1.3" opacity="0.7" />

      {/* Lower urn / vase */}
      <line x1="100" y1="286" x2="100" y2="360" stroke={gold} strokeWidth="2" />
      <path d="M100 330 Q68 348 64 378 Q80 390 100 388 Q120 390 136 378 Q132 348 100 330Z"
        fill="none" stroke={gold} strokeWidth="1.8" />
      <path d="M100 330 Q72 352 70 378" fill="none" stroke={gold} strokeWidth="0.9" opacity="0.5" />
      <path d="M100 330 Q128 352 130 378" fill="none" stroke={gold} strokeWidth="0.9" opacity="0.5" />
      {/* Urn base */}
      <ellipse cx="100" cy="388" rx="24" ry="5.5" fill="none" stroke={gold} strokeWidth="1.5" />
      <line x1="76" y1="388" x2="76" y2="400" stroke={gold} strokeWidth="1.2" />
      <line x1="124" y1="388" x2="124" y2="400" stroke={gold} strokeWidth="1.2" />
      <line x1="73" y1="400" x2="127" y2="400" stroke={gold} strokeWidth="2" />
      <line x1="76" y1="404" x2="124" y2="404" stroke={gold} strokeWidth="0.8" opacity="0.45" />

      {/* Bottom horizontal rule */}
      <line x1="15" y1="424" x2="185" y2="424" stroke={gold} strokeWidth="2" />
      <line x1="15" y1="428" x2="185" y2="428" stroke={gold} strokeWidth="0.6" opacity="0.4" />

      {/* Bottom fan */}
      {[-60,-40,-20,0,20,40,60].map(a => {
        const r = (90 + a) * Math.PI / 180
        return <line key={`fan${a}`} x1="100" y1="505" x2={100 + 44*Math.cos(r)} y2={505 + 44*Math.sin(r)} stroke={gold} strokeWidth="0.9" opacity="0.5" />
      })}
      <path d="M56 505 Q100 464 144 505" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.7" />

      {/* Subtle diagonal fill lines */}
      {[-3,-2,-1,0,1,2,3,4,5,6].map(i => (
        <line key={`dl${i}`} x1={-40+i*40} y1="100" x2={40+i*40} y2="278" stroke={gold} strokeWidth="0.4" opacity="0.1" />
      ))}
      {[-3,-2,-1,0,1,2,3,4,5,6].map(i => (
        <line key={`dr${i}`} x1={240-i*40} y1="100" x2={160-i*40} y2="278" stroke={gold} strokeWidth="0.4" opacity="0.1" />
      ))}
    </svg>
  )
}

// ─── Envelope Intro (Art Deco Doors) ────────────────────────────────────────────────────────────────────────────────
function EnvelopeIntro({ onOpen }) {
  const [opened, setOpened] = useState(false)
  const [done, setDone] = useState(false)

  const handleOpen = () => {
    if (opened) return
    setOpened(true)
    setTimeout(() => setDone(true), 1100)
    setTimeout(() => onOpen(), 1700)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
      style={{ background: '#040608' }}
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ChampagneBubbles />

      {/* Corner ornaments */}
      {[['top-3 left-3','0deg'],['top-3 right-3','90deg'],['bottom-3 right-3','180deg'],['bottom-3 left-3','270deg']].map(([pos, rot]) => (
        <svg key={rot} width="50" height="50" viewBox="0 0 50 50"
          className={`absolute ${pos} pointer-events-none`}
          style={{ transform: `rotate(${rot})` }}>
          <path d="M4 4 L4 24 M4 4 L24 4" stroke="#d4a017" strokeWidth="1.5" opacity="0.5" />
          {[0,22,44,66].map(a => {
            const r = a * Math.PI / 180
            return <line key={a} x1="4" y1="4" x2={4+16*Math.cos(r)} y2={4+16*Math.sin(r)} stroke="#d4a017" strokeWidth="0.8" opacity="0.35" />
          })}
        </svg>
      ))}

      {/* Perspective container */}
      <div
        className="relative flex"
        style={{
          width: 'min(92vw, 460px)',
          height: 'min(88vh, 590px)',
          perspective: '1400px',
          perspectiveOrigin: 'center center',
        }}
      >
        {/* LEFT DOOR */}
        <motion.div
          style={{
            width: '50%',
            height: '100%',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            position: 'relative',
            zIndex: 2,
          }}
          animate={opened ? { rotateY: -128 } : { rotateY: 0 }}
          transition={{ duration: 1.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden' }}>
            <DoorPanel initial="Z" flip={false} />
          </div>
          {/* Door edge */}
          <div style={{
            position: 'absolute', top: 0, right: -4, width: 8, height: '100%',
            background: 'linear-gradient(to right, #3a2a08, #6b4f10)',
            transform: 'rotateY(90deg)', transformOrigin: 'right center',
          }} />
        </motion.div>

        {/* Gold seam line */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 2, height: '100%',
          background: 'linear-gradient(to bottom, transparent 0%, #e8b820 15%, #e8b820 85%, transparent 100%)',
          opacity: opened ? 0 : 0.7,
          transition: 'opacity 0.5s',
          zIndex: 10, pointerEvents: 'none',
        }} />

        {/* RIGHT DOOR */}
        <motion.div
          style={{
            width: '50%',
            height: '100%',
            transformOrigin: 'right center',
            transformStyle: 'preserve-3d',
            position: 'relative',
            zIndex: 2,
          }}
          animate={opened ? { rotateY: 128 } : { rotateY: 0 }}
          transition={{ duration: 1.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden' }}>
            <DoorPanel initial="V" flip={true} />
          </div>
          {/* Door edge */}
          <div style={{
            position: 'absolute', top: 0, left: -4, width: 8, height: '100%',
            background: 'linear-gradient(to left, #3a2a08, #6b4f10)',
            transform: 'rotateY(-90deg)', transformOrigin: 'left center',
          }} />
        </motion.div>

        {/* ZV wax seal tap button */}
        <AnimatePresence>
          {!opened && (
            <motion.button
              onClick={handleOpen}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              whileTap={{ scale: 0.88 }}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                marginTop: -34, marginLeft: -34,
                zIndex: 20,
                width: 68, height: 68,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 38% 35%, #f5d76e 0%, #d4a017 45%, #8B6914 72%, #5a4010 100%)',
                border: '2.5px solid rgba(212,160,23,0.95)',
                boxShadow: '0 0 32px rgba(212,160,23,0.85), 0 0 80px rgba(212,160,23,0.3)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {/* Outer pulse ring */}
              <motion.div style={{
                position: 'absolute', inset: -6, borderRadius: '50%',
                border: '2px solid rgba(212,160,23,0.45)',
              }}
                animate={{ scale: [1, 1.55, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              {/* Inner pulse ring */}
              <motion.div style={{
                position: 'absolute', inset: -2, borderRadius: '50%',
                border: '1px solid rgba(212,160,23,0.3)',
              }}
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
              />
              <span style={{
                color: '#1a0e00',
                fontFamily: "'Cinzel', serif",
                fontSize: 15, fontWeight: 700, letterSpacing: '0.15em',
                lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', textAlign: 'center',
                userSelect: 'none',
              }}>ZV</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Prompt text */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center pointer-events-none"
        animate={opened ? { opacity: 0 } : { opacity: [0.4, 1, 0.4] }}
        transition={opened ? { duration: 0.3 } : { duration: 2.5, repeat: Infinity }}
      >
        <p style={{ color: '#d4a017', fontFamily: 'Cinzel, serif', fontSize: 'clamp(10px,3vw,13px)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Toca ✦ ZV ✦ para abrir
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {[0,1,2].map(i => (
            <motion.div key={i} className="w-1 h-1 rounded-full" style={{ background: '#d4a017' }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false)
  const params = new URLSearchParams(window.location.search)
  if (params.get('party-photos') === '1') return <PartyPhotoPage />
  if (params.get('slideshow') === '1') return <Slideshow />
  if (params.get('live-party') === '1') return <LivePartyScreen />
  if (params.get('admin') === '1') return <AdminPanel />

  const handleOpen = () => {
    // Scroll to very top before revealing invitation
    window.scrollTo({ top: 0, behavior: 'instant' })
    setEnvelopeOpened(true)
  }

  return (
    <>
      <AnimatePresence>
        {!envelopeOpened && (
          <EnvelopeIntro onOpen={handleOpen} />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={envelopeOpened ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0a0a0a', color: '#d4a017' }}>
      <Toaster position="top-center" richColors />
      <ChampagneBubbles />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #080808 0%, #0d0b05 100%)', minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}>

        {/* Hero background image */}
        <div className="absolute inset-0"
          style={{ backgroundImage: 'url(/hero_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundAttachment: 'scroll', opacity: 0.6 }} />

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
          className="relative z-10 text-center px-6 md:px-12 w-full" style={{ overflow: 'visible', maxWidth: '900px', margin: '0 auto' }}>

          <motion.p initial={{ opacity: 0, letterSpacing: '0.05em' }} animate={{ opacity: 1, letterSpacing: '0.4em' }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-serif text-xs uppercase mb-6 md:mb-8" style={{ color: 'rgba(212,160,23,0.6)' }}>
            Con mucho amor te invita a celebrar
          </motion.p>

          {/* ZANDRA */}
          <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, type: 'spring', stiffness: 60 }}
            className="shimmer-text font-serif font-black leading-none mb-2 w-full"
            style={{ fontSize: 'clamp(4rem, 15vw, 10rem)', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', overflow: 'visible', wordBreak: 'keep-all', whiteSpace: 'nowrap', display: 'block', textAlign: 'center' }}>
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
            className="flex flex-col items-center mb-6 md:mb-10">
            <div className="relative inline-flex items-center justify-center">
              <Medallion size={220} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="shimmer-text font-serif font-black leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontFamily: 'Cinzel, serif' }}>60</span>
                <span className="font-serif text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(212,160,23,0.6)' }}>Años</span>
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
                "Viste con el esplendor de los años dorados"
              </p>
              <p className="font-serif text-sm leading-relaxed mb-3 max-w-lg mx-auto" style={{ color: 'rgba(212,160,23,0.65)' }}>
                No es obligatorio, pero te invitamos a lucir algo que vaya con el tema.
                ¡Cualquier toque Gatsby sera bienvenido!
              </p>
              <p className="font-serif text-xs tracking-widest uppercase mb-10" style={{ color: 'rgba(212,160,23,0.4)' }}>
                Colores Sugeridos
              </p>

              <div className="flex flex-nowrap justify-center gap-3 md:gap-6 mb-10 overflow-x-auto pb-1">
                {[
                  { color: '#d97706', name: 'Dorado' },
                  { color: '#111111', name: 'Negro', border: '#333' },
                  { color: '#b0b0b0', name: 'Plateado' },
                  { color: '#8B6914', name: 'Champan' },
                  { color: '#fef3c7', name: 'Marfil' },
                  { color: '#1e3a5f', name: 'Azul Noche' },
                ].map(({ color, name, border }) => (
                  <div key={name} className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg"
                      style={{ background: color, border: `2px solid ${border || 'rgba(212,160,23,0.4)'}` }} />
                    <span className="font-serif" style={{ fontSize: 'clamp(9px, 2.2vw, 12px)', color: 'rgba(212,160,23,0.6)', whiteSpace: 'nowrap' }}>{name}</span>
                  </div>
                ))}
              </div>

              {/* Outfit inspiration images */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-2xl overflow-hidden w-full" style={{ border: '1px solid rgba(212,160,23,0.3)', boxShadow: '0 0 20px rgba(212,160,23,0.1)' }}>
                    <img src="/outfit_ladies.jpg" alt="Inspiracion Damas" className="w-full object-cover" style={{ aspectRatio: '3/4' }} />
                  </div>
                  <p className="font-serif text-xs uppercase tracking-widest" style={{ color: '#d4a017' }}>✦ Damas ✦</p>
                  <p className="font-serif text-xs leading-relaxed text-center" style={{ color: 'rgba(212,160,23,0.6)' }}>Vestido con flecos, lentejuelas o plumas. Guantes, tocado o diadema.</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-2xl overflow-hidden w-full" style={{ border: '1px solid rgba(212,160,23,0.3)', boxShadow: '0 0 20px rgba(212,160,23,0.1)' }}>
                    <img src="/outfit_gents.jpg" alt="Inspiracion Caballeros" className="w-full object-cover" style={{ aspectRatio: '3/4' }} />
                  </div>
                  <p className="font-serif text-xs uppercase tracking-widest" style={{ color: '#d4a017' }}>✦ Caballeros ✦</p>
                  <p className="font-serif text-xs leading-relaxed text-center" style={{ color: 'rgba(212,160,23,0.6)' }}>Traje oscuro o smoking. Sombrero fedora, chaleco y panuelo de bolsillo.</p>
                </div>
              </div>

              {/* Accessories flat lay + note */}
              <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid rgba(212,160,23,0.25)', boxShadow: '0 0 24px rgba(212,160,23,0.08)' }}>
                <img src="/outfit_accessories.jpg" alt="Accesorios Gatsby" className="w-full object-cover" style={{ maxHeight: 220 }} />
              </div>
              <div className="rounded-xl p-5" style={{ background: 'rgba(212,160,23,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}>
                <p className="font-serif text-sm font-semibold mb-1" style={{ color: '#d4a017' }}>✦ Accesorios Gatsby en la Fiesta ✦</p>
                <p className="font-serif text-sm leading-relaxed" style={{ color: 'rgba(212,160,23,0.7)' }}>
                  No te preocupes si no tienes accesorios — ¡nosotros los tenemos! En la fiesta se proporcionaran accesorios al estilo Gatsby para que todos puedan entrar en el ambiente. ¡Ven como estes y te transformamos!
                </p>
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
              ✦ Galería de Recuerdos ✦
            </p>
            <h2 className="font-serif font-bold mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#d4a017' }}>
              Recuerdos con Zandra
            </h2>
            <p className="font-serif italic text-base md:text-lg max-w-xl mx-auto" style={{ color: 'rgba(212,160,23,0.5)' }}>
              Comparte tus recuerdos favoritos con la festejada. Esta galería se mantiene separada de las fotos en vivo de la fiesta.
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
              Pantalla de Recuerdos
            </a>
            <p className="font-serif text-xs mt-2 italic" style={{ color: 'rgba(212,160,23,0.4)' }}>
              Esta pantalla muestra únicamente la galería de recuerdos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ LIVE PARTY PHOTOS ══════════════════════════════════════════════════ */}
      <section id="fotos-en-vivo" className="py-20 md:py-28 px-4 noir-section-alt">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="font-serif text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(245,215,110,0.6)' }}>✦ En Vivo Esta Noche ✦</p>
            <h2 className="font-serif font-bold mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#f5d76e' }}>Fotos en Vivo de la Fiesta</h2>
            <p className="font-serif italic text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(212,160,23,0.7)' }}>
              Sube aquí los momentos de la fiesta. Estas fotos aparecen solamente en la pantalla Gatsby especial y no se mezclan con los recuerdos de Zandra.
            </p>
            <GoldDivider />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <LivePartyGallery />
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
          Zandra Veliz · 60 Años
        </p>
        <p className="font-serif text-xs tracking-widest uppercase" style={{ color: 'rgba(212,160,23,0.5)' }}>
          5 de Septiembre · 2026 · Club Espanol · Fuentecilla, Guatemala
        </p>
        <p className="font-serif italic text-sm mt-3" style={{ color: 'rgba(212,160,23,0.35)' }}>
          Una noche de elegancia, amistad y nostalgia · Estilo Gran Gatsby
        </p>
      </footer>
    </div>
      </motion.div>
    </>
  )
}
