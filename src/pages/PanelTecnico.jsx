import { useState, useEffect } from "react";
import { obtenerTecnico, obtenerTrabajosDelTecnico, cerrarSesion } from "../lib/firebase.js";
import { sugerirRespuesta } from "../lib/gemini.js";

const fmt = n => `$${(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 0 })}`;

const s = {
  page:   { minHeight:"100vh", background:"#F4F5F7" },
  header: { background:"#1E2A3B", color:"#fff", padding:"0 20px", height:"56px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  logo:   { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 12px", borderRadius:"8px", letterSpacing:"0.05em" },
  banner: { background:"#FFFBEB", borderBottom:"1px solid #FDE68A", padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"10px", flexWrap:"wrap" },
  wrap:   { maxWidth:"960px", margin:"0 auto", padding:"20px" },
  card:   { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"20px" },
  metric: { background:"#F9FAFB", borderRadius:"12px", padding:"14px", textAlign:"center" },
  tab:    active => ({ flex:1, padding:"9px 6px", background: active ? "#1E2A3B" : "transparent", color: active ? "#fff" : "#6B7280", border:"none", borderRadius:"10px", fontSize:"12px", fontWeight:700, whiteSpace:"nowrap", cursor:"pointer" }),
  btn:    { background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"9px 16px", fontSize:"13px", fontWeight:700, cursor:"pointer" },
  btnSm:  { background:"#D97706", color:"#fff", border:"none", borderRadius:"8px", padding:"6px 12px", fontSize:"12px", fontWeight:700, cursor:"pointer" },
  btnGh:  { background:"transparent", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"8px", padding:"6px 12px", fontSize:"12px", fontWeight:600, cursor:"pointer" },
};

