import { useState, useEffect } from "react";
import { db } from "../lib/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const TIPOS   = ["Instalación","Reparación","Mantenimiento","Diagnóstico","Otro"];
const ESTADOS = [
  { id:"pendiente", label:"Pendiente" },
  { id:"proceso",   label:"En proceso" },
  { id:"terminado", label:"Terminado" },
  { id:"validado",  label:"Validado ✓" },
];

const s = {
  page:    { minHeight:"100vh", background:"#F4F5F7" },
  header:  { background:"#1E2A3B", color:"#fff", padding:"0 20px", height:"56px", display:"flex", alignItems:"center", gap:"14px" },
  logo:    { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 12px", borderRadius:"8px", letterSpacing:"0.05em", cursor:"pointer" },
  wrap:    { maxWidth:"680px", margin:"0 auto", padding:"24px 20px" },
  card:    { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"22px", marginBottom:"14px" },
  label:   { display:"block", fontSize:"11px", fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"5px" },
  inp:     { width:"100%", border:"1px solid #D1D5DB", borderRadius:"10px", padding:"10px 14px", fontSize:"14px", outline:"none", background:"#F9FAFB", boxSizing:"border-box" },
  btn:     { background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"12px 20px", fontSize:"14px", fontWeight:700, cursor:"pointer" },
  btnFull: { background:"#D97706", color:"#fff", border:"none", borderRadius:"12px", padding:"14px", fontSize:"15px", fontWeight:700, width:"100%", cursor:"pointer" },
  grid2:   { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" },
  chip:    ok => ({ background: ok ? "#D97706" : "#fff", color: ok ? "#fff" : "#374151", border:`1px solid ${ok ? "#D97706" : "#D1D5DB"}`, borderRadius:"20px", padding:"6px 14px", fontSize:"12px", fontWeight:600, cursor:"pointer" }),
  photo:   { background:"#F9FAFB", border:"2px dashed #D1D5DB", borderRadius:"12px", height:"110px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", gap:"6px", overflow:"hidden" },
  err:     { background:"#FEE2E2", border:"1px solid #FECACA", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#991B1B", marginBottom:"14px" },
};

export default function RegistrarTrabajo({ nav, user }) {
  const [form, setForm] = useState({
    titulo:"", tipo:"Instalación", descripcion:"",
    problema:"", solucion:"", materiales:"",
    tiempoHoras:"", costoTotal:"", ciudad:"",
    clienteNombre:"", estado:"terminado",
  });
  const [fotos,   setFotos]   = useState({ antes:null, despues:null });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!user) nav("login");
  }, [user]);

  if (!user) return null;

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const processImage = file => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  const handleFoto = tipo => async e => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await processImage(file);
    setFotos(f => ({ ...f, [tipo]: b64 }));
  };

  const guardar = async () => {
    if (!form.titulo.trim()) { setError("El título del trabajo es obligatorio."); return; }
    if (!form.problema.trim()) { setError("Describe el problema detectado."); return; }
    if (!form.solucion.trim()) { setError("Describe la solución aplicada."); return; }
    setError("");
    setLoading(true);
    try {
      const evidencias = [];
      if (fotos.antes)   evidencias.push(fotos.antes);
      if (fotos.despues) evidencias.push(fotos.despues);

      await addDoc(collection(db, "trabajos"), {
        titulo:        form.titulo.trim(),
        tipo:          form.tipo,
        descripcion:   form.descripcion.trim(),
        problema:      form.problema.trim(),
        solucion:      form.solucion.trim(),
        materiales:    form.materiales.trim(),
        tiempoHoras:   parseFloat(form.tiempoHoras) || 0,
        costoTotal:    parseFloat(form.costoTotal)  || 0,
        ciudad:        form.ciudad.trim(),
        clienteNombre: form.clienteNombre.trim(),
        estado:        form.estado,
        tecnicoId:     user.uid,
        evidencias,
        createdAt:     serverTimestamp(),
        updatedAt:     serverTimestamp(),
      });
      nav("panel");
    } catch (e) {
      console.error(e);
      if (e.message?.includes("permission-denied") || e.message?.includes("Missing or insufficient permissions")) {
        setError("Error de permisos. Verifica tu sesión e intenta de nuevo.");
      } else if (e.message?.includes("too large") || e.message?.includes("payload")) {
        setError("Las imágenes son muy pesadas. Intenta con fotos más pequeñas o sin fotos.");
      } else {
        setError("Error al guardar el trabajo. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <button onClick={() => nav("panel")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>← Mi panel</button>
        <span style={s.logo} onClick={() => nav("landing")}>HABILIS</span>
        <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px" }}>Documentar trabajo</span>
      </div>

      <div style={s.wrap}>
        {error && <div style={s.err}>{error}</div>}

        {/* Datos básicos */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"16px" }}>📋 Datos del trabajo</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div>
              <label style={s.label}>Título del trabajo *</label>
              <input style={s.inp} value={form.titulo} onChange={set("titulo")} placeholder="Ej: Instalación panel eléctrico 200A" />
            </div>
            <div>
              <label style={s.label}>Tipo de trabajo</label>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {TIPOS.map(t => (
                  <button key={t} style={s.chip(form.tipo === t)} onClick={() => setForm(f => ({ ...f, tipo: t }))}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={s.label}>Descripción general</label>
              <textarea style={{ ...s.inp, resize:"vertical", minHeight:"60px" }} value={form.descripcion} onChange={set("descripcion")} placeholder="Resumen del servicio realizado" />
            </div>
            <div style={s.grid2}>
              <div><label style={s.label}>Ciudad</label><input style={s.inp} value={form.ciudad} onChange={set("ciudad")} placeholder="CDMX" /></div>
              <div><label style={s.label}>Cliente (opcional)</label><input style={s.inp} value={form.clienteNombre} onChange={set("clienteNombre")} placeholder="Nombre del cliente" /></div>
            </div>
            <div style={s.grid2}>
              <div><label style={s.label}>Tiempo (horas)</label><input style={s.inp} type="number" value={form.tiempoHoras} onChange={set("tiempoHoras")} placeholder="2.5" min="0" step="0.5" /></div>
              <div><label style={s.label}>Costo total ($MXN)</label><input style={s.inp} type="number" value={form.costoTotal} onChange={set("costoTotal")} placeholder="0" min="0" /></div>
            </div>
          </div>
        </div>

        {/* Detalles técnicos */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"16px" }}>🔍 Detalles técnicos</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div>
              <label style={s.label}>Problema detectado *</label>
              <textarea style={{ ...s.inp, resize:"vertical", minHeight:"80px" }} value={form.problema} onChange={set("problema")} placeholder="¿Cuál era el problema o qué pidió el cliente?" />
            </div>
            <div>
              <label style={s.label}>Solución aplicada *</label>
              <textarea style={{ ...s.inp, resize:"vertical", minHeight:"80px" }} value={form.solucion} onChange={set("solucion")} placeholder="¿Qué hiciste exactamente? ¿Qué materiales usaste?" />
            </div>
            <div>
              <label style={s.label}>Materiales usados</label>
              <input style={s.inp} value={form.materiales} onChange={set("materiales")} placeholder="Panel Square D, breakers 15A, cable THW 10 AWG..." />
            </div>
          </div>
        </div>

        {/* Evidencia fotográfica */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"6px" }}>📷 Evidencia fotográfica</h3>
          <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"14px" }}>Las fotos antes/después hacen tu perfil más confiable para los clientes.</p>
          <div style={s.grid2}>
            {[["antes","Antes"],["despues","Después"]].map(([k, label]) => (
              <div key={k}>
                <label style={s.label}>{label}</label>
                <label style={{ ...s.photo, border: fotos[k] ? "2px solid #D97706" : "2px dashed #D1D5DB", cursor:"pointer" }}>
                  {fotos[k]
                    ? <img src={fotos[k]} alt={label} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"10px" }} />
                    : <>
                        <span style={{ fontSize:"28px", opacity:0.3 }}>📷</span>
                        <span style={{ fontSize:"11px", color:"#9CA3AF", textAlign:"center" }}>Toca para subir foto {label.toLowerCase()}</span>
                      </>
                  }
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto(k)} />
                </label>
                {fotos[k] && (
                  <button onClick={() => setFotos(f => ({ ...f, [k]: null }))} style={{ background:"none", border:"none", color:"#EF4444", fontSize:"11px", marginTop:"4px", cursor:"pointer", fontWeight:600 }}>
                    Quitar foto
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estado del trabajo */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"12px" }}>Estado del trabajo</h3>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {ESTADOS.map(e => (
              <button key={e.id} style={s.chip(form.estado === e.id)} onClick={() => setForm(f => ({ ...f, estado: e.id }))}>
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <button style={{ ...s.btnFull, opacity: loading ? 0.7 : 1 }} onClick={guardar} disabled={loading}>
          {loading ? "Guardando..." : "✅ Guardar en mi historial"}
        </button>
        <p style={{ fontSize:"11px", color:"#9CA3AF", textAlign:"center", marginTop:"10px" }}>
          Este trabajo quedará en tu historial profesional y podrá ser visto por clientes potenciales.
        </p>
      </div>
    </div>
  );
}
