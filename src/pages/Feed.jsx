import React, { useState, useEffect } from 'react';

const s = {
  page: { minHeight: "100vh", background: "#F4F5F7", fontFamily: "'Inter', sans-serif" },
  header: { background: "#1E2A3B", color: "#fff", padding: "0 20px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
  logo: { background: "#D97706", color: "#fff", fontWeight: 900, fontSize: "15px", padding: "4px 10px", borderRadius: "8px", cursor: "pointer" },
  container: { maxWidth: "700px", margin: "0 auto", padding: "20px" },
  filters: { display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "10px" },
  filterBtn: active => ({
    padding: "8px 16px",
    background: active ? "#D97706" : "#fff",
    color: active ? "#fff" : "#374151",
    border: "1px solid " + (active ? "#D97706" : "#E5E7EB"),
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap"
  }),
  card: { background: "#fff", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "20px", marginBottom: "16px" },
  badge: type => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    marginBottom: "12px",
    background: type === 'trabajo' ? "#ECFDF5" : "#EFF6FF",
    color: type === 'trabajo' ? "#059669" : "#2563EB"
  }),
  title: { fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: "#111827" },
  meta: { fontSize: "13px", color: "#6B7280", marginBottom: "12px" },
  photoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" },
  photoPlaceholder: { background: "#F3F4F6", borderRadius: "8px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#9CA3AF", textAlign: "center", padding: "10px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F3F4F6", paddingTop: "12px", marginTop: "12px" },
  techName: { fontSize: "14px", fontWeight: 600, color: "#374151" },
  btn: { background: "#1E2A3B", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }
};

const MOCK_DATA = [
  {
    id: 1,
    type: 'trabajo',
    title: 'Instalación de Minisplit 1.5 Ton',
    category: 'Climas',
    city: 'Monterrey',
    tech: 'Ricardo M.',
    desc: 'Instalación completa con vacío y prueba de presión.'
  },
  {
    id: 2,
    type: 'solicitud',
    title: 'Urgente: Fuga en tubería principal',
    category: 'Plomería',
    city: 'CDMX',
    urgency: 'Alta',
    budget: '$1,500 - $2,000',
    desc: 'Tubería rota en el patio, necesito reparación hoy mismo.'
  },
  {
    id: 3,
    type: 'trabajo',
    title: 'Mantenimiento de Tablero Eléctrico',
    category: 'Electricidad',
    city: 'Guadalajara',
    tech: 'Juan P.',
    desc: 'Limpieza de terminales y balanceo de cargas.'
  },
  {
    id: 4,
    type: 'solicitud',
    title: 'Instalación de 4 Cámaras IP',
    category: 'Seguridad',
    city: 'Querétaro',
    urgency: 'Media',
    budget: '$3,000',
    desc: 'Configuración de NVR y visualización remota.'
  }
];

export default function Feed({ nav }) {
  const [filter, setFilter] = useState('todos');
  const [cityFilter, setCityFilter] = useState('todas');

  const filtered = MOCK_DATA.filter(p => {
    const typeMatch = filter === 'todos' || p.type === filter;
    const cityMatch = cityFilter === 'todas' || p.city === cityFilter;
    return typeMatch && cityMatch;
  });

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={s.logo} onClick={() => nav("landing")}>OFICIO</span>
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Feed de Trabajo</span>
        </div>
        <button onClick={() => nav("landing")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", padding: "6px 12px", fontSize: "12px" }}>Volver</button>
      </header>

      <div style={s.container}>
        <div style={s.filters}>
          {['todos', 'trabajo', 'solicitud'].map(f => (
            <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>
              {f === 'todos' ? 'Todos' : f === 'trabajo' ? 'Trabajos Realizados' : 'Solicitudes'}
            </button>
          ))}
        </div>

        {filtered.map(post => (
          <div key={post.id} style={s.card}>
            <span style={s.badge(post.type)}>
              {post.type === 'trabajo' ? '🔧 Trabajo Realizado' : '📋 Solicitud de Cliente'}
            </span>
            <h2 style={s.title}>{post.title}</h2>
            <div style={s.meta}>
              📍 {post.city} · 🏷️ {post.category}
            </div>
            
            <p style={{ fontSize: "14px", color: "#4B5563", lineHeight: 1.5, marginBottom: "16px" }}>
              {post.desc}
            </p>

            {post.type === 'trabajo' && (
              <div style={s.photoGrid}>
                <div style={s.photoPlaceholder}>📷 Foto Antes</div>
                <div style={s.photoPlaceholder}>📷 Foto Después</div>
              </div>
            )}

            {post.type === 'solicitud' && (
              <div style={{ background: "#F9FAFB", padding: "12px", borderRadius: "10px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span style={{ color: "#6B7280" }}>Urgencia:</span>
                  <span style={{ fontWeight: 700, color: post.urgency === 'Alta' ? '#DC2626' : '#111827' }}>{post.urgency}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#6B7280" }}>Presupuesto:</span>
                  <span style={{ fontWeight: 700, color: "#059669" }}>{post.budget}</span>
                </div>
              </div>
            )}

            <div style={s.footer}>
              {post.type === 'trabajo' ? (
                <span style={s.techName}>Por: {post.tech}</span>
              ) : (
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Publicado hace 1 hr</span>
              )}
              <button style={s.btn}>
                {post.type === 'trabajo' ? 'Ver Perfil' : 'Enviar Propuesta'}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#6B7280" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔍</div>
            <p>No se encontraron publicaciones con estos filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
