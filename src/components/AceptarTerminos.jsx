// Casilla de aceptación de términos. La LFPDPPP exige consentimiento
// expreso para tratar datos personales y la LFPC pide que el consumidor
// conozca las condiciones antes de contratar: sin este bloque el alta no
// dejaba rastro de que el técnico los hubiera visto siquiera.
// `tipo` decide qué términos se enlazan: "cliente", "tecnico" o —cuando aún
// no se sabe, en el alta de la cuenta— el Centro Legal completo.
const DESTINO = {
  cliente: ["documentoLegal", { slug: "terminos-clientes" }, "Términos y Condiciones para Clientes"],
  tecnico: ["documentoLegal", { slug: "terminos-tecnicos" }, "Términos y Condiciones para Técnicos"],
};

// La segunda casilla es OPCIONAL y viene desmarcada: es el consentimiento
// para comunicaciones comerciales (LFPDPPP art. 8). Sin ella, mandar
// promociones sería una finalidad secundaria a la que hay que oponerse
// después; con ella, solo se escribe a quien dijo que sí.
export default function AceptarTerminos({ nav, valor, onChange, tipo, comercial, onChangeComercial }) {
  const [pantalla, params, etiqueta] = DESTINO[tipo] || ["legal", {}, "Términos y Condiciones"];
  const link = {
    background:"none", border:"none", padding:0, color:"#F97316",
    fontWeight:700, cursor:"pointer", fontSize:"13px", textDecoration:"underline",
  };
  return (
    <>
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
          onClick={e => { e.preventDefault(); nav(pantalla, params); }}>
          {etiqueta}
        </button>{" "}
        y el{" "}
        <button type="button" style={link}
          onClick={e => { e.preventDefault(); nav("privacidad"); }}>
          Aviso de Privacidad
        </button>{" "}
        de Habilis Technology, S.A.P.I. de C.V., y las{" "}
        <button type="button" style={link}
          onClick={e => { e.preventDefault(); nav("documentoLegal", { slug: "normas-comunidad" }); }}>
          Normas de la Comunidad
        </button>.
      </span>
    </label>
    {onChangeComercial && (
      <label style={{ display:"flex", alignItems:"flex-start", gap:"10px", marginTop:"10px",
                      fontSize:"12.5px", color:"rgba(255,255,255,0.45)", lineHeight:1.6, cursor:"pointer" }}>
        <input type="checkbox" checked={!!comercial} onChange={e => onChangeComercial(e.target.checked)}
          style={{ width:"16px", height:"16px", accentColor:"#F97316", marginTop:"2px", flexShrink:0 }} />
        <span>Quiero recibir novedades y promociones de Habilis por correo. Es opcional y puedo cancelarlo cuando quiera.</span>
      </label>
    )}
    </>
  );
}
