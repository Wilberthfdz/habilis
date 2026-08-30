import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import { obtenerTecnico, obtenerTecnicoPorSlug, obtenerTrabajosDelTecnico, agregarColaborador, estaEnRed, reclamarSlug, esPlanPagante } from "../lib/firebase.js";
import { obtenerHorariosDisponibles, reservarCita } from "../lib/gemini.js";

const initials = n => ((n||"").trim().charAt(0).toUpperCase()) || "T";

export default function Perfil({ nav, params, user }) {
  const [tecnico,  setTecnico]  = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound,   setNotFound]   = useState(false);
  const [enRed,      setEnRed]      = useState(false);
  const [agregando,  setAgregando]  = useState(false);

  const slug = params?.slug;
  // Con link bonito (/t/juan-electricista) todavía no sabemos el uid hasta
  // resolver el slug — el resto del componente usa tecnicoId derivado del
  // perfil ya cargado (tecnico.id), no del param original.
  const tecnicoId = tecnico?.id || (!slug ? params?.tecnicoId : undefined);

  useEffect(() => {
    if (!slug && !params?.tecnicoId) { setNotFound(true); setLoading(false); return; }
    (async () => {
      try {
        const t = slug ? await obtenerTecnicoPorSlug(slug) : await obtenerTecnico(params.tecnicoId);
        if (!t) { setNotFound(true); setLoading(false); return; }
        setTecnico(t);
        const tr = await obtenerTrabajosDelTecnico(t.id).catch(() => []);
        setTrabajos(tr.filter(x => ["terminado","validado"].includes(x.estado)));
        if (user?.uid && user.uid !== t.id) {
          estaEnRed(user.uid, t.id).then(setEnRed).catch(() => {});
        }
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [slug, params?.tecnicoId]);

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
                {tecnico.plan==="empresa" && <span style={{ background:"rgba(37,99,235,0.2)", border:"1px solid rgba(37,99,235,0.45)", color:"#93C5FD", fontSize:"11px", fontWeight:800, padding:"2px 8px", borderRadius:"6px" }}>🏢 EMPRESA</span>}
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

        {esOwner && <CompartirPerfil tecnico={tecnico} nav={nav} onSlug={(s) => setTecnico(t => ({ ...t, slug:s }))} />}

        {!esOwner && esPlanPagante(tecnico.plan) && <AgendarCita tecnico={tecnico} user={user} nav={nav} />}

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

// ── Link bonito para compartir (solo el dueño lo ve) ────────────────────
function CompartirPerfil({ tecnico, onSlug, nav }) {
  const [editando, setEditando] = useState(false);
  const [texto,    setTexto]    = useState(tecnico.slug || "");
  const [guardando,setGuardando]= useState(false);
  const [error,    setError]    = useState("");
  const [copiado,  setCopiado]  = useState(false);

  const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                 padding:"22px", marginBottom:"14px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };
  const inp  = { border:"1px solid #E2E8F0", borderRadius:"9px", padding:"9px 12px", fontSize:"13.5px" };

  const url = tecnico.slug ? `${window.location.origin}/t/${tecnico.slug}` : null;

  const guardar = async () => {
    setError(""); setGuardando(true);
    try {
      const nuevoSlug = await reclamarSlug(tecnico.id, texto, tecnico.slug);
      onSlug(nuevoSlug);
      setTexto(nuevoSlug);
      setEditando(false);
    } catch (e) { setError(e.message || "No se pudo guardar el link."); }
    finally { setGuardando(false); }
  };

  const copiar = () => {
    if (!url) return;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  return (
    <div style={CARD}>
      <h2 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"10px" }}>🔗 Comparte tu perfil</h2>
      {url && !editando ? (
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
          <code style={{ background:"#F1F5F9", borderRadius:"8px", padding:"9px 12px", fontSize:"13px",
                          flex:1, minWidth:"180px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {url}
          </code>
          <button onClick={copiar}
            style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"9px",
                     padding:"9px 16px", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
            {copiado ? "✓ Copiado" : "Copiar"}
          </button>
          <button onClick={() => setEditando(true)}
            style={{ background:"#F1F5F9", border:"1px solid #E2E8F0", borderRadius:"9px",
                     padding:"9px 16px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
            Cambiar
          </button>
        </div>
      ) : !esPlanPagante(tecnico.plan) ? (
        <div>
          <p style={{ color:"#64748B", fontSize:"13px", marginBottom:"14px", lineHeight:1.6 }}>
            Elegir un link corto y fácil de recordar (myhabilis.com/t/tu-nombre) es un beneficio Pro/Empresa.
          </p>
          <button className="h-btn-orange" style={{ padding:"9px 18px", fontSize:"13px" }}
            onClick={() => nav("precios")}>
            Conocer Plan Pro →
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color:"#64748B", fontSize:"13px", marginBottom:"10px" }}>
            Elige un link corto y fácil de recordar para compartir tu perfil por WhatsApp o redes sociales.
          </p>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:"13px", color:"#94A3B8" }}>myhabilis.com/t/</span>
            <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="juan-electricista"
              style={{ ...inp, flex:1, minWidth:"160px" }} />
            <button onClick={guardar} disabled={guardando || !texto.trim()}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"9px",
                       padding:"9px 16px", fontSize:"13px", fontWeight:700, cursor:"pointer",
                       opacity: guardando || !texto.trim() ? 0.6 : 1 }}>
              {guardando ? "Guardando…" : "Guardar"}
            </button>
            {tecnico.slug && (
              <button onClick={() => { setEditando(false); setTexto(tecnico.slug); setError(""); }}
                style={{ background:"none", border:"none", color:"#94A3B8", fontSize:"13px", cursor:"pointer" }}>
                Cancelar
              </button>
            )}
          </div>
          {error && <p style={{ color:"#DC2626", fontSize:"12.5px", marginTop:"8px" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

// ── Agendar cita — sale del propio horario del técnico (Pro/Empresa) ────
const proximosDias = () => {
  const dias = [];
  const hoy = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    dias.push({ iso, label: d.toLocaleDateString("es-MX", { weekday:"short", day:"numeric", month:"short" }) });
  }
  return dias;
};

function AgendarCita({ tecnico, user, nav }) {
  const dias = proximosDias();
  const [fecha, setFecha] = useState(dias[0].iso);
  const [slots, setSlots] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [nota, setNota] = useState("");
  const [reservando, setReservando] = useState(false);
  const [confirmada, setConfirmada] = useState(null);
  const [error, setError] = useState("");

  const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                 padding:"22px", marginBottom:"14px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };

  useEffect(() => {
    if (!user) return;
    setSlots(null); setSeleccionado(null); setError("");
    setCargando(true);
    obtenerHorariosDisponibles(tecnico.id, fecha)
      .then(r => setSlots(r.slots || []))
      .catch(e => setError(e.message || "No se pudo cargar la agenda."))
      .finally(() => setCargando(false));
  }, [fecha, user, tecnico.id]);

  const confirmar = async () => {
    if (!seleccionado) return;
    setError(""); setReservando(true);
    try {
      await reservarCita(tecnico.id, fecha, seleccionado, nota.trim());
      setConfirmada({ fecha, hora: seleccionado });
    } catch (e) {
      setError(e.message || "No se pudo agendar. Intenta con otro horario.");
      setSlots(s => (s || []).filter(h => h !== seleccionado));
      setSeleccionado(null);
    } finally { setReservando(false); }
  };

  if (!user) return (
    <div style={CARD}>
      <h2 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"10px" }}>📅 Agendar una cita</h2>
      <p style={{ color:"#64748B", fontSize:"13px", marginBottom:"12px" }}>Inicia sesión para ver los horarios disponibles de {tecnico.nombre}.</p>
      <button onClick={() => nav("login")}
        style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                 padding:"10px 18px", fontSize:"14px", fontWeight:700, cursor:"pointer" }}>
        Iniciar sesión
      </button>
    </div>
  );

  if (confirmada) return (
    <div style={{ ...CARD, background:"#F0FDF4", border:"1px solid #A7F3D0" }}>
      <h2 style={{ fontWeight:800, fontSize:"15px", color:"#15803D", marginBottom:"6px" }}>✓ Cita agendada</h2>
      <p style={{ color:"#166534", fontSize:"13.5px" }}>
        Quedaste agendado con {tecnico.nombre} el {dias.find(d => d.iso === confirmada.fecha)?.label} a las {confirmada.hora}.
      </p>
    </div>
  );

  return (
    <div style={CARD}>
      <h2 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"10px" }}>📅 Agendar una cita</h2>

      <div style={{ display:"flex", gap:"6px", overflowX:"auto", paddingBottom:"8px", marginBottom:"12px" }}>
        {dias.map(d => (
          <button key={d.iso} onClick={() => setFecha(d.iso)}
            style={{ flexShrink:0, background: fecha === d.iso ? "#0F172A" : "#F1F5F9",
                     color: fecha === d.iso ? "#fff" : "#374151", border:"none", borderRadius:"9px",
                     padding:"8px 12px", fontSize:"12px", fontWeight:700, cursor:"pointer", textTransform:"capitalize" }}>
            {d.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <p style={{ color:"#94A3B8", fontSize:"13px" }}>Buscando horarios…</p>
      ) : (slots && slots.length === 0) ? (
        <p style={{ color:"#94A3B8", fontSize:"13px" }}>Sin horarios disponibles este día — prueba otra fecha.</p>
      ) : (
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"14px" }}>
          {(slots || []).map(h => (
            <button key={h} onClick={() => setSeleccionado(h)}
              style={{ background: seleccionado === h ? "#F97316" : "#F1F5F9",
                       color: seleccionado === h ? "#fff" : "#374151", border:"none", borderRadius:"8px",
                       padding:"8px 14px", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
              {h}
            </button>
          ))}
        </div>
      )}

      {seleccionado && (
        <>
          <textarea value={nota} onChange={e => setNota(e.target.value)} maxLength={300}
            placeholder="Cuéntale brevemente qué necesitas (opcional)"
            style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px", padding:"10px 12px",
                     fontSize:"13.5px", minHeight:"60px", boxSizing:"border-box", marginBottom:"10px",
                     fontFamily:"inherit", resize:"vertical" }} />
          <button onClick={confirmar} disabled={reservando}
            style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                     padding:"11px 20px", fontSize:"14px", fontWeight:700, cursor:"pointer",
                     opacity: reservando ? 0.6 : 1 }}>
            {reservando ? "Agendando…" : `Confirmar cita para las ${seleccionado}`}
          </button>
        </>
      )}

      {error && <p style={{ color:"#DC2626", fontSize:"12.5px", marginTop:"10px" }}>{error}</p>}
    </div>
  );
}
