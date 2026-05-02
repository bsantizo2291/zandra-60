import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ndwheqxeuykmsfbhsvvp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kd2hlcXhldXlrbXNmYmhzdnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODkxMzYsImV4cCI6MjA5MjQ2NTEzNn0.yJ3prriU3vpS9Aa8zoAzjXcdjjAL8HqvTXw0f9bzkjg';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EVENTO = {
  nombre: 'Zandra B. Veliz Ortiz',
  fecha: 'Sábado, 5 de Septiembre de 2026',
  fechaCorta: 'Sábado · 5 Sep · 2026',
  hora: '19:00 - 00:00 hrs',
  lugar: 'El Club Español',
  area: 'Área Fuentecilla',
  direccion: 'Calzada Roosevelt Km. 13.5, 40-20 Zona 7 de Mixco, Guatemala',
  mapsUrl: 'https://maps.google.com/?q=Calzada+Roosevelt+Km+13.5+Zona+7+Mixco+Guatemala',
  cupo: 80
};

const VESTUARIO = [
  { titulo: 'Señoras · Vestido de Gala', desc: 'Vestido largo en dorado, negro o champagne con lentejuelas o encaje. Tocado, diadema o plumas. Joyería art déco.', colores: ['#d4af37', '#1a1208', '#f5edd6'] },
  { titulo: 'Señoras · Conjunto de Noche', desc: 'Pantalón y blusa con brillos o brocado. Bolso clutch dorado o negro. Guantes de encaje opcionales.', colores: ['#2a2015', '#d4af37', '#8b6f2e'] },
  { titulo: 'Caballeros · Esmoquin', desc: 'Esmoquin negro o blanco con corbatín y fajín. Pañuelo dorado. Zapatos de charol.', colores: ['#1a1208', '#f5edd6', '#d4af37'] },
  { titulo: 'Caballeros · Traje Completo', desc: 'Traje 3 piezas en negro, gris carbón o azul noche. Chaleco, sombrero de ala y bastón elegante.', colores: ['#2d3142', '#d4af37', '#f5edd6'] },
  { titulo: 'Accesorios · Señoras', desc: 'Collar de perlas, aretes largos, pulsera dorada. Portacigarros decorativo o abanico de plumas como prop.', colores: ['#f5edd6', '#d4af37', '#f0e0a0'] },
  { titulo: 'Accesorios · Caballeros', desc: 'Gemelos dorados, reloj de bolsillo con cadena. Sombrero Fedora o Bowler. Broche de solapa art déco.', colores: ['#d4af37', '#1a1208', '#8b6f2e'] }
];

function ChampagneBubbles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let bubbles = [];
    let animationId;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    class Bubble {
      constructor(init = false) { this.reset(init); }
      reset(init = false) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + Math.random() * 100;
        this.baseVy = -Math.random() * 1.2 - 0.6;
        this.vy = this.baseVy;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 4 + 2;
        this.alpha = Math.random() * 0.4 + 0.4;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.03 + 0.02;
        this.hue = Math.random() * 15 + 40;
      }
      update() {
        this.wobble += this.wobbleSpeed;
        this.vy = this.baseVy + Math.sin(this.wobble) * 0.2;
        this.x += this.vx + Math.cos(this.wobble) * 0.5;
        this.y += this.vy;
        if (this.y + this.size < 0 || this.x < -this.size || this.x > W + this.size) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const g = ctx.createRadialGradient(this.x - this.size * 0.3, this.y - this.size * 0.3, 0, this.x, this.y, this.size);
        g.addColorStop(0, 'hsla(' + this.hue + ', 70%, 85%, 0.9)');
        g.addColorStop(0.5, 'hsla(' + this.hue + ', 65%, 70%, 0.6)');
        g.addColorStop(1, 'hsla(' + this.hue + ', 60%, 60%, 0.1)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'hsla(' + this.hue + ', 70%, 75%, 0.4)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      }
    }

    for (let i = 0; i < 60; i++) bubbles.push(new Bubble(true));
    function animate() {
      ctx.clearRect(0, 0, W, H);
      bubbles.forEach(b => { b.update(); b.draw(); });
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return React.createElement('canvas', { 
    ref: canvasRef, 
    style: { 
      position: 'fixed', 
      inset: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none', 
      zIndex: 1 
    } 
  });
}

