import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

// ── CONFIGURACIÓN ─────────────────────────────────────────────
const SUPABASE_URL = 'https://ndwheqxeuykmsfbhsvvp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kd2hlcXhldXlrbXNmYmhzdnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODkxMzYsImV4cCI6MjA5MjQ2NTEzNn0.yJ3prriU3vpS9Aa8zoAzjXcdjjAL8HqvTXw0f9bzkjg';

const CLOUDINARY_CLOUD_NAME = 'duo4dukq4';
const CLOUDINARY_UPLOAD_PRESET = 'zandra60_unsigned';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Paleta Gold Foil ──────────────────────────────────────────
const F = {
  deepBlack: '#0d0c0a',
  richBlack: '#1a1612',
  pureGold: '#d4af37',
  lightGold: '#f4e4c1',
  champagne: '#f7e7ce',
  ivory: '#fffff0',
  bronze: '#cd7f32',
  shadow: 'rgba(212,175,55,0.4)',
};

const EVENTO = {
  nombre: 'Zandra B. Veliz Ortiz',
  fecha: 'Sábado, 5 de Septiembre de 2026',
  hora: '19:00 A 24:00 hrs',
  lugar: 'El Club Español — Área Fuentecilla',
  direccion: 'Calzada Roosevelt Km. 13.5, 40-20 Zona 7 de Mixco, Guatemala',
  mapsUrl: 'https://maps.google.com/?q=Calzada+Roosevelt+Km+13.5+Zona+7+Mixco+Guatemala',
  dresscode: 'Etiqueta Rigurosa & Glamour Gatsby',
  cupo: 80,
};

// ── Estilos Gold Foil ─────────────────────────────────────────
const S = {
  page: { minHeight:'100vh', background:`radial-gradient(ellipse at center, ${F.richBlack} 0%, ${F.deepBlack} 100%)`, color:F.ivory, fontFamily:"'Cormorant Garamond','Georgia',serif", position:'relative' },
  goldText: { background:`linear-gradient(135deg, ${F.bronze} 0%, ${F.pureGold} 25%, ${F.lightGold} 50%, ${F.pureGold} 75%, ${F.bronze} 100%)`, WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent', backgroundSize:'200% auto', fontFamily:"'Cinzel','Georgia',serif" },
  embossed: { textShadow:`1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1), 0 0 30px ${F.shadow}` },
  ornate: { fontFamily:"'Cinzel Decorative','Georgia',serif", letterSpacing:'0.15em', textTransform:'uppercase' },
  serif: { fontFamily:"'Cormorant Garamond','Georgia',serif", fontStyle:'italic' },
  label: { fontFamily:"'Cinzel','Georgia',serif", fontSize:'0.65rem', letterSpacing:'0.3em', color:F.pureGold, textTransform:'uppercase', fontWeight:400 },
  body: { fontSize:'1.05rem', lineHeight:1.8, color:F.champagne, fontFamily:"'Cormorant Garamond','Georgia',serif" },
  card: { background:`linear-gradient(145deg, rgba(26,22,18,0.9), rgba(13,12,10,0.95))`, border:`2px solid ${F.pureGold}`, borderRadius:'8px', padding:'36px', boxShadow:`0 0 60px ${F.shadow}, inset 0 0 40px rgba(0,0,0,0.5)`, position:'relative' },
  input: { width:'100%', background:'rgba(255,255,255,0.03)', border:`2px solid ${F.bronze}`, color:F.champagne, padding:'14px 18px', fontSize:'1.05rem', fontFamily:"'Cormorant Garamond','Georgia',serif", outline:'none', boxSizing:'border-box', borderRadius:'4px' },
  btn: { display:'inline-block', border:`2px solid ${F.pureGold}`, padding:'16px 40px', fontFamily:"'Cinzel','Georgia',serif", fontSize:'0.7rem', letterSpacing:'0.25em', color:F.pureGold, textTransform:'uppercase', background:'transparent', cursor:'pointer', transition:'all 0.4s', textDecoration:'none', position:'relative', overflow:'hidden' },
  btnFill: { background:`linear-gradient(135deg, ${F.bronze}, ${F.pureGold})`, color:F.deepBlack, borderColor:F.pureGold, boxShadow:`0 0 30px ${F.shadow}` },
};

// ── Borde Ornamentado ─────────────────────────────────────────
function OrnateBorder() {
  const corners = [
    { t:'-2px', l:'-2px', r:'0deg' },
    { t:'-2px', r:'-2px', r:'90deg' },
    { b:'-2px', r:'-2px', r:'180deg' },
    { b:'-2px', l:'-2px', r:'270deg' },
  ];

  return (
    <>
      {corners.map((c, i) => (
        <svg key={i} style={{ position:'absolute', ...c, width:'80px', height:'80px', transform:`rotate(${c.r})`, opacity:0.9 }} viewBox="0 0 100 100">
          <path d="M0,0 L0,40 Q0,0 40,0 L0,0 M20,20 Q20,15 25,15 L35,15 Q40,15 40,20" 
            fill="none" stroke={F.pureGold} strokeWidth="2" />
          <circle cx="10" cy="10" r="3" fill={F.pureGold} />
          <path d="M0,20 Q5,20 10,15 M20,0 Q20,5 15,10" stroke={F.pureGold} strokeWidth="1.5" fill="none" />
        </svg>
      ))}
      <div style={{ position:'absolute', top:'-2px', left:'50%', transform:'translateX(-50%)', width:'200px', height:'40px', background:`radial-gradient(ellipse, ${F.pureGold} 0%, transparent 70%)`, opacity:0.3 }} />
      <div style={{ position:'absolute', bottom:'-2px', left:'50%', transform:'translateX(-50%)', width:'200px', height:'40px', background:`radial-gradient(ellipse, ${F.pureGold} 0%, transparent 70%)`, opacity:0.3 }} />
    </>
  );
}

// ── Línea Decorativa ──────────────────────────────────────────
function GoldDivider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'16px', margin:'24px 0' }}>
      <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg,transparent,${F.pureGold},transparent)`, boxShadow:`0 0 8px ${F.shadow}` }} />
      <div style={{ width:'12px', height:'12px', background:F.pureGold, transform:'rotate(45deg)', boxShadow:`0 0 12px ${F.shadow}` }} />
      <div style={{ width:'6px', height:'6px', background:F.pureGold, borderRadius:'50%', boxShadow:`0 0 8px ${F.shadow}` }} />
      <div style={{ width:'12px', height:'12px', background:F.pureGold, transform:'rotate(45deg)', boxShadow:`0 0 12px ${F.shadow}` }} />
      <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg,transparent,${F.pureGold},transparent)`, boxShadow:`0 0 8px ${F.shadow}` }} />
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────
function Nav({ navigate, current }) {
  const links = [{ k:'landing', l:'Invitación' }, { k:'detalles', l:'Detalles' }, { k:'rsvp', l:'Confirmar' }];
  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:`linear-gradient(180deg, rgba(13,12,10,0.98) 0%, rgba(13,12,10,0.95) 100%)`, backdropFilter:'blur(12px)', borderBottom:`1px solid ${F.pureGold}`, display:'flex', alignItems:'center', boxShadow:`0 4px 20px rgba(0,0,0,0.8)` }}>
      {links.map(l => (
        <button key={l.k} onClick={() => navigate(l.k)} style={{ background:'none', border:'none', cursor:'pointer', padding:'18px 28px', fontFamily:"'Cinzel','Georgia',serif", fontSize:'0.65rem', letterSpacing:'0.25em', textTransform:'uppercase', color: current===l.k ? F.pureGold : F.champagne, borderBottom: current===l.k ? `3px solid ${F.pureGold}` : '3px solid transparent', transition:'all 0.3s', textShadow: current===l.k ? `0 0 20px ${F.shadow}` : 'none' }}>
          {l.l}
        </button>
      ))}
      <button onClick={() => navigate('admin')} style={{ background:'none', border:'none', cursor:'pointer', padding:'18px 20px', fontFamily:"'Cinzel','Georgia',serif", fontSize:'0.55rem', letterSpacing:'0.2em', color:'rgba(212,175,55,0.3)', marginLeft:'auto' }}>
        Admin
      </button>
    </nav>
  );
}

