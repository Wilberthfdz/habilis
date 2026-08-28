import Nav from "../components/Nav.jsx";
import Logo from "../components/Logo.jsx";

const PASOS_TECNICO = [
  ["1", "Crea tu perfil gratis", "Regístrate con tu correo, Google o Apple. Cuéntanos tu oficio y tu ciudad — la IA te ayuda a redactar un perfil profesional, incluso puedes dictarlo por voz."],
  ["2", "Documenta tus trabajos", "Sube fotos de cada trabajo terminado con una descripción corta. La IA lo clasifica y modera; cada trabajo aprobado suma a tu reputación."],
  ["3", "Aparece en búsquedas", "Los clientes te encuentran por oficio y ciudad. Tu historial documentado habla por ti — con el plan Pro apareces con prioridad."],
  ["4", "Recibe y responde solicitudes", "Los clientes te contactan directo por chat. Genera cotizaciones profesionales en minutos y cierra el trato tú mismo, sin comisiones."],
];

const PASOS_CLIENTE = [
  ["1", "Busca sin registrarte", "Entra a Buscar, elige el oficio (17 categorías, 354 especialidades) y tu ciudad. Es gratis, siempre."],
  ["2", "Revisa trabajo real", "Cada técnico muestra trabajos documentados con fotos y validaciones de otros clientes. Nada de anuncios: evidencia."],
  ["3", "Contacta directo", "Escríbele por chat o solicita el servicio describiendo lo que necesitas — la IA lo canaliza al técnico adecuado."],
  ["4", "Acuerden entre ustedes", "El precio, la fecha y la garantía los acuerdan técnico y cliente directamente. Habilis no cobra comisión, no intermedia el pago y no es responsable del trabajo realizado: cada técnico independiente responde por su servicio."],
];

const HERRAMIENTAS = [
  ["🤖", "5 agentes de IA", "Matching de solicitudes, moderación de contenido, verificación de perfiles, recordatorios de mantenimiento y ranking — trabajando 24/7."],
  ["📋", "Cotizaciones Pro", "Genera cotizaciones formales con desglose de conceptos, IVA y tu catálogo de productos."],
  ["🛡️", "Habilis Care", "Registra tus equipos (aires, calentadores, bombas…) y recibe recordatorios de mantenimiento preventivo."],
  ["🎙️", "Registro por voz", "Dicta tu trabajo terminado y la IA lo transcribe, clasifica y publica con tus fotos."],
  ["💬", "Chat integrado", "Conversa con clientes o técnicos dentro de la app, con resúmenes automáticos de cada solicitud."],
  ["🔔", "Notificaciones", "Entérate al momento de solicitudes nuevas, decisiones de moderación y actividad de tu red."],
];

const SEC = { maxWidth:"1000px", margin:"0 auto", padding:"0 20px" };

function Paso({ n, titulo, texto }) {
  return (
    <div style={{ display:"flex", gap:"16px", alignItems:"flex-start" }}>
      <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:"#F07020",
                    color:"#fff", fontWeight:900, fontSize:"15px", display:"flex",
                    alignItems:"center", justifyContent:"center", flexShrink:0 }}>{n}</div>
      <div>
        <h3 style={{ fontSize:"15px", fontWeight:800, color:"#0F172A", marginBottom:"6px" }}>{titulo}</h3>
        <p style={{ fontSize:"14px", color:"#64748B", lineHeight:1.7 }}>{texto}</p>
      </div>
    </div>
  );
}

export default function ComoFunciona({ nav, user }) {
  return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <Nav nav={nav} user={user} />

      <div style={{ background:"#0A1120", padding:"72px 20px 80px", textAlign:"center" }}>
        <p style={{ fontSize:"12px", fontWeight:800, color:"#F07020", letterSpacing:"0.12em",
                    textTransform:"uppercase", marginBottom:"14px" }}>Acerca de Habilis</p>
        <h1 style={{ fontSize:"clamp(28px,5vw,44px)", fontWeight:900, color:"#fff",
                     maxWidth:"720px", margin:"0 auto 16px", lineHeight:1.15 }}>
          Cómo funciona la app
        </h1>
        <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.65)", maxWidth:"620px",
                    margin:"0 auto", lineHeight:1.7 }}>
          Cuatro pasos si eres técnico, cuatro pasos si buscas uno.
          Sin comisiones por trabajo, sin letras chiquitas.
        </p>
      </div>

      <div style={{ ...SEC, marginTop:"-36px", marginBottom:"56px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"18px" }}>
          <div className="h-card" style={{ padding:"clamp(24px,4vw,36px)" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"#F07020", letterSpacing:"0.08em",
                        textTransform:"uppercase", marginBottom:"18px" }}>Si eres técnico</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"22px" }}>
              {PASOS_TECNICO.map(([n, t, x]) => <Paso key={n} n={n} titulo={t} texto={x} />)}
            </div>
          </div>
          <div className="h-card" style={{ padding:"clamp(24px,4vw,36px)" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"#0EA5E9", letterSpacing:"0.08em",
                        textTransform:"uppercase", marginBottom:"18px" }}>Si buscas un técnico</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"22px" }}>
              {PASOS_CLIENTE.map(([n, t, x]) => <Paso key={n} n={n} titulo={t} texto={x} />)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...SEC, marginBottom:"72px" }}>
        <h2 style={{ fontSize:"clamp(22px,3.5vw,30px)", fontWeight:900, color:"#0F172A",
                     textAlign:"center", marginBottom:"8px" }}>Las herramientas dentro de la app</h2>
        <p style={{ fontSize:"14px", color:"#64748B", textAlign:"center", marginBottom:"30px" }}>
          Todo lo que la plataforma hace por ti mientras tú trabajas.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"16px" }}>
          {HERRAMIENTAS.map(([emoji, titulo, texto]) => (
            <div key={titulo} className="h-card" style={{ padding:"22px" }}>
              <div style={{ fontSize:"26px", marginBottom:"10px" }}>{emoji}</div>
              <h3 style={{ fontSize:"15px", fontWeight:800, color:"#0F172A", marginBottom:"6px" }}>{titulo}</h3>
              <p style={{ fontSize:"13.5px", color:"#64748B", lineHeight:1.65 }}>{texto}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:"#0A1120", padding:"56px 20px", textAlign:"center" }}>
        <h2 style={{ fontSize:"clamp(20px,3.5vw,28px)", fontWeight:900, color:"#fff", marginBottom:"10px" }}>
          Pruébalo — te toma 3 minutos
        </h2>
        <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.6)", marginBottom:"24px" }}>
          El plan gratis no pide tarjeta y no caduca.
        </p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          <button className="h-btn-orange" style={{ padding:"12px 26px", fontSize:"14px" }}
            onClick={() => nav("registro")}>
            Crear mi perfil gratis
          </button>
          <button onClick={() => nav("buscar")}
            style={{ background:"none", border:"1.5px solid rgba(255,255,255,0.25)", borderRadius:"10px",
                     padding:"12px 26px", fontSize:"14px", fontWeight:700, color:"#fff", cursor:"pointer" }}>
            Buscar un técnico
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
