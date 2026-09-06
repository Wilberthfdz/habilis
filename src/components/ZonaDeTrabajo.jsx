import { useState } from "react";
import { puntoDeBusqueda, ubicacionDelNavegador } from "../lib/geo.js";

// Dónde trabaja el técnico, con dos cosas MUY distintas separadas a
// propósito:
//
//   · La zona (privada). Sirve para que los clientes cercanos lo
//     encuentren. Se guarda redondeada a ~1 km y NUNCA se muestra: al
//     cliente solo le llega "a unos 6 km". La mayoría de los técnicos
//     trabajan desde su casa y su domicilio es dato personal.
//
//   · El taller (público, opcional). Solo para quien tiene un local
//     comercial y quiere que se vea. Es una dirección de negocio, la
//     escribe él y va aparte.
const lbl = { fontSize:"11px", fontWeight:700, color:"#64748B",
              textTransform:"uppercase", letterSpacing:"0.06em",
              display:"block", marginBottom:"5px" };

const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#fff", color:"#0F172A", boxSizing:"border-box" };

const RADIOS = [5, 10, 25, 50, 100];

export default function ZonaDeTrabajo({ valor, onChange }) {
  const [ubicando, setUbicando] = useState(false);
  const [aviso,    setAviso]    = useState("");

  const tieneZona = !!valor.geoPunto;

  const usarMiUbicacion = async () => {
    setAviso(""); setUbicando(true);
    try {
      const exacta = await ubicacionDelNavegador();
      // Se redondea ANTES de tocar el estado: el punto exacto no llega ni
      // siquiera a guardarse en memoria más allá de esta línea.
      const { geohash, lat, lng } = puntoDeBusqueda(exacta);
      onChange({ ...valor, geohash, geoPunto: { lat, lng } });
      setAviso("Listo. Guardamos tu zona aproximada, no tu dirección.");
    } catch (e) {
      setAviso(e.message);
    } finally { setUbicando(false); }
  };

  const quitarZona = () => {
    onChange({ ...valor, geohash: null, geoPunto: null });
    setAviso("");
  };

  const taller = valor.taller || {};
  const cambiarTaller = campos => onChange({ ...valor, taller: { ...taller, ...campos } });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
      <div>
        <label style={lbl}>Zona donde trabajas</label>
        <p style={{ fontSize:"12.5px", color:"#64748B", lineHeight:1.6, marginBottom:"10px" }}>
          Sirve para que los clientes de tu zona te encuentren primero.
          <strong> Guardamos un punto aproximado, no tu dirección</strong>, y a los
          clientes solo les mostramos la distancia — nunca dónde estás.
        </p>

        {tieneZona ? (
          <div style={{ display:"flex", alignItems:"center", gap:"10px",
                        background:"#F0FDF4", border:"1px solid #A7F3D0",
                        borderRadius:"10px", padding:"11px 14px", flexWrap:"wrap" }}>
            <span style={{ fontSize:"13px", fontWeight:600, color:"#059669", flex:1 }}>
              ✓ Zona configurada — apareces en las búsquedas por cercanía
            </span>
            <button type="button" onClick={quitarZona}
              style={{ background:"none", border:"none", color:"#64748B", fontSize:"12px",
                       fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>
              Quitar
            </button>
          </div>
        ) : (
          <button type="button" onClick={usarMiUbicacion} disabled={ubicando}
            style={{ width:"100%", background:"#F1F5F9", color:"#0F172A",
                     border:"1px solid #E2E8F0", borderRadius:"10px", padding:"12px",
                     fontWeight:700, fontSize:"14px", cursor:"pointer",
                     opacity: ubicando ? 0.6 : 1 }}>
            {ubicando ? "Obteniendo tu zona…" : "📍 Usar mi ubicación actual"}
          </button>
        )}

        {aviso && (
          <p style={{ fontSize:"12px", color:"#64748B", marginTop:"8px", lineHeight:1.5 }}>{aviso}</p>
        )}
      </div>

      <div>
        <label style={lbl}>¿Hasta dónde te desplazas?</label>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {RADIOS.map(km => (
            <button key={km} type="button" onClick={() => onChange({ ...valor, radioKm: km })}
              style={{ background: valor.radioKm === km ? "#F97316" : "#F1F5F9",
                       color: valor.radioKm === km ? "#fff" : "#374151",
                       border:`1px solid ${valor.radioKm === km ? "#F97316" : "#E2E8F0"}`,
                       borderRadius:"20px", padding:"7px 15px", fontSize:"12.5px",
                       fontWeight:600, cursor:"pointer" }}>
              {km} km
            </button>
          ))}
        </div>
        <p style={{ fontSize:"11.5px", color:"#94A3B8", marginTop:"6px" }}>
          No te mostramos a clientes que estén más lejos de esto.
        </p>
      </div>

      {/* Taller público. Va aparte porque es una decisión distinta: una
          dirección comercial que el técnico publica a propósito. */}
      <div style={{ borderTop:"1px solid #E2E8F0", paddingTop:"16px" }}>
        <label style={{ display:"flex", alignItems:"flex-start", gap:"10px",
                        fontSize:"14px", color:"#0F172A", cursor:"pointer" }}>
          <input type="checkbox" checked={!!taller.publico}
            onChange={e => cambiarTaller({ publico: e.target.checked })}
            style={{ width:"16px", height:"16px", accentColor:"#F97316", marginTop:"2px", flexShrink:0 }} />
          <span>
            Tengo taller o local y quiero mostrar su dirección
            <span style={{ display:"block", fontSize:"12.5px", color:"#64748B", marginTop:"2px" }}>
              Solo marca esto si es un domicilio de negocio, no tu casa.
            </span>
          </span>
        </label>

        {taller.publico && (
          <div style={{ marginTop:"12px", display:"flex", flexDirection:"column", gap:"10px" }}>
            <div>
              <label style={lbl}>Dirección del taller</label>
              <input style={inp} value={taller.direccion || ""} maxLength={160}
                onChange={e => cambiarTaller({ direccion: e.target.value })}
                placeholder="Av. Tulum 200, local 4, SM 4, Cancún" />
            </div>
            <div>
              <label style={lbl}>Horario de atención</label>
              <input style={inp} value={taller.horario || ""} maxLength={100}
                onChange={e => cambiarTaller({ horario: e.target.value })}
                placeholder="Lun a Vie 9:00–18:00 · Sáb 9:00–14:00" />
            </div>
            <p style={{ fontSize:"11.5px", color:"#94A3B8", lineHeight:1.5 }}>
              Esta dirección será pública en tu perfil. Puedes quitarla cuando quieras.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
