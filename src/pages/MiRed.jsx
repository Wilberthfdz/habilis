import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import { obtenerColaboradores, buscarTecnicos, crearSolicitudChat, obtenerTecnico } from "../lib/firebase.js";
import { sugerirColaboradores } from "../lib/gemini.js";

const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px",
               padding:"16px 18px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };

export default function MiRed({ nav, user }) {
  const [red,         setRed]         = useState([]);
  const [sugeridos,   setSugeridos]   = useState([]);
  const [todosLos,    setTodosLos]    = useState([]);
  const [tecnico,     setTecnico]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [cargandoAI,  setCargandoAI]  = useState(false);
  const [refiriendo,  setRefiriendo]  = useState(null);
  const [referidoOk,  setReferidoOk]  = useState(null);

  useEffect(() => {
    if (!user) { nav("login"); return; }
    cargar();
  }, [user]);

  const cargar = async () => {
    setLoading(true);
    try {
      const [colaboradores, todos, t] = await Promise.all([
        obtenerColaboradores(user.uid),
        buscarTecnicos({}),
        obtenerTecnico(user.uid),
      ]);
      setRed(colaboradores);
      setTodosLos(todos);
      setTecnico(t);
    } finally { setLoading(false); }
  };

  const pedirSugerencias = async () => {
    if (!tecnico) return;
    setCargandoAI(true);
    try {
      // Exclude already in network
      const redIds = new Set(red.map(c => c.tecnicoId));
      const disponibles = todosLos.filter(t => t.id !== user.uid && !redIds.has(t.id));
      const sug = await sugerirColaboradores(tecnico.oficio, tecnico.ciudad, disponibles);
      // Map names back to tecnico objects
      const sugObjs = disponibles.filter(t =>
        sug.sugeridos?.some(nombre => t.nombre?.toLowerCase().includes(nombre.toLowerCase()))
      ).slice(0, 5);
      setSugeridos(sugObjs);
    } finally { setCargandoAI(false); }
  };

  const referirTrabajo = async (colaborador) => {
    if (!user) return;
    setRefiriendo(colaborador.tecnicoId);
    try {
      await crearSolicitudChat({
        clienteId:    user.uid,
        clienteNombre:tecnico?.nombre || user.email,
        tecnicoId:    colaborador.tecnicoId,
        tecnicoNombre:colaborador.tecnicoNombre || colaborador.nombre,
        descripcion:  "Referido desde mi red de colaboradores de Habilis.",
        urgencia:     "Normal",
        presupuesto:  "",
      });
      setReferidoOk(colaborador.tecnicoId);
    } finally { setRefiriendo(null); }
  };

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO */}
      <div style={{ background:"#0F172A", padding:"32px 20px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"400px", height:"400px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.14) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"860px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <button onClick={() => nav("panel")}
            style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", fontSize:"13px",
                     fontWeight:600, cursor:"pointer", marginBottom:"10px", padding:0 }}>
            ← Mi Panel
          </button>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end",
                        flexWrap:"wrap", gap:"12px" }}>
            <div>
              <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                          letterSpacing:"0.1em", marginBottom:"6px" }}>🤝 Habilis Network</p>
              <h1 style={{ fontSize:"clamp(20px,4vw,32px)", fontWeight:900, color:"#fff", marginBottom:"4px" }}>
                Mi red de colaboradores
              </h1>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
                {red.length} técnico{red.length !== 1 ? "s" : ""} en tu red
              </p>
            </div>
            <button onClick={pedirSugerencias} disabled={cargandoAI}
              style={{ background:"rgba(249,115,22,0.15)", color:"#F97316",
                       border:"1px solid rgba(249,115,22,0.3)", borderRadius:"10px",
                       padding:"9px 18px", fontWeight:700, fontSize:"13px",
                       cursor:"pointer", opacity: cargandoAI ? 0.7 : 1 }}>
              {cargandoAI ? "✨ Analizando..." : "✨ Sugerir con Gemini"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"860px", margin:"0 auto", padding:"20px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px" }}>
            <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                          borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
            <p style={{ color:"#64748B" }}>Cargando tu red...</p>
          </div>
        ) : (
          <>
            {/* Gemini suggestions */}
            {sugeridos.length > 0 && (
              <div style={{ background:"#FFF7ED", border:"1px solid rgba(249,115,22,0.25)",
                            borderRadius:"14px", padding:"16px 18px", marginBottom:"20px" }}>
                <p style={{ fontWeight:700, fontSize:"13px", color:"#EA580C", marginBottom:"12px" }}>
                  ✨ Gemini sugiere estos colaboradores para ti
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"10px" }}>
                  {sugeridos.map(t => (
                    <div key={t.id} style={{ background:"#fff", borderRadius:"10px", padding:"12px",
                                             border:"1px solid rgba(249,115,22,0.2)" }}>
                      <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                        <Avatar size={36} nombre={t.nombre} fotoUrl={t.fotoUrl} plan={t.plan} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontWeight:700, fontSize:"13px", overflow:"hidden",
                                      textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.nombre}</p>
                          <p style={{ fontSize:"11px", color:"#F97316" }}>{t.oficio}</p>
                        </div>
                      </div>
                      <button onClick={() => nav("perfil", { tecnicoId:t.id })}
                        style={{ marginTop:"8px", width:"100%", background:"#F97316", color:"#fff",
                                 border:"none", borderRadius:"7px", padding:"6px",
                                 fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
                        Ver perfil →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My network */}
            {red.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", ...CARD }}>
                <div style={{ fontSize:"48px", marginBottom:"14px" }}>🤝</div>
                <h2 style={{ fontWeight:900, fontSize:"18px", color:"#0F172A", marginBottom:"8px" }}>
                  Tu red está vacía
                </h2>
                <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"20px" }}>
                  Agrega técnicos a tu red desde sus perfiles. Podrás referirles trabajos y colaborar.
                </p>
                <button onClick={() => nav("buscar")}
                  style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                           padding:"11px 22px", fontWeight:700, cursor:"pointer" }}>
                  Buscar técnicos →
                </button>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"12px" }}>
                {red.map(c => (
                  <div key={c.id} style={CARD}>
                    <div style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"12px" }}>
                      <Avatar size={48} nombre={c.tecnicoNombre || c.nombre} fotoUrl={c.fotoUrl} plan={c.plan} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontWeight:800, fontSize:"14px", color:"#0F172A",
                                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {c.tecnicoNombre || c.nombre}
                        </p>
                        <p style={{ fontSize:"12px", color:"#F97316", fontWeight:600 }}>{c.oficio}</p>
                        <p style={{ fontSize:"11px", color:"#94A3B8" }}>📍 {c.ciudad}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:"8px" }}>
                      <button onClick={() => nav("perfil", { tecnicoId:c.tecnicoId })}
                        style={{ flex:1, background:"#F1F5F9", color:"#374151", border:"1px solid #E2E8F0",
                                 borderRadius:"8px", padding:"7px", fontSize:"12px",
                                 fontWeight:600, cursor:"pointer" }}>
                        Ver perfil
                      </button>
                      {referidoOk === c.tecnicoId ? (
                        <span style={{ flex:1, background:"#F0FDF4", color:"#059669", borderRadius:"8px",
                                       padding:"7px", fontSize:"12px", fontWeight:700, textAlign:"center" }}>
                          ✓ Referido
                        </span>
                      ) : (
                        <button onClick={() => referirTrabajo(c)}
                          disabled={refiriendo === c.tecnicoId}
                          style={{ flex:1, background:"#F97316", color:"#fff", border:"none",
                                   borderRadius:"8px", padding:"7px", fontSize:"12px",
                                   fontWeight:700, cursor:"pointer", opacity:refiriendo===c.tecnicoId?0.7:1 }}>
                          {refiriendo===c.tecnicoId ? "..." : "🔗 Referir trabajo"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
