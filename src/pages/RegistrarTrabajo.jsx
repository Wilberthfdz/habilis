// ─── REGISTRAR TRABAJO — El expediente con IA y fotos ────────────────────
import { useState }                        from "react";
import { crearTrabajo, subirFoto }         from "../lib/firebase.js";
import { clasificarTrabajo }               from "../lib/gemini.js";

const ESTADOS = ["pendiente","aceptado","proceso","terminado","validado"];

const s = {
  page:   { minHeight:"100vh", background:"#F4F5F7" },
  header: { background:"#1E2A3B", color:"#fff", padding:"16px 20px", display:"flex", alignItems:"center", gap:"14px" },
  logo:   { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 10px", borderRadius:"8px" },
  wrap:   { maxWidth:"680px", margin:"0 auto", padding:"24px 20px" },
  card:   { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"20px", marginBottom:"14px" },
  label:  { display:"block", fontSize:"11px", fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"5px" },
  inp:    { width:"100%", border:"1px solid #D1D5DB", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", outline:"none", background:"#F9FAFB" },
  btn:    { background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"12px 20px", fontSize:"14px", fontWeight:700 },
  btnFull:{ background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"12px", fontSize:"14px", fontWeight:700, width:"100%" },
  grid2:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" },
  chip:   ok => ({ background: ok ? "#D97706" : "#fff", color: ok ? "#fff" : "#374151", border:`1px solid ${ok ? "#D97706" : "#D1D5DB"}`, borderRadius:"20px", padding:"5px 12px", fontSize:"12px", fontWeight:600, cursor:"pointer" }),
  photo:  { background:"#F9FAFB", border:"2px dashed #D1D5DB", borderRadius:"12px", height:"100px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", gap:"6px" },
};

const TIPOS = ["Instalación","Reparación","Mantenimiento","Diagnóstico","Otro"];
const ESTADOS_LABEL = { pendiente:"Pendiente", aceptado:"Aceptado", proceso:"En proceso", terminado:"Terminado", validado:"Validado ✓" };

export default function RegistrarTrabajo({ nav, user }) {
  const [form, setForm] = useState({
    titulo:"", tipo:"Instalación", descripcion:"", problemaDetectado:"",
    trabajoRealizado:"", materiales:"", tiempoHoras:"", costoTotal:"",
    ciudad:"", clienteNombre:"", estado:"terminado",
  });
  const [fotos,     setFotos]     = useState({ antes:null, durante:null, despues:null });
  const [previews,  setPreviews]  = useState({ antes:null, durante:null, despues:null });
  const [claseIA,   setClaseIA]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleFoto = (tipo) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotos(f => ({ ...f, [tipo]: file }));
    const reader = new FileReader();
    reader.onload = ev => setPreviews(p => ({ ...p, [tipo]: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const clasificarConIA = async () => {
    const texto = `${form.titulo} ${form.descripcion} ${form.problemaDetectado}`;
    if (!texto.trim()) return;
    setAiLoading(true);
    try {
      const res = await clasificarTrabajo(texto);
      setClaseIA(res);
      if (res.tipo) setForm(f => ({ ...f, tipo: res.tipo }));
    } finally {
      setAiLoading(false);
    }
  };

  const guardar = async () => {
    setLoading(true);
    try {
      const trabajoId = await crearTrabajo({
        ...form,
        tecnicoId: user.uid,
        costoTotal: parseFloat(form.costoTotal) || 0,
        tiempoHoras: parseFloat(form.tiempoHoras) || 0,
        clasificacionIA: claseIA,
        evidencias: [],
      });

      // Subir fotos a Firebase Storage
      const urls = {};
      for (const [tipo, file] of Object.entries(fotos)) {
        if (file) urls[tipo] = await subirFoto(trabajoId, file, tipo);
      }
      if (Object.keys(urls).length > 0) {
        const { actualizarTrabajo } = await import("../lib/firebase.js");
        await actualizarTrabajo(trabajoId, { evidencias: urls });
      }

      nav("panel");
    } catch (e) {
      alert("Error al guardar. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button onClick={() => nav("panel")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600 }}>← Mi panel</button>
        <span style={s.logo}>OFICIO</span>
        <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Documentar trabajo</span>
      </div>

      <div style={s.wrap}>

        {/* Datos básicos */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"14px" }}>📋 Datos del trabajo</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div>
              <label style={s.label}>Título del trabajo *</label>
              <input style={s.inp} value={form.titulo} onChange={set("titulo")} placeholder="Ej: Instalación panel eléctrico 200A" onBlur={clasificarConIA} />
            </div>

            <div>
              <label style={s.label}>Tipo de trabajo</label>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {TIPOS.map(t => (
                  <button key={t} style={s.chip(form.tipo===t)} onClick={() => setForm(f => ({ ...f, tipo:t }))}>{t}</button>
                ))}
              </div>
              {aiLoading && <p style={{ color:"#D97706", fontSize:"11px", marginTop:"6px" }}>✨ Gemini clasificando...</p>}
              {claseIA && <p style={{ color:"#059669", fontSize:"11px", marginTop:"6px" }}>✅ Gemini clasificó: {claseIA.tipo} · {claseIA.categoria}</p>}
            </div>

            <div style={s.grid2}>
              <div><label style={s.label}>Ciudad</label><input style={s.inp} value={form.ciudad} onChange={set("ciudad")} placeholder="CDMX" /></div>
              <div><label style={s.label}>Cliente (opcional)</label><input style={s.inp} value={form.clienteNombre} onChange={set("clienteNombre")} placeholder="Nombre del cliente" /></div>
            </div>

            <div style={s.grid2}>
              <div><label style={s.label}>Tiempo (horas)</label><input style={s.inp} type="number" value={form.tiempoHoras} onChange={set("tiempoHoras")} placeholder="2.5" /></div>
              <div><label style={s.label}>Costo total ($MXN)</label><input style={s.inp} type="number" value={form.costoTotal} onChange={set("costoTotal")} placeholder="0.00" /></div>
            </div>
          </div>
        </div>

        {/* Evidencia fotográfica */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"6px" }}>📷 Evidencia fotográfica</h3>
          <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"14px" }}>Sube fotos del trabajo. Esto construye tu reputación.</p>
          <div style={s.grid2}>
            {[["antes","Antes"],["durante","Durante"],["despues","Después"]].slice(0,2).map(([k,l]) => (
              <div key={k}>
                <label style={s.label}>{l}</label>
                <label style={{ ...s.photo, border: previews[k] ? "2px solid #D97706" : "2px dashed #D1D5DB" }}>
                  {previews[k]
                    ? <img src={previews[k]} alt={l} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"10px" }} />
                    : <><span style={{ fontSize:"24px", opacity:0.3 }}>📷</span><span style={{ fontSize:"11px", color:"#9CA3AF" }}>{l}</span></>
                  }
                  <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={handleFoto(k)} />
                </label>
              </div>
            ))}
          </div>
          <div style={{ marginTop:"10px" }}>
            <label style={s.label}>Después</label>
            <label style={{ ...s.photo, border: previews.despues ? "2px solid #059669" : "2px dashed #D1D5DB" }}>
              {previews.despues
                ? <img src={previews.despues} alt="después" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"10px" }} />
                : <><span style={{ fontSize:"24px", opacity:0.3 }}>📷</span><span style={{ fontSize:"11px", color:"#9CA3AF" }}>Resultado final</span></>
              }
              <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={handleFoto("despues")} />
            </label>
          </div>
        </div>

        {/* Detalles técnicos */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"14px" }}>🔍 Detalles técnicos</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div>
              <label style={s.label}>Problema detectado *</label>
              <textarea style={{ ...s.inp, resize:"vertical", minHeight:"70px" }} value={form.problemaDetectado} onChange={set("problemaDetectado")} placeholder="¿Cuál era el problema o qué pidió el cliente?" />
            </div>
            <div>
              <label style={s.label}>Trabajo realizado *</label>
              <textarea style={{ ...s.inp, resize:"vertical", minHeight:"70px" }} value={form.trabajoRealizado} onChange={set("trabajoRealizado")} placeholder="¿Qué hiciste exactamente?" />
            </div>
            <div>
              <label style={s.label}>Materiales usados</label>
              <input style={s.inp} value={form.materiales} onChange={set("materiales")} placeholder="Panel Square D, breakers 15A, cable THW..." />
            </div>
          </div>
        </div>

        {/* Estado */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"12px" }}>Estado del trabajo</h3>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {ESTADOS.map(e => (
              <button key={e} style={s.chip(form.estado===e)} onClick={() => setForm(f => ({ ...f, estado:e }))}>
                {ESTADOS_LABEL[e]}
              </button>
            ))}
          </div>
        </div>

        <button style={{ ...s.btnFull, opacity: loading ? 0.7 : 1 }} onClick={guardar} disabled={loading || !form.titulo}>
          {loading ? "Guardando en Firebase..." : "✅ Guardar expediente"}
        </button>

        <p style={{ fontSize:"11px", color:"#9CA3AF", textAlign:"center", marginTop:"10px" }}>
          Este trabajo quedará en tu historial profesional y podrá ser visto por clientes potenciales.
        </p>
      </div>
    </div>
  );
}
