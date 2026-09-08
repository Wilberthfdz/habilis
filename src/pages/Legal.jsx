import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { DOCUMENTOS, AUDIENCIAS, FECHA_VIGENCIA } from "../legal/index.js";
import { VERSION_TERMINOS } from "../lib/config.js";

// Índice del Centro Legal. Cada documento con su URL, agrupado por a quién
// aplica: lo que un cliente tiene que leer no es lo mismo que lo de un
// técnico, y mezclarlo en un solo texto de treinta pantallas es la forma
// más segura de que nadie lea nada.
const ORDEN = ["cliente", "tecnico", "todos"];

export default function Legal({ nav, user }) {
  const abrir = d => d.externo ? nav(d.externo) : nav("documentoLegal", { slug: d.slug });

  return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      <div style={{ background:"#0A1120", padding:"56px 20px 60px", textAlign:"center" }}>
        <p style={{ fontSize:"12px", fontWeight:800, color:"#F07020", letterSpacing:"0.12em",
                    textTransform:"uppercase", marginBottom:"12px" }}>Centro Legal</p>
        <h1 style={{ fontSize:"clamp(26px,4.5vw,40px)", fontWeight:900, color:"#fff",
                     maxWidth:"680px", margin:"0 auto 14px", lineHeight:1.15 }}>
          Las reglas, escritas para leerse
        </h1>
        <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.6)", maxWidth:"600px",
                    margin:"0 auto", lineHeight:1.7 }}>
          Cada documento dice lo que la plataforma hace de verdad. Nada aquí promete lo
          que no existe. Versión {VERSION_TERMINOS}, vigente desde el {FECHA_VIGENCIA}.
        </p>
      </div>

      <div style={{ maxWidth:"880px", margin:"0 auto", padding:"28px 20px 64px" }}>
        {ORDEN.map(aud => {
          const docs = DOCUMENTOS.filter(d => d.audiencia === aud);
          if (docs.length === 0) return null;
          return (
            <section key={aud} style={{ marginBottom:"28px" }}>
              <p style={{ fontSize:"11px", fontWeight:800, color:"#475569", letterSpacing:"0.1em",
                          textTransform:"uppercase", margin:"0 0 10px 4px" }}>{AUDIENCIAS[aud]}</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"12px" }}>
                {docs.map(d => (
                  <button key={d.slug} onClick={() => abrir(d)} className="h-card"
                    style={{ textAlign:"left", padding:"20px 22px", cursor:"pointer", border:"1px solid #E2E8F0" }}>
                    <p style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"6px", lineHeight:1.3 }}>
                      {d.titulo}
                    </p>
                    <p style={{ fontSize:"13px", color:"#475569", lineHeight:1.6 }}>{d.resumen}</p>
                  </button>
                ))}
              </div>
            </section>
          );
        })}

        <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                      padding:"20px 24px", marginTop:"8px" }}>
          <p style={{ fontSize:"13.5px", color:"#475569", lineHeight:1.7 }}>
            <strong style={{ color:"#0F172A" }}>Qué aceptas al registrarte.</strong> Un cliente acepta
            los Términos para Clientes; un técnico, los Términos para Técnicos. Ambos aceptan el Aviso
            de Privacidad y las Normas de la Comunidad, y todas las políticas de esta página forman
            parte del acuerdo. Cuando cambie algo sustancial, te avisamos con 15 días y te pedimos
            aceptarlo de nuevo.
          </p>
        </div>
      </div>
      <Footer nav={nav} />
    </div>
  );
}
