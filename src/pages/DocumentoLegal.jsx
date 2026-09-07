import { useEffect } from "react";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { porSlug, FECHA_VIGENCIA } from "../legal/index.js";
import { VERSION_TERMINOS } from "../lib/config.js";

// Renderiza cualquier documento del Centro Legal a partir de su contenido
// estructurado. El texto vive en src/legal/*.js sin nada de interfaz, así
// un abogado puede revisarlo como texto plano y los trece documentos se ven
// iguales sin repetir maquetación.
const H2 = { fontSize:"17px", fontWeight:800, color:"#0F172A", margin:"30px 0 10px" };
const P  = { fontSize:"14.5px", color:"#475569", lineHeight:1.8, marginBottom:"10px" };
const LI = { fontSize:"14.5px", color:"#475569", lineHeight:1.8, marginBottom:"6px" };

// **negrita** → <strong>. Es el único formato que admite el contenido.
function conNegritas(texto) {
  const partes = String(texto).split(/(\*\*[^*]+\*\*)/g);
  return partes.map((p, i) => p.startsWith("**") && p.endsWith("**")
    ? <strong key={i} style={{ color:"#0F172A" }}>{p.slice(2, -2)}</strong>
    : p);
}

// Las líneas que empiezan con "- " forman listas; las que empiezan con
// "1. " forman listas numeradas; el resto son párrafos.
function Bloques({ contenido }) {
  const salida = [];
  let lista = null, tipo = null;
  const cerrar = () => {
    if (!lista) return;
    const Tag = tipo === "ol" ? "ol" : "ul";
    salida.push(<Tag key={`l${salida.length}`} style={{ paddingLeft:"22px", marginBottom:"10px" }}>{lista}</Tag>);
    lista = null; tipo = null;
  };
  contenido.forEach((linea, i) => {
    const vineta = /^- /.test(linea);
    const numero = /^\d+\. /.test(linea);
    if (vineta || numero) {
      const t = vineta ? "ul" : "ol";
      if (lista && tipo !== t) cerrar();
      if (!lista) { lista = []; tipo = t; }
      lista.push(<li key={i} style={LI}>{conNegritas(linea.replace(/^(- |\d+\. )/, ""))}</li>);
    } else {
      cerrar();
      salida.push(<p key={i} style={P}>{conNegritas(linea)}</p>);
    }
  });
  cerrar();
  return salida;
}

export default function DocumentoLegal({ nav, user, params = {} }) {
  const doc = porSlug(params.slug);

  useEffect(() => {
    if (doc) document.title = `${doc.titulo} · Habilis`;
    return () => { document.title = "Habilis — Técnicos con trabajos documentados"; };
  }, [doc]);

  if (!doc || doc.externo) return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>
      <div style={{ textAlign:"center", padding:"80px 20px" }}>
        <p style={{ fontWeight:800, color:"#0F172A", marginBottom:"14px" }}>No encontramos ese documento</p>
        <button onClick={() => nav("legal")} className="h-btn-orange" style={{ padding:"10px 20px" }}>
          Ir al Centro Legal
        </button>
      </div>
    </div>
  );

  const relacionados = (doc.relacionados || []).map(porSlug).filter(Boolean);

  return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      <div style={{ maxWidth:"780px", margin:"0 auto", padding:"32px 20px 72px" }}>
        <button onClick={() => nav("legal")}
          style={{ background:"none", border:"none", color:"#64748B", fontSize:"13px",
                   cursor:"pointer", padding:0, marginBottom:"16px" }}>
          ← Centro Legal
        </button>

        <article style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                          padding:"clamp(24px,5vw,48px)" }}>
          <p style={{ fontSize:"11px", fontWeight:800, color:"#F97316", letterSpacing:"0.1em",
                      textTransform:"uppercase", marginBottom:"8px" }}>Legal</p>
          <h1 style={{ fontSize:"clamp(22px,4vw,28px)", fontWeight:900, color:"#0F172A",
                       marginBottom:"6px", lineHeight:1.2 }}>{doc.titulo}</h1>
          <p style={{ fontSize:"12px", color:"#94A3B8", marginBottom:"22px" }}>
            Vigente desde el {FECHA_VIGENCIA} · Versión {VERSION_TERMINOS}
          </p>

          <div style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:"12px",
                        padding:"16px 20px", marginBottom:"8px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"#64748B", letterSpacing:"0.06em",
                        textTransform:"uppercase", marginBottom:"8px" }}>Contenido</p>
            {doc.secciones.map(s => (
              <a key={s.titulo} href={`#${encodeURIComponent(s.titulo)}`}
                style={{ display:"block", fontSize:"13px", color:"#475569", lineHeight:1.9,
                         textDecoration:"none" }}>{s.titulo}</a>
            ))}
          </div>

          {doc.secciones.map(s => (
            <section key={s.titulo} id={encodeURIComponent(s.titulo)}>
              <h2 style={H2}>{s.titulo}</h2>
              <Bloques contenido={s.contenido} />
            </section>
          ))}

          {relacionados.length > 0 && (
            <div style={{ marginTop:"36px", paddingTop:"20px", borderTop:"1px solid #E2E8F0" }}>
              <p style={{ fontSize:"12px", fontWeight:800, color:"#64748B", letterSpacing:"0.06em",
                          textTransform:"uppercase", marginBottom:"10px" }}>Documentos relacionados</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                {relacionados.map(r => (
                  <button key={r.slug}
                    onClick={() => r.externo ? nav(r.externo) : nav("documentoLegal", { slug: r.slug })}
                    style={{ background:"#F1F5F9", border:"1px solid #E2E8F0", borderRadius:"20px",
                             padding:"7px 14px", fontSize:"12.5px", fontWeight:600, color:"#0F172A",
                             cursor:"pointer" }}>
                    {r.titulo}
                  </button>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
      <Footer nav={nav} />
    </div>
  );
}
