import { useState, useRef, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import Logo from "../components/Logo.jsx";
import { soporteIA } from "../lib/gemini.js";

const FAQ = [
  ["¿Cuánto cuesta Habilis?", "Buscar y contactar técnicos es gratis, siempre. Para técnicos hay plan Gratis (perfil + 5 trabajos documentados) y plan Pro de $100 MXN/mes con IVA incluido: prioridad en los resultados de búsqueda, insignia Pro, herramientas de IA, cotizaciones y Habilis Care."],
  ["¿Habilis cobra comisión por trabajo?", "No. Habilis no intermedia pagos ni cobra comisión: el precio, la fecha y la garantía los acuerdan técnico y cliente directamente. Solo cobramos la suscripción Pro por visibilidad y herramientas."],
  ["¿Habilis se hace responsable de los trabajos?", "No. Habilis es una plataforma de intermediación tecnológica: conecta a técnicos independientes con clientes, pero no presta los servicios ni emplea a los técnicos, y no responde por el trabajo realizado. Cada técnico responde por su propio servicio. La plataforma te ayuda a elegir bien con historial documentado, validaciones y moderación con IA."],
  ["¿Cómo cancelo mi plan Pro?", "Cuando quieras, desde Mercado Pago (donde se gestiona la suscripción). Conservas los beneficios hasta el fin del periodo pagado; no hay reembolsos por periodos parciales."],
  ["¿Puedo pedir factura (CFDI)?", "Sí. Los suscriptores Pro pueden solicitar su CFDI desde el panel proporcionando RFC, razón social, código postal, régimen fiscal y uso de CFDI."],
  ["Olvidé mi contraseña, ¿qué hago?", "En la pantalla de iniciar sesión hay una opción para recuperarla: te enviamos un enlace de restablecimiento a tu correo."],
  ["¿Cómo verifican a los técnicos?", "Cada trabajo publicado pasa por moderación asistida por IA y puede recibir validaciones de clientes reales. Para oficios regulados (gas, media tensión), pide siempre la certificación oficial: Habilis muestra lo que el técnico declara."],
  ["Quiero borrar mi cuenta o mis datos", "Escríbenos a habilisempresa@gmail.com desde el correo de tu cuenta y atenderemos tu solicitud conforme al Aviso de Privacidad (derechos ARCO)."],
  ["Encontré contenido falso o inapropiado", "Repórtalo a habilisempresa@gmail.com con el enlace del perfil o trabajo. La moderación puede ocultar o retirar contenido y suspender cuentas reincidentes."],
];

export default function Soporte({ nav, user }) {
  const [abierta, setAbierta]   = useState(null);
  const [mensajes, setMensajes] = useState([
    { rol:"ia", texto:"¡Hola! Soy el asistente de Habilis. Pregúntame sobre planes, pagos, tu cuenta o cómo usar la plataforma. 🤖" },
  ]);
  const [texto, setTexto]       = useState("");
  const [cargando, setCargando] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensajes, cargando]);

  const enviar = async () => {
    const pregunta = texto.trim();
    if (!pregunta || cargando) return;
    setTexto("");
    const historial = mensajes.filter(m => m.rol !== "error");
    setMensajes(m => [...m, { rol:"usuario", texto:pregunta }]);
    setCargando(true);
    try {
      const respuesta = await soporteIA(pregunta, [...historial, { rol:"usuario", texto:pregunta }]);
      setMensajes(m => [...m, { rol:"ia", texto: respuesta || "No pude generar respuesta. Escríbenos a habilisempresa@gmail.com." }]);
    } catch (e) {
      console.error("soporteIA:", e);
      setMensajes(m => [...m, { rol:"error", texto:"No pude responder ahora mismo. Intenta de nuevo en un momento o escríbenos a habilisempresa@gmail.com." }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <Nav nav={nav} user={user} />

      <div style={{ background:"#0A1120", padding:"64px 20px 72px", textAlign:"center" }}>
        <p style={{ fontSize:"12px", fontWeight:800, color:"#F07020", letterSpacing:"0.12em",
                    textTransform:"uppercase", marginBottom:"14px" }}>Centro de ayuda</p>
        <h1 style={{ fontSize:"clamp(28px,5vw,42px)", fontWeight:900, color:"#fff", marginBottom:"14px" }}>
          Soporte
        </h1>
        <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.65)", maxWidth:"560px",
                    margin:"0 auto", lineHeight:1.7 }}>
          Resuelve tu duda al instante con nuestro asistente de IA, revisa las preguntas
          frecuentes, o escríbenos directo.
        </p>
      </div>

      <div style={{ maxWidth:"1000px", margin:"-36px auto 72px", padding:"0 20px",
                    display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:"20px" }}>

        {/* Chat de soporte IA */}
        <div className="h-card" style={{ padding:"0", display:"flex", flexDirection:"column",
                                         overflow:"hidden", minHeight:"440px" }}>
          <div style={{ padding:"16px 20px", background:"#0F172A", display:"flex",
                        alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"20px" }}>🤖</span>
            <div>
              <p style={{ fontSize:"14px", fontWeight:800, color:"#fff" }}>Asistente Habilis</p>
              <p style={{ fontSize:"11px", color:"#4ADE80" }}>● Respuesta inmediata con IA</p>
            </div>
          </div>

          {user ? (
            <>
              <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:"16px",
                                          display:"flex", flexDirection:"column", gap:"10px",
                                          maxHeight:"380px" }}>
                {mensajes.map((m, i) => (
                  <div key={i} style={{
                    alignSelf: m.rol === "usuario" ? "flex-end" : "flex-start",
                    maxWidth:"85%", padding:"10px 14px", borderRadius:"14px", fontSize:"13.5px",
                    lineHeight:1.6, whiteSpace:"pre-wrap",
                    background: m.rol === "usuario" ? "#F07020" : m.rol === "error" ? "#FEE2E2" : "#F1F5F9",
                    color: m.rol === "usuario" ? "#fff" : m.rol === "error" ? "#991B1B" : "#0F172A",
                  }}>
                    {m.texto}
                  </div>
                ))}
                {cargando && (
                  <div style={{ alignSelf:"flex-start", padding:"10px 14px", borderRadius:"14px",
                                background:"#F1F5F9", color:"#94A3B8", fontSize:"13px" }}>
                    Escribiendo…
                  </div>
                )}
              </div>
              <div style={{ display:"flex", gap:"8px", padding:"12px", borderTop:"1px solid #E2E8F0" }}>
                <input value={texto} onChange={e => setTexto(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && enviar()}
                  placeholder="Escribe tu pregunta…" disabled={cargando}
                  style={{ flex:1, border:"1px solid #E2E8F0", borderRadius:"10px",
                           padding:"10px 14px", fontSize:"14px" }} />
                <button className="h-btn-orange" onClick={enviar} disabled={cargando || !texto.trim()}
                  style={{ padding:"10px 18px", fontSize:"14px",
                           opacity: cargando || !texto.trim() ? 0.5 : 1 }}>
                  Enviar
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                          justifyContent:"center", padding:"32px", textAlign:"center", gap:"14px" }}>
              <p style={{ fontSize:"14px", color:"#64748B", lineHeight:1.7, maxWidth:"300px" }}>
                Inicia sesión para chatear con el asistente de IA.
                Mientras tanto, las preguntas frecuentes de al lado resuelven la mayoría de las dudas.
              </p>
              <button className="h-btn-orange" style={{ padding:"11px 24px", fontSize:"14px" }}
                onClick={() => nav("login")}>
                Iniciar sesión
              </button>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div>
          <div className="h-card" style={{ padding:"clamp(20px,4vw,28px)", marginBottom:"18px" }}>
            <h2 style={{ fontSize:"17px", fontWeight:900, color:"#0F172A", marginBottom:"14px" }}>
              Preguntas frecuentes
            </h2>
            {FAQ.map(([q, a], i) => (
              <div key={q} style={{ borderBottom: i < FAQ.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <button onClick={() => setAbierta(abierta === i ? null : i)}
                  style={{ width:"100%", background:"none", border:"none", textAlign:"left",
                           padding:"13px 0", fontSize:"14px", fontWeight:700, color:"#0F172A",
                           cursor:"pointer", display:"flex", justifyContent:"space-between",
                           alignItems:"center", gap:"10px", fontFamily:"inherit" }}>
                  {q}
                  <span style={{ color:"#F07020", fontWeight:900, flexShrink:0 }}>
                    {abierta === i ? "−" : "+"}
                  </span>
                </button>
                {abierta === i && (
                  <p style={{ fontSize:"13.5px", color:"#64748B", lineHeight:1.7, paddingBottom:"14px" }}>{a}</p>
                )}
              </div>
            ))}
          </div>

          <div className="h-card" style={{ padding:"22px" }}>
            <h3 style={{ fontSize:"14px", fontWeight:800, color:"#0F172A", marginBottom:"6px" }}>
              ¿Prefieres hablar con una persona?
            </h3>
            <p style={{ fontSize:"13px", color:"#64748B", lineHeight:1.7, marginBottom:"12px" }}>
              Escríbenos y te respondemos por correo. Los suscriptores Pro tienen soporte prioritario.
            </p>
            <a href="mailto:habilisempresa@gmail.com"
              style={{ display:"inline-block", fontSize:"13.5px", fontWeight:800, color:"#F07020" }}>
              habilisempresa@gmail.com →
            </a>
          </div>
        </div>
      </div>

      <div style={{ padding:"22px", textAlign:"center", background:"#fff", borderTop:"1px solid #E2E8F0" }}>
        <Logo size={22} textColor="#0A1120" onClick={() => nav("landing")} />
        <p style={{ fontSize:"12px", color:"#94A3B8", marginTop:"8px" }}>© 2026 Habilis · Hecho en México</p>
      </div>
    </div>
  );
}
