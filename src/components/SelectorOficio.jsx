import { useState } from "react";
import { TAXONOMIA, buscarPorTexto } from "../lib/taxonomia.js";
import { CATEGORIA_LIBRE, resolverOficioLibre } from "../lib/oficios.js";


// La taxonomía cubre 17 ramos técnicos, pero es una lista cerrada: un
// jardinero, un tapicero o un fumigador no tenían dónde registrarse. El
// alta por correo era todavía más estrecha — 13 oficios escritos a mano.
// Aquí conviven las dos cosas: el catálogo completo y una salida para
// cualquier oficio que no esté en él.
//
// `valor` = { categoriaId, subcategoriaId, oficio, oficioLibre }
// `onChange` recibe ese mismo objeto ya resuelto.
const lbl = { fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.45)",
              textTransform:"uppercase", letterSpacing:"0.06em",
              display:"block", marginBottom:"5px" };

const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };

export default function SelectorOficio({ valor, onChange }) {
  const libre = valor.categoriaId === CATEGORIA_LIBRE || !!valor.oficioLibre;
  const [modoLibre, setModoLibre] = useState(libre);
  const [texto,     setTexto]     = useState(valor.oficioLibre || "");

  const categoria = TAXONOMIA.find(c => c.id === valor.categoriaId) || TAXONOMIA[0];
  const subcategorias = categoria.subcategorias || [];
  const sugerencia = modoLibre && texto.trim() ? buscarPorTexto(texto, 1)[0] : null;

  const elegirCategoria = id => {
    const cat = TAXONOMIA.find(c => c.id === id) || TAXONOMIA[0];
    onChange({ categoriaId: cat.id, subcategoriaId: null, oficio: cat.nombre, oficioLibre: "" });
  };

  const elegirSubcategoria = id => {
    const sub = subcategorias.find(s => s.id === id) || null;
    onChange({
      categoriaId:    categoria.id,
      subcategoriaId: sub ? sub.id : null,
      oficio:         sub ? sub.nombre : categoria.nombre,
      oficioLibre:    "",
    });
  };

  const escribirLibre = t => {
    setTexto(t);
    onChange(resolverOficioLibre(t) || { categoriaId: CATEGORIA_LIBRE, subcategoriaId: null, oficio: "", oficioLibre: "" });
  };

  const volverAlCatalogo = () => {
    setModoLibre(false);
    setTexto("");
    elegirCategoria(TAXONOMIA[0].id);
  };

  const enlace = {
    background:"none", border:"none", padding:0, color:"#F97316",
    fontWeight:700, cursor:"pointer", fontSize:"12px", textDecoration:"underline",
  };

  if (modoLibre) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
        <div>
          <label style={lbl}>¿A qué te dedicas? *</label>
          <input style={inp} value={texto} onChange={e => escribirLibre(e.target.value)}
            placeholder="Jardinero, tapicero, fumigador, mudanzas..." maxLength={60} />
          {sugerencia ? (
            <p style={{ fontSize:"11.5px", color:"#86EFAC", marginTop:"6px", lineHeight:1.5 }}>
              ✓ Lo agrupamos en <b>{sugerencia.ruta}</b> para que aparezcas también en esa búsqueda.
            </p>
          ) : texto.trim() ? (
            <p style={{ fontSize:"11.5px", color:"rgba(255,255,255,0.35)", marginTop:"6px", lineHeight:1.5 }}>
              Tu oficio no está en nuestro catálogo, y aun así puedes trabajar en Habilis:
              los clientes te encontrarán buscándolo por su nombre.
            </p>
          ) : null}
        </div>
        <button type="button" onClick={volverAlCatalogo} style={{ ...enlace, textAlign:"left" }}>
          ← Elegir de la lista de oficios
        </button>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
      <div>
        <label style={lbl}>Oficio principal *</label>
        <select style={inp} value={categoria.id} onChange={e => elegirCategoria(e.target.value)}>
          {TAXONOMIA.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>
      <div>
        <label style={lbl}>Especialidad (opcional)</label>
        <select style={inp} value={valor.subcategoriaId || ""}
          onChange={e => elegirSubcategoria(e.target.value)}>
          <option value="">— General —</option>
          {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
      </div>
      <button type="button" onClick={() => { setModoLibre(true); escribirLibre(""); }}
        style={{ ...enlace, textAlign:"left" }}>
        Mi oficio no está en la lista →
      </button>
    </div>
  );
}
