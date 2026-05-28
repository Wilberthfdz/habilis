import { useState, useEffect } from "react";
import { db } from "../lib/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ESTADOS = ["pendiente","aceptado","proceso","terminado","validado"];

const s = {
  page:   { minHeight:"100vh", background:"#F4F5F7", fontFamily: "'Inter', sans-serif" },
  header: { background:"#1E2A3B", color:"#fff", padding:"16px 20px", display:"flex", alignItems:"center", gap:"14px" },
  logo:   { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 10px", borderRadius:"8px", cursor: "pointer" },
  wrap:   { maxWidth:"680px", margin:"0 auto", padding:"24px 20px" },
  card:   { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"20px", marginBottom:"14px" },
  label:  { display:"block", fontSize:"11px", fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"5px" },
  inp:    { width:"100%", border:"1px solid #D1D5DB", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", outline:"none", background:"#F9FAFB" },
  btn:    { background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"12px 20px", fontSize:"14px", fontWeight:700, cursor: "pointer" },
  btnFull:{ background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"12px", fontSize:"14px", fontWeight:700, width:"100%", cursor: "pointer" },
  grid2:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" },
  chip:   ok => ({ background: ok ? "#D97706" : "#fff", color: ok ? "#fff" : "#374151", border:`1px solid ${ok ? "#D97706" : "#D1D5DB"}`, borderRadius:"20px", padding:"5px 12px", fontSize:"12px", fontWeight:600, cursor:"pointer" }),
  photo:  { background:"#F9FAFB", border:"2px dashed #D1D5DB", borderRadius:"12px", height:"100px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", gap:"6px", overflow: "hidden" },
  err:    { background:"#FEE2E2", border:"1px solid #FECACA", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#991B1B", marginBottom: "14px" }
};

const TIPOS = ["Instalación","Reparación","Mantenimiento","Diagnóstico","Otro"];
const ESTADOS_LABEL = { pendiente:"Pendiente", aceptado:"Aceptado", proceso:"En proceso", terminado:"Terminado", validado:"Validado ✓" };

export default function RegistrarTrabajo({ nav, user }) {
  const [form, setForm] = useState({
    titulo:"", tipo:"Instalación", descripcion:"", problema:"",
    solucion:"", materiales:"", tiempoHoras:"", costoTotal:"",
    ciudad:"", clienteNombre:"", estado:"terminado",
  });
  const [fotos,     setFotos]     = useState({ antes:null, despues:null });
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    if (!user) { nav("login"); }
  }, [user, nav]);

  if (!user) return null;

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // Convert image to base64, scaling it down to avoid hitting Firestore 1MB limit
  const processImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          // Max width/height
          const MAX_SIZE = 800;
          let w = img.width;
          let h = img.height;
          if (w > MAX_SIZE || h > MAX_SIZE) {
            if (w > h) { h *= MAX_SIZE / w; w = MAX_SIZE; } 
            else { w *= MAX_SIZE / h; h = MAX_SIZE; }
          }
          canvas.width = w; canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress to jpeg
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFoto = (tipo) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await processImage(file);
    setFotos(f => ({ ...f, [tipo]: base64 }));
  };

  const guardar = async () => {
    if (!form.titulo || !form.problema || !form.solucion) {
      setError("Llena todos los campos obligatorios (*)");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      const evidencias = [];
      if (fotos.antes) evidencias.push(fotos.antes);
      if (fotos.despues) evidencias.push(fotos.despues);

      await addDoc(collection(db, "trabajos"), {
        ...form,
        tecnicoId: user.uid,
        costoTotal: parseFloat(form.costoTotal) || 0,
        tiempoHoras: parseFloat(form.tiempoHoras) || 0,
        evidencias,
        createdAt: serverTimestamp(),
      });

      nav("panel");
    } catch (e) {
      console.error(e);
      if (e.message?.includes("permission-denied") || e.message?.includes("Missing or insufficient permissions")) {
         setError("Error de permisos: No puedes guardar este trabajo. Verifica tu sesión.");
      } else if (e.message?.includes("payload is too large")) {
         setError("Las imágenes son muy pesadas para Firestore. Intenta sin fotos.");
      } else {
         setError("Error al guardar. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={s.header}>
        <button onClick={() => nav("panel")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600, cursor: "pointer" }}>← Mi panel</button>
        <span style={s.logo} onClick={() => nav("landing")}>OFICIO</span>
        <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Documentar trabajo</span>
      </div>

      <div style={s.wrap}>
        {error && <div style={s.err}>{error}</div>}
        
        {/* Datos básicos */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"14px" }}>📋 Datos del trabajo</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div>
              <label style={s.label}>Título del trabajo *</label>
              <input style={s.inp} value={form.titulo} onChange={set("titulo")} placeholder="Ej: Instalación panel eléctrico 200A" />
            </div>

            <div>
              <label style={s.label}>Tipo de trabajo</label>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {TIPOS.map(t => (
                  <button key={t} style={s.chip(form.tipo===t)} onClick={() => setForm(f => ({ ...f, tipo:t }))}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={s.label}>Descripción General</label>
              <textarea style={{ ...s.inp, resize:"vertical", minHeight:"50px" }} value={form.descripcion} onChange={set("descripcion")} placeholder="Resumen del servicio" />
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

        {/* Detalles técnicos */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"14px" }}>🔍 Detalles técnicos</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div>
              <label style={s.label}>Problema detectado *</label>
              <textarea style={{ ...s.inp, resize:"vertical", minHeight:"70px" }} value={form.problema} onChange={set("problema")} placeholder="¿Cuál era el problema o qué pidió el cliente?" />
            </div>
            <div>
              <label style={s.label}>Solución (Trabajo realizado) *</label>
              <textarea style={{ ...s.inp, resize:"vertical", minHeight:"70px" }} value={form.solucion} onChange={set("solucion")} placeholder="¿Qué hiciste exactamente?" />
            </div>
            <div>
              <label style={s.label}>Materiales usados</label>
              <input style={s.inp} value={form.materiales} onChange={set("materiales")} placeholder="Panel Square D, breakers 15A, cable THW..." />
            </div>
          </div>
        </div>

        {/* Evidencia fotográfica */}
        <div style={s.card}>
          <h3 style={{ fontWeight:700, fontSize:"15px", marginBottom:"6px" }}>📷 Evidencia fotográfica</h3>
          <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"14px" }}>Sube fotos del trabajo. (Se guardan como Base64 en Firestore)</p>
          <div style={s.grid2}>
            {["antes", "despues"].map((k) => (
              <div key={k}>
                <label style={s.label}>{k === "antes" ? "Antes" : "Después"}</label>
                <label style={{ ...s.photo, border: fotos[k] ? "2px solid #D97706" : "2px dashed #D1D5DB" }}>
                  {fotos[k]
                    ? <img src={fotos[k]} alt={k} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"10px" }} />
                    : <><span style={{ fontSize:"24px", opacity:0.3 }}>📷</span><span style={{ fontSize:"11px", color:"#9CA3AF" }}>Tocar para subir</span></>
                  }
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={handleFoto(k)} />
                </label>
              </div>
            ))}
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

        <button style={{ ...s.btnFull, opacity: loading ? 0.7 : 1 }} onClick={guardar} disabled={loading}>
          {loading ? "Guardando..." : "✅ Guardar expediente"}
        </button>

        <p style={{ fontSize:"11px", color:"#9CA3AF", textAlign:"center", marginTop:"10px" }}>
          Este trabajo quedará en tu historial profesional y podrá ser visto por clientes potenciales.
        </p>
      </div>
    </div>
  );
}