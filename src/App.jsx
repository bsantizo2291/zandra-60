import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Calendar, MapPin, Clock, Camera, Star, ChevronDown } from 'lucide-react'
import { Toaster, toast } from 'sonner'

// ─── Cloudinary Config ────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD = 'duo4dukq4'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`
const CLOUDINARY_FETCH_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload`
const UPLOAD_PRESET = 'zandra60'
const GALLERY_TAG = 'zandra60party'

// ─── Champagne Bubbles & Drops ────────────────────────────────────────────────
function ChampagneBubbles() {
  const [bubbles, setBubbles] = useState([])
  const [drops, setDrops] = useState([])

  useEffect(() => {
    const createBubble = () => {
      const id = Math.random().toString(36).slice(2)
      const size = Math.random() * 18 + 5
      const left = Math.random() * 100
      const duration = Math.random() * 5 + 4
      const drift = (Math.random() - 0.5) * 80
      setBubbles(prev => [...prev.slice(-50), { id, size, left, duration, drift }])
      setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== id)), duration * 1000)
    }

    const createDrop = () => {
      const id = Math.random().toString(36).slice(2)
      const left = Math.random() * 100
      const duration = Math.random() * 2 + 1.2
      const w = Math.random() * 3 + 1.5
      const h = w * 3
      setDrops(prev => [...prev.slice(-35), { id, left, duration, w, h }])
      setTimeout(() => setDrops(prev => prev.filter(d => d.id !== id)), duration * 1000)
    }

    const bi = setInterval(createBubble, 180)
    const di = setInterval(createDrop, 100)
    return () => { clearInterval(bi); clearInterval(di) }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
      {bubbles.map(b => (
        <div
          key={b.id}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: 0,
            '--drift': `${b.drift}px`,
            animationName: 'bubble-rise',
            animationDuration: `${b.duration}s`,
            animationTimingFunction: 'ease-out',
            animationFillMode: 'forwards',
          }}
        />
      ))}
      {drops.map(d => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.left}%`,
            top: 0,
            width: d.w,
            height: d.h,
            borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
            background: 'linear-gradient(180deg, rgba(251,191,36,0.85), rgba(217,119,6,0.35))',
            pointerEvents: 'none',
            animationName: 'champagne-drop',
            animationDuration: `${d.duration}s`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
          }}
        />
      ))}
    </div>
  )
}

