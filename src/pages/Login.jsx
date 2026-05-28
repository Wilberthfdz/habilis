import { useState, useEffect } from "react";
import { iniciarSesion } from "../lib/firebase.js";

const s = {
  page:  { minHeight:"100vh", background:"#1E2A3B", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" },
  card:  { background:"rgba(255,255,255,0.06)", padding:"40px", borderRadius:"24px", width:"100%", maxWidth:"400px", border:"1px solid rgba(255,255,255,0.1)" },
  logo:  { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"17px", padding:"5px 14px", borderRadius:"8px", display:"inline-block", marginBottom:"28px", letterSpacing:"0.05em" },
  h1:    { fontSize:"28px", fontWeight:800, marginBottom:"8px" },
  sub:   { color:"rgba(255,255,255,0.55)", fontSize:"14px", marginBottom:"32px" },
  label: { display:"block", fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", marginBottom:"7px", letterSpacing:"0.06em" },
  inp:   { width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"12px", padding:"12px 16px", color:"#fff", fontSize:"15px", marginBottom:"20px", outline:"none", boxSizing:"border-box" },
  btn:   { width:"100%", background:"#D97706", color:"#fff", border:"none", borderRadius:"12px", padding:"14px", fontSize:"16px", fontWeight:700, cursor:"pointer", marginTop:"6px" },
  link:  { color:"#D97706", fontSize:"14px", fontWeight:600, cursor:"pointer", background:"none", border:"none", padding:0 },
  err:   { background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#FCA5A5", marginBottom:"16px" },
};

export default function Login({ nav, user }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (user) nav("panel");
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Ingresa tu correo y contraseña."); return; }
    setLoading(true);
    setError("");
    try {
      await iniciarSesion(email, password);
      nav("panel");
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Correo o contraseña incorrectos.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Demasiados intentos. Espera unos minutos.");
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>HABILIS</div>
        <h1 style={s.h1}>Bienvenido</h1>
        <p style={s.sub}>Inicia sesión para gestionar tus trabajos</p>

        <form onSubmit={handleLogin} noValidate>
          <label style={s.label}>Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@correo.com"
            style={s.inp}
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label style={s.label}>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            style={s.inp}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <div style={s.err}>{error}</div>}

          <button type="submit" style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Iniciando sesión..." : "Entrar →"}
          </button>
        </form>

        <div style={{ marginTop:"20px", textAlign:"center" }}>
          <button style={s.link} onClick={() => alert("Próximamente: restablece tu contraseña por correo.")}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div style={{ marginTop:"20px", textAlign:"center", fontSize:"14px", color:"rgba(255,255,255,0.45)" }}>
          ¿No tienes cuenta?{" "}
          <button style={s.link} onClick={() => nav("registro")}>
            Regístrate gratis
          </button>
        </div>

        <div style={{ marginTop:"16px", textAlign:"center" }}>
          <button style={{ ...s.link, color:"rgba(255,255,255,0.4)", fontSize:"13px" }} onClick={() => nav("landing")}>
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
