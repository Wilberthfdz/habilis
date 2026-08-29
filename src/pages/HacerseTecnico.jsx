import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { obtenerCliente, obtenerTecnico, crearPerfilTecnico } from "../lib/firebase.js";
import { TAXONOMIA } from "../lib/taxonomia.js";

const inp = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };
const lbl = { fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
              letterSpacing:"0.06em", display:"block", marginBottom:"5px" };
const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
               padding:"24px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };

export default function HacerseTecnico({ nav, user }) {
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [yaEsTecnico, setYaEsTecnico] = useState(false);

  const [nombre,   setNombre]   = useState("");
  const [categoriaId,    setCategoriaId]    = useState("electricidad");
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [ciudad,   setCiudad]   = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [bio,      setBio]      = useState("");
  const [herramientas, setHerramientas] = useState(false);

  useEffect(() => {
    if (!user) { nav("login"); return; }
    Promise.all([obtenerCliente(user.uid), obtenerTecnico(user.uid)]).then(([c, t]) => {
      setNombre(c?.nombre || user.displayName || "");
      setCiudad(c?.ciudad || "");
      setYaEsTecnico(!!t);
    }).finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const categoria = TAXONOMIA.find(c => c.id === categoriaId) || TAXONOMIA[0];
  const subcategorias = categoria.subcategorias || [];
  const subcategoria = subcategorias.find(s => s.id === subcategoriaId) || null;
  const oficioTexto = subcategoria ? subcategoria.nombre : categoria.nombre;

  const guardar = async () => {
    if (!nombre.trim()) { setError("Ingresa tu nombre."); return; }
    if (!ciudad.trim())  { setError("Ingresa tu ciudad."); return; }
    setError(""); setSaving(true);
    try {
      await crearPerfilTecnico(user.uid, {
        nombre: nombre.trim(),
        email:  user.email || "",
        oficio: oficioTexto,
        categoriaId: categoria.id,
        subcategoriaId: subcategoria ? subcategoria.id : null,
        ciudad: ciudad.trim(),
        experiencia: parseInt(experiencia) || 0,
        bio: bio.trim(),
        herramientas,
        tipo:"tecnico", plan:"gratis", rating:0, totalTrabajos:0, disponible:true,
      });
      nav("bienvenida");
    } catch (e) {
      setError(e.message || "No se pudo crear tu perfil de técnico. Intenta de nuevo.");
    } finally { setSaving(false); }
  };

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      <div style={{ background:"#0F172A", padding:"32px 20px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"380px", height:"380px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"560px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.1em", marginBottom:"8px" }}>🔧 Ofrece tus servicios</p>
          <h1 style={{ fontSize:"clamp(20px,4vw,30px)", fontWeight:900, color:"#fff" }}>
            Crea tu perfil de técnico
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px", marginTop:"6px" }}>
            Se agrega a tu cuenta actual — sigues teniendo acceso a "Mis solicitudes" como cliente.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"560px", margin:"0 auto", padding:"24px 20px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                          borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
            <p style={{ color:"#64748B" }}>Cargando...</p>
          </div>
        ) : yaEsTecnico ? (
          <div style={{ ...CARD, textAlign:"center" }}>
            <div style={{ fontSize:"38px", marginBottom:"10px" }}>✅</div>
            <h2 style={{ fontWeight:800, fontSize:"17px", color:"#0F172A", marginBottom:"8px" }}>
              Ya tienes un perfil de técnico
            </h2>
            <button onClick={() => nav("panel")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"12px 24px", fontWeight:700, cursor:"pointer" }}>
              Ir a mi Panel →
            </button>
          </div>
        ) : (
          <div style={CARD}>
            <div style={{ marginBottom:"16px" }}>
              <label style={lbl}>Nombre *</label>
              <input style={inp} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px" }}>
              <div>
                <label style={lbl}>Oficio *</label>
                <select style={inp} value={categoriaId}
                  onChange={e => { setCategoriaId(e.target.value); setSubcategoriaId(""); }}>
                  {TAXONOMIA.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              {subcategorias.length > 0 && (
                <div>
                  <label style={lbl}>Especialidad</label>
                  <select style={inp} value={subcategoriaId} onChange={e => setSubcategoriaId(e.target.value)}>
                    <option value="">General</option>
                    {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div style={{ marginBottom:"16px" }}>
              <label style={lbl}>Ciudad *</label>
              <input style={inp} value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="CDMX, GDL..." />
            </div>

            <div style={{ marginBottom:"16px" }}>
              <label style={lbl}>Años de experiencia</label>
              <input style={inp} type="number" min="0" value={experiencia}
                onChange={e => setExperiencia(e.target.value)} placeholder="0" />
            </div>

            <div style={{ marginBottom:"16px" }}>
              <label style={lbl}>Cuéntanos de ti (opcional)</label>
              <textarea style={{ ...inp, resize:"vertical", minHeight:"70px" }} value={bio}
                onChange={e => setBio(e.target.value)} placeholder="Especialidad, certificaciones, zona donde trabajas..." />
            </div>

            <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px",
                            color:"#374151", marginBottom:"20px", cursor:"pointer" }}>
              <input type="checkbox" checked={herramientas} onChange={e => setHerramientas(e.target.checked)} />
              Cuento con mis propias herramientas
            </label>

            {error && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"10px",
                            padding:"10px 14px", fontSize:"13px", color:"#DC2626", marginBottom:"16px" }}>
                {error}
              </div>
            )}

            <button onClick={guardar} disabled={saving}
              style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                       borderRadius:"12px", padding:"14px", fontSize:"15px", fontWeight:800,
                       cursor:"pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Creando perfil..." : "Crear perfil de técnico"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
