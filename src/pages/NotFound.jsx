import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";

export default function NotFound({ nav, user }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9" }}>
      <Nav nav={nav} user={user} />
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "100px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", marginBottom: 10 }}>
          Página no encontrada
        </h1>
        <p style={{ color: "#64748B", fontSize: 14.5, lineHeight: 1.7, marginBottom: 26 }}>
          El enlace que seguiste no existe o ya no está disponible. Revisa que la dirección esté
          bien escrita, o vuelve al inicio.
        </p>
        <button className="h-btn-orange" style={{ padding: "12px 24px", fontSize: 14 }}
          onClick={() => nav("landing")}>
          Ir al inicio
        </button>
      </div>
      <div style={{ padding: 22, textAlign: "center", background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <Logo size={22} textColor="#0A1120" onClick={() => nav("landing")} />
      </div>
    </div>
  );
}
