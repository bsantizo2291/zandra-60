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

const C = {
  deepBlack: '#0a0806',
  richBlack: '#15120e',
  midnight: '#1c1814',
  champagne: '#f7e7ce',
  gold: '#d4af37',
  lightGold: '#f4e4c1',
  bronze: '#b8860b',
  ivory: '#fffff0'
};

const F = {
  display: "'Playfair Display',Georgia,serif",
  decorative: "'Cormorant Garamond',Georgia,serif",
  elegant: "'Cinzel',Georgia,serif",
  body: "'Montserrat',sans-serif",
  accent: "'Raleway',sans-serif"
};

function GoldShimmer({ children, style = {} }) {
  return (
    <span style={{
      background: `linear-gradient(120deg,${C.bronze} 0%,${C.gold} 30%,${C.lightGold} 50%,${C.gold} 70%,${C.bronze} 100%)`,
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      animation: 'shimmer 4s ease-in-out infinite',
      ...style
    }}>
      {children}
    </span>
  );
}

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
  
  const labels = { days: 'Días', hours: 'Horas', minutes: 'Minutos', seconds: 'Segundos' };
  
  return (
    <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {Object.entries(time).map(([k, v]) => (
        <div key={k} style={{ textAlign: 'center' }}>
          <div style={{
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
            border: `2px solid ${C.gold}`,
            borderRadius: '8px',
            boxShadow: `0 0 30px rgba(212,175,55,0.2)`,
            marginBottom: '12px'
          }}>
            <GoldShimmer style={{ fontSize: '2.5rem', fontFamily: F.elegant, fontWeight: 600 }}>
              {String(v).padStart(2, '0')}
            </GoldShimmer>
          </div>
          <div style={{
            fontFamily: F.accent,
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: C.champagne,
            textTransform: 'uppercase',
            opacity: 0.7
          }}>
            {labels[k]}
          </div>
        </div>
      ))}
    </div>
  );
}

function Navigation({ current, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const links = [
    { id: 'home', label: 'Inicio' },
    { id: 'details', label: 'Detalles' },
    { id: 'schedule', label: 'Itinerario' },
    { id: 'gallery', label: 'Galería' },
    { id: 'rsvp', label: 'Confirmar' }
  ];
  
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: scrolled ? 'rgba(10,8,6,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? `1px solid rgba(212,175,55,0.2)` : 'none',
      transition: 'all 0.4s',
      padding: scrolled ? '16px 0' : '24px 0'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div
          style={{ fontFamily: F.display, fontSize: '1.5rem', fontStyle: 'italic', cursor: 'pointer' }}
          onClick={() => navigate('home')}
        >
          <GoldShimmer>Zandra 60</GoldShimmer>
        </div>
        
        <div style={{ display: 'flex', gap: '40px' }}>
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => navigate(link.id)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: F.accent,
                fontSize: '0.875rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: current === link.id ? C.gold : C.champagne,
                cursor: 'pointer',
                padding: '8px 0',
                position: 'relative',
                transition: 'color 0.3s',
                opacity: current === link.id ? 1 : 0.7
              }}
            >
              {link.label}
              {current === link.id && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: C.gold,
                  boxShadow: `0 0 8px ${C.gold}`
                }} />
              )}
            </button>
          ))}
          <button
            onClick={() => navigate('admin')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: F.accent,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.3)',
              cursor: 'pointer',
              padding: '8px 0'
            }}
          >
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
}

function Button({ onClick, variant = 'primary', children, disabled = false, style = {} }) {
  const [hover, setHover] = useState(false);
  
  const baseStyle = {
    padding: '18px 48px',
    fontFamily: F.accent,
    fontSize: '0.875rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s',
    fontWeight: 600,
    opacity: disabled ? 0.5 : 1
  };
  
  const variantStyle = variant === 'primary' ? {
    background: `linear-gradient(135deg,${C.bronze},${C.gold})`,
    color: C.deepBlack,
    border: 'none',
    boxShadow: `0 4px 20px rgba(212,175,55,0.3)`
  } : {
    background: 'transparent',
    color: C.gold,
    border: `2px solid ${C.gold}`
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...baseStyle,
        ...variantStyle,
        transform: hover && !disabled ? 'translateY(-2px)' : 'none',
        ...style
      }}
    >
      {children}
    </button>
  );
}

