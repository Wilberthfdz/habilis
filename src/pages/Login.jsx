import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import { iniciarSesion } from "../lib/firebase.js";

export default function Login({ nav, user }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => { if (user) nav("panel"); }, [user]);

  const submit = async e => {
    e.preventDefault();
    if (!email || !password) { setError("Ingresa tu correo y contraseña."); return; }
    setLoading(true); setError("");
    try {
      await iniciarSesion(email, password);
      nav("panel");
    } catch (err) {
      const code = err.code || "";
      if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential"))
        setError("Correo o contraseña incorrectos.");
      else if (code.includes("too-many-requests"))
        setError("Demasiados intentos fallidos. Espera unos minutos.");
      else
        setError("Error al iniciar sesión. Intenta de nuevo.");
    } finally { setLoading(false); }
  };

  const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px", padding:"12px 16px",
                fontSize:"14px", outline:"none", background:"#F8FAFC", color:"#0F172A",
                boxSizing:"border-box" };

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
                      borderRadius:"24px", padding:"44px 40px", width:"100%", maxWidth:"420px",
                      backdropFilter:"blur(16px)" }}>
          <h1 style={{ fontSize:"28px", fontWeight:900, color:"#fff", marginBottom:"6px" }}>Bienvenido</h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px", marginBottom:"36px" }}>
            Inicia sesión en tu cuenta Habilis
          </p>

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

            <button type="submit" disabled={loading}
              style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                       borderRadius:"12px", padding:"14px", fontSize:"16px", fontWeight:700,
                       cursor:"pointer", marginTop:"20px", opacity: loading ? 0.75 : 1 }}>
              {loading ? "Iniciando sesión..." : "Entrar →"}
            </button>
          </form>

          <div style={{ marginTop:"18px", textAlign:"center" }}>
            <button onClick={() => alert("Restablecimiento de contraseña próximamente")}
              style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)",
                       fontSize:"13px", cursor:"pointer" }}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", marginTop:"24px", paddingTop:"20px",
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
