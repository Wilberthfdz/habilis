import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import { buscarTecnicos } from "../lib/firebase.js";

/* ─── SVG Icons (reemplazan emojis) ──────────────────────────────────── */
const IcoBolt = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M13 2L4.09 12.97H11L10 22l8.91-10.97H13L14 2z"/>
  </svg>
);
const IcoSnowflake = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
    <polyline points="17 7 12 12 7 7"/><polyline points="17 17 12 12 7 17"/>
    <polyline points="7 7 2 12 7 17"/><polyline points="17 7 22 12 17 17"/>
  </svg>
);
const IcoWrench = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);
const IcoDrop = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
  </svg>
);
const IcoCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const IcoAnvil = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <rect x="2" y="14" width="20" height="5" rx="2"/>
    <path d="M6 14V9a6 6 0 0112 0v5"/>
    <line x1="9" y1="19" x2="9" y2="22"/><line x1="15" y1="19" x2="15" y2="22"/>
  </svg>
);
const IcoLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);
const IcoBrush = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <path d="M18.37 2.63L14 7l-1.59-1.59a2 2 0 00-2.82 0L8 7l9 9 1.59-1.59a2 2 0 000-2.82L17 10l4.37-4.37a2.12 2.12 0 00-3-3z"/>
    <path d="M9 8c-2 3-4 3.5-7 4l8 8c1-.5 3.5-2 4-7"/>
  </svg>
);
const IcoCog = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);
const IcoThermo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>
  </svg>
);
const IcoHardHat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <path d="M2 18a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1H3a1 1 0 00-1 1v2z"/>
    <path d="M10 10V5a1 1 0 011-1h2a1 1 0 011 1v5"/>
    <path d="M4 15v-3a8 8 0 0116 0v3"/>
  </svg>
);
const IcoWifi = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
    <path d="M5 12.55a11 11 0 0114.08 0"/>
    <path d="M1.42 9a16 16 0 0121.16 0"/>
    <path d="M8.53 16.11a6 6 0 016.95 0"/>
    <circle cx="12" cy="20" r="1" fill="currentColor"/>
  </svg>
);

const CATS = [
  { Icon:IcoBolt,      name:"Electricidad",  bg:"#FFF8E6", color:"#C77B00" },
  { Icon:IcoSnowflake, name:"Minisplits",    bg:"#EBF5FF", color:"#1A72D9" },
  { Icon:IcoWrench,    name:"Mecánica",      bg:"#F4F4F4", color:"#404040" },
  { Icon:IcoDrop,      name:"Plomería",      bg:"#E8F8FB", color:"#0077A8" },
  { Icon:IcoCamera,    name:"Cámaras CCTV", bg:"#F0EBFF", color:"#6B21A8" },
  { Icon:IcoAnvil,     name:"Herrería",      bg:"#FFF0F0", color:"#B91C1C" },
  { Icon:IcoLayers,    name:"Tablaroca",     bg:"#F0FBF4", color:"#166534" },
  { Icon:IcoBrush,     name:"Pintura",       bg:"#FDF4FF", color:"#86198F" },
  { Icon:IcoCog,       name:"Motores",       bg:"#F1F2F3", color:"#374151" },
  { Icon:IcoThermo,    name:"Refrigeración", bg:"#EBF4FF", color:"#1D4ED8" },
  { Icon:IcoHardHat,   name:"Albañilería",   bg:"#FFF5EB", color:"#B45309" },
  { Icon:IcoWifi,      name:"Redes",         bg:"#EDFDF5", color:"#047857" },
];

const STEPS = [
  { n:"01", title:"Busca el servicio", desc:"Escribe lo que necesitas y tu ciudad. Filtra por técnicos verificados con historial fotográfico real." },
  { n:"02", title:"Revisa el perfil",  desc:"Ve trabajos documentados con fotos antes/después, calificaciones de clientes reales y años de experiencia." },
  { n:"03", title:"Contrata directo",  desc:"Contacta al técnico sin intermediarios. Sin comisiones ocultas, sin apps de terceros." },
];

