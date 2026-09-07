import { TITULAR } from "./comun.js";

export default {
  slug: "contenido",
  titulo: "Política de Contenido y Propiedad Intelectual",
  audiencia: "todos",
  resumen: "De quién es lo que se publica, qué puede publicarse, y cómo reclamar contenido que te pertenece.",
  relacionados: ["normas-comunidad", "terminos-tecnicos", "suspension"],
  secciones: [
    {
      titulo: "1. Tu contenido es tuyo",
      contenido: [
        "Las fotos, descripciones, cotizaciones, mensajes y calificaciones que publicas siguen siendo tuyos. Habilis no adquiere su propiedad.",
        "Al publicarlos otorgas al Titular una **licencia no exclusiva, gratuita, mundial y por el tiempo que el contenido permanezca en la plataforma** para alojarlo, reproducirlo, adaptarlo técnicamente (por ejemplo, comprimir una imagen) y mostrarlo dentro de la plataforma con el fin de operarla, y para usarlo en materiales que promocionen la plataforma **sin identificarte por nombre y apellido salvo que lo autorices expresamente**. La licencia termina cuando eliminas el contenido o tu cuenta, salvo por: copias de respaldo que se eliminan en el ciclo normal; contenido que otras personas ya compartieron dentro de la plataforma (por ejemplo, una cotización enviada a un cliente); y lo que debamos conservar por obligación legal.",
      ],
    },
    {
      titulo: "2. Lo que declaras al publicar",
      contenido: [
        "- Que el contenido es tuyo o tienes derecho a usarlo.",
        "- Que los trabajos documentados los realizaste tú.",
        "- Que las personas identificables que aparezcan dieron su consentimiento.",
        "- Que no infringe derechos de autor, marcas, privacidad ni ningún otro derecho de terceros.",
        "Eres responsable de lo que publicas, incluido lo que redacten por ti las herramientas de inteligencia artificial de la plataforma a partir de tus indicaciones.",
      ],
    },
    {
      titulo: "3. Contenido que no se permite",
      contenido: [
        "- Trabajos que no realizaste, fotos tomadas de internet o de otros técnicos.",
        "- Rostros de clientes o terceros, placas, números exteriores, documentos u otros datos que identifiquen a una persona o un domicilio particular, sin consentimiento.",
        "- Contenido sexual, violento, discriminatorio, ilegal o que incite a la violencia.",
        "- Publicidad de terceros, promociones ajenas a tu servicio, cadenas, spam.",
        "- Contenido político, religioso o personal que no sea trabajo técnico documentado.",
        "- Marcas o logotipos de terceros presentados como si te avalaran.",
        "- Datos de contacto en las fotos o descripciones de trabajos para eludir la plataforma (la conversación es el medio previsto).",
      ],
    },
    {
      titulo: "4. Moderación",
      contenido: [
        "Todo el contenido pasa por moderación automatizada antes de mostrarse en público; si el sistema no puede decidir, lo revisa una persona. El contenido rechazado no se publica y el autor recibe el motivo. Puede corregirlo o pedir revisión escribiendo a **" + TITULAR.correo + "**. Habilis también puede retirar contenido ya publicado a raíz de un reporte.",
      ],
    },
    {
      titulo: "5. Reclamar contenido que te pertenece",
      contenido: [
        "Si alguien publicó fotos, textos o trabajos tuyos como propios, o usa tu marca sin permiso, escríbenos a **" + TITULAR.correo + "** con el asunto \"Propiedad intelectual\", indicando: el enlace al contenido; una descripción de tu derecho (autoría, marca, imagen); evidencia razonable (el original con fecha, tu registro de marca, tu identificación si se trata de tu imagen); y tu nombre y contacto.",
        "Retiramos el contenido en un máximo de 5 días hábiles si la reclamación es verosímil, notificamos a quien lo publicó y le damos 5 días hábiles para responder. Si demuestra tener derecho, lo restauramos. Las reclamaciones falsas o de mala fe violan las Normas de la Comunidad.",
      ],
    },
    {
      titulo: "6. Lo que es de Habilis",
      contenido: [
        "La marca Habilis, el logotipo, el diseño de la plataforma, el software, la taxonomía de oficios y los textos propios pertenecen al Titular y están protegidos por la Ley Federal de Protección a la Propiedad Industrial y la Ley Federal del Derecho de Autor. Puedes decir que estás en Habilis y compartir el enlace a tu perfil; no puedes usar la marca de forma que sugiera que Habilis te avala, te emplea o garantiza tu trabajo, ni copiar el diseño o el software.",
      ],
    },
    {
      titulo: "7. Comentarios y sugerencias",
      contenido: [
        "Si nos envías ideas o sugerencias sobre la plataforma, podemos usarlas libremente sin obligación de compensación ni de reconocimiento. No nos envíes ideas que consideres confidenciales.",
      ],
    },
  ],
};
