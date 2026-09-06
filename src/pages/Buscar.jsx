import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import Avatar from "../components/Avatar.jsx";
import { buscarTecnicos, buscarTecnicosCerca } from "../lib/firebase.js";
import { ubicacionDelNavegador, textoDistancia } from "../lib/geo.js";
import { TAXONOMIA } from "../lib/taxonomia.js";

// Chips desde la taxonomía real de oficios (src/lib/taxonomia.js)
const CATS = TAXONOMIA.map(c => ({ id: c.id, nombre: c.nombre }));

const initials = n => ((n||"").trim().charAt(0).toUpperCase()) || "T";

export default function Buscar({ nav, user, params }) {
  // La búsqueda la resuelve el servidor y llega por páginas. Antes se
  // descargaban 100 técnicos cualesquiera y se filtraba aquí: con cien
  // perfiles se notaba poco, con cien mil un plomero de Cancún no aparecía
  // nunca porque Firestore devolvía los 100 primeros que le daba la gana.
  const [tecnicos, setTecnicos] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [masLoading, setMasLoading] = useState(false);
  const [cursor,   setCursor]   = useState(null);
  const [q,        setQ]        = useState(params?.oficio || "");
  const [ciudad,   setCiudad]   = useState(params?.ciudad || "");
  const [categoriaId, setCategoriaId] = useState("");
  const [error,    setError]    = useState("");
  const [cerca,    setCerca]    = useState(false);   // búsqueda por cercanía activa
  const [ubicando, setUbicando] = useState(false);

  const consultar = async ({ texto, ciudadF, catId, cursorPrev = null, acumular = false }) => {
    cursorPrev ? setMasLoading(true) : setLoading(true);
    setError("");
    try {
      const r = await buscarTecnicos({
        texto: texto ?? q, ciudad: ciudadF ?? ciudad,
        categoriaId: catId ?? categoriaId, cursor: cursorPrev,
      });
      setTecnicos(prev => acumular ? [...prev, ...r.tecnicos] : r.tecnicos);
      setCursor(r.cursor);
    } catch (e) {
      console.error(e);
      // Un índice que aún no terminó de construirse en Firestore da
      // failed-precondition; decirlo es más útil que una lista vacía.
      setError(e?.code === "failed-precondition"
        ? "La búsqueda se está preparando. Vuelve a intentarlo en unos minutos."
        : "No pudimos completar la búsqueda. Revisa tu conexión.");
      if (!acumular) setTecnicos([]);
    } finally { setLoading(false); setMasLoading(false); }
  };

  useEffect(() => { consultar({}); }, []);

  const buscar  = () => { setCerca(false); consultar({}); };
  const onKey   = e => { if (e.key === "Enter") buscar(); };
  const verMas  = () => consultar({ cursorPrev: cursor, acumular: true });
  // Los chips filtran por categoría de la taxonomía, no por texto: es la
  // misma pregunta que entiende el servidor.
  const setChip = catId => {
    setCategoriaId(catId);
    consultar({ catId });
  };
  const hayFiltro = !!(q.trim() || ciudad.trim() || categoriaId || cerca);

  // "Cerca de mí". La ubicación del cliente NO se guarda en ninguna parte:
  // se usa para ordenar esta búsqueda y se olvida. Y lo que se ve de cada
  // técnico es una distancia aproximada, nunca un punto ni una dirección.
  const buscarCerca = async () => {
    setUbicando(true); setError("");
    try {
      const centro = await ubicacionDelNavegador();
      const r = await buscarTecnicosCerca({ centro, radioKm: 25, categoriaId });
      setTecnicos(r);
      setCursor(null);
      setCerca(true);
      if (r.length === 0) {
        setError("No encontramos técnicos a menos de 25 km. Prueba buscando por ciudad.");
      }
    } catch (e) {
      console.error(e);
      setError(e?.code === "failed-precondition"
        ? "La búsqueda por cercanía se está preparando. Vuelve a intentarlo en unos minutos."
        : e.message || "No pudimos buscar por cercanía.");
    } finally { setUbicando(false); setLoading(false); }
  };

  const clearQ  = () => {
    setQ(""); setCiudad(""); setCategoriaId(""); setCerca(false);
    consultar({ texto: "", ciudadF: "", catId: "" });
  };

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
            Técnicos con trabajos documentados cerca de ti
          </p>

          {/* Search */}
          <div style={{ display:"flex", gap:"8px", maxWidth:"640px", flexWrap:"wrap" }}>
            <input
              style={{ flex:"2 1 200px", background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.12)",
                       borderRadius:"10px", padding:"12px 16px", color:"#fff", fontSize:"14px", outline:"none" }}
              value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey}
              placeholder="Oficio o nombre..."
            />
            <input
              style={{ flex:"1 1 140px", background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.12)",
                       borderRadius:"10px", padding:"12px 16px", color:"#fff", fontSize:"14px", outline:"none" }}
              value={ciudad} onChange={e => setCiudad(e.target.value)} onKeyDown={onKey}
              placeholder="Ciudad"
            />
            <button onClick={buscar}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"12px 22px", fontWeight:700, fontSize:"14px", cursor:"pointer", flexShrink:0 }}>
              Buscar
            </button>
            <button onClick={buscarCerca} disabled={ubicando}
              style={{ background: cerca ? "#F97316" : "rgba(255,255,255,0.09)",
                       color:"#fff", border:`1px solid ${cerca ? "#F97316" : "rgba(255,255,255,0.14)"}`,
                       borderRadius:"10px", padding:"12px 18px", fontWeight:700, fontSize:"14px",
                       cursor:"pointer", flexShrink:0, opacity: ubicando ? 0.6 : 1 }}>
              {ubicando ? "Ubicando…" : "📍 Cerca de mí"}
            </button>
          </div>
        </div>
      </div>

      {/* CHIPS */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"12px 20px", overflowX:"auto" }}>
        <div style={{ display:"flex", gap:"8px", maxWidth:"960px", margin:"0 auto", width:"max-content" }}>
          <button onClick={clearQ}
            style={{ padding:"6px 16px", background: (!q && !ciudad && !categoriaId) ? "#0F172A" : "#F1F5F9",
                     color: (!q && !ciudad && !categoriaId) ? "#fff" : "#374151", border:"none",
                     borderRadius:"20px", fontSize:"12px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
            Todos
          </button>
          {CATS.map(cat => (
            <button key={cat.id} onClick={() => setChip(cat.id)}
              style={{ padding:"6px 16px", background: categoriaId === cat.id ? "#F97316" : "#F1F5F9",
                       color: categoriaId === cat.id ? "#fff" : "#374151", border:"none",
                       borderRadius:"20px", fontSize:"12px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
              {cat.nombre}
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
              {hayFiltro ? "Sin resultados" : "Aún no hay técnicos registrados"}
            </p>
            <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"24px" }}>
              {hayFiltro
                ? "Prueba con otro oficio o quita el filtro de ciudad."
                : "Sé el primero en registrarte gratis"}
            </p>
            {!hayFiltro
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
              {/* Sin "de N": el servidor devuelve páginas y contar la
                  colección entera costaría una lectura por técnico. */}
              <b style={{ color:"#0F172A" }}>{tecnicos.length}</b> técnico{tecnicos.length !== 1 ? "s" : ""}
              {cursor ? " y más" : ""}{q ? ` para "${q}"` : ""}
              {cerca ? " cerca de ti, ordenados por distancia y reputación" : (ciudad ? ` en ${ciudad}` : "")}
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
                      {/* Distancia aproximada, nunca un punto ni una
                          dirección: el técnico no publicó dónde vive. */}
                      {t.distanciaKm != null && (
                        <p style={{ color:"#059669", fontSize:"12px", fontWeight:700, marginTop:"3px" }}>
                          {textoDistancia(t.distanciaKm)}
                        </p>
                      )}
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

            {/* Paginación. Antes no existía: la pantalla mostraba lo que
                cupiera en una sola descarga y el resto del directorio era
                inalcanzable. */}
            {cursor && (
              <button onClick={verMas} disabled={masLoading}
                style={{ width:"100%", marginTop:"16px", background:"#fff", color:"#0F172A",
                         border:"1px solid #E2E8F0", borderRadius:"12px", padding:"14px",
                         fontWeight:700, fontSize:"14px", cursor:"pointer",
                         opacity: masLoading ? 0.6 : 1 }}>
                {masLoading ? "Cargando…" : "Ver más técnicos"}
              </button>
            )}
          </>
        )}

        {error && (
          <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"12px",
                        padding:"12px 16px", fontSize:"13px", color:"#DC2626", marginTop:"16px" }}>
            {error}
          </div>
        )}
      </div>
      <Footer nav={nav} />
    </div>
  );
}
