// ─── CAMPOS DE BÚSQUEDA ───────────────────────────────────────────────────
//
// Firestore no sabe buscar texto: no hay "contiene", ni acentos, ni
// mayúsculas. Por eso la búsqueda descargaba 100 técnicos cualesquiera y
// filtraba en el navegador. Con cien perfiles funciona; con cien mil, un
// plomero de Cancún sencillamente nunca aparece — Firestore devuelve los
// 100 primeros que le da la gana y el filtro se aplica solo sobre esos.
//
// La solución sin traerse un buscador externo: guardar en cada perfil los
// campos por los que SÍ se puede filtrar en el servidor.
import { normalizar } from "./taxonomia.js";

// Ciudad normalizada: "Cancún", "cancun" y "CANCUN" tienen que encontrarse
// entre sí. Se guarda aparte porque el campo `ciudad` conserva lo que el
// técnico escribió, que es lo que se le muestra.
export function normalizarCiudad(ciudad) {
  return normalizar(ciudad).replace(/\s+/g, " ");
}

// Palabras sueltas por las que se puede encontrar a alguien: su oficio, su
// categoría y su nombre. Firestore sí sabe preguntar "¿este arreglo
// contiene X?" (array-contains), y eso es lo que sustituye al "contiene"
// de toda la vida.
export function palabrasBusqueda({ nombre, oficio, categoriaId, subcategoriaId, ciudad }) {
  const fuentes = [nombre, oficio, categoriaId, subcategoriaId, ciudad];
  const palabras = new Set();
  for (const fuente of fuentes) {
    if (!fuente) continue;
    for (const palabra of normalizar(String(fuente)).split(/[\s/().,+_-]+/)) {
      // Menos de tres letras no discrimina nada y engorda el índice.
      if (palabra.length >= 3) palabras.add(palabra);
    }
  }
  // Firestore admite hasta 30 valores por array-contains-any y cobra por
  // entrada de índice: se acota para no pagar por ruido.
  return [...palabras].slice(0, 30);
}

// Todo lo que hay que escribir en el perfil para que sea encontrable.
export function camposDeIndice(perfil) {
  return {
    ciudadNorm: normalizarCiudad(perfil.ciudad),
    busqueda:   palabrasBusqueda(perfil),
  };
}
