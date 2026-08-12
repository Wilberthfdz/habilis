import Logo from "../components/Logo.jsx";

const ACTUALIZADO = "12 de agosto de 2026";

const H2 = { fontSize:"17px", fontWeight:800, color:"#0F172A", margin:"28px 0 10px" };
const P  = { fontSize:"14px", color:"#475569", lineHeight:1.75, marginBottom:"10px" };
const LI = { fontSize:"14px", color:"#475569", lineHeight:1.75, marginBottom:"6px" };

export default function Terminos({ nav }) {
  return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <div style={{ padding:"18px 24px", background:"#0F172A" }}>
        <Logo size={28} onClick={() => nav("landing")} />
      </div>

      <div style={{ maxWidth:"760px", margin:"0 auto", padding:"40px 20px 80px" }}>
        <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                      padding:"clamp(24px,5vw,48px)" }}>
          <p style={{ fontSize:"11px", fontWeight:800, color:"#F97316", letterSpacing:"0.1em",
                      textTransform:"uppercase", marginBottom:"8px" }}>Legal</p>
          <h1 style={{ fontSize:"26px", fontWeight:900, color:"#0F172A", marginBottom:"4px" }}>
            Términos y Condiciones
          </h1>
          <p style={{ fontSize:"12px", color:"#94A3B8", marginBottom:"24px" }}>
            Última actualización: {ACTUALIZADO}
          </p>

          <h2 style={H2}>1. Qué es Habilis</h2>
          <p style={P}>
            Habilis (myhabilis.com) es una plataforma de reputación profesional para trabajadores
            técnicos en México. Funciona como una bolsa de trabajo especializada: el técnico crea su
            perfil y documenta sus trabajos; el cliente lo encuentra y lo contacta directamente.
          </p>

          <h2 style={H2}>2. Habilis no es intermediario del servicio</h2>
          <p style={P}>
            Habilis cobra únicamente por dar acceso y visibilidad en la plataforma.
            <strong> No cobra comisión por trabajo, no intermedia pagos entre técnico y cliente,
            y no es parte de la relación contractual entre ellos.</strong> El acuerdo, precio,
            garantía y calidad del servicio son responsabilidad exclusiva del técnico y del cliente.
            Habilis no responde por el servicio prestado.
          </p>

          <h2 style={H2}>3. Cuentas y veracidad</h2>
          <ul style={{ paddingLeft:"20px" }}>
            <li style={LI}>Debes ser mayor de 18 años y proporcionar información veraz.</li>
            <li style={LI}>Eres responsable de mantener la confidencialidad de tu contraseña.</li>
            <li style={LI}>El perfil, las fotografías y las descripciones deben corresponder a trabajos reales realizados por ti.</li>
          </ul>

          <h2 style={H2}>4. Contenido y moderación</h2>
          <p style={P}>
            Solo se permite contenido real de trabajo técnico. Está prohibido publicar spam, contenido
            ofensivo, político, promociones ajenas o material que no sea trabajo técnico documentado.
            Habilis utiliza moderación asistida por inteligencia artificial y puede marcar, ocultar o
            retirar contenido que incumpla estas reglas, así como suspender cuentas reincidentes.
          </p>

          <h2 style={H2}>5. Plan Pro y pagos</h2>
          <ul style={{ paddingLeft:"20px" }}>
            <li style={LI}>El plan gratuito permite crear perfil y documentar trabajos.</li>
            <li style={LI}>El plan Pro cuesta <strong>$100 MXN al mes</strong> (IVA incluido) y se cobra por suscripción recurrente a través de Mercado Pago.</li>
            <li style={LI}>Puedes cancelar en cualquier momento desde Mercado Pago; conservas los beneficios hasta el fin del periodo pagado. No hay reembolsos por periodos parciales.</li>
            <li style={LI}>Si necesitas factura (CFDI), puedes solicitarla desde tu panel proporcionando tus datos fiscales.</li>
          </ul>

          <h2 style={H2}>6. Para clientes</h2>
          <p style={P}>
            El uso de la plataforma para buscar y contactar técnicos es gratuito. Las valoraciones y
            validaciones deben ser honestas y basadas en experiencias reales. Habilis muestra
            información que los técnicos declaran; verifica credenciales cuando el trabajo lo requiera
            (por ejemplo, instalaciones de gas o media tensión exigen certificaciones oficiales).
          </p>

          <h2 style={H2}>7. Limitación de responsabilidad</h2>
          <p style={P}>
            La plataforma se ofrece "tal cual". En la máxima medida permitida por la ley, Habilis no
            será responsable por daños derivados de la relación entre técnico y cliente, por la
            veracidad del contenido publicado por los usuarios, ni por interrupciones temporales del
            servicio. Nada en estos términos limita derechos irrenunciables del consumidor bajo la ley mexicana.
          </p>

          <h2 style={H2}>8. Propiedad intelectual</h2>
          <p style={P}>
            La marca, el diseño y el software de Habilis son propiedad de su titular. El contenido que
            publicas sigue siendo tuyo; al publicarlo otorgas a Habilis una licencia para mostrarlo
            dentro de la plataforma con el fin de operar el servicio.
          </p>

          <h2 style={H2}>9. Ley aplicable</h2>
          <p style={P}>
            Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier
            controversia se someterá a los tribunales competentes de Cancún, Quintana Roo.
            Contacto: <strong>habilisempresa@gmail.com</strong>.
          </p>

          <div style={{ marginTop:"32px", display:"flex", gap:"12px", flexWrap:"wrap" }}>
            <button onClick={() => nav("privacidad")} className="h-btn-orange"
              style={{ padding:"10px 18px", fontSize:"13px" }}>
              Ver Aviso de Privacidad
            </button>
            <button onClick={() => nav("landing")}
              style={{ background:"none", border:"1px solid #E2E8F0", borderRadius:"10px",
                       padding:"10px 18px", fontSize:"13px", fontWeight:700, color:"#475569", cursor:"pointer" }}>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
