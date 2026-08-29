import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { obtenerCliente, actualizarCliente } from "../lib/firebase.js";

const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };
const lbl = { fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
              letterSpacing:"0.06em", display:"block", marginBottom:"5px" };

const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
               padding:"24px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };

export default function MiCuentaCliente({ nav, user }) {
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");
  const [nombre,   setNombre]   = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad,   setCiudad]   = useState("");

  useEffect(() => {
    if (!user) { nav("login"); return; }
    obtenerCliente(user.uid).then(c => {
      setNombre(c?.nombre || "");
      setTelefono(c?.telefono || "");
      setCiudad(c?.ciudad || "");
    }).finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const guardar = async () => {
    if (!nombre.trim()) { setError("Ingresa tu nombre."); return; }
    setError(""); setSaved(false); setSaving(true);
    try {
      await actualizarCliente(user.uid, {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        ciudad: ciudad.trim(),
      });
      setSaved(true);
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally { setSaving(false); }
  };

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO */}
      <div style={{ background:"#0F172A", padding:"32px 20px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"380px", height:"380px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"560px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.1em", marginBottom:"8px" }}>👤 Tu perfil</p>
          <h1 style={{ fontSize:"clamp(20px,4vw,30px)", fontWeight:900, color:"#fff" }}>
            Mi cuenta
          </h1>
        </div>
      </div>

      <div style={{ maxWidth:"560px", margin:"0 auto", padding:"24px 20px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                          borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
            <p style={{ color:"#64748B" }}>Cargando tu cuenta...</p>
          </div>
        ) : (
          <div style={CARD}>
            <div style={{ marginBottom:"20px" }}>
              <label style={lbl}>Correo</label>
              <p style={{ fontSize:"14px", color:"#0F172A", fontWeight:600 }}>{user.email}</p>
              <p style={{ fontSize:"11px", color:"#94A3B8", marginTop:"2px" }}>
                El correo no se puede cambiar desde aquí.
              </p>
            </div>

            <div style={{ marginBottom:"16px" }}>
              <label style={lbl}>Nombre *</label>
              <input style={inp} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" />
            </div>

            <div style={{ marginBottom:"16px" }}>
              <label style={lbl}>Teléfono (opcional)</label>
              <input style={inp} value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="55 1234 5678" />
            </div>

            <div style={{ marginBottom:"20px" }}>
              <label style={lbl}>Ciudad (opcional)</label>
              <input style={inp} value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="CDMX, GDL..." />
            </div>

            {error && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"10px",
                            padding:"10px 14px", fontSize:"13px", color:"#DC2626", marginBottom:"16px" }}>
                {error}
              </div>
            )}
            {saved && (
              <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:"10px",
                            padding:"10px 14px", fontSize:"13px", color:"#166534", marginBottom:"16px" }}>
                ✓ Cambios guardados.
              </div>
            )}

            <button onClick={guardar} disabled={saving}
              style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                       borderRadius:"12px", padding:"14px", fontSize:"15px", fontWeight:800,
                       cursor:"pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
