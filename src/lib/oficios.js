import { buscarPorTexto } from "./taxonomia.js";

// La taxonomía es una lista cerrada de 17 ramos técnicos. Un jardinero, un
// tapicero o un fumigador no tenían dónde registrarse, y el alta por correo
// era aún más estrecha: 13 oficios escritos a mano. Esta función es la que
// permite que cualquier persona entre a trabajar en Habilis.
export const CATEGORIA_LIBRE = "otro";

/**
 * Resuelve un oficio escrito a mano contra el catálogo.
 * Si el texto cae en una categoría conocida, el perfil queda clasificado
 * ahí y aparece también en las búsquedas por ramo. Si no cae en ninguna,
 * se guarda tal cual: nadie se queda fuera por no estar en la lista.
 */
export function resolverOficioLibre(texto) {
  const limpio = (texto || "").trim();
  if (!limpio) return null;

  const hit = buscarPorTexto(limpio, 1)[0];
  if (!hit) {
    return { categoriaId: CATEGORIA_LIBRE, subcategoriaId: null, oficio: limpio, oficioLibre: limpio };
  }
  const partes = hit.id.split(".");
  return {
    categoriaId:    partes[0],
    subcategoriaId: partes.length >= 2 ? partes.slice(0, 2).join(".") : null,
    oficio:         limpio,
    oficioLibre:    limpio,
  };
}