function Btn({ onClick, filled, children, style={}, disabled=false }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...S.btn, ...(filled ? S.btnFill : {}), ...style, opacity: disabled ? 0.4 : 1, transform: hover && !disabled ? 'translateY(-2px) scale(1.02)' : 'none', boxShadow: hover && !disabled ? `0 8px 30px ${F.shadow}` : (filled ? S.btnFill.boxShadow : 'none') }}>
      <span style={{ position:'relative', zIndex:1 }}>{children}</span>
      {hover && !disabled && (
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, transparent, ${F.pureGold}, transparent)`, opacity:0.2, pointerEvents:'none' }} />
      )}
    </button>
  );
}

// ── Campo de formulario (movido fuera) ────────────────────────
const Campo = ({ k, value, onChange, label, tipo='text', placeholder='', error }) => (
  <div style={{ marginBottom:'20px' }}>
    <label style={S.label}>{label}</label>
    <input type={tipo} value={value} placeholder={placeholder} onChange={onChange}
      style={{ ...S.input, borderColor: error ? '#c0392b' : F.bronze, borderWidth: error ? '3px' : '2px', boxShadow: error ? '0 0 20px rgba(192,57,43,0.3)' : 'none' }} />
    {error && <p style={{ color:'#e74c3c', fontSize:'0.82rem', marginTop:'6px', fontStyle:'italic', fontWeight:600 }}>{error}</p>}
  </div>
);

// ── PÁGINA 1: INVITACIÓN ──────────────────────────────────────
function Invitacion({ navigate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, bubbles = [], raf;
    
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const rnd = (a,b) => Math.random()*(b-a)+a;
    
    class Bubble {
      constructor(init) {
        this.x = rnd(0, W);
        this.y = init ? rnd(0, H) : H + rnd(0, 50);
        this.r = rnd(2, 6);
        this.vy = -rnd(0.5, 1.5);
        this.vx = rnd(-0.3, 0.3);
        this.a = rnd(0.3, 0.7);
        this.wobble = rnd(0, Math.PI * 2);
        this.wobbleSpeed = rnd(0.02, 0.05);
      }
      
      draw() {
        ctx.save();
        ctx.globalAlpha = this.a;
        
        const gradient = ctx.createRadialGradient(this.x - this.r/3, this.y - this.r/3, 0, this.x, this.y, this.r);
        gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.4, 'rgba(212,175,55,0.4)');
        gradient.addColorStop(1, 'rgba(212,175,55,0.1)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(212,175,55,0.6)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        ctx.restore();
      }
      
      update() {
        this.wobble += this.wobbleSpeed;
        this.y += this.vy;
        this.x += this.vx + Math.sin(this.wobble) * 0.5;
        
        if (this.y + this.r < 0) {
          this.y = H + rnd(20, 50);
          this.x = rnd(0, W);
        }
      }
    }
    
    for (let i = 0; i < 60; i++) bubbles.push(new Bubble(true));
    
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      bubbles.forEach(b => { b.update(); b.draw(); });
      raf = requestAnimationFrame(loop);
    };
    loop();
    
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'60px 20px' }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />
      
      <div style={{ ...S.card, width:'min(720px,95vw)', margin:'0 auto', zIndex:10, position:'relative' }}>
        <OrnateBorder />

        <div style={{ textAlign:'center', marginBottom:'16px' }}>
          <div style={{ ...S.label, opacity:0.8, marginBottom:'12px' }}>★ UNA CELEBRACIÓN DE ESPLENDOR ★</div>
          <div style={{ ...S.ornate, ...S.goldText, fontSize:'clamp(0.9rem,2.5vw,1.2rem)', marginBottom:'8px', ...S.embossed }}>
            Te Invitamos a Celebrar a
          </div>
        </div>

        <GoldDivider />

        <div style={{ textAlign:'center', margin:'32px 0' }}>
          <div style={{ ...S.goldText, ...S.ornate, fontSize:'clamp(2.5rem,7vw,4.5rem)', lineHeight:1.1, marginBottom:'12px', ...S.embossed, animation:'shimmer 3s ease-in-out infinite' }}>
            ZANDRA
          </div>
          <div style={{ ...S.serif, fontSize:'clamp(1.4rem,4vw,2.2rem)', color:F.lightGold, marginBottom:'8px' }}>
            B. Veliz Ortiz
          </div>
        </div>

        <div style={{ background:`linear-gradient(135deg, rgba(212,175,55,0.15), rgba(205,127,50,0.1))`, padding:'28px', margin:'0 -36px', position:'relative' }}>
          <div style={{ position:'absolute', inset:0, borderTop:`1px solid ${F.pureGold}`, borderBottom:`1px solid ${F.pureGold}`, opacity:0.5 }} />
          <div style={{ textAlign:'center', position:'relative' }}>
            <div style={{ ...S.label, marginBottom:'10px', fontSize:'0.75rem' }}>EN SUS</div>
            <div style={{ ...S.goldText, ...S.ornate, fontSize:'clamp(5rem,15vw,8rem)', lineHeight:1, marginBottom:'8px', ...S.embossed }}>
              60
            </div>
            <div style={{ ...S.label, fontSize:'0.85rem', letterSpacing:'0.4em' }}>AÑOS DE BRILLANTEZ</div>
          </div>
        </div>

        <GoldDivider />

        <div style={{ textAlign:'center', margin:'32px 0' }}>
          <div style={{ ...S.goldText, ...S.ornate, fontSize:'clamp(1.4rem,4vw,2.2rem)', marginBottom:'16px', ...S.embossed }}>
            Una Velada Gatsby
          </div>
          <div style={{ ...S.body, opacity:0.85, maxWidth:'520px', margin:'0 auto 20px', fontSize:'1.08rem' }}>
            Viste con el esplendor de los años 20. Lentejuelas, plumas, guantes y elegancia. Una noche inolvidable te espera.
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'20px', margin:'32px 0' }}>
          {[
            { i:'★', l:'Fecha', v:'Sábado\n5 de Septiembre, 2026' },
            { i:'★', l:'Horario', v:'19:00 – 00:00 hrs' },
            { i:'★', l:'Lugar', v:'El Club Español\nÁrea Fuentecilla' },
          ].map(d => (
            <div key={d.l} style={{ textAlign:'center', padding:'20px', background:'rgba(212,175,55,0.05)', border:`1px solid ${F.bronze}`, borderRadius:'6px' }}>
              <div style={{ color:F.pureGold, fontSize:'1.5rem', marginBottom:'12px' }}>{d.i}</div>
              <div style={{ ...S.label, marginBottom:'10px', fontSize:'0.6rem' }}>{d.l}</div>
              <div style={{ ...S.body, fontSize:'0.95rem', whiteSpace:'pre-line', lineHeight:1.6 }}>{d.v}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', background:`linear-gradient(135deg, rgba(26,22,18,0.8), rgba(13,12,10,0.9))`, padding:'24px', borderRadius:'6px', border:`1px solid ${F.bronze}`, marginBottom:'28px' }}>
          <div style={{ ...S.label, marginBottom:'8px' }}>DIRECCIÓN</div>
          <div style={{ ...S.body, fontSize:'0.96rem', marginBottom:'14px', opacity:0.8 }}>{EVENTO.direccion}</div>
          <a href={EVENTO.mapsUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, fontSize:'0.65rem', padding:'12px 28px', textDecoration:'none' }}>
            ★ ABRIR MAPA ★
          </a>
        </div>

        <GoldDivider />

        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ ...S.label, marginBottom:'10px' }}>★ CÓDIGO DE VESTIMENTA ★</div>
          <div style={{ ...S.goldText, ...S.ornate, fontSize:'clamp(1.1rem,3vw,1.6rem)', marginBottom:'14px', ...S.embossed }}>
            Etiqueta Rigurosa & Glamour Gatsby
          </div>
          <div style={{ display:'inline-flex', gap:'16px', padding:'14px 32px', border:`2px double ${F.pureGold}`, borderRadius:'6px', background:'rgba(212,175,55,0.05)' }}>
            {['Negro', 'Dorado', 'Champagne'].map(c => (
              <span key={c} style={{ ...S.label, fontSize:'0.7rem' }}>{c}</span>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
          <Btn onClick={() => navigate('detalles')}>Ver Detalles</Btn>
          <Btn onClick={() => navigate('rsvp')} filled>Confirmar Asistencia ★</Btn>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
      `}</style>
    </div>
  );
}

