// Datos que se repiten en todos los documentos legales. Una sola fuente:
// cuando la sociedad quede constituida o cambie el domicilio, se corrige
// aquí y cambia en los trece documentos a la vez.
export const TITULAR = {
  razonSocial: "Habilis Technology, S.A.P.I. de C.V.",
  estado: "sociedad en proceso de constitución",
  operadorProvisional: "Wilberth Fernández Quen",
  // Tal como se dictó; confirmar ortografía de la avenida y añadir C.P.
  domicilio: "Región 236, Manzana 60, Lote 11, Local 4, Avenida Gastón Alero, C.P. 77520, Cancún, Quintana Roo, México",
  correo: "habilisempresa@gmail.com",
  sitio: "myhabilis.com",
  marca: "Habilis",
  // Registro de marca ante el IMPI en trámite; el folio se añade cuando el
  // dueño lo proporcione.
  marcaEstado: "en trámite de registro ante el Instituto Mexicano de la Propiedad Industrial",
};

export const FECHA_VIGENCIA = "8 de septiembre de 2026";

// Párrafo de identificación que abre cada documento.
export const QUIEN_ES_EL_TITULAR =
  `${TITULAR.razonSocial}, ${TITULAR.estado} (el "Titular"), con domicilio de contacto en ` +
  `${TITULAR.domicilio} y correo **${TITULAR.correo}**, es quien opera la plataforma ` +
  `${TITULAR.marca}, disponible en ${TITULAR.sitio} y en sus aplicaciones para dispositivos ` +
  `móviles. En tanto concluye la constitución de la sociedad, el operador y responsable es ` +
  `${TITULAR.operadorProvisional}, con el mismo domicilio y contacto.`;

export const AUDIENCIAS = {
  cliente: "Para clientes",
  tecnico: "Para técnicos",
  todos:   "Para todos",
};
