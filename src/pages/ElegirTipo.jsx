import { useState } from "react";
import Logo from "../components/Logo.jsx";
import AceptarTerminos from "../components/AceptarTerminos.jsx";
import { crearPerfilCliente, cerrarSesion } from "../lib/firebase.js";

// La bifurcación que faltaba. Todo el que se daba de alta acababa en el
// formulario de técnico, aunque solo quisiera contratar a uno: se le
// creaba un perfil de técnico y aparecía en el directorio. Ahora la
// primera pregunta es a qué vienes.
const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };

export default function ElegirTipo({ nav, user, params = {} }) {
  const [modo,    setModo]    = useState(null);      // null | "cliente"
  const [ciudad,  setCiudad]  = useState("");
  const [acepto,  setAcepto]  = useState(params.aceptoTerminos === true);
  const [comercial, setComercial] = useState(params.aceptoComunicaciones === true);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const nombre = user?.displayName || params.nombre || "";

  const irATecnico = () => nav("completarPerfil", { ...params, aceptoComunicaciones: comercial });

  const crearCliente = async () => {
    if (!acepto) { setError("Debes aceptar los Términos y el Aviso de Privacidad."); return; }
    setError(""); setLoading(true);
    try {
      await crearPerfilCliente(user.uid, {
        nombre, email: user?.email || "", ciudad: ciudad.trim(), aceptoTerminos: true,
        aceptoComunicaciones: comercial,
      });
      // Si venía de un perfil concreto, vuelve a él para pedir el servicio.
      if (params.volverA?.screen) nav(params.volverA.screen, params.volverA.params || {});
      else nav("buscar");
    } catch (e) {
      console.error(e);
      setError("No se pudo crear tu cuenta. Intenta de nuevo.");
    } finally { setLoading(false); }
  };

  const Tarjeta = ({ titulo, texto, accion, destacada }) => (
    <button onClick={accion}
      style={{ textAlign:"left", background: destacada ? "rgba(249,115,22,0.10)" : "rgba(255,255,255,0.04)",
               border:`1.5px solid ${destacada ? "rgba(249,115,22,0.45)" : "rgba(255,255,255,0.10)"}`,
               borderRadius:"16px", padding:"20px 22px", cursor:"pointer", width:"100%" }}>
      <p style={{ fontSize:"16px", fontWeight:900, color:"#fff", marginBottom:"4px" }}>{titulo}</p>
      <p style={{ fontSize:"13.5px", color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{texto}</p>
    </button>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Logo size={30} onClick={() => nav("landing")} />
        <button onClick={async () => { await cerrarSesion(); nav("landing"); }}
          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.65)", fontSize:"13px", cursor:"pointer" }}>
          Salir
        </button>
      </div>

      <div style={{ flex:1, display:"flex", justifyContent:"center", padding:"8px 20px 48px" }}>
        <div style={{ width:"100%", maxWidth:"480px" }}>
          <h2 style={{ fontSize:"24px", fontWeight:900, color:"#fff", marginBottom:"6px" }}>
            {nombre ? `Hola, ${nombre.split(" ")[0]}.` : "Hola."} ¿A qué vienes a Habilis?
          </h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"14px", marginBottom:"24px", lineHeight:1.6 }}>
            Las dos cuentas son gratis. Puedes cambiar después.
          </p>

          {!modo ? (
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              <Tarjeta destacada
                titulo="Soy técnico y quiero trabajar"
                texto="Creas tu perfil, documentas tus trabajos y los clientes te encuentran por tu oficio y tu zona."
                accion={irATecnico} />
              <Tarjeta
                titulo="Busco un técnico"
                texto="Encuentras técnicos con trabajos documentados, les escribes y acuerdan directo. Tu cuenta no aparece en ningún directorio."
                accion={() => setModo("cliente")} />
            </div>
          ) : (
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)",
                          borderRadius:"20px", padding:"28px 24px", display:"flex", flexDirection:"column", gap:"16px" }}>
              <div>
                <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.65)", textTransform:"uppercase",
                                letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>Tu ciudad (opcional)</label>
                <input style={inp} value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Cancún, CDMX…" />
                <p style={{ fontSize:"11.5px", color:"rgba(255,255,255,0.65)", marginTop:"5px" }}>
                  Solo para sugerirte técnicos cercanos. No se muestra a nadie.
                </p>
              </div>
              {params.aceptoTerminos !== true && (
                <AceptarTerminos nav={nav} valor={acepto} onChange={setAcepto} tipo="cliente"
                  comercial={comercial} onChangeComercial={setComercial} />
              )}
              {error && (
                <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.28)",
                              borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#FCA5A5" }}>{error}</div>
              )}
              <div style={{ display:"flex", gap:"10px" }}>
                <button onClick={() => setModo(null)}
                  style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)",
                           border:"1px solid rgba(255,255,255,0.12)", borderRadius:"10px", padding:"13px",
                           fontWeight:600, cursor:"pointer" }}>← Atrás</button>
                <button onClick={crearCliente} disabled={loading || !acepto}
                  style={{ flex:2, background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                           padding:"13px", fontSize:"15px", fontWeight:700, cursor:"pointer",
                           opacity:(loading || !acepto) ? 0.55 : 1 }}>
                  {loading ? "Creando cuenta…" : "Empezar a buscar →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
