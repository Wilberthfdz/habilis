import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import { buscarTecnicos } from "../lib/firebase.js";

const CATS = [
  "Electricista","Plomero","Técnico HVAC / Minisplits","Mecánico",
  "Pintor","Instalador CCTV","Albañil","Tablaroquero","Soldador","Herrero",
];

const initials = n => ((n||"").trim().charAt(0).toUpperCase()) || "T";

export default function Buscar({ nav, user, params }) {
  const [todos,    setTodos]    = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [q,        setQ]        = useState(params?.oficio || "");

  useEffect(() => {
    buscarTecnicos({}).then(r => {
      setTodos(r);
      const init = params?.oficio || "";
      setTecnicos(init ? filtrar(r, init) : r);
    }).catch(() => { setTodos([]); setTecnicos([]); })
      .finally(() => setLoading(false));
  }, []);

  const score = t =>
    (t.totalTrabajos || 0) * 2 +
    (t.validaciones  || 0) * 1.5 +
    (t.experiencia   || 0) * 1 +
    (t.verificado    ? 3 : 0) +
    (t.plan === "pro"? 5 : 0);

  const filtrar = (lista, f) => {
    const l = f.trim().toLowerCase();
    // Text filter
    const matched = l
      ? lista.filter(t =>
          (t.oficio||"").toLowerCase().includes(l) ||
          (t.nombre||"").toLowerCase().includes(l) ||
          (t.ciudad||"").toLowerCase().includes(l)
        )
      : [...lista];
    // Alcance filter: hide "estado"-only technicians when searching outside their city
    const conAlcance = matched.filter(t => {
      if (!t.alcance || t.alcance === "nacional" || t.alcance === "latam") return true;
      if (t.alcance === "estado") {
        if (!l) return true; // no filter active → show all
        return (t.ciudad||"").toLowerCase().includes(l);
      }
      return true;
    });
    // Sort by score descending
    return conAlcance.sort((a, b) => score(b) - score(a));
  };

  const buscar   = () => setTecnicos(filtrar(todos, q));
  const onKey    = e => { if (e.key === "Enter") buscar(); };
  const setChip  = cat => { setQ(cat); setTecnicos(filtrar(todos, cat)); };
  const clearQ   = () => { setQ(""); setTecnicos(todos); };

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <style>{`
        .bc { transition:box-shadow 0.18s,transform 0.18s; }
        .bc:hover { box-shadow:0 8px 24px rgba(0,0,0,0.1) !important; transform:translateY(-2px); }
      `}</style>

      {/* NAV */}
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO BANNER */}
      <div style={{ background:"#0F172A", padding:"40px 20px 36px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"420px", height:"420px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"960px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.1em", marginBottom:"8px" }}>Directorio de técnicos</p>
          <h1 style={{ fontSize:"clamp(24px,4vw,40px)", fontWeight:900, color:"#fff", marginBottom:"8px" }}>
            Encuentra el técnico perfecto
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"15px", marginBottom:"24px" }}>
            Técnicos verificados con trabajos documentados cerca de ti
          </p>

          {/* Search */}
          <div style={{ display:"flex", gap:"8px", maxWidth:"640px", flexWrap:"wrap" }}>
            <input
              style={{ flex:"2 1 200px", background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.12)",
                       borderRadius:"10px", padding:"12px 16px", color:"#fff", fontSize:"14px", outline:"none" }}
              value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey}
              placeholder="Oficio, nombre o ciudad..."
            />
            <button onClick={buscar}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"12px 22px", fontWeight:700, fontSize:"14px", cursor:"pointer", flexShrink:0 }}>
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* CHIPS */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"12px 20px", overflowX:"auto" }}>
        <div style={{ display:"flex", gap:"8px", maxWidth:"960px", margin:"0 auto", width:"max-content" }}>
          <button onClick={clearQ}
            style={{ padding:"6px 16px", background: !q ? "#0F172A" : "#F1F5F9",
                     color: !q ? "#fff" : "#374151", border:"none",
                     borderRadius:"20px", fontSize:"12px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
            Todos
          </button>
          {CATS.map(cat => (
            <button key={cat} onClick={() => setChip(cat)}
              style={{ padding:"6px 16px", background: q === cat ? "#F97316" : "#F1F5F9",
                       color: q === cat ? "#fff" : "#374151", border:"none",
                       borderRadius:"20px", fontSize:"12px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"24px 20px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"72px 20px" }}>
            <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                          borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
            <p style={{ color:"#64748B" }}>Cargando técnicos...</p>
          </div>
        ) : tecnicos.length === 0 ? (
          <div style={{ textAlign:"center", padding:"72px 20px", background:"#fff",
                        borderRadius:"20px", border:"1px solid #E2E8F0" }}>
            <div style={{ fontSize:"52px", marginBottom:"14px" }}>🔍</div>
            <p style={{ fontWeight:800, fontSize:"18px", color:"#0F172A", marginBottom:"6px" }}>
              {todos.length === 0 ? "Aún no hay técnicos registrados" : `Sin resultados para "${q}"`}
            </p>
            <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"24px" }}>
              {todos.length === 0 ? "Sé el primero en registrarte gratis" : "Prueba con otro término o ve todos"}
            </p>
            {todos.length === 0
              ? <button onClick={() => nav("registro")}
                  style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                           padding:"12px 24px", fontWeight:700, cursor:"pointer" }}>
                  Registrarme gratis →
                </button>
              : <button onClick={clearQ}
                  style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                           padding:"12px 24px", fontWeight:700, cursor:"pointer" }}>
                  Ver todos los técnicos
                </button>
            }
          </div>
        ) : (
          <>
            <p style={{ color:"#64748B", fontSize:"13px", marginBottom:"16px" }}>
              <b style={{ color:"#0F172A" }}>{tecnicos.length}</b> técnico{tecnicos.length !== 1 ? "s" : ""}{q ? ` para "${q}"` : ""}
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {tecnicos.map(t => (
                <div key={t.id} className="bc"
                  style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                           padding:"18px 20px", cursor:"pointer",
                           boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}
                  onClick={() => nav("perfil", { tecnicoId:t.id })}>
                  <div style={{ display:"flex", gap:"16px", alignItems:"flex-start" }}>
                    {/* Avatar */}
                    <Avatar size={54} nombre={t.nombre} fotoUrl={t.fotoUrl} plan={t.plan} />
                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", marginBottom:"3px" }}>
                        <span style={{ fontWeight:800, fontSize:"15px", color:"#0F172A" }}>{t.nombre || "Técnico"}</span>
                        {t.plan === "pro" && <span style={{ background:"#FFF7ED", color:"#EA580C", fontSize:"10px", fontWeight:700, padding:"2px 7px", borderRadius:"6px" }}>⚡ PRO</span>}
                        {t.verificado && <span style={{ background:"#F0FDF4", color:"#059669", fontSize:"10px", fontWeight:700, padding:"2px 7px", borderRadius:"6px" }}>✅ Verificado</span>}
                      </div>
                      <p style={{ color:"#F97316", fontSize:"13px", fontWeight:600, marginBottom:"3px" }}>{t.oficio}</p>
                      <p style={{ color:"#94A3B8", fontSize:"12px" }}>
                        📍 {t.ciudad || "Sin ciudad"}
                        {t.experiencia ? ` · ${t.experiencia} años exp.` : ""}
                        {t.rating > 0 ? ` · ⭐ ${t.rating}` : ""}
                      </p>
                      {t.bio && <p style={{ color:"#64748B", fontSize:"12px", marginTop:"6px", lineHeight:1.5 }}>{t.bio.slice(0,100)}{t.bio.length > 100 ? "..." : ""}</p>}
                    </div>
                    {/* CTA */}
                    <button onClick={e => { e.stopPropagation(); nav("perfil", { tecnicoId:t.id }); }}
                      style={{ flexShrink:0, background:"#F97316", color:"#fff", border:"none",
                               borderRadius:"9px", padding:"8px 16px", fontWeight:700, fontSize:"12px", cursor:"pointer" }}>
                      Ver perfil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
