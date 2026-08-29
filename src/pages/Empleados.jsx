import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import { obtenerTecnico, obtenerEmpleados, crearEmpleado, actualizarEmpleado, eliminarEmpleado } from "../lib/firebase.js";
import { TAXONOMIA } from "../lib/taxonomia.js";

const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
               padding:"20px", marginBottom:"14px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };
const BTN  = { background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
               padding:"11px 18px", fontSize:"14px", fontWeight:700, cursor:"pointer" };
const INP  = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
               padding:"10px 13px", fontSize:"14px", outline:"none",
               background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };
const LBL  = { fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
               letterSpacing:"0.06em", display:"block", marginBottom:"4px" };

const VACIO = { nombre:"", categoriaId:"electricidad", ciudad:"", experiencia:"", bio:"" };

export default function Empleados({ nav, user }) {
  const [tecnico,   setTecnico]   = useState(undefined);
  const [empleados, setEmpleados] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [form,       setForm]       = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando,  setGuardando]  = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    if (!user) { nav("login"); return; }
    cargar();
  }, [user]);

  const cargar = async () => {
    setLoading(true);
    try {
      const [t, emp] = await Promise.all([obtenerTecnico(user.uid), obtenerEmpleados(user.uid)]);
      setTecnico(t);
      setEmpleados(emp);
    } finally { setLoading(false); }
  };

  const editar = e => {
    setEditandoId(e.id);
    setForm({
      nombre: e.nombre || "", categoriaId: e.categoriaId || "electricidad",
      ciudad: e.ciudad || "", experiencia: String(e.experiencia || ""), bio: e.bio || "",
    });
  };

  const cancelarEdicion = () => { setEditandoId(null); setForm(VACIO); setError(""); };

  const guardar = async () => {
    if (!form.nombre.trim()) { setError("Ingresa el nombre del empleado."); return; }
    setError(""); setGuardando(true);
    const categoria = TAXONOMIA.find(c => c.id === form.categoriaId) || TAXONOMIA[0];
    const datos = {
      nombre: form.nombre.trim(),
      oficio: categoria.nombre,
      categoriaId: categoria.id,
      ciudad: form.ciudad.trim(),
      experiencia: parseInt(form.experiencia) || 0,
      bio: form.bio.trim(),
    };
    try {
      if (editandoId) await actualizarEmpleado(editandoId, datos);
      else await crearEmpleado(user.uid, datos);
      cancelarEdicion();
      cargar();
    } catch (e) {
      setError(e.message || "No se pudo guardar. Intenta de nuevo.");
    } finally { setGuardando(false); }
  };

  const eliminar = async id => {
    if (!window.confirm("¿Quitar a este empleado de tu equipo? Su perfil deja de aparecer en las búsquedas.")) return;
    await eliminarEmpleado(id);
    cargar();
  };

  if (loading || tecnico === undefined) return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>
      <div style={{ textAlign:"center", padding:"100px 20px" }}>
        <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                      borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
        <p style={{ color:"#64748B" }}>Cargando tu equipo...</p>
      </div>
    </div>
  );

  if (tecnico?.plan !== "empresa") return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>
      <div style={{ maxWidth:"480px", margin:"0 auto", padding:"48px 20px" }}>
        <div className="h-card" style={{ ...CARD, textAlign:"center", padding:"36px" }}>
          <div style={{ fontSize:"38px", marginBottom:"10px" }}>🏢</div>
          <h1 style={{ fontSize:"20px", fontWeight:900, color:"#0F172A", marginBottom:"8px" }}>
            Esto es para cuentas Empresa
          </h1>
          <p style={{ fontSize:"14px", color:"#64748B", marginBottom:"20px" }}>
            Con el Plan Empresa puedes agregar empleados a tu equipo — cada uno con su
            propio perfil, visible en las búsquedas de Habilis.
          </p>
          <button style={BTN} onClick={() => nav("suscripcionEmpresa")}>Conocer el Plan Empresa →</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      <div style={{ background:"#0F172A", padding:"32px 20px 28px" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto" }}>
          <h1 style={{ fontSize:"clamp(20px,4vw,28px)", fontWeight:900, color:"#fff", marginBottom:"4px" }}>
            🏢 Tu equipo
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
            {empleados.length} empleado{empleados.length === 1 ? "" : "s"} · aparecen en las búsquedas de Habilis
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"20px" }}>
        <div style={CARD}>
          <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"14px" }}>
            {editandoId ? "Editar empleado" : "Agregar empleado"}
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"10px" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={LBL}>Nombre *</label>
              <input style={INP} value={form.nombre} placeholder="Nombre del empleado"
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
            </div>
            <div>
              <label style={LBL}>Oficio</label>
              <select style={INP} value={form.categoriaId}
                onChange={e => setForm(f => ({ ...f, categoriaId: e.target.value }))}>
                {TAXONOMIA.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={LBL}>Ciudad</label>
              <input style={INP} value={form.ciudad} placeholder="Ciudad"
                onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))} />
            </div>
            <div>
              <label style={LBL}>Experiencia (años)</label>
              <input style={INP} type="number" value={form.experiencia} placeholder="0"
                onChange={e => setForm(f => ({ ...f, experiencia: e.target.value }))} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={LBL}>Descripción (opcional)</label>
              <textarea style={{ ...INP, resize:"vertical", minHeight:"60px" }}
                value={form.bio} placeholder="Especialidad, certificaciones, etc."
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
            </div>
          </div>

          {error && (
            <p style={{ fontSize:"13px", color:"#DC2626", background:"#FEE2E2", borderRadius:"8px",
                        padding:"10px 14px", marginBottom:"12px" }}>{error}</p>
          )}

          <div style={{ display:"flex", gap:"10px" }}>
            <button onClick={guardar} disabled={guardando}
              style={{ ...BTN, flex:1, opacity: guardando ? 0.6 : 1 }}>
              {guardando ? "Guardando..." : editandoId ? "Guardar cambios" : "+ Agregar empleado"}
            </button>
            {editandoId && (
              <button onClick={cancelarEdicion}
                style={{ background:"#F1F5F9", color:"#64748B", border:"none", borderRadius:"10px",
                         padding:"11px 18px", fontSize:"14px", fontWeight:700, cursor:"pointer" }}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        {empleados.length === 0 ? (
          <p style={{ color:"#94A3B8", fontSize:"13px", textAlign:"center", padding:"20px" }}>
            Aún no agregas empleados a tu equipo.
          </p>
        ) : empleados.map(e => (
          <div key={e.id} style={{ ...CARD, display:"flex", gap:"14px", alignItems:"center" }}>
            <Avatar size={48} nombre={e.nombre} fotoUrl={e.fotoUrl} plan={e.plan} />
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontWeight:800, fontSize:"14px", color:"#0F172A" }}>{e.nombre}</p>
              <p style={{ color:"#F97316", fontSize:"13px", fontWeight:600 }}>{e.oficio}</p>
              <p style={{ color:"#94A3B8", fontSize:"12px" }}>{e.ciudad || "Sin ciudad"}</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
              <button onClick={() => editar(e)}
                style={{ background:"#F1F5F9", color:"#0F172A", border:"none", borderRadius:"8px",
                         padding:"6px 12px", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
                Editar
              </button>
              <button onClick={() => eliminar(e.id)}
                style={{ background:"#FEE2E2", color:"#DC2626", border:"none", borderRadius:"8px",
                         padding:"6px 12px", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
