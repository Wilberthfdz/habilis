import { TITULAR } from "./comun.js";

export default {
  slug: "cookies",
  titulo: "Política de Cookies y Tecnologías Similares",
  audiencia: "todos",
  resumen: "Qué guarda la plataforma en tu navegador o teléfono, para qué, y cómo controlarlo.",
  relacionados: ["privacidad"],
  secciones: [
    {
      titulo: "1. Qué usamos",
      contenido: [
        "- **Almacenamiento de sesión.** Para mantenerte con la sesión iniciada y recordar tu tipo de cuenta mientras navegas. Se borra al cerrar el navegador o al cerrar sesión.",
        "- **Cookies de nuestros proveedores de infraestructura y autenticación**, necesarias para que el inicio de sesión (correo, Google, Apple) y la base de datos funcionen y para prevenir fraude.",
        "- **Cookies del procesador de pagos**, únicamente en la página de pago, para completar y proteger la transacción.",
        "- **Cookies de las tiendas de aplicaciones**, dentro de la app, para gestionar la suscripción.",
      ],
    },
    {
      titulo: "2. Qué no usamos",
      contenido: [
        "**No usamos cookies de publicidad ni de seguimiento entre sitios, no vendemos datos de navegación y no mostramos anuncios.** Si en el futuro incorporamos herramientas de analítica para entender cómo se usa la plataforma, lo diremos aquí antes de activarlas y ofreceremos la forma de rechazarlas.",
      ],
    },
    {
      titulo: "3. Cómo controlarlo",
      contenido: [
        "Puedes bloquear o borrar cookies y almacenamiento local desde la configuración de tu navegador. Si lo haces, no podrás mantener la sesión iniciada y algunas funciones no estarán disponibles. En la app, los datos locales se eliminan al desinstalarla.",
      ],
    },
    {
      titulo: "4. Contacto",
      contenido: [
        "Dudas sobre esta Política: **" + TITULAR.correo + "**. El tratamiento de datos personales se rige por el Aviso de Privacidad.",
      ],
    },
  ],
};
