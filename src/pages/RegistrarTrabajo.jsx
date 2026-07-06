import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";
import { db } from "../lib/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const TIPOS   = ["Instalación","Reparación","Mantenimiento","Diagnóstico","Otro"];
const ESTADOS = [
  { id:"pendiente", label:"Pendiente" },
  { id:"proceso",   label:"En proceso" },
  { id:"terminado", label:"Terminado" },
  { id:"validado",  label:"Validado ✓" },
];

const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };
const label = { fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
                letterSpacing:"0.06em", display:"block", marginBottom:"5px" };

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
  const [touched, setTouched] = useState({});

  useEffect(() => { if (!user) nav("login"); }, [user]);
  if (!user) return null;

  const set = k => e => setForm(f => ({ ...f, [k]:e.target.value }));

  const processImg = file => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // 400px max, quality 0.5 → ~15-30 KB/imagen como base64 (~40 KB)
        // Dos fotos ≈ 80 KB total, muy por debajo del límite de 1 MB de Firestore
        const MAX = 400;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.5));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  const handleFoto = tipo => async e => {
    const file = e.target.files[0];
    if (!file) return;
    setFotos(f => ({ ...f, [tipo]: "__loading__" }));
    const b64 = await processImg(file);
    setFotos(f => ({ ...f, [tipo]: b64 }));
  };

  const guardar = async () => {
    // Mark all required fields as touched so red borders appear
    setTouched({ titulo:true, problema:true, solucion:true });

    if (!form.titulo.trim())   { setError("⚠️ Falta el título del trabajo."); window.scrollTo({top:0,behavior:"smooth"}); return; }
    if (!form.problema.trim()) { setError("⚠️ Falta describir el problema (sección Detalles técnicos)."); window.scrollTo({top:0,behavior:"smooth"}); return; }
    if (!form.solucion.trim()) { setError("⚠️ Falta describir la solución aplicada (sección Detalles técnicos)."); window.scrollTo({top:0,behavior:"smooth"}); return; }
    setError(""); setLoading(true);
    try {
      const evidencias = [fotos.antes, fotos.despues].filter(Boolean).filter(x => x !== "__loading__");
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
      console.error("Error guardando trabajo:", e);
      const msg = e.message || e.code || String(e);
      if (msg.includes("permission-denied") || msg.includes("Missing or insufficient") || msg.includes("PERMISSION_DENIED"))
        setError("Sin permiso para guardar. ¿Estás con la sesión iniciada? (" + (e.code || "permission-denied") + ")");
      else if (msg.includes("too large") || msg.includes("payload") || msg.includes("1 MiB") || msg.includes("exceeds"))
        setError("El documento es muy grande. Intenta con fotos de menor resolución o sin fotos.");
      else if (msg.includes("unauthenticated") || msg.includes("auth"))
        setError("Sesión expirada. Vuelve a iniciar sesión.");
      else
        setError("Error al guardar: " + msg.slice(0, 120));
    } finally { setLoading(false); }
  };

  const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                 padding:"22px", marginBottom:"14px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      {/* NAV */}
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO BANNER */}
      <div style={{ background:"#0F172A", padding:"36px 20px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"400px", height:"400px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.14) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"680px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <button onClick={() => nav("panel")}
            style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:"13px",
                     fontWeight:600, cursor:"pointer", marginBottom:"10px", padding:0 }}>
            ← Mi panel
          </button>
          <h1 style={{ fontSize:"clamp(22px,4vw,36px)", fontWeight:900, color:"#fff", marginBottom:"6px" }}>
            Documenta tu trabajo
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
            Construye tu reputación con evidencia real. Fotos, tiempos, materiales.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"24px 20px" }}>
        {error && (
          <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"12px",
                        padding:"12px 16px", fontSize:"13px", color:"#991B1B", marginBottom:"16px" }}>
            {error}
          </div>
        )}

        {/* Datos básicos */}
        <div style={CARD}>
          <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"18px" }}>📋 Datos del trabajo</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div>
              <label style={label}>Título del trabajo *</label>
              <input
                style={{ ...inp, border: touched.titulo && !form.titulo.trim() ? "2px solid #EF4444" : inp.border }}
                value={form.titulo} onChange={set("titulo")}
                placeholder="Ej: Instalación panel eléctrico 200A" />
              {touched.titulo && !form.titulo.trim() && (
                <p style={{ color:"#EF4444", fontSize:"12px", marginTop:"3px" }}>Campo obligatorio</p>
              )}
            </div>
            <div>
              <label style={label}>Tipo de trabajo</label>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {TIPOS.map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, tipo:t }))}
                    style={{ background: form.tipo===t ? "#F97316" : "#F1F5F9",
                             color: form.tipo===t ? "#fff" : "#374151",
                             border: `1px solid ${form.tipo===t ? "#F97316" : "#E2E8F0"}`,
                             borderRadius:"20px", padding:"6px 14px", fontSize:"12px",
                             fontWeight:600, cursor:"pointer" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={label}>Descripción general</label>
              <textarea style={{ ...inp, resize:"vertical", minHeight:"60px" }} value={form.descripcion} onChange={set("descripcion")} placeholder="Resumen del servicio" />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <div><label style={label}>Ciudad</label><input style={inp} value={form.ciudad} onChange={set("ciudad")} placeholder="CDMX" /></div>
              <div><label style={label}>Cliente (opcional)</label><input style={inp} value={form.clienteNombre} onChange={set("clienteNombre")} placeholder="Nombre del cliente" /></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <div><label style={label}>Tiempo (horas)</label><input style={inp} type="number" value={form.tiempoHoras} onChange={set("tiempoHoras")} placeholder="2.5" min="0" step="0.5" /></div>
              <div><label style={label}>Costo total ($MXN)</label><input style={inp} type="number" value={form.costoTotal} onChange={set("costoTotal")} placeholder="0" min="0" /></div>
            </div>
          </div>
        </div>

        {/* Detalles técnicos */}
        <div style={CARD}>
          <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"18px" }}>🔍 Detalles técnicos</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div>
              <label style={label}>Problema detectado *</label>
              <textarea
                style={{ ...inp, resize:"vertical", minHeight:"80px",
                         border: touched.problema && !form.problema.trim() ? "2px solid #EF4444" : inp.border }}
                value={form.problema} onChange={set("problema")}
                placeholder="¿Cuál era el problema o qué pidió el cliente?" />
              {touched.problema && !form.problema.trim() && (
                <p style={{ color:"#EF4444", fontSize:"12px", marginTop:"3px" }}>Campo obligatorio</p>
              )}
            </div>
            <div>
              <label style={label}>Solución aplicada *</label>
              <textarea
                style={{ ...inp, resize:"vertical", minHeight:"80px",
                         border: touched.solucion && !form.solucion.trim() ? "2px solid #EF4444" : inp.border }}
                value={form.solucion} onChange={set("solucion")}
                placeholder="¿Qué hiciste exactamente?" />
              {touched.solucion && !form.solucion.trim() && (
                <p style={{ color:"#EF4444", fontSize:"12px", marginTop:"3px" }}>Campo obligatorio</p>
              )}
            </div>
            <div>
              <label style={label}>Materiales usados</label>
              <input style={inp} value={form.materiales} onChange={set("materiales")} placeholder="Panel Square D, breakers 15A, cable THW..." />
            </div>
          </div>
        </div>

        {/* Fotos */}
        <div style={CARD}>
          <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"6px" }}>📷 Evidencia fotográfica</h3>
          <p style={{ color:"#64748B", fontSize:"13px", marginBottom:"16px" }}>
            Las fotos antes/después aumentan la confianza de los clientes.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            {[["antes","Antes"],["despues","Después"]].map(([k, lbl]) => (
              <div key={k}>
                <label style={label}>{lbl}</label>
                <label style={{ background: fotos[k] && fotos[k] !== "__loading__" ? "#fff" : "#F8FAFC",
                                 border: `2px ${fotos[k] ? "solid #F97316" : "dashed #E2E8F0"}`,
                                 borderRadius:"12px", height:"110px", cursor:"pointer", overflow:"hidden",
                                 display:"flex", flexDirection:"column", alignItems:"center",
                                 justifyContent:"center", gap:"6px" }}>
                  {fotos[k] === "__loading__" && <div style={{ fontSize:"12px", color:"#94A3B8" }}>Procesando...</div>}
                  {fotos[k] && fotos[k] !== "__loading__" && (
                    <img src={fotos[k]} alt={lbl} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  )}
                  {!fotos[k] && <>
                    <span style={{ fontSize:"28px", opacity:0.25 }}>📷</span>
                    <span style={{ fontSize:"11px", color:"#94A3B8", textAlign:"center" }}>Toca para subir foto {lbl.toLowerCase()}</span>
                  </>}
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto(k)} />
                </label>
                {fotos[k] && fotos[k] !== "__loading__" && (
                  <button onClick={() => setFotos(f => ({ ...f, [k]:null }))}
                    style={{ background:"none", border:"none", color:"#EF4444", fontSize:"11px", marginTop:"4px", cursor:"pointer", fontWeight:600 }}>
                    ✕ Quitar foto
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estado */}
        <div style={CARD}>
          <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"14px" }}>Estado del trabajo</h3>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {ESTADOS.map(e => (
              <button key={e.id} onClick={() => setForm(f => ({ ...f, estado:e.id }))}
                style={{ background: form.estado===e.id ? "#F97316" : "#F1F5F9",
                         color: form.estado===e.id ? "#fff" : "#374151",
                         border: `1px solid ${form.estado===e.id ? "#F97316" : "#E2E8F0"}`,
                         borderRadius:"20px", padding:"7px 16px", fontSize:"12px",
                         fontWeight:600, cursor:"pointer" }}>
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error also shown here, near the button */}
        {error && (
          <div style={{ background:"#FEF2F2", border:"2px solid #FECACA", borderRadius:"12px",
                        padding:"14px 16px", fontSize:"14px", color:"#991B1B", marginBottom:"12px",
                        fontWeight:600 }}>
            {error}
          </div>
        )}

        <button onClick={guardar} disabled={loading}
          style={{ width:"100%", background:"#F97316", color:"#fff", border:"none", borderRadius:"12px",
                   padding:"15px", fontSize:"15px", fontWeight:800, cursor:"pointer",
                   opacity: loading ? 0.75 : 1, boxShadow:"0 4px 14px rgba(249,115,22,0.35)" }}>
          {loading ? "Guardando..." : "✅ Guardar en mi historial"}
        </button>
        <p style={{ fontSize:"12px", color:"#94A3B8", textAlign:"center", marginTop:"10px" }}>
          Este trabajo quedará en tu historial profesional y podrá ser visto por clientes.
        </p>
      </div>
    </div>
  );
}
