import { useEffect, useRef } from "react";
import Nav from "../components/Nav.jsx";
import Logo from "../components/Logo.jsx";

const VALORES = [
  ["🛠️", "El oficio es una carrera", "En México hay millones de técnicos extraordinarios sin forma de demostrar lo que saben hacer. Habilis convierte cada trabajo bien hecho en reputación verificable."],
  ["🤝", "Confianza verificable", "No vendemos anuncios de \"el mejor plomero\". Mostramos trabajos reales, con fotos reales, validados por clientes reales y moderados con inteligencia artificial."],
  ["🇲🇽", "Hecho en México", "Nacimos en Cancún, Quintana Roo, para resolver un problema mexicano: encontrar un técnico confiable no debería depender de la suerte."],
];

const OFRECEMOS = [
  ["Para técnicos", [
    "Un perfil profesional que muestra tu trabajo real, no promesas",
    "Documentación de trabajos con fotos, incluso por voz",
    "Cotizaciones profesionales generadas en minutos",
    "Prioridad en búsquedas y leads con el plan Pro",
    "Una red de colaboradores de tu oficio y tu ciudad",
  ]],
  ["Para clientes", [
    "Búsqueda gratuita de técnicos por oficio y ciudad",
    "Historial de trabajos documentados antes de contratar",
    "Contacto directo, sin comisiones ni intermediarios",
    "Habilis Care: mantenimiento preventivo de tus equipos",
    "Chat integrado para acordar los detalles",
  ]],
  ["Para empresas", [
    "Técnicos con historial documentado para mantenimiento recurrente",
    "Cotizaciones formales con desglose e IVA",
    "Factura CFDI disponible en planes de pago",
    "Historial y trazabilidad de cada servicio",
    "Soporte prioritario en español",
  ]],
];

const SEC = { maxWidth:"1000px", margin:"0 auto", padding:"0 20px" };
const H2S = { fontSize:"clamp(22px,3.5vw,30px)", fontWeight:900, color:"#0F172A", marginBottom:"14px" };

