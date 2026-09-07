import Logo from "./Logo.jsx";

// Un solo pie para todas las páginas públicas. Antes solo la portada tenía
// uno completo: Precios no tenía ninguno y Cómo funciona y Soporte llevaban
// una línea suelta, así que desde media web no había manera de llegar a los
// términos ni al aviso de privacidad — y la razón social no aparecía en
// ninguna parte fuera de los propios documentos legales.
const COLUMNAS = [
  ["Plataforma", [
    ["Buscar técnicos", "buscar"],
    ["Feed de trabajos", "feed"],
    ["Precios", "precios"],
  ]],
  ["Para técnicos", [
    ["Crear perfil gratis", "registro"],
    ["Mi panel", "panel"],
    ["Iniciar sesión", "login"],
  ]],
  ["Acerca de", [
    ["Quiénes somos", "quienesSomos"],
    ["Cómo funciona la app", "comoFunciona"],
    ["Soporte", "soporte"],
  ]],
  ["Legal", [
    ["Centro legal", "legal"],
    ["Términos para clientes", "documentoLegal", { slug: "terminos-clientes" }],
    ["Términos para técnicos", "documentoLegal", { slug: "terminos-tecnicos" }],
    ["Aviso de privacidad", "privacidad"],
  ]],
];

const enlace = {
  display: "block", background: "none", border: "none", color: "#6B6560",
  fontSize: "13px", marginBottom: "10px", cursor: "pointer", padding: 0,
  textAlign: "left", fontFamily: "inherit", transition: "color 0.15s",
};

export default function Footer({ nav }) {
  return (
    <footer style={{ background:"#fff", borderTop:"1px solid #EDE8E1",
                     padding:"52px clamp(20px,5vw,64px) 28px" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                      gap:"36px", flexWrap:"wrap", marginBottom:"40px" }}>
          <div style={{ maxWidth:"240px" }}>
            <Logo size={28} textColor="#0A1120" onClick={() => nav("landing")} />
            <p style={{ color:"#6B6560", fontSize:"13px", marginTop:"12px", lineHeight:1.65 }}>
              Infraestructura de confianza para trabajadores técnicos en México.
            </p>
            <p style={{ color:"#B5AFA8", fontSize:"12px", marginTop:"8px", fontWeight:700,
                        letterSpacing:"0.04em" }}>myhabilis.com</p>
            <a href="mailto:habilisempresa@gmail.com"
              style={{ color:"#6B6560", fontSize:"12px", marginTop:"10px",
                       display:"inline-block", textDecoration:"none" }}>
              habilisempresa@gmail.com
            </a>
          </div>

          <div style={{ display:"flex", gap:"clamp(28px,5vw,56px)", flexWrap:"wrap" }}>
            {COLUMNAS.map(([titulo, items]) => (
              <div key={titulo}>
                <p style={{ fontWeight:800, fontSize:"12px", color:"#0A1120", marginBottom:"14px",
                            letterSpacing:"0.06em", textTransform:"uppercase" }}>{titulo}</p>
                {items.map(([l, r, p]) => (
                  <button key={l} onClick={() => nav(r, p || {})} style={enlace}
                    onMouseEnter={e => e.currentTarget.style.color = "#F07020"}
                    onMouseLeave={e => e.currentTarget.style.color = "#6B6560"}>
                    {l}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:"1px solid #EDE8E1", paddingTop:"20px", display:"flex",
                      justifyContent:"space-between", alignItems:"center",
                      flexWrap:"wrap", gap:"12px" }}>
          <p style={{ color:"#B5AFA8", fontSize:"12px", lineHeight:1.6 }}>
            © {new Date().getFullYear()} Habilis Tecnology, S.A.P.I. de C.V. · Todos los derechos reservados
          </p>
          <p style={{ color:"#B5AFA8", fontSize:"12px" }}>Hecho en México</p>
        </div>
      </div>
    </footer>
  );
}
