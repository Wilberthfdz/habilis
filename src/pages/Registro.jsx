// ─── REGISTRO — Con mejora de perfil por Gemini IA ───────────────────────
import { useState }              from "react";
import { registrarUsuario, crearPerfilTecnico } from "../lib/firebase.js";
import { mejorarPerfil }         from "../lib/gemini.js";

const OFICIOS = ["Electricista","Plomero","Técnico HVAC / Minisplits","Albañil","Tablaroquero","Mecánico","Técnico en redes","Instalador CCTV","Pintor","Soldador","Refrigeración","Otro"];

const s = {
  page:    { minHeight:"100vh", background:"#F4F5F7" },
  header:  { background:"#1E2A3B", color:"#fff", padding:"16px 20px", display:"flex", alignItems:"center", gap:"16px" },
  logo:    { background:"#D97706", color:"#fff", fontWeight:800, fontSize:"15px", padding:"4px 10px", borderRadius:"8px" },
  wrap:    { maxWidth:"560px", margin:"0 auto", padding:"32px 20px" },
  card:    { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"24px" },
  h1:      { fontSize:"22px", fontWeight:800, marginBottom:"6px" },
  sub:     { color:"#6B7280", fontSize:"14px", marginBottom:"24px" },
  label:   { display:"block", fontSize:"11px", fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"5px" },
  inp:     { width:"100%", border:"1px solid #D1D5DB", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", outline:"none", background:"#F9FAFB" },
  btn:     { width:"100%", background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"12px", fontSize:"14px", fontWeight:700 },
  btnSec:  { width:"100%", background:"#fff", color:"#374151", border:"1px solid #D1D5DB", borderRadius:"10px", padding:"12px", fontSize:"14px", fontWeight:600 },
  grid2:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" },
  err:     { background:"#FEE2E2", border:"1px solid #FECACA", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#991B1B" },
  aiBox:   { background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:"12px", padding:"16px", marginTop:"12px" },
  aiBtn:   { background:"#D97706", color:"#fff", border:"none", borderRadius:"8px", padding:"8px 14px", fontSize:"12px", fontWeight:700 },
  spinner: { width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite", marginRight:"6px" },
};

export default function Registro({ nav, user, params }) {
  const modo = params?.modo || "tecnico"; // tecnico | cliente

  const [step,       setStep]       = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [error,      setError]      = useState("");
  const [perfilIA,   setPerfilIA]   = useState("");

  const [form, setForm] = useState({
    nombre:"", apellido:"", email:"", password:"",
    oficio:"Electricista", ciudad:"", experiencia:"",
    textoRaw:"", perfilFinal:"",
    especialidades:[], herramientas:false, disponibilidad:"",
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const mejorarConIA = async () => {
    if (!form.textoRaw.trim()) return;
    setAiLoading(true);
    try {
      const mejorado = await mejorarPerfil(form.textoRaw, form.oficio);
      setPerfilIA(mejorado);
      setForm(f => ({ ...f, perfilFinal: mejorado }));
    } catch (e) {
      console.error("Gemini AI failed:", e);
      // Optional: set a non-blocking UI hint that the AI enhancement didn't work
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const cred = await registrarUsuario(form.email, form.password);
      await crearPerfilTecnico(cred.user.uid, {
        nombre:        `${form.nombre} ${form.apellido}`.trim(),
        email:         form.email,
        oficio:        form.oficio,
        ciudad:        form.ciudad,
        experiencia:   parseInt(form.experiencia) || 0,
        bio:           form.perfilFinal || form.textoRaw,
        herramientas:  form.herramientas,
        disponibilidad:form.disponibilidad,
        tipo:          "tecnico",
      });
      nav("panel");
    } catch (e) {
      setError(e.code === "auth/email-already-in-use"
        ? "Ese correo ya está registrado."
        : "Error al registrar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={s.header}>
        <button onClick={() => nav("landing")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600 }}>← Inicio</button>
        <span style={s.logo}>OFICIO</span>
        <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Crear perfil técnico</span>
      </div>

      <div style={s.wrap}>
        {/* Progress */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"24px" }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ flex:1, height:"4px", borderRadius:"2px", background: step >= n ? "#D97706" : "#E5E7EB" }} />
          ))}
        </div>

        <div style={s.card}>
          {/* STEP 1: Datos básicos */}
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <h1 style={s.h1}>Crea tu perfil</h1>
                <p style={s.sub}>Es gratis. En 24 hrs estás en las búsquedas.</p>
              </div>
              <div style={s.grid2}>
                <div><label style={s.label}>Nombre *</label><input style={s.inp} value={form.nombre} onChange={set("nombre")} placeholder="Juan" /></div>
                <div><label style={s.label}>Apellido *</label><input style={s.inp} value={form.apellido} onChange={set("apellido")} placeholder="Pérez" /></div>
              </div>
              <div><label style={s.label}>Correo *</label><input style={s.inp} type="email" value={form.email} onChange={set("email")} placeholder="tu@correo.com" /></div>
              <div><label style={s.label}>Contraseña *</label><input style={s.inp} type="password" value={form.password} onChange={set("password")} placeholder="Mínimo 6 caracteres" /></div>
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
              <button style={s.btn} onClick={() => { if(form.nombre && form.email && form.password && form.ciudad) setStep(2); else setError("Llena todos los campos marcados con *"); }}>
                Continuar →
              </button>
            </div>
          )}

          {/* STEP 2: Perfil con IA */}
          {step === 2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <h1 style={s.h1}>Cuéntanos sobre ti</h1>
                <p style={s.sub}>Escribe como quieras — la IA de Gemini lo mejora.</p>
              </div>

              <div>
                <label style={s.label}>Descríbete con tus propias palabras</label>
                <textarea style={{ ...s.inp, resize:"vertical", minHeight:"100px" }}
                  value={form.textoRaw} onChange={set("textoRaw")}
                  placeholder="Soy electricista con 10 años de experiencia, hago instalaciones en casas y negocios, tengo mis herramientas y garantizo mi trabajo..." />
                <button style={{ ...s.aiBtn, marginTop:"8px" }} onClick={mejorarConIA} disabled={aiLoading || !form.textoRaw}>
                  {aiLoading && <span style={s.spinner} />}
                  {aiLoading ? "Gemini mejorando..." : "✨ Mejorar con Gemini (Opcional)"}
                </button>
              </div>

              {perfilIA && (
                <div style={s.aiBox}>
                  <p style={{ fontSize:"11px", fontWeight:700, color:"#92400E", marginBottom:"8px" }}>✅ VERSIÓN MEJORADA POR GEMINI (OPCIONAL)</p>
                  <textarea style={{ ...s.inp, resize:"vertical", minHeight:"120px", background:"transparent", border:"none", padding:"0", fontSize:"13px", lineHeight:"1.6" }}
                    value={form.perfilFinal} onChange={set("perfilFinal")} />
                  <p style={{ fontSize:"11px", color:"#92400E", marginTop:"6px" }}>Puedes editar el texto antes de publicar.</p>
                </div>
              )}

              <div>
                <label style={s.label}>Disponibilidad</label>
                <input style={s.inp} value={form.disponibilidad} onChange={set("disponibilidad")} placeholder="Lun–Vie 8am–6pm · Sáb mañanas" />
              </div>

              <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"#374151" }}>
                <input type="checkbox" checked={form.herramientas} onChange={e => setForm(f => ({ ...f, herramientas: e.target.checked }))} />
                Tengo herramienta propia
              </label>

              <div style={{ display:"flex", gap:"10px" }}>
                <button style={{ ...s.btnSec, flex:1 }} onClick={() => setStep(1)}>← Atrás</button>
                <button style={{ ...s.btn, flex:2 }} onClick={() => setStep(3)}>Continuar →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmar y crear cuenta */}
          {step === 3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <h1 style={s.h1}>¡Listo para publicar!</h1>
                <p style={s.sub}>Revisa tu información antes de crear tu cuenta.</p>
              </div>

              <div style={{ background:"#F9FAFB", borderRadius:"12px", padding:"16px", display:"flex", flexDirection:"column", gap:"8px" }}>
                {[
                  ["Nombre",      `${form.nombre} ${form.apellido}`],
                  ["Oficio",      form.oficio],
                  ["Ciudad",      form.ciudad],
                  ["Experiencia", `${form.experiencia} años`],
                  ["Plan",        "Gratuito — puedes actualizar a Pro después"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:"13px" }}>
                    <span style={{ color:"#6B7280" }}>{k}</span>
                    <span style={{ fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background:"#FEF3C7", border:"1px solid #FDE68A", borderRadius:"10px", padding:"12px", fontSize:"13px", color:"#92400E" }}>
                🔑 Tu perfil aparecerá en búsquedas en las próximas 24 horas después de revisión.
                Para aparecer primero, actualiza a <b>Plan Pro por $100 MXN/mes</b>.
              </div>

              {error && <div style={s.err}>{error}</div>}

              <div style={{ display:"flex", gap:"10px" }}>
                <button style={{ ...s.btnSec, flex:1 }} onClick={() => setStep(2)}>← Atrás</button>
                <button style={{ ...s.btn, flex:2 }} onClick={handleSubmit} disabled={loading}>
                  {loading && <span style={s.spinner} />}
                  {loading ? "Creando cuenta..." : "Crear mi perfil gratis →"}
                </button>
              </div>

              <p style={{ fontSize:"11px", color:"#9CA3AF", textAlign:"center", lineHeight:"1.5" }}>
                Al registrarte aceptas los términos. Oficio.mx conecta técnicos con clientes pero no garantiza trabajos ni se responsabiliza por acuerdos entre partes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
