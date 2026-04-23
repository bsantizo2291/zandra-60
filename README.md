# 🥂 Zandra 60 — App de Celebración Gatsby

Aplicación web completa para la celebración de los 60 años de Zandra B. Veliz Ortiz.

---

## ✅ Lo Que Funciona Ahora

- ✅ Invitación digital con tema Gatsby
- ✅ Formulario RSVP conectado a Supabase
- ✅ Sistema de uploads de fotos/videos a Cloudinary
- ✅ Panel de administración con datos reales
- ✅ Enlaces únicos por invitado
- ✅ Validación de videos (máx. 60 segundos)

---

## 📦 Estructura de Archivos

```
zandra-60/
├── index.html          # Página principal
├── package.json        # Dependencias
├── vite.config.js      # Configuración de Vite
├── src/
│   ├── main.jsx        # Entry point de React
│   └── App.jsx         # Aplicación completa
```

---

## 🚀 Desplegar en Vercel (GRATIS)

### Paso 1: Crear cuenta en Vercel

1. Ve a **vercel.com**
2. Click **Sign Up** → Usa tu cuenta de GitHub
3. Click **Add New** → **Project**

### Paso 2: Preparar los archivos

1. Crea una carpeta nueva llamada `zandra-60`
2. Dentro, crea una carpeta `src`
3. Coloca los archivos así:

```
zandra-60/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   └── App.jsx
```

### Paso 3: Subir a GitHub

1. Ve a **github.com** → **New repository**
2. Nombre: `zandra-60`
3. Click **Create repository**
4. Sigue las instrucciones para subir tu carpeta

**O usa GitHub Desktop** (más fácil):
- Descarga GitHub Desktop
- File → Add Local Repository → selecciona tu carpeta
- Publish repository

### Paso 4: Conectar con Vercel

1. En Vercel, click **Import Git Repository**
2. Selecciona `zandra-60` de tu lista
3. Framework Preset: **Vite**
4. Click **Deploy**

¡Listo! Tu app estará en: `https://zandra-60.vercel.app`

---

## 🔐 Panel de Administración

**URL:** `https://tu-app.vercel.app` → Click "Admin"
**Contraseña:** `gatsby2026`

Desde aquí puedes:
- ✅ Ver todos los RSVPs en tiempo real
- ✅ Ver cuántas personas confirmaron
- ✅ Descargar lista completa en CSV
- ✅ Ver todos los archivos subidos
- ✅ Descargar fotos y videos

---

## 📧 Cómo Funciona el Flujo

1. **Invitado confirma asistencia** → Datos se guardan en Supabase
2. **Recibe enlace único** → `https://tu-app.vercel.app?upload=TOKEN`
3. **Sube foto o video** → Se guarda en Cloudinary
4. **Tú descargas todo** antes del evento desde el panel de admin
5. **Compilas el video** con CapCut o DaVinci Resolve
6. **Lo proyectas** en la fiesta 🎉

---

## 🎬 Compilar el Video Final

Antes del evento:

1. Ve al panel de admin
2. Descarga todos los archivos
3. Abre **CapCut** (gratis, fácil) o **DaVinci Resolve**
4. Importa todas las fotos y videos
5. Agrégales:
   - Música de fondo
   - Transiciones Gatsby
   - Títulos dorados
6. Exporta en HD
7. Lleva en USB al evento

---

## 💰 Costos Totales

| Servicio | Costo |
|---|---|
| Supabase | $0 |
| Cloudinary | $0 |
| Vercel | $0 |
| Dominio personalizado (opcional) | ~$12/año |
| **TOTAL** | **$0 - $12** |

---

## 🆘 Troubleshooting

**"Los RSVPs no se guardan"**
→ Verifica que las tablas estén creadas en Supabase (SQL Editor)

**"No puedo subir archivos"**
→ Verifica que el upload preset `zandra60_unsigned` esté creado en Cloudinary

**"El video es muy largo"**
→ La app lo rechaza automáticamente si excede 60 segundos

**"¿Cómo cambio la contraseña del admin?"**
→ En `App.jsx`, busca `gatsby2026` y cámbialo

---

## 📱 Para Compartir con Invitados

Envía este mensaje:

```
🥂 ¡Estás invitado a celebrar los 60 años de Zandra!

📅 Sábado, 5 de Septiembre, 2026
🕖 19:00 - 24:00 hrs
📍 El Club Español, Guatemala

👗 Código de vestimenta: Etiqueta Rigurosa & Glamour Gatsby

Confirma tu asistencia aquí:
https://tu-app.vercel.app

¡Te esperamos! 💛
```

---

## ✨ Características Especiales

- ⚡ App ultra rápida (React + Vite)
- 🎨 Diseño 100% Gatsby años 20
- 📱 Funciona perfecto en celular
- 🔒 Datos seguros en Supabase
- ☁️ Archivos ilimitados en Cloudinary
- 📊 Dashboard en tiempo real
- 🎬 Validación automática de videos

---

**¿Preguntas? Cualquier cosa que necesites ajustar, aquí estoy.** 🚀
