// Datos que se repiten en todos los documentos legales. Una sola fuente:
// cuando la sociedad quede constituida o cambie el domicilio, se corrige
// aquí y cambia en los trece documentos a la vez.
export const TITULAR = {
  razonSocial: "Habilis Tecnology, S.A.P.I. de C.V.",
  estado: "sociedad en proceso de constitución",
  operadorProvisional: "Wilberth Fernández Quen",
  domicilio: "Cancún, Quintana Roo, México",
  correo: "habilisempresa@gmail.com",
  sitio: "myhabilis.com",
  marca: "Habilis",
};

export const FECHA_VIGENCIA = "4 de septiembre de 2026";

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
