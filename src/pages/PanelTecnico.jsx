// ─── PANEL DEL TÉCNICO — Dashboard operativo con IA ──────────────────────
import { useState, useEffect }   from "react";
import { obtenerTecnico, obtenerTrabajosDelTecnico, cerrarSesion } from "../lib/firebase.js";
import { sugerirRespuesta }      from "../lib/gemini.js";

const fmt = n => `$${(n||0).toLocaleString("es-MX", { minimumFractionDigits:0 })}`;

const s = {
  page:   { minHeight:"100vh", background:"#F4F5F7" },
  header: { background:"#1E2A3B", color:"#fff", padding:"0 20px", height:"56px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  logo:   { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 10px", borderRadius:"8px" },
  banner: { background:"#FFFBEB", borderBottom:"1px solid #FDE68A", padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"10px", flexWrap:"wrap" },
  wrap:   { maxWidth:"960px", margin:"0 auto", padding:"20px" },
  card:   { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"20px" },
  metric: { background:"#F9FAFB", borderRadius:"12px", padding:"14px", textAlign:"center" },
  tab:    active => ({ flex:1, padding:"9px", background: active ? "#1E2A3B" : "transparent", color: active ? "#fff" : "#6B7280", border:"none", borderRadius:"10px", fontSize:"12px", fontWeight:700, whiteSpace:"nowrap" }),
  btn:    { background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"9px 16px", fontSize:"13px", fontWeight:700 },
  btnSm:  { background:"#D97706", color:"#fff", border:"none", borderRadius:"8px", padding:"6px 12px", fontSize:"12px", fontWeight:700 },
  btnGh:  { background:"#fff", color:"#374151", border:"1px solid #D1D5DB", borderRadius:"8px", padding:"6px 12px", fontSize:"12px", fontWeight:600 },
};

