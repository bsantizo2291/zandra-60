import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

// ── CONFIGURACIÓN ─────────────────────────────────────────────
const SUPABASE_URL = 'https://ndwheqxeuykmsfbhsvvp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kd2hlcXhldXlrbXNmYmhzdnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODkxMzYsImV4cCI6MjA5MjQ2NTEzNn0.yJ3prriU3vpS9Aa8zoAzjXcdjjAL8HqvTXw0f9bzkjg';

const CLOUDINARY_CLOUD_NAME = 'duo4dukq4';
const CLOUDINARY_UPLOAD_PRESET = 'zandra60_unsigned';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Paleta Playbill Vintage ───────────────────────────────────
const V = {
  paper: '#f4e8d0',
  sepia: '#c9b896',
  ink: '#2b1810',
  burgundy: '#6b1f26',
  gold: '#d4a574',
  cream: '#fdf9f1',
  border: '#8b6f47',
  shadow: 'rgba(43,24,16,0.25)',
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

// ── Estilos Playbill ──────────────────────────────────────────
const S = {
  page: { minHeight:'100vh', background:`radial-gradient(ellipse at top,${V.sepia},#a89372)`, color:V.ink, fontFamily:"'Libre Baskerville','Georgia',serif", position:'relative' },
  marquee: { fontFamily:"'Abril Fatface','Georgia',serif", color:V.burgundy, letterSpacing:'0.08em', lineHeight:0.9, textTransform:'uppercase' },
  serif: { fontFamily:"'Libre Baskerville','Georgia',serif", fontStyle:'italic', color:V.ink },
  label: { fontFamily:"'Libre Franklin','Arial',sans-serif", fontSize:'0.65rem', letterSpacing:'0.25em', color:V.border, textTransform:'uppercase', fontWeight:700 },
  body: { fontSize:'1rem', lineHeight:1.65, color:V.ink, fontFamily:"'Libre Baskerville','Georgia',serif" },
  ticket: { background:V.paper, border:`3px solid ${V.ink}`, borderRadius:'4px', padding:'32px', boxShadow:`0 8px 24px ${V.shadow}, inset 0 0 0 1px rgba(255,255,255,0.5)`, position:'relative' },
  input: { width:'100%', background:V.cream, border:`2px solid ${V.border}`, color:V.ink, padding:'12px 14px', fontSize:'1rem', fontFamily:"'Libre Baskerville','Georgia',serif", outline:'none', boxSizing:'border-box', borderRadius:'2px' },
  btn: { display:'inline-block', border:`3px solid ${V.burgundy}`, padding:'14px 32px', fontFamily:"'Libre Franklin','Arial',sans-serif", fontSize:'0.7rem', letterSpacing:'0.25em', color:V.burgundy, textTransform:'uppercase', background:'transparent', cursor:'pointer', transition:'all 0.25s', textDecoration:'none', fontWeight:700 },
  btnFill: { background:V.burgundy, color:V.cream, boxShadow:`0 4px 12px rgba(107,31,38,0.3)` },
};

// ── Borde Perforado ───────────────────────────────────────────
function PerforatedEdge({ side }) {
  const holes = Array.from({ length: 20 }, (_, i) => i);
  const isVertical = side === 'left' || side === 'right';
  
  const style = {
    position: 'absolute',
    [side]: '-6px',
    [isVertical ? 'top' : 'left']: 0,
    [isVertical ? 'height' : 'width']: '100%',
    [isVertical ? 'width' : 'height']: '12px',
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  };

  return (
    <div style={style}>
      {holes.map(i => (
        <div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:V.sepia, border:`1px solid ${V.border}` }} />
      ))}
    </div>
  );
}

// ── Líneas Decorativas ────────────────────────────────────────
function DecoLine() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px', margin:'16px 0' }}>
      <div style={{ flex:1, height:'2px', background:`linear-gradient(90deg,transparent,${V.burgundy},transparent)` }} />
      <div style={{ width:'8px', height:'8px', background:V.burgundy, transform:'rotate(45deg)' }} />
      <div style={{ flex:1, height:'2px', background:`linear-gradient(90deg,transparent,${V.burgundy},transparent)` }} />
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────
function Nav({ navigate, current }) {
  const links = [{ k:'landing', l:'PLAYBILL' }, { k:'detalles', l:'PROGRAMA' }, { k:'rsvp', l:'RESERVAR' }];
  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:V.burgundy, borderBottom:`4px double ${V.gold}`, display:'flex', alignItems:'center', boxShadow:`0 4px 12px ${V.shadow}` }}>
      {links.map(l => (
        <button key={l.k} onClick={() => navigate(l.k)} style={{ background:'none', border:'none', cursor:'pointer', padding:'16px 24px', fontFamily:"'Libre Franklin','Arial',sans-serif", fontSize:'0.65rem', letterSpacing:'0.22em', fontWeight:700, textTransform:'uppercase', color: current===l.k ? V.gold : V.cream, borderBottom: current===l.k ? `3px solid ${V.gold}` : '3px solid transparent', transition:'all 0.25s' }}>
          {l.l}
        </button>
      ))}
      <button onClick={() => navigate('admin')} style={{ background:'none', border:'none', cursor:'pointer', padding:'16px 18px', fontFamily:"'Libre Franklin','Arial',sans-serif", fontSize:'0.55rem', letterSpacing:'0.2em', color:'rgba(255,255,255,0.3)', marginLeft:'auto', fontWeight:700 }}>
        ADMIN
      </button>
    </nav>
  );
}

