import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";
import { obtenerTecnico, obtenerTrabajosDelTecnico, cerrarSesion, subirFotoPerfil } from "../lib/firebase.js";
import Avatar from "../components/Avatar.jsx";
import { sugerirRespuesta } from "../lib/gemini.js";

const fmt = n => `$${(n||0).toLocaleString("es-MX")}`;
const initials = n => ((n||"").trim().charAt(0).toUpperCase()) || "T";

const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
               padding:"20px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };
const BTN  = { background:"#F97316", color:"#fff", border:"none", borderRadius:"9px",
               padding:"9px 16px", fontSize:"13px", fontWeight:700, cursor:"pointer" };
const BTN_SM = { background:"#F97316", color:"#fff", border:"none", borderRadius:"8px",
                 padding:"6px 12px", fontSize:"12px", fontWeight:700, cursor:"pointer" };

export default function PanelTecnico({ nav, user }) {
  const [tecnico,       setTecnico]       = useState(null);
  const [trabajos,      setTrabajos]      = useState([]);
  const [tab,           setTab]           = useState("inicio");
  const [loadingData,   setLoadingData]   = useState(true);
  const [noProfile,     setNoProfile]     = useState(false);
  const [aiResp,        setAiResp]        = useState("");
  const [aiLoading,     setAiLoading]     = useState(false);
  const [solicitudDemo, setSolicitudDemo] = useState("Necesito instalar un foco nuevo en la cocina, ¿puede venir mañana?");
  const [uploadingPhoto,setUploadingPhoto]= useState(false);
  const [photoError,    setPhotoError]    = useState("");

  useEffect(() => {
    if (!user) { nav("login"); return; }
    (async () => {
      try {
        const t = await obtenerTecnico(user.uid);
        if (!t) { setNoProfile(true); setLoadingData(false); return; }
        setTecnico(t);
        const tr = await obtenerTrabajosDelTecnico(user.uid).catch(() => []);
        setTrabajos(tr);
      } catch { setNoProfile(true); }
      finally { setLoadingData(false); }
    })();
  }, [user]);

  const logout = async () => { await cerrarSesion(); nav("landing"); };

  const handleFotoChange = async e => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setPhotoError(""); setUploadingPhoto(true);
    try {
      // Compress to max 400px before uploading
      const compressed = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = ev => {
          const img = new Image();
          img.onload = () => {
            // 200×200 max + quality 0.65 keeps base64 well under Firestore's 1 MB doc limit
            const MAX = 200;
            let w = img.width, h = img.height;
            if (w > MAX || h > MAX) {
              if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
              else { w = Math.round(w * MAX / h); h = MAX; }
            }
            const canvas = document.createElement("canvas");
            canvas.width = w; canvas.height = h;
            canvas.getContext("2d").drawImage(img, 0, 0, w, h);
            canvas.toBlob(b => resolve(b), "image/jpeg", 0.65);
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
      const url = await subirFotoPerfil(user.uid, compressed);
      setTecnico(t => ({ ...t, fotoUrl: url }));
    } catch (err) {
      console.error(err);
      setPhotoError("Error al subir la foto. Intenta de nuevo.");
    } finally { setUploadingPhoto(false); }
  };

  const genAI = async () => {
    if (!tecnico) return;
    setAiLoading(true);
    try { setAiResp(await sugerirRespuesta(solicitudDemo, tecnico)); }
    catch { setAiResp("Error al conectar con Gemini. Verifica tu API key en config.js."); }
    finally { setAiLoading(false); }
  };

  const esPro = tecnico?.plan === "pro";
  const stats = {
    trabajos:    trabajos.length,
    completados: trabajos.filter(t => ["terminado","validado"].includes(t.estado)).length,
    pendientes:  trabajos.filter(t => ["pendiente","aceptado","proceso"].includes(t.estado)).length,
    ingresos:    trabajos.filter(t => t.estado === "validado").reduce((s,t) => s + (t.costoTotal||0), 0),
  };

  const TAB = id => ({
    flex:1, padding:"9px 6px", border:"none", borderRadius:"9px", fontSize:"12px", fontWeight:700,
    cursor:"pointer", whiteSpace:"nowrap",
    background: tab===id ? "#0F172A" : "transparent",
    color:      tab===id ? "#fff"    : "#64748B",
  });

  if (loadingData) return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                      borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
        <p style={{ color:"#64748B" }}>Cargando tu panel...</p>
      </div>
    </div>
  );

  if (noProfile) return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9", display:"flex", alignItems:"center",
                  justifyContent:"center", padding:"20px" }}>
      <div style={{ ...CARD, maxWidth:"400px", textAlign:"center", padding:"40px" }}>
        <div style={{ fontSize:"52px", marginBottom:"16px" }}>👤</div>
        <h2 style={{ fontWeight:800, fontSize:"20px", marginBottom:"8px" }}>Perfil no encontrado</h2>
        <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"24px" }}>
          No encontramos tu perfil técnico. Puede que tu registro no se completó.
        </p>
        <button style={{ ...BTN, width:"100%", marginBottom:"10px" }} onClick={() => nav("registro")}>
          Completar registro
        </button>
        <button style={{ background:"none", border:"none", color:"#94A3B8", fontSize:"13px", cursor:"pointer" }} onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      {/* NAV */}
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} onLogout={logout} /></div>

      {/* GREETING BANNER */}
      <div style={{ background:"#0F172A", padding:"32px 20px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"400px", height:"400px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.14) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"960px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
              <Avatar size={52} nombre={tecnico.nombre} fotoUrl={tecnico.fotoUrl} plan={tecnico.plan} uploading={uploadingPhoto} />
              <div>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", marginBottom:"3px" }}>Bienvenido de vuelta</p>
                <h1 style={{ fontSize:"clamp(18px,3vw,26px)", fontWeight:900, color:"#fff" }}>
                  {tecnico.nombre?.split(" ")[0]} 👋
                </h1>
                <p style={{ color:"#F97316", fontSize:"13px", fontWeight:600, marginTop:"2px" }}>
                  {tecnico.oficio} · {tecnico.ciudad}
                  {esPro && <span style={{ marginLeft:"8px", background:"rgba(249,115,22,0.2)", border:"1px solid rgba(249,115,22,0.4)", borderRadius:"6px", padding:"1px 7px", fontSize:"10px", fontWeight:800 }}>⚡ PRO</span>}
                </p>
              </div>
            </div>
            {/* Mini stats */}
            <div style={{ display:"flex", gap:"20px", flexWrap:"wrap" }}>
              {[
                ["🔧", stats.trabajos,    "Trabajos"],
                ["✅", stats.completados, "Completados"],
                ["💰", fmt(stats.ingresos),"Ingresos"],
              ].map(([icon, val, label]) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"20px", marginBottom:"2px" }}>{icon}</div>
                  <div style={{ fontWeight:900, fontSize:"18px", color:"#F97316" }}>{val}</div>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {!esPro && (
            <div style={{ marginTop:"16px", background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.25)",
                          borderRadius:"10px", padding:"10px 16px", display:"flex",
                          justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"10px" }}>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.7)" }}>
                Actualiza a <b>Plan Pro por $100 MXN/mes</b> → apareces primero + IA completa + sin anuncios
              </p>
              <button onClick={() => nav("precios")}
                style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"8px",
                         padding:"6px 14px", fontWeight:700, fontSize:"12px", cursor:"pointer", flexShrink:0 }}>
                Ver Plan Pro →
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"20px" }}>
        {/* TABS */}
        <div style={{ display:"flex", gap:"4px", background:"#fff", padding:"4px", borderRadius:"14px",
                      border:"1px solid #E2E8F0", marginBottom:"20px", overflowX:"auto",
                      boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
          {[["inicio","Inicio"],["trabajos","Mis trabajos"],["ia","✨ IA"],["config","Configurar"]].map(([id,label]) => (
            <button key={id} style={TAB(id)} onClick={() => setTab(id)}>{label}</button>
          ))}
          <button style={{ ...TAB(false), color:"#F97316", fontWeight:800 }} onClick={() => nav("habilisCare")}>
            🛡️ Mis equipos
          </button>
        </div>

        {/* ── INICIO ── */}
        {tab === "inicio" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            {/* Quick-access module cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <div style={{ background:"linear-gradient(135deg,#0F172A,#1E293B)", borderRadius:"14px",
                            padding:"16px 18px", cursor:"pointer", boxShadow:"0 4px 12px rgba(15,23,42,0.2)" }}
                   onClick={() => nav("cotizaciones")}>
                <p style={{ fontSize:"22px", marginBottom:"6px" }}>📋</p>
                <p style={{ fontWeight:800, fontSize:"14px", color:"#fff", marginBottom:"2px" }}>Cotizaciones</p>
                <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>Crea cotizaciones profesionales</p>
                <p style={{ fontSize:"12px", color:"#F97316", marginTop:"6px", fontWeight:700 }}>Nueva cotización →</p>
              </div>
              <div style={{ background:"linear-gradient(135deg,#0F172A,#1E293B)", borderRadius:"14px",
                            padding:"16px 18px", cursor:"pointer", boxShadow:"0 4px 12px rgba(15,23,42,0.2)" }}
                   onClick={() => nav("habilisCare")}>
                <p style={{ fontSize:"22px", marginBottom:"6px" }}>🛡️</p>
                <p style={{ fontWeight:800, fontSize:"14px", color:"#fff", marginBottom:"2px" }}>Habilis Care</p>
                <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>Mantenimiento de equipos</p>
                <p style={{ fontSize:"12px", color:"#F97316", marginTop:"6px", fontWeight:700 }}>Ver mis equipos →</p>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"12px" }}>
              {[
                { l:"Total trabajos",       v:stats.trabajos,               icon:"🔧" },
                { l:"Completados",          v:stats.completados,            icon:"✅" },
                { l:"En proceso",           v:stats.pendientes,             icon:"⏳" },
                { l:"Ingresos registrados", v:fmt(stats.ingresos),          icon:"💰" },
              ].map(st => (
                <div key={st.l} style={{ ...CARD, textAlign:"center" }}>
                  <div style={{ fontSize:"24px", marginBottom:"8px" }}>{st.icon}</div>
                  <div style={{ fontSize:"24px", fontWeight:900, color:"#F97316", marginBottom:"3px" }}>{st.v}</div>
                  <div style={{ fontSize:"11px", color:"#94A3B8" }}>{st.l}</div>
                </div>
              ))}
            </div>

            <div style={CARD}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A" }}>Solicitudes recientes</h3>
                <button style={BTN_SM} onClick={() => nav("registrarTrabajo")}>+ Registrar trabajo</button>
              </div>
              {[
                { cliente:"Roberto G.", servicio:"Instalación eléctrica", ciudad:"Benito Juárez", hora:"Hace 20 min", nuevo:true },
                { cliente:"María T.",   servicio:"Revisión tablero",      ciudad:"Coyoacán",     hora:"Hace 1 hr",  nuevo:true },
                { cliente:"Luis P.",    servicio:"Panel 200A",            ciudad:"Tlalpan",      hora:"Hace 3 hrs", nuevo:false },
              ].map((r, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px",
                                      background: r.nuevo ? "#FFF7ED" : "#F8FAFC",
                                      borderRadius:"10px", border:`1px solid ${r.nuevo ? "rgba(249,115,22,0.25)" : "#E2E8F0"}`,
                                      marginBottom: i < 2 ? "8px" : 0 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"3px" }}>
                      <span style={{ fontWeight:700, fontSize:"13px" }}>{r.cliente}</span>
                      {r.nuevo && <span style={{ background:"#F97316", color:"#fff", fontSize:"9px", fontWeight:800, padding:"2px 7px", borderRadius:"20px" }}>NUEVO</span>}
                    </div>
                    <p style={{ color:"#94A3B8", fontSize:"12px" }}>{r.servicio} · 📍 {r.ciudad} · {r.hora}</p>
                  </div>
                  <button style={BTN_SM} onClick={() => setTab("ia")}>Responder</button>
                </div>
              ))}
            </div>

            {/* CTRL+W Integration */}
            <div style={{ background:"#0F172A", borderRadius:"16px", padding:"18px 20px",
                          display:"flex", gap:"14px", alignItems:"center", flexWrap:"wrap",
                          boxShadow:"0 4px 12px rgba(15,23,42,0.15)" }}>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:800, fontSize:"14px", color:"#fff", marginBottom:"3px" }}>
                  💼 Cotizaciones CTRL+W
                </p>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", lineHeight:1.5 }}>
                  Crea cotizaciones profesionales con productos reales y envíalas por WhatsApp al cliente.
                </p>
              </div>
              <button
                onClick={() => window.open("https://ctrlw.mx/cotizacion?action=crear&from=habilis", "_blank", "noopener,noreferrer")}
                style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"9px",
                         padding:"9px 16px", fontWeight:700, fontSize:"13px", cursor:"pointer", flexShrink:0 }}>
                Nueva cotización →
              </button>
            </div>

            <div style={CARD}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A" }}>Posición en búsquedas</h3>
                  <p style={{ color:"#64748B", fontSize:"12px", marginTop:"3px" }}>"{tecnico.oficio}" en {tecnico.ciudad}</p>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"44px", fontWeight:900, color:"#F97316" }}>#{esPro ? "1" : "8"}</div>
                  {!esPro && (
                    <button onClick={() => nav("precios")} style={{ color:"#2563EB", background:"none", border:"none", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
                      Subir al #1 con Pro →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TRABAJOS ── */}
        {tab === "trabajos" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <button style={BTN} onClick={() => nav("registrarTrabajo")}>+ Documentar trabajo</button>
            </div>
            {trabajos.length === 0 ? (
              <div style={{ ...CARD, textAlign:"center", padding:"56px 24px" }}>
                <div style={{ fontSize:"52px", marginBottom:"14px" }}>🔧</div>
                <p style={{ fontWeight:800, fontSize:"18px", marginBottom:"8px" }}>Sin trabajos registrados</p>
                <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"24px" }}>
                  Documenta tus trabajos para construir tu reputación
                </p>
                <button style={BTN} onClick={() => nav("registrarTrabajo")}>Documentar mi primer trabajo</button>
              </div>
            ) : trabajos.map(t => (
              <div key={t.id} style={CARD}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ fontWeight:700, fontSize:"14px", color:"#0F172A", marginBottom:"4px" }}>{t.titulo}</p>
                    <p style={{ color:"#94A3B8", fontSize:"12px" }}>{t.tipo} · 📍 {t.ciudad||"—"} · ⏱ {t.tiempoHoras||0}h</p>
                  </div>
                  <span style={{
                    background: t.estado==="validado" ? "#F0FDF4" : t.estado==="terminado" ? "#EFF6FF" : "#FFF7ED",
                    color:      t.estado==="validado" ? "#059669"  : t.estado==="terminado" ? "#2563EB"  : "#EA580C",
                    fontSize:"11px", fontWeight:700, padding:"3px 9px", borderRadius:"6px",
                  }}>{t.estado}</span>
                </div>
                {t.descripcion && <p style={{ color:"#64748B", fontSize:"12px", marginTop:"8px", lineHeight:1.5 }}>{t.descripcion.slice(0,120)}{t.descripcion.length>120?"...":""}</p>}
              </div>
            ))}
          </div>
        )}

        {/* ── IA ── */}
        {tab === "ia" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            <div style={{ background:"#FFF7ED", border:"1px solid rgba(249,115,22,0.25)", borderRadius:"12px",
                          padding:"14px 18px", display:"flex", gap:"12px", alignItems:"flex-start" }}>
              <span style={{ fontSize:"22px" }}>✨</span>
              <div>
                <p style={{ fontWeight:700, fontSize:"13px", color:"#0F172A", marginBottom:"3px" }}>Herramientas con Gemini IA</p>
                <p style={{ color:"#92400E", fontSize:"12px", lineHeight:1.5 }}>
                  Estas funciones usan la API de Gemini (Google) para ayudarte a trabajar mejor.
                  {!esPro && " Algunas son solo para Plan Pro."}
                </p>
              </div>
            </div>

            <div style={CARD}>
              <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"4px" }}>💬 Responder solicitudes</h3>
              <p style={{ color:"#64748B", fontSize:"13px", marginBottom:"14px" }}>Gemini te ayuda a responder clientes de forma profesional</p>
              <label style={{ fontSize:"11px", fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Solicitud del cliente</label>
              <textarea value={solicitudDemo} onChange={e => setSolicitudDemo(e.target.value)}
                style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px", padding:"10px 14px",
                         fontSize:"13px", outline:"none", resize:"vertical", minHeight:"70px",
                         background:"#F8FAFC", boxSizing:"border-box", marginBottom:"12px" }} />
              <button style={BTN} onClick={genAI} disabled={aiLoading}>
                {aiLoading ? "Gemini escribiendo..." : "✨ Generar respuesta con Gemini"}
              </button>
              {aiResp && (
                <div style={{ marginTop:"14px", background:"#F0FDF4", border:"1px solid #A7F3D0", borderRadius:"12px", padding:"16px" }}>
                  <p style={{ fontSize:"11px", fontWeight:700, color:"#059669", marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Respuesta sugerida por Gemini</p>
                  <p style={{ fontSize:"13px", color:"#111827", lineHeight:"1.65" }}>{aiResp}</p>
                  <button style={{ ...BTN_SM, background:"#059669", marginTop:"10px" }}
                    onClick={() => navigator.clipboard?.writeText(aiResp)}>
                    Copiar texto
                  </button>
                </div>
              )}
            </div>

            {[
              { icon:"👤", title:"Mejorar mi perfil",   desc:"Gemini mejora la descripción de tu perfil para que más clientes te contraten.", pro:false },
              { icon:"📄", title:"Generar cotización",  desc:"Describe el trabajo y Gemini redacta una cotización profesional para el cliente.", pro:true },
              { icon:"📊", title:"Análisis de mercado", desc:"Ve qué servicios tienen más demanda en tu ciudad esta semana.", pro:true },
            ].map(h => (
              <div key={h.title} style={{ ...CARD, display:"flex", gap:"14px", alignItems:"flex-start", opacity: h.pro && !esPro ? 0.6 : 1 }}>
                <span style={{ fontSize:"24px", flexShrink:0 }}>{h.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"4px" }}>
                    <p style={{ fontWeight:700, fontSize:"14px" }}>{h.title}</p>
                    {h.pro && <span style={{ background:"#FFF7ED", color:"#EA580C", fontSize:"10px", fontWeight:700, padding:"2px 7px", borderRadius:"6px" }}>PRO</span>}
                  </div>
                  <p style={{ color:"#64748B", fontSize:"13px", marginBottom: h.pro && !esPro ? "8px" : 0 }}>{h.desc}</p>
                  {h.pro && !esPro && (
                    <button onClick={() => nav("precios")} style={{ ...BTN_SM, background:"#fff", color:"#F97316", border:"1px solid #F97316" }}>
                      Requiere Plan Pro →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CONFIGURAR ── */}
        {tab === "config" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

            {/* ── PHOTO UPLOAD ── */}
            <div style={CARD}>
              <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"16px" }}>Foto de perfil</h3>
              <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
                <div style={{ position:"relative", flexShrink:0 }}>
                  <Avatar size={80} nombre={tecnico.nombre} fotoUrl={tecnico.fotoUrl} plan={tecnico.plan} uploading={uploadingPhoto} />
                  {/* Camera badge */}
                  <label style={{ position:"absolute", bottom:"0", right:"0",
                                   background:"#F97316", border:"2.5px solid #fff", borderRadius:"50%",
                                   width:"28px", height:"28px", display:"flex", alignItems:"center",
                                   justifyContent:"center", cursor:"pointer", fontSize:"13px",
                                   boxShadow:"0 2px 6px rgba(0,0,0,0.18)" }}>
                    📷
                    <input type="file" accept="image/*" capture="environment"
                           style={{ display:"none" }} onChange={handleFotoChange}
                           disabled={uploadingPhoto} />
                  </label>
                </div>
                <div>
                  <p style={{ fontWeight:700, fontSize:"14px", color:"#0F172A", marginBottom:"4px" }}>
                    {tecnico.fotoUrl ? "Cambiar foto" : "Subir foto de perfil"}
                  </p>
                  <p style={{ fontSize:"12px", color:"#94A3B8", lineHeight:1.5, marginBottom:"10px" }}>
                    {uploadingPhoto ? "Subiendo..." : "JPG o PNG · Máx. 400×400px · Se comprime automáticamente"}
                  </p>
                  <label style={{ background:"#F1F5F9", color:"#0F172A", border:"1px solid #E2E8F0",
                                   borderRadius:"8px", padding:"7px 14px", fontSize:"13px",
                                   fontWeight:600, cursor:"pointer", display:"inline-block" }}>
                    {uploadingPhoto ? "Subiendo..." : "Seleccionar foto"}
                    <input type="file" accept="image/*" style={{ display:"none" }}
                           onChange={handleFotoChange} disabled={uploadingPhoto} />
                  </label>
                </div>
              </div>
              {photoError && (
                <p style={{ color:"#DC2626", fontSize:"12px", marginTop:"10px" }}>{photoError}</p>
              )}
            </div>

            <div style={CARD}>
              <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"16px" }}>Mi información</h3>
              {[
                ["Nombre",       tecnico.nombre],
                ["Oficio",       tecnico.oficio],
                ["Ciudad",       tecnico.ciudad],
                ["Experiencia",  `${tecnico.experiencia} años`],
                ["Plan actual",  esPro ? "⚡ Pro" : "Gratuito"],
                ["Calificación", tecnico.rating > 0 ? `⭐ ${tecnico.rating}` : "Sin calificaciones aún"],
              ].map(([k, v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #F1F5F9" }}>
                  <span style={{ color:"#64748B", fontSize:"13px" }}>{k}</span>
                  <span style={{ fontWeight:600, fontSize:"13px", color:"#0F172A" }}>{v}</span>
                </div>
              ))}
              <div style={{ display:"flex", gap:"10px", marginTop:"16px" }}>
                <button style={{ ...BTN, flex:1 }} onClick={() => alert("Edición de perfil próximamente")}>Editar perfil</button>
                <button style={{ flex:1, background:"#F1F5F9", color:"#0F172A", border:"1px solid #E2E8F0", borderRadius:"9px", padding:"9px 16px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}
                  onClick={() => nav("perfil", { tecnicoId:user?.uid })}>
                  Ver perfil público →
                </button>
              </div>
            </div>

            {!esPro && (
              <div style={{ background:"#0F172A", borderRadius:"18px", padding:"28px", textAlign:"center",
                            boxShadow:"0 8px 24px rgba(15,23,42,0.2)" }}>
                <p style={{ fontWeight:900, fontSize:"20px", color:"#fff", marginBottom:"8px" }}>Actualiza a Plan Pro ⚡</p>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px", marginBottom:"22px" }}>
                  $100 MXN/mes · Apareces primero · Sin anuncios · IA completa
                </p>
                <button style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"12px",
                                 padding:"13px 28px", fontSize:"15px", fontWeight:800, cursor:"pointer" }}
                  onClick={() => nav("precios")}>
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
