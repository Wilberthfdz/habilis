import { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import { obtenerTecnico, actualizarTecnico, subirFotoPerfil, cerrarSesion } from "../lib/firebase.js";
import { TAXONOMIA } from "../lib/taxonomia.js";

// El botón "Editar perfil" del panel mostraba un alert de "próximamente":
// el técnico no tenía forma de corregir su ciudad, su oficio ni su bio
// después del alta. Los campos editables son exactamente los que permiten
// las reglas de Firestore — plan, rating y verificado son del backend.
const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#fff", color:"#0F172A", boxSizing:"border-box" };

const lbl = { fontSize:"11px", fontWeight:700, color:"#64748B",
              textTransform:"uppercase", letterSpacing:"0.06em",
              display:"block", marginBottom:"5px" };

const MAX_LADO = 512;   // la foto viaja en base64 dentro del documento

async function comprimir(file) {
  const bitmap = await createImageBitmap(file);
  const escala = Math.min(1, MAX_LADO / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width  = Math.round(bitmap.width  * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise(res => canvas.toBlob(res, "image/jpeg", 0.75));
}

export default function EditarPerfil({ nav, user }) {
  const [tecnico, setTecnico] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    nombre:"", oficio:"", ciudad:"", experiencia:"", bio:"", alcance:"", disponible:true,
  });
  const set = k => e => { setOk(false); setForm(f => ({ ...f, [k]: e.target.value })); };

  useEffect(() => {
    if (!user?.uid) { setCargando(false); return; }
    obtenerTecnico(user.uid)
      .then(t => {
        if (!t) { setCargando(false); return; }
        setTecnico(t);
        setForm({
          nombre:      t.nombre      || "",
          oficio:      t.oficio      || "",
          ciudad:      t.ciudad      || "",
          experiencia: t.experiencia != null ? String(t.experiencia) : "",
          bio:         t.bio         || "",
          alcance:     t.alcance     || "",
          disponible:  t.disponible !== false,
        });
      })
      .catch(() => setError("No pudimos cargar tu perfil. Revisa tu conexión."))
      .finally(() => setCargando(false));
  }, [user?.uid]);

  const cambiarFoto = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(""); setOk(false); setSubiendoFoto(true);
    try {
      const blob = await comprimir(file);
      const url  = await subirFotoPerfil(user.uid, blob);
      setTecnico(t => ({ ...t, fotoUrl: url }));
      setOk(true);
    } catch (err) {
      setError(err.message || "No se pudo actualizar la foto.");
    } finally {
      setSubiendoFoto(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const guardar = async () => {
    if (!form.nombre.trim()) { setError("Tu nombre no puede quedar vacío."); return; }
    if (!form.ciudad.trim()) { setError("Ingresa tu ciudad: es lo que usan los clientes para encontrarte."); return; }
    setError(""); setOk(false); setGuardando(true);
    try {
      const experiencia = Math.max(0, Math.min(60, parseInt(form.experiencia) || 0));
      await actualizarTecnico(user.uid, {
        nombre:      form.nombre.trim(),
        oficio:      form.oficio,
        ciudad:      form.ciudad.trim(),
        experiencia,
        bio:         form.bio.trim(),
        alcance:     form.alcance.trim(),
        disponible:  form.disponible,
      });
      setOk(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar. Intenta de nuevo en un momento.");
    } finally { setGuardando(false); }
  };

  const oficios = TAXONOMIA.flatMap(c =>
    (c.subcategorias?.length ? c.subcategorias.map(s => s.nombre) : [c.nombre]));
  // Un perfil viejo puede tener un oficio que ya no está en la taxonomía;
  // sin esto el <select> lo perdería silenciosamente al guardar.
  const opciones = form.oficio && !oficios.includes(form.oficio)
    ? [form.oficio, ...oficios] : oficios;

  return (
    <div style={{ minHeight:"100vh", background:"#F8FAFC" }}>
      <div style={{ background:"#0F172A" }}>
        <Nav nav={nav} user={user} onLogout={async () => { await cerrarSesion(); nav("landing"); }} />
      </div>
      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"28px 20px 60px" }}>
        <button onClick={() => nav("panel")}
          style={{ background:"none", border:"none", color:"#64748B", fontSize:"13px",
                   cursor:"pointer", padding:0, marginBottom:"14px" }}>
          ← Volver al panel
        </button>

        <h1 style={{ fontSize:"26px", fontWeight:900, color:"#0F172A", marginBottom:"4px" }}>
          Editar perfil
        </h1>
        <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"24px" }}>
          Así te ven los clientes cuando te encuentran en las búsquedas.
        </p>

        {cargando ? (
          <p style={{ color:"#64748B", fontSize:"14px" }}>Cargando tu perfil…</p>
        ) : !tecnico ? (
          <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                        padding:"28px", textAlign:"center" }}>
            <p style={{ fontWeight:700, color:"#0F172A", marginBottom:"8px" }}>
              Todavía no tienes perfil de técnico
            </p>
            <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"18px" }}>
              Créalo primero y después podrás editarlo cuando quieras.
            </p>
            <button onClick={() => nav("completarPerfil")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"12px 22px", fontWeight:700, cursor:"pointer" }}>
              Crear mi perfil →
            </button>
          </div>
        ) : (
          <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"18px",
                        padding:"26px 24px", display:"flex", flexDirection:"column", gap:"18px" }}>

            {/* Foto */}
            <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
              <Avatar size={64} nombre={form.nombre} fotoUrl={tecnico.fotoUrl} plan={tecnico.plan} />
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={cambiarFoto} style={{ display:"none" }} />
                <button onClick={() => fileRef.current?.click()} disabled={subiendoFoto}
                  style={{ background:"#F1F5F9", color:"#0F172A", border:"1px solid #E2E8F0",
                           borderRadius:"9px", padding:"9px 16px", fontSize:"13px",
                           fontWeight:600, cursor:"pointer" }}>
                  {subiendoFoto ? "Subiendo…" : tecnico.fotoUrl ? "Cambiar foto" : "Subir foto"}
                </button>
                <p style={{ fontSize:"11px", color:"#94A3B8", marginTop:"6px" }}>
                  Se reduce automáticamente. JPG o PNG.
                </p>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
              <div>
                <label style={lbl}>Nombre *</label>
                <input style={inp} value={form.nombre} onChange={set("nombre")} />
              </div>
              <div>
                <label style={lbl}>Ciudad *</label>
                <input style={inp} value={form.ciudad} onChange={set("ciudad")} placeholder="CDMX, GDL…" />
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"14px" }}>
              <div>
                <label style={lbl}>Oficio principal</label>
                <select style={inp} value={form.oficio} onChange={set("oficio")}>
                  {opciones.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Años de experiencia</label>
                <input style={inp} type="number" min="0" max="60"
                  value={form.experiencia} onChange={set("experiencia")} />
              </div>
            </div>

            <div>
              <label style={lbl}>Zona de trabajo</label>
              <input style={inp} value={form.alcance} onChange={set("alcance")}
                placeholder="Norte de la ciudad, hasta 20 km, zona metropolitana…" />
            </div>

            <div>
              <label style={lbl}>Descripción</label>
              <textarea style={{ ...inp, minHeight:"120px", resize:"vertical" }}
                value={form.bio} onChange={set("bio")} maxLength={600}
                placeholder="Qué haces, en qué te especializas y qué te distingue." />
              <p style={{ fontSize:"11px", color:"#94A3B8", marginTop:"4px" }}>
                {form.bio.length}/600 caracteres
              </p>
            </div>

            <label style={{ display:"flex", alignItems:"center", gap:"10px",
                            fontSize:"14px", color:"#0F172A", cursor:"pointer" }}>
              <input type="checkbox" checked={form.disponible}
                onChange={e => { setOk(false); setForm(f => ({ ...f, disponible:e.target.checked })); }}
                style={{ width:"16px", height:"16px", accentColor:"#F97316" }} />
              Estoy disponible para nuevos trabajos
            </label>

            {error && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"10px",
                            padding:"10px 14px", fontSize:"13px", color:"#DC2626" }}>{error}</div>
            )}
            {ok && !error && (
              <div style={{ background:"#F0FDF4", border:"1px solid #A7F3D0", borderRadius:"10px",
                            padding:"10px 14px", fontSize:"13px", fontWeight:600, color:"#059669" }}>
                ✅ Cambios guardados.
              </div>
            )}

            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={() => nav("perfil", { tecnicoId:user.uid })}
                style={{ flex:1, background:"#F1F5F9", color:"#0F172A", border:"1px solid #E2E8F0",
                         borderRadius:"10px", padding:"13px", fontWeight:600, cursor:"pointer" }}>
                Ver perfil público
              </button>
              <button onClick={guardar} disabled={guardando}
                style={{ flex:2, background:"#F97316", color:"#fff", border:"none",
                         borderRadius:"10px", padding:"13px", fontSize:"15px", fontWeight:700,
                         cursor:"pointer", opacity: guardando ? 0.7 : 1 }}>
                {guardando ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
