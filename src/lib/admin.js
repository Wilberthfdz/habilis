// Correos con acceso al ERP admin. Vive aparte de admin/AdminLayout.jsx para
// que Nav.jsx (cargado en cada página) pueda importarlo sin arrastrar el
// resto del panel admin fuera de su carga diferida (ver App.jsx).
export const ADMIN_EMAILS = ["wilberthfdz@gmail.com", "frnlcm13@gmail.com"];

export function isAdminUser(user) {
  return !!user && ADMIN_EMAILS.includes(user.email);
}
