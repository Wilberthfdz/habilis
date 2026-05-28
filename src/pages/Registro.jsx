import { useState } from "react";
import { registrarUsuario, crearPerfilTecnico } from "../lib/firebase.js";

const OFICIOS = [
  "Electricista","Plomero","Técnico HVAC / Minisplits","Albañil","Tablaroquero",
  "Mecánico","Técnico en redes","Instalador CCTV","Pintor","Soldador",
  "Refrigeración","Herrero","Otro",
];

const s = {
  page:    { minHeight:"100vh", background:"#F4F5F7", fontFamily:"'Inter',system-ui" },
  header:  { background:"#1E2A3B", color:"#fff", padding:"14px 20px", display:"flex", alignItems:"center", gap:"16px" },
  logo:    { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 12px", borderRadius:"8px", letterSpacing:"0.05em" },
  wrap:    { maxWidth:"560px", margin:"0 auto", padding:"32px 20px" },
  card:    { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"28px" },
  h1:      { fontSize:"22px", fontWeight:800, marginBottom:"6px" },
  sub:     { color:"#6B7280", fontSize:"14px", marginBottom:"24px" },
  label:   { display:"block", fontSize:"11px", fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"5px" },
  inp:     { width:"100%", border:"1px solid #D1D5DB", borderRadius:"10px", padding:"10px 14px", fontSize:"14px", outline:"none", background:"#F9FAFB", boxSizing:"border-box" },
  btn:     { width:"100%", background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"13px", fontSize:"14px", fontWeight:700, cursor:"pointer" },
  btnSec:  { width:"100%", background:"#fff", color:"#374151", border:"1px solid #D1D5DB", borderRadius:"10px", padding:"13px", fontSize:"14px", fontWeight:600, cursor:"pointer" },
  grid2:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" },
  err:     { background:"#FEE2E2", border:"1px solid #FECACA", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#991B1B", marginBottom:"4px" },
  spinner: { width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite", marginRight:"8px", verticalAlign:"middle" },
};

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

  const validarStep1 = () => {
    if (!form.nombre.trim()) return "Ingresa tu nombre.";
    if (!form.apellido.trim()) return "Ingresa tu apellido.";
    if (!form.email.trim()) return "Ingresa tu correo electrónico.";
    if (!form.password || form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (!form.ciudad.trim()) return "Ingresa tu ciudad.";
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const cred = await registrarUsuario(form.email.trim(), form.password);
      await crearPerfilTecnico(cred.user.uid, {
        nombre:       `${form.nombre.trim()} ${form.apellido.trim()}`,
        email:        form.email.trim(),
        oficio:       form.oficio,
        ciudad:       form.ciudad.trim(),
        experiencia:  parseInt(form.experiencia) || 0,
        bio:          form.descripcion.trim(),
        disponibilidad: form.disponibilidad.trim(),
        herramientas: form.herramientas,
        tipo:         "tecnico",
        plan:         "gratis",
        rating:       0,
        totalTrabajos:0,
        disponible:   true,
      });
      nav("bienvenida");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") setError("Ese correo ya está registrado. ¿Quieres iniciar sesión?");
      else if (e.code === "auth/weak-password") setError("La contraseña debe tener al menos 6 caracteres.");
      else if (e.code === "auth/invalid-email") setError("El correo electrónico no es válido.");
      else setError("Error al crear la cuenta: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={s.header}>
        <button onClick={() => nav("landing")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>← Inicio</button>
        <span style={s.logo}>HABILIS</span>
        <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"13px" }}>Crear perfil técnico</span>
      </div>

      <div style={s.wrap}>
        {/* Progress bar */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"24px" }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ flex:1, height:"4px", borderRadius:"2px", background: step >= n ? "#D97706" : "#E5E7EB", transition:"background 0.3s" }} />
          ))}
        </div>

        <div style={s.card}>

          {/* STEP 1 — Datos básicos */}
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <h1 style={s.h1}>Crea tu perfil</h1>
                <p style={s.sub}>Es gratis. En minutos estás en las búsquedas.</p>
              </div>
              <div style={s.grid2}>
                <div><label style={s.label}>Nombre *</label><input style={s.inp} value={form.nombre} onChange={set("nombre")} placeholder="Juan" /></div>
                <div><label style={s.label}>Apellido *</label><input style={s.inp} value={form.apellido} onChange={set("apellido")} placeholder="Pérez" /></div>
              </div>
              <div><label style={s.label}>Correo electrónico *</label><input style={s.inp} type="email" value={form.email} onChange={set("email")} placeholder="tu@correo.com" autoComplete="email" /></div>
              <div><label style={s.label}>Contraseña * (mín. 6 caracteres)</label><input style={s.inp} type="password" value={form.password} onChange={set("password")} placeholder="••••••••" autoComplete="new-password" /></div>
              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Oficio principal *</label>
                  <select style={s.inp} value={form.oficio} onChange={set("oficio")}>
                    {OFICIOS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div><label style={s.label}>Ciudad *</label><input style={s.inp} value={form.ciudad} onChange={set("ciudad")} placeholder="CDMX, GDL..." /></div>
              </div>
              <div><label style={s.label}>Años de experiencia</label><input style={s.inp} type="number" value={form.experiencia} onChange={set("experiencia")} placeholder="0" min="0" max="60" /></div>
              {error && <div style={s.err}>{error}</div>}
              <button style={s.btn} onClick={() => {
                const err = validarStep1();
                if (err) { setError(err); return; }
                setError("");
                setStep(2);
              }}>
                Continuar →
              </button>
              <div style={{ textAlign:"center", fontSize:"13px", color:"#6B7280" }}>
                ¿Ya tienes cuenta?{" "}
                <button style={{ background:"none", border:"none", color:"#D97706", fontWeight:700, cursor:"pointer", fontSize:"13px" }} onClick={() => nav("login")}>Iniciar sesión</button>
              </div>
            </div>
          )}

          {/* STEP 2 — Descripción */}
          {step === 2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <h1 style={s.h1}>Cuéntanos sobre ti</h1>
                <p style={s.sub}>Esta información aparece en tu perfil público.</p>
              </div>
              <div>
                <label style={s.label}>Descripción (opcional)</label>
                <textarea
                  style={{ ...s.inp, resize:"vertical", minHeight:"120px" }}
                  value={form.descripcion}
                  onChange={set("descripcion")}
                  placeholder="Soy electricista con 10 años de experiencia, hago instalaciones en casas y negocios, tengo mis herramientas y garantizo mi trabajo..."
                />
                <p style={{ color:"#9CA3AF", fontSize:"11px", marginTop:"4px" }}>Gemini puede mejorar esto automáticamente desde tu panel.</p>
              </div>
              <div>
                <label style={s.label}>Disponibilidad (opcional)</label>
                <input style={s.inp} value={form.disponibilidad} onChange={set("disponibilidad")} placeholder="Lun–Vie 8am–6pm · Sáb mañanas" />
              </div>
              <label style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"14px", color:"#374151", cursor:"pointer" }}>
                <input type="checkbox" checked={form.herramientas} onChange={e => setForm(f => ({ ...f, herramientas: e.target.checked }))} style={{ width:"16px", height:"16px" }} />
                Cuento con herramienta propia
              </label>
              <div style={{ display:"flex", gap:"10px", marginTop:"4px" }}>
                <button style={{ ...s.btnSec, flex:1 }} onClick={() => setStep(1)}>← Atrás</button>
                <button style={{ ...s.btn, flex:2 }} onClick={() => setStep(3)}>Continuar →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Confirmación */}
          {step === 3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <h1 style={s.h1}>¡Listo para publicar!</h1>
                <p style={s.sub}>Revisa tu información antes de crear tu cuenta.</p>
              </div>
              <div style={{ background:"#F9FAFB", borderRadius:"12px", padding:"16px", display:"flex", flexDirection:"column", gap:"10px" }}>
                {[
                  ["Nombre",       `${form.nombre} ${form.apellido}`],
                  ["Correo",       form.email],
                  ["Oficio",       form.oficio],
                  ["Ciudad",       form.ciudad],
                  ["Experiencia",  `${form.experiencia || 0} años`],
                  ["Plan inicial", "Gratuito"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", borderBottom:"1px solid #E5E7EB", paddingBottom:"6px" }}>
                    <span style={{ color:"#6B7280" }}>{k}</span>
                    <span style={{ fontWeight:600, color:"#111827" }}>{v}</span>
                  </div>
                ))}
              </div>
              {error && <div style={s.err}>{error}</div>}
              <div style={{ display:"flex", gap:"10px" }}>
                <button style={{ ...s.btnSec, flex:1 }} onClick={() => setStep(2)}>← Atrás</button>
                <button style={{ ...s.btn, flex:2 }} onClick={handleSubmit} disabled={loading}>
                  {loading && <span style={s.spinner} />}
                  {loading ? "Creando cuenta..." : "Crear mi perfil gratis →"}
                </button>
              </div>
              <p style={{ fontSize:"11px", color:"#9CA3AF", textAlign:"center" }}>
                Al registrarte aceptas los términos de uso de Habilis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
