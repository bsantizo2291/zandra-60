import { useState, useEffect, useRef } from 'react';

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

    class Bubble {
      constructor() {
        this.x = Math.random() * W;
        this.y = H + Math.random() * 100;
        this.vy = -Math.random() * 1.5 - 0.8;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 4 + 2;
        this.alpha = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y + this.size < 0) {
          this.y = H + this.size;
          this.x = Math.random() * W;
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 50; i++) bubbles.push(new Bubble());
    
    function animate() {
      ctx.clearRect(0, 0, W, H);
      bubbles.forEach(b => { b.update(); b.draw(); });
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }} />;
}

export default function App() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-09-05T19:00:00-06:00');
    const tick = () => {
      const diff = target - new Date();
      if (diff > 0) {
        setCountdown({
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

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #1a1612 0%, #0a0908 70%)', position: 'relative', overflow: 'hidden' }}>
      <ChampagneBubbles />
      
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '720px', width: '100%', textAlign: 'center' }}>
          
          {/* NOW SHOWING */}
          <div style={{ fontFamily: 'Limelight, cursive', fontSize: '0.85rem', letterSpacing: '0.5em', color: '#fff8d0', textTransform: 'uppercase', marginBottom: '40px', textShadow: '0 0 20px rgba(212,175,55,0.6)' }}>
            ★ NOW SHOWING ★
          </div>

          {/* ZANDRA */}
          <h1 style={{ fontFamily: 'Limelight, cursive', fontSize: 'clamp(3.5rem, 11vw, 5.5rem)', lineHeight: 0.95, letterSpacing: '0.04em', background: 'linear-gradient(180deg, #fff8d0 0%, #d4af37 50%, #b8860b 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.4))', marginBottom: '12px' }}>
            ZANDRA
          </h1>

          {/* Surname */}
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(0.95rem, 2.8vw, 1.2rem)', letterSpacing: '0.4em', color: '#d4af37', textTransform: 'uppercase', marginBottom: '20px' }}>
            B · VELIZ · ORTIZ
          </div>

          {/* 60 */}
          <div style={{ margin: '50px 0 30px' }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', letterSpacing: '0.55em', color: '#d4af37', textTransform: 'uppercase', marginBottom: '8px' }}>
              EN SUS ESPECTACULARES
            </div>
            <div style={{ fontFamily: 'Limelight, cursive', fontSize: 'clamp(8rem, 26vw, 14rem)', lineHeight: 0.85, background: 'linear-gradient(180deg, #fff8d0 0%, #f4e4c1 25%, #d4af37 60%, #8b6f1f 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 60px rgba(212,175,55,0.5))' }}>
              60
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)', color: '#f7e7ce', marginTop: '12px' }}>
              Años de Brillantez
            </div>
          </div>

          {/* Countdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxWidth: '480px', margin: '32px auto' }}>
            {Object.entries(countdown).map(([key, value]) => (
              <div key={key} style={{ textAlign: 'center', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.4)', padding: '20px 8px' }}>
                <div style={{ fontFamily: 'Limelight, cursive', fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', background: 'linear-gradient(180deg, #fff8d0 0%, #d4af37 70%, #8b6f1f 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', lineHeight: 1, marginBottom: '8px' }}>
                  {String(value).padStart(2, '0')}
                </div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.35em', color: '#f7e7ce', textTransform: 'uppercase', opacity: 0.7 }}>
                  {key === 'days' ? 'Días' : key === 'hours' ? 'Horas' : key === 'minutes' ? 'Min' : 'Seg'}
                </div>
              </div>
            ))}
          </div>

          {/* Event Details */}
          <div style={{ background: 'rgba(212,175,55,0.04)', border: '1px dashed rgba(212,175,55,0.5)', padding: '28px 24px', margin: '32px auto', maxWidth: '500px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.35em', color: '#d4af37', textTransform: 'uppercase', marginBottom: '6px' }}>FECHA</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#f7e7ce' }}>Sábado · 5 Sep · 2026</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.35em', color: '#d4af37', textTransform: 'uppercase', marginBottom: '6px' }}>FUNCIÓN</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#f7e7ce' }}>19:00 hrs</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.35em', color: '#d4af37', textTransform: 'uppercase', marginBottom: '6px' }}>LOCAL</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#f7e7ce' }}>El Club Español</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.35em', color: '#d4af37', textTransform: 'uppercase', marginBottom: '6px' }}>CIUDAD</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: '#f7e7ce' }}>Mixco · Guatemala</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
