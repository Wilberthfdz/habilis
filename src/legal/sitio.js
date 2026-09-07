import { QUIEN_ES_EL_TITULAR, TITULAR } from "./comun.js";

export default {
  slug: "sitio",
  titulo: "Términos de Uso del Sitio Web",
  audiencia: "todos",
  resumen: "Las condiciones para quien visita myhabilis.com sin cuenta: navegar, buscar técnicos y leer contenido.",
  relacionados: ["terminos-clientes", "privacidad", "cookies", "contenido"],
  secciones: [
    {
      titulo: "1. Ámbito",
      contenido: [
        QUIEN_ES_EL_TITULAR,
        "Estos Términos aplican a cualquier persona que visite el sitio web o abra la aplicación, tenga o no cuenta. Si creas una cuenta, aplican además los Términos y Condiciones para Clientes o para Técnicos según corresponda.",
      ],
    },
    {
      titulo: "2. Lo que puedes hacer sin cuenta",
      contenido: [
        "Navegar, leer las páginas informativas, buscar técnicos por oficio, ciudad o cercanía, ver perfiles y trabajos documentados, y abrir una cotización que un técnico te haya compartido por enlace. Para contactar a un técnico, pedir un servicio o calificar, necesitas una cuenta.",
      ],
    },
    {
      titulo: "3. Uso permitido",
      contenido: [
        "El sitio es para uso personal o profesional relacionado con contratar u ofrecer servicios técnicos. Está prohibido: extraer datos de perfiles de forma masiva o automatizada; copiar el directorio; usar robots, rastreadores o herramientas similares salvo los motores de búsqueda de uso general; intentar vulnerar la seguridad; usar el sitio para fines ilegales; y enmarcar o reproducir el sitio en otro sin autorización.",
      ],
    },
    {
      titulo: "4. Información publicada",
      contenido: [
        "Los perfiles, trabajos y calificaciones los publican los propios usuarios y son de su responsabilidad. Habilis los modera pero no garantiza su exactitud. La información sobre planes y precios es la vigente al momento de publicarse; la que rige es la que se muestra al contratar. Los textos informativos del sitio no constituyen asesoría legal, técnica ni fiscal.",
      ],
    },
    {
      titulo: "5. Enlaces a terceros",
      contenido: [
        "El sitio puede enlazar a servicios de terceros (procesador de pagos, tiendas de aplicaciones, redes sociales, mensajería). Esos servicios tienen sus propios términos y avisos de privacidad; Habilis no responde por ellos.",
      ],
    },
    {
      titulo: "6. Ubicación",
      contenido: [
        "Si usas \"Cerca de mí\", tu navegador nos pide permiso para conocer tu ubicación. Se usa únicamente para ordenar esa búsqueda y no se guarda ni se asocia a ninguna cuenta.",
      ],
    },
    {
      titulo: "7. Disponibilidad y cambios",
      contenido: [
        "El sitio se ofrece \"tal cual\". Podemos modificarlo, suspenderlo o interrumpirlo, en todo o en parte, en cualquier momento, y actualizar estos Términos publicando la nueva versión con su fecha. El uso posterior implica su aceptación.",
      ],
    },
    {
      titulo: "8. Propiedad intelectual, responsabilidad y ley",
      contenido: [
        "La marca, el diseño, el software y los contenidos propios del sitio pertenecen al Titular. En la máxima medida permitida por la ley, el Titular no responde por daños derivados del uso del sitio o de la imposibilidad de usarlo, ni por el contenido publicado por usuarios. Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos y se someten a los tribunales competentes de Cancún, Quintana Roo, salvo los fueros irrenunciables del consumidor. Contacto: **" + TITULAR.correo + "**.",
      ],
    },
  ],
};
