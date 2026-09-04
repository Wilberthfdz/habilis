// Casilla de aceptación de términos. La LFPDPPP exige consentimiento
// expreso para tratar datos personales y la LFPC pide que el consumidor
// conozca las condiciones antes de contratar: sin este bloque el alta no
// dejaba rastro de que el técnico los hubiera visto siquiera.
export default function AceptarTerminos({ nav, valor, onChange }) {
  const link = {
    background:"none", border:"none", padding:0, color:"#F97316",
    fontWeight:700, cursor:"pointer", fontSize:"13px", textDecoration:"underline",
  };
  return (
    <label style={{ display:"flex", alignItems:"flex-start", gap:"10px",
                    fontSize:"13px", color:"rgba(255,255,255,0.6)",
                    lineHeight:1.6, cursor:"pointer" }}>
      <input
        type="checkbox"
        checked={valor}
        onChange={e => onChange(e.target.checked)}
        style={{ width:"16px", height:"16px", accentColor:"#F97316",
                 marginTop:"2px", flexShrink:0 }}
      />
      <span>
        He leído y acepto los{" "}
        <button type="button" style={link}
          onClick={e => { e.preventDefault(); nav("terminos"); }}>
          Términos y Condiciones
        </button>{" "}
        y el{" "}
        <button type="button" style={link}
          onClick={e => { e.preventDefault(); nav("privacidad"); }}>
          Aviso de Privacidad
        </button>{" "}
        de Habilis Tecnology, S.A.P.I. de C.V.
      </span>
    </label>
  );
}
