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
        "Un cliente elige libremente a quién contrata con base en experiencia, trabajos documentados, calificaciones, precio, cercanía o disponibilidad. Lo que no puede hacer es descartar o maltratar a un técnico por una condición protegida, ni exigir que la plataforma filtre por esas condiciones.",
      ],
    },
    {
      titulo: "4. Accesibilidad",
      contenido: [
        "Trabajamos para que la plataforma sea usable por personas con discapacidad: tamaños de texto legibles, contraste suficiente, controles operables con teclado y compatibilidad con lectores de pantalla. Ofrecemos el registro y la documentación de trabajos **por voz** precisamente para quien tiene dificultad para escribir. Si encuentras una barrera de accesibilidad, escríbenos a **" + TITULAR.correo + "**: la atendemos con prioridad.",
        "Los técnicos deben hacer los ajustes razonables que un cliente con discapacidad les pida para recibir el servicio (por ejemplo, comunicarse por escrito, permitir un acompañante, explicar el trabajo con más detalle).",
      ],
    },
    {
      titulo: "5. Reportes y consecuencias",
      contenido: [
        "Los reportes de discriminación se investigan con prioridad y confidencialidad conforme a la Política de Seguridad e Incidentes. La discriminación verificada es causa de **desactivación definitiva** de la cuenta, sea de técnico o de cliente. Habilis no tolera represalias contra quien reporta de buena fe.",
      ],
    },
  ],
};
