import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Calendar, MapPin, Clock, Camera, Star, ChevronDown, Trash2, Lock, LogOut, RefreshCw } from 'lucide-react'
import { Toaster, toast } from 'sonner'

// ─── Cloudinary Config ────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD = 'duo4dukq4'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`
const CLOUDINARY_FETCH_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload`
const UPLOAD_PRESET = 'zandra60'
const GALLERY_TAG = 'zandra60party'

// ─── Client-side image compression ───────────────────────────────────────────
// Compresses any image to JPEG under 8MB before uploading to Cloudinary
// Handles JPG, PNG, HEIC, WebP, and any other format the browser can decode
async function compressImage(file, maxSizeMB = 8, maxDimension = 2400) {
  return new Promise((resolve) => {
    // If already small enough, skip compression
    if (file.size <= maxSizeMB * 1024 * 1024 && file.type === 'image/jpeg') {
      resolve(file)
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img

      // Scale down if too large
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      // Try progressively lower quality until under maxSizeMB
      const tryQuality = (quality) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.3) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
            } else {
              tryQuality(quality - 0.1)
            }
          },
          'image/jpeg',
          quality
        )
      }
      tryQuality(0.85)
    }

    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

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
      setBubbles(prev => [...prev.slice(-30), { id, size, left, duration, drift }])
      setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== id)), duration * 1000)
    }

    const createDrop = () => {
      const id = Math.random().toString(36).slice(2)
      const left = Math.random() * 100
      const duration = Math.random() * 2 + 1.2
      const w = Math.random() * 3 + 1.5
      const h = w * 3
      setDrops(prev => [...prev.slice(-20), { id, left, duration, w, h }])
      setTimeout(() => setDrops(prev => prev.filter(d => d.id !== id)), duration * 1000)
    }

    const bi = setInterval(createBubble, 400)
    const di = setInterval(createDrop, 250)
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
  const [uploadProgress, setUploadProgress] = useState('')
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

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        // Show compression progress
        setUploadProgress(`Preparando foto ${i + 1} de ${files.length}...`)

        // Compress image client-side before uploading
        const compressed = await compressImage(file)

        setUploadProgress(`Subiendo foto ${i + 1} de ${files.length}...`)

        const fd = new FormData()
        fd.append('file', compressed)
        fd.append('upload_preset', UPLOAD_PRESET)
        fd.append('tags', GALLERY_TAG)
        if (uploaderName.trim()) fd.append('context', `caption=${uploaderName.trim()}`)

        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd })
        const d = await res.json()

        if (!res.ok || d.error) {
          console.error('Cloudinary error:', d.error?.message)
          toast.error(`Error: ${d.error?.message || 'No se pudo subir la foto'}`)
          continue
        }

        // Generate a guest token valid for 10 minutes so they can delete their own photo
        const guestToken = btoa(`${d.public_id}|${Date.now()}`)
        setPhotos(prev => [{
          id: d.public_id,
          url: `${CLOUDINARY_FETCH_URL}/w_900,h_900,c_fill,q_auto/${d.public_id}`,
          thumb: `${CLOUDINARY_FETCH_URL}/w_350,h_350,c_fill,q_auto/${d.public_id}`,
          guestToken,
          uploadedAt: Date.now(),
        }, ...prev])
        ok++
      } catch (e) {
        console.error('Upload error:', e)
        toast.error('Error de conexión. Intenta de nuevo.')
      }
    }

    setUploading(false)
    setUploadProgress('')
    if (ok > 0) toast.success(`¡${ok} foto${ok > 1 ? 's' : ''} compartida${ok > 1 ? 's' : ''}! 🥂`)
    else if (ok === 0) toast.error('No se pudo subir ninguna foto. Intenta de nuevo.')
  }, [uploaderName])

  const handleChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length) uploadFiles(files)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    uploadFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')))
  }

  const rotations = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3]

  const handleGuestDelete = async (photo, e) => {
    e.stopPropagation()
    if (!window.confirm('¿Eliminar esta foto?')) return
    try {
      const res = await fetch('/api/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: photo.id, guestToken: photo.guestToken }),
      })
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== photo.id))
        toast.success('Foto eliminada ✓')
      } else {
        toast.error('No se pudo eliminar. El tiempo límite puede haber expirado.')
      }
    } catch {
      toast.error('Error de conexión.')
    }
  }

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
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />
        <Camera className="w-14 h-14 text-amber-400 mx-auto mb-4" />
        <p className="text-xl text-amber-300 font-semibold font-serif mb-2">
          {uploading ? `✨ ${uploadProgress || 'Procesando...'}` : 'Comparte un recuerdo con Zandra'}
        </p>
        {uploading ? (
          <div className="mt-3">
            <div className="w-48 h-1.5 bg-amber-900/50 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        ) : (
          <>
            <p className="text-amber-500 text-sm">Arrastra aquí o toca para seleccionar</p>
            <p className="text-amber-700 text-xs mt-2">JPG · PNG · HEIC · WebP · Cualquier tamaño · Múltiples fotos</p>
          </>
        )}
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
              className="break-inside-avoid cursor-pointer relative overflow-hidden rounded-xl border-2 border-amber-500/20 shadow-lg hover:border-amber-400 hover:shadow-amber-500/30 transition-all group"
            >
              <img src={photo.thumb} alt="Recuerdo" className="w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                <Star className="w-4 h-4 text-amber-400" />
                {photo.guestToken && (Date.now() - photo.uploadedAt) < 600000 && (
                  <button
                    onClick={(e) => handleGuestDelete(photo, e)}
                    className="bg-red-900/80 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors"
                    title="Eliminar mi foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        !uploading && (
          <div className="text-center py-16">
            <p className="text-amber-600 text-lg">¡Sé el primero en compartir un recuerdo! 📸</p>
          </div>
        )
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
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-amber-400 hover:text-amber-200 text-3xl leading-none"
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Admin Panel ─────────────────────────────────────────────────────────────
function AdminPanel() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const login = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/list-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: password }),
      })
      if (res.ok) {
        const data = await res.json()
        setPhotos(data.resources || [])
        setAuthed(true)
      } else {
        toast.error('Contraseña incorrecta')
      }
    } catch {
      toast.error('Error de conexión')
    }
    setLoading(false)
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/list-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: password }),
      })
      if (res.ok) {
        const data = await res.json()
        setPhotos(data.resources || [])
        toast.success(`${data.resources?.length || 0} fotos cargadas`)
      }
    } catch { toast.error('Error al actualizar') }
    setLoading(false)
  }

  const deletePhoto = async (publicId) => {
    if (!window.confirm('¿Eliminar esta foto permanentemente?')) return
    setDeleting(publicId)
    try {
      const res = await fetch('/api/delete-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, adminPassword: password }),
      })
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.public_id !== publicId))
        toast.success('Foto eliminada ✓')
      } else {
        toast.error('Error al eliminar')
      }
    } catch { toast.error('Error de conexión') }
    setDeleting(null)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Toaster position="top-center" richColors />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-10 w-full max-w-sm text-center"
        >
          <Lock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-amber-300 font-serif text-2xl font-bold mb-2">Panel de Admin</h1>
          <p className="text-amber-600 text-sm mb-8">Zandra 60 · Gestión de Fotos</p>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña" required
              className="w-full bg-black/50 border border-amber-500/40 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-400 text-center"
            />
            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? 'Entrando...' : '✦ Entrar ✦'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-center" richColors />
      <div className="sticky top-0 z-50 bg-black/95 border-b border-amber-800/30 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-amber-300 font-serif text-xl font-bold">Panel de Admin</h1>
          <p className="text-amber-600 text-xs">{photos.length} fotos subidas</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refresh} disabled={loading} className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm border border-amber-700/40 rounded-full px-3 py-1.5 transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualizar
          </button>
          <button onClick={() => { setAuthed(false); setPassword(''); setPhotos([]) }} className="flex items-center gap-1.5 text-amber-600 hover:text-amber-400 text-sm border border-amber-800/40 rounded-full px-3 py-1.5 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto">
        {photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-amber-600 text-lg">No hay fotos aún 📸</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
            {photos.map(photo => (
              <motion.div
                key={photo.public_id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: deleting === photo.public_id ? 0.3 : 1, scale: 1 }}
                className="relative group rounded-xl overflow-hidden border border-amber-800/30 aspect-square"
              >
                <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <p className="text-amber-400 text-xs text-center truncate w-full px-1">{photo.public_id.split('/').pop()}</p>
                  <p className="text-amber-600 text-xs">{photo.created_at ? new Date(photo.created_at).toLocaleDateString('es-GT') : ''}</p>
                  <button
                    onClick={() => deletePhoto(photo.public_id)}
                    disabled={deleting === photo.public_id}
                    className="flex items-center gap-1 bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                  >
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
        <p className="text-amber-500 text-lg tracking-widest uppercase">5 de Septiembre · 2026 · Club Español · Fuentecilla</p>
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
    toast.success('¡Confirmación recibida! Te esperamos. 🥂')
  }

  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
        <div className="text-5xl mb-4">🥂</div>
        <p className="text-amber-200 font-serif text-2xl font-bold mb-2">¡Nos vemos el 5 de Septiembre!</p>
        <p className="text-amber-500 text-sm">
          {name}{plusOne && plusOneName ? ` y ${plusOneName}` : plusOne ? ' y acompañante' : ''} — confirmado{plusOne ? 's' : ''}
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div>
        <label className="block text-amber-500 text-xs uppercase tracking-widest mb-2">Tu nombre completo</label>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Nombre y apellido" required
          className="w-full bg-black/50 border border-amber-500/40 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => setPlusOne(p => !p)}
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
            <label className="block text-amber-500 text-xs uppercase tracking-widest mb-2">Nombre de tu acompañante</label>
            <input
              type="text" value={plusOneName} onChange={e => setPlusOneName(e.target.value)}
              placeholder="Nombre y apellido"
              className="w-full bg-black/50 border border-amber-500/40 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-700 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <span className="inline-block border border-amber-700/30 rounded-full px-4 py-1 text-amber-600 text-xs tracking-wide">
          {plusOne ? '2 personas confirmadas' : '1 persona confirmada'}
        </span>
      </div>

      <motion.button
        type="submit" disabled={submitting}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50 tracking-widest text-sm uppercase"
      >
        {submitting ? 'Confirmando...' : '✦ Confirmar Asistencia ✦'}
      </motion.button>

      <div className="pt-4 border-t border-amber-800/40 text-center">
        <p className="text-amber-700 text-xs mb-2">¿Preguntas? Contacta al organizador</p>
        <p className="text-amber-300 font-semibold text-sm">Brayan Santizo</p>
        <a href="tel:+12015987303" className="text-amber-500 hover:text-amber-300 text-sm transition-colors">📞 +1 (201) 598-7303</a>
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
            <p className="text-amber-300 font-serif text-lg md:text-xl glow-text">
              ✦ &nbsp; Una noche de elegancia y celebración &nbsp; ✦
            </p>
            <p className="text-amber-600 text-xs mt-2 tracking-widest">SÁBADO · 5 DE SEPTIEMBRE · 2026</p>
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
              { icon: Calendar, title: 'Fecha', lines: ['Sábado', '5 de Septiembre', '2026'], url: null },
              { icon: Clock, title: 'Horario', lines: ['19:00 — 24:00', 'Cinco horas de', 'pura celebración'], url: null },
              { icon: MapPin, title: 'Lugar', lines: ['Club Español', 'Calzada Roosevelt Km.13.5', 'Zona 7, Guatemala 🇬🇹'], url: null },
            ].map(({ icon: Icon, title, lines, url }, i) => (
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
                {title === 'Lugar' && (
                  <div className="flex flex-col gap-2 mt-4">
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=14.6341,-90.5831&destination_place_id=ChIJEfSofjigiYURlNTqFywDlXI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-amber-400 hover:text-amber-300 text-xs border border-amber-600/40 hover:border-amber-400 rounded-full px-3 py-1.5 transition-all"
                    >
                      <MapPin className="w-3 h-3" /> Google Maps
                    </a>
                    <a
                      href="https://waze.com/ul?ll=14.6341,-90.5831&navigate=yes&zoom=17"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-amber-400 hover:text-amber-300 text-xs border border-amber-600/40 hover:border-amber-400 rounded-full px-3 py-1.5 transition-all"
                    >
                      <MapPin className="w-3 h-3" /> Waze
                    </a>
                  </div>
                )}
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
        <div className="max-w-md mx-auto text-center">
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
            <motion.div whileHover={{ scale: 1.01 }} className="glass-card rounded-2xl p-10">
              <RSVPForm />
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
          <p className="text-amber-600 text-sm tracking-widest uppercase">5 de Septiembre · 2026 · Club Español · Fuentecilla, Guatemala</p>
          <p className="text-amber-800 text-xs mt-4">Una noche de elegancia, amistad y nostalgia · Estilo Gran Gatsby</p>
        </div>
      </footer>
    </div>
  )
}
