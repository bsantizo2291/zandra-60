
              import { useState, useEffect, useRef } from “react”;
import { createClient } from ‘@supabase/supabase-js’;

const SUPABASE_URL = ‘https://ndwheqxeuykmsfbhsvvp.supabase.co’;
const SUPABASE_ANON_KEY = ‘eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kd2hlcXhldXlrbXNmYmhzdnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODkxMzYsImV4cCI6MjA5MjQ2NTEzNn0.yJ3prriU3vpS9Aa8zoAzjXcdjjAL8HqvTXw0f9bzkjg’;
const CLOUDINARY_CLOUD = ‘duo4dukq4’;
const CLOUDINARY_PRESET = ‘zandra60_unsigned’;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EVENT_DATE = new Date(‘2026-09-05T19:00:00-06:00’);
const CUPO = 80;
const MAPS_URL = ‘https://maps.google.com/?q=Calzada+Roosevelt+Km+13.5+Zona+7+Mixco+Guatemala’;

// Estilos como constantes
const styles = {
page: {
minHeight: ‘100vh’,
background: ‘radial-gradient(ellipse at top, #1c1814, #0a0806)’,
color: ‘#f7e7ce’,
fontFamily: “‘Cormorant Garamond’, Georgia, serif”
},
goldText: {
background: ‘linear-gradient(120deg, #b8860b 0%, #d4af37 30%, #f4e4c1 50%, #d4af37 70%, #b8860b 100%)’,
backgroundSize: ‘200% auto’,
WebkitBackgroundClip: ‘text’,
backgroundClip: ‘text’,
color: ‘transparent’,
animation: ‘shimmer 4s ease-in-out infinite’
},
card: {
background: ‘linear-gradient(135deg, #15120e, #1c1814)’,
border: ‘2px solid #d4af37’,
borderRadius: ‘8px’,
padding: ‘48px’,
boxShadow: ‘0 0 40px rgba(212,175,55,0.1)’
},
input: {
width: ‘100%’,
background: ‘rgba(255,255,255,0.03)’,
border: ‘2px solid #b8860b’,
color: ‘#f7e7ce’,
padding: ‘14px 18px’,
fontSize: ‘1rem’,
outline: ‘none’,
borderRadius: ‘4px’,
boxSizing: ‘border-box’
},
button: {
padding: ‘18px 48px’,
fontFamily: “‘Raleway’, sans-serif”,
fontSize: ‘0.875rem’,
letterSpacing: ‘0.15em’,
textTransform: ‘uppercase’,
background: ‘linear-gradient(135deg, #b8860b, #d4af37)’,
color: ‘#0a0806’,
border: ‘none’,
borderRadius: ‘4px’,
cursor: ‘pointer’,
fontWeight: 600,
transition: ‘all 0.3s’
}
};

function CountdownTimer() {
const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

useEffect(() => {
const timer = setInterval(() => {
const diff = EVENT_DATE - new Date();
if (diff > 0) {
setTime({
days: Math.floor(diff / 864e5),
hours: Math.floor((diff / 36e5) % 24),
minutes: Math.floor((diff / 6e4) % 60),
seconds: Math.floor((diff / 1e3) % 60)
});
}
}, 1000);
return () => clearInterval(timer);
}, []);

const boxStyle = {
width: ‘100px’,
height: ‘100px’,
display: ‘flex’,
alignItems: ‘center’,
justifyContent: ‘center’,
background: ‘linear-gradient(135deg, #15120e, #1c1814)’,
border: ‘2px solid #d4af37’,
borderRadius: ‘8px’,
marginBottom: ‘12px’
};

return (
<div style={{ display: ‘flex’, gap: ‘32px’, justifyContent: ‘center’, flexWrap: ‘wrap’ }}>
{Object.entries(time).map(([k, v]) => (
<div key={k} style={{ textAlign: ‘center’ }}>
<div style={boxStyle}>
<span style={{ …styles.goldText, fontSize: ‘2.5rem’, fontWeight: 600 }}>
{String(v).padStart(2, ‘0’)}
</span>
</div>
<div style={{ fontSize: ‘0.75rem’, letterSpacing: ‘0.2em’, textTransform: ‘uppercase’, opacity: 0.7 }}>
{k === ‘days’ ? ‘Días’ : k === ‘hours’ ? ‘Horas’ : k === ‘minutes’ ? ‘Minutos’ : ‘Segundos’}
</div>
</div>
))}
</div>
);
}

function Navigation({ current, navigate }) {
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
const h = () => setScrolled(window.scrollY > 50);
window.addEventListener(‘scroll’, h);
return () => window.removeEventListener(‘scroll’, h);
}, []);

const navStyle = {
position: ‘fixed’,
top: 0,
left: 0,
right: 0,
zIndex: 1000,
background: scrolled ? ‘rgba(10,8,6,0.95)’ : ‘transparent’,
backdropFilter: scrolled ? ‘blur(20px)’ : ‘none’,
borderBottom: scrolled ? ‘1px solid rgba(212,175,55,0.2)’ : ‘none’,
padding: scrolled ? ‘16px 40px’ : ‘24px 40px’,
display: ‘flex’,
justifyContent: ‘space-between’,
alignItems: ‘center’,
transition: ‘all 0.4s’
};

const links = [
{ id: ‘home’, label: ‘Inicio’ },
{ id: ‘rsvp’, label: ‘Confirmar’ },
{ id: ‘gallery’, label: ‘Galería’ },
{ id: ‘admin’, label: ‘Admin’ }
];

return (
<nav style={navStyle}>
<div onClick={() => navigate(‘home’)} style={{ fontSize: ‘1.5rem’, fontStyle: ‘italic’, cursor: ‘pointer’ }}>
<span style={styles.goldText}>Zandra 60</span>
</div>
<div style={{ display: ‘flex’, gap: ‘40px’ }}>
{links.map(link => (
<button
key={link.id}
onClick={() => navigate(link.id)}
style={{
background: ‘none’,
border: ‘none’,
fontSize: ‘0.875rem’,
letterSpacing: ‘0.15em’,
textTransform: ‘uppercase’,
color: current === link.id ? ‘#d4af37’ : ‘#f7e7ce’,
cursor: ‘pointer’,
padding: ‘8px 0’,
opacity: current === link.id ? 1 : 0.7
}}
>
{link.label}
</button>
))}
</div>
</nav>
);
}

function HomePage({ navigate }) {
const canvasRef = useRef(null);

useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;
const ctx = canvas.getContext(‘2d’);
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
let particles = [];
let raf;

```
class Particle {
  constructor() {
    this.x = Math.random() * W;
    this.y = H + Math.random() * 100;
    this.vy = -Math.random() * 1.5 - 0.5;
    this.size = Math.random() * 3 + 1;
    this.alpha = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.y += this.vy;
    if (this.y < -10) {
      this.y = H + 50;
      this.x = Math.random() * W;
    }
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 60; i++) particles.push(new Particle());

function animate() {
  ctx.fillStyle = 'rgba(10,8,6,0.05)';
  ctx.fillRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  raf = requestAnimationFrame(animate);
}
animate();

return () => cancelAnimationFrame(raf);
```

}, []);

return (
<div style={styles.page}>
<canvas ref={canvasRef} style={{ position: ‘absolute’, inset: 0, width: ‘100%’, height: ‘100%’ }} />
<div style={{ position: ‘relative’, zIndex: 10, minHeight: ‘100vh’, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, padding: ‘120px 20px 80px’, textAlign: ‘center’ }}>
<div style={{ maxWidth: ‘900px’ }}>
<div style={{ fontSize: ‘0.875rem’, letterSpacing: ‘0.3em’, textTransform: ‘uppercase’, marginBottom: ‘24px’, opacity: 0.7 }}>
Una Celebración de Elegancia
</div>
<h1 style={{ fontSize: ‘clamp(3rem,8vw,6rem)’, fontWeight: 400, fontStyle: ‘italic’, lineHeight: 1.1, marginBottom: ‘32px’ }}>
<span style={styles.goldText}>Zandra</span>
</h1>
<div style={{ fontSize: ‘clamp(1.5rem,4vw,2.5rem)’, marginBottom: ‘40px’, fontStyle: ‘italic’ }}>
B. Veliz Ortiz
</div>
<div style={{ fontSize: ‘clamp(3rem,10vw,5rem)’ }}>
<span style={styles.goldText}>60</span>
</div>
<div style={{ fontSize: ‘1.125rem’, letterSpacing: ‘0.2em’, color: ‘#d4af37’, textTransform: ‘uppercase’, marginBottom: ‘48px’ }}>
Años de Brillantez
</div>
<div style={{ fontSize: ‘clamp(1.5rem,3vw,2rem)’, marginBottom: ‘32px’, fontStyle: ‘italic’ }}>
Una Velada Gatsby
</div>
<div style={{ marginBottom: ‘12px’ }}>Sábado, 5 de Septiembre de 2026</div>
<div style={{ marginBottom: ‘8px’, opacity: 0.8 }}>19:00 – 00:00 hrs</div>
<div style={{ marginBottom: ‘56px’, opacity: 0.7 }}>El Club Español, Guatemala</div>

```
      <CountdownTimer />
      
      <div style={{ marginTop: '56px' }}>
        <button onClick={() => navigate('rsvp')} style={styles.button}>
          Confirmar Asistencia
        </button>
      </div>
    </div>
  </div>
  <style>{`@keyframes shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
</div>
```

);
}

function GalleryPage({ navigate }) {
const [uploads, setUploads] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetch = async () => {
const { data } = await supabase.from(‘uploads’).select(’*’).order(‘created_at’, { ascending: false });
if (data) setUploads(data);
setLoading(false);
};
fetch();
}, []);

if (loading) return <div style={{ …styles.page, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’ }}>Cargando…</div>;

return (
<div style={{ …styles.page, paddingTop: ‘100px’ }}>
<div style={{ maxWidth: ‘1400px’, margin: ‘0 auto’, padding: ‘60px 40px 100px’ }}>
<h1 style={{ textAlign: ‘center’, fontSize: ‘clamp(2.5rem,6vw,4rem)’, fontStyle: ‘italic’, marginBottom: ‘80px’ }}>
<span style={styles.goldText}>Galería</span>
</h1>
{uploads.length === 0 ? (
<div style={{ textAlign: ‘center’, padding: ‘80px 20px’ }}>
<div style={{ fontSize: ‘4rem’, marginBottom: ‘24px’, opacity: 0.3 }}>📷</div>
<p>Aún no hay recuerdos compartidos.</p>
</div>
) : (
<div style={{ display: ‘grid’, gridTemplateColumns: ‘repeat(auto-fill,minmax(300px,1fr))’, gap: ‘24px’ }}>
{uploads.map((u, i) => (
<div key={i} style={{ position: ‘relative’, aspectRatio: ‘1’, borderRadius: ‘8px’, overflow: ‘hidden’, border: ‘2px solid #d4af37’ }}>
{u.tipo_archivo === ‘video’ ? (
<video src={u.archivo_url} style={{ width: ‘100%’, height: ‘100%’, objectFit: ‘cover’ }} />
) : (
<img src={u.archivo_url} alt={u.nombre_persona} style={{ width: ‘100%’, height: ‘100%’, objectFit: ‘cover’ }} />
)}
<div style={{ position: ‘absolute’, bottom: 0, left: 0, right: 0, background: ‘linear-gradient(transparent,rgba(0,0,0,0.8))’, padding: ‘20px’ }}>
{u.nombre_persona}
</div>
</div>
))}
</div>
)}
</div>
</div>
);
}

const InputField = ({ label, value, onChange, type = ‘text’, placeholder = ‘’, error }) => (

  <div style={{ marginBottom: '24px' }}>
    <label style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#d4af37', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ ...styles.input, borderColor: error ? '#c0392b' : '#b8860b' }}
    />
    {error && <p style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '6px' }}>{error}</p>}
  </div>
);

function RSVPPage({ navigate, setRsvpData }) {
const [form, setForm] = useState({ nombre: ‘’, email: ‘’, telefono: ‘’, acompanante: false, nombreAcomp: ‘’, restricciones: ‘’ });
const [errors, setErrors] = useState({});
const [submitting, setSubmitting] = useState(false);
const [stats, setStats] = useState({ libres: CUPO });

useEffect(() => {
const fetch = async () => {
const { data } = await supabase.from(‘rsvps’).select(‘acompanante’);
if (data) {
const total = data.length + data.filter(r => r.acompanante).length;
setStats({ libres: CUPO - total });
}
};
fetch();
}, []);

const set = (k, v) => {
setForm(f => ({ …f, [k]: v }));
setErrors(e => ({ …e, [k]: null }));
};

const validate = () => {
const e = {};
if (!form.nombre.trim()) e.nombre = ‘Ingresa tu nombre completo’;
if (!form.email.trim() || !/\S+@\S+.\S+/.test(form.email)) e.email = ‘Ingresa un correo válido’;
if (form.acompanante && !form.nombreAcomp.trim()) e.nombreAcomp = ‘Ingresa el nombre de tu acompañante’;
return e;
};

const submit = async () => {
const e = validate();
if (Object.keys(e).length) {
setErrors(e);
return;
}
setSubmitting(true);

```
try {
  const { data, error } = await supabase.from('rsvps').insert([{
    nombre: form.nombre,
    email: form.email,
    telefono: form.telefono || null,
    acompanante: form.acompanante,
    nombre_acomp: form.acompanante ? form.nombreAcomp : null,
    restricciones_dieteticas: form.restricciones || null
  }]).select();
  
  if (error) throw error;
  setRsvpData({ ...form, uploadToken: data[0].upload_token });
  navigate('confirmacion');
} catch (err) {
  setErrors({ general: 'Error al guardar' });
  setSubmitting(false);
}
```

};

return (
<div style={{ …styles.page, paddingTop: ‘100px’ }}>
<div style={{ maxWidth: ‘800px’, margin: ‘0 auto’, padding: ‘60px 40px 100px’ }}>
<div style={{ textAlign: ‘center’, marginBottom: ‘60px’ }}>
<h1 style={{ fontSize: ‘clamp(2.5rem,6vw,4rem)’, fontStyle: ‘italic’, marginBottom: ‘24px’ }}>
<span style={styles.goldText}>Confirmar Asistencia</span>
</h1>
<p>{stats.libres} lugares disponibles de {CUPO}</p>
</div>

```
    <div style={styles.card}>
      {errors.general && <div style={{ background: 'rgba(192,57,43,0.1)', border: '2px solid #c0392b', padding: '16px', borderRadius: '6px', marginBottom: '24px', color: '#e74c3c' }}>{errors.general}</div>}
      
      <InputField label="Nombre Completo" value={form.nombre} onChange={e => set('nombre', e.target.value)} error={errors.nombre} />
      <InputField label="Correo Electrónico" type="email" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} />
      <InputField label="Teléfono (Opcional)" type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
      
      <div style={{ marginBottom: '24px' }}>
        <div onClick={() => set('acompanante', !form.acompanante)} style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', padding: '18px', border: `2px solid ${form.acompanante ? '#d4af37' : '#b8860b'}`, borderRadius: '6px' }}>
          <div style={{ width: '52px', height: '28px', borderRadius: '14px', background: form.acompanante ? 'linear-gradient(135deg,#b8860b,#d4af37)' : '#b8860b', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '3px', left: form.acompanante ? '26px' : '3px', width: '22px', height: '22px', borderRadius: '50%', background: '#fffff0', transition: 'left 0.3s' }} />
          </div>
          <span>Llevaré un acompañante (máx. 1)</span>
        </div>
      </div>
      
      {form.acompanante && <InputField label="Nombre del Acompañante" value={form.nombreAcomp} onChange={e => set('nombreAcomp', e.target.value)} error={errors.nombreAcomp} />}
      
      <div style={{ marginBottom: '32px' }}>
        <label style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#d4af37', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Restricciones Dietéticas (Opcional)
        </label>
        <textarea value={form.restricciones} onChange={e => set('restricciones', e.target.value)} placeholder="Ej: Vegetariano, sin gluten..." rows={3} style={{ ...styles.input, resize: 'vertical' }} />
      </div>
      
      <button onClick={submit} disabled={submitting} style={{ ...styles.button, width: '100%', opacity: submitting ? 0.5 : 1 }}>
        {submitting ? 'CONFIRMANDO...' : 'Confirmar Asistencia'}
      </button>
    </div>
  </div>
</div>
```

);
}

function Confirmacion({ navigate, rsvpData }) {
const url = `${window.location.origin}?upload=${rsvpData?.uploadToken || ''}`;

return (
<div style={{ …styles.page, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’, padding: ‘120px 20px’ }}>
<div style={{ …styles.card, maxWidth: ‘680px’, textAlign: ‘center’ }}>
<div style={{ fontSize: ‘4rem’, marginBottom: ‘20px’ }}>🥂</div>
<h2 style={{ fontSize: ‘clamp(1.6rem,5vw,2.4rem)’, fontStyle: ‘italic’, marginBottom: ‘16px’, color: ‘#d4af37’ }}>
¡Confirmación Recibida!
</h2>
<div style={{ fontSize: ‘clamp(1.3rem,4vw,2rem)’, marginBottom: ‘24px’, fontStyle: ‘italic’ }}>
{rsvpData?.nombre}
</div>
<p style={{ marginBottom: ‘28px’, opacity: 0.8 }}>
Tu asistencia ha sido registrada{rsvpData?.acompanante && rsvpData.nombreAcomp ? ` junto con ${rsvpData.nombreAcomp}` : ‘’}.
</p>

```
    <div style={{ background: 'rgba(212,175,55,0.08)', border: '2px solid #d4af37', padding: '26px', borderRadius: '6px', marginBottom: '28px' }}>
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#d4af37', textTransform: 'uppercase', marginBottom: '14px' }}>
        Tu Enlace Personal
      </p>
      <input readOnly value={url} onClick={e => e.target.select()} style={{ width: '100%', fontSize: '0.8rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.3)', border: '1px solid #b8860b', color: '#f7e7ce', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', marginBottom: '14px' }} />
      <p style={{ fontSize: '0.9rem', lineHeight: 1.8, opacity: 0.9 }}>
        Usa este enlace para subir una foto o video para Zandra.
      </p>
    </div>
    
    <button onClick={() => navigate('home')} style={styles.button}>Volver al Inicio</button>
  </div>
</div>
```

);
}

function Admin({ navigate }) {
const [pw, setPw] = useState(’’);
const [auth, setAuth] = useState(false);
const [rsvps, setRsvps] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
if (!auth) return;
const fetch = async () => {
const { data } = await supabase.from(‘rsvps’).select(’*’).order(‘created_at’, { ascending: false });
if (data) setRsvps(data);
setLoading(false);
};
fetch();
}, [auth]);

if (!auth) {
return (
<div style={{ …styles.page, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’ }}>
<div style={{ …styles.card, maxWidth: ‘420px’, textAlign: ‘center’ }}>
<h2 style={{ fontSize: ‘2rem’, fontStyle: ‘italic’, marginBottom: ‘24px’, color: ‘#d4af37’ }}>Admin Panel</h2>
<InputField label=“Contraseña” type=“password” value={pw} onChange={e => setPw(e.target.value)} />
<button onClick={() => pw === ‘gatsby2026’ && setAuth(true)} style={{ …styles.button, width: ‘100%’, marginBottom: ‘16px’ }}>Ingresar</button>
<button onClick={() => navigate(‘home’)} style={{ …styles.button, width: ‘100%’, background: ‘transparent’, color: ‘#d4af37’, border: ‘2px solid #d4af37’ }}>Volver</button>
</div>
</div>
);
}

if (loading) return <div style={{ …styles.page, display: ‘flex’, alignItems: ‘center’, justifyContent: ‘center’ }}>Cargando…</div>;

const total = rsvps.length + rsvps.filter(r => r.acompanante).length;

return (
<div style={{ …styles.page, paddingTop: ‘100px’ }}>
<div style={{ maxWidth: ‘1200px’, margin: ‘0 auto’, padding: ‘60px 40px 100px’ }}>
<div style={{ display: ‘flex’, justifyContent: ‘space-between’, marginBottom: ‘40px’ }}>
<h1 style={{ fontSize: ‘clamp(2rem,5vw,3rem)’, fontStyle: ‘italic’, color: ‘#d4af37’ }}>Panel Admin</h1>
<button onClick={() => navigate(‘home’)} style={styles.button}>Salir</button>
</div>

```
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '24px', marginBottom: '60px' }}>
      <div style={{ ...styles.card, padding: '28px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px', opacity: 0.7 }}>Confirmados</div>
        <div style={{ fontSize: '3rem', color: '#d4af37' }}>{rsvps.length}</div>
      </div>
      <div style={{ ...styles.card, padding: '28px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px', opacity: 0.7 }}>Total Personas</div>
        <div style={{ fontSize: '3rem', color: '#d4af37' }}>{total}</div>
      </div>
      <div style={{ ...styles.card, padding: '28px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px', opacity: 0.7 }}>Cupos Libres</div>
        <div style={{ fontSize: '3rem', color: '#d4af37' }}>{CUPO - total}</div>
      </div>
    </div>
    
    <div style={styles.card}>
      <h3 style={{ fontSize: '1.5rem', color: '#d4af37', marginBottom: '24px' }}>Confirmaciones ({rsvps.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #b8860b' }}>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#d4af37', textTransform: 'uppercase' }}>Nombre</th>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#d4af37', textTransform: 'uppercase' }}>Email</th>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#d4af37', textTransform: 'uppercase' }}>Acompañante</th>
            <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#d4af37', textTransform: 'uppercase' }}>Restricciones</th>
          </tr>
        </thead>
        <tbody>
          {rsvps.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
              <td style={{ padding: '16px', fontSize: '0.938rem' }}>{r.nombre}</td>
              <td style={{ padding: '16px', fontSize: '0.875rem', opacity: 0.7 }}>{r.email}</td>
              <td style={{ padding: '16px', fontSize: '0.875rem', color: r.acompanante ? '#d4af37' : '#f7e7ce', opacity: 0.8 }}>{r.acompanante ? r.nombre_acomp : '—'}</td>
              <td style={{ padding: '16px', fontSize: '0.875rem', opacity: 0.7 }}>{r.restricciones_dieteticas || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
```

);
}

export default function App() {
const [page, setPage] = useState(‘home’);
const [rsvpData, setRsvpData] = useState(null);

useEffect(() => {
const link = document.createElement(‘link’);
link.href = ‘https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Montserrat:wght@300;400;600&family=Raleway:wght@300;400;600;700&display=swap’;
link.rel = ‘stylesheet’;
document.head.appendChild(link);
}, []);

const navigate = p => {
setPage(p);
window.scrollTo(0, 0);
};

return (
<div>
<Navigation current={page} navigate={navigate} />
{page === ‘home’ && <HomePage navigate={navigate} />}
{page === ‘gallery’ && <GalleryPage navigate={navigate} />}
{page === ‘rsvp’ && <RSVPPage navigate={navigate} setRsvpData={setRsvpData} />}
{page === ‘confirmacion’ && <Confirmacion navigate={navigate} rsvpData={rsvpData} />}
{page === ‘admin’ && <Admin navigate={navigate} />}
</div>
);
}