function HomePage({ navigate }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let particles = [];
    let animationId;
    
    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * W;
        this.y = H + Math.random() * 100;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -Math.random() * 1.5 - 0.5;
        this.size = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.hue = Math.random() * 20 + 40;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < -10 || this.x < -10 || this.x > W + 10) {
          this.reset();
        }
      }
      
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${this.hue},70%,70%,1)`);
        gradient.addColorStop(1, `hsla(${this.hue},70%,50%,0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }
    
    function animate() {
      ctx.fillStyle = 'rgba(10,8,6,0.05)';
      ctx.fillRect(0, 0, W, H);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: `radial-gradient(ellipse at top,${C.midnight},${C.deepBlack})`
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: `radial-gradient(ellipse,rgba(212,175,55,0.15),transparent 70%)`,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 20px 80px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '900px' }}>
          
          <div style={{
            fontFamily: F.accent,
            fontSize: '0.875rem',
            letterSpacing: '0.3em',
            color: C.champagne,
            textTransform: 'uppercase',
            marginBottom: '24px',
            opacity: 0.7
          }}>
            Una Celebración de Elegancia
          </div>
          
          <h1 style={{
            fontFamily: F.display,
            fontSize: 'clamp(3rem,8vw,6rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.1,
            marginBottom: '32px'
          }}>
            <GoldShimmer>Zandra</GoldShimmer>
          </h1>
          
          <div style={{
            fontFamily: F.decorative,
            fontSize: 'clamp(1.5rem,4vw,2.5rem)',
            color: C.champagne,
            marginBottom: '16px',
            fontStyle: 'italic'
          }}>
            B. Veliz Ortiz
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            margin: '40px 0'
          }}>
            <div style={{ width: '80px', height: '1px', background: `linear-gradient(90deg,transparent,${C.gold})` }} />
            <div style={{ width: '8px', height: '8px', background: C.gold, transform: 'rotate(45deg)' }} />
            <div style={{ fontFamily: F.elegant, fontSize: 'clamp(3rem,10vw,5rem)', lineHeight: 1 }}>
              <GoldShimmer>60</GoldShimmer>
            </div>
            <div style={{ width: '8px', height: '8px', background: C.gold, transform: 'rotate(45deg)' }} />
            <div style={{ width: '80px', height: '1px', background: `linear-gradient(90deg,${C.gold},transparent)` }} />
          </div>
          
          <div style={{
            fontFamily: F.accent,
            fontSize: '1.125rem',
            letterSpacing: '0.2em',
            color: C.gold,
            textTransform: 'uppercase',
            marginBottom: '48px'
          }}>
            Años de Brillantez
          </div>
          
          <div style={{
            fontFamily: F.decorative,
            fontSize: 'clamp(1.5rem,3vw,2rem)',
            color: C.champagne,
            marginBottom: '32px',
            fontStyle: 'italic'
          }}>
            Una Velada Gatsby
          </div>
          
          <div style={{ fontFamily: F.body, fontSize: '1rem', color: C.champagne, marginBottom: '12px', opacity: 0.9 }}>
            Sábado, 5 de Septiembre de 2026
          </div>
          <div style={{ fontFamily: F.body, fontSize: '0.938rem', color: C.champagne, marginBottom: '8px', opacity: 0.8 }}>
            19:00 – 00:00 hrs
          </div>
          <div style={{ fontFamily: F.body, fontSize: '0.938rem', color: C.champagne, marginBottom: '56px', opacity: 0.7 }}>
            El Club Español, Guatemala
          </div>
          
          <CountdownTimer />
          
          <div style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            marginTop: '56px',
            flexWrap: 'wrap'
          }}>
            <Button onClick={() => navigate('rsvp')}>Confirmar Asistencia</Button>
            <Button onClick={() => navigate('details')} variant="secondary">Ver Detalles del Evento</Button>
          </div>
          
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}

