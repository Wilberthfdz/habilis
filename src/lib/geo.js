// ─── CERCANÍA SIN REVELAR DÓNDE VIVE NADIE ────────────────────────────────
//
// Un cliente quiere al técnico más cercano. Un técnico que trabaja desde su
// casa NO quiere publicar su domicilio: en México eso es un dato personal
// protegido, y para un electricista que guarda herramienta en casa es
// además un riesgo real de seguridad.
//
// La solución no es "no guardar ubicación", porque entonces la búsqueda por
// cercanía no existe. Es guardar una ubicación DELIBERADAMENTE IMPRECISA:
//
//   1. El punto del técnico se redondea a una rejilla de ~1 km antes de
//      guardarse. Ni nosotros conservamos el punto exacto.
//   2. De ese punto aproximado sale el geohash con el que Firestore busca.
//   3. Al cliente se le enseña una distancia ("a unos 4 km"), nunca un
//      punto en un mapa ni una dirección.
//
// La única excepción es quien TIENE un taller o local y decide publicarlo:
// eso es una dirección comercial, la pone él a propósito y se guarda aparte
// en `taller`, no en el punto de búsqueda.
import { geohashForLocation, geohashQueryBounds, distanceBetween } from "geofire-common";

// ~1 km de lado. Dos decimales de grado son ~1.1 km en latitud, que es la
// imprecisión mínima para que el punto no señale una casa concreta.
const REJILLA = 0.01;

export function difuminar({ lat, lng }) {
  return {
    lat: Math.round(lat / REJILLA) * REJILLA,
    lng: Math.round(lng / REJILLA) * REJILLA,
  };
}

// Lo que se guarda en el perfil. Nunca el punto que dio el navegador.
export function puntoDeBusqueda({ lat, lng }) {
  const p = difuminar({ lat, lng });
  return {
    // Precisión 7 ≈ celdas de 150 m: suficiente para ordenar por cercanía
    // sobre un punto que ya viene redondeado a un kilómetro.
    geohash: geohashForLocation([p.lat, p.lng], 7),
    lat: p.lat,
    lng: p.lng,
  };
}

// Los rangos de geohash que cubren un círculo. Firestore no sabe buscar
// "cerca de", pero sí sabe buscar rangos de texto ordenados, y un geohash
// convierte la cercanía geográfica en cercanía alfabética.
export function rangosCercanos({ lat, lng }, radioKm) {
  return geohashQueryBounds([lat, lng], radioKm * 1000);
}

export function distanciaKm(a, b) {
  return distanceBetween([a.lat, a.lng], [b.lat, b.lng]);
}

// Lo que ve el cliente. Nunca un punto: una distancia redondeada, y por
// debajo de 2 km ni siquiera eso, porque afinar tanto empieza a señalar.
export function textoDistancia(km) {
  if (km == null || !isFinite(km)) return null;
  if (km < 2)  return "En tu zona";
  if (km < 10) return `A unos ${Math.round(km)} km`;
  if (km < 50) return `A unos ${Math.round(km / 5) * 5} km`;
  return `A más de ${Math.floor(km / 10) * 10} km`;
}

// El navegador pide permiso; si lo niegan, la búsqueda sigue funcionando
// por ciudad escrita a mano. La ubicación NO se guarda en ninguna parte:
// solo se usa para ordenar los resultados de esa búsqueda.
export function ubicacionDelNavegador() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error("Tu navegador no permite ubicación.")); return; }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(new Error(
        err.code === 1 ? "Necesitamos tu permiso de ubicación para ordenar por cercanía."
                       : "No pudimos obtener tu ubicación.")),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  });
}
