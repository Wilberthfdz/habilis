import { useState } from "react";
import Logo from "../components/Logo.jsx";
import { registrarUsuario, crearPerfilTecnico } from "../lib/firebase.js";

const OFICIOS = [
  "Electricista","Plomero","Técnico HVAC / Minisplits","Albañil","Tablaroquero",
  "Mecánico","Técnico en redes","Instalador CCTV","Pintor","Soldador",
  "Refrigeración","Herrero","Otro",
];

const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };

export default function Registro({ nav }) {
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [form, setForm] = useState({
    nombre:"", apellido:"", email:"", password:"",
    oficio:"Electricista", ciudad:"", experiencia:"",
    descripcion:"", disponibilidad:"", herramientas:false,
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate1 = () => {
    if (!form.nombre.trim())  return "Ingresa tu nombre.";
    if (!form.apellido.trim()) return "Ingresa tu apellido.";
    if (!form.email.trim())   return "Ingresa tu correo electrónico.";
    if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (!form.ciudad.trim())  return "Ingresa tu ciudad.";
    return null;
  };

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const cred = await registrarUsuario(form.email.trim(), form.password);
      await crearPerfilTecnico(cred.user.uid, {
        nombre:        `${form.nombre.trim()} ${form.apellido.trim()}`,
        email:         form.email.trim(),
        oficio:        form.oficio,
        ciudad:        form.ciudad.trim(),
        experiencia:   parseInt(form.experiencia) || 0,
        bio:           form.descripcion.trim(),
        disponibilidad:form.disponibilidad.trim(),
        herramientas:  form.herramientas,
        tipo:"tecnico", plan:"gratis", rating:0, totalTrabajos:0, disponible:true,
      });
      nav("bienvenida");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") setError("Ese correo ya está registrado.");
      else if (e.code === "auth/weak-password")   setError("La contraseña debe tener al menos 6 caracteres.");
      else if (e.code === "auth/invalid-email")   setError("El correo electrónico no es válido.");
      else setError("Error al crear la cuenta: " + e.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", display:"flex", flexDirection:"column",
                  position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:"500px", height:"500px",
                    background:"radial-gradient(circle,rgba(249,115,22,0.13) 0%,transparent 65%)", pointerEvents:"none" }} />

      {/* Header */}
      <div style={{ padding:"18px 24px", display:"flex", alignItems:"center", gap:"20px",
                    position:"relative", zIndex:1 }}>
        <Logo size={30} onClick={() => nav("landing")} />
        <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px" }}>Crear perfil técnico</span>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"flex-start", justifyContent:"center",
                    padding:"8px 20px 40px", position:"relative", zIndex:1 }}>
        <div style={{ width:"100%", maxWidth:"520px" }}>
          {/* Progress */}
          <div style={{ display:"flex", gap:"6px", marginBottom:"24px" }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ flex:1, height:"3px", borderRadius:"2px",
                                    background: step >= n ? "#F97316" : "rgba(255,255,255,0.1)",
                                    transition:"background 0.3s" }} />
            ))}
          </div>

          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)",
                        borderRadius:"20px", padding:"32px 28px", backdropFilter:"blur(16px)" }}>

            {/* STEP 1 */}
            {step === 1 && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <div>
                  <h2 style={{ fontSize:"22px", fontWeight:900, color:"#fff", marginBottom:"4px" }}>Crea tu perfil</h2>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"14px" }}>Es gratis. En minutos estás en las búsquedas.</p>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Nombre *</label>
                    <input style={inp} value={form.nombre} onChange={set("nombre")} placeholder="Juan" />
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Apellido *</label>
                    <input style={inp} value={form.apellido} onChange={set("apellido")} placeholder="Pérez" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Correo electrónico *</label>
                  <input style={inp} type="email" value={form.email} onChange={set("email")} placeholder="tu@correo.com" autoComplete="email" />
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Contraseña * (mín. 6 caracteres)</label>
                  <input style={inp} type="password" value={form.password} onChange={set("password")} placeholder="••••••••" autoComplete="new-password" />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Oficio principal *</label>
                    <select style={inp} value={form.oficio} onChange={set("oficio")}>
                      {OFICIOS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Ciudad *</label>
                    <input style={inp} value={form.ciudad} onChange={set("ciudad")} placeholder="CDMX, GDL..." />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Años de experiencia</label>
                  <input style={inp} type="number" value={form.experiencia} onChange={set("experiencia")} placeholder="0" min="0" max="60" />
                </div>
                {error && <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.28)", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#FCA5A5" }}>{error}</div>}
                <button onClick={() => { const e = validate1(); if (e) { setError(e); return; } setError(""); setStep(2); }}
                  style={{ width:"100%", background:"#F97316", color:"#fff", border:"none", borderRadius:"10px", padding:"13px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>
                  Continuar →
                </button>
                <p style={{ textAlign:"center", fontSize:"13px", color:"rgba(255,255,255,0.35)" }}>
                  ¿Ya tienes cuenta?{" "}
                  <button onClick={() => nav("login")} style={{ background:"none", border:"none", color:"#F97316", fontWeight:700, cursor:"pointer", fontSize:"13px" }}>Inicia sesión</button>
                </p>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <div>
                  <h2 style={{ fontSize:"22px", fontWeight:900, color:"#fff", marginBottom:"4px" }}>Tu perfil público</h2>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"14px" }}>Esta información la verán los clientes.</p>
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Descripción (opcional)</label>
                  <textarea style={{ ...inp, resize:"vertical", minHeight:"110px" }}
                    value={form.descripcion} onChange={set("descripcion")}
                    placeholder="Soy electricista con 10 años de experiencia, hago instalaciones en casas y negocios..." />
                  <p style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", marginTop:"4px" }}>Gemini puede mejorar esto automáticamente desde tu panel.</p>
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Disponibilidad</label>
                  <input style={inp} value={form.disponibilidad} onChange={set("disponibilidad")} placeholder="Lun–Vie 8am–6pm · Sáb mañanas" />
                </div>
                <label style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"14px", color:"rgba(255,255,255,0.7)", cursor:"pointer" }}>
                  <input type="checkbox" checked={form.herramientas} onChange={e => setForm(f => ({ ...f, herramientas:e.target.checked }))} style={{ width:"16px", height:"16px", accentColor:"#F97316" }} />
                  Cuento con herramienta propia
                </label>
                <div style={{ display:"flex", gap:"10px", marginTop:"4px" }}>
                  <button onClick={() => setStep(1)} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"10px", padding:"13px", fontWeight:600, cursor:"pointer" }}>← Atrás</button>
                  <button onClick={() => setStep(3)} style={{ flex:2, background:"#F97316", color:"#fff", border:"none", borderRadius:"10px", padding:"13px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>Continuar →</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <div>
                  <h2 style={{ fontSize:"22px", fontWeight:900, color:"#fff", marginBottom:"4px" }}>¡Todo listo!</h2>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"14px" }}>Revisa tu información antes de crear la cuenta.</p>
                </div>
                <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"16px 18px" }}>
                  {[
                    ["Nombre",       `${form.nombre} ${form.apellido}`],
                    ["Correo",       form.email],
                    ["Oficio",       form.oficio],
                    ["Ciudad",       form.ciudad],
                    ["Experiencia",  `${form.experiencia || 0} años`],
                    ["Plan inicial", "Gratuito"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0",
                                          borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:"13px" }}>
                      <span style={{ color:"rgba(255,255,255,0.4)" }}>{k}</span>
                      <span style={{ fontWeight:600, color:"rgba(255,255,255,0.85)" }}>{v}</span>
                    </div>
                  ))}
                </div>
                {error && <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.28)", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#FCA5A5" }}>{error}</div>}
                <div style={{ display:"flex", gap:"10px" }}>
                  <button onClick={() => setStep(2)} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"10px", padding:"13px", fontWeight:600, cursor:"pointer" }}>← Atrás</button>
                  <button onClick={submit} disabled={loading} style={{ flex:2, background:"#F97316", color:"#fff", border:"none", borderRadius:"10px", padding:"13px", fontSize:"15px", fontWeight:700, cursor:"pointer", opacity: loading ? 0.75 : 1 }}>
                    {loading ? "Creando cuenta..." : "Crear mi perfil gratis →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
