import { useState, useRef } from "react";
import Logo from "../components/Logo.jsx";
import Avatar from "../components/Avatar.jsx";
import { crearPerfilTecnico, crearPerfilCliente, cerrarSesion } from "../lib/firebase.js";
import { transcribirRegistro } from "../lib/gemini.js";
import { TAXONOMIA, buscarPorTexto } from "../lib/taxonomia.js";

const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };

const lbl = { fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.45)",
              textTransform:"uppercase", letterSpacing:"0.06em",
              display:"block", marginBottom:"5px" };

export default function CompletarPerfil({ nav, user }) {
  const googleName  = user?.displayName || "";
  const googleEmail = user?.email       || "";
  const googlePhoto = user?.photoURL    || null;

  const [tipoCuenta,   setTipoCuenta]   = useState("tecnico");
  const esCliente = tipoCuenta === "cliente";

  const [categoriaId,   setCategoriaId]   = useState("electricidad");
  const [subcategoriaId,setSubcategoriaId]= useState("");
  const [ciudad,       setCiudad]       = useState("");
  const [experiencia,  setExperiencia]  = useState("");
  const [descripcion,  setDescripcion]  = useState("");
  const [herramientas, setHerramientas] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  // ── Registro por voz ──────────────────────────────────────────
  const [grabando,       setGrabando]       = useState(false);
  const [transcribiendo, setTranscribiendo] = useState(false);
  const [vozOk,          setVozOk]          = useState(false);
  const recorderRef = useRef(null);
  const chunksRef   = useRef([]);

  const categoria = TAXONOMIA.find(c => c.id === categoriaId) || TAXONOMIA[0];
  const subcategorias = categoria.subcategorias || [];
  const subcategoria = subcategorias.find(s => s.id === subcategoriaId) || null;

  // El campo `oficio` se mantiene como texto (compatible con perfiles
  // existentes y con el agente de matching); la taxonomía agrega los ids.
  const oficioTexto = subcategoria ? subcategoria.nombre : categoria.nombre;

  const toggleGrabacion = async () => {
    if (grabando) { recorderRef.current?.stop(); return; }
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setGrabando(false);
        setTranscribiendo(true);
        try {
          const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
          const base64 = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload  = e => res(e.target.result.split(",")[1]); // sin el prefijo data:
            r.onerror = () => rej(new Error("No se pudo leer el audio."));
            r.readAsDataURL(blob);
          });
          const out = await transcribirRegistro(base64, rec.mimeType || "audio/webm");
          if (out.ciudad) setCiudad(out.ciudad);
          if (out.experiencia) setExperiencia(String(out.experiencia));
          if (out.bio) setDescripcion(out.bio);
          if (out.oficio) {
            const hit = buscarPorTexto(out.oficio, 1)[0];
            if (hit?.categoriaId) {
              setCategoriaId(hit.categoriaId);
              setSubcategoriaId(hit.subcategoriaId || "");
            }
          }
          setVozOk(true);
        } catch (e) {
          console.error(e);
          setError("No se pudo transcribir el audio. Puedes llenar el formulario a mano.");
        } finally { setTranscribiendo(false); }
      };
      rec.start();
      setGrabando(true);
      // Corte de seguridad a los 60s — el backend rechaza audios muy grandes
      setTimeout(() => { if (rec.state === "recording") rec.stop(); }, 60000);
    } catch {
      setError("No pudimos acceder al micrófono. Revisa los permisos del navegador.");
    }
  };

  const submit = async () => {
    if (!esCliente && !ciudad.trim()) { setError("Ingresa tu ciudad para continuar."); return; }
    setError(""); setLoading(true);
    try {
      if (esCliente) {
        await crearPerfilCliente(user.uid, {
          nombre: googleName || "Sin nombre",
          email:  googleEmail,
        });
        nav("misSolicitudes");
        return;
      }
      await crearPerfilTecnico(user.uid, {
        nombre:        googleName  || "Sin nombre",
        email:         googleEmail,
        fotoUrl:       googlePhoto || null,
        oficio:        oficioTexto,
        categoriaId:   categoria.id,
        subcategoriaId: subcategoria ? subcategoria.id : null,
        ciudad:        ciudad.trim(),
        experiencia:   parseInt(experiencia) || 0,
        bio:           descripcion.trim(),
        herramientas,
        disponibilidad:"",
        tipo:          "tecnico",
        plan:          "gratis",
        rating:        0,
        totalTrabajos: 0,
        disponible:    true,
      });
      nav("bienvenida");
    } catch (e) {
      console.error(e);
      setError("Error al guardar tu perfil. Intenta de nuevo.");
    } finally { setLoading(false); }
  };

  const logout = async () => { await cerrarSesion(); nav("landing"); };

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", display:"flex", flexDirection:"column",
                  position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:"500px", height:"500px",
                    background:"radial-gradient(circle,rgba(249,115,22,0.14) 0%,transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-20%", left:"-10%", width:"400px", height:"400px",
                    background:"radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%)", pointerEvents:"none" }} />

      {/* Header */}
      <div style={{ padding:"18px 24px", display:"flex", justifyContent:"space-between",
                    alignItems:"center", position:"relative", zIndex:1 }}>
        <Logo size={30} onClick={() => nav("landing")} />
        <button onClick={logout}
          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.35)",
                   fontSize:"13px", cursor:"pointer" }}>
          Salir
        </button>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"flex-start", justifyContent:"center",
                    padding:"8px 20px 48px", position:"relative", zIndex:1 }}>
        <div style={{ width:"100%", maxWidth:"480px" }}>

          {/* Card */}
          <div style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.09)",
                        borderRadius:"24px", padding:"36px 32px" }}>

            {/* Google account preview */}
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"28px",
                          background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"14px 16px",
                          border:"1px solid rgba(255,255,255,0.08)" }}>
              {googlePhoto ? (
                <img src={googlePhoto} alt={googleName}
                  style={{ width:"44px", height:"44px", borderRadius:"12px", objectFit:"cover",
                           border:"2px solid rgba(249,115,22,0.4)", flexShrink:0 }} />
              ) : (
                <Avatar size={44} nombre={googleName} plan="gratis" />
              )}
              <div>
                <p style={{ fontWeight:700, fontSize:"14px", color:"#fff", marginBottom:"2px" }}>
                  {googleName || "Usuario de Google"}
                </p>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>{googleEmail}</p>
              </div>
            </div>

            {/* Toggle tipo de cuenta */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
              {[["cliente","Soy cliente"],["tecnico","Soy técnico"]].map(([val, label]) => (
                <button key={val} onClick={() => { setTipoCuenta(val); setError(""); }}
                  style={{ flex:1, borderRadius:"10px", padding:"11px", fontSize:"14px", fontWeight:700,
                           cursor:"pointer",
                           background: tipoCuenta === val ? "#F97316" : "rgba(255,255,255,0.06)",
                           color:      tipoCuenta === val ? "#fff"    : "rgba(255,255,255,0.6)",
                           border:     tipoCuenta === val ? "1px solid #F97316" : "1px solid rgba(255,255,255,0.12)",
                           transition:"background 0.2s" }}>
                  {label}
                </button>
              ))}
            </div>

            <h2 style={{ fontSize:"22px", fontWeight:900, color:"#fff", marginBottom:"6px" }}>
              {esCliente ? "¡Ya casi!" : "¡Un paso más!"}
            </h2>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"14px", marginBottom:"20px", lineHeight:1.5 }}>
              {esCliente ? "Confirma tu cuenta para buscar y contactar técnicos verificados."
                         : "Cuéntanos a qué te dedicas para que los clientes te encuentren."}
            </p>

            {/* Fields */}
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

              {/* ── Registro por voz + datos de oficio (solo técnico) ── */}
              {!esCliente && (<>
              <button onClick={toggleGrabacion} disabled={transcribiendo}
                style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
                         gap:"10px", background: grabando ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
                         border: grabando ? "1.5px solid rgba(239,68,68,0.5)" : "1.5px solid rgba(255,255,255,0.14)",
                         borderRadius:"12px", padding:"13px 16px", fontSize:"14px", fontWeight:700,
                         color: grabando ? "#FCA5A5" : "rgba(255,255,255,0.8)", cursor:"pointer",
                         opacity: transcribiendo ? 0.7 : 1 }}>
                {transcribiendo ? (
                  <>
                    <div style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.3)",
                                  borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.75s linear infinite" }} />
                    Escuchando lo que dijiste...
                  </>
                ) : grabando ? (
                  <>⏹ Detener grabación</>
                ) : (
                  <>🎙️ Llenar con mi voz — di tu oficio, ciudad y experiencia</>
                )}
              </button>
              {vozOk && !transcribiendo && (
                <p style={{ fontSize:"12px", color:"#86EFAC", margin:0 }}>
                  ✓ Listo — revisa que los datos estén bien y ajusta lo que haga falta.
                </p>
              )}

              <div>
                <label style={lbl}>Oficio principal *</label>
                <select style={inp} value={categoriaId}
                  onChange={e => { setCategoriaId(e.target.value); setSubcategoriaId(""); }}>
                  {TAXONOMIA.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              <div>
                <label style={lbl}>Especialidad (opcional)</label>
                <select style={inp} value={subcategoriaId}
                  onChange={e => setSubcategoriaId(e.target.value)}>
                  <option value="">— General —</option>
                  {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                <div>
                  <label style={lbl}>Ciudad *</label>
                  <input style={inp} value={ciudad} onChange={e => setCiudad(e.target.value)}
                    placeholder="Cancún, CDMX..." />
                </div>
                <div>
                  <label style={lbl}>Años de experiencia</label>
                  <input style={inp} type="number" value={experiencia}
                    onChange={e => setExperiencia(e.target.value)}
                    placeholder="0" min="0" max="60" />
                </div>
              </div>

              <div>
                <label style={lbl}>Descripción (opcional)</label>
                <textarea
                  style={{ ...inp, resize:"vertical", minHeight:"90px" }}
                  value={descripcion} onChange={e => setDescripcion(e.target.value)}
                  placeholder="Soy electricista con 10 años de experiencia, hago instalaciones en casas y negocios..." />
                <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.25)", marginTop:"4px" }}>
                  La IA de Habilis la mejora automáticamente al crear tu perfil.
                </p>
              </div>

              <label style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"14px",
                              color:"rgba(255,255,255,0.7)", cursor:"pointer" }}>
                <input type="checkbox" checked={herramientas}
                  onChange={e => setHerramientas(e.target.checked)}
                  style={{ width:"16px", height:"16px", accentColor:"#F97316" }} />
                Cuento con herramienta propia
              </label>
              </>)}

              {error && (
                <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.28)",
                              borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#FCA5A5" }}>
                  {error}
                </div>
              )}

              <button onClick={submit} disabled={loading}
                style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                         borderRadius:"12px", padding:"14px", fontSize:"15px", fontWeight:800,
                         cursor:"pointer", opacity: loading ? 0.75 : 1, marginTop:"4px",
                         boxShadow:"0 4px 14px rgba(249,115,22,0.3)" }}>
                {loading ? "Creando cuenta..." : esCliente ? "Crear mi cuenta →" : "Crear mi perfil gratis →"}
              </button>

              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.25)", textAlign:"center" }}>
                Al continuar aceptas los{" "}
                <button onClick={() => nav("terminos")}
                  style={{ background:"none", border:"none", color:"rgba(249,115,22,0.8)",
                           fontSize:"12px", cursor:"pointer", padding:0, textDecoration:"underline" }}>
                  términos y condiciones
                </button>
                {" "}y el{" "}
                <button onClick={() => nav("privacidad")}
                  style={{ background:"none", border:"none", color:"rgba(249,115,22,0.8)",
                           fontSize:"12px", cursor:"pointer", padding:0, textDecoration:"underline" }}>
                  aviso de privacidad
                </button>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
