import { useEffect, useMemo, useState } from "react";
import { isAdminUser, AdminLoginGate } from "./admin/AdminLayout.jsx";

// Página privada, sin link en ningún menú — solo accesible sabiendo la URL
// (/inversion) y logueado con la cuenta admin. No se indexa.

const fmtMXN = (n) => `$${Math.round(n).toLocaleString("es-MX")} MXN`;
const fmtPct = (n) => `${n.toFixed(1)}%`;

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "24px 28px" };
const inp = { border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 12px", fontSize: 15, width: "100%", fontWeight: 700 };
const lbl = { fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.3, display: "block", marginBottom: 6 };

function CalculadoraEquity() {
  const [inversion, setInversion] = useState(1000000);
  const [valuacionPre, setValuacionPre] = useState(5000000);
  const [pctASecundario, setPctASecundario] = useState(50); // % de la inversión que va al fundador vs a la empresa

  const valuacionPost = valuacionPre + inversion;
  const pctInversionista = (inversion / valuacionPost) * 100;
  const pctFundador = 100 - pctInversionista;
  const aEmpresa = inversion * (1 - pctASecundario / 100);
  const aFundador = inversion * (pctASecundario / 100);

  return (
    <div style={CARD}>
      <h3 style={{ marginBottom: 4 }}>Calculadora de la ronda</h3>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Mete los números que estás negociando — todo se recalcula solo.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={lbl}>Capital que invierte (MXN)</label>
          <input style={inp} type="number" value={inversion} onChange={(e) => setInversion(parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label style={lbl}>Valuación pre-money (MXN)</label>
          <input style={inp} type="number" value={valuacionPre} onChange={(e) => setValuacionPre(parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label style={lbl}>% de la inversión que va a ti (secundario)</label>
          <input style={inp} type="number" min="0" max="100" value={pctASecundario} onChange={(e) => setPctASecundario(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14 }}>
        <Resultado label="Valuación post-money" value={fmtMXN(valuacionPost)} />
        <Resultado label="% para el inversionista" value={fmtPct(pctInversionista)} accent />
        <Resultado label="% que conservas tú" value={fmtPct(pctFundador)} accent />
        <Resultado label="Va a la empresa" value={fmtMXN(aEmpresa)} />
        <Resultado label="Va a ti (secundario)" value={fmtMXN(aFundador)} />
      </div>
    </div>
  );
}

function CalculadoraMercado() {
  const [mercado, setMercado] = useState(30000000);
  const [usuariosPago, setUsuariosPago] = useState(1000000);
  const [precio, setPrecio] = useState(100);

  const mrr = usuariosPago * precio;
  const arr = mrr * 12;
  const penetracion = (usuariosPago / mercado) * 100;

  return (
    <div style={CARD}>
      <h3 style={{ marginBottom: 4 }}>Escenario de mercado</h3>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>
        Esto es un <strong>escenario de potencial</strong>, no una proyección garantizada — sirve para dimensionar la oportunidad, no para prometer resultados.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={lbl}>Mercado potencial (técnicos)</label>
          <input style={inp} type="number" value={mercado} onChange={(e) => setMercado(parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label style={lbl}>Usuarios de pago (escenario)</label>
          <input style={inp} type="number" value={usuariosPago} onChange={(e) => setUsuariosPago(parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label style={lbl}>Precio mensual (MXN)</label>
          <input style={inp} type="number" value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14 }}>
        <Resultado label="MRR" value={fmtMXN(mrr)} />
        <Resultado label="ARR" value={fmtMXN(arr)} accent />
        <Resultado label="% de penetración del mercado" value={fmtPct(penetracion)} />
      </div>
    </div>
  );
}

function Resultado({ label, value, accent }) {
  return (
    <div style={{ background: accent ? "#FFF7ED" : "#F8FAFC", border: `1px solid ${accent ? "#FED7AA" : "#E2E8F0"}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: accent ? "#C2410C" : "#0F172A" }}>{value}</div>
    </div>
  );
}

export default function Inversion({ nav, user }) {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  if (!user) return <AdminLoginGate nav={nav} />;
  if (!isAdminUser(user)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A", color: "#fff" }}>
        <p>No tienes acceso a esta sección.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", padding: "40px clamp(16px,5vw,60px)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <span style={{ background: "#0F172A", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>
            RONDA PRIVADA DE INVERSIÓN
          </span>
          <h1 style={{ fontSize: 32, marginTop: 12 }}>Habilis</h1>
          <p style={{ color: "#64748B", fontSize: 15 }}>La infraestructura digital para el trabajo técnico independiente.</p>
        </div>

        <div style={CARD}>
          <h3>¿Qué existe hoy?</h3>
          <ul style={{ marginTop: 10, paddingLeft: 20, color: "#334155", fontSize: 14, lineHeight: 1.8 }}>
            <li>Plataforma en producción: 12+ pantallas, registro, búsqueda, cotizaciones, chat, red de colaboradores</li>
            <li>5 agentes autónomos de IA (Gemini) operando en producción: Matching, Moderador, Verificador, Care, Ranking</li>
            <li>Habilis Care — módulo de mantenimiento preventivo de equipos</li>
            <li>Panel administrativo con 8 módulos</li>
            <li>Backend en Firebase + auditoría de seguridad completa</li>
          </ul>
          <p style={{ marginTop: 14, fontSize: 13, color: "#64748B" }}>El capital no arranca desde cero — completa, comercializa y escala un producto que ya funciona.</p>
        </div>

        <CalculadoraEquity />
        <CalculadoraMercado />

        <div style={{ ...CARD, background: "#FFFBEB", borderColor: "#FDE68A" }}>
          <p style={{ fontSize: 12.5, color: "#78350F", lineHeight: 1.6 }}>
            Este documento es informativo y preliminar, dirigido exclusivamente a personas previamente identificadas.
            No constituye una oferta pública de valores, una garantía de rendimiento, ni una valuación legal, fiscal o
            financiera certificada. Los montos y porcentajes finales estarán sujetos a revisión legal y a la firma de
            los instrumentos corporativos correspondientes.
          </p>
        </div>

        <button onClick={() => nav("landing")} style={{ alignSelf: "flex-start", background: "transparent", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>
          ← Salir
        </button>
      </div>
    </div>
  );
}
