import { useState } from "react";
import Logo from "../components/Logo.jsx";
import Avatar from "../components/Avatar.jsx";
import AceptarTerminos from "../components/AceptarTerminos.jsx";
import RegistroPorVoz from "../components/RegistroPorVoz.jsx";
import SelectorOficio from "../components/SelectorOficio.jsx";
import PerfilIncluyente from "../components/PerfilIncluyente.jsx";
import { problemaDeInclusion } from "../lib/inclusion.js";
import { resolverOficioLibre } from "../lib/oficios.js";
import { crearPerfilTecnico, cerrarSesion } from "../lib/firebase.js";
import { TAXONOMIA } from "../lib/taxonomia.js";

const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };

const lbl = { fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.65)",
              textTransform:"uppercase", letterSpacing:"0.06em",
              display:"block", marginBottom:"5px" };

// Este es el ÚNICO formulario de perfil del producto: llegan aquí tanto
// quien se registró con correo como quien entró con Google o Apple, así que
// todos reciben la taxonomía completa, el dictado por voz y la salida para
// oficios que no están en el catálogo.
export default function CompletarPerfil({ nav, user, params = {} }) {
  const nombreCuenta = user?.displayName || params.nombre || "";
  const correoCuenta = user?.email       || "";
  const fotoCuenta   = user?.photoURL    || null;
  // Quien viene del alta por correo ya aceptó en la pantalla anterior; no se
  // le vuelve a preguntar, pero la constancia sí se guarda aquí, que es
  // donde nace el documento del perfil.
  const yaAcepto     = params.aceptoTerminos === true;

  const [oficio,       setOficio]       = useState({
    categoriaId: TAXONOMIA[0].id, subcategoriaId: null,
    oficio: TAXONOMIA[0].nombre, oficioLibre: "",
  });
  const [ciudad,       setCiudad]       = useState("");
  const [experiencia,  setExperiencia]  = useState("");
  const [descripcion,  setDescripcion]  = useState("");
  const [herramientas, setHerramientas] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [acepto,       setAcepto]       = useState(yaAcepto);
  const [comercial,    setComercial]    = useState(params.aceptoComunicaciones === true);
  const [inclusion,    setInclusion]    = useState({ activo:false, consentimiento:false, tipos:[], comoTrabajo:"" });

  // Lo que dicta el técnico llena los campos; el oficio se resuelve contra
  // la taxonomía y, si no cae en ninguna categoría, se conserva tal cual.
  const aplicarVoz = out => {
    if (out.ciudad)      setCiudad(out.ciudad);
    if (out.experiencia) setExperiencia(String(out.experiencia));
    if (out.bio)         setDescripcion(out.bio);
    if (out.oficio) {
      const resuelto = resolverOficioLibre(out.oficio);
      if (resuelto) setOficio(resuelto);
    }
  };

  const submit = async () => {
    if (!oficio.oficio?.trim()) { setError("Dinos a qué te dedicas para continuar."); return; }
    if (!ciudad.trim()) { setError("Ingresa tu ciudad para continuar."); return; }
    if (!acepto) { setError("Debes aceptar los Términos y el Aviso de Privacidad para continuar."); return; }
    const faltaInclusion = problemaDeInclusion(inclusion);
    if (faltaInclusion) { setError(faltaInclusion); return; }
    setError(""); setLoading(true);
    try {
      await crearPerfilTecnico(user.uid, {
        nombre:        nombreCuenta || "Sin nombre",
        email:         correoCuenta,
        fotoUrl:       fotoCuenta || null,
        // `oficio` se guarda como texto por compatibilidad con los perfiles
        // que ya existen y con el agente de matching; los ids de taxonomía
        // van aparte y quedan en null cuando el oficio es de fuera.
        oficio:        oficio.oficio.trim(),
        categoriaId:   oficio.categoriaId,
        subcategoriaId: oficio.subcategoriaId || null,
        oficioLibre:   oficio.oficioLibre?.trim() || null,
        ciudad:        ciudad.trim(),
        experiencia:   Math.max(0, Math.min(60, parseInt(experiencia) || 0)),
        bio:           descripcion.trim(),
        herramientas,
        disponibilidad:"",
        tipo:          "tecnico",
        plan:          "gratis",
        rating:        0,
        totalTrabajos: 0,
        disponible:    true,
        aceptoTerminos: true,
        aceptoComunicaciones: comercial,
        inclusion,
      });
      // Quien venía por el Plan Pro sigue al checkout; el resto, a la
      // bienvenida. Antes la intención se perdía aquí.
      nav(params.plan === "pro" ? "suscripcionPro" : "bienvenida");
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
          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.65)",
                   fontSize:"13px", cursor:"pointer" }}>
          Salir
        </button>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"flex-start", justifyContent:"center",
                    padding:"8px 20px 48px", position:"relative", zIndex:1 }}>
        <div style={{ width:"100%", maxWidth:"480px" }}>

          {/* Card */}
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)",
                        borderRadius:"24px", padding:"36px 32px", backdropFilter:"blur(16px)" }}>

            {/* Google account preview */}
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"28px",
                          background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"14px 16px",
                          border:"1px solid rgba(255,255,255,0.08)" }}>
              {fotoCuenta ? (
                <img src={fotoCuenta} alt={nombreCuenta}
                  style={{ width:"44px", height:"44px", borderRadius:"12px", objectFit:"cover",
                           border:"2px solid rgba(249,115,22,0.4)", flexShrink:0 }} />
              ) : (
                <Avatar size={44} nombre={nombreCuenta} plan="gratis" />
              )}
              <div>
                <p style={{ fontWeight:700, fontSize:"14px", color:"#fff", marginBottom:"2px" }}>
                  {nombreCuenta || "Tu cuenta"}
                </p>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.65)" }}>{correoCuenta}</p>
              </div>
            </div>

            <h1 style={{ fontSize:"22px", fontWeight:900, color:"#fff", marginBottom:"6px" }}>
              ¡Un paso más!
            </h1>
            <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"14px", marginBottom:"20px", lineHeight:1.5 }}>
              Cuéntanos a qué te dedicas para que los clientes te encuentren.
              Cualquier oficio cabe aquí.
            </p>

            {/* ── Registro por voz ── */}
            <div style={{ marginBottom:"20px" }}>
              <RegistroPorVoz onDatos={aplicarVoz} onError={setError} />
            </div>

            {/* Fields */}
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

              <SelectorOficio valor={oficio} onChange={setOficio} />

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
                <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.6)", marginTop:"4px" }}>
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

              <PerfilIncluyente valor={inclusion} onChange={setInclusion} oscuro nav={nav} />

              {error && (
                <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.28)",
                              borderRadius:"10px", padding:"10px 14px", fontSize:"13px", color:"#FCA5A5" }}>
                  {error}
                </div>
              )}

              {!yaAcepto && <AceptarTerminos nav={nav} valor={acepto} onChange={setAcepto} tipo="tecnico"
                comercial={comercial} onChangeComercial={setComercial} />}

              <button onClick={submit} disabled={loading || !acepto}
                style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                         borderRadius:"12px", padding:"14px", fontSize:"15px", fontWeight:800,
                         cursor: acepto ? "pointer" : "not-allowed",
                         opacity: (loading || !acepto) ? 0.55 : 1, marginTop:"4px",
                         boxShadow:"0 4px 14px rgba(249,115,22,0.3)" }}>
                {loading ? "Creando perfil..." : "Crear mi perfil gratis →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
