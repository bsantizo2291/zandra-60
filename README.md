# Invitación Digital 60 Cumpleaños Zandra

## 🎭 Temática Great Gatsby

Una invitación digital interactiva y elegante para celebrar los 60 años de **Zandra Beatriz Veliz Ortiz** con la sofisticación y glamour de la era de los años 20.

---

## ✨ Características

### 🎯 Secciones Principales

1. **Hero Section**
   - Título animado "ZANDRA"
   - Cuenta regresiva en tiempo real
   - Botón para confirmar asistencia
   - Efectos visuales con gradientes y animaciones

2. **Detalles del Evento**
   - Fecha y hora (5 de Septiembre, 2026 - 7:00 PM)
   - Ubicación (El Club Español, Guatemala City)
   - Código de vestimenta (Elegancia Great Gatsby)

3. **Galería de Recuerdos**
   - Carga de fotos integrada con Cloudinary
   - Galería responsiva con vista previa
   - Notificaciones de carga exitosa
   - Almacenamiento en la nube

4. **Información de Contacto**
   - Detalles para confirmar asistencia
   - Contacto: Sergio J. Santizo

---

## 🎨 Diseño

### Paleta de Colores
- **Negro profundo**: Fondo principal (#000000)
- **Oro/Ámbar**: Acentos principales (#fbbf24, #f59e0b, #d97706)
- **Ámbar oscuro**: Gradientes y efectos (#78350f, #92400e)

### Tipografía
- **Playfair Display**: Títulos elegantes (serif)
- **Lato**: Cuerpo de texto (sans-serif)

### Animaciones
- Fade-in suave en scroll
- Escala en hover
- Cuenta regresiva en tiempo real
- Efectos de brillo y gradientes

---

## 🚀 Tecnologías

| Tecnología | Propósito |
|-----------|-----------|
| React 19 | Framework de UI |
| Vite | Herramienta de construcción |
| Tailwind CSS 4 | Utilidades de estilos |
| Framer Motion | Animaciones |
| Lucide React | Iconos |
| Sonner | Notificaciones |
| Cloudinary | Almacenamiento de fotos |

---

## 📦 Instalación Local

### Requisitos
- Node.js 16+ 
- npm o pnpm

### Pasos

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/TU_USUARIO/invitacion-zandra-60.git
   cd invitacion-zandra-60
   ```

2. **Instala dependencias**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

4. **Abre en el navegador**
   ```
   http://localhost:3000
   ```

---

## 🔨 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Previsualiza la construcción
```

---

## 📸 Galería de Cloudinary

### Configuración

El proyecto está preconfigurado con el preset de Cloudinary: `duo4dukq4`

**Características:**
- Carga de múltiples fotos
- Almacenamiento en la nube
- Galería responsiva
- Miniaturas optimizadas

### Uso

1. Desplázate a la sección "Galería de Recuerdos"
2. Haz clic en el área de carga
3. Selecciona una o más fotos
4. Las fotos se subirán automáticamente a Cloudinary
5. Aparecerán en la galería en tiempo real

---

## 🌐 Despliegue en Vercel

### Opción 1: Despliegue Automático (Recomendado)

1. Sube el proyecto a GitHub
2. Ve a [Vercel.com](https://vercel.com)
3. Conecta tu repositorio de GitHub
4. Vercel desplegará automáticamente

### Opción 2: Despliegue Manual

```bash
# Instala Vercel CLI
npm install -g vercel

# Despliega
vercel
```

---

## 📝 Personalización

### Cambiar Texto

Edita `src/App.jsx`:
- Línea 1: Nombre de la celebrada
- Línea 2: Fecha y hora del evento
- Línea 3: Ubicación
- Línea 4: Nombre del coordinador

### Cambiar Colores

Edita `src/index.css`:
- Busca `text-amber-*` para cambiar tonos de oro
- Busca `bg-black` para cambiar fondos
- Usa la paleta de Tailwind CSS

### Cambiar Animaciones

Edita `src/App.jsx`:
- `initial`, `animate`, `transition` en componentes `motion.*`
- Consulta [Framer Motion Docs](https://www.framer.com/motion/)

---

## 🔒 Variables de Entorno

No se requieren variables de entorno para el funcionamiento básico. El preset de Cloudinary está hardcodeado en el proyecto.

**Opcional**: Para usar un preset diferente, edita `src/App.jsx`:
```javascript
const UPLOAD_PRESET = 'tu-preset-aqui'
```

---

## 🐛 Solución de Problemas

### Las fotos no se cargan
- Verifica que tengas conexión a internet
- Abre la consola del navegador (F12) para ver errores
- Asegúrate de que el preset de Cloudinary sea correcto

### El sitio se ve diferente en Vercel
- Limpia el caché del navegador
- Reconstruye en Vercel: Settings → Deployments → Redeploy

### Error de construcción
- Verifica que `package.json` esté en la raíz
- Comprueba que no haya errores de sintaxis
- Revisa los logs de Vercel

---

## 📱 Responsividad

El proyecto es completamente responsivo:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1919px)
- ✅ Mobile (< 768px)

---

## 🎁 Características Futuras

- [ ] Mapa interactivo de ubicación
- [ ] RSVP en línea integrado
- [ ] Música de fondo
- [ ] Sección de testimonios
- [ ] Contador de confirmaciones
- [ ] Tema oscuro/claro

---

## 📄 Licencia

Este proyecto es de uso personal para la celebración de Zandra Beatriz Veliz Ortiz.

---

## 👨‍💻 Autor

Creado con ❤️ para una celebración especial.

---

## 📞 Contacto para Confirmación

**Sergio J. Santizo**
Coordinador del Evento

---

**¡Que disfrutes de una noche llena de elegancia y nostalgia! ✨**
