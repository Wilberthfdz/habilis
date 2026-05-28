import { useState } from "react";
import Logo from "../components/Logo.jsx";
import Avatar from "../components/Avatar.jsx";
import { crearPerfilTecnico, cerrarSesion } from "../lib/firebase.js";

const OFICIOS = [
  "Electricista","Plomero","Técnico HVAC / Minisplits","Albañil","Tablaroquero",
  "Mecánico","Técnico en redes","Instalador CCTV","Pintor","Soldador",
  "Refrigeración","Herrero","Otro",
];

const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };

const lbl = { fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.45)",
              textTransform:"uppercase", letterSpacing:"0.06em",
              display:"block", marginBottom:"5px" };

export default function CompletarPerfil({ nav, user }) {
  const googleName  = user?.displayName || "";
  const googleEmail = user?.email       || "";
  const googlePhoto = user?.photoURL    || null;

  const [oficio,       setOficio]       = useState("Electricista");
  const [ciudad,       setCiudad]       = useState("");
  const [experiencia,  setExperiencia]  = useState("");
  const [descripcion,  setDescripcion]  = useState("");
  const [herramientas, setHerramientas] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const submit = async () => {
    if (!ciudad.trim()) { setError("Ingresa tu ciudad para continuar."); return; }
    setError(""); setLoading(true);
    try {
      await crearPerfilTecnico(user.uid, {
        nombre:        googleName  || "Sin nombre",
        email:         googleEmail,
        fotoUrl:       googlePhoto || null,
        oficio,
        ciudad:        ciudad.trim(),
        experiencia:   parseInt(experiencia) || 0,
        bio:           descripcion.trim(),
        herramientas,
        disponibilidad:"",
        tipo:          "tecnico",
        plan:          "gratis",
        rating:        0,
        totalTrabajos: 0,
        disponible:    true,
      });
      nav("bienvenida");
    } catch (e) {
      console.error(e);
      setError("Error al guardar tu perfil. Intenta de nuevo.");
    } finally { setLoading(false); }
  };

  const logout = async () => { await cerrarSesion(); nav("landing"); };

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", display:"flex", flexDirection:"column",
                  position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:"500px", height:"500px",
                    background:"radial-gradient(circle,rgba(249,115,22,0.14) 0%,transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-20%", left:"-10%", width:"400px", height:"400px",
                    background:"radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%)", pointerEvents:"none" }} />

      {/* Header */}
      <div style={{ padding:"18px 24px", display:"flex", justifyContent:"space-between",
                    alignItems:"center", position:"relative", zIndex:1 }}>
        <Logo size={30} onClick={() => nav("landing")} />
        <button onClick={logout}
          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.35)",
                   fontSize:"13px", cursor:"pointer" }}>
          Salir
        </button>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"flex-start", justifyContent:"center",
                    padding:"8px 20px 48px", position:"relative", zIndex:1 }}>
        <div style={{ width:"100%", maxWidth:"480px" }}>

          {/* Card */}
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)",
                        borderRadius:"24px", padding:"36px 32px", backdropFilter:"blur(16px)" }}>

            {/* Google account preview */}
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"28px",
                          background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"14px 16px",
                          border:"1px solid rgba(255,255,255,0.08)" }}>
              {/* Avatar: shows Google photo if available */}
              {googlePhoto ? (
                <img src={googlePhoto} alt={googleName}
                  style={{ width:"44px", height:"44px", borderRadius:"12px", objectFit:"cover",
                           border:"2px solid rgba(249,115,22,0.4)", flexShrink:0 }} />
              ) : (
                <Avatar size={44} nombre={googleName} plan="gratis" />
              )}
              <div>
                <p style={{ fontWeight:700, fontSize:"14px", color:"#fff", marginBottom:"2px" }}>
                  {googleName || "Usuario de Google"}
                </p>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>{googleEmail}</p>
              </div>
              <span style={{ marginLeft:"auto", background:"rgba(66,133,244,0.15)",
                             border:"1px solid rgba(66,133,244,0.3)", color:"#93C5FD",
                             fontSize:"10px", fontWeight:700, padding:"3px 8px", borderRadius:"6px",
                             flexShrink:0 }}>
                Google
              </span>
            </div>

            <h2 style={{ fontSize:"22px", fontWeight:900, color:"#fff", marginBottom:"6px" }}>
              ¡Un paso más!
            </h2>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"14px", marginBottom:"28px", lineHeight:1.5 }}>
              Cuéntanos a qué te dedicas para que los clientes te encuentren.
            </p>

            {/* Fields */}
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                <div>
                  <label style={lbl}>Oficio principal *</label>
                  <select style={inp} value={oficio} onChange={e => setOficio(e.target.value)}>
                    {OFICIOS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Ciudad *</label>
                  <input style={inp} value={ciudad} onChange={e => setCiudad(e.target.value)}
                    placeholder="CDMX, GDL, MTY..." autoFocus />
                </div>
              </div>

              <div>
                <label style={lbl}>Años de experiencia</label>
                <input style={inp} type="number" value={experiencia}
                  onChange={e => setExperiencia(e.target.value)}
                  placeholder="0" min="0" max="60" />
              </div>

              <div>
                <label style={lbl}>Descripción (opcional)</label>
                <textarea
                  style={{ ...inp, resize:"vertical", minHeight:"90px" }}
                  value={descripcion} onChange={e => setDescripcion(e.target.value)}
                  placeholder="Soy electricista con 10 años de experiencia, hago instalaciones en casas y negocios..." />
                <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.25)", marginTop:"4px" }}>
                  Gemini puede mejorar esto desde tu panel.
                </p>
              </div>

              <label style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"14px",
                              color:"rgba(255,255,255,0.7)", cursor:"pointer" }}>
                <input type="checkbox" checked={herramientas}
                  onChange={e => setHerramientas(e.target.checked)}
                  style={{ width:"16px", height:"16px", accentColor:"#F97316" }} />
                Cuento con herramienta propia
              </label>

              {error && (
                <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.28)",
                              borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#FCA5A5" }}>
                  {error}
                </div>
              )}

              <button onClick={submit} disabled={loading}
                style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                         borderRadius:"12px", padding:"14px", fontSize:"15px", fontWeight:800,
                         cursor:"pointer", opacity: loading ? 0.75 : 1, marginTop:"4px",
                         boxShadow:"0 4px 14px rgba(249,115,22,0.3)" }}>
                {loading ? "Creando perfil..." : "Crear mi perfil gratis →"}
              </button>

              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.25)", textAlign:"center" }}>
                Al continuar aceptas los términos de uso de Habilis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