function Btn({ onClick, filled, children, style={}, disabled=false }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...S.btn, ...(filled ? S.btnFill : {}), ...style, opacity: disabled ? 0.5 : 1, transform: hover && !disabled ? 'translateY(-2px)' : 'none', boxShadow: hover && !disabled ? `0 6px 16px ${V.shadow}` : (filled ? S.btnFill.boxShadow : 'none') }}>
      {children}
    </button>
  );
}

// ── Campo de formulario (movido fuera del componente) ─────────
const Campo = ({ k, value, onChange, label, tipo='text', placeholder='', error }) => (
  <div style={{ marginBottom:'18px' }}>
    <label style={S.label}>{label}</label>
    <input type={tipo} value={value} placeholder={placeholder} onChange={onChange}
      style={{ ...S.input, borderColor: error ? V.burgundy : V.border, borderWidth: error ? '3px' : '2px' }} />
    {error && <p style={{ color:V.burgundy, fontSize:'0.78rem', marginTop:'4px', fontStyle:'italic', fontWeight:600 }}>{error}</p>}
  </div>
);

// ── PÁGINA 1: PLAYBILL ────────────────────────────────────────
function Invitacion({ navigate }) {
  return (
    <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'40px 20px' }}>
      {/* Patrón de fondo */}
      <div style={{ position:'absolute', inset:0, opacity:0.05, backgroundImage:`repeating-linear-gradient(45deg, ${V.ink} 0px, ${V.ink} 2px, transparent 2px, transparent 12px)`, pointerEvents:'none' }} />
      
      <div style={{ ...S.ticket, width:'min(680px,95vw)', margin:'0 auto', position:'relative', overflow:'visible' }}>
        <PerforatedEdge side="left" />
        <PerforatedEdge side="right" />
        
        {/* Sello de admisión */}
        <div style={{ position:'absolute', top:'24px', right:'24px', width:'80px', height:'80px', borderRadius:'50%', border:`4px double ${V.burgundy}`, display:'flex', alignItems:'center', justifyContent:'center', background:V.cream, transform:'rotate(12deg)' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ ...S.label, fontSize:'0.5rem', marginBottom:'2px' }}>ADMIT</div>
            <div style={{ ...S.marquee, fontSize:'1.8rem', lineHeight:1 }}>ONE</div>
            <div style={{ ...S.label, fontSize:'0.45rem', marginTop:'2px' }}>+1 GUEST</div>
          </div>
        </div>

        {/* Encabezado */}
        <div style={{ textAlign:'center', marginBottom:'12px' }}>
          <div style={{ ...S.label, marginBottom:'8px', opacity:0.7 }}>★ UNA NOCHE EN EL TEATRO ★</div>
          <div style={{ ...S.marquee, fontSize:'clamp(2.2rem,6vw,3.6rem)', marginBottom:'6px' }}>GRAN GALA</div>
          <div style={{ ...S.label, fontSize:'0.75rem' }}>CELEBRANDO A</div>
        </div>

        <DecoLine />

        {/* Nombre principal */}
        <div style={{ textAlign:'center', margin:'24px 0' }}>
          <div style={{ ...S.marquee, fontSize:'clamp(2rem,7vw,4.2rem)', color:V.burgundy, textShadow:`3px 3px 0 rgba(212,165,116,0.3)`, marginBottom:'8px' }}>
            ZANDRA
          </div>
          <div style={{ ...S.serif, fontSize:'clamp(1.3rem,4vw,2rem)', marginBottom:'4px' }}>
            B. Veliz Ortiz
          </div>
        </div>

        {/* Milestone */}
        <div style={{ textAlign:'center', background:V.burgundy, margin:'24px -32px', padding:'20px', position:'relative' }}>
          <div style={{ position:'absolute', inset:0, background:`repeating-linear-gradient(90deg, ${V.gold} 0px, ${V.gold} 1px, transparent 1px, transparent 20px)`, opacity:0.1 }} />
          <div style={{ ...S.marquee, fontSize:'clamp(4rem,12vw,6.5rem)', color:V.gold, lineHeight:1, marginBottom:'4px', textShadow:`4px 4px 0 rgba(0,0,0,0.2)` }}>60</div>
          <div style={{ ...S.label, color:V.cream, fontSize:'0.85rem' }}>AÑOS DE BRILLANTEZ</div>
        </div>

        {/* Tema */}
        <div style={{ textAlign:'center', margin:'24px 0' }}>
          <div style={{ ...S.marquee, fontSize:'clamp(1.2rem,3.5vw,1.8rem)', marginBottom:'12px' }}>
            Una Velada Gatsby
          </div>
          <div style={{ ...S.serif, fontSize:'0.95rem', opacity:0.75, maxWidth:'420px', margin:'0 auto 20px' }}>
            Vístete con el esplendor de los años 20. Lentejuelas, plumas y elegancia. Te esperamos para una noche inolvidable.
          </div>
        </div>

        <DecoLine />

        {/* Detalles */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'16px', margin:'24px 0' }}>
          {[
            { i:'📅', l:'FECHA', v:'Sábado\n5 de Septiembre, 2026' },
            { i:'🕖', l:'HORARIO', v:'19:00 – 00:00 hrs' },
            { i:'📍', l:'ESCENARIO', v:'El Club Español\nÁrea Fuentecilla' },
          ].map(d => (
            <div key={d.l} style={{ textAlign:'center', padding:'16px', border:`2px solid ${V.border}`, borderRadius:'3px', background:V.cream }}>
              <div style={{ fontSize:'2rem', marginBottom:'8px' }}>{d.i}</div>
              <div style={{ ...S.label, marginBottom:'6px', fontSize:'0.55rem' }}>{d.l}</div>
              <div style={{ ...S.body, fontSize:'0.87rem', whiteSpace:'pre-line', fontWeight:600 }}>{d.v}</div>
            </div>
          ))}
        </div>

        {/* Dirección */}
        <div style={{ textAlign:'center', background:`linear-gradient(135deg, ${V.cream}, ${V.paper})`, padding:'16px', borderRadius:'3px', border:`2px dashed ${V.border}`, marginBottom:'24px' }}>
          <div style={{ ...S.label, marginBottom:'6px' }}>DIRECCIÓN DEL VENUE</div>
          <div style={{ ...S.body, fontSize:'0.9rem', marginBottom:'8px' }}>{EVENTO.direccion}</div>
          <a href={EVENTO.mapsUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, fontSize:'0.6rem', padding:'8px 18px', textDecoration:'none' }}>
            🗺 VER MAPA
          </a>
        </div>

        {/* Código de vestimenta */}
        <div style={{ background:V.burgundy, margin:'24px -32px -32px', padding:'28px 32px', borderRadius:'0 0 4px 4px', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'4px', background:`repeating-linear-gradient(90deg, ${V.gold} 0px, ${V.gold} 8px, transparent 8px, transparent 16px)` }} />
          <div style={{ textAlign:'center' }}>
            <div style={{ ...S.label, color:V.gold, marginBottom:'10px' }}>CÓDIGO DE VESTIMENTA</div>
            <div style={{ ...S.marquee, color:V.cream, fontSize:'clamp(1.1rem,3vw,1.5rem)', marginBottom:'14px' }}>
              ETIQUETA RIGUROSA
            </div>
            <div style={{ ...S.serif, color:V.cream, fontSize:'0.92rem', opacity:0.9, marginBottom:'24px' }}>
              Negro · Dorado · Champagne · Glamour Gatsby
            </div>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              <Btn onClick={() => navigate('detalles')}>VER PROGRAMA</Btn>
              <Btn onClick={() => navigate('rsvp')} filled>RESERVAR ASIENTO ★</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PÁGINA 2: PROGRAMA (DETALLES) ─────────────────────────────
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
    <div style={{ ...S.page, paddingTop:'80px' }}>
      <Nav navigate={navigate} current="detalles" />
      <div style={{ maxWidth:'820px', margin:'0 auto', padding:'40px 20px 80px' }}>

        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ ...S.label, marginBottom:'8px' }}>★ PROGRAMA DEL EVENTO ★</div>
          <div style={{ ...S.marquee, fontSize:'clamp(1.8rem,5vw,3rem)', marginBottom:'8px' }}>UNA VELADA GATSBY</div>
          <div style={{ ...S.serif, fontSize:'clamp(1.2rem,3vw,1.8rem)' }}>Celebrando a Zandra B. Veliz Ortiz</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'16px', marginBottom:'40px' }}>
          {[
            { i:'📅', l:'FECHA', v:'Sábado, 5 de Septiembre, 2026' },
            { i:'🕖', l:'HORARIO', v:'19:00 – 00:00 hrs' },
            { i:'📍', l:'ESCENARIO', v:'El Club Español\nÁrea Fuentecilla' },
            { i:'🗺️', l:'DIRECCIÓN', v:'Calzada Roosevelt Km. 13.5\nZona 7 de Mixco, Guatemala' },
          ].map(d => (
            <div key={d.l} style={{ ...S.ticket, padding:'20px', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', marginBottom:'10px' }}>{d.i}</div>
              <div style={{ ...S.label, marginBottom:'8px' }}>{d.l}</div>
              <div style={{ ...S.body, fontSize:'0.88rem', whiteSpace:'pre-line', fontWeight:600 }}>{d.v}</div>
            </div>
          ))}
        </div>

        <div style={{ ...S.ticket, textAlign:'center', marginBottom:'40px' }}>
          <div style={{ ...S.label, marginBottom:'12px' }}>UBICACIÓN DEL EVENTO</div>
          <a href={EVENTO.mapsUrl} target="_blank" rel="noreferrer" style={{ ...S.btn, ...S.btnFill }}>
            🗺 ABRIR EN GOOGLE MAPS
          </a>
        </div>

        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <div style={{ ...S.label, marginBottom:'12px' }}>★ CÓDIGO DE VESTIMENTA ★</div>
          <DecoLine />
          <div style={{ ...S.marquee, fontSize:'clamp(1.2rem,3.5vw,1.8rem)', marginBottom:'16px' }}>
            Etiqueta Rigurosa & Glamour Gatsby
          </div>
          <div style={{ ...S.body, opacity:0.8, maxWidth:'560px', margin:'0 auto 20px', fontSize:'0.96rem', lineHeight:1.75 }}>
            Celebremos con el esplendor de los años 20. Viste de negro, dorado o champagne. Lentejuelas, plumas, guantes y alhajas son bienvenidos. ¡Sorpréndenos!
          </div>
          <div style={{ display:'inline-flex', gap:'12px', padding:'12px 32px', border:`3px double ${V.burgundy}`, borderRadius:'4px', background:V.cream }}>
            <span style={{ ...S.label, fontSize:'0.75rem' }}>NEGRO</span>
            <span style={{ ...S.label, fontSize:'0.75rem' }}>·</span>
            <span style={{ ...S.label, fontSize:'0.75rem' }}>DORADO</span>
            <span style={{ ...S.label, fontSize:'0.75rem' }}>·</span>
            <span style={{ ...S.label, fontSize:'0.75rem' }}>CHAMPAGNE</span>
          </div>
        </div>

        <div style={{ marginBottom:'44px' }}>
          <div style={{ ...S.label, textAlign:'center', marginBottom:'12px' }}>INSPIRACIÓN DE VESTUARIO</div>
          <DecoLine />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'18px', marginTop:'24px' }}>
            {VESTUARIO.map((v, i) => (
              <div key={i} style={{ ...S.ticket, padding:'20px' }}>
                <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
                  {v.colores.map((c,j) => <div key={j} style={{ width:'26px', height:'26px', background:c, borderRadius:'50%', border:`2px solid ${V.border}` }} />)}
                </div>
                <div style={{ ...S.label, marginBottom:'8px', fontSize:'0.65rem' }}>{v.titulo}</div>
                <div style={{ ...S.body, fontSize:'0.88rem', lineHeight:1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign:'center' }}>
          <DecoLine />
          <div style={{ ...S.body, fontStyle:'italic', opacity:0.6, marginBottom:'20px', fontSize:'0.92rem' }}>
            Los cupos son limitados. Confirma tu asistencia pronto.
          </div>
          <Btn onClick={() => navigate('rsvp')} filled>RESERVAR ASIENTO ★</Btn>
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
    <div style={{ ...S.page, paddingTop:'80px' }}>
      <Nav navigate={navigate} current="rsvp" />
      <div style={{ maxWidth:'580px', margin:'0 auto', padding:'40px 20px 80px' }}>

        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ ...S.label, marginBottom:'8px' }}>★ RESERVACIÓN DE ASIENTOS ★</div>
          <DecoLine />
          <div style={{ ...S.marquee, fontSize:'clamp(1.6rem,5vw,2.4rem)', marginBottom:'12px' }}>¿Nos Acompañas?</div>
          <div style={{ ...S.body, opacity:0.7, fontSize:'0.92rem', marginBottom:'12px' }}>
            {stats.libres} asientos disponibles de {EVENTO.cupo}
          </div>
          <div style={{ width:'280px', height:'8px', background:V.cream, margin:'0 auto', borderRadius:'4px', overflow:'hidden', border:`2px solid ${V.border}` }}>
            <div style={{ width:`${((EVENTO.cupo-stats.libres)/EVENTO.cupo)*100}%`, height:'100%', background:V.burgundy, borderRadius:'2px', transition:'width 1s ease' }} />
          </div>
        </div>

        <div style={{ ...S.ticket, position:'relative' }}>
          <PerforatedEdge side="left" />
          <PerforatedEdge side="right" />

          {errors.general && (
            <div style={{ background:'rgba(107,31,38,0.1)', border:`2px solid ${V.burgundy}`, padding:'14px', borderRadius:'3px', marginBottom:'20px' }}>
              <div style={{ color:V.burgundy, fontSize:'0.88rem', fontWeight:600 }}>⚠️ {errors.general}</div>
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

          <div style={{ marginBottom:'20px' }}>
            <div onClick={() => set('acompanante', !form.acompanante)} style={{ display:'flex', alignItems:'center', gap:'14px', cursor:'pointer', padding:'14px', border:`2px solid ${form.acompanante ? V.burgundy : V.border}`, borderRadius:'3px', background: form.acompanante ? 'rgba(107,31,38,0.05)' : V.cream, transition:'all 0.25s' }}>
              <div style={{ width:'48px', height:'26px', borderRadius:'13px', background: form.acompanante ? V.burgundy : V.border, position:'relative', transition:'background 0.3s', flexShrink:0 }}>
                <div style={{ position:'absolute', top:'3px', left: form.acompanante ? '24px' : '3px', width:'20px', height:'20px', borderRadius:'50%', background: V.cream, transition:'left 0.3s', boxShadow:`0 2px 4px ${V.shadow}` }} />
              </div>
              <span style={{ ...S.body, fontSize:'0.96rem', fontWeight:600 }}>
                Llevaré un acompañante <span style={{ opacity:0.55, fontWeight:400 }}>(máx. 1)</span>
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

          <div style={{ background:`linear-gradient(135deg, ${V.cream}, ${V.paper})`, border:`2px dashed ${V.burgundy}`, padding:'18px', borderRadius:'4px', marginBottom:'26px' }}>
            <div style={{ ...S.body, fontSize:'0.88rem', lineHeight:1.7, textAlign:'center' }}>
              💛 &nbsp; Tras confirmar, recibirás un <strong style={{color:V.burgundy}}>enlace especial</strong> para subir una foto o mensaje de video para Zandra.
            </div>
          </div>

          <Btn onClick={enviar} filled disabled={submitting} style={{ width:'100%', textAlign:'center', display:'block', fontSize:'0.75rem' }}>
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
    <div style={{ ...S.page, paddingTop:'80px', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <Nav navigate={navigate} current="" />
      <div style={{ ...S.ticket, maxWidth:'600px', width:'95vw', textAlign:'center', padding:'44px 40px', margin:'40px auto', position:'relative' }}>
        <PerforatedEdge side="left" />
        <PerforatedEdge side="right" />
        
        <div style={{ fontSize:'3.5rem', marginBottom:'16px' }}>🎟️</div>
        <div style={{ ...S.label, marginBottom:'8px' }}>★ ¡ASIENTO RESERVADO! ★</div>
        <DecoLine />
        <div style={{ ...S.marquee, fontSize:'clamp(1.4rem,4vw,2rem)', marginBottom:'12px' }}>¡Nos Alegra Contar Contigo!</div>
        <div style={{ ...S.serif, fontSize:'clamp(1.2rem,3.5vw,1.7rem)', marginBottom:'20px', color:V.burgundy }}>
          {rsvpData?.nombre || 'Estimado Invitado'}
        </div>
        <div style={{ ...S.body, opacity:0.75, marginBottom:'20px', fontSize:'0.95rem', lineHeight:1.75 }}>
          Tu asistencia ha sido registrada{rsvpData?.acompanante && rsvpData.nombreAcomp ? ` junto con ${rsvpData.nombreAcomp}` : ''} para la celebración de los 60 años de Zandra.
        </div>
        
        <div style={{ background:V.cream, border:`3px double ${V.burgundy}`, padding:'22px', borderRadius:'4px', margin:'0 0 24px' }}>
          <div style={{ ...S.label, marginBottom:'12px' }}>TU ENLACE PERSONAL</div>
          <input readOnly value={uploadUrl} onClick={e => e.target.select()}
            style={{ ...S.input, fontSize:'0.76rem', textAlign:'center', cursor:'pointer', marginBottom:'12px', fontFamily:"'Courier New',monospace", background:V.paper }} />
          <div style={{ ...S.body, fontSize:'0.86rem', lineHeight:1.7 }}>
            📧 Usa este enlace para subir una foto o video para Zandra. Guárdalo bien — será parte de la sorpresa.
          </div>
        </div>
        
        <DecoLine />
        <div style={{ ...S.body, fontStyle:'italic', opacity:0.5, fontSize:'0.85rem', marginBottom:'24px' }}>
          {EVENTO.fecha} &nbsp;·&nbsp; {EVENTO.hora}<br/>{EVENTO.lugar}
        </div>
        <Btn onClick={() => navigate('landing')}>← VOLVER AL PLAYBILL</Btn>
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
      <div style={{ ...S.ticket, maxWidth:'520px', width:'95vw', textAlign:'center', padding:'48px 40px', position:'relative' }}>
        <PerforatedEdge side="left" />
        <PerforatedEdge side="right" />
        <div style={{ fontSize:'3.5rem', marginBottom:'16px' }}>💛</div>
        <div style={{ ...S.label, marginBottom:'8px' }}>★ ¡RECIBIDO CON AMOR! ★</div>
        <DecoLine />
        <div style={{ ...S.body, opacity:0.8, marginBottom:'24px', fontSize:'0.96rem', lineHeight:1.75 }}>
          Tu mensaje fue enviado exitosamente. Será parte de la sorpresa especial el día de la celebración de Zandra.
        </div>
        <Btn onClick={() => navigate('landing')}>← VOLVER AL PLAYBILL</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ ...S.page, paddingTop:'40px' }}>
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'40px 20px 80px' }}>

        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ ...S.label, marginBottom:'8px' }}>★ TU MENSAJE ESPECIAL ★</div>
          <DecoLine />
          <div style={{ ...S.marquee, fontSize:'clamp(1.4rem,4vw,2rem)', marginBottom:'10px' }}>Un Regalo para Zandra</div>
          <div style={{ ...S.body, opacity:0.7, fontSize:'0.93rem', maxWidth:'480px', margin:'0 auto' }}>
            Comparte un recuerdo especial. Se presentará como sorpresa el día de su celebración. 💛
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'26px' }}>
          {[
            { k:'foto-con-ella', i:'🤝', t:'Foto con Ella', d:'Una foto tuya junto a Zandra' },
            { k:'recuerdo', i:'🕰️', t:'Recuerdo', d:'Foto de infancia u otro momento especial' },
            { k:'video', i:'🎬', t:'Video Mensaje', d:'Felicitación en video (máx. 1 min)' },
          ].map(o => {
            const sel = tipoArchivo === o.k;
            return (
              <div key={o.k} onClick={() => { setTipoArchivo(o.k); setFile(null); setPreview(null); setVideoError(''); }}
                style={{ ...S.ticket, padding:'16px 12px', textAlign:'center', cursor:'pointer', borderColor: sel ? V.burgundy : V.border, borderWidth: sel ? '3px' : '2px', background: sel ? 'rgba(107,31,38,0.05)' : V.paper, transition:'all 0.25s' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:'8px' }}>{o.i}</div>
                <div style={{ ...S.label, fontSize:'0.58rem', marginBottom:'5px', color: sel ? V.burgundy : V.border }}>{o.t}</div>
                <div style={{ ...S.body, fontSize:'0.72rem', opacity:0.65, lineHeight:1.4 }}>{o.d}</div>
                {sel && <div style={{ width:'24px', height:'3px', background:V.burgundy, margin:'10px auto 0' }} />}
              </div>
            );
          })}
        </div>

        <div style={{ ...S.ticket, position:'relative' }}>
          <PerforatedEdge side="left" />
          <PerforatedEdge side="right" />

          <div style={{ marginBottom:'20px' }}>
            <label style={S.label}>TU NOMBRE COMPLETO</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="¿Cómo te llamas?" style={S.input} />
          </div>

          {tipoArchivo && (
            <div style={{ background:V.cream, border:`2px dashed ${V.burgundy}`, padding:'14px 18px', borderRadius:'4px', marginBottom:'20px' }}>
              <div style={{ ...S.body, fontSize:'0.86rem', lineHeight:1.65 }}>
                {tipoArchivo === 'foto-con-ella' && '📸 Sube una foto donde aparezcas junto a Zandra — puede ser reciente o de cualquier época.'}
                {tipoArchivo === 'recuerdo' && '🕰️ Sube una foto que capture un recuerdo de Zandra — de su infancia, juventud o cualquier momento que quieras compartir.'}
                {tipoArchivo === 'video' && '🎬 Graba un video con tus felicitaciones de cumpleaños. Máximo 1 minuto (60 segundos). ¡Habla desde el corazón!'}
              </div>
            </div>
          )}

          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => tipoArchivo && document.getElementById('fileInput').click()}
            style={{ border:`3px dashed ${drag?V.burgundy:tipoArchivo?V.border:'rgba(139,111,71,0.3)'}`, borderRadius:'4px', padding:'38px 24px', textAlign:'center', cursor:tipoArchivo?'pointer':'not-allowed', marginBottom:'12px', background:drag?'rgba(107,31,38,0.05)':V.cream, transition:'all 0.3s', opacity:tipoArchivo?1:0.5 }}
          >
            <input id="fileInput" type="file" accept={tipoArchivo==='video'?'video/*':'image/*'} style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
            <div style={{ fontSize:'2.4rem', marginBottom:'10px' }}>{file ? '✅' : tipoArchivo==='video' ? '🎬' : '🖼️'}</div>
            <div style={{ ...S.label, marginBottom:'6px', fontSize:'0.62rem' }}>
              {file ? file.name : tipoArchivo ? (tipoArchivo==='video'?'VIDEO — MP4 · MOV':'IMAGEN — JPG · PNG') : 'PRIMERO ELIGE UN TIPO ARRIBA'}
            </div>
            <div style={{ ...S.body, opacity:0.5, fontSize:'0.82rem' }}>
              {file ? 'Haz clic para cambiar el archivo' : 'Arrastra aquí o haz clic para seleccionar'}
            </div>
            {tipoArchivo === 'video' && !file && (
              <div style={{ ...S.label, fontSize:'0.7rem', color:V.burgundy, marginTop:'8px' }}>⏱ MÁXIMO 60 SEGUNDOS</div>
            )}
          </div>

          {videoError && (
            <div style={{ background:'rgba(107,31,38,0.1)', border:`2px solid ${V.burgundy}`, padding:'12px 16px', borderRadius:'4px', marginBottom:'16px' }}>
              <div style={{ color:V.burgundy, fontSize:'0.86rem', fontStyle:'italic', fontWeight:600 }}>⚠️ {videoError}</div>
            </div>
          )}

          {preview && !videoError && (
            <div style={{ marginBottom:'20px', textAlign:'center', borderRadius:'4px', overflow:'hidden', border:`3px solid ${V.border}` }}>
              {preview.tipo === 'imagen'
                ? <img src={preview.url} alt="preview" style={{ maxWidth:'100%', maxHeight:'240px', display:'block', margin:'0 auto' }} />
                : <video src={preview.url} controls style={{ maxWidth:'100%', maxHeight:'240px', display:'block', margin:'0 auto' }} />}
            </div>
          )}

          <div style={{ marginBottom:'26px', marginTop:'12px' }}>
            <label style={S.label}>MENSAJE ESCRITO PARA ZANDRA <span style={{ opacity:0.45 }}>(OPCIONAL)</span></label>
            <textarea value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Escribe unas palabras de cariño para Zandra en su día especial..." rows={3}
              style={{ ...S.input, resize:'vertical', lineHeight:1.65, fontFamily:"'Libre Baskerville','Georgia',serif" }} />
          </div>

          {(!tipoArchivo || !file || !nombre.trim()) && (
            <div style={{ ...S.body, fontSize:'0.8rem', opacity:0.45, textAlign:'center', marginBottom:'16px', fontWeight:600 }}>
              {!tipoArchivo ? '① Elige el tipo de archivo arriba'
                : !nombre.trim() ? '② Ingresa tu nombre'
                : '③ Selecciona tu archivo'}
            </div>
          )}

          <Btn onClick={enviar} filled
            disabled={!file || !nombre.trim() || uploading || !!videoError || !tipoArchivo}
            style={{ width:'100%', display:'block', textAlign:'center', fontSize:'0.75rem' }}>
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
      <div style={{ ...S.ticket, maxWidth:'380px', width:'94vw', textAlign:'center', padding:'42px 32px', position:'relative' }}>
        <PerforatedEdge side="left" />
        <PerforatedEdge side="right" />
        <div style={{ ...S.label, marginBottom:'8px' }}>★ PANEL DE ADMINISTRACIÓN ★</div>
        <DecoLine />
        <div style={{ ...S.body, opacity:0.5, marginBottom:'24px', fontSize:'0.9rem' }}>Acceso restringido</div>
        <label style={S.label}>CONTRASEÑA</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&intentar()} style={{ ...S.input, textAlign:'center', marginBottom:'10px', letterSpacing:'0.25em', fontFamily:"'Courier New',monospace" }} placeholder="••••••••" />
        {err && <div style={{ color:V.burgundy, fontSize:'0.82rem', marginBottom:'10px', fontWeight:600 }}>{err}</div>}
        <Btn onClick={intentar} filled style={{ width:'100%', display:'block', textAlign:'center', marginTop:'12px' }}>INGRESAR</Btn>
        <Btn onClick={() => navigate('landing')} style={{ width:'100%', display:'block', textAlign:'center', marginTop:'12px', fontSize:'0.62rem' }}>← VOLVER</Btn>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <div style={{ ...S.body, opacity:0.6 }}>Cargando datos...</div>
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
    <div style={{ ...S.page, paddingTop:'24px' }}>
      <div style={{ maxWidth:'960px', margin:'0 auto', padding:'28px 20px 80px' }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px', flexWrap:'wrap', gap:'14px' }}>
          <div>
            <div style={{ ...S.label, marginBottom:'4px' }}>PANEL DE ADMINISTRACIÓN</div>
            <div style={{ ...S.marquee, fontSize:'1.8rem' }}>60 AÑOS — ZANDRA VELIZ</div>
          </div>
          <Btn onClick={() => navigate('landing')} style={{ fontSize:'0.62rem', padding:'10px 20px' }}>← SALIR</Btn>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'14px', marginBottom:'32px' }}>
          {[
            { l:'Confirmados', v:confirmados, s:'invitados' },
            { l:'Total Personas', v:totalPersonas, s:`de ${EVENTO.cupo}` },
            { l:'Archivos Recibidos', v:conMedia, s:'fotos/videos' },
            { l:'Cupos Libres', v:EVENTO.cupo-totalPersonas, s:'disponibles' },
          ].map(stat => (
            <div key={stat.l} style={{ ...S.ticket, padding:'18px', textAlign:'center' }}>
              <div style={{ ...S.label, marginBottom:'6px', fontSize:'0.6rem' }}>{stat.l}</div>
              <div style={{ ...S.marquee, fontSize:'2.6rem', margin:'6px 0', color:V.burgundy }}>{stat.v}</div>
              <div style={{ ...S.body, fontSize:'0.76rem', opacity:0.55 }}>{stat.s}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:'32px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
            <div style={{ ...S.label, fontSize:'0.6rem' }}>CAPACIDAD UTILIZADA</div>
            <div style={{ ...S.label, fontSize:'0.6rem' }}>{Math.round((totalPersonas/EVENTO.cupo)*100)}%</div>
          </div>
          <div style={{ height:'8px', background:V.cream, borderRadius:'4px', overflow:'hidden', border:`2px solid ${V.border}` }}>
            <div style={{ width:`${(totalPersonas/EVENTO.cupo)*100}%`, height:'100%', background:V.burgundy, borderRadius:'2px', transition:'width 1s ease' }} />
          </div>
        </div>

        <div style={{ ...S.ticket, padding:0, overflow:'hidden', marginBottom:'24px' }}>
          <div style={{ padding:'16px 24px', borderBottom:`2px solid ${V.border}`, background:V.cream, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={S.label}>LISTA DE CONFIRMACIONES</div>
            <span style={{ ...S.label, fontSize:'0.58rem', opacity:0.6 }}>{confirmados} registros</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`2px solid ${V.border}`, background:V.paper }}>
                  {['Nombre','Email','Teléfono','Acompañante','Fecha'].map(h => (
                    <th key={h} style={{ ...S.label, padding:'12px 18px', textAlign:'left', fontWeight:700, whiteSpace:'nowrap', fontSize:'0.6rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rsvps.map((r,i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${V.sepia}`, background: i%2===0?V.cream:V.paper }}>
                    <td style={{ ...S.body, padding:'12px 18px', fontSize:'0.9rem', whiteSpace:'nowrap', fontWeight:600 }}>{r.nombre}</td>
                    <td style={{ ...S.body, padding:'12px 18px', fontSize:'0.8rem', opacity:0.65 }}>{r.email}</td>
                    <td style={{ ...S.body, padding:'12px 18px', fontSize:'0.78rem', opacity:0.55 }}>{r.telefono || '—'}</td>
                    <td style={{ padding:'12px 18px', fontSize:'0.85rem', color: r.acompanante?V.burgundy:V.border, fontWeight:600 }}>{r.acompanante?`★ ${r.nombre_acomp}`:'—'}</td>
                    <td style={{ ...S.body, padding:'12px 18px', fontSize:'0.78rem', opacity:0.5, whiteSpace:'nowrap' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ ...S.ticket, padding:0, overflow:'hidden', marginBottom:'24px' }}>
          <div style={{ padding:'16px 24px', borderBottom:`2px solid ${V.border}`, background:V.cream }}>
            <div style={S.label}>ARCHIVOS RECIBIDOS ({uploads.length})</div>
          </div>
          <div style={{ padding:'24px', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'16px' }}>
            {uploads.map((u,i) => (
              <div key={i} style={{ border:`2px solid ${V.border}`, borderRadius:'4px', padding:'14px', background:V.cream }}>
                <div style={{ ...S.label, fontSize:'0.62rem', marginBottom:'7px' }}>{u.nombre_persona}</div>
                <div style={{ ...S.body, fontSize:'0.78rem', opacity:0.6, marginBottom:'10px' }}>{u.tipo_archivo}</div>
                <a href={u.archivo_url} target="_blank" rel="noreferrer" style={{ ...S.btn, fontSize:'0.58rem', padding:'8px 16px', display:'inline-block', textDecoration:'none' }}>
                  VER ARCHIVO ↗
                </a>
              </div>
            ))}
            {uploads.length === 0 && <div style={{ ...S.body, opacity:0.4, gridColumn:'1/-1', textAlign:'center', padding:'20px' }}>No hay archivos todavía</div>}
          </div>
        </div>

        <div style={{ display:'flex', gap:'14px', flexWrap:'wrap' }}>
          <Btn onClick={exportCSV} filled>⬇ EXPORTAR LISTA CSV</Btn>
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
    link.href = 'https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.textContent = '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } body { background: #f4e8d0; } button:focus { outline: none; } input:focus, textarea:focus { border-color: #6b1f26 !important; } input::placeholder, textarea::placeholder { color: rgba(43,24,16,0.3); }';
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
    <div style={{ background:'#c9b896', minHeight:'100vh' }}>
      {page === 'landing'      && <Invitacion {...props} />}
      {page === 'detalles'     && <Detalles {...props} />}
      {page === 'rsvp'         && <RSVP {...props} />}
      {page === 'confirmacion' && <Confirmacion {...props} />}
      {page === 'subir'        && <SubirArchivo {...props} />}
      {page === 'admin'        && <Admin {...props} />}
    </div>
  );
}
