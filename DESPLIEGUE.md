# 🎭 ZANDRA 60 — THEATRICAL MARQUEE

## Invitación Digital Gatsby con Light Bulbs Vintage-Modern

---

## 🚀 DESPLIEGUE RÁPIDO

### Opción 1: Subir a GitHub Existente (RECOMENDADO)

Ya tienes el repositorio `github.com/bsantizo2291/zandra-60` — solo reemplaza los archivos:

1. **Descarga esta carpeta** completa
2. **Ve a GitHub**: https://github.com/bsantizo2291/zandra-60
3. **Borra los archivos viejos** (o guarda una copia en una rama)
4. **Sube estos archivos nuevos** arrastrándolos a GitHub
5. **Commit** los cambios
6. **Vercel desplegará automáticamente** en 2-3 minutos

---

## ✨ LO QUE CAMBIÓ

### NUEVO DISEÑO
- ✅ **Light bulbs parpadeantes** alrededor del marco (vintage marquee)
- ✅ **"NOW SHOWING"** con efecto de neón
- ✅ **Tipografía teatral**: Limelight (Broadway style)
- ✅ **Champagne bubbles animados** en background
- ✅ **Countdown en vivo** con cajas de oro
- ✅ **Ticket stub** estilo boleto de cine
- ✅ **RSVP con Supabase** (confirmaciones automáticas)
- ✅ **5 páginas completas**: Invitación, Detalles, RSVP, Confirmación, Admin

### REMOVIDO
- ❌ Cloudinary photo gallery (reemplazado por RSVP)
- ❌ Tailwind CSS (todo con CSS-in-JS)
- ❌ Framer Motion (animaciones nativas CSS)

---

## 📁 ESTRUCTURA

```
invitacion-zandra-60/
├── src/
│   ├── App.jsx          ← NUEVO diseño teatral
│   ├── main.jsx
│   └── index.css        ← Estilos minimalistas
├── index.html           ← Fonts actualizados
├── package.json         ← Supabase agregado
├── vite.config.js
├── vercel.json
├── .gitignore
└── README.md
```

---

## 🎨 NUEVAS CARACTERÍSTICAS

### 1. Light Bulbs Animados
Bombillas doradas que parpadean alrededor del frame principal (efecto marquee de teatro vintage).

### 2. Countdown en Tiempo Real
Contador regresivo hasta Sept 5, 2026 con cajas doradas brillantes.

### 3. RSVP Integrado con Supabase
- Formulario de confirmación
- Capacidad máxima: 80 personas
- Tracker de cupos disponibles
- Opción de +1 acompañante
- Campo de restricciones dietéticas
- Token personalizado para cada invitado

### 4. Panel de Admin
Contraseña: `gatsby2026`
- Ver todas las confirmaciones
- Lista con nombres, emails, acompañantes
- Exportable a CSV

### 5. Champagne Bubbles
Burbujas animadas que flotan continuamente en el fondo.

---

## 🔧 INSTALACIÓN LOCAL (Opcional)

Si quieres probarlo antes de deploy:

```bash
# 1. Instala dependencias
npm install

# 2. Inicia servidor de desarrollo
npm run dev

# 3. Abre en navegador
http://localhost:3000
```

---

## 📊 SUPABASE (YA CONFIGURADO)

La base de datos ya está lista:
- **URL**: https://ndwheqxeuykmsfbhsvvp.supabase.co
- **Tabla**: `rsvps`
- **Campos**: nombre, email, teléfono, acompañante, nombre_acomp, restricciones_dieteticas, upload_token

No necesitas configurar nada — funciona automáticamente.

---

## 🎯 PÁGINAS DISPONIBLES

### 1. **Invitación** (Landing)
- Hero con nombre "ZANDRA" gigante en oro
- "NOW SHOWING" parpadeante
- Countdown timer en vivo
- Detalles del evento en ticket stub
- CTA "Reservar Asiento"

### 2. **Detalles**
- Información completa del evento
- Mapa de Google Maps integrado
- Código de vestimenta
- 6 cards de inspiración de vestuario con paletas de colores

### 3. **RSVP**
- Formulario de confirmación
- Toggle para +1 acompañante
- Campo de restricciones dietéticas
- Progress bar de cupos disponibles

### 4. **Confirmación**
- Mensaje de éxito
- Enlace personal para subir foto/video
- Recordatorio de fecha/hora

### 5. **Admin**
- Login con contraseña
- Tabla con todas las confirmaciones
- Estadísticas (confirmados, total personas, cupos libres)

---

## 🎨 PALETA DE COLORES

```css
Negro profundo:    #0a0908
Negro rico:        #1a1612
Oro puro:          #d4af37
Oro claro:         #f4e4c1
Champagne:         #f7e7ce
Oro vintage:       #fff8d0
Bronce:            #b8860b
```

---

## 🔤 TIPOGRAFÍA

- **Limelight**: Nombre, números grandes (Broadway vintage)
- **Cinzel**: Labels, navigation (elegante serif)
- **Cormorant Garamond**: Body text, descripciones

---

## ⚙️ COMANDOS

```bash
npm run dev      # Desarrollo local
npm run build    # Build para producción
npm run preview  # Preview del build
```

---

## 🌐 DEPLOY EN VERCEL

### Ya Conectado
Tu repo ya está conectado a Vercel:
- **URL**: https://zandra-60.vercel.app
- **Auto-deploy**: Cada push a `main` despliega automáticamente

### Proceso
1. Sube archivos a GitHub
2. Commit cambios
3. Vercel detecta y construye automáticamente
4. 2-3 minutos después → LIVE

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Module not found: @supabase/supabase-js"
```bash
npm install @supabase/supabase-js
npm run build
```

### Light bulbs no parpadean
- Verifica que `@keyframes bulbFlicker` esté en `index.css`
- Hard refresh (Ctrl+Shift+R)

### Champagne bubbles no aparecen
- Canvas requiere JavaScript habilitado
- Verifica consola del navegador (F12)

### RSVP no guarda
- Verifica conexión a internet
- Revisa que Supabase URL sea correcta
- Comprueba que tabla `rsvps` exista

---

## 📱 RESPONSIVO

✅ **Mobile**: 320px - 767px
✅ **Tablet**: 768px - 1023px
✅ **Desktop**: 1024px+

Todos los elementos se adaptan automáticamente.

---

## 🔐 CONTRASEÑAS

**Panel Admin**: `gatsby2026`

---

## 📞 CONTACTO

**Coordinador del Evento**
Sergio J. Santizo

**Database**
Supabase Project: ndwheqxeuykmsfbhsvvp

**Hosting**
Vercel: https://zandra-60.vercel.app

---

## 🎁 PRÓXIMOS PASOS

Después de deploy:

1. ✅ Prueba el RSVP con tu nombre
2. ✅ Verifica que el contador funcione
3. ✅ Revisa el panel de admin
4. ✅ Comparte el link con invitados

---

**¡The show must go on! 🎭✨**

Cualquier cambio que hagas en los archivos y subas a GitHub se desplegará automáticamente en Vercel.
