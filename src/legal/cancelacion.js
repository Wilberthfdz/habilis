import { TITULAR } from "./comun.js";

export default {
  slug: "cancelacion",
  titulo: "Política de Cancelación",
  audiencia: "todos",
  resumen: "Cancelar una solicitud de servicio, cancelar el Plan Pro, cobros indebidos y reembolsos.",
  relacionados: ["terminos-tecnicos", "terminos-clientes", "calificaciones"],
  secciones: [
    {
      titulo: "1. Cancelar una solicitud de servicio",
      contenido: [
        "Una solicitud es una conversación, no una reserva con cargo. **Cancelarla no tiene costo ni penalización en Habilis** para ninguna de las dos partes, porque Habilis no intermedia el pago del servicio.",
        "- **Antes de que el técnico acepte:** el cliente puede simplemente no continuar. El técnico puede indicar que no puede atenderla.",
        "- **Después de aceptada:** cualquiera de los dos puede cancelar desde la conversación. Te pedimos avisar cuanto antes y con una explicación breve: la otra persona organizó su tiempo contando contigo.",
        "- **Si ya se acordó fecha y precio:** cancelar sigue siendo posible, pero las consecuencias económicas (materiales ya comprados, un anticipo entregado, un viaje realizado) se rigen por lo que ustedes hayan acordado y por la ley civil. Habilis no las cobra ni las reembolsa.",
        "Las cancelaciones no afectan la calificación de nadie por sí mismas. Sin embargo, **no presentarse sin avisar** es un incumplimiento de las Normas de la Comunidad y puede dar lugar a advertencia o suspensión, tanto para técnicos como para clientes.",
      ],
    },
    {
      titulo: "2. Cancelar el Plan Pro",
      contenido: [
        "- **Cuándo:** cuando quieras. No hay contrato de permanencia.",
        "- **Cómo:** por el mismo medio por el que contrataste. Si pagaste por la web, con el botón \"Cancelar suscripción\" de tu página de suscripción. Si pagaste en la app, desde los ajustes de suscripciones de tu teléfono (Apple o Google); la app te lleva ahí.",
        "- **Efecto:** no se genera ningún cobro posterior y **conservas los beneficios hasta el fin del periodo ya pagado**. Al vencer, tu cuenta pasa al plan gratuito sin perder tu perfil, tus trabajos ni tus calificaciones; si tienes más de 5 trabajos documentados, todos siguen visibles, pero no podrás publicar nuevos hasta volver a Pro.",
        "- **Reembolsos:** no hay reembolso por periodos parciales, salvo los casos previstos por la ley aplicable o los descritos en la sección 3.",
      ],
    },
    {
      titulo: "3. Cobros indebidos y devoluciones",
      contenido: [
        "Consideramos indebido un cobro duplicado, un cobro posterior a una cancelación confirmada, o un cobro cuando la plataforma estuvo indisponible más de 72 horas continuas en el periodo.",
        "- Escríbenos a **" + TITULAR.correo + "** dentro de los **30 días naturales** siguientes al cargo, con la fecha y el monto.",
        "- Respondemos en un máximo de 5 días hábiles.",
        "- Si procede, gestionamos la devolución con el procesador de pagos (web) o te indicamos cómo solicitarla a la tienda de aplicaciones (app), que es quien realizó el cobro en ese caso. Los tiempos de abono dependen del procesador y de tu banco.",
      ],
    },
    {
      titulo: "4. Cancelación por parte de Habilis",
      contenido: [
        "Habilis puede cancelar una suscripción Pro si la cuenta es desactivada conforme a la Política de Suspensión y Desactivación. Si la causa es imputable al usuario no hay reembolso del periodo en curso. Si Habilis descontinuara el Plan Pro, lo avisaría con al menos 30 días naturales de anticipación y reembolsaría la parte proporcional del periodo no disfrutado.",
      ],
    },
    {
      titulo: "5. Eliminar la cuenta",
      contenido: [
        "Eliminar tu cuenta cancela automáticamente cualquier suscripción activa antes de borrar tus datos. Se hace desde la propia plataforma y no se puede deshacer. Los detalles están en el Aviso de Privacidad.",
      ],
    },
  ],
};