/* ─── Hero Illustration ─────────────────────────────────────────────── */
function HeroCard() {
  return (
    <div style={{ position:"relative", width:"100%", maxWidth:"380px", margin:"0 auto" }}>
      {/* Glow */}
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:"320px", height:"320px",
        background:"radial-gradient(circle, rgba(240,112,32,0.22) 0%, transparent 70%)",
        pointerEvents:"none", zIndex:0
      }}/>
      {/* Floating "Disponible hoy" pill */}
      <div style={{
        position:"absolute", top:"-18px", right:"8px", zIndex:10,
        background:"#0A1120", border:"1.5px solid rgba(16,185,129,0.5)",
        borderRadius:"24px", padding:"7px 14px",
        display:"flex", alignItems:"center", gap:"7px",
        boxShadow:"0 4px 20px rgba(0,0,0,0.5)"
      }}>
        <span style={{
          width:"8px", height:"8px", borderRadius:"50%", background:"#10B981",
          boxShadow:"0 0 0 3px rgba(16,185,129,0.25)", flexShrink:0
        }}/>
        <span style={{ fontSize:"12px", fontWeight:700, color:"#fff", whiteSpace:"nowrap" }}>Disponible hoy</span>
      </div>
      {/* Main card */}
      <div style={{
        background:"#0F1C2E", border:"1px solid rgba(255,255,255,0.09)",
        borderRadius:"20px", padding:"22px", position:"relative", zIndex:1,
        boxShadow:"0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
      }}>
        {/* Orange top accent line */}
        <div style={{ position:"absolute", top:0, left:"24px", right:"24px", height:"2px",
                      background:"linear-gradient(90deg,transparent,#F07020,transparent)", borderRadius:"1px" }}/>
        {/* Profile row */}
        <div style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"18px" }}>
          <div style={{
            width:"50px", height:"50px", borderRadius:"14px",
            background:"linear-gradient(135deg,#1E3A5F,#2D5080)",
            border:"2px solid rgba(240,112,32,0.25)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
          }}>
            <svg viewBox="0 0 36 36" width="28" height="28">
              <circle cx="18" cy="13" r="7" fill="rgba(255,255,255,0.6)"/>
              <path d="M6 32c0-7 5-11 12-11s12 4 12 11" fill="rgba(255,255,255,0.4)"/>
            </svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, color:"#fff", fontSize:"14px", marginBottom:"2px" }}>Roberto Méndez</div>
            <div style={{ color:"#F07020", fontSize:"12px", fontWeight:600 }}>Electricista · CDMX</div>
          </div>
          <div style={{
            background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.3)",
            borderRadius:"20px", padding:"4px 10px", fontSize:"10px", fontWeight:700, color:"#10B981",
            whiteSpace:"nowrap"
          }}>✓ Verificado</div>
        </div>
        {/* Stats */}
        <div style={{
          display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:"12px", padding:"12px 8px", marginBottom:"18px"
        }}>
          {[["127","trabajos"],["4.9","★ rating"],["8 años","exp."]].map(([v,l],i) => (
            <div key={l} style={{
              textAlign:"center",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none"
            }}>
              <div style={{ fontSize:"17px", fontWeight:900, color:"#F07020", lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.38)", marginTop:"4px", fontWeight:600, letterSpacing:"0.04em" }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Work thumbnails */}
        <div style={{ marginBottom:"16px" }}>
          <div style={{ fontSize:"9px", fontWeight:700, color:"rgba(255,255,255,0.35)",
                        letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"8px" }}>
            Trabajos documentados
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"6px" }}>
            {/* Panel eléctrico */}
            <div style={{ aspectRatio:"1", borderRadius:"10px", background:"#172336", overflow:"hidden",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg viewBox="0 0 48 48" width="34" height="34">
                <rect x="8" y="4" width="32" height="40" rx="3" fill="none" stroke="rgba(240,112,32,0.5)" strokeWidth="1.5"/>
                {[10,17,24,31,37].map(y=>(
                  <g key={y}>
                    <rect x="14" y={y} width="8" height="3" rx="1" fill={y===10?"#F07020":"rgba(255,255,255,0.15)"}/>
                    <rect x="26" y={y} width="8" height="3" rx="1" fill={y===17?"#F07020":"rgba(255,255,255,0.1)"}/>
                  </g>
                ))}
              </svg>
            </div>
            {/* Cableado */}
            <div style={{ aspectRatio:"1", borderRadius:"10px", background:"#0D2010", overflow:"hidden",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg viewBox="0 0 48 48" width="34" height="34">
                <path d="M8 28 C16 16 32 16 40 28" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M8 36 C16 24 32 24 40 36" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" fill="none"/>
                <circle cx="8" cy="28" r="3" fill="#10B981"/>
                <circle cx="40" cy="28" r="3" fill="#10B981"/>
              </svg>
            </div>
            {/* Medidor */}
            <div style={{ aspectRatio:"1", borderRadius:"10px", background:"#1E1208", overflow:"hidden",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg viewBox="0 0 48 48" width="34" height="34">
                <circle cx="24" cy="24" r="14" stroke="rgba(240,112,32,0.5)" strokeWidth="1.5" fill="none"/>
                <path d="M24 24 L24 12" stroke="#F07020" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M24 24 L34 30" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="3" fill="#F07020"/>
              </svg>
            </div>
          </div>
        </div>
        {/* Button */}
        <button className="hab-btn-card">
          Ver perfil completo
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
          </svg>
        </button>
      </div>
      {/* Floating location pill */}
      <div style={{
        position:"absolute", bottom:"-16px", left:"12px", zIndex:10,
        background:"#0A1120", border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:"20px", padding:"7px 13px",
        display:"flex", alignItems:"center", gap:"6px",
        boxShadow:"0 4px 20px rgba(0,0,0,0.4)"
      }}>
        <svg viewBox="0 0 16 16" width="12" height="12" fill="#F07020">
          <path d="M8 0C5.24 0 3 2.24 3 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
        </svg>
        <span style={{ fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.65)" }}>Ciudad de México</span>
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────── */
export default function Landing({ nav, user }) {
  const [oficio, setOficio]   = useState("");
  const [ciudad, setCiudad]   = useState("");
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    buscarTecnicos({}).then(r => setFeatured(r.slice(0, 4))).catch(() => {});
  }, []);

  const go  = () => nav("buscar", { oficio, ciudad });
  const key = e => { if (e.key === "Enter") go(); };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:"#F5F0EA" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes floatUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes blobA    { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.08) translate(20px,-20px)} }
        @keyframes blobB    { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(0.94) translate(-16px,18px)} }

        .hab-cat { background:#fff; border:1px solid #EDE8E1; border-radius:14px;
                   padding:20px 12px; text-align:center; cursor:pointer;
                   box-shadow:0 1px 3px rgba(0,0,0,0.05);
                   transition:all 0.18s ease; }
        .hab-cat:hover { border-color:#F07020; transform:translateY(-3px);
                         box-shadow:0 8px 24px rgba(240,112,32,0.18); }

        .hab-tech { background:#fff; border:1px solid #EDE8E1; border-radius:16px;
                    padding:20px; cursor:pointer;
                    box-shadow:0 1px 3px rgba(0,0,0,0.05);
                    transition:all 0.18s ease; }
        .hab-tech:hover { box-shadow:0 10px 30px rgba(0,0,0,0.1); transform:translateY(-3px); }

        .hab-btn-primary {
          display:inline-flex; align-items:center; gap:8px;
          background:#F07020; color:#fff; border:none;
          border-radius:8px; padding:14px 28px;
          font-weight:800; font-size:15px; cursor:pointer;
          box-shadow:0 4px 0 #A84E10, 0 8px 20px rgba(240,112,32,0.35);
          transform:translateY(0); transition:transform 0.1s, box-shadow 0.1s;
          font-family:inherit; letter-spacing:-0.01em;
        }
        .hab-btn-primary:hover { transform:translateY(2px); box-shadow:0 2px 0 #A84E10, 0 4px 12px rgba(240,112,32,0.25); }
        .hab-btn-primary:active { transform:translateY(4px); box-shadow:none; }

        .hab-btn-outline {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; color:#fff;
          border:1.5px solid rgba(255,255,255,0.35);
          border-radius:8px; padding:13px 24px;
          font-weight:700; font-size:15px; cursor:pointer;
          transition:background 0.18s, border-color 0.18s;
          font-family:inherit;
        }
        .hab-btn-outline:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.6); }

        .hab-btn-secondary {
          display:inline-flex; align-items:center; gap:8px;
          background:#0A1120; color:#fff; border:none;
          border-radius:8px; padding:14px 28px;
          font-weight:800; font-size:15px; cursor:pointer;
          box-shadow:0 4px 0 #040810, 0 8px 20px rgba(0,0,0,0.3);
          transform:translateY(0); transition:transform 0.1s, box-shadow 0.1s;
          font-family:inherit;
        }
        .hab-btn-secondary:hover { transform:translateY(2px); box-shadow:0 2px 0 #040810, 0 4px 12px rgba(0,0,0,0.2); }
        .hab-btn-secondary:active { transform:translateY(4px); box-shadow:none; }

        .hab-btn-ghost {
          background:transparent; color:#F07020; border:1.5px solid #F07020;
          border-radius:8px; padding:9px 20px;
          font-weight:700; font-size:13px; cursor:pointer;
          transition:background 0.18s;
          font-family:inherit;
        }
        .hab-btn-ghost:hover { background:rgba(240,112,32,0.08); }

        .hab-btn-card {
          width:100%; padding:12px; background:#F07020; border:none;
          border-bottom:3px solid #A84E10;
          border-radius:10px; color:#fff; font-weight:800; font-size:13px;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
          font-family:inherit; transition:transform 0.1s, border-bottom-width 0.1s;
        }
        .hab-btn-card:hover { transform:translateY(2px); border-bottom-width:1px; }

        .srch-wrap { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12);
                     border-radius:12px; padding:6px; display:flex; gap:6px;
                     width:100%; maxWidth:620px; margin:0 auto 28px;
                     backdrop-filter:blur(16px); flex-wrap:wrap; }
        .srch-inp { flex:1 1 160px; background:rgba(255,255,255,0.07); border:none;
                    border-radius:8px; padding:12px 14px; color:#fff; font-size:14px;
                    outline:none; font-family:inherit; min-width:0; }
        .srch-inp::placeholder { color:rgba(255,255,255,0.35); }
        .srch-inp:focus { background:rgba(255,255,255,0.12); }

        .step-num { width:48px; height:48px; border-radius:12px; background:#0A1120;
                    display:flex; align-items:center; justify-content:center;
                    font-size:13px; font-weight:900; color:#F07020;
                    letter-spacing:0.02em; border:1px solid rgba(255,255,255,0.08);
                    flex-shrink:0; }

        @media(max-width:767px) {
          .hero-grid { flex-direction:column !important; }
          .hero-illus { display:none !important; }
        }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{ background:"#080E1C", position:"relative", overflow:"hidden" }}>
        {/* Blobs */}
        <div style={{ position:"absolute", top:"-10%", right:"-5%", width:"580px", height:"580px",
                      background:"radial-gradient(circle,rgba(240,112,32,0.16) 0%,transparent 65%)",
                      animation:"blobA 12s ease-in-out infinite", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-20%", left:"-5%", width:"480px", height:"480px",
                      background:"radial-gradient(circle,rgba(30,90,160,0.12) 0%,transparent 65%)",
                      animation:"blobB 16s ease-in-out infinite", pointerEvents:"none" }}/>
        {/* Dot grid overlay */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
                      backgroundImage:"radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                      backgroundSize:"32px 32px" }}/>

        <Nav nav={nav} user={user} />

        {/* Two-column hero */}
        <div className="hero-grid" style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:"clamp(32px,5vw,80px)", padding:"64px clamp(20px,5vw,64px) 80px",
          maxWidth:"1160px", margin:"0 auto", minHeight:"calc(100vh - 60px)"
        }}>
          {/* Left: copy */}
          <div style={{ flex:"1 1 460px", animation:"fadeUp 0.8s ease forwards" }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              background:"rgba(240,112,32,0.12)", border:"1px solid rgba(240,112,32,0.28)",
              borderRadius:"6px", padding:"5px 12px", marginBottom:"28px"
            }}>
              <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#F07020", flexShrink:0 }}/>
              <span style={{ fontSize:"11px", color:"#F07020", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                Plataforma para técnicos mexicanos
              </span>
            </div>

            <h1 style={{
              fontSize:"clamp(30px,5.5vw,64px)", fontWeight:900, lineHeight:1.05,
              color:"#fff", marginBottom:"20px", letterSpacing:"-0.03em"
            }}>
              El historial<br/>
              profesional del<br/>
              <span style={{ color:"#F07020" }}>técnico mexicano</span>
            </h1>

            <p style={{
              fontSize:"clamp(14px,2vw,18px)", color:"rgba(255,255,255,0.52)",
              marginBottom:"40px", maxWidth:"460px", lineHeight:1.7
            }}>
              Encuentra técnicos con trabajos documentados —<br/>
              fotos reales, calificaciones honestas, sin intermediarios.
            </p>

            {/* Search */}
            <div className="srch-wrap">
              <input className="srch-inp"
                placeholder="¿Qué servicio necesitas? (Electricista...)"
                value={oficio} onChange={e => setOficio(e.target.value)} onKeyDown={key}/>
              <input className="srch-inp" style={{ flex:"0 1 140px" }}
                placeholder="Ciudad"
                value={ciudad} onChange={e => setCiudad(e.target.value)} onKeyDown={key}/>
              <button className="hab-btn-primary" onClick={go} style={{ padding:"12px 20px", flexShrink:0, fontSize:"14px" }}>
                Buscar
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                  <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398l3.85 3.85a1 1 0 001.415-1.414l-3.868-3.834zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display:"flex", gap:"20px", flexWrap:"wrap" }}>
              {["Técnicos verificados","Fotos antes/después","Calificaciones reales","Sin comisiones"].map(t => (
                <span key={t} style={{ color:"rgba(255,255,255,0.32)", fontSize:"12px", display:"flex", alignItems:"center", gap:"5px" }}>
                  <svg viewBox="0 0 12 12" width="10" height="10" fill="#F07020" style={{ flexShrink:0 }}>
                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="hero-illus" style={{
            flex:"0 0 380px", animation:"fadeUp 1s ease 0.2s both",
            paddingBottom:"24px", paddingTop:"24px"
          }}>
            <HeroCard/>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"22px clamp(20px,5vw,64px)" }}>
          <div style={{ display:"flex", justifyContent:"center", gap:"clamp(24px,6vw,80px)",
                        flexWrap:"wrap", maxWidth:"900px", margin:"0 auto" }}>
            {[["30M+","Técnicos en México"],["100%","Gratis para clientes"],["Real","Trabajos con evidencia"],["Directo","Sin intermediarios"]].map(([v,l]) => (
              <div key={v} style={{ textAlign:"center" }}>
                <div style={{ fontWeight:900, fontSize:"clamp(16px,2.8vw,24px)", color:"#F07020" }}>{v}</div>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"11px", marginTop:"3px", maxWidth:"110px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────── */}
      <section style={{ padding:"72px clamp(20px,5vw,64px)", background:"#F5F0EA" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"44px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, color:"#F07020", textTransform:"uppercase",
                        letterSpacing:"0.12em", marginBottom:"8px" }}>Servicios disponibles</p>
            <h2 style={{ fontSize:"clamp(22px,4vw,40px)", fontWeight:900, color:"#0A1120",
                         letterSpacing:"-0.03em", lineHeight:1.1 }}>
              Todo tipo de técnicos,<br/>una sola plataforma
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:"10px" }}>
            {CATS.map(({ Icon, name, bg, color }) => (
              <button key={name} className="hab-cat" onClick={() => nav("buscar", { oficio:name })}>
                <div style={{
                  width:"44px", height:"44px", borderRadius:"12px", background:bg,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 10px", color
                }}>
                  <Icon/>
                </div>
                <div style={{ fontSize:"12px", fontWeight:700, color:"#0A1120", lineHeight:1.3 }}>{name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────── */}
      <section style={{ padding:"72px clamp(20px,5vw,64px)", background:"#fff", borderTop:"1px solid #EDE8E1" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"56px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, color:"#F07020", textTransform:"uppercase",
                        letterSpacing:"0.12em", marginBottom:"8px" }}>Proceso simple</p>
            <h2 style={{ fontSize:"clamp(22px,4vw,40px)", fontWeight:900, color:"#0A1120",
                         letterSpacing:"-0.03em" }}>¿Cómo funciona?</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"0" }}>
            {STEPS.map(({ n, title, desc }, i) => (
              <div key={n} style={{
                padding:"32px", borderRight: i < STEPS.length - 1 ? "1px solid #EDE8E1" : "none",
                position:"relative"
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"18px" }}>
                  <div className="step-num">{n}</div>
                  <div style={{
                    flex:1, height:"1px",
                    background: i < STEPS.length - 1 ? "linear-gradient(90deg,rgba(240,112,32,0.3),transparent)" : "transparent"
                  }}/>
                </div>
                <h3 style={{ fontSize:"17px", fontWeight:800, color:"#0A1120",
                             marginBottom:"10px", letterSpacing:"-0.02em" }}>{title}</h3>
                <p style={{ color:"#6B6560", fontSize:"14px", lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉCNICOS DESTACADOS ───────────────────────────────────── */}
      <section style={{ padding:"72px clamp(20px,5vw,64px)", background:"#F5F0EA" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end",
                        flexWrap:"wrap", gap:"12px", marginBottom:"32px" }}>
            <div>
              <p style={{ fontSize:"11px", fontWeight:700, color:"#F07020", textTransform:"uppercase",
                          letterSpacing:"0.12em", marginBottom:"8px" }}>Técnicos destacados</p>
              <h2 style={{ fontSize:"clamp(20px,3.5vw,36px)", fontWeight:900, color:"#0A1120", letterSpacing:"-0.03em" }}>
                Profesionales verificados
              </h2>
            </div>
            <button className="hab-btn-ghost" onClick={() => nav("buscar")}>
              Ver todos →
            </button>
          </div>

          {featured.length === 0 ? (
            <div style={{ textAlign:"center", padding:"64px 20px", background:"#fff",
                          borderRadius:"20px", border:"1px solid #EDE8E1" }}>
              <div style={{
                width:"64px", height:"64px", borderRadius:"18px",
                background:"#FFF5EB", border:"1px solid #EDE8E1",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 18px", color:"#F07020"
              }}>
                <IcoWrench/>
              </div>
              <p style={{ fontWeight:800, fontSize:"18px", color:"#0A1120",
                          marginBottom:"8px", letterSpacing:"-0.02em" }}>
                Sé el primero en registrarte
              </p>
              <p style={{ color:"#6B6560", fontSize:"14px", marginBottom:"28px" }}>
                Los técnicos registrados aparecen aquí como destacados.
              </p>
              <button className="hab-btn-primary" onClick={() => nav("registro")}>
                Crear perfil gratis
              </button>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"14px" }}>
              {featured.map(t => (
                <div key={t.id} className="hab-tech" onClick={() => nav("perfil", { tecnicoId:t.id })}>
                  <div style={{ display:"flex", gap:"12px", alignItems:"flex-start", marginBottom:"14px" }}>
                    <Avatar size={48} nombre={t.nombre} fotoUrl={t.fotoUrl} plan={t.plan}/>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:800, fontSize:"14px", color:"#0A1120",
                                  marginBottom:"2px", letterSpacing:"-0.01em" }}>{t.nombre}</p>
                      <p style={{ color:"#F07020", fontSize:"12px", fontWeight:600 }}>{t.oficio}</p>
                    </div>
                  </div>
                  <p style={{ color:"#6B6560", fontSize:"12px", marginBottom:"10px" }}>
                    {t.ciudad}{t.rating > 0 ? ` · ★ ${t.rating}` : " · Nuevo"}
                  </p>
                  <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                    {t.plan === "pro" && (
                      <span style={{ background:"#FFF5EB", color:"#C2410C", fontSize:"10px",
                                     fontWeight:700, padding:"3px 8px", borderRadius:"5px",
                                     border:"1px solid #FECAAA" }}>
                        PRO
                      </span>
                    )}
                    {t.verificado && (
                      <span style={{ background:"#F0FDF4", color:"#166534", fontSize:"10px",
                                     fontWeight:700, padding:"3px 8px", borderRadius:"5px",
                                     border:"1px solid #BBF7D0" }}>
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HABILIS CARE ─────────────────────────────────────────── */}
      <section style={{ padding:"72px clamp(20px,5vw,64px)", background:"#fff", borderTop:"1px solid #EDE8E1" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
                        gap:"56px", alignItems:"center" }}>
            <div>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:"8px",
                background:"#FFF5EB", border:"1px solid #FECAAA", borderRadius:"6px",
                padding:"5px 12px", marginBottom:"20px"
              }}>
                <span style={{ fontSize:"11px", fontWeight:700, color:"#C2410C",
                               textTransform:"uppercase", letterSpacing:"0.1em" }}>
                  Habilis Care — Nuevo
                </span>
              </div>
              <h2 style={{ fontSize:"clamp(22px,4vw,40px)", fontWeight:900, color:"#0A1120",
                           marginBottom:"14px", lineHeight:1.1, letterSpacing:"-0.03em" }}>
                Mantenimiento<br/>preventivo para<br/>tus equipos
              </h2>
              <p style={{ color:"#6B6560", fontSize:"15px", lineHeight:1.75, marginBottom:"28px" }}>
                Registra tus equipos. Habilis calcula cuándo necesitan servicio y te conecta con el técnico correcto.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"32px" }}>
                {[
                  [IcoSnowflake, "AC · Refrigeración · Paneles solares"],
                  [IcoCog,       "Vehículos · Generadores · UPS"],
                  [IcoCamera,    "CCTV · Redes · Equipos industriales"],
                ].map(([Icon, text]) => (
                  <div key={text} style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                    <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"#F5F0EA",
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  color:"#F07020", flexShrink:0 }}>
                      <Icon/>
                    </div>
                    <span style={{ fontSize:"14px", color:"#374151", fontWeight:500 }}>{text}</span>
                  </div>
                ))}
              </div>
              <button className="hab-btn-primary" onClick={() => nav(user ? "habilisCare" : "registro")}>
                {user ? "Ver mis equipos" : "Registra tu equipo gratis"}
              </button>
            </div>

            {/* Equipment grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              {[
                { Icon:IcoSnowflake, name:"Aire acondicionado", salud:82, dias:28 },
                { Icon:IcoBolt,      name:"Panel solar",        salud:45, dias:-12 },
                { Icon:IcoCog,       name:"Vehículo",           salud:67, dias:14 },
                { Icon:IcoThermo,    name:"UPS servidores",     salud:91, dias:60 },
              ].map(({ Icon, name, salud, dias }) => {
                const clr = salud > 80 ? "#059669" : salud > 50 ? "#D97706" : "#DC2626";
                const bg  = salud > 80 ? "#F0FDF4" : salud > 50 ? "#FFFBEB" : "#FEF2F2";
                return (
                  <div key={name} style={{
                    background:"#F5F0EA", border:`1px solid ${salud < 50 ? "rgba(220,38,38,0.2)" : "#EDE8E1"}`,
                    borderRadius:"14px", padding:"16px"
                  }}>
                    <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"#fff",
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  color:"#F07020", marginBottom:"8px" }}>
                      <Icon/>
                    </div>
                    <p style={{ fontWeight:700, fontSize:"12px", color:"#0A1120", marginBottom:"6px",
                                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                      <div style={{ flex:1, height:"4px", background:"#E5E0D8", borderRadius:"2px" }}>
                        <div style={{ width:`${salud}%`, height:"4px", background:clr, borderRadius:"2px",
                                      transition:"width 0.6s ease" }}/>
                      </div>
                      <span style={{ fontSize:"10px", fontWeight:800, color:clr }}>{salud}%</span>
                    </div>
                    <p style={{ fontSize:"11px", color:clr, marginTop:"6px", fontWeight:700 }}>
                      {dias < 0 ? `Vencido hace ${Math.abs(dias)}d` : `En ${dias} días`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA TÉCNICOS ─────────────────────────────────────────── */}
      <section style={{ background:"#080E1C", padding:"90px clamp(20px,5vw,64px)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-30%", right:"-5%", width:"520px", height:"520px",
                      background:"radial-gradient(circle,rgba(240,112,32,0.15) 0%,transparent 65%)",
                      pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-25%", left:"-5%", width:"400px", height:"400px",
                      background:"radial-gradient(circle,rgba(30,90,160,0.1) 0%,transparent 65%)",
                      pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
                      backgroundImage:"radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
                      backgroundSize:"32px 32px" }}/>
        <div style={{ maxWidth:"680px", margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"8px",
            background:"rgba(240,112,32,0.12)", border:"1px solid rgba(240,112,32,0.28)",
            borderRadius:"6px", padding:"5px 12px", marginBottom:"20px"
          }}>
            <span style={{ fontSize:"11px", color:"#F07020", fontWeight:700,
                           letterSpacing:"0.1em", textTransform:"uppercase" }}>¿Eres técnico?</span>
          </div>
          <h2 style={{ fontSize:"clamp(26px,4.5vw,52px)", fontWeight:900, color:"#fff",
                       lineHeight:1.08, marginBottom:"18px", letterSpacing:"-0.03em" }}>
            Construye tu reputación<br/>profesional con Habilis
          </h2>
          <p style={{ color:"rgba(255,255,255,0.48)", fontSize:"clamp(14px,2vw,17px)",
                      marginBottom:"40px", lineHeight:1.75, maxWidth:"500px", margin:"0 auto 40px" }}>
            Documenta tus trabajos con fotos, acumula calificaciones reales y aparece en búsquedas. Tu historial vale.
          </p>
          <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
            <button className="hab-btn-primary" onClick={() => nav("registro")}>
              Crea tu perfil gratis
            </button>
            <button className="hab-btn-outline" onClick={() => nav("precios")}>
              Ver planes
            </button>
          </div>
          <div style={{ display:"flex", gap:"24px", justifyContent:"center", marginTop:"28px", flexWrap:"wrap" }}>
            {["Sin tarjeta de crédito","Plan gratis siempre","Soporte en español"].map(t => (
              <span key={t} style={{ color:"rgba(255,255,255,0.28)", fontSize:"12px",
                                     display:"flex", alignItems:"center", gap:"5px" }}>
                <svg viewBox="0 0 12 12" width="10" height="10" fill="rgba(240,112,32,0.6)" style={{ flexShrink:0 }}>
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"/>
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ background:"#fff", borderTop:"1px solid #EDE8E1", padding:"52px clamp(20px,5vw,64px) 28px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                        gap:"36px", flexWrap:"wrap", marginBottom:"40px" }}>
            <div style={{ maxWidth:"240px" }}>
              <Logo size={28} textColor="#0A1120"/>
              <p style={{ color:"#6B6560", fontSize:"13px", marginTop:"12px", lineHeight:1.65 }}>
                Infraestructura de confianza para trabajadores técnicos en México.
              </p>
              <p style={{ color:"#B5AFA8", fontSize:"12px", marginTop:"8px", fontWeight:700,
                          letterSpacing:"0.04em" }}>myhabilis.com</p>
            </div>
            <div style={{ display:"flex", gap:"56px", flexWrap:"wrap" }}>
              <div>
                <p style={{ fontWeight:800, fontSize:"12px", color:"#0A1120",
                            marginBottom:"14px", letterSpacing:"0.06em", textTransform:"uppercase" }}>Plataforma</p>
                {[["Buscar técnicos","buscar"],["Feed de trabajos","feed"],["Precios","precios"]].map(([l,r]) => (
                  <button key={l} onClick={() => nav(r)}
                    style={{ display:"block", background:"none", border:"none", color:"#6B6560",
                             fontSize:"13px", marginBottom:"10px", cursor:"pointer", padding:0,
                             textAlign:"left", fontFamily:"inherit", transition:"color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color="#F07020"}
                    onMouseLeave={e => e.currentTarget.style.color="#6B6560"}>
                    {l}
                  </button>
                ))}
              </div>
              <div>
                <p style={{ fontWeight:800, fontSize:"12px", color:"#0A1120",
                            marginBottom:"14px", letterSpacing:"0.06em", textTransform:"uppercase" }}>Para técnicos</p>
                {[["Crear perfil gratis","registro"],["Mi panel","panel"],["Iniciar sesión","login"]].map(([l,r]) => (
                  <button key={l} onClick={() => nav(r)}
                    style={{ display:"block", background:"none", border:"none", color:"#6B6560",
                             fontSize:"13px", marginBottom:"10px", cursor:"pointer", padding:0,
                             textAlign:"left", fontFamily:"inherit", transition:"color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color="#F07020"}
                    onMouseLeave={e => e.currentTarget.style.color="#6B6560"}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop:"1px solid #EDE8E1", paddingTop:"20px",
                        display:"flex", justifyContent:"space-between",
                        alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
            <p style={{ color:"#B5AFA8", fontSize:"12px" }}>© 2025 Habilis · Todos los derechos reservados</p>
            <p style={{ color:"#B5AFA8", fontSize:"12px" }}>Hecho en México</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