function DetailsPage({ navigate }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`,
      paddingTop: '100px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 100px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{
            fontFamily: F.display,
            fontSize: 'clamp(2.5rem,6vw,4rem)',
            fontStyle: 'italic',
            marginBottom: '24px'
          }}>
            <GoldShimmer>Detalles del Evento</GoldShimmer>
          </h1>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: '32px',
          marginBottom: '80px'
        }}>
          <div style={{
            background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
            border: `1px solid ${C.gold}`,
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📅</div>
            <div style={{
              fontFamily: F.accent,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: C.gold,
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Fecha
            </div>
            <div style={{ fontFamily: F.body, fontSize: '0.938rem', color: C.champagne }}>
              Sábado, 5 de Septiembre de 2026
            </div>
          </div>
          
          <div style={{
            background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
            border: `1px solid ${C.gold}`,
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🕖</div>
            <div style={{
              fontFamily: F.accent,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: C.gold,
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Horario
            </div>
            <div style={{ fontFamily: F.body, fontSize: '0.938rem', color: C.champagne }}>
              19:00 – 00:00 hrs
            </div>
          </div>
          
          <div style={{
            background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
            border: `1px solid ${C.gold}`,
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📍</div>
            <div style={{
              fontFamily: F.accent,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: C.gold,
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Lugar
            </div>
            <div style={{ fontFamily: F.body, fontSize: '0.938rem', color: C.champagne }}>
              El Club Español<br/>Área Fuentecilla
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Button onClick={() => window.open(EVENTO.mapsUrl, '_blank')}>
            Abrir en Google Maps
          </Button>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: F.display,
            fontSize: 'clamp(1.8rem,4vw,2.8rem)',
            fontStyle: 'italic',
            marginBottom: '24px'
          }}>
            <GoldShimmer>Código de Vestimenta</GoldShimmer>
          </h2>
          <p style={{
            fontFamily: F.body,
            fontSize: '1.063rem',
            color: C.champagne,
            maxWidth: '700px',
            margin: '0 auto 32px',
            lineHeight: 1.8,
            opacity: 0.9
          }}>
            Etiqueta rigurosa con glamour Gatsby. Negro, dorado, champagne.
          </p>
        </div>
        
      </div>
    </div>
  );
}

function SchedulePage({ navigate }) {
  const timeline = [
    { time: '19:00', title: 'Recepción', desc: 'Bienvenida con coctel de champagne' },
    { time: '19:30', title: 'Cena de Gala', desc: 'Menú de tres tiempos' },
    { time: '21:00', title: 'Brindis', desc: 'Tributo a Zandra' },
    { time: '22:00', title: 'Baile', desc: 'Música años 20' }
  ];
  
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`,
      paddingTop: '100px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 40px 100px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{
            fontFamily: F.display,
            fontSize: 'clamp(2.5rem,6vw,4rem)',
            fontStyle: 'italic'
          }}>
            <GoldShimmer>Itinerario</GoldShimmer>
          </h1>
        </div>
        
        <div style={{ position: 'relative' }}>
          {timeline.map((event, i) => (
            <div key={i} style={{ position: 'relative', paddingLeft: '120px', marginBottom: '60px' }}>
              <div style={{
                position: 'absolute',
                left: '0',
                top: '8px',
                width: '80px',
                height: '80px',
                border: `2px solid ${C.gold}`,
                borderRadius: '50%',
                background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontFamily: F.elegant, fontSize: '1.125rem', color: C.gold }}>
                  {event.time}
                </div>
              </div>
              
              <div style={{
                background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
                border: `1px solid ${C.gold}`,
                borderRadius: '8px',
                padding: '32px'
              }}>
                <h3 style={{
                  fontFamily: F.elegant,
                  fontSize: '1.5rem',
                  color: C.gold,
                  marginBottom: '12px'
                }}>
                  {event.title}
                </h3>
                <p style={{
                  fontFamily: F.body,
                  fontSize: '1rem',
                  color: C.champagne,
                  opacity: 0.9
                }}>
                  {event.desc}
                </p>
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
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUploads = async () => {
      const { data } = await supabase.from('uploads').select('*').order('created_at', { ascending: false });
      if (data) setUploads(data);
      setLoading(false);
    };
    fetchUploads();
  }, []);
  
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontFamily: F.body, color: C.champagne }}>Cargando...</div>
      </div>
    );
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`,
      paddingTop: '100px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 40px 100px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{
            fontFamily: F.display,
            fontSize: 'clamp(2.5rem,6vw,4rem)',
            fontStyle: 'italic',
            marginBottom: '24px'
          }}>
            <GoldShimmer>Galería</GoldShimmer>
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '1.063rem', color: C.champagne, opacity: 0.8 }}>
            {uploads.length} recuerdos compartidos
          </p>
        </div>
        
        {uploads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px', opacity: 0.3 }}>📷</div>
            <p style={{ fontFamily: F.body, fontSize: '1.125rem', color: C.champagne, opacity: 0.7 }}>
              Aún no hay recuerdos compartidos.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
            gap: '24px'
          }}>
            {uploads.map((u, i) => (
              <div key={i} style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '8px',
                overflow: 'hidden',
                border: `2px solid ${C.gold}`,
                background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`
              }}>
                {u.tipo_archivo === 'video' ? (
                  <video src={u.archivo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src={u.archivo_url} alt={u.nombre_persona} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent,rgba(0,0,0,0.8))',
                  padding: '20px',
                  color: C.champagne
                }}>
                  <div style={{ fontFamily: F.elegant, fontSize: '1rem' }}>{u.nombre_persona}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}

