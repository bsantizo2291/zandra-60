import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Calendar, MapPin, Heart } from 'lucide-react'
import { Toaster, toast } from 'sonner'

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/duo4dukq4/image/upload'
const UPLOAD_PRESET = 'duo4dukq4'

export default function App() {
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [countdown, setCountdown] = useState({})

  // Calcula la cuenta regresiva
  useEffect(() => {
    const calculateCountdown = () => {
      const eventDate = new Date('2026-09-05T19:00:00').getTime()
      const now = new Date().getTime()
      const distance = eventDate - now

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  // Maneja la carga de fotos
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET)

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          setPhotos(prev => [...prev, {
            id: data.public_id,
            url: data.secure_url,
            thumb: data.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fill/')
          }])
          toast.success('¡Foto subida exitosamente!')
        }
      } catch (error) {
        console.error('Error uploading photo:', error)
        toast.error('Error al subir la foto')
      }
    }

    setUploading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Toaster position="top-center" />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center bg-gradient-to-b from-black via-amber-900/20 to-black"
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <h1 className="text-7xl md:text-8xl font-black text-amber-300 mb-4 font-serif drop-shadow-lg">
              ZANDRA
            </h1>
          </motion.div>

          <p className="text-3xl md:text-4xl text-amber-100 font-light mb-4 font-serif">
            Celebrando 60 Años
          </p>

          <div className="text-amber-200 text-lg mb-12 font-light">
            <p>Una noche de elegancia y nostalgia</p>
            <p className="text-amber-300 font-serif text-2xl mt-2">Great Gatsby</p>
          </div>

          {/* Countdown */}
          <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12 max-w-2xl mx-auto">
            {[
              { value: countdown.days || 0, label: 'Días' },
              { value: countdown.hours || 0, label: 'Horas' },
              { value: countdown.minutes || 0, label: 'Minutos' },
              { value: countdown.seconds || 0, label: 'Segundos' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                className="bg-amber-900/50 backdrop-blur border border-amber-500/30 rounded-lg p-4"
              >
                <div className="text-3xl md:text-4xl font-bold text-amber-300 font-serif">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm text-amber-200 mt-2">{item.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-8 rounded-lg transition-all"
          >
            Confirmar Asistencia
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Event Details */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 bg-black border-t border-amber-500/30"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-amber-300 text-center mb-16 font-serif">
            Detalles del Evento
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Date & Time */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-amber-900/30 to-black border border-amber-500/30 rounded-lg p-8"
            >
              <Calendar className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-2xl font-bold text-amber-300 mb-2 font-serif">Fecha y Hora</h3>
              <p className="text-amber-100">5 de Septiembre, 2026</p>
              <p className="text-amber-100 text-lg font-bold">7:00 p.m.</p>
            </motion.div>

            {/* Location */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-amber-900/30 to-black border border-amber-500/30 rounded-lg p-8"
            >
              <MapPin className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-2xl font-bold text-amber-300 mb-2 font-serif">Ubicación</h3>
              <p className="text-amber-100">El Club Español</p>
              <p className="text-amber-100">Ciudad de Guatemala</p>
            </motion.div>
          </div>

          {/* Dress Code */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-8 bg-gradient-to-r from-amber-900/40 to-amber-800/40 border border-amber-500/30 rounded-lg p-8 text-center"
          >
            <Heart className="w-8 h-8 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-amber-300 mb-2 font-serif">Código de Vestimenta</h3>
            <p className="text-amber-100 text-lg">Elegancia Great Gatsby</p>
            <p className="text-amber-200 text-sm mt-2">Trajes, vestidos y accesorios de los años 20</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Photo Gallery */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 bg-black border-t border-amber-500/30"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-amber-300 text-center mb-16 font-serif">
            Galería de Recuerdos
          </h2>

          {/* Upload Area */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mb-12 bg-gradient-to-br from-amber-900/30 to-black border-2 border-dashed border-amber-500/50 rounded-lg p-12 text-center cursor-pointer hover:border-amber-400 transition-all"
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer block">
              <Upload className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <p className="text-xl text-amber-300 font-semibold mb-2">
                {uploading ? 'Subiendo fotos...' : 'Sube tus fotos favoritas'}
              </p>
              <p className="text-amber-200 text-sm">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
            </label>
          </motion.div>

          {/* Photos Grid */}
          {photos.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {photos.map((photo, idx) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative overflow-hidden rounded-lg border border-amber-500/30 aspect-square"
                >
                  <img
                    src={photo.thumb}
                    alt="Uploaded memory"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-amber-300 text-sm">Recuerdo compartido</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {photos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-amber-200 text-lg">
                Aún no hay fotos. ¡Sé el primero en compartir un recuerdo!
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Contact Info */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 bg-gradient-to-b from-black to-amber-900/20 border-t border-amber-500/30"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-amber-300 mb-8 font-serif">Confirma tu Asistencia</h2>
          <p className="text-amber-100 mb-8 text-lg">
            Para confirmar tu asistencia, contacta a:
          </p>
          <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-8">
            <p className="text-2xl font-bold text-amber-300 mb-2">Sergio J. Santizo</p>
            <p className="text-amber-200 mb-4">Coordinador del Evento</p>
            <p className="text-amber-100">
              Responde a esta invitación o contacta directamente
            </p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black border-t border-amber-500/30 py-8 px-4 text-center">
        <p className="text-amber-200 text-sm">
          Una celebración de elegancia, amistad y nostalgia
        </p>
        <p className="text-amber-300 font-serif text-lg mt-2">
          The Great Gatsby Experience
        </p>
      </footer>
    </div>
  )
}
