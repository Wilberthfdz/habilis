import Logo from "../components/Logo.jsx";

// Aviso de privacidad conforme a la LFPDPPP (México).
// La SAPI está en proceso de constitución: al quedar inscrita, quitar la
// mención transitoria a la persona física de la sección 1.
const ACTUALIZADO = "4 de septiembre de 2026";

const H2 = { fontSize:"17px", fontWeight:800, color:"#0F172A", margin:"28px 0 10px" };
const P  = { fontSize:"14px", color:"#475569", lineHeight:1.75, marginBottom:"10px" };
const LI = { fontSize:"14px", color:"#475569", lineHeight:1.75, marginBottom:"6px" };

export default function Privacidad({ nav }) {
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
            Aviso de Privacidad
          </h1>
          <p style={{ fontSize:"12px", color:"#94A3B8", marginBottom:"24px" }}>
            Última actualización: {ACTUALIZADO}
          </p>

          <h2 style={H2}>1. Responsable del tratamiento</h2>
          <p style={P}>
            Habilis Tecnology, S.A.P.I. de C.V., sociedad en proceso de constitución con
            domicilio en Cancún, Quintana Roo, México (en adelante "Habilis"), operadora de la
            plataforma <strong>myhabilis.com</strong>, es responsable del tratamiento de tus
            datos personales conforme a la Ley Federal de Protección de Datos Personales en
            Posesión de los Particulares (LFPDPPP). En tanto concluye la constitución de la
            sociedad, el responsable del tratamiento es Wilberth Fernández Quen, con el mismo
            domicilio. Contacto: <strong>habilisempresa@gmail.com</strong>.
          </p>

          <h2 style={H2}>2. Datos que recabamos</h2>
          <ul style={{ paddingLeft:"20px" }}>
            <li style={LI}><strong>Cuenta:</strong> nombre, correo electrónico y contraseña (o tu cuenta de Google/Apple si eliges ese acceso).</li>
            <li style={LI}><strong>Perfil de técnico:</strong> oficio, ciudad, años de experiencia, descripción profesional y fotografía de perfil.</li>
            <li style={LI}><strong>Trabajos documentados:</strong> descripciones y fotografías de los trabajos que decides publicar.</li>
            <li style={LI}><strong>Habilis Care:</strong> datos de los equipos que registras (tipo, marca, modelo, fechas de mantenimiento).</li>
            <li style={LI}><strong>Facturación (opcional):</strong> RFC, razón social, código postal y régimen fiscal, solo si solicitas factura.</li>
            <li style={LI}><strong>Voz (opcional):</strong> si usas el registro por voz, el audio se procesa para transcribir tu perfil y no se almacena.</li>
          </ul>

          <h2 style={H2}>3. Finalidades del tratamiento</h2>
          <ul style={{ paddingLeft:"20px" }}>
            <li style={LI}>Crear y administrar tu cuenta y tu perfil público.</li>
            <li style={LI}>Conectar solicitudes de clientes con técnicos (incluyendo asignación asistida por inteligencia artificial).</li>
            <li style={LI}>Moderar el contenido publicado para mantener la plataforma segura.</li>
            <li style={LI}>Procesar el cobro de la suscripción Pro y emitir facturas cuando lo solicites.</li>
            <li style={LI}>Enviarte notificaciones sobre actividad relevante de tu cuenta.</li>
          </ul>

          <h2 style={H2}>4. Uso de inteligencia artificial</h2>
          <p style={P}>
            Habilis utiliza agentes de inteligencia artificial (Google Gemini) para asignar solicitudes,
            moderar publicaciones, mejorar perfiles y calcular el orden de búsqueda. Estas decisiones
            quedan registradas y puedes solicitar aclaración de cualquiera de ellas escribiéndonos.
          </p>

          <h2 style={H2}>5. Transferencias y encargados</h2>
          <p style={P}>
            Tus datos se procesan con proveedores que actúan como encargados: Google (Firebase y Gemini,
            infraestructura e inteligencia artificial), Mercado Pago (procesamiento de pagos) y
            Facturapi (emisión de CFDI). No vendemos ni compartimos tus datos con terceros para fines
            de mercadotecnia ajenos a Habilis.
          </p>

          <h2 style={H2}>6. Derechos ARCO</h2>
          <p style={P}>
            Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición, así como
            revocar tu consentimiento, escribiendo a <strong>habilisempresa@gmail.com</strong> con el
            asunto "Derechos ARCO". Responderemos en un máximo de 20 días hábiles. También puedes
            editar o eliminar tu perfil directamente desde tu panel.
          </p>

          <h2 style={H2}>7. Cookies y tecnologías de rastreo</h2>
          <p style={P}>
            La plataforma usa almacenamiento local del navegador y cookies estrictamente necesarias
            para mantener tu sesión iniciada y recordar preferencias de la interfaz. También
            utilizamos las cookies que instalan nuestros proveedores de infraestructura y de pagos
            para operar el servicio y prevenir fraude. <strong>No usamos cookies de publicidad ni
            vendemos tus datos a terceros con fines mercadológicos.</strong> Puedes bloquear o
            eliminar cookies desde la configuración de tu navegador; si lo haces, es posible que no
            puedas iniciar sesión ni usar algunas funciones.
          </p>

          <h2 style={H2}>8. Datos personales sensibles</h2>
          <p style={P}>
            <strong>No recabamos datos personales sensibles</strong> —origen racial o étnico, estado
            de salud, creencias religiosas, opiniones políticas, afiliación sindical o preferencia
            sexual—. Te pedimos no incluirlos en tu perfil, en las descripciones de tus trabajos ni
            en las fotografías que subas. Si detectamos datos sensibles o datos de terceros
            publicados sin su consentimiento, retiramos el contenido.
          </p>

          <h2 style={H2}>9. Conservación y seguridad</h2>
          <p style={P}>
            Conservamos tus datos mientras tu cuenta esté activa. La información se almacena en
            infraestructura de Google Cloud con acceso restringido por reglas de seguridad. Las
            contraseñas nunca se almacenan en texto plano.
          </p>

          <h2 style={H2}>10. Cambios a este aviso</h2>
          <p style={P}>
            Cualquier cambio a este aviso se publicará en esta página con su fecha de actualización.
            El uso continuado de la plataforma después de un cambio implica tu conformidad.
          </p>

          <div style={{ marginTop:"32px", display:"flex", gap:"12px", flexWrap:"wrap" }}>
            <button onClick={() => nav("terminos")} className="h-btn-orange"
              style={{ padding:"10px 18px", fontSize:"13px" }}>
              Ver Términos y Condiciones
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
