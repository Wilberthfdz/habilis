import { useState } from "react";
import Logo from "../components/Logo.jsx";
import AceptarTerminos from "../components/AceptarTerminos.jsx";
import { registrarUsuario, ponerNombreDeCuenta } from "../lib/firebase.js";

// Antes había DOS formularios de perfil distintos: este, con 13 oficios
// escritos a mano y sin nada de IA, y el de Google, con la taxonomía
// completa y dictado por voz. Quien se registraba con correo recibía el
// producto pobre. Ahora esta pantalla solo abre la cuenta y todo el mundo
// —correo, Google o Apple— pasa por el mismo formulario asistido.
const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };

const lbl = { fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.65)",
              textTransform:"uppercase", letterSpacing:"0.06em",
              display:"block", marginBottom:"5px" };

export default function Registro({ nav, params = {} }) {
  // "Obtener Plan Pro" en Precios manda aquí cuando no hay sesión. Sin esto
  // la intención se perdía: el técnico se registraba y aterrizaba en la
  // bienvenida, sin llegar nunca al checkout que había pedido.
  const quierePro = params.plan === "pro";
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [acepto,  setAcepto]  = useState(false);
  const [comercial, setComercial] = useState(false);
  const [form, setForm] = useState({ nombre:"", apellido:"", email:"", password:"" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validar = () => {
    if (!form.nombre.trim())       return "Ingresa tu nombre.";
    if (!form.apellido.trim())     return "Ingresa tu apellido.";
    if (!form.email.trim())        return "Ingresa tu correo electrónico.";
    if (form.password.length < 6)  return "La contraseña debe tener al menos 6 caracteres.";
    if (!acepto) return "Debes aceptar los Términos y el Aviso de Privacidad para crear tu cuenta.";
    return null;
  };

  const submit = async () => {
    const problema = validar();
    if (problema) { setError(problema); return; }
    setError(""); setLoading(true);
    const nombre = `${form.nombre.trim()} ${form.apellido.trim()}`;
    try {
      const cred = await registrarUsuario(form.email.trim(), form.password);
      // El nombre se guarda en la cuenta para que el formulario de perfil lo
      // lea igual que lee el de Google, sin pasarlo por la URL.
      await ponerNombreDeCuenta(cred.user, nombre).catch(() => {});
      // La aceptación viaja a la pantalla que crea el documento del perfil,
      // que es donde queda la constancia; no se pregunta dos veces.
      // Quien viene por el Plan Pro ya sabe que es técnico; el resto elige.
      const base = { aceptoTerminos: true, aceptoComunicaciones: comercial, nombre };
      if (quierePro) nav("completarPerfil", { ...base, plan: "pro" });
      else nav("elegirTipo", { ...base, volverA: params.volverA });
    } catch (e) {
      if (e.code === "auth/email-already-in-use") setError("Ese correo ya está registrado. Inicia sesión.");
      else if (e.code === "auth/weak-password")   setError("La contraseña debe tener al menos 6 caracteres.");
      else if (e.code === "auth/invalid-email")   setError("El correo electrónico no es válido.");
      else if (e.code === "auth/network-request-failed") setError("Sin conexión. Revisa tu internet e intenta de nuevo.");
      // Antes se enseñaba e.message tal cual: un texto en inglés de Firebase.
      else { console.error(e); setError("No se pudo crear la cuenta. Intenta de nuevo en un momento."); }
      setLoading(false);
    }
  };

  const onKey = e => { if (e.key === "Enter" && !loading) submit(); };

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", display:"flex", flexDirection:"column",
                  position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:"500px", height:"500px",
                    background:"radial-gradient(circle,rgba(249,115,22,0.13) 0%,transparent 65%)", pointerEvents:"none" }} />

      <div style={{ padding:"18px 24px", display:"flex", alignItems:"center", gap:"20px",
                    position:"relative", zIndex:1 }}>
        <Logo size={30} onClick={() => nav("landing")} />
        <span style={{ color:"rgba(255,255,255,0.65)", fontSize:"13px" }}>Crear cuenta</span>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"flex-start", justifyContent:"center",
                    padding:"8px 20px 40px", position:"relative", zIndex:1 }}>
        <div style={{ width:"100%", maxWidth:"480px" }}>
          {quierePro && (
            <div style={{ background:"rgba(249,115,22,0.12)", border:"1px solid rgba(249,115,22,0.3)",
                          borderRadius:"12px", padding:"14px 18px", marginBottom:"20px" }}>
              <p style={{ fontSize:"13.5px", fontWeight:800, color:"#F97316", marginBottom:"4px" }}>
                ⚡ Vas por el Plan Pro
              </p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>
                Necesitamos tu perfil de técnico antes de cobrar — es la cuenta a la que se
                asocia la suscripción. Al terminar te llevamos directo al pago.
              </p>
            </div>
          )}

          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)",
                        borderRadius:"20px", padding:"32px 28px", backdropFilter:"blur(16px)" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <h1 style={{ fontSize:"22px", fontWeight:900, color:"#fff", marginBottom:"4px" }}>
                  Crea tu cuenta
                </h1>
                <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"14px", lineHeight:1.55 }}>
                  Para trabajar como técnico o para encontrar uno. Es gratis y en el
                  siguiente paso nos dices a qué vienes.
                </p>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                <div>
                  <label style={lbl}>Nombre *</label>
                  <input style={inp} value={form.nombre} onChange={set("nombre")}
                    onKeyDown={onKey} placeholder="Juan" autoComplete="given-name" />
                </div>
                <div>
                  <label style={lbl}>Apellido *</label>
                  <input style={inp} value={form.apellido} onChange={set("apellido")}
                    onKeyDown={onKey} placeholder="Pérez" autoComplete="family-name" />
                </div>
              </div>

              <div>
                <label style={lbl}>Correo electrónico *</label>
                <input style={inp} type="email" value={form.email} onChange={set("email")}
                  onKeyDown={onKey} placeholder="tu@correo.com" autoComplete="email" />
              </div>

              <div>
                <label style={lbl}>Contraseña * (mín. 6 caracteres)</label>
                <input style={inp} type="password" value={form.password} onChange={set("password")}
                  onKeyDown={onKey} placeholder="••••••••" autoComplete="new-password" />
              </div>

              <AceptarTerminos nav={nav} valor={acepto} onChange={setAcepto}
                comercial={comercial} onChangeComercial={setComercial} />

              {error && (
                <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.28)",
                              borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#FCA5A5" }}>
                  {error}
                </div>
              )}

              <button onClick={submit} disabled={loading || !acepto}
                style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                         borderRadius:"10px", padding:"13px", fontSize:"15px", fontWeight:700,
                         cursor: acepto ? "pointer" : "not-allowed",
                         opacity: (loading || !acepto) ? 0.55 : 1 }}>
                {loading ? "Creando cuenta..." : "Continuar →"}
              </button>

              <p style={{ textAlign:"center", fontSize:"13px", color:"rgba(255,255,255,0.65)" }}>
                ¿Ya tienes cuenta?{" "}
                <button onClick={() => nav("login", quierePro ? { plan:"pro" } : {})}
                  style={{ background:"none", border:"none", color:"#F97316", fontWeight:700,
                           cursor:"pointer", fontSize:"13px" }}>Inicia sesión</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
