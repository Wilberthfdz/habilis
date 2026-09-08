import { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import SelectorOficio from "../components/SelectorOficio.jsx";
import ZonaDeTrabajo from "../components/ZonaDeTrabajo.jsx";
import PerfilIncluyente from "../components/PerfilIncluyente.jsx";
import { inclusionDesdePerfil, problemaDeInclusion } from "../lib/inclusion.js";
import { obtenerTecnico, actualizarTecnico, subirFotoPerfil, cerrarSesion } from "../lib/firebase.js";
import { eliminarMiCuenta } from "../lib/gemini.js";

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
  const [pidiendoBaja, setPidiendoBaja] = useState(false);
  const [textoBaja,    setTextoBaja]    = useState("");
  const [borrando,     setBorrando]     = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    nombre:"", ciudad:"", experiencia:"", bio:"", zona:"", disponible:true,
  });
  // El oficio se maneja aparte porque es un objeto (categoría, especialidad
  // y, para quien no está en el catálogo, el texto libre).
  const [oficio, setOficio] = useState({
    categoriaId:"", subcategoriaId:null, oficio:"", oficioLibre:"",
  });
  // Zona aproximada (privada) y taller (público y opcional). Ver geo.js.
  const [zona, setZona] = useState({ geohash:null, geoPunto:null, radioKm:25, taller:null });
  const [inclusion, setInclusion] = useState(inclusionDesdePerfil(null));
  const set = k => e => { setOk(false); setForm(f => ({ ...f, [k]: e.target.value })); };

  useEffect(() => {
    if (!user?.uid) { setCargando(false); return; }
    obtenerTecnico(user.uid)
      .then(t => {
        if (!t) { setCargando(false); return; }
        setTecnico(t);
        setZona({
          geohash:  t.geohash  || null,
          geoPunto: t.geoPunto || null,
          radioKm:  t.radioKm  || 25,
          taller:   t.taller   || null,
        });
        setInclusion(inclusionDesdePerfil(t));
        setOficio({
          categoriaId:    t.categoriaId    || "",
          subcategoriaId: t.subcategoriaId || null,
          oficio:         t.oficio         || "",
          oficioLibre:    t.oficioLibre    || (t.categoriaId ? "" : t.oficio || ""),
        });
        setForm({
          nombre:      t.nombre      || "",
          ciudad:      t.ciudad      || "",
          experiencia: t.experiencia != null ? String(t.experiencia) : "",
          bio:         t.bio         || "",
          zona:        t.zona        || "",
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
    if (!oficio.oficio?.trim()) { setError("Dinos a qué te dedicas."); return; }
    if (!form.ciudad.trim()) { setError("Ingresa tu ciudad: es lo que usan los clientes para encontrarte."); return; }
    const faltaInclusion = problemaDeInclusion(inclusion);
    if (faltaInclusion) { setError(faltaInclusion); return; }
    setError(""); setOk(false); setGuardando(true);
    try {
      const experiencia = Math.max(0, Math.min(60, parseInt(form.experiencia) || 0));
      await actualizarTecnico(user.uid, {
        nombre:      form.nombre.trim(),
        oficio:      (oficio.oficio || "").trim(),
        categoriaId: oficio.categoriaId || null,
        subcategoriaId: oficio.subcategoriaId || null,
        oficioLibre: oficio.oficioLibre?.trim() || null,
        ciudad:      form.ciudad.trim(),
        experiencia,
        bio:         form.bio.trim(),
        // `alcance` NO se toca aquí: es la enumeración de visibilidad que se
        // configura en el panel. Escribirla como texto libre desde esta
        // pantalla borraba esa configuración en cada guardado.
        zona:        form.zona.trim(),
        // El punto ya viene redondeado a ~1 km desde el componente: aquí no
        // pasa nunca la ubicación exacta que dio el navegador.
        geohash:     zona.geohash  || null,
        geoPunto:    zona.geoPunto || null,
        radioKm:     zona.radioKm  || 25,
        taller:      zona.taller?.publico ? {
          publico:   true,
          direccion: (zona.taller.direccion || "").trim().slice(0, 160),
          horario:   (zona.taller.horario   || "").trim().slice(0, 100),
        } : null,
        disponible:  form.disponible,
        inclusion,
      });
      setOk(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar. Intenta de nuevo en un momento.");
    } finally { setGuardando(false); }
  };

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

            <div style={{ background:"#0F172A", borderRadius:"14px", padding:"18px" }}>
              <SelectorOficio valor={oficio} onChange={o => { setOk(false); setOficio(o); }} />
            </div>

            <div>
              <label style={lbl}>Años de experiencia</label>
              <input style={inp} type="number" min="0" max="60"
                value={form.experiencia} onChange={set("experiencia")} />
            </div>

            <div style={{ background:"#F8FAFC", border:"1px solid #E2E8F0",
                          borderRadius:"14px", padding:"18px" }}>
              <ZonaDeTrabajo valor={zona} onChange={o => { setOk(false); setZona(o); }} />
            </div>

            <div>
              <label style={lbl}>Descripción de tu zona (opcional)</label>
              <input style={inp} value={form.zona} onChange={set("zona")}
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

            <PerfilIncluyente valor={inclusion} onChange={o => { setOk(false); setInclusion(o); }} nav={nav} />

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

            {/* Eliminar la cuenta. Es obligatorio poder hacerlo desde dentro
                de la app —Apple y Google rechazan lo contrario— y es el
                derecho de cancelación del aviso de privacidad. Antes solo se
                atendía escribiendo un correo. */}
            <div style={{ borderTop:"1px solid #FEE2E2", marginTop:"6px", paddingTop:"18px" }}>
              {!pidiendoBaja ? (
                <button onClick={() => { setPidiendoBaja(true); setError(""); }}
                  style={{ background:"none", border:"none", color:"#DC2626", fontSize:"13px",
                           fontWeight:600, cursor:"pointer", padding:0, textDecoration:"underline" }}>
                  Eliminar mi cuenta
                </button>
              ) : (
                <div style={{ background:"#FEF2F2", border:"1px solid #FECACA",
                              borderRadius:"12px", padding:"16px 18px" }}>
                  <p style={{ fontWeight:800, fontSize:"14px", color:"#B91C1C", marginBottom:"8px" }}>
                    Esto no se puede deshacer
                  </p>
                  <p style={{ fontSize:"13px", color:"#7F1D1D", lineHeight:1.65, marginBottom:"6px" }}>
                    Se borran tu perfil, tus trabajos documentados, tus cotizaciones, tus
                    equipos de Habilis Care y tus clientes guardados. Si tienes una
                    suscripción activa, la cancelamos antes de borrar.
                  </p>
                  <p style={{ fontSize:"12px", color:"#991B1B", lineHeight:1.6, marginBottom:"14px" }}>
                    Tus cobros y facturas se conservan cinco años sin tus datos personales,
                    porque la ley fiscal nos obliga. Tus conversaciones siguen existiendo
                    para la otra persona, ya sin tu nombre.
                  </p>
                  <label style={{ ...lbl, color:"#991B1B" }}>
                    Escribe ELIMINAR para confirmar
                  </label>
                  <input style={{ ...inp, borderColor:"#FECACA" }} value={textoBaja}
                    onChange={e => setTextoBaja(e.target.value)} placeholder="ELIMINAR" />
                  <div style={{ display:"flex", gap:"10px", marginTop:"12px" }}>
                    <button onClick={() => { setPidiendoBaja(false); setTextoBaja(""); }}
                      style={{ flex:1, background:"#fff", color:"#0F172A", border:"1px solid #E2E8F0",
                               borderRadius:"10px", padding:"11px", fontWeight:600, cursor:"pointer" }}>
                      Mejor no
                    </button>
                    <button
                      disabled={textoBaja.trim().toUpperCase() !== "ELIMINAR" || borrando}
                      onClick={async () => {
                        setBorrando(true); setError("");
                        try {
                          await eliminarMiCuenta();
                          await cerrarSesion().catch(() => {});
                          nav("landing");
                        } catch (e) {
                          console.error(e);
                          setError(e?.message || "No se pudo eliminar la cuenta. Intenta de nuevo o escríbenos.");
                          setBorrando(false);
                        }
                      }}
                      style={{ flex:1, background:"#DC2626", color:"#fff", border:"none",
                               borderRadius:"10px", padding:"11px", fontWeight:700, cursor:"pointer",
                               opacity: (textoBaja.trim().toUpperCase() !== "ELIMINAR" || borrando) ? 0.5 : 1 }}>
                      {borrando ? "Eliminando…" : "Eliminar definitivamente"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