export default function PanelTecnico({ nav, user }) {
  const [tecnico,  setTecnico]  = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [tab,      setTab]      = useState("inicio");
  const [aiResp,   setAiResp]   = useState("");
  const [aiLoading,setAiLoading]= useState(false);
  const [solicitudDemo, setSolicitudDemo] = useState("Necesito instalar un foco nuevo en la cocina, ¿puede venir mañana?");

  useEffect(() => {
    if (!user) { nav("login"); return; }
    obtenerTecnico(user.uid).then(setTecnico);
    obtenerTrabajosDelTecnico(user.uid).then(setTrabajos);
  }, [user]);

  const generarRespuestaIA = async () => {
    if (!tecnico) return;
    setAiLoading(true);
    try {
      const resp = await sugerirRespuesta(solicitudDemo, tecnico);
      setAiResp(resp);
    } finally {
      setAiLoading(false);
    }
  };

  const logout = async () => { await cerrarSesion(); nav("landing"); };

  const esPro = tecnico?.plan === "pro";
  const stats = {
    trabajos:   trabajos.length,
    completados:trabajos.filter(t => t.estado === "terminado" || t.estado === "validado").length,
    pendientes: trabajos.filter(t => t.estado === "pendiente" || t.estado === "aceptado").length,
    ingresos:   trabajos.filter(t => t.estado === "validado").reduce((s,t) => s + (t.costoTotal||0), 0),
  };

  if (!tecnico) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:"36px", height:"36px", border:"3px solid #D97706", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={s.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* HEADER */}
      <div style={s.header}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
          <span style={s.logo}>OFICIO</span>
          <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Mi panel</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
            <div style={{ width:"6px", height:"6px", background:"#22c55e", borderRadius:"50%" }} />
            <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"12px" }}>{tecnico.nombre}</span>
          </div>
          <button onClick={logout} style={{ ...s.btnGh, background:"transparent", borderColor:"rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.5)" }}>
            Salir
          </button>
        </div>
      </div>

      {/* BANNER PRO */}
      {!esPro && (
        <div style={s.banner}>
          <p style={{ fontSize:"13px", color:"#92400E" }}>
            <b>Plan gratuito activo.</b> Actualiza a <b>Pro por $100 MXN/mes</b> → apareces primero en búsquedas + sin anuncios + estadísticas completas
          </p>
          <button style={s.btnSm} onClick={() => nav("pricing")}>Ver Plan Pro →</button>
        </div>
      )}

      <div style={s.wrap}>
        {/* TABS */}
        <div style={{ display:"flex", gap:"4px", background:"#fff", padding:"4px", borderRadius:"14px", border:"1px solid #E5E7EB", marginBottom:"20px", overflowX:"auto" }}>
          {["inicio","trabajos","ia-herramientas","configurar"].map(t => (
            <button key={t} style={s.tab(tab===t)} onClick={() => setTab(t)}>
              {t === "ia-herramientas" ? "✨ IA" : t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* TAB: INICIO */}
        {tab === "inicio" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
              {[
                { l:"Total trabajos",     v: stats.trabajos,   icon:"🔧" },
                { l:"Completados",        v: stats.completados, icon:"✅" },
                { l:"En proceso",         v: stats.pendientes,  icon:"⏳" },
                { l:"Ingresos registrados",v: fmt(stats.ingresos), icon:"💰" },
              ].map(st => (
                <div key={st.l} style={s.metric}>
                  <div style={{ fontSize:"22px", marginBottom:"6px" }}>{st.icon}</div>
                  <div style={{ fontSize:"20px", fontWeight:800, color:"#D97706" }}>{st.v}</div>
                  <div style={{ fontSize:"11px", color:"#6B7280", marginTop:"2px" }}>{st.l}</div>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                <h3 style={{ fontWeight:700, fontSize:"15px" }}>Solicitudes recientes</h3>
                <button style={s.btnSm} onClick={() => nav("registrarTrabajo")}>+ Registrar trabajo</button>
              </div>
              {[
                { cliente:"Roberto G.", servicio:"Instalación eléctrica", ciudad:"Benito Juárez", hora:"Hace 20 min", nuevo:true },
                { cliente:"María T.",   servicio:"Revisión tablero",      ciudad:"Coyoacán",     hora:"Hace 1 hr",  nuevo:true },
                { cliente:"Luis P.",    servicio:"Panel 200A",            ciudad:"Tlalpan",      hora:"Hace 3 hrs", nuevo:false },
              ].map((r, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px", background: r.nuevo ? "#FFFBEB" : "#F9FAFB", borderRadius:"10px", border:`1px solid ${r.nuevo ? "#FDE68A" : "#E5E7EB"}`, marginBottom: i<2 ? "8px" : 0 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"3px" }}>
                      <span style={{ fontWeight:700, fontSize:"13px" }}>{r.cliente}</span>
                      {r.nuevo && <span style={{ background:"#D97706", color:"#fff", fontSize:"9px", fontWeight:800, padding:"2px 7px", borderRadius:"20px" }}>NUEVO</span>}
                    </div>
                    <p style={{ color:"#6B7280", fontSize:"12px" }}>{r.servicio} · 📍 {r.ciudad} · {r.hora}</p>
                  </div>
                  <button style={s.btnSm}>Responder</button>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <h3 style={{ fontWeight:700, fontSize:"15px" }}>Posición en búsquedas</h3>
                  <p style={{ color:"#6B7280", fontSize:"12px", marginTop:"3px" }}>"{tecnico.oficio}" en {tecnico.ciudad}</p>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"40px", fontWeight:900, color:"#D97706" }}>#8</div>
                  {!esPro && <button onClick={() => nav("pricing")} style={{ color:"#1D4ED8", background:"none", border:"none", fontSize:"11px", fontWeight:700 }}>Subir al #1 con Pro →</button>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: TRABAJOS */}
        {tab === "trabajos" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"4px" }}>
              <button style={s.btn} onClick={() => nav("registrarTrabajo")}>+ Documentar trabajo</button>
            </div>
            {trabajos.length === 0 ? (
              <div style={{ ...s.card, textAlign:"center", padding:"48px 24px" }}>
                <div style={{ fontSize:"40px", marginBottom:"12px" }}>🔧</div>
                <p style={{ fontWeight:700, marginBottom:"6px" }}>Sin trabajos registrados</p>
                <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"16px" }}>Documenta tus trabajos para construir tu reputación</p>
                <button style={s.btn} onClick={() => nav("registrarTrabajo")}>Documentar mi primer trabajo</button>
              </div>
            ) : trabajos.map(t => (
              <div key={t.id} style={s.card}>
                <p style={{ fontWeight:700, fontSize:"14px", marginBottom:"4px" }}>{t.titulo}</p>
                <p style={{ color:"#6B7280", fontSize:"12px" }}>{t.tipo} · {t.estado} · {t.ciudad}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB: IA HERRAMIENTAS */}
        {tab === "ia-herramientas" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            <div style={{ background:"#FEF3C7", border:"1px solid #FDE68A", borderRadius:"12px", padding:"14px", display:"flex", gap:"10px", alignItems:"flex-start" }}>
              <span style={{ fontSize:"20px" }}>✨</span>
              <div>
                <p style={{ fontWeight:700, fontSize:"13px", marginBottom:"3px" }}>Herramientas con Gemini IA</p>
                <p style={{ color:"#92400E", fontSize:"12px" }}>Estas funciones usan la API de Gemini (Google) para ayudarte a trabajar mejor. {!esPro && "Algunas son solo para Plan Pro."}</p>
              </div>
            </div>

            {/* Respuesta a clientes */}
            <div style={s.card}>
              <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"4px" }}>💬 Responder solicitudes</h3>
              <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"14px" }}>Gemini te ayuda a responder clientes de forma profesional</p>
              <div style={{ marginBottom:"10px" }}>
                <label style={{ fontSize:"11px", fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", display:"block", marginBottom:"5px" }}>Solicitud del cliente</label>
                <textarea value={solicitudDemo} onChange={e => setSolicitudDemo(e.target.value)} style={{ width:"100%", border:"1px solid #D1D5DB", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", outline:"none", resize:"vertical", minHeight:"70px", background:"#F9FAFB" }} />
              </div>
              <button style={s.btn} onClick={generarRespuestaIA} disabled={aiLoading}>
                {aiLoading ? "Gemini escribiendo..." : "✨ Generar respuesta con Gemini"}
              </button>
              {aiResp && (
                <div style={{ marginTop:"12px", background:"#F0FDF4", border:"1px solid #A7F3D0", borderRadius:"10px", padding:"14px" }}>
                  <p style={{ fontSize:"11px", fontWeight:700, color:"#059669", marginBottom:"8px" }}>RESPUESTA SUGERIDA POR GEMINI</p>
                  <p style={{ fontSize:"13px", color:"#111827", lineHeight:"1.6" }}>{aiResp}</p>
                  <button style={{ ...s.btnSm, background:"#059669", marginTop:"10px" }}
                    onClick={() => navigator.clipboard?.writeText(aiResp)}>
                    Copiar texto
                  </button>
                </div>
              )}
            </div>

            {/* Más herramientas */}
            {[
              { icon:"👤", title:"Mejorar mi perfil", desc:"Gemini mejora la descripción de tu perfil para que más clientes te contraten.", pro:false, action: () => nav("registro", { paso:2 }) },
              { icon:"📄", title:"Generar cotización", desc:"Describe el trabajo y Gemini redacta una cotización profesional para enviarle al cliente.", pro:true  },
              { icon:"📊", title:"Análisis de mercado", desc:"Ve qué servicios tienen más demanda en tu ciudad esta semana.", pro:true  },
            ].map(h => (
              <div key={h.title} style={{ ...s.card, display:"flex", gap:"14px", alignItems:"flex-start", opacity: h.pro && !esPro ? 0.6 : 1 }}>
                <span style={{ fontSize:"24px" }}>{h.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"4px" }}>
                    <p style={{ fontWeight:700, fontSize:"14px" }}>{h.title}</p>
                    {h.pro && <span style={{ background:"#FEF3C7", color:"#92400E", fontSize:"10px", fontWeight:700, padding:"2px 7px", borderRadius:"6px" }}>PRO</span>}
                  </div>
                  <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:h.pro && !esPro ? "8px" : 0 }}>{h.desc}</p>
                  {h.pro && !esPro && <button style={{ ...s.btnSm, background:"#fff", color:"#D97706", border:"1px solid #D97706" }} onClick={() => nav("pricing")}>Requiere Plan Pro →</button>}
                  {(!h.pro || esPro) && h.action && <button style={{ ...s.btnSm, marginTop:"8px" }} onClick={h.action}>Usar →</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: CONFIGURAR */}
        {tab === "configurar" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div style={s.card}>
              <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"14px" }}>Mi información</h3>
              {[
                ["Nombre",       tecnico.nombre],
                ["Oficio",       tecnico.oficio],
                ["Ciudad",       tecnico.ciudad],
                ["Experiencia",  `${tecnico.experiencia} años`],
                ["Plan actual",  esPro ? "Pro ⚡" : "Gratuito"],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #F3F4F6" }}>
                  <span style={{ color:"#6B7280", fontSize:"13px" }}>{k}</span>
                  <span style={{ fontWeight:600, fontSize:"13px" }}>{v}</span>
                </div>
              ))}
              <button style={{ ...s.btn, marginTop:"14px" }}>Editar perfil</button>
            </div>
            {!esPro && (
              <div style={{ background:"#FEF3C7", border:"1px solid #D97706", borderRadius:"16px", padding:"20px", textAlign:"center" }}>
                <p style={{ fontWeight:800, fontSize:"16px", marginBottom:"6px" }}>Actualiza a Plan Pro</p>
                <p style={{ color:"#92400E", fontSize:"13px", marginBottom:"16px" }}>$100 MXN/mes · Aparece primero · Sin anuncios · Herramientas IA completas</p>
                <button style={{ ...s.btn, fontSize:"14px", padding:"12px 24px" }} onClick={() => nav("pricing")}>
                  Activar Plan Pro →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