const InputField = ({ label, value, onChange, type = 'text', placeholder = '', error }) => (
  <div style={{ marginBottom: '24px' }}>
    <label style={{
      fontFamily: F.accent,
      fontSize: '0.75rem',
      letterSpacing: '0.2em',
      color: C.gold,
      textTransform: 'uppercase',
      display: 'block',
      marginBottom: '8px'
    }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.03)',
        border: `2px solid ${error ? '#c0392b' : C.bronze}`,
        color: C.champagne,
        padding: '14px 18px',
        fontSize: '1rem',
        fontFamily: F.body,
        outline: 'none',
        borderRadius: '4px',
        boxSizing: 'border-box'
      }}
    />
    {error && (
      <p style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '6px', fontWeight: 600 }}>
        {error}
      </p>
    )}
  </div>
);

function RSVPPage({ navigate, setRsvpData }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    acompanante: false,
    nombreAcomp: '',
    restricciones: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({ confirmados: 0, libres: EVENTO.cupo });
  
  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from('rsvps').select('acompanante');
      if (data) {
        const confirmados = data.length;
        const totalPersonas = confirmados + data.filter(r => r.acompanante).length;
        setStats({ confirmados, libres: EVENTO.cupo - totalPersonas });
      }
    };
    fetchStats();
  }, []);
  
  const updateField = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: null }));
  };
  
  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Ingresa tu nombre completo';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Ingresa un correo válido';
    if (form.acompanante && !form.nombreAcomp.trim()) e.nombreAcomp = 'Ingresa el nombre de tu acompañante';
    return e;
  };
  
  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
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
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`,
      paddingTop: '100px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px 100px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontFamily: F.display,
            fontSize: 'clamp(2.5rem,6vw,4rem)',
            fontStyle: 'italic',
            marginBottom: '24px'
          }}>
            <GoldShimmer>Confirmar Asistencia</GoldShimmer>
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '1rem', color: C.champagne, marginBottom: '16px', opacity: 0.8 }}>
            {stats.libres} lugares disponibles de {EVENTO.cupo}
          </p>
        </div>
        
        <div style={{
          background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
          border: `2px solid ${C.gold}`,
          borderRadius: '8px',
          padding: '48px',
          boxShadow: `0 0 40px rgba(212,175,55,0.1)`
        }}>
          
          {errors.general && (
            <div style={{
              background: 'rgba(192,57,43,0.1)',
              border: '2px solid #c0392b',
              padding: '16px',
              borderRadius: '6px',
              marginBottom: '24px',
              color: '#e74c3c'
            }}>
              {errors.general}
            </div>
          )}
          
          <InputField
            label="Nombre Completo"
            value={form.nombre}
            onChange={e => updateField('nombre', e.target.value)}
            placeholder="Tu nombre y apellido"
            error={errors.nombre}
          />
          
          <InputField
            label="Correo Electrónico"
            type="email"
            value={form.email}
            onChange={e => updateField('email', e.target.value)}
            placeholder="correo@ejemplo.com"
            error={errors.email}
          />
          
          <InputField
            label="Teléfono (Opcional)"
            type="tel"
            value={form.telefono}
            onChange={e => updateField('telefono', e.target.value)}
            placeholder="+502 0000-0000"
          />
          
          <div style={{ marginBottom: '24px' }}>
            <div
              onClick={() => updateField('acompanante', !form.acompanante)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                padding: '18px',
                border: `2px solid ${form.acompanante ? C.gold : C.bronze}`,
                borderRadius: '6px',
                background: form.acompanante ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)'
              }}
            >
              <div style={{
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                background: form.acompanante ? `linear-gradient(135deg,${C.bronze},${C.gold})` : C.bronze,
                position: 'relative',
                flexShrink: 0
              }}>
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  left: form.acompanante ? '26px' : '3px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: C.ivory,
                  transition: 'left 0.3s'
                }} />
              </div>
              <span style={{ fontFamily: F.body, fontSize: '1rem', color: C.champagne }}>
                Llevaré un acompañante (máx. 1)
              </span>
            </div>
          </div>
          
          {form.acompanante && (
            <InputField
              label="Nombre del Acompañante"
              value={form.nombreAcomp}
              onChange={e => updateField('nombreAcomp', e.target.value)}
              placeholder="Nombre y apellido"
              error={errors.nombreAcomp}
            />
          )}
          
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              fontFamily: F.accent,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: C.gold,
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}>
              Restricciones Dietéticas (Opcional)
            </label>
            <textarea
              value={form.restricciones}
              onChange={e => updateField('restricciones', e.target.value)}
              placeholder="Ej: Vegetariano, sin gluten, alergias..."
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: `2px solid ${C.bronze}`,
                color: C.champagne,
                padding: '14px 18px',
                fontSize: '1rem',
                fontFamily: F.body,
                outline: 'none',
                borderRadius: '4px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <Button onClick={submit} disabled={submitting} style={{ width: '100%' }}>
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
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 20px'
    }}>
      <div style={{
        background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
        border: `2px solid ${C.gold}`,
        borderRadius: '8px',
        padding: '52px 44px',
        maxWidth: '680px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🥂</div>
        <h2 style={{
          fontFamily: F.display,
          fontSize: 'clamp(1.6rem,5vw,2.4rem)',
          fontStyle: 'italic',
          marginBottom: '16px',
          color: C.gold
        }}>
          ¡Confirmación Recibida!
        </h2>
        <div style={{
          fontFamily: F.decorative,
          fontSize: 'clamp(1.3rem,4vw,2rem)',
          marginBottom: '24px',
          color: C.champagne,
          fontStyle: 'italic'
        }}>
          {rsvpData?.nombre}
        </div>
        <p style={{
          fontFamily: F.body,
          fontSize: '1.02rem',
          color: C.champagne,
          opacity: 0.8,
          marginBottom: '28px'
        }}>
          Tu asistencia ha sido registrada
          {rsvpData?.acompanante && rsvpData.nombreAcomp ? ` junto con ${rsvpData.nombreAcomp}` : ''}.
        </p>
        
        <div style={{
          background: 'rgba(212,175,55,0.08)',
          border: `2px solid ${C.gold}`,
          padding: '26px',
          borderRadius: '6px',
          marginBottom: '28px'
        }}>
          <p style={{
            fontFamily: F.accent,
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: C.gold,
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}>
            Tu Enlace Personal
          </p>
          <input
            readOnly
            value={uploadUrl}
            onClick={e => e.target.select()}
            style={{
              width: '100%',
              fontSize: '0.8rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(0,0,0,0.3)',
              border: `1px solid ${C.bronze}`,
              color: C.champagne,
              padding: '12px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              marginBottom: '14px'
            }}
          />
          <p style={{
            fontFamily: F.body,
            fontSize: '0.9rem',
            lineHeight: 1.8,
            color: C.champagne,
            opacity: 0.9
          }}>
            Usa este enlace para subir una foto o video para Zandra.
          </p>
        </div>
        
        <Button onClick={() => navigate('home')}>Volver al Inicio</Button>
      </div>
    </div>
  );
}

function Admin({ navigate }) {
  const [pw, setPw] = useState('');
  const [auth, setAuth] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const tryLogin = () => {
    if (pw === 'gatsby2026') {
      setAuth(true);
    }
  };
  
  useEffect(() => {
    if (!auth) return;
    const fetchData = async () => {
      const { data } = await supabase.from('rsvps').select('*').order('created_at', { ascending: false });
      if (data) setRsvps(data);
      setLoading(false);
    };
    fetchData();
  }, [auth]);
  
  if (!auth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
          border: `2px solid ${C.gold}`,
          borderRadius: '8px',
          padding: '48px 40px',
          maxWidth: '420px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: F.display,
            fontSize: '2rem',
            fontStyle: 'italic',
            marginBottom: '24px',
            color: C.gold
          }}>
            Admin Panel
          </h2>
          <InputField
            label="Contraseña"
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
          <Button onClick={tryLogin} style={{ width: '100%', marginBottom: '16px' }}>
            Ingresar
          </Button>
          <Button onClick={() => navigate('home')} variant="secondary" style={{ width: '100%' }}>
            Volver
          </Button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontFamily: F.body, color: C.champagne }}>Cargando...</div>
      </div>
    );
  }
  
  const confirmados = rsvps.length;
  const totalPersonas = confirmados + rsvps.filter(r => r.acompanante).length;
  
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg,${C.deepBlack},${C.richBlack})`,
      paddingTop: '100px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 100px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: F.display,
            fontSize: 'clamp(2rem,5vw,3rem)',
            fontStyle: 'italic',
            color: C.gold
          }}>
            Panel Admin
          </h1>
          <Button onClick={() => navigate('home')}>Salir</Button>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          <div style={{
            background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
            border: `2px solid ${C.gold}`,
            borderRadius: '8px',
            padding: '28px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: F.accent,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: C.champagne,
              textTransform: 'uppercase',
              marginBottom: '12px',
              opacity: 0.7
            }}>
              Confirmados
            </div>
            <div style={{ fontFamily: F.elegant, fontSize: '3rem', color: C.gold }}>
              {confirmados}
            </div>
          </div>
          
          <div style={{
            background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
            border: `2px solid ${C.gold}`,
            borderRadius: '8px',
            padding: '28px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: F.accent,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: C.champagne,
              textTransform: 'uppercase',
              marginBottom: '12px',
              opacity: 0.7
            }}>
              Total Personas
            </div>
            <div style={{ fontFamily: F.elegant, fontSize: '3rem', color: C.gold }}>
              {totalPersonas}
            </div>
          </div>
          
          <div style={{
            background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
            border: `2px solid ${C.gold}`,
            borderRadius: '8px',
            padding: '28px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: F.accent,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: C.champagne,
              textTransform: 'uppercase',
              marginBottom: '12px',
              opacity: 0.7
            }}>
              Cupos Libres
            </div>
            <div style={{ fontFamily: F.elegant, fontSize: '3rem', color: C.gold }}>
              {EVENTO.cupo - totalPersonas}
            </div>
          </div>
        </div>
        
        <div style={{
          background: `linear-gradient(135deg,${C.richBlack},${C.midnight})`,
          border: `2px solid ${C.gold}`,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '24px',
            borderBottom: `1px solid ${C.bronze}`
          }}>
            <h3 style={{
              fontFamily: F.elegant,
              fontSize: '1.5rem',
              color: C.gold
            }}>
              Confirmaciones ({confirmados})
            </h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.bronze}` }}>
                  <th style={{
                    fontFamily: F.accent,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    color: C.gold,
                    textTransform: 'uppercase',
                    padding: '16px',
                    textAlign: 'left'
                  }}>
                    Nombre
                  </th>
                  <th style={{
                    fontFamily: F.accent,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    color: C.gold,
                    textTransform: 'uppercase',
                    padding: '16px',
                    textAlign: 'left'
                  }}>
                    Email
                  </th>
                  <th style={{
                    fontFamily: F.accent,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    color: C.gold,
                    textTransform: 'uppercase',
                    padding: '16px',
                    textAlign: 'left'
                  }}>
                    Acompañante
                  </th>
                  <th style={{
                    fontFamily: F.accent,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    color: C.gold,
                    textTransform: 'uppercase',
                    padding: '16px',
                    textAlign: 'left'
                  }}>
                    Restricciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                    <td style={{
                      fontFamily: F.body,
                      fontSize: '0.938rem',
                      color: C.champagne,
                      padding: '16px'
                    }}>
                      {r.nombre}
                    </td>
                    <td style={{
                      fontFamily: F.body,
                      fontSize: '0.875rem',
                      color: C.champagne,
                      padding: '16px',
                      opacity: 0.7
                    }}>
                      {r.email}
                    </td>
                    <td style={{
                      fontFamily: F.body,
                      fontSize: '0.875rem',
                      color: r.acompanante ? C.gold : C.champagne,
                      padding: '16px',
                      opacity: 0.8
                    }}>
                      {r.acompanante ? r.nombre_acomp : '—'}
                    </td>
                    <td style={{
                      fontFamily: F.body,
                      fontSize: '0.875rem',
                      color: C.champagne,
                      padding: '16px',
                      opacity: 0.7
                    }}>
                      {r.restricciones_dieteticas || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [rsvpData, setRsvpData] = useState(null);
  
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400;1,700&family=Montserrat:wght@300;400;600&family=Raleway:wght@300;400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    const style = document.createElement('style');
    style.textContent = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: ${C.deepBlack}; color: ${C.champagne}; overflow-x: hidden; }
      ::selection { background: ${C.gold}; color: ${C.deepBlack}; }
      @keyframes shimmer {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `;
    document.head.appendChild(style);
  }, []);
  
  const navigate = p => {
    setPage(p);
    window.scrollTo(0, 0);
  };
  
  return (
    <div>
      <Navigation current={page} navigate={navigate} />
      {page === 'home' && <HomePage navigate={navigate} />}
      {page === 'details' && <DetailsPage navigate={navigate} />}
      {page === 'schedule' && <SchedulePage navigate={navigate} />}
      {page === 'gallery' && <GalleryPage navigate={navigate} />}
      {page === 'rsvp' && <RSVPPage navigate={navigate} setRsvpData={setRsvpData} />}
      {page === 'confirmacion' && <Confirmacion navigate={navigate} rsvpData={rsvpData} />}
      {page === 'admin' && <Admin navigate={navigate} />}
    </div>
  );
}
