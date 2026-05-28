import { useState, useEffect } from "react";
import { obtenerTecnico, obtenerTrabajosDelTecnico } from "../lib/firebase.js";

const ESTADO_LABEL = {
  pendiente: "Pendiente",
  aceptado: "Aceptado",
  proceso: "En proceso",
  terminado: "Terminado",
  validado: "Validado ✓",
};

export default function Perfil({ nav, params, user }) {
  const [tecnico,  setTecnico]  = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  const tecnicoId = params?.tecnicoId;

  useEffect(() => {
    if (!tecnicoId) { setNotFound(true); setLoading(false); return; }
    const cargar = async () => {
      try {
        const t = await obtenerTecnico(tecnicoId);
        if (!t) { setNotFound(true); setLoading(false); return; }
        setTecnico(t);
        const tr = await obtenerTrabajosDelTecnico(tecnicoId).catch(() => []);
        setTrabajos(tr.filter(t => t.estado === "terminado" || t.estado === "validado"));
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [tecnicoId]);

  const s = {
    page:   { minHeight:"100vh", background:"#F4F5F7" },
    header: { background:"#1E2A3B", color:"#fff", padding:"0 20px", height:"56px", display:"flex", gap:"14px", alignItems:"center" },
    logo:   { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 12px", borderRadius:"8px", letterSpacing:"0.05em" },
    wrap:   { maxWidth:"680px", margin:"0 auto", padding:"20px" },
    card:   { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"22px", marginBottom:"14px" },
    btn:    { background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"11px 20px", fontSize:"14px", fontWeight:700, cursor:"pointer" },
  };

  if (loading) return (
    <div style={s.page}>
      <div style={s.header}><span style={s.logo}>HABILIS</span></div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 20px", gap:"12px" }}>
        <div style={{ width:"28px", height:"28px", border:"3px solid #D97706", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:"#6B7280" }}>Cargando perfil...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div style={s.page}>
      <div style={s.header}>
        <button onClick={() => nav("buscar")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>← Buscar</button>
        <span style={s.logo}>HABILIS</span>
      </div>
      <div style={{ textAlign:"center", padding:"80px 20px" }}>
        <div style={{ fontSize:"48px", marginBottom:"12px" }}>🔍</div>
        <p style={{ fontWeight:700, marginBottom:"6px" }}>Perfil no encontrado</p>
        <p style={{ color:"#6B7280", marginBottom:"20px" }}>Este técnico no está disponible.</p>
        <button style={s.btn} onClick={() => nav("buscar")}>Ver otros técnicos</button>
      </div>
    </div>
  );

  const esOwner = user?.uid === tecnicoId;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button onClick={() => nav("buscar")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>← Buscar</button>
        <span style={s.logo}>HABILIS</span>
        {esOwner && <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>Tu perfil público</span>}
      </div>

      <div style={s.wrap}>
        {/* Tarjeta principal */}
        <div style={s.card}>
          <div style={{ display:"flex", gap:"16px", alignItems:"flex-start", marginBottom:"18px" }}>
            <div style={{
              width:"68px", height:"68px",
              background:"linear-gradient(135deg,#1E2A3B,#2D3F55)",
              borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:900, fontSize:"24px", color:"#fff", flexShrink:0,
              border: tecnico.plan === "pro" ? "3px solid #D97706" : "3px solid transparent"
            }}>
              {tecnico.nombre?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", marginBottom:"3px" }}>
                <h1 style={{ fontSize:"20px", fontWeight:800 }}>{tecnico.nombre}</h1>
                {tecnico.plan === "pro" && <span style={{ background:"#FEF3C7", color:"#92400E", fontSize:"11px", fontWeight:700, padding:"2px 8px", borderRadius:"6px" }}>⚡ PRO</span>}
              </div>
              <p style={{ color:"#D97706", fontWeight:600, fontSize:"14px" }}>{tecnico.oficio}</p>
              <p style={{ color:"#9CA3AF", fontSize:"13px", marginTop:"2px" }}>
                📍 {tecnico.ciudad}
                {tecnico.experiencia ? ` · ${tecnico.experiencia} años exp.` : ""}
                {tecnico.rating > 0 ? ` · ⭐ ${tecnico.rating}` : ""}
              </p>
              {tecnico.verificado && (
                <span style={{ background:"#D1FAE5", color:"#059669", fontSize:"11px", fontWeight:700, padding:"3px 8px", borderRadius:"6px", display:"inline-block", marginTop:"6px" }}>
                  ✅ Técnico Verificado
                </span>
              )}
            </div>
          </div>

          {tecnico.bio && (
            <p style={{ color:"#4B5563", fontSize:"14px", lineHeight:1.65, marginBottom:"18px", background:"#F9FAFB", borderRadius:"10px", padding:"12px" }}>
              {tecnico.bio}
            </p>
          )}

          {tecnico.disponibilidad && (
            <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"16px" }}>
              🕐 Disponibilidad: {tecnico.disponibilidad}
            </p>
          )}

          {tecnico.herramientas && (
            <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"16px" }}>🧰 Cuenta con herramienta propia</p>
          )}

          <div style={{ display:"flex", gap:"8px" }}>
            {esOwner
              ? <button style={{ ...s.btn, flex:1 }} onClick={() => nav("panel")}>Ir a mi Panel</button>
              : <>
                  <button style={{ ...s.btn, flex:2 }} onClick={() => alert("Función de contacto próximamente")}>💬 Contactar</button>
                  <button style={{ ...s.btn, flex:1, background:"#fff", color:"#374151", border:"1px solid #D1D5DB" }} onClick={() => alert("Guardado próximamente")}>Guardar</button>
                </>
            }
          </div>
        </div>

        {/* Estadísticas */}
        <div style={s.card}>
          <h2 style={{ fontWeight:700, fontSize:"15px", marginBottom:"14px" }}>Estadísticas</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", textAlign:"center" }}>
            {[
              ["🔧", trabajos.length, "Trabajos documentados"],
              ["⭐", tecnico.rating || "—", "Calificación"],
              ["📅", tecnico.experiencia ? `${tecnico.experiencia} años` : "—", "Experiencia"],
            ].map(([icon, val, label]) => (
              <div key={label} style={{ background:"#F9FAFB", borderRadius:"12px", padding:"14px" }}>
                <div style={{ fontSize:"20px", marginBottom:"4px" }}>{icon}</div>
                <div style={{ fontSize:"18px", fontWeight:800, color:"#D97706" }}>{val}</div>
                <div style={{ fontSize:"11px", color:"#6B7280", marginTop:"2px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trabajos realizados */}
        {trabajos.length > 0 && (
          <div style={s.card}>
            <h2 style={{ fontWeight:700, fontSize:"15px", marginBottom:"14px" }}>Trabajos realizados ({trabajos.length})</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {trabajos.map(t => (
                <div key={t.id} style={{ padding:"14px", background:"#F9FAFB", borderRadius:"12px", border:"1px solid #E5E7EB" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"4px" }}>
                    <p style={{ fontWeight:700, fontSize:"14px" }}>{t.titulo}</p>
                    <span style={{ background:"#D1FAE5", color:"#059669", fontSize:"10px", fontWeight:700, padding:"2px 7px", borderRadius:"5px" }}>
                      {ESTADO_LABEL[t.estado] || t.estado}
                    </span>
                  </div>
                  <p style={{ color:"#6B7280", fontSize:"12px", marginBottom:"4px" }}>
                    {t.tipo} · 📍 {t.ciudad} · ⏱ {t.tiempoHoras || 0}h
                  </p>
                  {t.descripcion && <p style={{ color:"#4B5563", fontSize:"12px", lineHeight:1.5 }}>{t.descripcion.slice(0, 120)}{t.descripcion.length > 120 ? "..." : ""}</p>}

                  {/* Fotos evidencia */}
                  {t.evidencias?.length > 0 && (
                    <div style={{ display:"flex", gap:"8px", marginTop:"10px" }}>
                      {t.evidencias.slice(0, 2).map((ev, i) => (
                        <img key={i} src={ev} alt={i === 0 ? "Antes" : "Después"} style={{ width:"80px", height:"60px", objectFit:"cover", borderRadius:"8px", border:"1px solid #E5E7EB" }} />
                      ))}
                      {t.evidencias.length > 1 && (
                        <div style={{ display:"flex", flexDirection:"column", gap:"2px", justifyContent:"center" }}>
                          <span style={{ fontSize:"10px", color:"#9CA3AF" }}>Antes</span>
                          <span style={{ fontSize:"10px", color:"#9CA3AF" }}>Después</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {trabajos.length === 0 && (
          <div style={{ ...s.card, textAlign:"center", padding:"36px" }}>
            <div style={{ fontSize:"36px", marginBottom:"10px" }}>🔧</div>
            <p style={{ fontWeight:600, marginBottom:"4px" }}>Sin trabajos documentados aún</p>
            <p style={{ color:"#6B7280", fontSize:"13px" }}>Este técnico aún no ha registrado trabajos en Habilis.</p>
          </div>
        )}

        <div style={{ ...s.card, background:"#FFFBEB", border:"1px solid #FDE68A" }}>
          <p style={{ color:"#92400E", fontSize:"13px", lineHeight:1.5 }}>
            <b>Habilis conecta clientes con técnicos</b> pero no garantiza trabajos ni se hace responsable por acuerdos entre partes. Valida siempre el trabajo antes de pagar.
          </p>
        </div>
      </div>
    </div>
  );
}
