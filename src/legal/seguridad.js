import { TITULAR } from "./comun.js";

export default {
  slug: "seguridad",
  titulo: "Política de Seguridad e Incidentes",
  audiencia: "todos",
  resumen: "Qué hace Habilis por tu seguridad, qué no puede hacer, y qué pasa cuando ocurre un incidente.",
  relacionados: ["normas-comunidad", "suspension", "terminos-clientes", "terminos-tecnicos"],
  secciones: [
    {
      titulo: "1. Lo que hacemos",
      contenido: [
        "- **Cuentas reales.** Solo existen perfiles de personas que se dieron de alta ellas mismas y aceptaron las normas. Habilis no fabrica perfiles.",
        "- **Verificación de identidad** a petición del técnico, cotejando una identificación oficial.",
        "- **Moderación** automatizada de todo el contenido publicado, con revisión humana cuando el sistema no puede decidir.",
        "- **Registro de la conversación.** Todo lo acordado en el chat queda guardado y sirve como evidencia para ambas partes.",
        "- **Privacidad de la ubicación.** Nunca publicamos dónde vive un técnico ni dónde está un cliente.",
        "- **Atención de reportes** con plazos definidos y consecuencias reales, hasta la desactivación de la cuenta.",
        "- **Cooperación con autoridades** conforme a la ley, cuando lo requieren formalmente.",
      ],
    },
    {
      titulo: "2. Lo que no podemos hacer, dicho claramente",
      contenido: [
        "- **No estamos presentes durante el trabajo.** No supervisamos, no inspeccionamos, no acompañamos.",
        "- **No verificamos antecedentes penales** ni la capacidad técnica de nadie. El distintivo Verificado acredita identidad, no conducta ni competencia.",
        "- **No aseguramos.** Habilis no ofrece seguro de responsabilidad civil, de accidentes ni de daños. Un técnico que quiera estar cubierto debe contratar el suyo; un cliente que quiera protección adicional debe pedírselo al técnico o contratarla por su cuenta.",
        "- **No intermediamos el pago**, así que no podemos retener, reembolsar ni garantizar dinero entre técnico y cliente.",
      ],
    },
    {
      titulo: "3. Recomendaciones para clientes",
      contenido: [
        "- Revisa trabajos documentados y calificaciones antes de contratar.",
        "- Acuerda todo por escrito en el chat: alcance, precio, fecha, materiales, garantía.",
        "- Pide identificación al técnico cuando llegue y compárala con su perfil.",
        "- Para trabajos regulados, pide la certificación oficial. No aceptes \"sí sé hacerlo\" como sustituto.",
        "- Evita pagar el total por adelantado. Un anticipo razonable por materiales es normal; el pago completo antes de empezar, no.",
        "- Si algo te hace sentir inseguro, detén el trabajo. No necesitas justificarlo.",
      ],
    },
    {
      titulo: "4. Recomendaciones para técnicos",
      contenido: [
        "- Confirma por escrito qué harás y a qué precio antes de ir.",
        "- Avisa a alguien de confianza a dónde vas y con quién.",
        "- Si el trabajo pedido requiere una certificación que no tienes, recházalo. Es tu responsabilidad legal.",
        "- Si al llegar el trabajo es distinto del acordado, o percibes un riesgo, puedes retirarte. Explícalo en el chat para que quede registrado.",
        "- Documenta el antes y el después: te protege ante cualquier reclamación.",
      ],
    },
    {
      titulo: "5. Emergencias",
      contenido: [
        "Ante un riesgo inmediato para la vida o la integridad de alguien, **llama al 911**. Habilis no es un servicio de emergencia y no puede enviar ayuda. Cuando estés a salvo, repórtanos lo ocurrido.",
      ],
    },
    {
      titulo: "6. Cómo reportar un incidente",
      contenido: [
        "Escribe a **" + TITULAR.correo + "** con el asunto \"Incidente\", indicando: quién, cuándo, qué ocurrió y, si la hay, evidencia (capturas, fotos, número de reporte policial). También puedes reportar desde el perfil o la conversación.",
        "- Acusamos recibo en un máximo de **24 horas** y, si hay riesgo para las personas, suspendemos de inmediato la cuenta reportada mientras investigamos.",
        "- Investigamos escuchando a ambas partes y revisando la conversación de la plataforma. Resolvemos en un máximo de **10 días hábiles**.",
        "- Te informamos el resultado en lo que te concierne. Por privacidad de la otra persona, no siempre podremos detallar la medida aplicada.",
        "- Mantenemos la confidencialidad de quien reporta y no toleramos represalias.",
      ],
    },
    {
      titulo: "7. Delitos y autoridades",
      contenido: [
        "Si el incidente puede constituir un delito (robo, lesiones, fraude, agresión), te recomendamos denunciarlo ante el Ministerio Público. Habilis conserva la información relevante y la entrega a la autoridad competente cuando lo requiere formalmente, conforme a la ley y al Aviso de Privacidad. Si tú lo pides, te facilitamos copia de la conversación para tu denuncia.",
      ],
    },
    {
      titulo: "8. Seguridad de la información",
      contenido: [
        "Los datos viajan cifrados. Los datos de tarjeta nunca pasan por Habilis: los maneja el procesador de pagos o la tienda de aplicaciones. El acceso a la base de datos está restringido por reglas que se prueban de forma automatizada en cada cambio. Si detectamos una vulneración de seguridad que afecte tus datos personales, te lo notificaremos conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
      ],
    },
  ],
};