// ─── Art Deco Ornament ────────────────────────────────────────────────────────
function ArtDecoOrnament({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-600 to-amber-300" />
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <polygon points="15,1 17,12 28,15 17,18 15,29 13,18 2,15 13,12" fill="#d97706" />
        <polygon points="15,5 16.5,12 23,15 16.5,18 15,25 13.5,18 7,15 13.5,12" fill="#fbbf24" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-600 to-amber-300" />
    </div>
  )
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const target = new Date('2026-09-05T19:00:00').getTime()
      const diff = target - Date.now()
      if (diff > 0) {
        setTime({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        })
      }
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { label: 'Días', value: time.days },
    { label: 'Horas', value: time.hours },
    { label: 'Minutos', value: time.minutes },
    { label: 'Segundos', value: time.seconds },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {units.map(({ label, value }) => (
        <motion.div
          key={label}
          className="countdown-box glass-card rounded-2xl px-5 py-5 text-center min-w-[80px]"
          whileHover={{ scale: 1.08 }}
        >
          <motion.div
            key={value}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-4xl md:text-5xl font-black text-amber-300 font-serif"
          >
            {String(value).padStart(2, '0')}
          </motion.div>
          <div className="text-amber-500 text-xs uppercase tracking-widest mt-1">{label}</div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Photo Gallery with Cloudinary ───────────────────────────────────────────
function PhotoGallery() {
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploaderName, setUploaderName] = useState('')
  const [lightbox, setLightbox] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(
          `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/list/${GALLERY_TAG}.json`
        )
        if (res.ok) {
          const data = await res.json()
          const loaded = (data.resources || []).map(r => ({
            id: r.public_id,
            url: `${CLOUDINARY_FETCH_URL}/w_900,h_900,c_fill,q_auto/${r.public_id}`,
            thumb: `${CLOUDINARY_FETCH_URL}/w_350,h_350,c_fill,q_auto/${r.public_id}`,
          }))
          setPhotos(loaded)
        }
      } catch (_) {}
    }
    fetchPhotos()
  }, [])

  const uploadFiles = useCallback(async (files) => {
    if (!files.length) return
    setUploading(true)
    let ok = 0
    for (const file of files) {
      try {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('upload_preset', UPLOAD_PRESET)
        fd.append('tags', GALLERY_TAG)
        if (uploaderName.trim()) fd.append('context', `caption=${uploaderName.trim()}`)
        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd })
        if (res.ok) {
          const d = await res.json()
          setPhotos(prev => [{
            id: d.public_id,
            url: `${CLOUDINARY_FETCH_URL}/w_900,h_900,c_fill,q_auto/${d.public_id}`,
            thumb: `${CLOUDINARY_FETCH_URL}/w_350,h_350,c_fill,q_auto/${d.public_id}`,
          }, ...prev])
          ok++
        }
      } catch (e) { console.error(e) }
    }
    setUploading(false)
    if (ok > 0) toast.success(`¡${ok} foto${ok > 1 ? 's' : ''} compartida${ok > 1 ? 's' : ''}! 🥂`)
    else toast.error('Error al subir. Intenta de nuevo.')
  }, [uploaderName])

  const handleChange = (e) => uploadFiles(Array.from(e.target.files))
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    uploadFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')))
  }

  const rotations = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3]

  return (
    <div>
      <div className="mb-6 max-w-sm mx-auto">
        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={uploaderName}
          onChange={e => setUploaderName(e.target.value)}
          className="w-full bg-black/50 border border-amber-500/40 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-400 text-center"
        />
      </div>

      <motion.div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        className={`mb-10 border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-amber-400 bg-amber-900/30'
            : 'border-amber-600/50 bg-amber-900/10 hover:border-amber-400 hover:bg-amber-900/20'
        }`}
      >
        <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleChange} disabled={uploading} className="hidden" />
        <Camera className="w-14 h-14 text-amber-400 mx-auto mb-4" />
        <p className="text-xl text-amber-300 font-semibold font-serif mb-2">
          {uploading ? '✨ Subiendo tus fotos...' : 'Comparte un recuerdo con Zandra'}
        </p>
        <p className="text-amber-500 text-sm">Arrastra aquí o toca para seleccionar</p>
        <p className="text-amber-700 text-xs mt-2">JPG · PNG · HEIC · Múltiples fotos permitidas</p>
      </motion.div>

      {photos.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
        >
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(idx * 0.04, 0.5), type: 'spring' }}
              whileHover={{ scale: 1.04, rotate: rotations[idx % rotations.length], zIndex: 10 }}
              onClick={() => setLightbox(photo)}
              className="break-inside-avoid cursor-pointer relative overflow-hidden rounded-xl border-2 border-amber-500/20 shadow-lg hover:border-amber-400 hover:shadow-amber-500/30 transition-all"
            >
              <img src={photo.thumb} alt="Recuerdo" className="w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                <Star className="w-4 h-4 text-amber-400" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <p className="text-amber-600 text-lg">¡Sé el primero en compartir un recuerdo! 📸</p>
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-black/92 flex items-center justify-center p-4"
            style={{ zIndex: 10000 }}
          >
            <motion.img
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              src={lightbox.url}
              alt="Recuerdo"
              className="max-w-full max-h-[90vh] rounded-2xl border-2 border-amber-500/50 shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Slideshow Mode (for party screen) ───────────────────────────────────────
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
          <motion.img
            key={current}
            src={photos[current]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-amber-400 text-3xl font-serif text-center px-8">
              Esperando fotos de los invitados... 🥂<br />
              <span className="text-lg text-amber-600 mt-4 block">Escanea el código QR para subir fotos</span>
            </p>
          </div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
        <p className="text-amber-300 font-serif text-4xl glow-text mb-2">Celebración 60 Años · Zandra Veliz</p>
        <p className="text-amber-500 text-lg tracking-widest uppercase">5 de Septiembre · 2026 · Fuentecilla</p>
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

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const params = new URLSearchParams(window.location.search)
  if (params.get('slideshow') === '1') return <Slideshow />

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Toaster position="top-center" richColors />
      <ChampagneBubbles />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center diamond-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-800/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.4em' }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-amber-500 text-xs md:text-sm uppercase tracking-[0.4em] mb-8"
          >
            ✦ &nbsp; Con mucho amor te invita a celebrar &nbsp; ✦
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, type: 'spring', stiffness: 80 }}
            className="shimmer-text font-serif font-black leading-none mb-1"
            style={{ fontSize: 'clamp(4.5rem, 18vw, 11rem)' }}
          >
            ZANDRA
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-amber-200 font-serif font-bold tracking-[0.5em] mb-6"
            style={{ fontSize: 'clamp(1rem, 3.5vw, 2.2rem)' }}
          >
            V E L I Z
          </motion.h2>

          <ArtDecoOrnament className="mb-8" />

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1, duration: 0.9, type: 'spring' }}
            className="inline-flex items-center justify-center w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-amber-400 bg-black/70 mb-8 relative"
          >
            <div className="absolute inset-3 rounded-full border border-amber-600/40" />
            <div className="absolute inset-6 rounded-full border border-amber-700/20" />
            <div className="text-center">
              <div className="shimmer-text font-serif font-black" style={{ fontSize: '4rem', lineHeight: 1 }}>60</div>
              <div className="text-amber-400 text-xs tracking-[0.3em] uppercase mt-1">Años</div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-amber-200 text-base md:text-xl font-light tracking-wide mb-8 max-w-xl mx-auto"
          >
            Una noche de elegancia, glamour y celebración al estilo de los años dorados
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="glass-card rounded-2xl px-8 py-5 inline-block max-w-lg"
          >
            <p className="text-amber-300 font-serif italic text-lg md:text-xl glow-text">
              "So we beat on, boats against the current,<br />borne back ceaselessly into the past."
            </p>
            <p className="text-amber-600 text-xs mt-2 tracking-widest">— F. SCOTT FITZGERALD · THE GREAT GATSBY</p>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-60"
        >
          <ChevronDown className="w-8 h-8 text-amber-500" />
        </motion.div>
      </section>

      {/* ══ COUNTDOWN ═════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-amber-950/20 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-500 uppercase tracking-[0.3em] text-xs mb-3">⏳ Cuenta Regresiva</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-300 mb-12">
              La Gran Noche se Acerca
            </h2>
            <CountdownTimer />
          </motion.div>
        </div>
      </section>

      {/* ══ EVENT DETAILS ═════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 diamond-bg relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/85 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-500 uppercase tracking-[0.3em] text-xs mb-3">✦ Detalles del Evento ✦</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-300">La Invitación</h2>
            <ArtDecoOrnament className="mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Calendar, title: 'Fecha', lines: ['Sábado', '5 de Septiembre', '2026'] },
              { icon: Clock, title: 'Horario', lines: ['19:00 — 24:00', 'Cinco horas de', 'pura celebración'] },
              { icon: MapPin, title: 'Lugar', lines: ['Área Fuentecilla', 'Guatemala', '🇬🇹'] },
            ].map(({ icon: Icon, title, lines }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.04, y: -6 }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-amber-400 uppercase tracking-widest text-xs mb-4">{title}</h3>
                {lines.map((l, j) => (
                  <p key={j} className={j === 0 ? 'text-amber-200 font-serif text-xl font-bold' : 'text-amber-400 text-sm mt-1'}>{l}</p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DRESS CODE ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-500 uppercase tracking-[0.3em] text-xs mb-3">✦ Vestimenta ✦</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-300 mb-8">
              Código de Vestimenta
            </h2>
            <ArtDecoOrnament className="mb-10" />

            <motion.div whileHover={{ scale: 1.01 }} className="glass-card rounded-2xl p-10">
              <p className="text-amber-200 text-xl font-serif italic mb-2">
                "Viste con el esplendor de los años dorados"
              </p>
              <p className="text-amber-500 text-sm tracking-widest mb-8">COLORES GATSBY</p>

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
                    <div className="w-12 h-12 rounded-full border-2 border-amber-500/40 shadow-lg shadow-black/50" style={{ background: color }} />
                    <span className="text-amber-400 text-xs">{name}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-amber-900/20 rounded-xl p-5 border border-amber-700/20">
                  <p className="text-amber-300 font-semibold mb-2">👗 Damas</p>
                  <p className="text-amber-200 text-sm leading-relaxed">Vestidos largos o cóctel con flecos, lentejuelas o plumas. Guantes, tocados, diademas y accesorios de los años 20.</p>
                </div>
                <div className="bg-amber-900/20 rounded-xl p-5 border border-amber-700/20">
                  <p className="text-amber-300 font-semibold mb-2">🤵 Caballeros</p>
                  <p className="text-amber-200 text-sm leading-relaxed">Traje oscuro o smoking con corbata o moño. Sombrero fedora o bombín. Chaleco y pañuelo de bolsillo.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ PHOTO GALLERY ═════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-amber-950/10 to-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-500 uppercase tracking-[0.3em] text-xs mb-3">✦ Galería ✦</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-300 mb-4">
              Recuerdos con Zandra
            </h2>
            <p className="text-amber-400 text-base max-w-xl mx-auto">
              Sube tus fotos favoritas con la festejada. El día del evento se proyectarán en pantalla grande durante la fiesta. 🎉
            </p>
            <ArtDecoOrnament className="mt-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <PhotoGallery />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <a
              href="?slideshow=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold px-8 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-amber-900/40"
            >
              <Camera className="w-5 h-5" />
              Modo Pantalla Grande — Fiesta
            </a>
            <p className="text-amber-700 text-xs mt-2">Abre este enlace en la pantalla del evento para el slideshow</p>
          </motion.div>
        </div>
      </section>

      {/* ══ RSVP ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-500 uppercase tracking-[0.3em] text-xs mb-3">✦ Confirmación ✦</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-300 mb-8">
              Confirma tu Asistencia
            </h2>
            <ArtDecoOrnament className="mb-10" />

            <motion.div whileHover={{ scale: 1.02 }} className="glass-card rounded-2xl p-10">
              <p className="text-amber-200 text-lg mb-6">Para confirmar tu asistencia, contacta a:</p>
              <p className="text-3xl font-serif font-bold text-amber-300 mb-1">Brayan Santizo</p>
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-5">Organizador del Evento</p>
              <a
                href="tel:+12015987303"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-xl font-semibold transition-colors"
              >
                📞 +1 (201) 598-7303
              </a>
              <div className="border-t border-amber-800/40 mt-8 pt-6">
                <p className="text-amber-500 text-sm italic">
                  "Te esperamos para celebrar juntos esta noche mágica"
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="relative bg-black border-t border-amber-800/30 py-12 px-4 text-center diamond-bg overflow-hidden">
        <div className="absolute inset-0 bg-black/90 pointer-events-none" />
        <div className="relative z-10">
          <ArtDecoOrnament className="max-w-sm mx-auto mb-6" />
          <p className="shimmer-text font-serif text-2xl font-bold mb-2">Zandra Veliz · 60 Años</p>
          <p className="text-amber-600 text-sm tracking-widest uppercase">5 de Septiembre · 2026 · Fuentecilla, Guatemala</p>
          <p className="text-amber-800 text-xs mt-4">Una noche de elegancia, amistad y nostalgia · The Great Gatsby Experience</p>
        </div>
      </footer>
    </div>
  )
}
