import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ndwheqxeuykmsfbhsvvp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kd2hlcXhldXlrbXNmYmhzdnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODkxMzYsImV4cCI6MjA5MjQ2NTEzNn0.yJ3prriU3vpS9Aa8zoAzjXcdjjAL8HqvTXw0f9bzkjg';
const CLOUDINARY_CLOUD = 'duo4dukq4';
const CLOUDINARY_PRESET = 'zandra60_unsigned';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EVENT_DATE = new Date('2026-09-05T19:00:00-06:00');
const EVENTO = {
  cupo: 80,
  direccion: 'Calzada Roosevelt Km. 13.5, 40-20 Zona 7 de Mixco, Guatemala',
  mapsUrl: 'https://maps.google.com/?q=Calzada+Roosevelt+Km+13.5+Zona+7+Mixco+Guatemala'
};

const C = { deepBlack: '#0a0806', richBlack: '#15120e', midnight: '#1c1814', champagne: '#f7e7ce', gold: '#d4af37', lightGold: '#f4e4c1', bronze: '#b8860b', ivory: '#fffff0' };
const F = { display: "'Playfair Display',Georgia,serif", decorative: "'Cormorant Garamond',Georgia,serif", elegant: "'Cinzel',Georgia,serif", body: "'Montserrat',sans-serif", accent: "'Raleway',sans-serif" };

