import { TITULAR } from "./comun.js";

export default {
  slug: "calificaciones",
  titulo: "Política de Calificaciones y Reputación",
  audiencia: "todos",
  resumen: "Cómo se calcula lo que ves de cada técnico: calificaciones, validaciones, distintivos y orden en los resultados.",
  relacionados: ["terminos-tecnicos", "terminos-clientes", "normas-comunidad", "suspension"],
  secciones: [
    {
      titulo: "1. Principio",
      contenido: [
        "La reputación en Habilis se construye con evidencia que el técnico aporta y con la opinión de los clientes que lo contrataron. **No se compra, no se vende y no se edita a conveniencia.** Esta Política explica cada dato que se muestra y cómo se calcula, para que técnicos y clientes sepan exactamente qué significa.",
      ],
    },
    {
      titulo: "2. Calificaciones de clientes",
      contenido: [
        "- Solo puede calificar el cliente de una solicitud que se marcó como completada a través de la plataforma. Una calificación por solicitud.",
        "- Es de 1 a 5 estrellas con un comentario opcional. Es pública en el perfil del técnico.",
        "- El promedio se calcula sobre todas las calificaciones recibidas y se redondea a un decimal. Un técnico sin calificaciones aparece sin calificación, nunca con un valor supuesto.",
        "- El técnico no puede eliminar una calificación ni pedir que se elimine por no gustarle.",
        "- Se retira una calificación únicamente cuando: contiene insultos, amenazas o datos personales; no se refiere al servicio (por ejemplo, habla de otro técnico o de un tema ajeno); se demuestra que proviene de una cuenta falsa, del propio técnico o de una persona que nunca contrató el servicio; o fue obtenida a cambio de un beneficio. Cualquiera de las partes puede pedir revisión escribiendo a **" + TITULAR.correo + "**.",
        "- Prohibido pedir calificaciones a cambio de descuentos o regalos, condicionar el servicio a una calificación, o calificar como represalia. Ambas partes pueden ser suspendidas por ello.",
      ],
    },
    {
      titulo: "3. Validaciones de trabajos",
      contenido: [
        "Cualquier usuario con cuenta puede marcar un trabajo documentado como \"útil\" o \"bien hecho\". Es un voto por trabajo y por usuario; el propio técnico no puede votar sus trabajos. Coordinarse entre técnicos para validarse mutuamente es manipulación y se sanciona.",
      ],
    },
    {
      titulo: "4. Trabajos documentados y moderación",
      contenido: [
        "El número de trabajos documentados que se muestra es el de publicaciones que superaron la moderación automatizada. Esa moderación revisa que el contenido sea trabajo técnico real, sin datos personales de terceros, sin material inapropiado y sin indicios de plagio. Si el sistema no puede decidir, la publicación queda pendiente de revisión por una persona y no se muestra hasta resolverse. Un trabajo rechazado no cuenta y no aparece en público; el técnico ve el motivo y puede corregirlo.",
      ],
    },
    {
      titulo: "5. Distintivos",
      contenido: [
        "- **Verificado**: identidad cotejada contra una identificación oficial y contacto confirmado, por revisión manual a petición del técnico. Acredita quién es, no cómo trabaja.",
        "- **Pro**: suscripción de pago activa. Da herramientas y prioridad en los resultados. No es un sello de calidad ni una recomendación de Habilis.",
        "Un distintivo se retira si la información que lo respalda resulta falsa o deja de estar vigente.",
      ],
    },
    {
      titulo: "6. Orden en los resultados de búsqueda",
      contenido: [
        "El orden lo calcula un proceso automatizado con una fórmula fija y pública. A cada técnico se le asigna un puntaje sumando:",
        "- Trabajos documentados aprobados: 3 puntos cada uno.",
        "- Validaciones de clientes: 2 puntos cada una.",
        "- Años de experiencia declarados: medio punto por año, hasta 30 años.",
        "- Verificado: 5 puntos.",
        "- Plan Pro: 8 puntos.",
        "El puntaje se recalcula diariamente. En las búsquedas por cercanía, la distancia ordena primero por tramos de 5 kilómetros y dentro de cada tramo ordena el puntaje, de modo que un técnico excelente a 8 km no queda detrás de uno nuevo a 6 km.",
        "**Lo que esto significa:** el Plan Pro es un factor entre varios, equivalente a menos de tres trabajos documentados. No coloca a nadie por encima de un técnico con más trabajo demostrado. Habilis no vende posiciones ni ofrece \"aparecer primero\" como servicio.",
      ],
    },
    {
      titulo: "7. Distancia",
      contenido: [
        "La distancia que se muestra al buscar por cercanía se calcula desde un punto aproximado que el técnico configuró, redondeado a un área de un kilómetro. Nunca es su domicilio y nunca se muestra como punto en un mapa. Por debajo de dos kilómetros solo se indica \"en tu zona\".",
      ],
    },
    {
      titulo: "8. Cambios a esta fórmula",
      contenido: [
        "Si cambiamos la fórmula o los criterios de moderación, publicaremos la nueva versión aquí con al menos 15 días de anticipación. No haremos cambios que beneficien a un técnico en particular ni que se apliquen retroactivamente a calificaciones ya emitidas.",
      ],
    },
  ],
};
