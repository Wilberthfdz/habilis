import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { obtenerTecnico, obtenerDisponibilidad, guardarDisponibilidad, obtenerMisCitas, esPlanPagante } from "../lib/firebase.js";
import { cancelarCitaPropia } from "../lib/gemini.js";

const DIAS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const DURACIONES = [30, 60, 90, 120];

const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
               padding:"20px", marginBottom:"14px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };
const BTN  = { background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
               padding:"11px 18px", fontSize:"14px", fontWeight:700, cursor:"pointer" };
const INP  = { border:"1px solid #E2E8F0", borderRadius:"8px", padding:"7px 9px", fontSize:"13.5px" };

const fmtFecha = (f) => {
  const [y,m,d] = f.split("-").map(Number);
  return new Date(y, m-1, d).toLocaleDateString("es-MX", { weekday:"short", day:"numeric", month:"short" });
};

export default function Agenda({ nav, user }) {
  const [tecnico, setTecnico] = useState(undefined);
  const [bloques, setBloques] = useState({}); // { [dia]: { activo, inicio, fin } }
  const [duracionMin, setDuracionMin] = useState(60);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { nav("login"); return; }
    cargar();
  }, [user]);

  const cargar = async () => {
    setLoading(true);
    try {
      const [t, disp, misCitas] = await Promise.all([
        obtenerTecnico(user.uid), obtenerDisponibilidad(user.uid), obtenerMisCitas(user.uid, "tecnicoId"),
      ]);
      setTecnico(t);
      if (disp) {
        setDuracionMin(disp.duracionMin || 60);
        const mapa = {};
        (disp.bloques || []).forEach(b => { mapa[b.dia] = { activo:true, inicio:b.inicio, fin:b.fin }; });
        setBloques(mapa);
      }
      const hoy = new Date().toISOString().slice(0,10);
      setCitas(misCitas.filter(c => c.estado !== "cancelada" && c.fecha >= hoy));
    } finally { setLoading(false); }
  };

  const setDia = (dia, cambios) => {
    setBloques(b => ({ ...b, [dia]: { activo:false, inicio:"09:00", fin:"18:00", ...b[dia], ...cambios } }));
  };

  const guardar = async () => {
    setError(""); setOk(false); setGuardando(true);
    try {
      const lista = Object.entries(bloques)
        .filter(([, v]) => v.activo)
        .map(([dia, v]) => ({ dia:Number(dia), inicio:v.inicio, fin:v.fin }));
      const invalido = lista.some(b => b.inicio >= b.fin);
      if (invalido) { setError("La hora de inicio debe ser antes que la de fin."); setGuardando(false); return; }
      await guardarDisponibilidad(user.uid, lista, duracionMin);
      setOk(true);
      setTimeout(() => setOk(false), 2500);
    } catch (e) {
      setError(e.message || "No se pudo guardar tu agenda.");
    } finally { setGuardando(false); }
  };

  const cancelar = async (citaId) => {
    if (!window.confirm("¿Cancelar esta cita?")) return;
    try {
      await cancelarCitaPropia(citaId);
      setCitas(cs => cs.filter(c => c.id !== citaId));
    } catch (e) { alert(e.message || "No se pudo cancelar."); }
  };

  if (loading || tecnico === undefined) return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>
      <div style={{ textAlign:"center", padding:"100px 20px" }}>
        <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                      borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
        <p style={{ color:"#64748B" }}>Cargando tu agenda...</p>
      </div>
    </div>
  );

  if (!esPlanPagante(tecnico?.plan)) return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>
      <div style={{ maxWidth:"480px", margin:"0 auto", padding:"48px 20px" }}>
        <div style={{ ...CARD, textAlign:"center", padding:"36px" }}>
          <div style={{ fontSize:"38px", marginBottom:"10px" }}>📅</div>
          <h1 style={{ fontSize:"20px", fontWeight:900, color:"#0F172A", marginBottom:"8px" }}>
            La agenda es un beneficio Pro
          </h1>
          <p style={{ fontSize:"14px", color:"#64748B", marginBottom:"20px" }}>
            Con Plan Pro o Empresa, tus clientes pueden agendar una cita directo en tu horario disponible — sin ida y vuelta por chat.
          </p>
          <button style={BTN} onClick={() => nav("precios")}>Conocer Plan Pro →</button>
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
            📅 Mi agenda
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
            Marca tus horarios disponibles para que los clientes agenden solos.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"20px" }}>
        <div style={CARD}>
          <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"14px" }}>Disponibilidad semanal</h3>

          <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"#374151", marginBottom:"14px" }}>
            Duración de cada cita
            <select value={duracionMin} onChange={e => setDuracionMin(Number(e.target.value))} style={INP}>
              {DURACIONES.map(d => <option key={d} value={d}>{d} min</option>)}
            </select>
          </label>

          {DIAS.map((nombre, dia) => {
            const v = bloques[dia] || { activo:false, inicio:"09:00", fin:"18:00" };
            return (
              <div key={dia} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 0",
                                       borderBottom: dia < 6 ? "1px solid #F1F5F9" : "none", flexWrap:"wrap" }}>
                <label style={{ display:"flex", alignItems:"center", gap:"6px", width:"110px", fontSize:"13.5px",
                                fontWeight: v.activo ? 700 : 500, color: v.activo ? "#0F172A" : "#94A3B8" }}>
                  <input type="checkbox" checked={v.activo} onChange={e => setDia(dia, { activo:e.target.checked })} />
                  {nombre}
                </label>
                {v.activo && (
                  <>
                    <input type="time" value={v.inicio} onChange={e => setDia(dia, { inicio:e.target.value })} style={INP} />
                    <span style={{ color:"#94A3B8", fontSize:"12px" }}>a</span>
                    <input type="time" value={v.fin} onChange={e => setDia(dia, { fin:e.target.value })} style={INP} />
                  </>
                )}
              </div>
            );
          })}

          {error && <p style={{ color:"#DC2626", fontSize:"13px", marginTop:"12px" }}>{error}</p>}
          {ok && <p style={{ color:"#059669", fontSize:"13px", marginTop:"12px" }}>✓ Agenda guardada.</p>}

          <button onClick={guardar} disabled={guardando} style={{ ...BTN, marginTop:"16px", opacity: guardando ? 0.6 : 1 }}>
            {guardando ? "Guardando…" : "Guardar disponibilidad"}
          </button>
        </div>

        <div style={CARD}>
          <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"14px" }}>
            Próximas citas {citas.length > 0 && `(${citas.length})`}
          </h3>
          {citas.length === 0 ? (
            <p style={{ color:"#94A3B8", fontSize:"13px" }}>Aún no tienes citas agendadas.</p>
          ) : citas.map(c => (
            <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"10px",
                                      padding:"10px 0", borderBottom:"1px solid #F1F5F9", flexWrap:"wrap" }}>
              <div>
                <p style={{ fontWeight:700, fontSize:"13.5px", color:"#0F172A" }}>
                  {fmtFecha(c.fecha)} · {c.hora}
                </p>
                <p style={{ fontSize:"12.5px", color:"#64748B" }}>
                  {c.clienteNombre || "Cliente"}{c.nota ? ` — ${c.nota}` : ""}
                </p>
              </div>
              <button onClick={() => cancelar(c.id)}
                style={{ background:"#FEE2E2", color:"#DC2626", border:"none", borderRadius:"8px",
                         padding:"6px 12px", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
                Cancelar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
