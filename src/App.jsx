import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Camera, ChevronDown, Calendar } from 'lucide-react'
import { Toaster, toast } from 'sonner'

// ─── Cloudinary Config ────────────────────────────────────────────────────────
const CLOUD = 'duo4dukq4'
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`
const CDN = `https://res.cloudinary.com/${CLOUD}/image/upload`
const PRESET = 'zandra60'
const TAG = 'zandra60party'

// ─── Champagne Rain ───────────────────────────────────────────────────────────
function ChampagneRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', resize)

    // Bubbles
    const bubbles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: H + Math.random() * H,
      r: Math.random() * 6 + 2,
      speed: Math.random() * 1.2 + 0.4,
      drift: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    }))

    // Drops
    const drops = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * -H,
      len: Math.random() * 18 + 8,
      speed: Math.random() * 3 + 2,
      alpha: Math.random() * 0.4 + 0.1,
      w: Math.random() * 1.5 + 0.5,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Draw drops
      drops.forEach(d => {
        d.y += d.speed
        if (d.y > H + 20) { d.y = -20; d.x = Math.random() * W }
        ctx.save()
        ctx.globalAlpha = d.alpha
        const g = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.len)
        g.addColorStop(0, 'rgba(251,191,36,0)')
        g.addColorStop(0.5, 'rgba(251,191,36,0.8)')
        g.addColorStop(1, 'rgba(217,119,6,0.4)')
        ctx.strokeStyle = g
        ctx.lineWidth = d.w
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x, d.y + d.len)
        ctx.stroke()
        ctx.restore()
      })

      // Draw bubbles
      bubbles.forEach(b => {
        b.y -= b.speed
        b.x += b.drift
        if (b.y < -20) { b.y = H + 10; b.x = Math.random() * W }
        ctx.save()
        ctx.globalAlpha = b.alpha
        const g = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 0, b.x, b.y, b.r)
        g.addColorStop(0, 'rgba(255,236,153,0.9)')
        g.addColorStop(0.6, 'rgba(251,191,36,0.5)')
        g.addColorStop(1, 'rgba(217,119,6,0.1)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  )
}

// ─── Art Deco Divider ─────────────────────────────────────────────────────────
function Divider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/60 to-amber-400/80" />
      <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
        <polygon points="18,2 20.5,14 32,18 20.5,22 18,34 15.5,22 4,18 15.5,14" fill="none" stroke="#d97706" strokeWidth="1.5"/>
        <polygon points="18,7 19.8,14.5 26,18 19.8,21.5 18,29 16.2,21.5 10,18 16.2,14.5" fill="#fbbf24" opacity="0.8"/>
        <circle cx="18" cy="18" r="2" fill="#fde68a"/>
      </svg>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-600/60 to-amber-400/80" />
    </div>
  )
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="text-amber-500/80 uppercase tracking-[0.45em] text-xs font-light mb-3 font-sans">
      ✦ &nbsp;{children}&nbsp; ✦
    </p>
  )
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = new Date('2026-09-05T19:00:00').getTime() - Date.now()
      if (diff > 0) setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc(); const id = setInterval(calc, 1000); return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-5">
      {[['Días', time.days], ['Horas', time.hours], ['Minutos', time.minutes], ['Segundos', time.seconds]].map(([label, value]) => (
        <motion.div
          key={label}
          whileHover={{ scale: 1.06, y: -3 }}
          className="relative text-center"
          style={{ minWidth: 80 }}
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-2xl bg-amber-500/10 blur-md" />
          <div className="relative rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/80 to-black/90 px-5 py-4 backdrop-blur-sm">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent rounded-t-2xl" />
            <motion.span
              key={value}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="block text-4xl md:text-5xl font-black text-amber-200 font-serif leading-none"
            >
              {String(value).padStart(2, '0')}
            </motion.span>
            <span className="block text-amber-600 text-[10px] uppercase tracking-[0.3em] mt-1.5">{label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Photo Gallery ────────────────────────────────────────────────────────────
function PhotoGallery() {
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploaderName, setUploaderName] = useState('')
  const [lightbox, setLightbox] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileRef = useRef()

  // Load existing photos
  useEffect(() => {
    fetch(`https://res.cloudinary.com/${CLOUD}/image/list/${TAG}.json`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.resources?.length) {
          setPhotos(d.resources.map(r => ({
            id: r.public_id,
            thumb: `${CDN}/w_400,h_400,c_fill,q_auto,f_auto/${r.public_id}`,
            full: `${CDN}/w_1200,h_1200,c_limit,q_auto,f_auto/${r.public_id}`,
          })))
        }
      })
      .catch(() => {})
  }, [])

  const uploadFiles = useCallback(async (files) => {
    if (!files.length) return
    setUploading(true)
    setUploadError(null)
    let ok = 0

    for (const file of files) {
      try {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('upload_preset', PRESET)
        fd.append('tags', TAG)
        if (uploaderName.trim()) fd.append('context', `caption=${uploaderName.trim()}`)

        const res = await fetch(UPLOAD_URL, { method: 'POST', body: fd })
        const data = await res.json()

        if (!res.ok || data.error) {
          console.error('Cloudinary error:', data.error?.message)
          setUploadError(data.error?.message || 'Error desconocido')
          toast.error(`Error: ${data.error?.message || 'No se pudo subir la foto'}`)
          continue
        }

        setPhotos(prev => [{
          id: data.public_id,
          thumb: `${CDN}/w_400,h_400,c_fill,q_auto,f_auto/${data.public_id}`,
          full: `${CDN}/w_1200,h_1200,c_limit,q_auto,f_auto/${data.public_id}`,
        }, ...prev])
        ok++
      } catch (e) {
        console.error('Upload exception:', e)
        setUploadError(e.message)
        toast.error('Error de conexión al subir la foto')
      }
    }

    setUploading(false)
    if (ok > 0) toast.success(`¡${ok} foto${ok > 1 ? 's' : ''} compartida${ok > 1 ? 's' : ''}! 🥂`)
  }, [uploaderName])

  const handleChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length) uploadFiles(files)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false)
    uploadFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')))
  }

  const rotations = [-3, 2, -4, 3, -2, 4, -1, 3, -3, 2]

  return (
    <div>
      {/* Name input */}
      <div className="mb-5 max-w-xs mx-auto">
        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={uploaderName}
          onChange={e => setUploaderName(e.target.value)}
          className="w-full bg-black/60 border border-amber-700/40 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-800 focus:outline-none focus:border-amber-500 text-center text-sm tracking-wide"
        />
      </div>

      {/* Drop zone */}
      <motion.div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        className={`relative mb-10 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
          isDragging
            ? 'border-2 border-amber-400 bg-amber-900/20'
            : 'border border-amber-700/30 bg-gradient-to-br from-amber-950/30 to-black/60 hover:border-amber-600/50'
        }`}
      >
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(217,119,6,0.1) 0, rgba(217,119,6,0.1) 1px, transparent 0, transparent 50%)',
            backgroundSize: '12px 12px',
          }}
        />
        <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleChange} disabled={uploading} className="hidden" />
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full border border-amber-600/40 bg-amber-900/20 flex items-center justify-center mx-auto mb-4">
            <Camera className="w-7 h-7 text-amber-400" />
          </div>
          <p className="text-amber-200 font-serif text-lg font-semibold mb-1">
            {uploading ? '✨ Subiendo...' : 'Comparte un recuerdo con Zandra'}
          </p>
          <p className="text-amber-600 text-xs tracking-wide">Toca para seleccionar · Arrastra tus fotos aquí</p>
          <p className="text-amber-800 text-xs mt-1">JPG · PNG · HEIC · Múltiples fotos</p>
        </div>
      </motion.div>

      {/* Error message */}
      {uploadError && (
        <div className="mb-6 p-4 rounded-xl border border-red-800/40 bg-red-950/20 text-center">
          <p className="text-red-400 text-sm">⚠️ {uploadError}</p>
          <p className="text-red-600 text-xs mt-1">Verifica que el preset "zandra60" esté activo en Cloudinary</p>
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(idx * 0.04, 0.4), type: 'spring' }}
              whileHover={{ scale: 1.04, rotate: rotations[idx % rotations.length], zIndex: 10 }}
              onClick={() => setLightbox(photo)}
              className="break-inside-avoid cursor-pointer relative overflow-hidden rounded-xl border border-amber-700/20 shadow-lg hover:border-amber-500/40 hover:shadow-amber-900/40 transition-all"
            >
              <img src={photo.thumb} alt="Recuerdo" className="w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        !uploading && (
          <div className="text-center py-12">
            <p className="text-amber-700 text-base">¡Sé el primero en compartir un recuerdo! 📸</p>
          </div>
        )
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-black/95 flex items-center justify-center p-4"
            style={{ zIndex: 10000 }}
          >
            <motion.img
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              src={lightbox.full} alt="Recuerdo"
              className="max-w-full max-h-[90vh] rounded-2xl border border-amber-700/30 shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-amber-400 hover:text-amber-200 text-2xl">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
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
    toast.success('¡Confirmación recibida! Te esperamos. 🥂')
  }

  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="text-center py-10"
      >
        <div className="text-5xl mb-5">🥂</div>
        <p className="text-amber-200 font-serif text-2xl font-bold mb-2">¡Nos vemos el 5 de Septiembre!</p>
        <p className="text-amber-500 text-sm">
          {name}{plusOne && plusOneName ? ` y ${plusOneName}` : plusOne ? ' y acompañante' : ''} — confirmado{plusOne ? 's' : ''}
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-amber-500/80 text-xs uppercase tracking-[0.3em] mb-2">Tu nombre completo</label>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Nombre y apellido" required
          className="w-full bg-black/60 border border-amber-700/40 rounded-xl px-4 py-3.5 text-amber-100 placeholder-amber-800 focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <button type="button" onClick={() => setPlusOne(p => !p)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${plusOne ? 'bg-amber-500' : 'bg-amber-950 border border-amber-700'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${plusOne ? 'left-7' : 'left-1'}`} />
          </button>
          <span className="text-amber-300 text-sm">Voy con acompañante <span className="text-amber-600">(+1)</span></span>
        </label>
      </div>

      <AnimatePresence>
        {plusOne && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <label className="block text-amber-500/80 text-xs uppercase tracking-[0.3em] mb-2">Nombre de tu acompañante</label>
            <input
              type="text" value={plusOneName} onChange={e => setPlusOneName(e.target.value)}
              placeholder="Nombre y apellido"
              className="w-full bg-black/60 border border-amber-700/40 rounded-xl px-4 py-3.5 text-amber-100 placeholder-amber-800 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <span className="inline-block border border-amber-700/30 rounded-full px-4 py-1 text-amber-600 text-xs tracking-wide">
          {plusOne ? '2 personas' : '1 persona'}
        </span>
      </div>

      <motion.button
        type="submit" disabled={submitting}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="w-full relative overflow-hidden rounded-xl py-4 font-bold text-black tracking-widest text-sm uppercase transition-all disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24, #d97706)', backgroundSize: '200%' }}
      >
        {submitting ? 'Confirmando...' : '✦ Confirmar Asistencia ✦'}
      </motion.button>

      <div className="pt-4 border-t border-amber-900/40 text-center">
        <p className="text-amber-700 text-xs mb-2">¿Preguntas? Contacta al organizador</p>
        <p className="text-amber-300 font-semibold text-sm">Brayan Santizo</p>
        <a href="tel:+12015987303" className="text-amber-500 hover:text-amber-300 text-sm transition-colors">📞 +1 (201) 598-7303</a>
      </div>
    </form>
  )
}

