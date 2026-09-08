import { TITULAR } from "./comun.js";

export default {
  slug: "no-discriminacion",
  titulo: "Política de No Discriminación y Accesibilidad",
  audiencia: "todos",
  resumen: "El compromiso de Habilis, y el de cada usuario, de tratar a todas las personas por igual.",
  relacionados: ["normas-comunidad", "suspension"],
  secciones: [
    {
      titulo: "1. Compromiso",
      contenido: [
        "Habilis está abierta a todas las personas. Conforme a la Constitución y a la Ley Federal para Prevenir y Eliminar la Discriminación, **está prohibido negar, condicionar o degradar un servicio, o negarse a contratar a alguien**, por su origen étnico o nacional, color de piel, sexo, género, identidad o expresión de género, orientación sexual, edad, discapacidad, condición social o económica, condición de salud, embarazo, lengua, religión, opiniones, estado civil, apariencia física, situación migratoria o cualquier otra condición protegida.",
        "Esto obliga a Habilis en la operación de la plataforma, a los técnicos al decidir qué solicitudes atienden y cómo atienden a sus clientes, y a los clientes al decidir a quién contratan y cómo lo tratan.",
      ],
    },
    {
      titulo: "2. Qué sí puede decidir un técnico",
      contenido: [
        "Un técnico es independiente y puede rechazar una solicitud por razones legítimas: no domina ese tipo de trabajo, no tiene disponibilidad, la distancia no le conviene, el trabajo requiere una certificación que no tiene, o percibe un riesgo real para su seguridad. Lo que no puede hacer es rechazarla, o tratar peor al cliente, por una condición protegida.",
      ],
    },
    {
      titulo: "3. Qué sí puede decidir un cliente",
      contenido: [
        "Un cliente elige libremente a quién contrata con base en experiencia, trabajos documentados, calificaciones, precio, cercanía o disponibilidad. Lo que no puede hacer es descartar o maltratar a un técnico por una condición protegida, ni exigir que la plataforma filtre por esas condiciones para excluir a alguien.",
        "La única excepción es la búsqueda **Habilis Incluyente**, descrita en la sección 5: una medida de inclusión, permitida por la Ley Federal para Prevenir y Eliminar la Discriminación, que sirve para encontrar a técnicos con discapacidad que eligieron mostrarlo, nunca para dejarlos fuera.",
      ],
    },
    {
      titulo: "4. Accesibilidad",
      contenido: [
        "Trabajamos para que la plataforma sea usable por personas con discapacidad: tamaños de texto legibles, contraste suficiente, controles operables con teclado, etiquetas para lectores de pantalla y respeto a la preferencia de reducir animaciones. Ofrecemos el registro y la documentación de trabajos **por voz** precisamente para quien tiene dificultad para escribir. Si encuentras una barrera de accesibilidad, escríbenos a **" + TITULAR.correo + "**: la atendemos con prioridad.",
        "Los técnicos deben hacer los ajustes razonables que un cliente con discapacidad les pida para recibir el servicio (por ejemplo, comunicarse por escrito, permitir un acompañante, explicar el trabajo con más detalle).",
      ],
    },
    {
      titulo: "5. Perfil incluyente y búsqueda Habilis Incluyente",
      contenido: [
        "Un técnico que vive con una discapacidad puede activar en su perfil la sección **Perfil incluyente**: indicar, si quiere, el tipo de discapacidad y describir cómo trabaja, qué ajustes necesita y en qué destaca. Con eso su perfil muestra la insignia correspondiente y aparece cuando un cliente o una empresa activa la búsqueda Habilis Incluyente.",
        "- **Es voluntario.** Nadie está obligado a declarar una discapacidad, y Habilis nunca la pregunta como requisito. Un técnico con discapacidad que no active la sección tiene exactamente el mismo perfil y las mismas oportunidades que cualquier otro.",
        "- **Es un dato sensible.** Solo se guarda con consentimiento expreso del técnico en una casilla propia, se muestra únicamente donde él decidió y se borra al desactivar la sección. El detalle está en el Aviso de Privacidad.",
        "- **Incluye, no excluye.** El filtro solo añade una condición para encontrar a quien lo activó. No existe, ni existirá, una opción para ocultar a técnicos con discapacidad, y el dato no influye en el orden de los resultados generales.",
        "- **No cambia las reglas de contratación.** El cliente contrata al técnico por su trabajo, con las mismas condiciones, cotizaciones y calificaciones que a cualquier otro. Pagarle menos, exigirle más o tratarlo con condescendencia por su discapacidad es discriminación.",
        "- **Ajustes razonables.** El cliente debe permitir los ajustes que el técnico indicó en su perfil (por ejemplo, comunicarse por escrito, trabajar con un acompañante o realizar el diagnóstico en su taller) siempre que no impidan el servicio.",
        "Habilis no verifica la discapacidad ni pide documentos médicos. Declarar una discapacidad que no se tiene para obtener una ventaja es información falsa en el perfil y se sanciona conforme a la Política de Suspensión.",
      ],
    },
    {
      titulo: "6. Reportes y consecuencias",
      contenido: [
        "Los reportes de discriminación se investigan con prioridad y confidencialidad conforme a la Política de Seguridad e Incidentes. La discriminación verificada es causa de **desactivación definitiva** de la cuenta, sea de técnico o de cliente. Habilis no tolera represalias contra quien reporta de buena fe.",
      ],
    },
  ],
};