export default function QuienesSomos({ nav, user, params = {} }) {
  const refOfrecemos = useRef(null);

  // "Lo que ofrecemos" es la misma página: al llegar desde ese enlace,
  // baja a la sección en vez de dejar al usuario en el inicio.
  useEffect(() => {
    if (params.seccion === "ofrecemos" && refOfrecemos.current) {
      refOfrecemos.current.scrollIntoView({ behavior:"smooth", block:"start" });
    }
  }, [params.seccion]);

  return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <Nav nav={nav} user={user} />

      {/* Hero */}
      <div style={{ background:"#0A1120", padding:"72px 20px 80px", textAlign:"center" }}>
        <p style={{ fontSize:"12px", fontWeight:800, color:"#F07020", letterSpacing:"0.12em",
                    textTransform:"uppercase", marginBottom:"14px" }}>Acerca de Habilis</p>
        <h1 style={{ fontSize:"clamp(28px,5vw,44px)", fontWeight:900, color:"#fff",
                     maxWidth:"720px", margin:"0 auto 16px", lineHeight:1.15 }}>
          Quiénes somos
        </h1>
        <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.65)", maxWidth:"640px",
                    margin:"0 auto", lineHeight:1.7 }}>
          Habilis es la infraestructura de confianza para trabajadores técnicos en México:
          una plataforma donde el trabajo bien hecho se documenta, se verifica y se convierte
          en más trabajo.
        </p>
      </div>

      {/* Misión */}
      <div style={{ ...SEC, marginTop:"-36px", marginBottom:"56px" }}>
        <div className="h-card" style={{ padding:"clamp(24px,5vw,44px)" }}>
          <h2 style={H2S}>Nuestra misión</h2>
          <p style={{ fontSize:"15px", color:"#475569", lineHeight:1.8, marginBottom:"12px" }}>
            Dignificar el trabajo técnico. Un electricista con 20 años de experiencia debería
            poder demostrarlo con la misma facilidad con la que un ingeniero muestra su título.
            Por eso construimos una plataforma donde cada instalación, cada reparación y cada
            mantenimiento queda documentado con evidencia — y donde los clientes pueden elegir
            con información real en lugar de recomendaciones al azar.
          </p>
          <p style={{ fontSize:"15px", color:"#475569", lineHeight:1.8 }}>
            Cobramos únicamente por visibilidad y herramientas — nunca comisión por trabajo.
            El precio, los tiempos y el trato los acuerdan técnico y cliente directamente.
          </p>

          <div style={{ marginTop:"18px", background:"#FFF7ED", border:"1px solid #FDBA74",
                        borderRadius:"12px", padding:"18px 20px" }}>
            <p style={{ fontSize:"13px", fontWeight:800, color:"#9A3412", marginBottom:"6px",
                        letterSpacing:"0.04em", textTransform:"uppercase" }}>
              Somos la plataforma, no el prestador del servicio
            </p>
            <p style={{ fontSize:"14px", color:"#7C2D12", lineHeight:1.7 }}>
              Igual que otras plataformas de intermediación tecnológica, Habilis conecta a
              técnicos independientes con clientes: no ejecutamos los trabajos, no empleamos a
              los técnicos y <strong>no nos hacemos responsables del servicio prestado</strong>.
              Cada técnico responde por su propio trabajo, y la plataforma te da las herramientas
              para elegirlo bien: historial documentado, validaciones y moderación con IA.
            </p>
          </div>
        </div>
      </div>

      {/* Valores */}
      <div style={{ ...SEC, marginBottom:"64px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"18px" }}>
          {VALORES.map(([emoji, titulo, texto]) => (
            <div key={titulo} className="h-card" style={{ padding:"26px" }}>
              <div style={{ fontSize:"30px", marginBottom:"12px" }}>{emoji}</div>
              <h3 style={{ fontSize:"16px", fontWeight:800, color:"#0F172A", marginBottom:"8px" }}>{titulo}</h3>
              <p style={{ fontSize:"14px", color:"#64748B", lineHeight:1.7 }}>{texto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lo que ofrecemos */}
      <div ref={refOfrecemos} style={{ ...SEC, marginBottom:"72px", scrollMarginTop:"76px" }}>
        <h2 style={{ ...H2S, textAlign:"center" }}>Lo que ofrecemos</h2>
        <p style={{ fontSize:"15px", color:"#64748B", textAlign:"center", maxWidth:"560px",
                    margin:"0 auto 32px", lineHeight:1.7 }}>
          Una sola plataforma, tres formas de usarla.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"18px" }}>
          {OFRECEMOS.map(([titulo, items]) => (
            <div key={titulo} className="h-card" style={{ padding:"26px" }}>
              <h3 style={{ fontSize:"15px", fontWeight:800, color:"#F07020", marginBottom:"14px",
                           textTransform:"uppercase", letterSpacing:"0.06em" }}>{titulo}</h3>
              <ul style={{ listStyle:"none" }}>
                {items.map(item => (
                  <li key={item} style={{ display:"flex", gap:"10px", fontSize:"14px",
                                          color:"#475569", lineHeight:1.6, marginBottom:"10px" }}>
                    <span style={{ color:"#16A34A", fontWeight:800, flexShrink:0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:"#0A1120", padding:"56px 20px", textAlign:"center" }}>
        <h2 style={{ fontSize:"clamp(20px,3.5vw,28px)", fontWeight:900, color:"#fff", marginBottom:"10px" }}>
          ¿Quieres saber cómo funciona?
        </h2>
        <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.6)", marginBottom:"24px" }}>
          Te lo mostramos paso a paso, tanto si eres técnico como si buscas uno.
        </p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          <button className="h-btn-orange" style={{ padding:"12px 26px", fontSize:"14px" }}
            onClick={() => nav("comoFunciona")}>
            Cómo funciona la app
          </button>
          <button onClick={() => nav("registro")}
            style={{ background:"none", border:"1.5px solid rgba(255,255,255,0.25)", borderRadius:"10px",
                     padding:"12px 26px", fontSize:"14px", fontWeight:700, color:"#fff", cursor:"pointer" }}>
            Crear mi perfil gratis
          </button>
        </div>
      </div>

      <div style={{ padding:"22px", textAlign:"center", background:"#fff", borderTop:"1px solid #E2E8F0" }}>
        <Logo size={22} textColor="#0A1120" onClick={() => nav("landing")} />
        <p style={{ fontSize:"12px", color:"#94A3B8", marginTop:"8px" }}>© 2026 Habilis · Hecho en México</p>
      </div>
    </div>
  );
}
