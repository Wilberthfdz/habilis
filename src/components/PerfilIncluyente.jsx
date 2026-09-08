import { TIPOS_INCLUSION, MAX_COMO_TRABAJO } from "../lib/inclusion.js";

// Sección "Perfil incluyente" del formulario de técnico. Ver
// src/lib/inclusion.js para las reglas de fondo: es voluntario, es un dato
// sensible, requiere consentimiento expreso propio y desmarcarlo lo borra.
//
// `oscuro` adapta los colores: el alta va sobre fondo azul marino y el
// editor sobre blanco.
export default function PerfilIncluyente({ valor, onChange, oscuro = false, nav }) {
  const c = oscuro
    ? { texto:"#fff", sub:"rgba(255,255,255,0.55)", borde:"rgba(255,255,255,0.12)",
        fondo:"rgba(255,255,255,0.04)", chip:"rgba(255,255,255,0.08)", chipOn:"#F97316",
        inp:{ background:"#F8FAFC", color:"#0F172A", border:"1px solid #E2E8F0" } }
    : { texto:"#0F172A", sub:"#64748B", borde:"#E2E8F0", fondo:"#F8FAFC",
        chip:"#fff", chipOn:"#F97316",
        inp:{ background:"#fff", color:"#0F172A", border:"1px solid #E2E8F0" } };

  const v = valor || { activo:false, consentimiento:false, tipos:[], comoTrabajo:"" };
  const set = campos => onChange({ ...v, ...campos });
  const toggleTipo = id => set({
    tipos: v.tipos.includes(id) ? v.tipos.filter(t => t !== id) : [...v.tipos, id],
  });
  // Desactivar borra todo: no se conserva nada "por si acaso".
  const activar = on => on
    ? set({ activo:true })
    : onChange({ activo:false, consentimiento:false, tipos:[], comoTrabajo:"" });

  const idBase = "perfil-incluyente";

  return (
    <section aria-labelledby={`${idBase}-titulo`}
      style={{ background:c.fondo, border:`1px solid ${c.borde}`, borderRadius:"14px", padding:"16px 18px" }}>
      <label htmlFor={`${idBase}-activo`}
        style={{ display:"flex", alignItems:"flex-start", gap:"12px", cursor:"pointer" }}>
        <input id={`${idBase}-activo`} type="checkbox" checked={v.activo}
          onChange={e => activar(e.target.checked)}
          style={{ width:"18px", height:"18px", accentColor:"#F97316", marginTop:"2px", flexShrink:0 }} />
        <span>
          <span id={`${idBase}-titulo`} style={{ display:"block", fontWeight:800, fontSize:"14px", color:c.texto }}>
            ♿ Vivo con una discapacidad y quiero un perfil incluyente
          </span>
          <span style={{ display:"block", fontSize:"12.5px", color:c.sub, lineHeight:1.6, marginTop:"3px" }}>
            Opcional. Tu perfil mostrará la insignia <b>Perfil incluyente</b> y aparecerá
            cuando un cliente o una empresa busque contratar a personas con discapacidad.
            Nunca se usa para quitarte de una búsqueda.
          </span>
        </span>
      </label>

      {v.activo && (
        <div style={{ display:"flex", flexDirection:"column", gap:"14px", marginTop:"16px" }}>
          <div>
            <p style={{ fontSize:"11px", fontWeight:700, color:c.sub, textTransform:"uppercase",
                        letterSpacing:"0.06em", marginBottom:"8px" }}>
              Tipo de discapacidad (opcional)
            </p>
            <div role="group" aria-label="Tipo de discapacidad"
              style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
              {TIPOS_INCLUSION.map(([id, nombre]) => {
                const on = v.tipos.includes(id);
                return (
                  <button key={id} type="button" aria-pressed={on} onClick={() => toggleTipo(id)}
                    style={{ padding:"7px 14px", borderRadius:"20px", fontSize:"12.5px", fontWeight:600,
                             cursor:"pointer", border:`1px solid ${on ? c.chipOn : c.borde}`,
                             background: on ? c.chipOn : c.chip, color: on ? "#fff" : c.texto }}>
                    {nombre}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor={`${idBase}-como`}
              style={{ fontSize:"11px", fontWeight:700, color:c.sub, textTransform:"uppercase",
                       letterSpacing:"0.06em", display:"block", marginBottom:"5px" }}>
              Cómo trabajo
            </label>
            <textarea id={`${idBase}-como`} value={v.comoTrabajo} maxLength={MAX_COMO_TRABAJO}
              onChange={e => set({ comoTrabajo: e.target.value })}
              style={{ ...c.inp, width:"100%", borderRadius:"10px", padding:"11px 14px", fontSize:"14px",
                       outline:"none", boxSizing:"border-box", minHeight:"88px", resize:"vertical" }}
              placeholder="En qué destacas por tu forma de trabajar y qué necesitas del cliente. Ejemplo: hago diagnóstico y reparación de tarjetas electrónicas en mi taller; me comunico mejor por mensaje escrito." />
            <p style={{ fontSize:"11px", color:c.sub, marginTop:"4px" }}>
              {v.comoTrabajo.length}/{MAX_COMO_TRABAJO} · Es lo que verá el cliente.
            </p>
          </div>

          <label htmlFor={`${idBase}-consentimiento`}
            style={{ display:"flex", alignItems:"flex-start", gap:"10px", fontSize:"12.5px",
                     color:c.texto, lineHeight:1.6, cursor:"pointer" }}>
            <input id={`${idBase}-consentimiento`} type="checkbox" checked={v.consentimiento}
              onChange={e => set({ consentimiento: e.target.checked })}
              style={{ width:"16px", height:"16px", accentColor:"#F97316", marginTop:"3px", flexShrink:0 }} />
            <span>
              <b>Consiento expresamente</b> que Habilis guarde este dato, que es un dato personal
              sensible, y lo muestre en mi perfil público con el único fin de que clientes y
              empresas puedan encontrarme. Puedo retirarlo cuando quiera desmarcando la casilla
              de arriba, y entonces se borra.{" "}
              {nav && (
                <button type="button" onClick={() => nav("privacidad")}
                  style={{ background:"none", border:"none", padding:0, color:"#F97316",
                           fontWeight:700, cursor:"pointer", fontSize:"12.5px", textDecoration:"underline" }}>
                  Ver el Aviso de Privacidad
                </button>
              )}
            </span>
          </label>
        </div>
      )}
    </section>
  );
}
