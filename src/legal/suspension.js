import { TITULAR } from "./comun.js";

export default {
  slug: "suspension",
  titulo: "Política de Suspensión y Desactivación de Cuentas",
  audiencia: "todos",
  resumen: "Por qué se puede suspender o desactivar una cuenta, cómo te enteras y cómo pides revisión.",
  relacionados: ["normas-comunidad", "terminos-tecnicos", "terminos-clientes", "seguridad"],
  secciones: [
    {
      titulo: "1. Principio: nadie pierde su cuenta sin saber por qué",
      contenido: [
        "Suspender o desactivar una cuenta es la medida más seria que puede tomar Habilis, y para un técnico puede significar perder ingresos. Por eso esta Política fija causas, plazos y un procedimiento que incluye siempre el derecho a responder y a que una persona revise la decisión. Aplica a técnicos y clientes.",
      ],
    },
    {
      titulo: "2. Tipos de medida",
      contenido: [
        "- **Advertencia.** Aviso escrito por un incumplimiento menor o una primera vez. No limita el uso de la cuenta.",
        "- **Retiro de contenido.** Se oculta o elimina una publicación, calificación o mensaje que incumple las normas. La cuenta sigue activa.",
        "- **Suspensión temporal.** La cuenta deja de ser visible y de poder operar por un plazo definido (de 3 a 30 días) mientras se investiga un reporte o como consecuencia de un incumplimiento. Una suscripción Pro activa no se cobra durante la suspensión que exceda de 7 días, o se compensa al reactivarse.",
        "- **Desactivación.** La cuenta se cierra de forma definitiva. La persona no puede volver a registrarse con la misma identidad.",
      ],
    },
    {
      titulo: "3. Causas de suspensión temporal",
      contenido: [
        "- Reporte verosímil de un cliente o técnico que requiere investigación.",
        "- Incumplimiento de las Normas de la Comunidad que no ponga en riesgo a las personas.",
        "- Indicios de manipulación de calificaciones o validaciones.",
        "- Contenido reiteradamente rechazado por moderación después de advertencia.",
        "- Datos de perfil que no coinciden con la identidad de la persona, mientras se aclara.",
        "- No responder a una solicitud de aclaración de Habilis en 10 días hábiles.",
      ],
    },
    {
      titulo: "4. Causas de desactivación",
      contenido: [
        "- Violencia, acoso, agresión sexual o amenazas, verificadas.",
        "- Fraude: cobrar y no realizar el trabajo, cobrar por trabajo no hecho, o engañar deliberadamente sobre el servicio.",
        "- Suplantación de identidad o perfiles con datos de otra persona.",
        "- Realizar trabajos regulados sin la certificación que exige la ley.",
        "- Discriminación verificada.",
        "- Publicar trabajos ajenos como propios de forma reiterada.",
        "- Compra, venta o intercambio de calificaciones.",
        "- Tercera suspensión temporal en 12 meses.",
        "- Uso de la plataforma para actividades ilegales.",
        "- Requerimiento de autoridad competente.",
      ],
    },
    {
      titulo: "5. Procedimiento ordinario",
      contenido: [
        "1. **Aviso.** Te notificamos por correo y en la plataforma: qué conducta se te atribuye, qué norma incumple y qué medida se propone.",
        "2. **Respuesta.** Tienes **5 días hábiles** para responder por escrito a **" + TITULAR.correo + "**, aportar lo que consideres y, si quieres, pedir hablar con una persona.",
        "3. **Decisión.** Una persona —no un sistema automatizado— revisa tu respuesta y decide en un máximo de **10 días hábiles**. Te comunicamos la decisión y su motivo.",
        "4. **Revisión.** Si no estás de acuerdo, puedes pedir una segunda revisión dentro de los 10 días hábiles siguientes; la hace una persona distinta de la que decidió. Su resolución es definitiva dentro de Habilis, sin perjuicio de tus derechos ante las autoridades.",
        "Mientras dura el procedimiento tu cuenta puede quedar suspendida temporalmente si el reporte lo justifica; si la decisión final te favorece, se reactiva de inmediato y se compensa cualquier cobro de suscripción del periodo.",
      ],
    },
    {
      titulo: "6. Procedimiento urgente",
      contenido: [
        "Cuando hay riesgo para la seguridad de las personas, indicios de delito, fraude en curso o requerimiento de autoridad, Habilis puede **suspender la cuenta de inmediato y sin aviso previo**. En ese caso te notificamos en un máximo de 48 horas y el resto del procedimiento (respuesta, decisión, revisión) sigue igual.",
      ],
    },
    {
      titulo: "7. Decisiones automatizadas",
      contenido: [
        "Los sistemas automatizados de Habilis pueden retirar contenido y marcar cuentas para revisión, pero **ninguna suspensión ni desactivación es decidida únicamente por un sistema automatizado**: siempre la confirma una persona. Tienes derecho a saber si en tu caso intervino un sistema automatizado y a que una persona lo revise.",
      ],
    },
    {
      titulo: "8. Efectos de la desactivación",
      contenido: [
        "- El perfil deja de ser visible. Los trabajos documentados dejan de mostrarse.",
        "- Una suscripción Pro activa se cancela; no hay reembolso del periodo en curso cuando la causa es imputable al usuario.",
        "- Las conversaciones existentes se conservan para la otra parte, con el nombre sustituido por \"Usuario eliminado\".",
        "- Las obligaciones ya contraídas con clientes o técnicos siguen vigentes entre ellos.",
        "- Los datos personales se tratan conforme al Aviso de Privacidad; conservamos lo necesario para atender reclamaciones y obligaciones legales, y lo relativo a la causa de desactivación para impedir el reingreso.",
      ],
    },
    {
      titulo: "9. Reincorporación",
      contenido: [
        "Una cuenta desactivada por causas distintas de violencia, fraude, suplantación, discriminación o delito puede solicitar reincorporación después de 12 meses, escribiendo a **" + TITULAR.correo + "**. Habilis decide caso por caso.",
      ],
    },
  ],
};
