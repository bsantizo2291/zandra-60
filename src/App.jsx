import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

// ── CONFIGURACIÓN ─────────────────────────────────────────────
const SUPABASE_URL = 'https://ndwheqxeuykmsfbhsvvp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kd2hlcXhldXlrbXNmYmhzdnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODkxMzYsImV4cCI6MjA5MjQ2NTEzNn0.yJ3prriU3vpS9Aa8zoAzjXcdjjAL8HqvTXw0f9bzkjg';

const CLOUDINARY_CLOUD_NAME = 'duo4dukq4';
const CLOUDINARY_UPLOAD_PRESET = 'zandra60_unsigned'; // Crearemos esto después

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Paleta & Evento ───────────────────────────────────────────
const G = {
  black: '#0a0805', deep: '#100d06', gold: '#C9A84C',
  goldLight: '#F0D080', goldDim: '#7a5f2a', cream: '#F5EDD6',
  text: '#e8d8b0', red: '#c0392b',
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

// ── Estilos Base ──────────────────────────────────────────────
const S = {
  page: { minHeight: '100vh', background: `linear-gradient(160deg,${G.black} 0%,#12100a 50%,${G.black} 100%)`, color: G.cream, fontFamily: "'Cormorant Garamond','Georgia',serif" },
  eyebrow: { fontFamily: "'IM Fell English SC','Georgia',serif", fontSize: '0.63rem', letterSpacing: '0.42em', color: G.gold, textTransform: 'uppercase', opacity: 0.85 },
  title: { fontFamily: "'Cinzel Decorative','Georgia',serif", color: G.gold, letterSpacing: '0.05em', lineHeight: 1.1, textShadow: `0 0 40px rgba(201,168,76,0.4)` },
  name: { fontFamily: "'Playfair Display','Georgia',serif", fontStyle: 'italic', color: G.goldLight, lineHeight: 1.05 },
  body: { fontSize: '1rem', lineHeight: 1.7, color: G.text, fontFamily: "'Cormorant Garamond','Georgia',serif" },
  card: { background: `linear-gradient(135deg,#1a1508,#0f0b04)`, border: `1px solid ${G.goldDim}`, borderRadius: '2px', padding: '28px', boxShadow: `0 0 40px rgba(0,0,0,0.6),inset 0 0 40px rgba(0,0,0,0.3)` },
  input: { width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${G.goldDim}`, color: G.cream, padding: '12px 16px', fontSize: '1rem', fontFamily: "'Cormorant Garamond','Georgia',serif", outline: 'none', boxSizing: 'border-box', borderRadius: '2px' },
  label: { fontFamily: "'IM Fell English SC','Georgia',serif", fontSize: '0.63rem', letterSpacing: '0.3em', color: G.goldDim, textTransform: 'uppercase', display: 'block', marginBottom: '7px' },
  btn: { display: 'inline-block', border: `1px solid ${G.gold}`, padding: '12px 28px', fontFamily: "'IM Fell English SC','Georgia',serif", fontSize: '0.68rem', letterSpacing: '0.35em', color: G.gold, textTransform: 'uppercase', background: 'transparent', cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none' },
  btnFill: { background: `linear-gradient(135deg,${G.gold},${G.goldLight})`, color: G.black, border: 'none' },
};

// ── Componentes Compartidos ───────────────────────────────────
function Divider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'14px 0' }}>
      <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg,transparent,${G.gold},transparent)` }} />
      <div style={{ width:'7px', height:'7px', background:G.gold, transform:'rotate(45deg)', flexShrink:0 }} />
      <div style={{ width:'7px', height:'7px', background:G.gold, transform:'rotate(45deg) scale(0.45)', flexShrink:0, margin:'0 -5px' }} />
      <div style={{ width:'7px', height:'7px', background:G.gold, transform:'rotate(45deg)', flexShrink:0 }} />
      <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg,transparent,${G.gold},transparent)` }} />
    </div>
  );
}

function Nav({ navigate, current }) {
  const links = [{ k:'landing', l:'Invitación' }, { k:'detalles', l:'Detalles' }, { k:'rsvp', l:'Confirmar' }];
  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(10,8,5,0.93)', backdropFilter:'blur(10px)', borderBottom:`1px solid rgba(201,168,76,0.18)`, display:'flex', alignItems:'center' }}>
      {links.map(l => (
        <button key={l.k} onClick={() => navigate(l.k)} style={{ background:'none', border:'none', cursor:'pointer', padding:'15px 20px', fontFamily:"'IM Fell English SC','Georgia',serif", fontSize:'0.62rem', letterSpacing:'0.3em', textTransform:'uppercase', color: current===l.k ? G.gold : G.goldDim, borderBottom: current===l.k ? `2px solid ${G.gold}` : '2px solid transparent', transition:'all 0.3s' }}>
          {l.l}
        </button>
      ))}
      <button onClick={() => navigate('admin')} style={{ background:'none', border:'none', cursor:'pointer', padding:'15px 14px', fontFamily:"'IM Fell English SC','Georgia',serif", fontSize:'0.52rem', letterSpacing:'0.2em', color:'rgba(122,95,42,0.35)', marginLeft:'auto', transition:'color 0.3s' }}>
        Admin
      </button>
    </nav>
  );
}

function Btn({ onClick, filled, children, style={}, disabled=false }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...S.btn, ...(filled ? S.btnFill : {}), ...style, opacity: disabled ? 0.45 : hover ? 0.82 : 1, transform: hover && !disabled ? 'translateY(-1px)' : 'none' }}>
      {children}
    </button>
  );
}

// ── PÁGINA 1: INVITACIÓN ──────────────────────────────────────
function Invitacion({ navigate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, pts = [], raf;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const rnd = (a,b) => Math.random()*(b-a)+a;
    class P {
      constructor(init) { this.x=rnd(0,W); this.y=init?rnd(0,H):rnd(-20,-5); this.r=rnd(1,3.2); this.vy=rnd(0.2,0.75); this.vx=rnd(-0.2,0.2); this.a=rnd(0.12,0.65); this.c=Math.random()>0.5?'#C9A84C':'#F0D080'; this.d=Math.random()>0.55; }
      draw() { ctx.save(); ctx.globalAlpha=this.a; ctx.fillStyle=this.c; if(this.d){ctx.translate(this.x,this.y);ctx.rotate(Math.PI/4);ctx.fillRect(-this.r,-this.r,this.r*2,this.r*2);}else{ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();} ctx.restore(); }
      update() { this.y+=this.vy; this.x+=this.vx; if(this.y>H+10){this.x=rnd(0,W);this.y=rnd(-20,-5);} }
    }
    for(let i=0;i<85;i++) pts.push(new P(true));
    const loop=()=>{ ctx.clearRect(0,0,W,H); pts.forEach(p=>{p.update();p.draw();}); raf=requestAnimationFrame(loop); };
    loop();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  }, []);

  return (
    <div style={{ ...S.page, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'-60px', left:'50%', transform:'translateX(-50%)', width:'500px', height:'220px', background:'radial-gradient(ellipse,rgba(201,168,76,0.13) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ ...S.card, position:'relative', width:'min(640px,95vw)', margin:'32px auto', zIndex:10, overflow:'hidden' }}>
        {['top','bottom'].map(p => (
          <div key={p} style={{ position:'absolute', [p]:0, left:0, right:0, height:'5px', background:`repeating-linear-gradient(90deg,${G.gold} 0,${G.gold} 2px,transparent 2px,transparent 13px,${G.gold} 13px,${G.gold} 15px)`, opacity:0.55 }} />
        ))}
        {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
          <div key={v+h} style={{ position:'absolute', [v]:'14px', [h]:'14px', width:'36px', height:'36px', borderTop: v==='top'?`2px solid ${G.goldDim}`:'none', borderBottom: v==='bottom'?`2px solid ${G.goldDim}`:'none', borderLeft: h==='left'?`2px solid ${G.goldDim}`:'none', borderRight: h==='right'?`2px solid ${G.goldDim}`:'none' }} />
        ))}

        <div style={{ padding:'48px 40px', textAlign:'center' }}>
          <p style={S.eyebrow}>✦ &nbsp; Una Celebración de Esplendor &nbsp; ✦</p>
          <Divider />
          <p style={{ ...S.body, fontStyle:'italic', opacity:0.65, marginBottom:'6px' }}>te invitamos a celebrar a</p>
          <h1 style={{ ...S.name, fontSize:'clamp(2rem,6vw,3.2rem)', margin:'8px 0 16px', background:`linear-gradient(90deg,${G.goldLight} 20%,#fffbe6 50%,${G.goldLight} 80%)`, WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent' }}>
            Zandra B. Veliz Ortiz
          </h1>
          <Divider />
          <p style={{ ...S.eyebrow, marginBottom:'6px', fontSize:'0.58rem' }}>en sus</p>
          <div style={{ ...S.title, fontSize:'clamp(4rem,12vw,6rem)', lineHeight:1, marginBottom:'2px' }}>60</div>
          <p style={{ ...S.eyebrow, letterSpacing:'0.55em', marginBottom:'20px' }}>Años de Brillantez</p>
          <div style={{ ...S.title, fontSize:'clamp(1.3rem,4vw,2rem)', marginBottom:'20px' }}>Una Velada Gatsby</div>
          <Divider />
          <p style={{ ...S.body, fontStyle:'italic', opacity:0.8, margin:'8px 0 4px' }}>{EVENTO.fecha}</p>
          <p style={{ ...S.body, opacity:0.55, marginBottom:'4px' }}>{EVENTO.hora}</p>
          <p style={{ ...S.body, opacity:0.65, fontSize:'0.92rem', marginBottom:'3px' }}>{EVENTO.lugar}</p>
          <p style={{ ...S.body, opacity:0.42, fontSize:'0.78rem', marginBottom:'28px' }}>{EVENTO.direccion}</p>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <Btn onClick={() => navigate('detalles')}>Ver Detalles</Btn>
            <Btn onClick={() => navigate('rsvp')} filled>Confirmar Asistencia ✦</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PÁGINA 2: DETALLES ────────────────────────────────────────
const VESTUARIO = [
  { titulo:'Señoras — Vestido de Gala', desc:'Vestido largo en dorado, negro o champagne con lentejuelas o encaje. Tocado, diadema o plumas. Joyería art déco.', colores:['#C9A84C','#1a1208','#F5EDD6'] },
  { titulo:'Señoras — Conjunto de Noche', desc:'Pantalón y blusa con brillos o brocado. Bolso clutch dorado o negro. Guantes de encaje opcionales.', colores:['#2a2015','#C9A84C','#8a6f2e'] },
  { titulo:'Caballeros — Esmoquin', desc:'Esmoquin negro o blanco con corbatín y fajín. Pañuelo dorado. Zapatos de charol.', colores:['#1a1208','#F5EDD6','#C9A84C'] },
  { titulo:'Caballeros — Traje Completo', desc:'Traje 3 piezas en negro, gris carbón o azul noche. Chaleco, sombrero de ala y bastón elegante.', colores:['#2d3142','#C9A84C','#F5EDD6'] },
  { titulo:'Accesorios — Señoras', desc:'Collar de perlas, aretes largos, pulsera dorada. Portacigarros decorativo o abanico de plumas como prop.', colores:['#F5EDD6','#C9A84C','#f0e0a0'] },
  { titulo:'Accesorios — Caballeros', desc:'Gemelos dorados, reloj de bolsillo con cadena. Sombrero Fedora o Bowler. Broche de solapa art déco.', colores:['#C9A84C','#1a1208','#8a6f2e'] },
];

function Detalles({ navigate }) {
  return (
    <div style={{ ...S.page, paddingTop:'68px' }}>
      <Nav navigate={navigate} current="detalles" />
      <div style={{ maxWidth:'780px', margin:'0 auto', padding:'40px 18px 70px' }}>

        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <p style={S.eyebrow}>✦ &nbsp; Detalles del Evento &nbsp; ✦</p>
          <Divider />
          <div style={{ ...S.title, fontSize:'clamp(1.4rem,4vw,2.2rem)', marginBottom:'8px' }}>Una Velada Gatsby</div>
          <div style={{ ...S.name, fontSize:'clamp(1.3rem,4vw,2rem)' }}>Zandra B. Veliz Ortiz</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:'14px', marginBottom:'36px' }}>
          {[
            { i:'📅', l:'Fecha', v:'Sábado\n5 de Septiembre, 2026' },
            { i:'🕖', l:'Hora', v:'19:00 A 24:00 hrs' },
            { i:'📍', l:'Lugar', v:'El Club Español\nÁrea Fuentecilla' },
            { i:'🗺️', l:'Dirección', v:'Calzada Roosevelt Km. 13.5\nZona 7 de Mixco, Guatemala' },
          ].map(d => (
            <div key={d.l} style={{ ...S.card, padding:'18px', textAlign:'center' }}>
              <div style={{ fontSize:'1.7rem', marginBottom:'8px' }}>{d.i}</div>
              <p style={{ ...S.eyebrow, marginBottom:'6px' }}>{d.l}</p>
              <p style={{ ...S.body, fontSize:'0.87rem', whiteSpace:'pre-line', opacity:0.8 }}>{d.v}</p>
            </div>
          ))}
        </div>

        <div style={{ ...S.card, textAlign:'center', marginBottom:'36px', padding:'20px' }}>
          <p style={{ ...S.eyebrow, marginBottom:'12px' }}>Ubicación del Evento</p>
          <a href={EVENTO.mapsUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, display:'inline-block' }}>
            📍 &nbsp; Abrir en Google Maps
          </a>
        </div>

        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <p style={S.eyebrow}>✦ &nbsp; Código de Vestimenta &nbsp; ✦</p>
          <Divider />
          <div style={{ ...S.title, fontSize:'clamp(1.1rem,3vw,1.5rem)', marginBottom:'12px' }}>Etiqueta Rigurosa & Glamour Gatsby</div>
          <p style={{ ...S.body, opacity:0.65, maxWidth:'500px', margin:'0 auto 16px', fontSize:'0.93rem' }}>
            Celebremos con el esplendor de los años 20. Viste de negro, dorado o champagne. Lentejuelas, plumas, guantes y alhajas son bienvenidos. ¡Sorpréndenos!
          </p>
          <div style={{ display:'inline-block', border:`1px solid ${G.goldDim}`, padding:'8px 26px', marginBottom:'28px' }}>
            <p style={{ ...S.eyebrow, color:G.gold }}>Negro · Dorado · Champagne · Marfil</p>
          </div>
        </div>

        <div style={{ marginBottom:'40px' }}>
          <p style={{ ...S.eyebrow, textAlign:'center', marginBottom:'8px' }}>Inspiración de Vestuario</p>
          <Divider />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'14px', marginTop:'20px' }}>
            {VESTUARIO.map((v, i) => {
              const [h, setH] = useState(false);
              return (
                <div key={i} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ ...S.card, padding:'18px', transition:'all 0.3s', background: h?'rgba(201,168,76,0.07)':'linear-gradient(135deg,#1a1508,#0f0b04)', borderColor: h?G.gold:G.goldDim }}>
                  <div style={{ display:'flex', gap:'6px', marginBottom:'10px' }}>
                    {v.colores.map((c,j) => <div key={j} style={{ width:'22px', height:'22px', background:c, borderRadius:'50%', border:`1px solid rgba(201,168,76,0.25)` }} />)}
                  </div>
                  <p style={{ ...S.eyebrow, marginBottom:'7px', fontSize:'0.6rem' }}>{v.titulo}</p>
                  <p style={{ ...S.body, fontSize:'0.87rem', opacity:0.72 }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign:'center' }}>
          <Divider />
          <p style={{ ...S.body, fontStyle:'italic', opacity:0.5, marginBottom:'16px', fontSize:'0.9rem' }}>Los cupos son limitados. Confirma tu asistencia pronto.</p>
          <Btn onClick={() => navigate('rsvp')} filled>Confirmar Asistencia ✦</Btn>
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

  const Campo = ({ k, label, tipo='text', placeholder='' }) => (
    <div style={{ marginBottom:'18px' }}>
      <label style={S.label}>{label}</label>
      <input type={tipo} value={form[k]} placeholder={placeholder} onChange={e => set(k, e.target.value)}
        style={{ ...S.input, borderColor: errors[k] ? G.red : G.goldDim }} />
      {errors[k] && <p style={{ color:'#e74c3c', fontSize:'0.78rem', marginTop:'4px', fontStyle:'italic' }}>{errors[k]}</p>}
    </div>
  );

  return (
    <div style={{ ...S.page, paddingTop:'68px' }}>
      <Nav navigate={navigate} current="rsvp" />
      <div style={{ maxWidth:'520px', margin:'0 auto', padding:'40px 18px 70px' }}>

        <div style={{ textAlign:'center', marginBottom:'30px' }}>
          <p style={S.eyebrow}>✦ &nbsp; Confirmar Asistencia &nbsp; ✦</p>
          <Divider />
          <div style={{ ...S.title, fontSize:'clamp(1.3rem,4vw,1.9rem)', marginBottom:'8px' }}>¿Nos Acompañas?</div>
          <p style={{ ...S.body, opacity:0.55, fontSize:'0.88rem', marginBottom:'8px' }}>{stats.libres} lugares disponibles de {EVENTO.cupo}</p>
          <div style={{ width:'220px', height:'4px', background:'rgba(255,255,255,0.08)', margin:'0 auto', borderRadius:'2px', overflow:'hidden' }}>
            <div style={{ width:`${((EVENTO.cupo-stats.libres)/EVENTO.cupo)*100}%`, height:'100%', background:`linear-gradient(90deg,${G.gold},${G.goldLight})` }} />
          </div>
        </div>

        <div style={S.card}>
          {errors.general && (
            <div style={{ background:'rgba(192,57,43,0.1)', border:'1px solid rgba(192,57,43,0.3)', padding:'12px', borderRadius:'2px', marginBottom:'18px' }}>
              <p style={{ color:'#e74c3c', fontSize:'0.85rem' }}>⚠️ {errors.general}</p>
            </div>
          )}

          <Campo k="nombre" label="Nombre Completo" placeholder="Tu nombre y apellido" />
          <Campo k="email" label="Correo Electrónico" tipo="email" placeholder="tucorreo@ejemplo.com" />
          <Campo k="telefono" label="Teléfono (Opcional)" tipo="tel" placeholder="+502 0000-0000" />

          <div style={{ marginBottom:'18px' }}>
            <div onClick={() => set('acompanante', !form.acompanante)} style={{ display:'flex', alignItems:'center', gap:'12px', cursor:'pointer' }}>
              <div style={{ width:'42px', height:'22px', borderRadius:'11px', background: form.acompanante ? G.gold : 'rgba(255,255,255,0.1)', position:'relative', transition:'background 0.3s', flexShrink:0 }}>
                <div style={{ position:'absolute', top:'3px', left: form.acompanante ? '22px' : '3px', width:'16px', height:'16px', borderRadius:'50%', background: form.acompanante ? G.black : G.goldDim, transition:'left 0.3s' }} />
              </div>
              <span style={{ ...S.body, fontSize:'0.93rem' }}>Llevaré un acompañante <span style={{ opacity:0.5 }}>(máx. 1)</span></span>
            </div>
          </div>

          {form.acompanante && <Campo k="nombreAcomp" label="Nombre del Acompañante" placeholder="Nombre y apellido" />}

          <div style={{ background:'rgba(201,168,76,0.05)', border:`1px solid rgba(201,168,76,0.2)`, padding:'14px', borderRadius:'2px', marginBottom:'22px' }}>
            <p style={{ ...S.body, fontSize:'0.82rem', opacity:0.7, lineHeight:1.6 }}>
              💛 &nbsp; Tras confirmar, recibirás un <strong style={{color:G.gold}}>enlace especial</strong> para subir una foto o mensaje de video para Zandra.
            </p>
          </div>

          <Btn onClick={enviar} filled disabled={submitting} style={{ width:'100%', textAlign:'center', display:'block' }}>
            {submitting ? 'Confirmando...' : 'Confirmar Asistencia ✦'}
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
    <div style={{ ...S.page, paddingTop:'68px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <Nav navigate={navigate} current="" />
      <div style={{ ...S.card, maxWidth:'540px', width:'95vw', textAlign:'center', padding:'48px 36px', margin:'40px auto', overflow:'hidden', position:'relative' }}>
        {['top','bottom'].map(p => (
          <div key={p} style={{ position:'absolute', [p]:0, left:0, right:0, height:'4px', background:`repeating-linear-gradient(90deg,${G.gold} 0,${G.gold} 2px,transparent 2px,transparent 12px,${G.gold} 12px,${G.gold} 14px)`, opacity:0.5 }} />
        ))}
        <div style={{ fontSize:'2.8rem', marginBottom:'14px' }}>🥂</div>
        <p style={S.eyebrow}>✦ &nbsp; ¡Confirmación Recibida! &nbsp; ✦</p>
        <Divider />
        <div style={{ ...S.title, fontSize:'clamp(1.2rem,4vw,1.7rem)', marginBottom:'10px' }}>¡Nos alegra contar contigo!</div>
        <div style={{ ...S.name, fontSize:'clamp(1.3rem,4vw,1.9rem)', marginBottom:'18px' }}>{rsvpData?.nombre || 'Estimado Invitado'}</div>
        <p style={{ ...S.body, opacity:0.68, marginBottom:'16px', fontSize:'0.93rem' }}>
          Tu asistencia ha sido registrada{rsvpData?.acompanante && rsvpData.nombreAcomp ? ` junto con ${rsvpData.nombreAcomp}` : ''} para la celebración de los 60 años de Zandra.
        </p>
        <div style={{ background:'rgba(201,168,76,0.06)', border:`1px solid rgba(201,168,76,0.22)`, padding:'18px', borderRadius:'2px', margin:'0 0 20px' }}>
          <p style={{ ...S.eyebrow, marginBottom:'10px', fontSize:'0.6rem' }}>Tu Enlace Personal</p>
          <input readOnly value={uploadUrl} onClick={e => e.target.select()}
            style={{ ...S.input, fontSize:'0.75rem', textAlign:'center', cursor:'pointer', marginBottom:'10px' }} />
          <p style={{ ...S.body, fontSize:'0.82rem', opacity:0.72, lineHeight:1.6 }}>
            📧 Usa este enlace para subir una foto o video para Zandra. Guárdalo bien — será parte de la sorpresa.
          </p>
        </div>
        <Divider />
        <p style={{ ...S.body, fontStyle:'italic', opacity:0.45, fontSize:'0.82rem', marginBottom:'20px' }}>
          {EVENTO.fecha} &nbsp;·&nbsp; {EVENTO.hora}<br/>{EVENTO.lugar}
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
      // Subir a Cloudinary
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

      // Guardar en Supabase
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
    <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <div style={{ ...S.card, maxWidth:'460px', width:'95vw', textAlign:'center', padding:'48px 36px' }}>
        <div style={{ fontSize:'3rem', marginBottom:'14px' }}>💛</div>
        <p style={S.eyebrow}>✦ &nbsp; ¡Recibido con Amor! &nbsp; ✦</p>
        <Divider />
        <p style={{ ...S.body, opacity:0.72, marginBottom:'20px' }}>Tu mensaje fue enviado exitosamente. Será parte de la sorpresa especial el día de la celebración de Zandra.</p>
        <Btn onClick={() => navigate('landing')}>← Volver al Inicio</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ ...S.page, paddingTop:'40px' }}>
      <div style={{ maxWidth:'560px', margin:'0 auto', padding:'40px 18px 70px' }}>

        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <p style={S.eyebrow}>✦ &nbsp; Tu Mensaje Especial &nbsp; ✦</p>
          <Divider />
          <div style={{ ...S.title, fontSize:'clamp(1.2rem,4vw,1.7rem)', marginBottom:'8px' }}>Un Regalo para Zandra</div>
          <p style={{ ...S.body, opacity:0.58, fontSize:'0.9rem', maxWidth:'460px', margin:'0 auto' }}>
            Comparte un recuerdo especial. Se presentará como sorpresa el día de su celebración. 💛
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'22px' }}>
          {[
            { k:'foto-con-ella', i:'🤝', t:'Foto con Ella', d:'Una foto tuya junto a Zandra' },
            { k:'recuerdo', i:'🕰️', t:'Recuerdo', d:'Foto de infancia u otro momento especial' },
            { k:'video', i:'🎬', t:'Video Mensaje', d:'Felicitación en video (máx. 1 min)' },
          ].map(o => {
            const sel = tipoArchivo === o.k;
            return (
              <div key={o.k} onClick={() => { setTipoArchivo(o.k); setFile(null); setPreview(null); setVideoError(''); }}
                style={{ ...S.card, padding:'14px 10px', textAlign:'center', cursor:'pointer', borderColor: sel ? G.gold : 'rgba(122,95,42,0.32)', background: sel ? 'rgba(201,168,76,0.08)' : 'linear-gradient(135deg,#1a1508,#0f0b04)', transition:'all 0.25s' }}>
                <div style={{ fontSize:'1.6rem', marginBottom:'6px' }}>{o.i}</div>
                <p style={{ ...S.eyebrow, fontSize:'0.55rem', marginBottom:'4px', color: sel ? G.gold : G.goldDim }}>{o.t}</p>
                <p style={{ ...S.body, fontSize:'0.7rem', opacity:0.48, lineHeight:1.35 }}>{o.d}</p>
                {sel && <div style={{ width:'18px', height:'2px', background:G.gold, margin:'7px auto 0' }} />}
              </div>
            );
          })}
        </div>

        <div style={S.card}>
          <div style={{ marginBottom:'18px' }}>
            <label style={S.label}>Tu Nombre Completo</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="¿Cómo te llamas?" style={S.input} />
          </div>

          {tipoArchivo && (
            <div style={{ background:'rgba(201,168,76,0.05)', border:`1px solid rgba(201,168,76,0.18)`, padding:'12px 16px', borderRadius:'2px', marginBottom:'18px' }}>
              <p style={{ ...S.body, fontSize:'0.82rem', opacity:0.75, lineHeight:1.6 }}>
                {tipoArchivo === 'foto-con-ella' && '📸 Sube una foto donde aparezcas junto a Zandra — puede ser reciente o de cualquier época.'}
                {tipoArchivo === 'recuerdo' && '🕰️ Sube una foto que capture un recuerdo de Zandra — de su infancia, juventud o cualquier momento que quieras compartir.'}
                {tipoArchivo === 'video' && '🎬 Graba un video con tus felicitaciones de cumpleaños. Máximo 1 minuto (60 segundos). ¡Habla desde el corazón!'}
              </p>
            </div>
          )}

          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => tipoArchivo && document.getElementById('fileInput').click()}
            style={{ border:`2px dashed ${drag?G.gold:tipoArchivo?G.goldDim:'rgba(122,95,42,0.2)'}`, borderRadius:'2px', padding:'34px 20px', textAlign:'center', cursor:tipoArchivo?'pointer':'not-allowed', marginBottom:'8px', background:drag?'rgba(201,168,76,0.05)':'transparent', transition:'all 0.3s', opacity:tipoArchivo?1:0.4 }}
          >
            <input id="fileInput" type="file" accept={tipoArchivo==='video'?'video/*':'image/*'} style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
            <div style={{ fontSize:'2rem', marginBottom:'8px' }}>{file ? '✅' : tipoArchivo==='video' ? '🎬' : '🖼️'}</div>
            <p style={{ ...S.eyebrow, marginBottom:'5px', fontSize:'0.58rem' }}>
              {file ? file.name : tipoArchivo ? (tipoArchivo==='video'?'Video — MP4 · MOV':'Imagen — JPG · PNG') : 'Primero elige un tipo arriba'}
            </p>
            <p style={{ ...S.body, opacity:0.38, fontSize:'0.78rem' }}>
              {file ? 'Haz clic para cambiar el archivo' : 'Arrastra aquí o haz clic para seleccionar'}
            </p>
            {tipoArchivo === 'video' && !file && (
              <p style={{ ...S.body, fontSize:'0.74rem', color:G.gold, opacity:0.75, marginTop:'6px' }}>⏱ Máximo 60 segundos</p>
            )}
          </div>

          {videoError && (
            <div style={{ background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.3)', padding:'10px 14px', borderRadius:'2px', marginBottom:'12px' }}>
              <p style={{ color:'#e74c3c', fontSize:'0.82rem', fontStyle:'italic' }}>⚠️ {videoError}</p>
            </div>
          )}

          {preview && !videoError && (
            <div style={{ marginBottom:'18px', textAlign:'center', borderRadius:'2px', overflow:'hidden', border:`1px solid ${G.goldDim}` }}>
              {preview.tipo === 'imagen'
                ? <img src={preview.url} alt="preview" style={{ maxWidth:'100%', maxHeight:'220px', display:'block', margin:'0 auto' }} />
                : <video src={preview.url} controls style={{ maxWidth:'100%', maxHeight:'220px', display:'block', margin:'0 auto' }} />}
            </div>
          )}

          <div style={{ marginBottom:'22px', marginTop:'10px' }}>
            <label style={S.label}>Mensaje Escrito para Zandra <span style={{ opacity:0.38 }}>(Opcional)</span></label>
            <textarea value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Escribe unas palabras de cariño para Zandra en su día especial..." rows={3}
              style={{ ...S.input, resize:'vertical', lineHeight:1.6 }} />
          </div>

          {(!tipoArchivo || !file || !nombre.trim()) && (
            <p style={{ ...S.body, fontSize:'0.76rem', opacity:0.38, textAlign:'center', marginBottom:'12px' }}>
              {!tipoArchivo ? '① Elige el tipo de archivo arriba'
                : !nombre.trim() ? '② Ingresa tu nombre'
                : '③ Selecciona tu archivo'}
            </p>
          )}

          <Btn onClick={enviar} filled
            disabled={!file || !nombre.trim() || uploading || !!videoError || !tipoArchivo}
            style={{ width:'100%', display:'block', textAlign:'center' }}>
            {uploading ? 'Enviando con Amor...' : 'Enviar mi Regalo ✦'}
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
      <div style={{ ...S.card, maxWidth:'340px', width:'94vw', textAlign:'center', padding:'40px 28px' }}>
        <p style={S.eyebrow}>✦ &nbsp; Panel de Administración &nbsp; ✦</p>
        <Divider />
        <p style={{ ...S.body, opacity:0.45, marginBottom:'22px', fontSize:'0.88rem' }}>Acceso restringido</p>
        <label style={S.label}>Contraseña</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&intentar()} style={{ ...S.input, textAlign:'center', marginBottom:'8px', letterSpacing:'0.2em' }} placeholder="••••••••" />
        {err && <p style={{ color:'#e74c3c', fontSize:'0.78rem', marginBottom:'8px' }}>{err}</p>}
        <Btn onClick={intentar} filled style={{ width:'100%', display:'block', textAlign:'center', marginTop:'10px' }}>Ingresar</Btn>
        <Btn onClick={() => navigate('landing')} style={{ width:'100%', display:'block', textAlign:'center', marginTop:'10px', fontSize:'0.58rem' }}>← Volver</Btn>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <p style={{ ...S.body, opacity:0.5 }}>Cargando datos...</p>
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
    <div style={{ ...S.page, paddingTop:'20px' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'24px 16px 70px' }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <p style={{ ...S.eyebrow, marginBottom:'4px' }}>Panel de Administración</p>
            <div style={{ ...S.title, fontSize:'1.5rem' }}>60 Años — Zandra Veliz</div>
          </div>
          <Btn onClick={() => navigate('landing')} style={{ fontSize:'0.58rem', padding:'8px 16px' }}>← Salir</Btn>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))', gap:'12px', marginBottom:'28px' }}>
          {[
            { l:'Confirmados', v:confirmados, s:'invitados' },
            { l:'Total Personas', v:totalPersonas, s:`de ${EVENTO.cupo}` },
            { l:'Archivos Recibidos', v:conMedia, s:'fotos/videos' },
            { l:'Cupos Libres', v:EVENTO.cupo-totalPersonas, s:'disponibles' },
          ].map(stat => (
            <div key={stat.l} style={{ ...S.card, padding:'16px', textAlign:'center' }}>
              <p style={{ ...S.eyebrow, marginBottom:'4px', fontSize:'0.58rem' }}>{stat.l}</p>
              <div style={{ ...S.title, fontSize:'2.2rem', margin:'4px 0' }}>{stat.v}</div>
              <p style={{ ...S.body, fontSize:'0.72rem', opacity:0.45 }}>{stat.s}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:'28px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
            <p style={{ ...S.eyebrow, fontSize:'0.58rem' }}>Capacidad Utilizada</p>
            <p style={{ ...S.eyebrow, fontSize:'0.58rem' }}>{Math.round((totalPersonas/EVENTO.cupo)*100)}%</p>
          </div>
          <div style={{ height:'5px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', overflow:'hidden' }}>
            <div style={{ width:`${(totalPersonas/EVENTO.cupo)*100}%`, height:'100%', background:`linear-gradient(90deg,${G.gold},${G.goldLight})`, borderRadius:'3px', transition:'width 1s ease' }} />
          </div>
        </div>

        <div style={{ ...S.card, padding:0, overflow:'hidden', marginBottom:'20px' }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid rgba(201,168,76,0.15)`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={S.eyebrow}>Lista de Confirmaciones</p>
            <span style={{ ...S.eyebrow, fontSize:'0.55rem', opacity:0.55 }}>{confirmados} registros</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid rgba(201,168,76,0.12)` }}>
                  {['Nombre','Email','Teléfono','Acompañante','Fecha'].map(h => (
                    <th key={h} style={{ ...S.eyebrow, padding:'10px 16px', textAlign:'left', fontWeight:'normal', whiteSpace:'nowrap', fontSize:'0.58rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rsvps.map((r,i) => (
                  <tr key={i} style={{ borderBottom:`1px solid rgba(255,255,255,0.04)`, background: i%2===0?'rgba(255,255,255,0.012)':'transparent' }}>
                    <td style={{ ...S.body, padding:'10px 16px', fontSize:'0.88rem', whiteSpace:'nowrap' }}>{r.nombre}</td>
                    <td style={{ ...S.body, padding:'10px 16px', fontSize:'0.78rem', opacity:0.55 }}>{r.email}</td>
                    <td style={{ ...S.body, padding:'10px 16px', fontSize:'0.75rem', opacity:0.45 }}>{r.telefono || '—'}</td>
                    <td style={{ padding:'10px 16px', fontSize:'0.82rem', color: r.acompanante?G.gold:G.goldDim }}>{r.acompanante?`✦ ${r.nombre_acomp}`:'—'}</td>
                    <td style={{ ...S.body, padding:'10px 16px', fontSize:'0.75rem', opacity:0.45, whiteSpace:'nowrap' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ ...S.card, padding:0, overflow:'hidden', marginBottom:'20px' }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid rgba(201,168,76,0.15)` }}>
            <p style={S.eyebrow}>Archivos Recibidos ({uploads.length})</p>
          </div>
          <div style={{ padding:'20px', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'14px' }}>
            {uploads.map((u,i) => (
              <div key={i} style={{ border:`1px solid ${G.goldDim}`, borderRadius:'2px', padding:'12px', background:'rgba(255,255,255,0.02)' }}>
                <p style={{ ...S.eyebrow, fontSize:'0.6rem', marginBottom:'6px' }}>{u.nombre_persona}</p>
                <p style={{ ...S.body, fontSize:'0.75rem', opacity:0.5, marginBottom:'8px' }}>{u.tipo_archivo}</p>
                <a href={u.archivo_url} target="_blank" rel="noreferrer" style={{ ...S.btn, fontSize:'0.55rem', padding:'6px 12px', display:'inline-block' }}>
                  Ver Archivo ↗
                </a>
              </div>
            ))}
            {uploads.length === 0 && <p style={{ ...S.body, opacity:0.4, gridColumn:'1/-1', textAlign:'center' }}>No hay archivos todavía</p>}
          </div>
        </div>

        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
          <Btn onClick={exportCSV} filled>⬇ Exportar Lista CSV</Btn>
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
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=IM+Fell+English+SC&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.textContent = '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } body { background: #0a0805; } button:focus { outline: none; } input:focus, textarea:focus { border-color: #C9A84C !important; } input::placeholder, textarea::placeholder { color: rgba(245,237,214,0.28); }';
    document.head.appendChild(style);

    // Check for upload token in URL
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
    <div style={{ background:'#0a0805', minHeight:'100vh' }}>
      {page === 'landing'      && <Invitacion {...props} />}
      {page === 'detalles'     && <Detalles {...props} />}
      {page === 'rsvp'         && <RSVP {...props} />}
      {page === 'confirmacion' && <Confirmacion {...props} />}
      {page === 'subir'        && <SubirArchivo {...props} />}
      {page === 'admin'        && <Admin {...props} />}
    </div>
  );
}