// ── PÁGINA 2: DETALLES ────────────────────────────────────────
const VESTUARIO = [
  { titulo:'Señoras — Vestido de Gala', desc:'Vestido largo en dorado, negro o champagne con lentejuelas o encaje. Tocado, diadema o plumas. Joyería art déco.', colores:['#C9A84C','#1a1208','#F5EDD6'] },
  { titulo:'Señoras — Conjunto de Noche', desc:'Pantalón y blusa con brillos o brocado. Bolso clutch dorado o negro. Guantes de encaje opcionales.', colores:['#2a2015','#C9A84C','#8b6f2e'] },
  { titulo:'Caballeros — Esmoquin', desc:'Esmoquin negro o blanco con corbatín y fajín. Pañuelo dorado. Zapatos de charol.', colores:['#1a1208','#F5EDD6','#C9A84C'] },
  { titulo:'Caballeros — Traje Completo', desc:'Traje 3 piezas en negro, gris carbón o azul noche. Chaleco, sombrero de ala y bastón elegante.', colores:['#2d3142','#C9A84C','#F5EDD6'] },
  { titulo:'Accesorios — Señoras', desc:'Collar de perlas, aretes largos, pulsera dorada. Portacigarros decorativo o abanico de plumas como prop.', colores:['#F5EDD6','#C9A84C','#f0e0a0'] },
  { titulo:'Accesorios — Caballeros', desc:'Gemelos dorados, reloj de bolsillo con cadena. Sombrero Fedora o Bowler. Broche de solapa art déco.', colores:['#C9A84C','#1a1208','#8b6f2e'] },
];

