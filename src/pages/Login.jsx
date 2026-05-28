import { useState } from "react";
import { iniciarSesion } from "../lib/firebase.js";

const s = {
  page: { 
    minHeight: "100vh", 
    background: "#1E2A3B", 
    color: "#fff", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: "20px",
    fontFamily: "'Inter', sans-serif"
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "40px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "400px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
  },
  logo: {
    background: "#D97706",
    color: "#fff",
    fontWeight: 900,
    fontSize: "18px",
    padding: "5px 12px",
    borderRadius: "8px",
    display: "inline-block",
    marginBottom: "24px"
  },
  h1: { fontSize: "28px", fontWeight: 800, marginBottom: "8px" },
  p: { color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", marginBottom: "32px" },
  label: { display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.05em" },
  input: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#fff",
    fontSize: "15px",
    marginBottom: "20px",
    outline: "none",
    transition: "border-color 0.2s"
  },
  btn: {
    width: "100%",
    background: "#D97706",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "10px"
  },
  link: { color: "#D97706", fontSize: "14px", fontWeight: 600, cursor: "pointer", background: "none", border: "none", padding: 0 },
  footer: { marginTop: "24px", textAlign: "center", fontSize: "14px", color: "rgba(255, 255, 255, 0.5)" }
};

export default function Login({ nav }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await iniciarSesion(email, password);
      nav("panel");
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={s.card}>
        <div style={s.logo}>OFICIO.MX</div>
        <h1 style={s.h1}>Bienvenido</h1>
        <p style={s.p}>Inicia sesión para gestionar tus trabajos</p>

        <form onSubmit={handleLogin}>
          <label style={s.label}>Correo electrónico</label>
          <input 
            type="email" 
            placeholder="tu@correo.com" 
            style={s.input} 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label style={s.label}>Contraseña</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            style={s.input} 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? "Iniciando sesión..." : "Entrar →"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button style={s.link} onClick={() => alert("Función próximamente: Restablecer contraseña")}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div style={s.footer}>
          ¿No tienes cuenta?{" "}
          <button style={s.link} onClick={() => nav("registro")}>
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
}