export default function PanelTecnico({ nav, user }) {
  const [tecnico,       setTecnico]       = useState(null);
  const [trabajos,      setTrabajos]      = useState([]);
  const [tab,           setTab]           = useState("inicio");
  const [loadingData,   setLoadingData]   = useState(true);
  const [noProfile,     setNoProfile]     = useState(false);
  const [aiResp,        setAiResp]        = useState("");
  const [aiLoading,     setAiLoading]     = useState(false);
  const [solicitudDemo, setSolicitudDemo] = useState("Necesito instalar un foco nuevo en la cocina, ¿puede venir mañana?");

  useEffect(() => {
    if (!user) { nav("login"); return; }
    const cargar = async () => {
      try {
        const t = await obtenerTecnico(user.uid);
        if (!t) {
          setNoProfile(true);
          setLoadingData(false);
          return;
        }
        setTecnico(t);
        const tr = await obtenerTrabajosDelTecnico(user.uid).catch(() => []);
        setTrabajos(tr);
      } catch (err) {
        console.error("Error al cargar panel:", err);
        setNoProfile(true);
      } finally {
        setLoadingData(false);
      }
    };
    cargar();
  }, [user]);

  const logout = async () => { await cerrarSesion(); nav("landing"); };

  const generarRespuestaIA = async () => {
    if (!tecnico) return;
    setAiLoading(true);
    try {
      const resp = await sugerirRespuesta(solicitudDemo, tecnico);
      setAiResp(resp);
    } catch (err) {
      setAiResp("Error al conectar con Gemini. Verifica tu API key en config.js.");
    } finally {
      setAiLoading(false);
    }
  };

  const esPro = tecnico?.plan === "pro";

  const stats = {
    trabajos:    trabajos.length,
    completados: trabajos.filter(t => t.estado === "terminado" || t.estado === "validado").length,
    pendientes:  trabajos.filter(t => t.estado === "pendiente" || t.estado === "aceptado" || t.estado === "proceso").length,
    ingresos:    trabajos.filter(t => t.estado === "validado").reduce((s, t) => s + (t.costoTotal || 0), 0),
  };

  if (loadingData) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F4F5F7" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:"36px", height:"36px", border:"3px solid #D97706", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:"#6B7280", fontSize:"14px" }}>Cargando panel...</p>
      </div>
    </div>
  );

  if (noProfile) return (
    <div style={{ minHeight:"100vh", background:"#F4F5F7", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ background:"#fff", borderRadius:"20px", padding:"40px", maxWidth:"400px", textAlign:"center", border:"1px solid #E5E7EB" }}>
        <div style={{ fontSize:"48px", marginBottom:"16px" }}>👤</div>
        <h2 style={{ fontWeight:800, fontSize:"20px", marginBottom:"8px" }}>Perfil no encontrado</h2>
        <p style={{ color:"#6B7280", fontSize:"14px", marginBottom:"24px" }}>No encontramos tu perfil técnico. Puede que tu registro no se completó.</p>
        <button style={{ ...s.btn, width:"100%", marginBottom:"10px" }} onClick={() => nav("registro")}>Completar registro</button>
        <button style={{ background:"none", border:"none", color:"#6B7280", fontSize:"13px", cursor:"pointer" }} onClick={logout}>Cerrar sesión</button>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* HEADER */}
      <div style={s.header}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
          <span style={s.logo}>HABILIS</span>
          <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"13px" }}>Mi panel</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
            <div style={{ width:"6px", height:"6px", background:"#22c55e", borderRadius:"50%" }} />
            <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"12px" }}>{tecnico.nombre?.split(" ")[0]}</span>
          </div>
          <button onClick={() => nav("landing")} style={{ ...s.btnGh, fontSize:"11px" }}>Inicio</button>
          <button onClick={logout} style={s.btnGh}>Salir</button>
        </div>
      </div>

      {/* BANNER PRO */}
      {!esPro && (
        <div style={s.banner}>
          <p style={{ fontSize:"13px", color:"#92400E" }}>
            <b>Plan gratuito activo.</b> Actualiza a <b>Pro por $100 MXN/mes</b> → apareces primero en búsquedas + sin anuncios + IA completa
          </p>
          <button style={s.btnSm} onClick={() => nav("precios")}>Ver Plan Pro →</button>
        </div>
      )}

      <div style={s.wrap}>
        {/* TABS */}
        <div style={{ display:"flex", gap:"4px", background:"#fff", padding:"4px", borderRadius:"14px", border:"1px solid #E5E7EB", marginBottom:"20px", overflowX:"auto" }}>
          {[
            { id:"inicio",    label:"Inicio" },
            { id:"trabajos",  label:"Trabajos" },
            { id:"ia",        label:"✨ IA" },
            { id:"config",    label:"Configurar" },
          ].map(t => (
            <button key={t.id} style={s.tab(tab === t.id)} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: INICIO */}
        {tab === "inicio" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"12px" }}>
              {[
                { l:"Total trabajos",       v: stats.trabajos,               icon:"🔧" },
                { l:"Completados",           v: stats.completados,            icon:"✅" },
                { l:"En proceso",            v: stats.pendientes,             icon:"⏳" },
                { l:"Ingresos registrados",  v: fmt(stats.ingresos),          icon:"💰" },
              ].map(st => (
                <div key={st.l} style={s.metric}>
                  <div style={{ fontSize:"22px", marginBottom:"6px" }}>{st.icon}</div>
                  <div style={{ fontSize:"22px", fontWeight:800, color:"#D97706" }}>{st.v}</div>
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
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px", background: r.nuevo ? "#FFFBEB" : "#F9FAFB", borderRadius:"10px", border:`1px solid ${r.nuevo ? "#FDE68A" : "#E5E7EB"}`, marginBottom: i < 2 ? "8px" : 0 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"3px" }}>
                      <span style={{ fontWeight:700, fontSize:"13px" }}>{r.cliente}</span>
                      {r.nuevo && <span style={{ background:"#D97706", color:"#fff", fontSize:"9px", fontWeight:800, padding:"2px 7px", borderRadius:"20px" }}>NUEVO</span>}
                    </div>
                    <p style={{ color:"#6B7280", fontSize:"12px" }}>{r.servicio} · 📍 {r.ciudad} · {r.hora}</p>
                  </div>
                  <button style={s.btnSm} onClick={() => setTab("ia")}>Responder</button>
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
                  <div style={{ fontSize:"40px", fontWeight:900, color:"#D97706" }}>#{esPro ? "1" : "8"}</div>
                  {!esPro && <button onClick={() => nav("precios")} style={{ color:"#1D4ED8", background:"none", border:"none", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>Subir al #1 con Pro →</button>}
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
                <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"20px" }}>Documenta tus trabajos para construir tu reputación profesional</p>
                <button style={s.btn} onClick={() => nav("registrarTrabajo")}>Documentar mi primer trabajo</button>
              </div>
            ) : trabajos.map(t => (
              <div key={t.id} style={s.card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ fontWeight:700, fontSize:"14px", marginBottom:"4px" }}>{t.titulo}</p>
                    <p style={{ color:"#6B7280", fontSize:"12px" }}>
                      {t.tipo} · 📍 {t.ciudad || "Sin ciudad"} · ⏱ {t.tiempoHoras || 0}h
                    </p>
                  </div>
                  <span style={{
                    background: t.estado === "validado" ? "#D1FAE5" : t.estado === "terminado" ? "#DBEAFE" : "#FEF3C7",
                    color: t.estado === "validado" ? "#059669" : t.estado === "terminado" ? "#1D4ED8" : "#92400E",
                    fontSize:"11px", fontWeight:700, padding:"3px 8px", borderRadius:"6px"
                  }}>
                    {t.estado}
                  </span>
                </div>
                {t.descripcion && <p style={{ color:"#4B5563", fontSize:"12px", marginTop:"8px", lineHeight:1.5 }}>{t.descripcion.slice(0, 100)}{t.descripcion.length > 100 ? "..." : ""}</p>}
              </div>
            ))}
          </div>
        )}

        {/* TAB: IA HERRAMIENTAS */}
        {tab === "ia" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            <div style={{ background:"#FEF3C7", border:"1px solid #FDE68A", borderRadius:"12px", padding:"14px", display:"flex", gap:"10px", alignItems:"flex-start" }}>
              <span style={{ fontSize:"20px" }}>✨</span>
              <div>
                <p style={{ fontWeight:700, fontSize:"13px", marginBottom:"3px" }}>Herramientas con Gemini IA</p>
                <p style={{ color:"#92400E", fontSize:"12px" }}>Estas funciones usan la API de Gemini (Google) para ayudarte a trabajar mejor.{!esPro && " Algunas son solo para Plan Pro."}</p>
              </div>
            </div>

            {/* Respuesta a clientes */}
            <div style={s.card}>
              <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"4px" }}>💬 Responder solicitudes</h3>
              <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"14px" }}>Gemini te ayuda a responder clientes de forma profesional</p>
              <div style={{ marginBottom:"10px" }}>
                <label style={{ fontSize:"11px", fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", display:"block", marginBottom:"5px" }}>Solicitud del cliente</label>
                <textarea
                  value={solicitudDemo}
                  onChange={e => setSolicitudDemo(e.target.value)}
                  style={{ width:"100%", border:"1px solid #D1D5DB", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", outline:"none", resize:"vertical", minHeight:"70px", background:"#F9FAFB", boxSizing:"border-box" }}
                />
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

            {/* Otras herramientas */}
            {[
              { icon:"👤", title:"Mejorar mi perfil",  desc:"Gemini mejora la descripción de tu perfil para que más clientes te contraten.", pro:false },
              { icon:"📄", title:"Generar cotización", desc:"Describe el trabajo y Gemini redacta una cotización profesional para el cliente.", pro:true },
              { icon:"📊", title:"Análisis de mercado",desc:"Ve qué servicios tienen más demanda en tu ciudad esta semana.", pro:true },
            ].map(h => (
              <div key={h.title} style={{ ...s.card, display:"flex", gap:"14px", alignItems:"flex-start", opacity: h.pro && !esPro ? 0.65 : 1 }}>
                <span style={{ fontSize:"24px" }}>{h.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"4px" }}>
                    <p style={{ fontWeight:700, fontSize:"14px" }}>{h.title}</p>
                    {h.pro && <span style={{ background:"#FEF3C7", color:"#92400E", fontSize:"10px", fontWeight:700, padding:"2px 7px", borderRadius:"6px" }}>PRO</span>}
                  </div>
                  <p style={{ color:"#6B7280", fontSize:"13px", marginBottom: h.pro && !esPro ? "8px" : 0 }}>{h.desc}</p>
                  {h.pro && !esPro && (
                    <button style={{ ...s.btnSm, background:"#fff", color:"#D97706", border:"1px solid #D97706" }} onClick={() => nav("precios")}>
                      Requiere Plan Pro →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: CONFIGURAR */}
        {tab === "config" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div style={s.card}>
              <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"16px" }}>Mi información</h3>
              {[
                ["Nombre",       tecnico.nombre],
                ["Oficio",       tecnico.oficio],
                ["Ciudad",       tecnico.ciudad],
                ["Experiencia",  `${tecnico.experiencia} años`],
                ["Plan actual",  esPro ? "⚡ Pro" : "Gratuito"],
                ["Rating",       tecnico.rating ? `⭐ ${tecnico.rating}` : "Sin calificaciones aún"],
              ].map(([k, v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #F3F4F6" }}>
                  <span style={{ color:"#6B7280", fontSize:"13px" }}>{k}</span>
                  <span style={{ fontWeight:600, fontSize:"13px" }}>{v}</span>
                </div>
              ))}
              <button style={{ ...s.btn, marginTop:"16px", width:"100%" }} onClick={() => alert("Edición de perfil próximamente")}>
                Editar perfil
              </button>
            </div>

            <div style={s.card}>
              <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"10px" }}>Mi perfil público</h3>
              <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"14px" }}>Así ven tu perfil los clientes al buscarte.</p>
              <button style={{ ...s.btn, background:"#1E2A3B" }} onClick={() => nav("perfil", { tecnicoId: user?.uid })}>
                Ver mi perfil público →
              </button>
            </div>

            {!esPro && (
              <div style={{ background:"#FEF3C7", border:"1px solid #D97706", borderRadius:"16px", padding:"24px", textAlign:"center" }}>
                <p style={{ fontWeight:900, fontSize:"18px", marginBottom:"6px" }}>Actualiza a Plan Pro ⚡</p>
                <p style={{ color:"#92400E", fontSize:"14px", marginBottom:"20px" }}>$100 MXN/mes · Aparece primero · Sin anuncios · IA completa</p>
                <button style={{ ...s.btn, fontSize:"15px", padding:"13px 28px" }} onClick={() => nav("precios")}>
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