function Detalles({ navigate }) {
  return (
    <div style={{ ...S.page, paddingTop:'90px' }}>
      <Nav navigate={navigate} current="detalles" />
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'50px 20px 90px' }}>

        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <div style={{ ...S.label, marginBottom:'12px' }}>★ PROGRAMA DEL EVENTO ★</div>
          <GoldDivider />
          <div style={{ ...S.goldText, ...S.ornate, fontSize:'clamp(2rem,6vw,3.5rem)', marginBottom:'12px', ...S.embossed }}>
            Una Velada Gatsby
          </div>
          <div style={{ ...S.serif, fontSize:'clamp(1.3rem,4vw,2rem)', color:F.lightGold }}>
            Celebrando a Zandra B. Veliz Ortiz
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'20px', marginBottom:'48px' }}>
          {[
            { i:'★', l:'Fecha', v:'Sábado, 5 de Septiembre, 2026' },
            { i:'★', l:'Horario', v:'19:00 – 00:00 hrs' },
            { i:'★', l:'Lugar', v:'El Club Español\nÁrea Fuentecilla' },
            { i:'★', l:'Dirección', v:'Calzada Roosevelt Km. 13.5\nZona 7 de Mixco, Guatemala' },
          ].map(d => (
            <div key={d.l} style={{ ...S.card, padding:'24px', textAlign:'center' }}>
              <div style={{ color:F.pureGold, fontSize:'2.2rem', marginBottom:'14px' }}>{d.i}</div>
              <div style={{ ...S.label, marginBottom:'10px' }}>{d.l}</div>
              <div style={{ ...S.body, fontSize:'0.95rem', whiteSpace:'pre-line' }}>{d.v}</div>
            </div>
          ))}
        </div>

        <div style={{ ...S.card, textAlign:'center', marginBottom:'48px' }}>
          <div style={{ ...S.label, marginBottom:'16px' }}>UBICACIÓN DEL EVENTO</div>
          <a href={EVENTO.mapsUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, ...S.btnFill }}>
            ★ ABRIR EN GOOGLE MAPS ★
          </a>
        </div>

        <div style={{ textAlign:'center', marginBottom:'44px' }}>
          <div style={{ ...S.label, marginBottom:'12px' }}>★ CÓDIGO DE VESTIMENTA ★</div>
          <GoldDivider />
          <div style={{ ...S.goldText, ...S.ornate, fontSize:'clamp(1.3rem,4vw,2rem)', marginBottom:'18px', ...S.embossed }}>
            Etiqueta Rigurosa & Glamour Gatsby
          </div>
          <div style={{ ...S.body, opacity:0.85, maxWidth:'620px', margin:'0 auto 24px', fontSize:'1.05rem' }}>
            Celebremos con el esplendor de los años 20. Viste de negro, dorado o champagne. Lentejuelas, plumas, guantes y alhajas son bienvenidos. ¡Sorpréndenos!
          </div>
          <div style={{ display:'inline-flex', gap:'20px', padding:'16px 44px', border:`2px double ${F.pureGold}`, borderRadius:'8px', background:'rgba(212,175,55,0.08)' }}>
            {['Negro', 'Dorado', 'Champagne', 'Marfil'].map(c => (
              <span key={c} style={{ ...S.label, fontSize:'0.75rem' }}>{c}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:'52px' }}>
          <div style={{ ...S.label, textAlign:'center', marginBottom:'12px' }}>INSPIRACIÓN DE VESTUARIO</div>
          <GoldDivider />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'20px', marginTop:'28px' }}>
            {VESTUARIO.map((v, i) => (
              <div key={i} style={{ ...S.card, padding:'24px' }}>
                <div style={{ display:'flex', gap:'10px', marginBottom:'16px', justifyContent:'center' }}>
                  {v.colores.map((c,j) => (
                    <div key={j} style={{ width:'32px', height:'32px', background:c, borderRadius:'50%', border:`2px solid ${F.pureGold}`, boxShadow:`0 0 12px ${F.shadow}` }} />
                  ))}
                </div>
                <div style={{ ...S.label, marginBottom:'12px', fontSize:'0.65rem', textAlign:'center' }}>{v.titulo}</div>
                <div style={{ ...S.body, fontSize:'0.94rem', textAlign:'center', lineHeight:1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign:'center' }}>
          <GoldDivider />
          <div style={{ ...S.body, fontStyle:'italic', opacity:0.6, marginBottom:'24px', fontSize:'0.98rem' }}>
            Los cupos son limitados. Confirma tu asistencia pronto.
          </div>
          <Btn onClick={() => navigate('rsvp')} filled>Confirmar Asistencia ★</Btn>
        </div>
      </div>
    </div>
  );
}

// ── PÁGINA 3: RSVP ────────────────────────────────────────────
function RSVP({ navigate, setRsvpData }) {
  const [form, setForm] = useState({ nombre:'', email:'', telefono:'', acompanante:false, nombreAcomp:'' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({ confirmados: 0, libres: EVENTO.cupo });

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('rsvps').select('acompanante');
      if (!error && data) {
        const confirmados = data.length;
        const totalPersonas = confirmados + data.filter(r => r.acompanante).length;
        setStats({ confirmados, libres: EVENTO.cupo - totalPersonas });
      }
    };
    fetchStats();
  }, []);

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setErrors(e => ({...e, [k]:null})); };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Por favor ingresa tu nombre completo';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Ingresa un correo electrónico válido';
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
        nombre_acomp: form.acompanante ? form.nombreAcomp : null
      }]).select();

      if (error) throw error;

      const uploadToken = data[0].upload_token;
      setRsvpData({ ...form, uploadToken });
      navigate('confirmacion');
    } catch (err) {
      console.error('Error guardando RSVP:', err);
      setErrors({ general: 'Hubo un error al guardar. Intenta de nuevo.' });
      setSubmitting(false);
    }
  };

  return (
    <div style={{ ...S.page, paddingTop:'90px' }}>
      <Nav navigate={navigate} current="rsvp" />
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'50px 20px 90px' }}>

        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ ...S.label, marginBottom:'12px' }}>★ CONFIRMAR ASISTENCIA ★</div>
          <GoldDivider />
          <div style={{ ...S.goldText, ...S.ornate, fontSize:'clamp(1.8rem,5vw,2.8rem)', marginBottom:'16px', ...S.embossed }}>
            ¿Nos Acompañas?
          </div>
          <div style={{ ...S.body, opacity:0.75, fontSize:'0.98rem', marginBottom:'16px' }}>
            {stats.libres} lugares disponibles de {EVENTO.cupo}
          </div>
          <div style={{ width:'320px', height:'6px', background:'rgba(212,175,55,0.15)', margin:'0 auto', borderRadius:'3px', overflow:'hidden', border:`1px solid ${F.bronze}` }}>
            <div style={{ width:`${((EVENTO.cupo-stats.libres)/EVENTO.cupo)*100}%`, height:'100%', background:`linear-gradient(90deg,${F.bronze},${F.pureGold})`, borderRadius:'2px', transition:'width 1s ease', boxShadow:`0 0 12px ${F.shadow}` }} />
          </div>
        </div>

        <div style={{ ...S.card, position:'relative' }}>
          <OrnateBorder />

          {errors.general && (
            <div style={{ background:'rgba(192,57,43,0.1)', border:`2px solid #c0392b`, padding:'16px', borderRadius:'6px', marginBottom:'24px' }}>
              <p style={{ color:'#e74c3c', fontSize:'0.92rem', fontWeight:600 }}>⚠️ {errors.general}</p>
            </div>
          )}

          <Campo 
            k="nombre" 
            value={form.nombre}
            onChange={e => set('nombre', e.target.value)}
            label="NOMBRE COMPLETO" 
            placeholder="Tu nombre y apellido" 
            error={errors.nombre}
          />
          
          <Campo 
            k="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            label="CORREO ELECTRÓNICO" 
            tipo="email" 
            placeholder="tucorreo@ejemplo.com" 
            error={errors.email}
          />
          
          <Campo 
            k="telefono"
            value={form.telefono}
            onChange={e => set('telefono', e.target.value)}
            label="TELÉFONO (OPCIONAL)" 
            tipo="tel" 
            placeholder="+502 0000-0000"
          />

          <div style={{ marginBottom:'24px' }}>
            <div onClick={() => set('acompanante', !form.acompanante)} style={{ display:'flex', alignItems:'center', gap:'16px', cursor:'pointer', padding:'18px', border:`2px solid ${form.acompanante ? F.pureGold : F.bronze}`, borderRadius:'6px', background: form.acompanante ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)', transition:'all 0.3s', boxShadow: form.acompanante ? `0 0 20px ${F.shadow}` : 'none' }}>
              <div style={{ width:'52px', height:'28px', borderRadius:'14px', background: form.acompanante ? `linear-gradient(135deg,${F.bronze},${F.pureGold})` : F.bronze, position:'relative', transition:'background 0.3s', flexShrink:0 }}>
                <div style={{ position:'absolute', top:'3px', left: form.acompanante ? '26px' : '3px', width:'22px', height:'22px', borderRadius:'50%', background: F.ivory, transition:'left 0.3s', boxShadow:`0 2px 8px rgba(0,0,0,0.4)` }} />
              </div>
              <span style={{ ...S.body, fontSize:'1rem' }}>
                Llevaré un acompañante <span style={{ opacity:0.6, fontSize:'0.92rem' }}>(máx. 1)</span>
              </span>
            </div>
          </div>

          {form.acompanante && (
            <Campo 
              k="nombreAcomp"
              value={form.nombreAcomp}
              onChange={e => set('nombreAcomp', e.target.value)}
              label="NOMBRE DEL ACOMPAÑANTE" 
              placeholder="Nombre y apellido" 
              error={errors.nombreAcomp}
            />
          )}

          <div style={{ background:`linear-gradient(135deg, rgba(212,175,55,0.12), rgba(205,127,50,0.08))`, border:`2px solid ${F.pureGold}`, padding:'20px', borderRadius:'6px', marginBottom:'32px' }}>
            <p style={{ ...S.body, fontSize:'0.92rem', textAlign:'center', lineHeight:1.8 }}>
              ★ &nbsp; Tras confirmar, recibirás un <strong style={{color:F.pureGold}}>enlace especial</strong> para subir una foto o mensaje de video para Zandra.
            </p>
          </div>

          <Btn onClick={enviar} filled disabled={submitting} style={{ width:'100%', textAlign:'center', display:'block' }}>
            {submitting ? 'CONFIRMANDO...' : 'CONFIRMAR ASISTENCIA ★'}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── PÁGINA 4: CONFIRMACIÓN ────────────────────────────────────
function Confirmacion({ navigate, rsvpData }) {
  const uploadUrl = `${window.location.origin}?upload=${rsvpData?.uploadToken || ''}`;

  return (
    <div style={{ ...S.page, paddingTop:'90px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <Nav navigate={navigate} current="" />
      <div style={{ ...S.card, maxWidth:'680px', width:'95vw', textAlign:'center', padding:'52px 44px', margin:'50px auto', position:'relative' }}>
        <OrnateBorder />
        
        <div style={{ fontSize:'4rem', marginBottom:'20px' }}>🥂</div>
        <div style={{ ...S.label, marginBottom:'12px' }}>★ ¡CONFIRMACIÓN RECIBIDA! ★</div>
        <GoldDivider />
        <div style={{ ...S.goldText, ...S.ornate, fontSize:'clamp(1.6rem,5vw,2.4rem)', marginBottom:'16px', ...S.embossed }}>
          ¡Nos Alegra Contar Contigo!
        </div>
        <div style={{ ...S.serif, fontSize:'clamp(1.3rem,4vw,2rem)', marginBottom:'24px', color:F.lightGold }}>
          {rsvpData?.nombre || 'Estimado Invitado'}
        </div>
        <p style={{ ...S.body, opacity:0.8, marginBottom:'28px', fontSize:'1.02rem' }}>
          Tu asistencia ha sido registrada{rsvpData?.acompanante && rsvpData.nombreAcomp ? ` junto con ${rsvpData.nombreAcomp}` : ''} para la celebración de los 60 años de Zandra.
        </p>
        
        <div style={{ background:'rgba(212,175,55,0.08)', border:`2px solid ${F.pureGold}`, padding:'26px', borderRadius:'6px', margin:'0 0 28px' }}>
          <p style={{ ...S.label, marginBottom:'14px' }}>TU ENLACE PERSONAL</p>
          <input readOnly value={uploadUrl} onClick={e => e.target.select()}
            style={{ ...S.input, fontSize:'0.8rem', textAlign:'center', cursor:'pointer', marginBottom:'14px', fontFamily:"'Courier New',monospace" }} />
          <p style={{ ...S.body, fontSize:'0.9rem', lineHeight:1.8 }}>
            ★ Usa este enlace para subir una foto o video para Zandra. Guárdalo bien — será parte de la sorpresa.
          </p>
        </div>
        
        <GoldDivider />
        <p style={{ ...S.body, fontStyle:'italic', opacity:0.5, fontSize:'0.88rem', marginBottom:'28px' }}>
          {EVENTO.fecha} · {EVENTO.hora}<br/>{EVENTO.lugar}
        </p>
        <Btn onClick={() => navigate('landing')}>← Volver al Inicio</Btn>
      </div>
    </div>
  );
}

// ── PÁGINA 5: SUBIR ARCHIVO ───────────────────────────────────
function SubirArchivo({ navigate, uploadToken }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState('');
  const [nombre, setNombre] = useState('');
  const [drag, setDrag] = useState(false);
  const [done, setDone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tipoArchivo, setTipoArchivo] = useState('');
  const [videoError, setVideoError] = useState('');

  const handleFile = (f) => {
    if (!f) return;
    setVideoError('');
    if (tipoArchivo === 'video') {
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => {
        URL.revokeObjectURL(vid.src);
        if (vid.duration > 60) {
          setVideoError('El video excede 1 minuto. Por favor graba un video más corto.');
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
    if (!file || !nombre.trim() || !tipoArchivo) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'zandra-60');

      const resourceType = tipoArchivo === 'video' ? 'video' : 'image';
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Error subiendo archivo');
      const cloudData = await res.json();

      const { error } = await supabase.from('uploads').insert([{
        nombre_persona: nombre,
        tipo_archivo: tipoArchivo,
        archivo_url: cloudData.secure_url,
        mensaje: msg || null
      }]);

      if (error) throw error;

      setDone(true);
    } catch (err) {
      console.error('Error:', err);
      alert('Hubo un error al subir el archivo. Intenta de nuevo.');
      setUploading(false);
    }
  };

  if (done) return (
    <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'20px' }}>
      <div style={{ ...S.card, maxWidth:'580px', width:'95vw', textAlign:'center', padding:'52px 44px', position:'relative' }}>
        <OrnateBorder />
        <div style={{ fontSize:'4rem', marginBottom:'20px' }}>★</div>
        <div style={{ ...S.label, marginBottom:'12px' }}>¡RECIBIDO CON AMOR!</div>
        <GoldDivider />
        <p style={{ ...S.body, opacity:0.85, marginBottom:'28px', fontSize:'1rem' }}>
          Tu mensaje fue enviado exitosamente. Será parte de la sorpresa especial el día de la celebración de Zandra.
        </p>
        <Btn onClick={() => navigate('landing')}>← Volver al Inicio</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ ...S.page, paddingTop:'50px' }}>
      <div style={{ maxWidth:'720px', margin:'0 auto', padding:'50px 20px 90px' }}>

        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ ...S.label, marginBottom:'12px' }}>★ TU MENSAJE ESPECIAL ★</div>
          <GoldDivider />
          <div style={{ ...S.goldText, ...S.ornate, fontSize:'clamp(1.6rem,5vw,2.4rem)', marginBottom:'14px', ...S.embossed }}>
            Un Regalo para Zandra
          </div>
          <p style={{ ...S.body, opacity:0.75, fontSize:'0.98rem', maxWidth:'540px', margin:'0 auto' }}>
            Comparte un recuerdo especial. Se presentará como sorpresa el día de su celebración. ★
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'32px' }}>
          {[
            { k:'foto-con-ella', i:'★', t:'Foto con Ella', d:'Una foto tuya junto a Zandra' },
            { k:'recuerdo', i:'★', t:'Recuerdo', d:'Foto de infancia u otro momento especial' },
            { k:'video', i:'★', t:'Video Mensaje', d:'Felicitación en video (máx. 1 min)' },
          ].map(o => {
            const sel = tipoArchivo === o.k;
            return (
              <div key={o.k} onClick={() => { setTipoArchivo(o.k); setFile(null); setPreview(null); setVideoError(''); }}
                style={{ ...S.card, padding:'20px 16px', textAlign:'center', cursor:'pointer', borderColor: sel ? F.pureGold : F.bronze, borderWidth: sel ? '3px' : '2px', background: sel ? 'rgba(212,175,55,0.1)' : 'linear-gradient(145deg, rgba(26,22,18,0.9), rgba(13,12,10,0.95))', transition:'all 0.3s', boxShadow: sel ? `0 0 30px ${F.shadow}` : S.card.boxShadow }}>
                <div style={{ color:F.pureGold, fontSize:'2rem', marginBottom:'12px' }}>{o.i}</div>
                <div style={{ ...S.label, fontSize:'0.6rem', marginBottom:'8px', color: sel ? F.pureGold : F.champagne }}>{o.t}</div>
                <div style={{ ...S.body, fontSize:'0.76rem', opacity:0.7, lineHeight:1.5 }}>{o.d}</div>
                {sel && <div style={{ width:'32px', height:'3px', background:F.pureGold, margin:'12px auto 0', boxShadow:`0 0 8px ${F.shadow}` }} />}
              </div>
            );
          })}
        </div>

        <div style={{ ...S.card, position:'relative' }}>
          <OrnateBorder />

          <div style={{ marginBottom:'24px' }}>
            <label style={S.label}>TU NOMBRE COMPLETO</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="¿Cómo te llamas?" style={S.input} />
          </div>

          {tipoArchivo && (
            <div style={{ background:'rgba(212,175,55,0.08)', border:`2px solid ${F.pureGold}`, padding:'18px 22px', borderRadius:'6px', marginBottom:'24px' }}>
              <p style={{ ...S.body, fontSize:'0.9rem', textAlign:'center', lineHeight:1.75 }}>
                {tipoArchivo === 'foto-con-ella' && '★ Sube una foto donde aparezcas junto a Zandra — puede ser reciente o de cualquier época.'}
                {tipoArchivo === 'recuerdo' && '★ Sube una foto que capture un recuerdo de Zandra — de su infancia, juventud o cualquier momento que quieras compartir.'}
                {tipoArchivo === 'video' && '★ Graba un video con tus felicitaciones de cumpleaños. Máximo 1 minuto (60 segundos). ¡Habla desde el corazón!'}
              </p>
            </div>
          )}

          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => tipoArchivo && document.getElementById('fileInput').click()}
            style={{ border:`3px dashed ${drag?F.pureGold:tipoArchivo?F.bronze:'rgba(205,127,50,0.3)'}`, borderRadius:'6px', padding:'44px 28px', textAlign:'center', cursor:tipoArchivo?'pointer':'not-allowed', marginBottom:'16px', background:drag?'rgba(212,175,55,0.08)':'rgba(255,255,255,0.02)', transition:'all 0.3s', opacity:tipoArchivo?1:0.5, boxShadow: drag?`0 0 30px ${F.shadow}`:'none' }}
          >
            <input id="fileInput" type="file" accept={tipoArchivo==='video'?'video/*':'image/*'} style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
            <div style={{ fontSize:'3rem', marginBottom:'14px', color:F.pureGold }}>{file ? '★' : tipoArchivo==='video' ? '★' : '★'}</div>
            <div style={{ ...S.label, marginBottom:'8px', fontSize:'0.65rem' }}>
              {file ? file.name : tipoArchivo ? (tipoArchivo==='video'?'VIDEO — MP4 · MOV':'IMAGEN — JPG · PNG') : 'PRIMERO ELIGE UN TIPO ARRIBA'}
            </div>
            <p style={{ ...S.body, opacity:0.6, fontSize:'0.86rem' }}>
              {file ? 'Haz clic para cambiar el archivo' : 'Arrastra aquí o haz clic para seleccionar'}
            </p>
            {tipoArchivo === 'video' && !file && (
              <p style={{ ...S.label, fontSize:'0.72rem', color:F.pureGold, marginTop:'10px' }}>⏱ MÁXIMO 60 SEGUNDOS</p>
            )}
          </div>

          {videoError && (
            <div style={{ background:'rgba(192,57,43,0.1)', border:`2px solid #c0392b`, padding:'14px 20px', borderRadius:'6px', marginBottom:'20px' }}>
              <p style={{ color:'#e74c3c', fontSize:'0.9rem', fontStyle:'italic', fontWeight:600 }}>⚠️ {videoError}</p>
            </div>
          )}

          {preview && !videoError && (
            <div style={{ marginBottom:'24px', textAlign:'center', borderRadius:'6px', overflow:'hidden', border:`3px solid ${F.pureGold}`, boxShadow:`0 0 20px ${F.shadow}` }}>
              {preview.tipo === 'imagen'
                ? <img src={preview.url} alt="preview" style={{ maxWidth:'100%', maxHeight:'280px', display:'block', margin:'0 auto' }} />
                : <video src={preview.url} controls style={{ maxWidth:'100%', maxHeight:'280px', display:'block', margin:'0 auto' }} />}
            </div>
          )}

          <div style={{ marginBottom:'32px', marginTop:'16px' }}>
            <label style={S.label}>MENSAJE ESCRITO PARA ZANDRA <span style={{ opacity:0.5 }}>(OPCIONAL)</span></label>
            <textarea value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Escribe unas palabras de cariño para Zandra en su día especial..." rows={3}
              style={{ ...S.input, resize:'vertical', lineHeight:1.7 }} />
          </div>

          {(!tipoArchivo || !file || !nombre.trim()) && (
            <p style={{ ...S.body, fontSize:'0.84rem', opacity:0.5, textAlign:'center', marginBottom:'20px', fontWeight:600 }}>
              {!tipoArchivo ? '① Elige el tipo de archivo arriba'
                : !nombre.trim() ? '② Ingresa tu nombre'
                : '③ Selecciona tu archivo'}
            </p>
          )}

          <Btn onClick={enviar} filled
            disabled={!file || !nombre.trim() || uploading || !!videoError || !tipoArchivo}
            style={{ width:'100%', display:'block', textAlign:'center' }}>
            {uploading ? 'ENVIANDO CON AMOR...' : 'ENVIAR MI REGALO ★'}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── PÁGINA 6: ADMIN ───────────────────────────────────────────
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
    const fetchData = async () => {
      const [rsvpData, uploadData] = await Promise.all([
        supabase.from('rsvps').select('*').order('created_at', { ascending: false }),
        supabase.from('uploads').select('*').order('created_at', { ascending: false })
      ]);
      if (rsvpData.data) setRsvps(rsvpData.data);
      if (uploadData.data) setUploads(uploadData.data);
      setLoading(false);
    };
    fetchData();
  }, [auth]);

  if (!auth) return (
    <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <div style={{ ...S.card, maxWidth:'420px', width:'94vw', textAlign:'center', padding:'48px 40px', position:'relative' }}>
        <OrnateBorder />
        <p style={S.label}>★ PANEL DE ADMINISTRACIÓN ★</p>
        <GoldDivider />
        <p style={{ ...S.body, opacity:0.6, marginBottom:'28px', fontSize:'0.94rem' }}>Acceso restringido</p>
        <label style={S.label}>CONTRASEÑA</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&intentar()} style={{ ...S.input, textAlign:'center', marginBottom:'12px', letterSpacing:'0.3em', fontFamily:"'Courier New',monospace" }} placeholder="••••••••" />
        {err && <p style={{ color:'#e74c3c', fontSize:'0.86rem', marginBottom:'12px', fontWeight:600 }}>{err}</p>}
        <Btn onClick={intentar} filled style={{ width:'100%', display:'block', textAlign:'center', marginTop:'16px' }}>INGRESAR</Btn>
        <Btn onClick={() => navigate('landing')} style={{ width:'100%', display:'block', textAlign:'center', marginTop:'16px', fontSize:'0.65rem' }}>← VOLVER</Btn>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <p style={{ ...S.body, opacity:0.7 }}>Cargando datos...</p>
    </div>
  );

  const confirmados = rsvps.length;
  const totalPersonas = confirmados + rsvps.filter(r => r.acompanante).length;
  const conMedia = uploads.length;

  const exportCSV = () => {
    const headers = 'Nombre,Email,Teléfono,Acompañante,Nombre Acompañante,Fecha\n';
    const rows = rsvps.map(r => `"${r.nombre}","${r.email}","${r.telefono || ''}","${r.acompanante?'Sí':'No'}","${r.nombre_acomp||''}","${new Date(r.created_at).toLocaleDateString()}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvps-zandra-60.csv';
    a.click();
  };

  return (
    <div style={{ ...S.page, paddingTop:'28px' }}>
      <div style={{ maxWidth:'1020px', margin:'0 auto', padding:'32px 20px 90px' }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <p style={{ ...S.label, marginBottom:'6px' }}>PANEL DE ADMINISTRACIÓN</p>
            <div style={{ ...S.goldText, ...S.ornate, fontSize:'2.2rem', ...S.embossed }}>60 AÑOS — ZANDRA VELIZ</div>
          </div>
          <Btn onClick={() => navigate('landing')} style={{ fontSize:'0.65rem', padding:'12px 24px' }}>← SALIR</Btn>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'16px', marginBottom:'36px' }}>
          {[
            { l:'Confirmados', v:confirmados, s:'invitados' },
            { l:'Total Personas', v:totalPersonas, s:`de ${EVENTO.cupo}` },
            { l:'Archivos Recibidos', v:conMedia, s:'fotos/videos' },
            { l:'Cupos Libres', v:EVENTO.cupo-totalPersonas, s:'disponibles' },
          ].map(stat => (
            <div key={stat.l} style={{ ...S.card, padding:'22px', textAlign:'center' }}>
              <p style={{ ...S.label, marginBottom:'8px', fontSize:'0.62rem' }}>{stat.l}</p>
              <div style={{ ...S.goldText, ...S.ornate, fontSize:'3rem', margin:'8px 0', ...S.embossed }}>{stat.v}</div>
              <p style={{ ...S.body, fontSize:'0.8rem', opacity:0.6 }}>{stat.s}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:'36px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
            <p style={{ ...S.label, fontSize:'0.65rem' }}>CAPACIDAD UTILIZADA</p>
            <p style={{ ...S.label, fontSize:'0.65rem' }}>{Math.round((totalPersonas/EVENTO.cupo)*100)}%</p>
          </div>
          <div style={{ height:'8px', background:'rgba(212,175,55,0.1)', borderRadius:'4px', overflow:'hidden', border:`1px solid ${F.bronze}` }}>
            <div style={{ width:`${(totalPersonas/EVENTO.cupo)*100}%`, height:'100%', background:`linear-gradient(90deg,${F.bronze},${F.pureGold})`, borderRadius:'3px', transition:'width 1s ease', boxShadow:`0 0 12px ${F.shadow}` }} />
          </div>
        </div>

        <div style={{ ...S.card, padding:0, overflow:'hidden', marginBottom:'28px' }}>
          <div style={{ padding:'20px 28px', borderBottom:`2px solid ${F.bronze}`, background:'rgba(212,175,55,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={S.label}>LISTA DE CONFIRMACIONES</p>
            <span style={{ ...S.label, fontSize:'0.6rem', opacity:0.7 }}>{confirmados} registros</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`2px solid ${F.bronze}`, background:'rgba(212,175,55,0.03)' }}>
                  {['Nombre','Email','Teléfono','Acompañante','Fecha'].map(h => (
                    <th key={h} style={{ ...S.label, padding:'14px 20px', textAlign:'left', fontWeight:700, whiteSpace:'nowrap', fontSize:'0.62rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rsvps.map((r,i) => (
                  <tr key={i} style={{ borderBottom:`1px solid rgba(205,127,50,0.15)`, background: i%2===0?'rgba(255,255,255,0.01)':'transparent' }}>
                    <td style={{ ...S.body, padding:'14px 20px', fontSize:'0.94rem', whiteSpace:'nowrap' }}>{r.nombre}</td>
                    <td style={{ ...S.body, padding:'14px 20px', fontSize:'0.84rem', opacity:0.7 }}>{r.email}</td>
                    <td style={{ ...S.body, padding:'14px 20px', fontSize:'0.8rem', opacity:0.6 }}>{r.telefono || '—'}</td>
                    <td style={{ padding:'14px 20px', fontSize:'0.88rem', color: r.acompanante?F.pureGold:F.bronze }}>{r.acompanante?`★ ${r.nombre_acomp}`:'—'}</td>
                    <td style={{ ...S.body, padding:'14px 20px', fontSize:'0.8rem', opacity:0.55, whiteSpace:'nowrap' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ ...S.card, padding:0, overflow:'hidden', marginBottom:'28px' }}>
          <div style={{ padding:'20px 28px', borderBottom:`2px solid ${F.bronze}`, background:'rgba(212,175,55,0.05)' }}>
            <p style={S.label}>ARCHIVOS RECIBIDOS ({uploads.length})</p>
          </div>
          <div style={{ padding:'28px', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'18px' }}>
            {uploads.map((u,i) => (
              <div key={i} style={{ border:`2px solid ${F.bronze}`, borderRadius:'6px', padding:'18px', background:'rgba(212,175,55,0.03)' }}>
                <p style={{ ...S.label, fontSize:'0.64rem', marginBottom:'9px' }}>{u.nombre_persona}</p>
                <p style={{ ...S.body, fontSize:'0.82rem', opacity:0.65, marginBottom:'12px' }}>{u.tipo_archivo}</p>
                <a href={u.archivo_url} target="_blank" rel="noreferrer" style={{ ...S.btn, fontSize:'0.6rem', padding:'10px 20px', display:'inline-block', textDecoration:'none' }}>
                  VER ARCHIVO ★
                </a>
              </div>
            ))}
            {uploads.length === 0 && <p style={{ ...S.body, opacity:0.5, gridColumn:'1/-1', textAlign:'center', padding:'24px' }}>No hay archivos todavía</p>}
          </div>
        </div>

        <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
          <Btn onClick={exportCSV} filled>★ EXPORTAR LISTA CSV</Btn>
        </div>

      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('landing');
  const [rsvpData, setRsvpData] = useState(null);
  const [uploadToken, setUploadToken] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.textContent = '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } body { background: #0d0c0a; } button:focus { outline: none; } input:focus, textarea:focus { border-color: #d4af37 !important; } input::placeholder, textarea::placeholder { color: rgba(247,231,206,0.3); }';
    document.head.appendChild(style);

    const params = new URLSearchParams(window.location.search);
    const token = params.get('upload');
    if (token) {
      setUploadToken(token);
      setPage('subir');
    }
  }, []);

  const navigate = (p) => { setPage(p); window.scrollTo(0,0); };
  const props = { navigate, rsvpData, setRsvpData, uploadToken };

  return (
    <div style={{ background:'#0d0c0a', minHeight:'100vh' }}>
      {page === 'landing'      && <Invitacion {...props} />}
      {page === 'detalles'     && <Detalles {...props} />}
      {page === 'rsvp'         && <RSVP {...props} />}
      {page === 'confirmacion' && <Confirmacion {...props} />}
      {page === 'subir'        && <SubirArchivo {...props} />}
      {page === 'admin'        && <Admin {...props} />}
    </div>
  );
}
