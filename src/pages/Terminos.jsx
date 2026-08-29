import Logo from "../components/Logo.jsx";

const ACTUALIZADO = "23 de agosto de 2026";

const H2 = { fontSize:"17px", fontWeight:800, color:"#0F172A", margin:"30px 0 10px" };
const H3 = { fontSize:"14.5px", fontWeight:800, color:"#334155", margin:"18px 0 8px" };
const P  = { fontSize:"14px", color:"#475569", lineHeight:1.75, marginBottom:"10px" };
const LI = { fontSize:"14px", color:"#475569", lineHeight:1.75, marginBottom:"6px" };

const INDICE = [
  "1. Relación contractual",
  "2. Los Servicios",
  "3. Uso de los Servicios",
  "4. Pagos",
  "5. Renuncias; limitación de responsabilidad; indemnización",
  "6. Resolución de controversias",
  "7. Disposiciones generales",
];

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
            Términos y Condiciones de Uso
          </h1>
          <p style={{ fontSize:"12px", color:"#94A3B8", marginBottom:"20px" }}>
            Última actualización: {ACTUALIZADO}
          </p>

          <div style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:"12px",
                        padding:"16px 20px", marginBottom:"8px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"#64748B", letterSpacing:"0.06em",
                        textTransform:"uppercase", marginBottom:"8px" }}>Contenido</p>
            {INDICE.map(item => (
              <p key={item} style={{ fontSize:"13px", color:"#475569", lineHeight:1.9 }}>{item}</p>
            ))}
          </div>

          <h2 style={H2}>1. Relación contractual</h2>
          <p style={P}>
            Estos Términos y Condiciones de Uso ("Términos") regulan el acceso y uso que tú, como
            persona física, hagas desde México de la plataforma Habilis, disponible en el sitio
            <strong> myhabilis.com</strong> y sus aplicaciones asociadas (los "Servicios"),
            operados por Habilis Tecnology, S.A.P.I. de C.V., sociedad en proceso de
            constitución (el "Titular"), con domicilio de contacto en Cancún, Quintana Roo,
            México, y correo <strong>habilisempresa@gmail.com</strong>. En tanto concluye la
            constitución de la sociedad, el operador de la plataforma es Wilberth Fernández
            Quen, con el mismo domicilio y contacto.
          </p>
          <p style={P}>
            <strong>Al acceder o usar los Servicios aceptas quedar obligado por estos Términos</strong>,
            que establecen una relación contractual entre tú y el Titular. Si no los aceptas, no
            puedes acceder ni usar los Servicios. Estos Términos sustituyen expresamente cualquier
            acuerdo previo entre nosotros respecto del uso de la plataforma.
          </p>
          <p style={P}>
            El Titular podrá modificar estos Términos en cualquier momento. La versión vigente
            estará siempre publicada en esta página con su fecha de actualización. El uso continuado
            de los Servicios después de una modificación constituye tu aceptación de los Términos
            modificados. El Aviso de Privacidad, disponible en <strong>/privacidad</strong>, forma
            parte integral de estos Términos.
          </p>

          <h2 style={H2}>2. Los Servicios</h2>
          <p style={P}>
            Habilis es una plataforma tecnológica de reputación profesional para trabajadores
            técnicos en México. Funciona como una bolsa de trabajo especializada: el técnico crea su
            perfil y documenta sus trabajos con evidencia; el cliente lo encuentra por oficio y
            ciudad y lo contacta directamente. Los Servicios incluyen, entre otros: perfiles
            profesionales, búsqueda, feed de trabajos, chat, generación de cotizaciones,
            recordatorios de mantenimiento (Habilis Care), herramientas asistidas por inteligencia
            artificial y soporte.
          </p>
          <h3 style={H3}>2.1 Habilis no presta los servicios técnicos ni intermedia el pago</h3>
          <p style={P}>
            <strong>Reconoces que Habilis no presta servicios técnicos, no emplea a los técnicos,
            no cobra comisión por trabajo, no intermedia pagos entre técnico y cliente, y no es
            parte de la relación contractual entre ellos.</strong> Los técnicos actúan como
            contratistas independientes, por cuenta propia; no existe entre ellos y Habilis
            relación laboral, de agencia ni de sociedad. El acuerdo, precio, tiempos, garantía y
            calidad del servicio técnico son responsabilidad exclusiva del técnico y del cliente.
          </p>
          <h3 style={H3}>2.2 Licencia</h3>
          <p style={P}>
            Sujeto al cumplimiento de estos Términos, el Titular te otorga una licencia limitada,
            no exclusiva, revocable e intransferible para acceder y usar los Servicios para tu uso
            personal o profesional dentro de la plataforma. Todos los derechos no otorgados
            expresamente quedan reservados.
          </p>
          <h3 style={H3}>2.3 Restricciones</h3>
          <ul style={{ paddingLeft:"20px" }}>
            <li style={LI}>No puedes copiar, modificar, distribuir ni crear obras derivadas del software o del contenido de la plataforma, salvo tu propio contenido.</li>
            <li style={LI}>No puedes usar robots, scrapers ni medios automatizados para extraer datos, ni intentar vulnerar la seguridad de los Servicios.</li>
            <li style={LI}>No puedes usar los Servicios para fines ilícitos, ni revender el acceso a terceros.</li>
          </ul>
          <h3 style={H3}>2.4 Funciones de inteligencia artificial</h3>
          <p style={P}>
            Varias funciones de la plataforma (moderación de contenido, clasificación de
            solicitudes, redacción asistida, asistente de soporte) usan inteligencia artificial.
            Sus resultados son apoyos automatizados que pueden contener errores; no constituyen
            asesoría profesional y las decisiones relevantes (por ejemplo, la suspensión definitiva
            de una cuenta) pueden ser revisadas contactando a soporte.
          </p>

          <h2 style={H2}>3. Uso de los Servicios</h2>
          <h3 style={H3}>3.1 Cuentas de usuario</h3>
          <ul style={{ paddingLeft:"20px" }}>
            <li style={LI}>Debes tener al menos 18 años y capacidad legal para contratar.</li>
            <li style={LI}>La información de registro debe ser veraz, exacta y mantenerse actualizada.</li>
            <li style={LI}>Eres responsable de la actividad de tu cuenta y de mantener la confidencialidad de tus credenciales. Notifica de inmediato cualquier uso no autorizado.</li>
            <li style={LI}>Solo puedes tener una cuenta; no puedes ceder ni transferir tu cuenta a otra persona.</li>
          </ul>
          <h3 style={H3}>3.2 Contenido de usuario y conducta</h3>
          <ul style={{ paddingLeft:"20px" }}>
            <li style={LI}>El perfil, las fotografías y las descripciones deben corresponder a trabajos reales realizados por ti.</li>
            <li style={LI}>Las valoraciones y validaciones deben ser honestas y basadas en experiencias reales.</li>
            <li style={LI}>Está prohibido publicar spam, contenido ofensivo, discriminatorio, político, promociones ajenas, información de terceros sin su consentimiento, o material que no sea trabajo técnico documentado.</li>
            <li style={LI}>Habilis utiliza moderación asistida por inteligencia artificial y puede marcar, ocultar o retirar contenido que incumpla estas reglas, así como suspender o cancelar cuentas reincidentes.</li>
          </ul>
          <h3 style={H3}>3.3 Trabajos regulados</h3>
          <p style={P}>
            Algunos trabajos exigen certificaciones oficiales (por ejemplo, instalaciones de gas o
            media tensión). Habilis muestra la información que los técnicos declaran; el cliente es
            responsable de verificar credenciales cuando el trabajo lo requiera, y el técnico de
            contar con las certificaciones, licencias y permisos aplicables.
          </p>

          <h2 style={H2}>4. Pagos</h2>
          <h3 style={H3}>4.1 Para clientes</h3>
          <p style={P}>
            Buscar y contactar técnicos a través de la plataforma es gratuito. Cualquier pago por
            el servicio técnico se acuerda y realiza directamente entre cliente y técnico, fuera de
            la plataforma.
          </p>
          <h3 style={H3}>4.2 Plan Pro para técnicos</h3>
          <ul style={{ paddingLeft:"20px" }}>
            <li style={LI}>El plan gratuito permite crear perfil y documentar hasta 5 trabajos.</li>
            <li style={LI}>El plan Pro cuesta <strong>$149 MXN al mes</strong> (IVA incluido) y se cobra por suscripción recurrente a través de Mercado Pago, procesador independiente con sus propios términos.</li>
            <li style={LI}>La suscripción se renueva automáticamente cada mes hasta que la canceles. Puedes cancelar en cualquier momento desde Mercado Pago; conservas los beneficios hasta el fin del periodo pagado.</li>
            <li style={LI}>No hay reembolsos por periodos parciales, salvo los casos previstos por la ley aplicable.</li>
            <li style={LI}>El Titular puede modificar el precio del plan Pro notificándolo con al menos 15 días de anticipación; el nuevo precio aplica a partir de la siguiente renovación.</li>
          </ul>
          <h3 style={H3}>4.3 Facturación</h3>
          <p style={P}>
            Si necesitas factura (CFDI), puedes solicitarla desde tu panel proporcionando tus datos
            fiscales (RFC, razón social, código postal, régimen fiscal y uso de CFDI).
          </p>

          <h2 style={H2}>5. Renuncias; limitación de responsabilidad; indemnización</h2>
          <h3 style={H3}>5.1 Renuncia</h3>
          <p style={P}>
            Los Servicios se proporcionan "tal cual" y "según disponibilidad". En la máxima medida
            permitida por la ley, el Titular no garantiza que los Servicios sean ininterrumpidos o
            libres de errores, ni garantiza la calidad, idoneidad, seguridad o capacidad de los
            técnicos, ni la veracidad del contenido publicado por los usuarios.
          </p>
          <h3 style={H3}>5.2 Limitación de responsabilidad</h3>
          <p style={P}>
            En la máxima medida permitida por la ley, el Titular no será responsable por daños
            indirectos, incidentales, especiales o consecuentes, ni por daños derivados de la
            relación entre técnico y cliente o del servicio técnico prestado, ni por pérdida de
            datos o lucro cesante relacionados con el uso de los Servicios. La responsabilidad
            total del Titular frente a un usuario, por cualquier causa, no excederá el monto
            efectivamente pagado por ese usuario al Titular en los 12 meses anteriores al evento
            que la origine. <strong>Nada en estos Términos limita derechos irrenunciables del
            consumidor bajo la Ley Federal de Protección al Consumidor ni la responsabilidad que
            no pueda excluirse conforme a la ley mexicana.</strong>
          </p>
          <h3 style={H3}>5.3 Indemnización</h3>
          <p style={P}>
            Aceptas indemnizar y mantener en paz y a salvo al Titular frente a reclamaciones de
            terceros derivadas de: (i) tu incumplimiento de estos Términos; (ii) el contenido que
            publiques; (iii) tu prestación o contratación de servicios técnicos; o (iv) tu
            violación de derechos de terceros o de la ley aplicable.
          </p>

          <h2 style={H2}>6. Resolución de controversias</h2>
          <p style={P}>
            Antes de iniciar cualquier acción, te pedimos contactarnos en
            <strong> habilisempresa@gmail.com</strong> para intentar resolver la controversia de
            forma directa en un plazo de 30 días naturales. Como consumidor, tienes además a salvo
            tus derechos ante la Procuraduría Federal del Consumidor (PROFECO).
          </p>
          <p style={P}>
            Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier
            controversia que no se resuelva de forma directa se someterá a los tribunales
            competentes de Cancún, Quintana Roo, renunciando a cualquier otro fuero que pudiera
            corresponder, salvo los fueros irrenunciables que la ley conceda al consumidor.
          </p>

          <h2 style={H2}>7. Disposiciones generales</h2>
          <h3 style={H3}>7.1 Propiedad intelectual</h3>
          <p style={P}>
            La marca, el diseño, el software y el contenido propio de Habilis son propiedad de su
            titular. El contenido que publicas sigue siendo tuyo; al publicarlo otorgas a Habilis
            una licencia no exclusiva, gratuita y mundial para alojarlo, reproducirlo y mostrarlo
            dentro de la plataforma con el único fin de operar y promocionar el servicio. Puedes
            terminarla eliminando tu contenido o tu cuenta.
          </p>
          <h3 style={H3}>7.2 Terminación</h3>
          <p style={P}>
            Puedes dejar de usar los Servicios y solicitar la eliminación de tu cuenta en cualquier
            momento escribiendo a soporte. El Titular puede suspender o cancelar tu acceso por
            incumplimiento de estos Términos, notificándotelo, sin perjuicio del periodo de
            suscripción ya pagado cuando la causa no te sea imputable.
          </p>
          <h3 style={H3}>7.3 Notificaciones y contacto</h3>
          <p style={P}>
            Las notificaciones se realizarán a través de la plataforma o al correo asociado a tu
            cuenta. Puedes contactarnos en <strong>habilisempresa@gmail.com</strong>.
          </p>
          <h3 style={H3}>7.4 Divisibilidad y no renuncia</h3>
          <p style={P}>
            Si alguna disposición de estos Términos se declara inválida, las demás permanecerán en
            vigor. Que el Titular no ejerza un derecho previsto en estos Términos no constituye una
            renuncia a ese derecho.
          </p>

          <div style={{ marginTop:"32px", display:"flex", gap:"12px", flexWrap:"wrap" }}>
            <button onClick={() => nav("privacidad")} className="h-btn-orange"
              style={{ padding:"10px 18px", fontSize:"13px" }}>
              Ver Aviso de Privacidad
            </button>
            <button onClick={() => nav("soporte")}
              style={{ background:"none", border:"1px solid #E2E8F0", borderRadius:"10px",
                       padding:"10px 18px", fontSize:"13px", fontWeight:700, color:"#475569", cursor:"pointer" }}>
              Ir a Soporte
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