function GoldShimmer({ children, style = {} }) {
  return <span style={{ background: `linear-gradient(120deg,${C.bronze} 0%,${C.gold} 30%,${C.lightGold} 50%,${C.gold} 70%,${C.bronze} 100%)`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', animation: 'shimmer 4s ease-in-out infinite', ...style }}>{children}</span>;
}

function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = EVENT_DATE - new Date();
      if (diff > 0) setTime({ days: Math.floor(diff / 864e5), hours: Math.floor((diff / 36e5) % 24), minutes: Math.floor((diff / 6e4) % 60), seconds: Math.floor((diff / 1e3) % 60) });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {Object.entries(time).map(([k, v]) => (
        <div key={k} style={{ textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `2px solid ${C.gold}`, borderRadius: '8px', boxShadow: `0 0 30px rgba(212,175,55,0.2)`, marginBottom: '12px' }}>
            <GoldShimmer style={{ fontSize: '2.5rem', fontFamily: F.elegant, fontWeight: 600 }}>{String(v).padStart(2,'0')}</GoldShimmer>
          </div>
          <div style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.2em', color: C.champagne, textTransform: 'uppercase', opacity: 0.7 }}>
            {k === 'days' ? 'Días' : k === 'hours' ? 'Horas' : k === 'minutes' ? 'Minutos' : 'Segundos'}
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
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  
  const links = [{ id: 'home', l: 'Inicio' }, { id: 'details', l: 'Detalles' }, { id: 'schedule', l: 'Itinerario' }, { id: 'gallery', l: 'Galería' }, { id: 'rsvp', l: 'Confirmar' }];
  
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? 'rgba(10,8,6,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? `1px solid rgba(212,175,55,0.2)` : 'none', transition: 'all 0.4s', padding: scrolled ? '16px 0' : '24px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: F.display, fontSize: '1.5rem', fontStyle: 'italic', cursor: 'pointer' }} onClick={() => navigate('home')}>
          <GoldShimmer>Zandra 60</GoldShimmer>
        </div>
        <div style={{ display: 'flex', gap: '40px' }}>
          {links.map(link => (
            <button key={link.id} onClick={() => navigate(link.id)} style={{ background: 'none', border: 'none', fontFamily: F.accent, fontSize: '0.875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: current === link.id ? C.gold : C.champagne, cursor: 'pointer', padding: '8px 0', position: 'relative', transition: 'color 0.3s', opacity: current === link.id ? 1 : 0.7 }}>
              {link.l}
              {current === link.id && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: C.gold, boxShadow: `0 0 8px ${C.gold}` }} />}
            </button>
          ))}
          <button onClick={() => navigate('admin')} style={{ background: 'none', border: 'none', fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.3)', cursor: 'pointer', padding: '8px 0' }}>Admin</button>
        </div>
      </div>
    </nav>
  );
}

function Button({ onClick, variant = 'primary', children, disabled = false, style = {} }) {
  const [hover, setHover] = useState(false);
  const base = { padding: '18px 48px', fontFamily: F.accent, fontSize: '0.875rem', letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: '4px', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.3s', fontWeight: 600, opacity: disabled ? 0.5 : 1 };
  const styles = variant === 'primary' ? { ...base, background: `linear-gradient(135deg,${C.bronze},${C.gold})`, color: C.deepBlack, border: 'none', boxShadow: `0 4px 20px rgba(212,175,55,0.3)` } : { ...base, background: 'transparent', color: C.gold, border: `2px solid ${C.gold}` };
  
  return <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ ...styles, transform: hover && !disabled ? 'translateY(-2px)' : 'none', ...style }}>{children}</button>;
}

function HomePage({ navigate }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight, particles = [], raf;
    
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    
    class Particle {
      constructor() { this.reset(); }
      reset() { this.x = Math.random() * W; this.y = H + Math.random() * 100; this.vx = (Math.random() - 0.5) * 0.5; this.vy = -Math.random() * 1.5 - 0.5; this.size = Math.random() * 3 + 1; this.alpha = Math.random() * 0.5 + 0.3; this.hue = Math.random() * 20 + 40; }
      update() { this.x += this.vx; this.y += this.vy; if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(); }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        g.addColorStop(0, `hsla(${this.hue},70%,70%,1)`);
        g.addColorStop(1, `hsla(${this.hue},70%,50%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    for (let i = 0; i < 80; i++) particles.push(new Particle());
    
    function animate() {
      ctx.fillStyle = 'rgba(10,8,6,0.05)';
      ctx.fillRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      raf = requestAnimationFrame(animate);
    }
    animate();
    
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: `radial-gradient(ellipse at top,${C.midnight},${C.deepBlack})` }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: `radial-gradient(ellipse,rgba(212,175,55,0.15),transparent 70%)`, pointerEvents: 'none' }} />
      
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 80px' }}>
        <div style={{ textAlign: 'center', maxWidth: '900px' }}>
          <div style={{ fontFamily: F.accent, fontSize: '0.875rem', letterSpacing: '0.3em', color: C.champagne, textTransform: 'uppercase', marginBottom: '24px', opacity: 0.7 }}>Una Celebración de Elegancia</div>
          <h1 style={{ fontFamily: F.display, fontSize: 'clamp(3rem,8vw,6rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.1, marginBottom: '32px' }}><GoldShimmer>Zandra</GoldShimmer></h1>
          <div style={{ fontFamily: F.decorative, fontSize: 'clamp(1.5rem,4vw,2.5rem)', color: C.champagne, marginBottom: '16px', fontStyle: 'italic' }}>B. Veliz Ortiz</div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', margin: '40px 0' }}>
            <div style={{ width: '80px', height: '1px', background: `linear-gradient(90deg,transparent,${C.gold})` }} />
            <div style={{ width: '8px', height: '8px', background: C.gold, transform: 'rotate(45deg)' }} />
            <div style={{ fontFamily: F.elegant, fontSize: 'clamp(3rem,10vw,5rem)', lineHeight: 1 }}><GoldShimmer>60</GoldShimmer></div>
            <div style={{ width: '8px', height: '8px', background: C.gold, transform: 'rotate(45deg)' }} />
            <div style={{ width: '80px', height: '1px', background: `linear-gradient(90deg,${C.gold},transparent)` }} />
          </div>
          
          <div style={{ fontFamily: F.accent, fontSize: '1.125rem', letterSpacing: '0.2em', color: C.gold, textTransform: 'uppercase', marginBottom: '48px' }}>Años de Brillantez</div>
          <div style={{ fontFamily: F.decorative, fontSize: 'clamp(1.5rem,3vw,2rem)', color: C.champagne, marginBottom: '32px', fontStyle: 'italic' }}>Una Velada Gatsby</div>
          <div style={{ fontFamily: F.body, fontSize: '1rem', color: C.champagne, marginBottom: '12px', opacity: 0.9 }}>Sábado, 5 de Septiembre de 2026</div>
          <div style={{ fontFamily: F.body, fontSize: '0.938rem', color: C.champagne, marginBottom: '8px', opacity: 0.8 }}>19:00 – 00:00 hrs</div>
          <div style={{ fontFamily: F.body, fontSize: '0.938rem', color: C.champagne, marginBottom: '56px', opacity: 0.7 }}>El Club Español, Guatemala</div>
          
          <CountdownTimer />
          
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '56px', flexWrap: 'wrap' }}>
            <Button onClick={() => navigate('rsvp')}>Confirmar Asistencia</Button>
            <Button onClick={() => navigate('details')} variant="secondary">Ver Detalles del Evento</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailsPage({ navigate }) {
  const VESTUARIO = [
    { titulo: 'Señoras — Vestido de Gala', desc: 'Vestido largo en dorado, negro o champagne con lentejuelas o encaje. Tocado, diadema o plumas.', colors: ['#d4af37', '#0a0806', '#f7e7ce'] },
    { titulo: 'Caballeros — Esmoquin', desc: 'Esmoquin negro o blanco con corbatín y fajín. Pañuelo dorado. Zapatos de charol.', colors: ['#0a0806', '#f7e7ce', '#d4af37'] },
    { titulo: 'Accesorios', desc: 'Perlas, gemelos dorados, reloj de bolsillo, sombrero Fedora, abanico de plumas.', colors: ['#d4af37', '#f7e7ce', '#0a0806'] }
  ];
  
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontFamily: F.display, fontSize: 'clamp(2.5rem,6vw,4rem)', fontStyle: 'italic', marginBottom: '24px' }}><GoldShimmer>Una Velada Gatsby</GoldShimmer></h1>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '32px', marginBottom: '80px' }}>
          {[
            { icon: '📅', label: 'Fecha', value: 'Sábado, 5 de Septiembre de 2026' },
            { icon: '🕖', label: 'Horario', value: '19:00 – 00:00 hrs' },
            { icon: '📍', label: 'Lugar', value: 'El Club Español\nÁrea Fuentecilla' },
            { icon: '🗺️', label: 'Dirección', value: EVENTO.direccion }
          ].map((item, i) => (
            <div key={i} style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `1px solid ${C.gold}`, borderRadius: '8px', padding: '32px', textAlign: 'center', boxShadow: `0 0 30px rgba(212,175,55,0.1)` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.icon}</div>
              <div style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.2em', color: C.gold, textTransform: 'uppercase', marginBottom: '12px' }}>{item.label}</div>
              <div style={{ fontFamily: F.body, fontSize: '0.938rem', color: C.champagne, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.value}</div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Button onClick={() => window.open(EVENTO.mapsUrl, '_blank')}>📍 Abrir en Google Maps</Button>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontStyle: 'italic', marginBottom: '24px' }}><GoldShimmer>Código de Vestimenta</GoldShimmer></h2>
          <div style={{ display: 'inline-flex', gap: '24px', padding: '16px 48px', border: `2px solid ${C.gold}`, borderRadius: '8px', background: `rgba(212,175,55,0.05)` }}>
            {['Negro', 'Dorado', 'Champagne'].map(c => <span key={c} style={{ fontFamily: F.accent, fontSize: '0.875rem', letterSpacing: '0.15em', color: C.gold, textTransform: 'uppercase' }}>{c}</span>)}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '32px' }}>
          {VESTUARIO.map((item, i) => (
            <div key={i} style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `1px solid rgba(212,175,55,0.3)`, borderRadius: '8px', padding: '32px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                {item.colors.map((color, j) => <div key={j} style={{ width: '36px', height: '36px', borderRadius: '50%', background: color, border: `2px solid ${C.gold}` }} />)}
              </div>
              <div style={{ fontFamily: F.accent, fontSize: '0.813rem', letterSpacing: '0.15em', color: C.gold, textTransform: 'uppercase', marginBottom: '16px' }}>{item.titulo}</div>
              <div style={{ fontFamily: F.body, fontSize: '0.938rem', color: C.champagne, lineHeight: 1.7, opacity: 0.9 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SchedulePage({ navigate }) {
  const timeline = [
    { time: '19:00', title: 'Recepción', desc: 'Bienvenida con coctel de champagne' },
    { time: '19:30', title: 'Cena de Gala', desc: 'Menú de tres tiempos' },
    { time: '21:00', title: 'Brindis y Palabras', desc: 'Tributo a Zandra' },
    { time: '21:30', title: 'Corte del Pastel', desc: 'Momento especial' },
    { time: '22:00', title: 'Baile', desc: 'Música años 20' },
    { time: '23:45', title: 'Despedida', desc: 'Cierre de la velada' }
  ];
  
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, paddingTop: '100px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 40px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontFamily: F.display, fontSize: 'clamp(2.5rem,6vw,4rem)', fontStyle: 'italic' }}><GoldShimmer>Itinerario de la Velada</GoldShimmer></h1>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '40px', top: '0', bottom: '0', width: '2px', background: `linear-gradient(180deg,${C.gold},transparent)`, opacity: 0.3 }} />
          
          {timeline.map((event, i) => (
            <div key={i} style={{ position: 'relative', paddingLeft: '100px', marginBottom: '60px' }}>
              <div style={{ position: 'absolute', left: '0', top: '8px', width: '80px', height: '80px', border: `2px solid ${C.gold}`, borderRadius: '50%', background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px rgba(212,175,55,0.2)` }}>
                <div style={{ fontFamily: F.elegant, fontSize: '1.125rem', color: C.gold }}>{event.time}</div>
              </div>
              <div style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `1px solid rgba(212,175,55,0.3)`, borderRadius: '8px', padding: '32px' }}>
                <h3 style={{ fontFamily: F.elegant, fontSize: '1.5rem', color: C.gold, marginBottom: '12px' }}>{event.title}</h3>
                <p style={{ fontFamily: F.body, fontSize: '1rem', color: C.champagne, lineHeight: 1.7, opacity: 0.9 }}>{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryPage({ navigate }) {
  const [uploads, setUploads] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('uploads').select('*').order('created_at', { ascending: false });
      if (data) setUploads(data);
      setLoading(false);
    };
    fetch();
  }, []);
  
  if (loading) return <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontFamily: F.body, color: C.champagne }}>Cargando...</div></div>;
  
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, paddingTop: '100px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 40px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontFamily: F.display, fontSize: 'clamp(2.5rem,6vw,4rem)', fontStyle: 'italic', marginBottom: '24px' }}><GoldShimmer>Galería de Momentos</GoldShimmer></h1>
          <p style={{ fontFamily: F.body, fontSize: '1.063rem', color: C.champagne, opacity: 0.8 }}>{uploads.length} recuerdos compartidos</p>
        </div>
        
        {uploads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px', opacity: 0.3 }}>📷</div>
            <p style={{ fontFamily: F.body, fontSize: '1.125rem', color: C.champagne, opacity: 0.7 }}>Aún no hay recuerdos compartidos.</p>
            <div style={{ marginTop: '32px' }}><Button onClick={() => navigate('rsvp')}>Confirmar y Compartir</Button></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '24px' }}>
            {uploads.map((u, i) => (
              <div key={i} onClick={() => setLightbox(u)} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${C.gold}`, background: `linear-gradient(135deg,${C.richBlack},${C.midnight})` }}>
                {u.tipo_archivo === 'video' ? <video src={u.archivo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src={u.archivo_url} alt={u.nombre_persona} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.8))', padding: '20px', color: C.champagne }}>
                  <div style={{ fontFamily: F.elegant, fontSize: '1rem' }}>{u.nombre_persona}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {lightbox && (
          <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: `2px solid ${C.gold}`, color: C.gold, fontSize: '2rem', width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer' }}>×</button>
            <div style={{ maxWidth: '90vw', maxHeight: '90vh', textAlign: 'center' }}>
              {lightbox.tipo_archivo === 'video' ? <video src={lightbox.archivo_url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }} /> : <img src={lightbox.archivo_url} alt={lightbox.nombre_persona} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }} />}
              <div style={{ marginTop: '24px', color: C.champagne }}>
                <div style={{ fontFamily: F.elegant, fontSize: '1.5rem', marginBottom: '8px' }}>{lightbox.nombre_persona}</div>
                {lightbox.mensaje && <div style={{ fontFamily: F.body, fontSize: '1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>{lightbox.mensaje}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Input component (moved outside to prevent re-render bug)
const Input = ({ label, value, onChange, type = 'text', placeholder = '', error }) => (
  <div style={{ marginBottom: '24px' }}>
    <label style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.2em', color: C.gold, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `2px solid ${error ? '#c0392b' : C.bronze}`, color: C.champagne, padding: '14px 18px', fontSize: '1rem', fontFamily: F.body, outline: 'none', borderRadius: '4px', boxSizing: 'border-box' }} />
    {error && <p style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '6px', fontWeight: 600 }}>{error}</p>}
  </div>
);

function RSVPPage({ navigate, setRsvpData }) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', acompanante: false, nombreAcomp: '', restricciones: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({ confirmados: 0, libres: EVENTO.cupo });
  
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('rsvps').select('acompanante');
      if (data) {
        const confirmados = data.length;
        const totalPersonas = confirmados + data.filter(r => r.acompanante).length;
        setStats({ confirmados, libres: EVENTO.cupo - totalPersonas });
      }
    };
    fetch();
  }, []);
  
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };
  
  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Por favor ingresa tu nombre completo';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Ingresa un correo válido';
    if (form.acompanante && !form.nombreAcomp.trim()) e.nombreAcomp = 'Ingresa el nombre de tu acompañante';
    return e;
  };
  
  const enviar = async () => {
    const e = validar();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    
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
      console.error(err);
      setErrors({ general: 'Error al guardar. Intenta de nuevo.' });
      setSubmitting(false);
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, paddingTop: '100px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: F.display, fontSize: 'clamp(2.5rem,6vw,4rem)', fontStyle: 'italic', marginBottom: '24px' }}><GoldShimmer>Confirmar Asistencia</GoldShimmer></h1>
          <p style={{ fontFamily: F.body, fontSize: '1rem', color: C.champagne, marginBottom: '16px', opacity: 0.8 }}>{stats.libres} lugares disponibles de {EVENTO.cupo}</p>
          <div style={{ width: '320px', height: '6px', background: 'rgba(212,175,55,0.15)', margin: '0 auto', borderRadius: '3px', overflow: 'hidden', border: `1px solid ${C.bronze}` }}>
            <div style={{ width: `${((EVENTO.cupo - stats.libres) / EVENTO.cupo) * 100}%`, height: '100%', background: `linear-gradient(90deg,${C.bronze},${C.gold})`, transition: 'width 1s' }} />
          </div>
        </div>
        
        <div style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `2px solid ${C.gold}`, borderRadius: '8px', padding: '48px', boxShadow: `0 0 40px rgba(212,175,55,0.1)` }}>
          {errors.general && <div style={{ background: 'rgba(192,57,43,0.1)', border: `2px solid #c0392b`, padding: '16px', borderRadius: '6px', marginBottom: '24px', color: '#e74c3c' }}>⚠️ {errors.general}</div>}
          
          <Input label="Nombre Completo" value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Tu nombre y apellido" error={errors.nombre} />
          <Input label="Correo Electrónico" value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="correo@ejemplo.com" error={errors.email} />
          <Input label="Teléfono (Opcional)" value={form.telefono} onChange={e => set('telefono', e.target.value)} type="tel" placeholder="+502 0000-0000" />
          
          <div style={{ marginBottom: '24px' }}>
            <div onClick={() => set('acompanante', !form.acompanante)} style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', padding: '18px', border: `2px solid ${form.acompanante ? C.gold : C.bronze}`, borderRadius: '6px', background: form.acompanante ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: '52px', height: '28px', borderRadius: '14px', background: form.acompanante ? `linear-gradient(135deg,${C.bronze},${C.gold})` : C.bronze, position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: form.acompanante ? '26px' : '3px', width: '22px', height: '22px', borderRadius: '50%', background: C.ivory, transition: 'left 0.3s' }} />
              </div>
              <span style={{ fontFamily: F.body, fontSize: '1rem', color: C.champagne }}>Llevaré un acompañante (máx. 1)</span>
            </div>
          </div>
          
          {form.acompanante && <Input label="Nombre del Acompañante" value={form.nombreAcomp} onChange={e => set('nombreAcomp', e.target.value)} placeholder="Nombre y apellido" error={errors.nombreAcomp} />}
          
          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.2em', color: C.gold, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Restricciones Dietéticas (Opcional)</label>
            <textarea value={form.restricciones} onChange={e => set('restricciones', e.target.value)} placeholder="Ej: Vegetariano, sin gluten, alergias..." rows={3} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `2px solid ${C.bronze}`, color: C.champagne, padding: '14px 18px', fontSize: '1rem', fontFamily: F.body, outline: 'none', borderRadius: '4px', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          
          <Button onClick={enviar} disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'CONFIRMANDO...' : 'Confirmar Asistencia'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Confirmacion({ navigate, rsvpData }) {
  const uploadUrl = `${window.location.origin}?upload=${rsvpData?.uploadToken || ''}`;
  
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px' }}>
      <div style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `2px solid ${C.gold}`, borderRadius: '8px', padding: '52px 44px', maxWidth: '680px', textAlign: 'center', boxShadow: `0 0 40px rgba(212,175,55,0.1)` }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🥂</div>
        <div style={{ fontFamily: F.accent, fontSize: '0.875rem', letterSpacing: '0.3em', color: C.gold, textTransform: 'uppercase', marginBottom: '16px' }}>¡Confirmación Recibida!</div>
        <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontStyle: 'italic', marginBottom: '16px', color: C.gold }}>¡Nos Alegra Contar Contigo!</</h2>
        <div style={{ fontFamily: F.decorative, fontSize: 'clamp(1.3rem,4vw,2rem)', marginBottom: '24px', color: C.champagne, fontStyle: 'italic' }}>{rsvpData?.nombre}</div>
        <p style={{ fontFamily: F.body, fontSize: '1.02rem', color: C.champagne, opacity: 0.8, marginBottom: '28px' }}>
          Tu asistencia ha sido registrada{rsvpData?.acompanante && rsvpData.nombreAcomp ? ` junto con ${rsvpData.nombreAcomp}` : ''}.
        </p>
        
        <div style={{ background: 'rgba(212,175,55,0.08)', border: `2px solid ${C.gold}`, padding: '26px', borderRadius: '6px', marginBottom: '28px' }}>
          <p style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.2em', color: C.gold, textTransform: 'uppercase', marginBottom: '14px' }}>Tu Enlace Personal</p>
          <input readOnly value={uploadUrl} onClick={e => e.target.select()} style={{ width: '100%', fontSize: '0.8rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.3)', border: `1px solid ${C.bronze}`, color: C.champagne, padding: '12px', borderRadius: '4px', fontFamily: 'monospace', marginBottom: '14px' }} />
          <p style={{ fontFamily: F.body, fontSize: '0.9rem', lineHeight: 1.8, color: C.champagne, opacity: 0.9 }}>
            Usa este enlace para subir una foto o video para Zandra. Guárdalo bien.
          </p>
        </div>
        
        <Button onClick={() => navigate('home')}>← Volver al Inicio</Button>
      </div>
    </div>
  );
}

