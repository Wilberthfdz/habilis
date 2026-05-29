import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import { obtenerTecnico, obtenerTrabajosDelTecnico, agregarColaborador, estaEnRed } from "../lib/firebase.js";

const initials = n => ((n||"").trim().charAt(0).toUpperCase()) || "T";

export default function Perfil({ nav, params, user }) {
  const [tecnico,  setTecnico]  = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound,   setNotFound]   = useState(false);
  const [enRed,      setEnRed]      = useState(false);
  const [agregando,  setAgregando]  = useState(false);

  const tecnicoId = params?.tecnicoId;

  useEffect(() => {
    if (!tecnicoId) { setNotFound(true); setLoading(false); return; }
    (async () => {
      try {
        const t = await obtenerTecnico(tecnicoId);
        if (!t) { setNotFound(true); setLoading(false); return; }
        setTecnico(t);
        const tr = await obtenerTrabajosDelTecnico(tecnicoId).catch(() => []);
        setTrabajos(tr.filter(t => ["terminado","validado"].includes(t.estado)));
        if (user?.uid && user.uid !== tecnicoId) {
          estaEnRed(user.uid, tecnicoId).then(setEnRed).catch(() => {});
        }
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [tecnicoId]);

  const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                 padding:"22px", marginBottom:"14px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };
  const BTN  = { background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                 padding:"11px 20px", fontSize:"14px", fontWeight:700, cursor:"pointer" };

  const Shell = ({ children }) => (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>
      {children}
    </div>
  );

  if (loading) return (
    <Shell>
      <div style={{ textAlign:"center", padding:"100px 20px" }}>
        <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                      borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
        <p style={{ color:"#64748B" }}>Cargando perfil...</p>
      </div>
    </Shell>
  );

  if (notFound) return (
    <Shell>
      <div style={{ textAlign:"center", padding:"100px 20px" }}>
        <div style={{ fontSize:"52px", marginBottom:"14px" }}>🔍</div>
        <p style={{ fontWeight:800, fontSize:"20px", color:"#0F172A", marginBottom:"8px" }}>Perfil no encontrado</p>
        <p style={{ color:"#64748B", marginBottom:"24px" }}>Este técnico no está disponible.</p>
        <button style={BTN} onClick={() => nav("buscar")}>Ver otros técnicos</button>
      </div>
    </Shell>
  );

  const esOwner = user?.uid === tecnicoId;

  return (
    <Shell>
      {/* HERO BANNER */}
      <div style={{ background:"#0F172A", padding:"36px 20px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"400px", height:"400px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.14) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"680px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <button onClick={() => nav("buscar")}
            style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", fontSize:"13px",
                     fontWeight:600, cursor:"pointer", marginBottom:"10px", padding:0 }}>
            ← Buscar técnicos
          </button>

          <div style={{ display:"flex", gap:"18px", alignItems:"flex-start" }}>
            <Avatar size={68} nombre={tecnico.nombre} fotoUrl={tecnico.fotoUrl} plan={tecnico.plan} />
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", marginBottom:"4px" }}>
                <h1 style={{ fontSize:"clamp(20px,3.5vw,28px)", fontWeight:900, color:"#fff" }}>{tecnico.nombre}</h1>
                {tecnico.plan==="pro" && <span style={{ background:"rgba(249,115,22,0.2)", border:"1px solid rgba(249,115,22,0.4)", color:"#F97316", fontSize:"11px", fontWeight:800, padding:"2px 8px", borderRadius:"6px" }}>⚡ PRO</span>}
                {tecnico.verificado && <span style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#10B981", fontSize:"11px", fontWeight:800, padding:"2px 8px", borderRadius:"6px" }}>✅ Verificado</span>}
              </div>
              <p style={{ color:"#F97316", fontWeight:600, fontSize:"15px" }}>{tecnico.oficio}</p>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"13px", marginTop:"3px" }}>
                📍 {tecnico.ciudad}
                {tecnico.experiencia ? ` · ${tecnico.experiencia} años de experiencia` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"24px 20px" }}>

        {/* Acciones */}
        <div style={CARD}>
          {tecnico.bio && (
            <p style={{ color:"#475569", fontSize:"14px", lineHeight:1.7, marginBottom:"18px",
                        background:"#F8FAFC", borderRadius:"10px", padding:"14px" }}>
              {tecnico.bio}
            </p>
          )}
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
            {tecnico.disponibilidad && (
              <p style={{ color:"#64748B", fontSize:"13px", marginBottom:"14px", width:"100%" }}>
                🕐 <b>Disponibilidad:</b> {tecnico.disponibilidad}
              </p>
            )}
            {tecnico.herramientas && (
              <p style={{ color:"#64748B", fontSize:"13px", marginBottom:"14px", width:"100%" }}>
                🧰 Cuenta con herramienta propia
              </p>
            )}
          </div>
          <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
            {esOwner ? (
              <button style={{ ...BTN, flex:1 }} onClick={() => nav("panel")}>Ir a mi Panel</button>
            ) : (
              <>
                {user ? (
                  <button style={{ ...BTN, flex:2 }}
                    onClick={() => nav("solicitarServicio", { tecnicoId, tecnicoNombre:tecnico.nombre })}>
                    💬 Solicitar servicio
                  </button>
                ) : (
                  <button style={{ ...BTN, flex:2 }}
                    onClick={() => nav("login")}>
                    💬 Iniciar sesión para contactar
                  </button>
                )}
                {user && (
                  <button
                    onClick={async () => {
                      if (enRed) return;
                      setAgregando(true);
                      try {
                        await agregarColaborador(user.uid, {
                          tecnicoId, tecnicoNombre:tecnico.nombre, oficio:tecnico.oficio,
                          ciudad:tecnico.ciudad, fotoUrl:tecnico.fotoUrl||null, plan:tecnico.plan||"gratis",
                        });
                        setEnRed(true);
                      } finally { setAgregando(false); }
                    }}
                    disabled={enRed || agregando}
                    style={{ flex:1, background: enRed ? "#F0FDF4" : "#F1F5F9",
                             color: enRed ? "#059669" : "#374151",
                             border:`1px solid ${enRed ? "#A7F3D0" : "#E2E8F0"}`,
                             borderRadius:"10px", padding:"11px", fontSize:"13px",
                             fontWeight:600, cursor: enRed ? "default" : "pointer",
                             minWidth:"100px" }}>
                    {agregando ? "..." : enRed ? "✓ En mi red" : "🤝 Agregar a mi red"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={CARD}>
          <h2 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"16px" }}>Estadísticas</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
            {[
              ["🔧", trabajos.length,  "Trabajos"],
              ["⭐", tecnico.rating > 0 ? tecnico.rating : "—", "Calificación"],
              ["📅", tecnico.experiencia ? `${tecnico.experiencia}a` : "—", "Experiencia"],
            ].map(([icon, val, lbl]) => (
              <div key={lbl} style={{ background:"#F8FAFC", borderRadius:"12px", padding:"14px", textAlign:"center",
                                      border:"1px solid #E2E8F0" }}>
                <div style={{ fontSize:"20px", marginBottom:"4px" }}>{icon}</div>
                <div style={{ fontSize:"20px", fontWeight:900, color:"#F97316" }}>{val}</div>
                <div style={{ fontSize:"11px", color:"#94A3B8", marginTop:"2px" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trabajos */}
        {trabajos.length > 0 ? (
          <div style={CARD}>
            <h2 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"16px" }}>
              Trabajos realizados ({trabajos.length})
            </h2>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {trabajos.map(t => (
                <div key={t.id} style={{ padding:"14px", background:"#F8FAFC", borderRadius:"12px",
                                         border:"1px solid #E2E8F0" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
                    <p style={{ fontWeight:700, fontSize:"14px", color:"#0F172A" }}>{t.titulo}</p>
                    <span style={{ background:"#F0FDF4", color:"#059669", fontSize:"10px", fontWeight:700,
                                   padding:"2px 7px", borderRadius:"5px", flexShrink:0, marginLeft:"8px" }}>
                      {t.estado}
                    </span>
                  </div>
                  <p style={{ color:"#94A3B8", fontSize:"12px", marginBottom:"6px" }}>
                    {t.tipo} · 📍 {t.ciudad} · ⏱ {t.tiempoHoras||0}h
                  </p>
                  {t.descripcion && <p style={{ color:"#64748B", fontSize:"12px", lineHeight:1.5 }}>{t.descripcion.slice(0,140)}{t.descripcion.length>140?"...":""}</p>}
                  {t.evidencias?.length > 0 && (
                    <div style={{ display:"flex", gap:"8px", marginTop:"10px" }}>
                      {t.evidencias.slice(0,2).map((ev,i) => (
                        <div key={i} style={{ position:"relative" }}>
                          <img src={ev} alt="" style={{ width:"80px", height:"60px", objectFit:"cover",
                                                         borderRadius:"8px", border:"1px solid #E2E8F0" }} />
                          <span style={{ position:"absolute", bottom:"3px", left:"3px",
                                         background:"rgba(0,0,0,0.55)", color:"#fff",
                                         fontSize:"8px", fontWeight:700, padding:"1px 5px", borderRadius:"3px" }}>
                            {i===0?"ANTES":"DESPUÉS"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ ...CARD, textAlign:"center", padding:"40px" }}>
            <div style={{ fontSize:"40px", marginBottom:"10px" }}>🔧</div>
            <p style={{ fontWeight:600, color:"#374151", marginBottom:"4px" }}>Sin trabajos documentados aún</p>
            <p style={{ color:"#94A3B8", fontSize:"13px" }}>Este técnico aún no ha registrado trabajos en Habilis.</p>
          </div>
        )}

        <div style={{ ...CARD, background:"#FFF7ED", border:"1px solid rgba(249,115,22,0.25)" }}>
          <p style={{ color:"#92400E", fontSize:"13px", lineHeight:1.6 }}>
            <b>Habilis conecta clientes con técnicos</b> pero no garantiza trabajos ni se hace responsable por acuerdos entre partes. Valida siempre el trabajo antes de pagar.
          </p>
        </div>
      </div>
    </Shell>
  );
}
