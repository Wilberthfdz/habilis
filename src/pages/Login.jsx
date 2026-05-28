import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import { iniciarSesion, loginConGoogle, obtenerTecnico } from "../lib/firebase.js";

// Google "G" logo inline SVG
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function Login({ nav, user }) {
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [loading,       setLoading]       = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error,         setError]         = useState("");

  useEffect(() => { if (user) nav("panel"); }, [user]);

  const mapError = code => {
    if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential"))
      return "Correo o contraseña incorrectos.";
    if (code.includes("too-many-requests"))
      return "Demasiados intentos fallidos. Espera unos minutos.";
    return "Error al iniciar sesión. Intenta de nuevo.";
  };

  // After any login method, check whether the user already has a profile
  const routeAfterLogin = async uid => {
    const perfil = await obtenerTecnico(uid);
    nav(perfil ? "panel" : "completarPerfil");
  };

  const submit = async e => {
    e.preventDefault();
    if (!email || !password) { setError("Ingresa tu correo y contraseña."); return; }
    setLoading(true); setError("");
    try {
      const cred = await iniciarSesion(email, password);
      await routeAfterLogin(cred.user.uid);
    } catch (err) {
      setError(mapError(err.code || ""));
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoadingGoogle(true); setError("");
    try {
      const cred = await loginConGoogle();
      await routeAfterLogin(cred.user.uid);
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request")
        setError("No se pudo iniciar sesión con Google. Intenta de nuevo.");
    } finally { setLoadingGoogle(false); }
  };

  const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px", padding:"12px 16px",
                fontSize:"14px", outline:"none", background:"#F8FAFC", color:"#0F172A",
                boxSizing:"border-box" };

  const busy = loading || loadingGoogle;

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", display:"flex", flexDirection:"column",
                  position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:"500px", height:"500px",
                    background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-20%", left:"-10%", width:"400px", height:"400px",
                    background:"radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%)", pointerEvents:"none" }} />

      {/* Header */}
      <div style={{ padding:"18px 24px", position:"relative", zIndex:1 }}>
        <Logo size={30} onClick={() => nav("landing")} />
      </div>

      {/* Card */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
                    padding:"20px", position:"relative", zIndex:1 }}>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)",
                      borderRadius:"24px", padding:"40px 36px", width:"100%", maxWidth:"420px",
                      backdropFilter:"blur(16px)" }}>

          <h1 style={{ fontSize:"26px", fontWeight:900, color:"#fff", marginBottom:"6px" }}>Bienvenido</h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px", marginBottom:"28px" }}>
            Inicia sesión en tu cuenta Habilis
          </p>

          {/* ── GOOGLE BUTTON ───────────────────────────────────────────── */}
          <button onClick={handleGoogle} disabled={busy}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
                     gap:"10px", background:"#fff", color:"#1F2937", border:"1.5px solid #E2E8F0",
                     borderRadius:"12px", padding:"13px 16px", fontSize:"15px", fontWeight:600,
                     cursor:"pointer", marginBottom:"20px", opacity: busy ? 0.7 : 1,
                     boxShadow:"0 1px 4px rgba(0,0,0,0.12)", transition:"box-shadow 0.15s" }}>
            {loadingGoogle
              ? <div style={{ width:"18px", height:"18px", border:"2px solid #CBD5E1",
                               borderTopColor:"#94A3B8", borderRadius:"50%", animation:"spin 0.75s linear infinite" }} />
              : <GoogleIcon />
            }
            {loadingGoogle ? "Conectando..." : "Continuar con Google"}
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
            <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.1)" }} />
            <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"12px", fontWeight:600 }}>O con correo</span>
            <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.1)" }} />
          </div>

          {/* ── EMAIL FORM ──────────────────────────────────────────────── */}
          <form onSubmit={submit} noValidate style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
            <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.45)",
                            textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"5px", display:"block" }}>
              Correo electrónico
            </label>
            <input type="email" placeholder="tu@correo.com" style={inp}
              value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />

            <div style={{ height:"12px" }} />

            <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.45)",
                            textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"5px", display:"block" }}>
              Contraseña
            </label>
            <input type="password" placeholder="••••••••" style={inp}
              value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />

            {error && (
              <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.28)",
                            borderRadius:"10px", padding:"10px 14px", fontSize:"13px",
                            color:"#FCA5A5", marginTop:"8px" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={busy}
              style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                       borderRadius:"12px", padding:"14px", fontSize:"15px", fontWeight:700,
                       cursor:"pointer", marginTop:"18px", opacity: busy ? 0.75 : 1 }}>
              {loading ? "Iniciando sesión..." : "Entrar →"}
            </button>
          </form>

          <div style={{ marginTop:"16px", textAlign:"center" }}>
            <button onClick={() => alert("Restablecimiento de contraseña próximamente")}
              style={{ background:"none", border:"none", color:"rgba(255,255,255,0.35)",
                       fontSize:"12px", cursor:"pointer" }}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", marginTop:"22px", paddingTop:"18px",
                        textAlign:"center", fontSize:"14px", color:"rgba(255,255,255,0.4)" }}>
            ¿Sin cuenta?{" "}
            <button onClick={() => nav("registro")}
              style={{ background:"none", border:"none", color:"#F97316",
                       fontWeight:700, cursor:"pointer", fontSize:"14px" }}>
              Regístrate gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