function SubirArchivo({ navigate, uploadToken }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState('');
  const [nombre, setNombre] = useState('');
  const [drag, setDrag] = useState(false);
  const [done, setDone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tipo, setTipo] = useState('');
  const [videoError, setVideoError] = useState('');
  
  const handleFile = (f) => {
    if (!f) return;
    setVideoError('');
    if (tipo === 'video') {
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => {
        URL.revokeObjectURL(vid.src);
        if (vid.duration > 60) {
          setVideoError('El video excede 1 minuto.');
          setFile(null); setPreview(null);
        } else {
          setFile(f);
          setPreview({ url: URL.createObjectURL(f), tipo: 'video' });
        }
      };
      vid.src = URL.createObjectURL(f);
    } else {
      setFile(f);
      setPreview({ url: URL.createObjectURL(f), tipo: 'imagen' });
    }
  };
  
  const enviar = async () => {
    if (!file || !nombre.trim() || !tipo) return;
    setUploading(true);
    
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', CLOUDINARY_PRESET);
      fd.append('folder', 'zandra-60');
      
      const resourceType = tipo === 'video' ? 'video' : 'image';
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${resourceType}/upload`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Error subiendo');
      const { secure_url } = await res.json();
      
      const { error } = await supabase.from('uploads').insert([{ nombre_persona: nombre, tipo_archivo: tipo, archivo_url: secure_url, mensaje: msg || null }]);
      if (error) throw error;
      
      setDone(true);
    } catch (err) {
      console.error(err);
      alert('Error al subir. Intenta de nuevo.');
      setUploading(false);
    }
  };
  
  if (done) return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `2px solid ${C.gold}`, borderRadius: '8px', padding: '52px 44px', maxWidth: '580px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✨</div>
        <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontStyle: 'italic', marginBottom: '24px', color: C.gold }}>¡Recibido con Amor!</h2>
        <p style={{ fontFamily: F.body, fontSize: '1rem', color: C.champagne, opacity: 0.85, marginBottom: '28px' }}>
          Tu mensaje fue enviado exitosamente. Será parte de la sorpresa especial.
        </p>
        <Button onClick={() => navigate('home')}>← Volver al Inicio</Button>
      </div>
    </div>
  );
  
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, paddingTop: '100px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 40px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: F.display, fontSize: 'clamp(2rem,5vw,3rem)', fontStyle: 'italic', marginBottom: '16px' }}><GoldShimmer>Un Regalo para Zandra</GoldShimmer></h1>
          <p style={{ fontFamily: F.body, fontSize: '1rem', color: C.champagne, opacity: 0.8 }}>Comparte un recuerdo especial</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { k: 'foto-con-ella', t: 'Foto con Ella', d: 'Una foto junto a Zandra' },
            { k: 'recuerdo', t: 'Recuerdo Especial', d: 'Momento memorable' },
            { k: 'video', t: 'Video (1 min)', d: 'Mensaje de felicitación' }
          ].map(o => (
            <div key={o.k} onClick={() => { setTipo(o.k); setFile(null); setPreview(null); setVideoError(''); }} style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `${tipo === o.k ? 3 : 1}px solid ${tipo === o.k ? C.gold : 'rgba(212,175,55,0.3)'}`, borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
              <div style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.15em', color: tipo === o.k ? C.gold : C.champagne, textTransform: 'uppercase', marginBottom: '8px' }}>{o.t}</div>
              <div style={{ fontFamily: F.body, fontSize: '0.875rem', color: C.champagne, opacity: 0.7 }}>{o.d}</div>
            </div>
          ))}
        </div>
        
        <div style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `2px solid ${C.gold}`, borderRadius: '8px', padding: '40px' }}>
          <Input label="Tu Nombre Completo" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="¿Cómo te llamas?" />
          
          {tipo && (
            <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }} onClick={() => document.getElementById('fileInput').click()} style={{ border: `3px dashed ${drag ? C.gold : C.bronze}`, borderRadius: '6px', padding: '44px 28px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', background: drag ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)' }}>
              <input id="fileInput" type="file" accept={tipo === 'video' ? 'video/*' : 'image/*'} style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              <div style={{ fontSize: '3rem', marginBottom: '14px', color: C.gold }}>📎</div>
              <div style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.2em', color: C.gold, textTransform: 'uppercase', marginBottom: '8px' }}>{file ? file.name : tipo === 'video' ? 'VIDEO' : 'IMAGEN'}</div>
              <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.champagne, opacity: 0.6 }}>{file ? 'Haz clic para cambiar' : 'Arrastra aquí o haz clic'}</p>
            </div>
          )}
          
          {videoError && <div style={{ background: 'rgba(192,57,43,0.1)', border: `2px solid #c0392b`, padding: '14px', borderRadius: '6px', marginBottom: '20px', color: '#e74c3c' }}>⚠️ {videoError}</div>}
          
          {preview && !videoError && (
            <div style={{ marginBottom: '24px', textAlign: 'center', borderRadius: '6px', overflow: 'hidden', border: `3px solid ${C.gold}` }}>
              {preview.tipo === 'imagen' ? <img src={preview.url} alt="preview" style={{ maxWidth: '100%', maxHeight: '280px', display: 'block', margin: '0 auto' }} /> : <video src={preview.url} controls style={{ maxWidth: '100%', maxHeight: '280px', display: 'block', margin: '0 auto' }} />}
            </div>
          )}
          
          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.2em', color: C.gold, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Mensaje para Zandra (Opcional)</label>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Escribe unas palabras..." rows={3} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `2px solid ${C.bronze}`, color: C.champagne, padding: '14px 18px', fontSize: '1rem', fontFamily: F.body, outline: 'none', borderRadius: '4px', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          
          <Button onClick={enviar} disabled={!file || !nombre.trim() || uploading || !!videoError || !tipo} style={{ width: '100%' }}>
            {uploading ? 'ENVIANDO...' : 'Enviar Mi Regalo'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Admin({ navigate }) {
  const [pw, setPw] = useState('');
  const [auth, setAuth] = useState(false);
  const [err, setErr] = useState('');
  const [rsvps, setRsvps] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const intentar = () => pw === 'gatsby2026' ? setAuth(true) : setErr('Contraseña incorrecta');
  
  useEffect(() => {
    if (!auth) return;
    const fetch = async () => {
      const [r, u] = await Promise.all([
        supabase.from('rsvps').select('*').order('created_at', { ascending: false }),
        supabase.from('uploads').select('*').order('created_at', { ascending: false })
      ]);
      if (r.data) setRsvps(r.data);
      if (u.data) setUploads(u.data);
      setLoading(false);
    };
    fetch();
  }, [auth]);
  
  if (!auth) return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `2px solid ${C.gold}`, borderRadius: '8px', padding: '48px 40px', maxWidth: '420px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: F.display, fontSize: '2rem', fontStyle: 'italic', marginBottom: '24px', color: C.gold }}>Panel de Administración</h2>
        <Input label="Contraseña" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" />
        {err && <p style={{ color: '#e74c3c', fontSize: '0.875rem', marginBottom: '12px' }}>{err}</p>}
        <Button onClick={intentar} style={{ width: '100%', marginBottom: '16px' }}>Ingresar</Button>
        <Button onClick={() => navigate('home')} variant="secondary" style={{ width: '100%' }}>← Volver</Button>
      </div>
    </div>
  );
  
  if (loading) return <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontFamily: F.body, color: C.champagne }}>Cargando...</div></div>;
  
  const confirmados = rsvps.length;
  const totalPersonas = confirmados + rsvps.filter(r => r.acompanante).length;
  
  const exportCSV = () => {
    const headers = 'Nombre,Email,Teléfono,Acompañante,Nombre Acompañante,Restricciones,Fecha\n';
    const rows = rsvps.map(r => `"${r.nombre}","${r.email}","${r.telefono || ''}","${r.acompanante ? 'Sí' : 'No'}","${r.nombre_acomp || ''}","${r.restricciones_dieteticas || ''}","${new Date(r.created_at).toLocaleDateString()}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvps-zandra-60.csv';
    a.click();
  };
  
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`, paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: F.display, fontSize: 'clamp(2rem,5vw,3rem)', fontStyle: 'italic', color: C.gold }}>Panel Admin</h1>
          <Button onClick={() => navigate('home')}>← Salir</Button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '24px', marginBottom: '60px' }}>
          {[
            { l: 'Confirmados', v: confirmados },
            { l: 'Total Personas', v: totalPersonas },
            { l: 'Archivos', v: uploads.length },
            { l: 'Cupos Libres', v: EVENTO.cupo - totalPersonas }
          ].map(s => (
            <div key={s.l} style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `2px solid ${C.gold}`, borderRadius: '8px', padding: '28px', textAlign: 'center' }}>
              <div style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.2em', color: C.champagne, textTransform: 'uppercase', marginBottom: '12px', opacity: 0.7 }}>{s.l}</div>
              <div style={{ fontFamily: F.elegant, fontSize: '3rem', color: C.gold }}>{s.v}</div>
            </div>
          ))}
        </div>
        
        <div style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `2px solid ${C.gold}`, borderRadius: '8px', overflow: 'hidden', marginBottom: '40px' }}>
          <div style={{ padding: '24px', borderBottom: `1px solid ${C.bronze}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: F.elegant, fontSize: '1.5rem', color: C.gold }}>Confirmaciones ({confirmados})</h3>
            <Button onClick={exportCSV}>Exportar CSV</Button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.bronze}` }}>
                  {['Nombre', 'Email', 'Acompañante', 'Restricciones', 'Fecha'].map(h => <th key={h} style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.15em', color: C.gold, textTransform: 'uppercase', padding: '16px', textAlign: 'left' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rsvps.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(212,175,55,0.1)` }}>
                    <td style={{ fontFamily: F.body, fontSize: '0.938rem', color: C.champagne, padding: '16px' }}>{r.nombre}</td>
                    <td style={{ fontFamily: F.body, fontSize: '0.875rem', color: C.champagne, padding: '16px', opacity: 0.7 }}>{r.email}</td>
                    <td style={{ fontFamily: F.body, fontSize: '0.875rem', color: r.acompanante ? C.gold : C.champagne, padding: '16px', opacity: 0.8 }}>{r.acompanante ? r.nombre_acomp : '—'}</td>
                    <td style={{ fontFamily: F.body, fontSize: '0.875rem', color: C.champagne, padding: '16px', opacity: 0.7 }}>{r.restricciones_dieteticas || '—'}</td>
                    <td style={{ fontFamily: F.body, fontSize: '0.813rem', color: C.champagne, padding: '16px', opacity: 0.6 }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div style={{ background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`, border: `2px solid ${C.gold}`, borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: `1px solid ${C.bronze}` }}>
            <h3 style={{ fontFamily: F.elegant, fontSize: '1.5rem', color: C.gold }}>Archivos Recibidos ({uploads.length})</h3>
          </div>
          <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '20px' }}>
            {uploads.map((u, i) => (
              <div key={i} style={{ border: `1px solid ${C.bronze}`, borderRadius: '6px', padding: '20px', background: 'rgba(212,175,55,0.03)' }}>
                <div style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.15em', color: C.gold, textTransform: 'uppercase', marginBottom: '8px' }}>{u.nombre_persona}</div>
                <div style={{ fontFamily: F.body, fontSize: '0.875rem', color: C.champagne, opacity: 0.7, marginBottom: '12px' }}>{u.tipo_archivo}</div>
                <a href={u.archivo_url} target="_blank" rel="noreferrer" style={{ fontFamily: F.accent, fontSize: '0.75rem', letterSpacing: '0.15em', color: C.gold, textDecoration: 'none', border: `1px solid ${C.gold}`, padding: '10px 20px', display: 'inline-block', borderRadius: '4px' }}>Ver Archivo</a>
              </div>
            ))}
            {uploads.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', fontFamily: F.body, color: C.champagne, opacity: 0.5 }}>No hay archivos todavía</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [rsvpData, setRsvpData] = useState(null);
  const [uploadToken, setUploadToken] = useState(null);
  
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400;1,700&family=Montserrat:wght@300;400;600&family=Raleway:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const style = document.createElement('style');
    style.textContent = `*{margin:0;padding:0;box-sizing:border-box}body{background:${C.deepBlack};color:${C.champagne};overflow-x:hidden}::selection{background:${C.gold};color:${C.deepBlack}}@keyframes shimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`;
    document.head.appendChild(style);
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get('upload');
    if (token) {
      setUploadToken(token);
      setPage('subir');
    }
  }, []);
  
  const navigate = p => { setPage(p); window.scrollTo(0, 0); };
  
  return (
    <div>
      <Navigation current={page} navigate={navigate} />
      {page === 'home' && <HomePage navigate={navigate} />}
      {page === 'details' && <DetailsPage navigate={navigate} />}
      {page === 'schedule' && <SchedulePage navigate={navigate} />}
      {page === 'gallery' && <GalleryPage navigate={navigate} />}
      {page === 'rsvp' && <RSVPPage navigate={navigate} setRsvpData={setRsvpData} />}
      {page === 'confirmacion' && <Confirmacion navigate={navigate} rsvpData={rsvpData} />}
      {page === 'subir' && <SubirArchivo navigate={navigate} uploadToken={uploadToken} />}
      {page === 'admin' && <Admin navigate={navigate} />}
    </div>
  );
}