function BulbRow({ count = 12, style = {} }) {
  const bulbs = Array.from({ length: count }, (_, i) => i);
  return React.createElement('div', { 
    style: { display: 'flex', justifyContent: 'space-between', ...style } 
  }, bulbs.map(i =>
    React.createElement('span', {
      key: i,
      style: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #fff8d0 0%, #d4af37 40%, #8b6f1f 100%)',
        boxShadow: '0 0 10px #d4af37, 0 0 20px rgba(212,175,55,0.6), inset -1px -1px 2px rgba(0,0,0,0.3)',
        animation: 'bulbFlicker 2s ease-in-out infinite',
        animationDelay: (i * 0.15) + 's'
      }
    })
  ));
}

function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-09-05T19:00:00-06:00');
    const tick = () => {
      const diff = target - new Date();
      if (diff > 0) {
        setTime({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const labels = { days: 'Días', hours: 'Horas', minutes: 'Min', seconds: 'Seg' };

  return React.createElement('div', { 
    style: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(4, 1fr)', 
      gap: '8px', 
      maxWidth: '480px', 
      margin: '32px auto' 
    } 
  }, Object.entries(time).map(([key, value]) =>
    React.createElement('div', {
      key: key,
      style: {
        textAlign: 'center',
        background: 'rgba(212,175,55,0.04)',
        border: '1px solid rgba(212,175,55,0.4)',
        padding: '20px 8px',
        position: 'relative'
      }
    }, [
      React.createElement('div', {
        key: 'num',
        style: {
          fontFamily: 'Limelight, cursive',
          fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
          background: 'linear-gradient(180deg, #fff8d0 0%, #d4af37 70%, #8b6f1f 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          lineHeight: 1,
          marginBottom: '8px'
        }
      }, String(value).padStart(2, '0')),
      React.createElement('div', {
        key: 'label',
        style: {
          fontFamily: 'Cinzel, serif',
          fontSize: '0.55rem',
          letterSpacing: '0.35em',
          color: '#f7e7ce',
          textTransform: 'uppercase',
          opacity: 0.7,
          fontWeight: 500
        }
      }, labels[key])
    ])
  ));
}

function HairlineDivider({ label = '' }) {
  return React.createElement('div', { 
    style: { 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '16px', 
      margin: '32px 0' 
    } 
  }, [
    React.createElement('div', { 
      key: 'line1', 
      style: { 
        flex: 1, 
        maxWidth: '80px', 
        height: '1px', 
        background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' 
      } 
    }),
    label && React.createElement('div', {
      key: 'label',
      style: {
        fontFamily: 'Cinzel, serif',
        fontSize: '0.6rem',
        letterSpacing: '0.45em',
        color: '#d4af37',
        textTransform: 'uppercase',
        fontWeight: 500,
        whiteSpace: 'nowrap'
      }
    }, label),
    React.createElement('div', { 
      key: 'line2', 
      style: { 
        flex: 1, 
        maxWidth: '80px', 
        height: '1px', 
        background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' 
      } 
    })
  ]);
}

function Nav({ navigate, current }) {
  const links = [
    { k: 'invitacion', l: 'Invitación' },
    { k: 'detalles', l: 'Detalles' },
    { k: 'rsvp', l: 'Confirmar' }
  ];

  return React.createElement('nav', {
    style: {
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: 'rgba(10,9,8,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(212,175,55,0.3)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      height: '60px'
    }
  }, [
    React.createElement('div', {
      key: 'logo',
      style: {
        fontFamily: 'Limelight, cursive',
        fontSize: '1rem',
        letterSpacing: '0.2em',
        color: '#d4af37',
        marginRight: 'auto',
        textShadow: '0 0 12px rgba(212,175,55,0.4)'
      }
    }, 'Z · 60'),
    React.createElement('div', {
      key: 'links',
      style: { display: 'flex', gap: '4px' }
    }, links.map(l =>
      React.createElement('button', {
        key: l.k,
        onClick: () => navigate(l.k),
        style: {
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 16px',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: current === l.k ? '#d4af37' : '#f7e7ce',
          opacity: current === l.k ? 1 : 0.7,
          fontWeight: 500,
          transition: 'all 0.3s'
        }
      }, l.l)
    ).concat(
      React.createElement('button', {
        key: 'admin',
        onClick: () => navigate('admin'),
        style: {
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 12px',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.55rem',
          letterSpacing: '0.25em',
          color: 'rgba(212,175,55,0.4)',
          textTransform: 'uppercase'
        }
      }, 'Admin')
    ))
  ]);
}

function Invitacion({ navigate }) {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #1a1612 0%, #0a0908 70%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, [
    React.createElement(ChampagneBubbles, { key: 'bubbles' }),
    React.createElement('div', {
      key: 'content',
      style: {
        maxWidth: '720px',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }
    }, 
      React.createElement('div', {
        style: {
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(26,22,18,0.92) 0%, rgba(13,12,10,0.96) 100%)',
          border: '1px solid #d4af37',
          padding: '0',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(212,175,55,0.15)'
        }
      }, [
        React.createElement(BulbRow, {
          key: 'bulbs-top',
          count: 14,
          style: {
            position: 'absolute',
            top: '-7px',
            left: '20px',
            right: '20px'
          }
        }),
        React.createElement('div', {
          key: 'inner',
          style: { padding: '60px 40px 50px' }
        }, [
          React.createElement('div', {
            key: 'now-showing',
            style: { textAlign: 'center', marginBottom: '32px' }
          },
            React.createElement('div', {
              style: {
                display: 'inline-block',
                fontFamily: 'Limelight, cursive',
                fontSize: '0.85rem',
                letterSpacing: '0.5em',
                color: '#fff8d0',
                textTransform: 'uppercase',
                animation: 'bulbFlicker 3s ease-in-out infinite',
                textShadow: '0 0 20px rgba(212,175,55,0.6)'
              }
            }, '★ NOW SHOWING ★')
          ),
          React.createElement(HairlineDivider, { key: 'div1', label: 'Una velada extraordinaria' }),
          React.createElement('div', {
            key: 'starring',
            style: {
              fontFamily: 'Cinzel, serif',
              fontSize: '0.7rem',
              letterSpacing: '0.5em',
              color: '#d4af37',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginTop: '40px',
              marginBottom: '20px',
              fontWeight: 500
            }
          }, 'PROUDLY PRESENTS'),
          React.createElement('div', {
            key: 'name',
            style: {
              fontFamily: 'Limelight, cursive',
              fontSize: 'clamp(3.5rem, 11vw, 5.5rem)',
              textAlign: 'center',
              lineHeight: 0.95,
              letterSpacing: '0.04em',
              background: 'linear-gradient(180deg, #fff8d0 0%, #d4af37 50%, #b8860b 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.4))',
              marginBottom: '12px'
            }
          }, 'ZANDRA'),
          React.createElement('div', {
            key: 'surname',
            style: {
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(0.95rem, 2.8vw, 1.2rem)',
              letterSpacing: '0.4em',
              color: '#d4af37',
              textTransform: 'uppercase',
              textAlign: 'center',
              fontWeight: 400
            }
          }, 'B · VELIZ · ORTIZ'),
          React.createElement('div', {
            key: 'sixty',
            style: { textAlign: 'center', margin: '50px 0 30px', position: 'relative' }
          }, [
            React.createElement('div', {
              key: 'label1',
              style: {
                fontFamily: 'Cinzel, serif',
                fontSize: '0.7rem',
                letterSpacing: '0.55em',
                color: '#d4af37',
                textTransform: 'uppercase',
                marginBottom: '8px',
                fontWeight: 500
              }
            }, 'EN SUS ESPECTACULARES'),
            React.createElement('div', {
              key: 'num',
              style: {
                fontFamily: 'Limelight, cursive',
                fontSize: 'clamp(8rem, 26vw, 14rem)',
                lineHeight: 0.85,
                background: 'linear-gradient(180deg, #fff8d0 0%, #f4e4c1 25%, #d4af37 60%, #8b6f1f 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 0 60px rgba(212,175,55,0.5))',
                display: 'block'
              }
            }, '60'),
            React.createElement('div', {
              key: 'tagline',
              style: {
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                color: '#f7e7ce',
                marginTop: '12px',
                opacity: 0.95,
                fontWeight: 400
              }
            }, 'Años de Brillantez')
          ]),
          React.createElement(HairlineDivider, { key: 'div2' }),
          React.createElement(CountdownTimer, { key: 'countdown' }),
          React.createElement('div', {
            key: 'ticket',
            style: {
              background: 'rgba(212,175,55,0.04)',
              border: '1px dashed rgba(212,175,55,0.5)',
              padding: '28px 24px',
              margin: '32px 0',
              position: 'relative'
            }
          }, [
            React.createElement('div', {
              key: 'hole1',
              style: {
                position: 'absolute',
                left: '-12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                background: '#0a0908',
                borderRadius: '50%'
              }
            }),
            React.createElement('div', {
              key: 'hole2',
              style: {
                position: 'absolute',
                right: '-12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                background: '#0a0908',
                borderRadius: '50%'
              }
            }),
            React.createElement('div', {
              key: 'grid',
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
              }
            }, [
              { l: 'FECHA', v: 'Sábado · 5 Sep · 2026' },
              { l: 'FUNCIÓN', v: '19:00 hrs' },
              { l: 'LOCAL', v: 'El Club Español' },
              { l: 'CIUDAD', v: 'Mixco · Guatemala' }
            ].map((d, i) =>
              React.createElement('div', { key: i, style: { textAlign: 'center' } }, [
                React.createElement('div', {
                  key: 'l',
                  style: {
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.55rem',
                    letterSpacing: '0.35em',
                    color: '#d4af37',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                    fontWeight: 500
                  }
                }, d.l),
                React.createElement('div', {
                  key: 'v',
                  style: {
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1rem',
                    color: '#f7e7ce',
                    fontWeight: 400
                  }
                }, d.v)
              ])
            ))
          ]),
          React.createElement('button', {
            key: 'cta',
            onClick: () => navigate('rsvp'),
            style: {
              display: 'block',
              width: '100%',
              maxWidth: '380px',
              margin: '32px auto 0',
              padding: '18px',
              background: 'linear-gradient(180deg, #f4e4c1 0%, #d4af37 50%, #b8860b 100%)',
              color: '#0a0908',
              border: '1px solid #fff8d0',
              fontFamily: 'Limelight, cursive',
              fontSize: '0.85rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: 400,
              transition: 'all 0.3s',
              boxShadow: '0 0 30px rgba(212,175,55,0.5), 0 4px 0 #8b6f1f, 0 6px 20px rgba(0,0,0,0.5)'
            },
            onMouseEnter: e => { 
              e.currentTarget.style.transform = 'translateY(-2px)'; 
              e.currentTarget.style.boxShadow = '0 0 50px rgba(212,175,55,0.8), 0 6px 0 #8b6f1f, 0 8px 30px rgba(0,0,0,0.6)'; 
            },
            onMouseLeave: e => { 
              e.currentTarget.style.transform = 'translateY(0)'; 
              e.currentTarget.style.boxShadow = '0 0 30px rgba(212,175,55,0.5), 0 4px 0 #8b6f1f, 0 6px 20px rgba(0,0,0,0.5)'; 
            }
          }, 'Reservar Asiento'),
          React.createElement('div', {
            key: 'hint',
            style: {
              textAlign: 'center',
              marginTop: '20px',
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: '#f7e7ce',
              opacity: 0.5
            }
          }, 'Cupo limitado · Por invitación')
        ]),
        React.createElement(BulbRow, {
          key: 'bulbs-bottom',
          count: 14,
          style: {
            position: 'absolute',
            bottom: '-7px',
            left: '20px',
            right: '20px'
          }
        })
      ])
    )
  ]);
}

export default function App() {
  const [page, setPage] = useState('invitacion');
  const [rsvpData, setRsvpData] = useState(null);

  const navigate = p => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  return React.createElement('div', { 
    style: { background: '#0a0908', minHeight: '100vh' } 
  }, page === 'invitacion' && React.createElement(Invitacion, { navigate }));
}
