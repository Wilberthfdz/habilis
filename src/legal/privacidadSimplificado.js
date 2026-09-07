import { TITULAR } from "./comun.js";

// La LFPDPPP (art. 17) exige poner a disposición un aviso corto en el momento
// de recabar los datos, además del integral. Es lo que se enlaza desde el
// alta.
export default {
  slug: "privacidad-simplificado",
  titulo: "Aviso de Privacidad Simplificado",
  audiencia: "todos",
  resumen: "La versión corta: quién trata tus datos, para qué, y dónde ejercer tus derechos.",
  relacionados: ["privacidad", "cookies"],
  secciones: [
    {
      titulo: "Responsable",
      contenido: [
        `${TITULAR.razonSocial}, ${TITULAR.estado}, con domicilio en ${TITULAR.domicilio}. En tanto concluye la constitución, el responsable es ${TITULAR.operadorProvisional}. Contacto: **${TITULAR.correo}**.`,
      ],
    },
    {
      titulo: "Finalidades principales",
      contenido: [
        "Crear y administrar tu cuenta; mostrar tu perfil profesional si eres técnico; conectar clientes con técnicos; operar el chat, las cotizaciones y las calificaciones; cobrar y facturar la suscripción Pro; moderar contenido y prevenir fraude; atender soporte y reportes; y cumplir obligaciones legales.",
      ],
    },
    {
      titulo: "Finalidades secundarias",
      contenido: [
        "Enviarte comunicaciones sobre novedades y promociones de la plataforma, **solo si marcaste la casilla correspondiente al crear tu cuenta**. Puedes retirar ese consentimiento cuando quieras escribiendo a **" + TITULAR.correo + "** con el asunto \"No enviar comunicaciones\", sin que ello afecte el servicio.",
      ],
    },
    {
      titulo: "Transferencias",
      contenido: [
        "No vendemos tus datos. Los compartimos únicamente con proveedores que nos prestan servicios (infraestructura, autenticación, pagos, facturación, inteligencia artificial) bajo obligación de confidencialidad, y con autoridades cuando la ley lo exige.",
      ],
    },
    {
      titulo: "Tus derechos",
      contenido: [
        "Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos (derechos ARCO) y revocar tu consentimiento. Puedes eliminar tu cuenta tú mismo desde la plataforma. Para lo demás, escribe a **" + TITULAR.correo + "** con el asunto \"Derechos ARCO\". Respondemos en un máximo de 20 días hábiles. También puedes acudir al INAI.",
      ],
    },
    {
      titulo: "Aviso integral",
      contenido: [
        "El Aviso de Privacidad Integral, con el detalle de datos, finalidades, transferencias, ubicación, cookies y conservación, está disponible en la página de Aviso de Privacidad de la plataforma.",
      ],
    },
  ],
};