// ─── Slideshow Mode ───────────────────────────────────────────────────────────
function Slideshow() {
  const [photos, setPhotos] = useState([])
  const [current, setCurrent] = useState(0)

  const load = async () => {
    try {
      const r = await fetch(`https://res.cloudinary.com/${CLOUD}/image/list/${TAG}.json`)
      if (r.ok) {
        const d = await r.json()
        setPhotos((d.resources || []).map(x => `${CDN}/w_1920,h_1080,c_fill,q_auto,f_auto/${x.public_id}`))
      }
    } catch (_) {}
  }

  useEffect(() => { load(); const id = setInterval(load, 20000); return () => clearInterval(id) }, [])
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
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }} className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-amber-400 font-serif text-3xl text-center px-8">
              Esperando fotos de los invitados... 🥂
            </p>
          </div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-10 text-center">
        <p className="text-amber-200 font-serif text-4xl mb-1" style={{ textShadow: '0 0 30px rgba(251,191,36,0.6)' }}>
          Celebración 60 Años · Zandra Veliz
        </p>
        <p className="text-amber-500 text-sm tracking-[0.4em] uppercase">5 de Septiembre · 2026 · Club Español · Fuentecilla</p>
        {photos.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-5">
            {photos.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'bg-amber-400 w-8' : 'bg-amber-800 w-2'}`} />
            ))}
          </div>
        )}
      </div>
      <ChampagneRain />
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  if (new URLSearchParams(window.location.search).get('slideshow') === '1') return <Slideshow />

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Toaster position="top-center" richColors />
      <ChampagneRain />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(120,53,15,0.25) 0%, rgba(0,0,0,1) 70%)' }}
      >
        {/* Art deco grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(251,191,36,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Corner ornaments */}
        {[['top-6 left-6', ''], ['top-6 right-6', 'scale-x-[-1]'], ['bottom-6 left-6', 'scale-y-[-1]'], ['bottom-6 right-6', 'scale-[-1]']].map(([pos, tr], i) => (
          <div key={i} className={`absolute ${pos} pointer-events-none`} style={{ transform: tr }}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" opacity="0.35">
              <path d="M2 2 L2 20 M2 2 L20 2" stroke="#d97706" strokeWidth="1.5"/>
              <path d="M2 8 L8 8 L8 2" stroke="#fbbf24" strokeWidth="0.8" fill="none"/>
              <circle cx="2" cy="2" r="2" fill="#fbbf24"/>
            </svg>
          </div>
        ))}

        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #d97706, #fbbf24, #d97706, transparent)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.05em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="text-amber-600/80 text-xs uppercase mb-10 font-light"
          >
            Con mucho amor te invita a celebrar
          </motion.p>

          {/* Main name */}
          <div className="relative mb-2">
            <motion.h1
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 1.2, type: 'spring', stiffness: 60 }}
              className="font-serif font-black leading-none tracking-tight"
              style={{
                fontSize: 'clamp(5rem, 20vw, 13rem)',
                background: 'linear-gradient(180deg, #fde68a 0%, #fbbf24 40%, #d97706 70%, #92400e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 40px rgba(217,119,6,0.4))',
              }}
            >
              ZANDRA
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-amber-300/60 font-serif tracking-[0.7em] text-base md:text-xl mb-8 font-light"
          >
            V E L I Z
          </motion.p>

          <Divider className="mb-8 max-w-sm mx-auto" />

          {/* 60 badge */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.1, duration: 1, type: 'spring', stiffness: 70 }}
            className="inline-flex flex-col items-center justify-center mb-8"
          >
            <div className="relative w-36 h-36 md:w-44 md:h-44">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'conic-gradient(from 0deg, #92400e, #d97706, #fbbf24, #fde68a, #fbbf24, #d97706, #92400e)', padding: 2 }}
              >
                <div className="w-full h-full rounded-full bg-black" />
              </div>
              {/* Inner ring */}
              <div className="absolute inset-3 rounded-full border border-amber-700/40" />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif font-black leading-none"
                  style={{
                    fontSize: '4rem',
                    background: 'linear-gradient(180deg, #fde68a, #d97706)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >60</span>
                <span className="text-amber-500 text-[10px] tracking-[0.4em] uppercase mt-0.5">Años</span>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="text-amber-200/70 text-base md:text-lg font-light tracking-wide max-w-lg mx-auto mb-8"
          >
            Una noche de elegancia, glamour y celebración
          </motion.p>

          {/* Date pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="inline-flex items-center gap-3 border border-amber-700/30 rounded-full px-8 py-3"
            style={{ background: 'rgba(120,53,15,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            <span className="text-amber-300 text-sm tracking-[0.3em] uppercase font-light">Sábado · 5 de Septiembre · 2026</span>
            <span className="w-1 h-1 rounded-full bg-amber-500" />
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-40"
        >
          <ChevronDown className="w-7 h-7 text-amber-500" />
        </motion.div>
      </section>

      {/* ══ COUNTDOWN ═════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 relative"
        style={{ background: 'linear-gradient(180deg, #000 0%, rgba(120,53,15,0.12) 50%, #000 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }}>
            <SectionLabel>Cuenta Regresiva</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-12">
              La Gran Noche se Acerca
            </h2>
            <CountdownTimer />
          </motion.div>
        </div>
      </section>

      {/* ══ EVENT DETAILS ═════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 relative overflow-hidden">
        {/* Art deco bg pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(217,119,6,1) 0, rgba(217,119,6,1) 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="text-center mb-16">
            <SectionLabel>Detalles del Evento</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-6">La Invitación</h2>
            <Divider className="max-w-xs mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Calendar, label: 'Fecha', main: 'Sábado', sub: ['5 de Septiembre', '2026'] },
              { icon: Clock, label: 'Horario', main: '19:00 — 24:00', sub: ['Cinco horas de', 'pura celebración'] },
              { icon: MapPin, label: 'Lugar', main: 'Club Español', sub: ['Área Fuentecilla', 'Guatemala 🇬🇹'], url: 'https://share.google/FDmBZPdqd5IKUHSazP' },
            ].map(({ icon: Icon, label, main, sub, url }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="relative rounded-2xl p-8 text-center overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, rgba(120,53,15,0.15), rgba(0,0,0,0.8))', border: '1px solid rgba(217,119,6,0.2)' }}
              >
                {/* Top shimmer line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
                <div className="w-14 h-14 rounded-full border border-amber-700/30 bg-amber-900/10 flex items-center justify-center mx-auto mb-5 group-hover:border-amber-500/50 transition-colors">
                  <Icon className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-amber-600/70 text-[10px] uppercase tracking-[0.35em] mb-3">{label}</p>
                <p className="text-amber-100 font-serif text-xl font-bold mb-1">{main}</p>
                {sub.map((s, j) => <p key={j} className="text-amber-500/70 text-sm mt-0.5">{s}</p>)}
                {url && (
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-amber-500 hover:text-amber-300 text-xs border border-amber-700/30 hover:border-amber-500/50 rounded-full px-3 py-1.5 transition-all"
                  >
                    <MapPin className="w-3 h-3" /> Ver en Google Maps
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DRESS CODE ════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }}>
            <SectionLabel>Vestimenta</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-6">Código de Vestimenta</h2>
            <Divider className="max-w-xs mx-auto mb-12" />

            <div className="rounded-2xl p-10 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(120,53,15,0.12), rgba(0,0,0,0.9))', border: '1px solid rgba(217,119,6,0.15)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />

              <p className="text-amber-200/80 font-serif text-xl italic mb-2">
                "Viste con el esplendor de los años dorados"
              </p>
              <p className="text-amber-600/60 text-xs tracking-[0.4em] uppercase mb-10">Colores Gatsby</p>

              {/* Color swatches */}
              <div className="flex flex-wrap justify-center gap-5 mb-10">
                {[
                  { c: '#d97706', n: 'Dorado' }, { c: '#0a0a0a', n: 'Negro' },
                  { c: '#a8a8a8', n: 'Plateado' }, { c: '#8B6914', n: 'Champán' },
                  { c: '#fef3c7', n: 'Marfil' }, { c: '#1e3a5f', n: 'Azul Noche' },
                ].map(({ c, n }) => (
                  <div key={n} className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 rounded-full shadow-lg shadow-black/60 ring-1 ring-amber-700/20" style={{ background: c }} />
                    <span className="text-amber-600/70 text-xs">{n}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  { icon: '👗', title: 'Damas', desc: 'Vestidos largos o cóctel con flecos, lentejuelas o plumas. Guantes, tocados y diademas de los años 20.' },
                  { icon: '🤵', title: 'Caballeros', desc: 'Traje oscuro o smoking con corbata o moño. Sombrero fedora o bombín. Chaleco y pañuelo de bolsillo.' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="rounded-xl p-5 text-left"
                    style={{ background: 'rgba(120,53,15,0.08)', border: '1px solid rgba(217,119,6,0.1)' }}
                  >
                    <p className="text-amber-300 font-semibold mb-2 text-sm">{icon} {title}</p>
                    <p className="text-amber-600/70 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ PHOTO GALLERY ═════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 relative"
        style={{ background: 'linear-gradient(180deg, #000 0%, rgba(120,53,15,0.08) 50%, #000 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="text-center mb-16">
            <SectionLabel>Galería</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-4">Recuerdos con Zandra</h2>
            <p className="text-amber-600/60 text-sm max-w-md mx-auto">
              Sube tus fotos favoritas con la festejada. El día del evento se proyectarán en pantalla grande. 🎉
            </p>
            <Divider className="max-w-xs mx-auto mt-8" />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.9 }} viewport={{ once: true }}>
            <PhotoGallery />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} viewport={{ once: true }} className="mt-14 text-center">
            <a href="?slideshow=1" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold text-black tracking-widest uppercase transition-all hover:scale-105 shadow-lg shadow-amber-900/30"
              style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}
            >
              <Camera className="w-4 h-4" /> Modo Pantalla Grande
            </a>
            <p className="text-amber-800 text-xs mt-2">Abre en la pantalla del evento para el slideshow</p>
          </motion.div>
        </div>
      </section>

      {/* ══ RSVP ══════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-black">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }}>
            <div className="text-center mb-12">
              <SectionLabel>Confirmación</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-6">Confirma tu Asistencia</h2>
              <Divider className="max-w-xs mx-auto" />
            </div>

            <div className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(120,53,15,0.12), rgba(0,0,0,0.9))', border: '1px solid rgba(217,119,6,0.15)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
              <RSVPForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="relative py-14 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #000, rgba(120,53,15,0.08), #000)', borderTop: '1px solid rgba(217,119,6,0.1)' }}
      >
        <Divider className="max-w-xs mx-auto mb-8" />
        <p className="font-serif text-xl font-bold mb-1"
          style={{
            background: 'linear-gradient(90deg, #d97706, #fbbf24, #fde68a, #fbbf24, #d97706)',
            backgroundSize: '200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 4s linear infinite',
          }}
        >
          Zandra Veliz · 60 Años
        </p>
        <p className="text-amber-700/60 text-xs tracking-[0.35em] uppercase mt-1">5 de Septiembre · 2026 · Club Español · Fuentecilla, Guatemala</p>
        <p className="text-amber-900/50 text-xs mt-4">Una noche de elegancia, amistad y nostalgia · The Great Gatsby Experience</p>
      </footer>
    </div>
  )
}
