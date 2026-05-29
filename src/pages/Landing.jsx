import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import { buscarTecnicos } from "../lib/firebase.js";

const CATS = [
  { icon:"⚡", name:"Electricidad" },   { icon:"❄️", name:"Minisplits" },
  { icon:"🔧", name:"Mecánica" },        { icon:"🚿", name:"Plomería" },
  { icon:"📷", name:"Cámaras CCTV" },   { icon:"🏗️", name:"Herrería" },
  { icon:"🪟", name:"Tablaroca" },       { icon:"🎨", name:"Pintura" },
  { icon:"⚙️", name:"Motores" },         { icon:"🌡️", name:"Refrigeración" },
  { icon:"🛠️", name:"Albañilería" },    { icon:"🌐", name:"Redes" },
];

const STEPS = [
  { icon:"🔍", step:"01", title:"Busca el servicio",      desc:"Escribe qué necesitas y tu ciudad. Filtra por oficio, técnicos verificados o Plan Pro." },
  { icon:"👤", step:"02", title:"Revisa el perfil",        desc:"Ve trabajos documentados con fotos antes/después, calificaciones reales y años de experiencia." },
  { icon:"✅", step:"03", title:"Contrata con confianza",  desc:"Contacta directamente al técnico. Sin intermediarios, sin comisiones ocultas." },
];

export default function Landing({ nav, user }) {
  const [oficio,   setOficio]   = useState("");
  const [ciudad,   setCiudad]   = useState("");
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    buscarTecnicos({}).then(r => setFeatured(r.slice(0, 4))).catch(() => {});
  }, []);

  const go = () => nav("buscar", { oficio, ciudad });
  const key = e => { if (e.key === "Enter") go(); };

  return (
    <div style={{ fontFamily:"'Inter',system-ui", background:"#F1F5F9" }}>
      <style>{`
        .lnd-cat { background:#fff; border:1px solid #E2E8F0; border-radius:14px; padding:20px 12px;
                   text-align:center; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.05);
                   transition:all 0.18s ease; }
        .lnd-cat:hover { border-color:#F97316; box-shadow:0 6px 20px rgba(249,115,22,0.15); transform:translateY(-2px); }
        .lnd-tech { background:#fff; border:1px solid #E2E8F0; border-radius:16px; padding:20px;
                    cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.05); transition:all 0.18s ease; }
        .lnd-tech:hover { box-shadow:0 8px 24px rgba(0,0,0,0.1); transform:translateY(-2px); }
        .srch-inp { background:rgba(255,255,255,0.09) !important; border:none !important; border-radius:10px;
                    padding:13px 16px; color:#fff; font-size:14px; outline:none !important; width:100%; }
        .srch-inp::placeholder { color:rgba(255,255,255,0.38); }
        .srch-inp:focus { background:rgba(255,255,255,0.13) !important; outline:none !important; }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ background:"#0F172A", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {/* Animated glow blobs */}
        <div style={{ position:"absolute", top:"-15%", right:"-8%", width:"640px", height:"640px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.18) 0%,transparent 65%)",
                      animation:"blob 10s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-20%", left:"-8%", width:"520px", height:"520px",
                      background:"radial-gradient(circle,rgba(59,130,246,0.11) 0%,transparent 65%)",
                      animation:"blob2 13s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"35%", left:"35%", width:"320px", height:"320px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 65%)",
                      animation:"blob 18s ease-in-out infinite reverse", pointerEvents:"none" }} />

        <Nav nav={nav} user={user} />

        {/* Hero content */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                      padding:"72px 20px 52px", textAlign:"center", animation:"fadeUp 0.85s ease forwards",
                      minHeight:"calc(100vh - 60px)" }}>

          {/* Gemini badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:"6px",
                        background:"rgba(249,115,22,0.14)", border:"1px solid rgba(249,115,22,0.32)",
                        borderRadius:"20px", padding:"5px 14px", marginBottom:"28px" }}>
            <span style={{ fontSize:"11px", color:"#F97316", fontWeight:700, letterSpacing:"0.07em" }}>
              ✦ POWERED BY GOOGLE GEMINI AI
            </span>
          </div>

          <h1 style={{ fontSize:"clamp(28px,5.5vw,66px)", fontWeight:900, lineHeight:1.07,
                       color:"#fff", marginBottom:"20px", maxWidth:"820px" }}>
            El historial profesional del<br />
            <span style={{ color:"#F97316" }}>trabajador técnico mexicano</span>
          </h1>

          <p style={{ fontSize:"clamp(15px,2vw,20px)", color:"rgba(255,255,255,0.58)",
                      marginBottom:"44px", maxWidth:"520px", lineHeight:1.65 }}>
            Encuentra técnicos verificados con trabajos documentados.<br />
            <span style={{ color:"rgba(255,255,255,0.32)" }}>Gratis para clientes, siempre.</span>
          </p>

          {/* Search bar */}
          <div style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.11)",
                        borderRadius:"16px", padding:"10px", display:"flex", gap:"8px",
                        width:"100%", maxWidth:"660px", margin:"0 auto 28px",
                        backdropFilter:"blur(12px)", flexWrap:"wrap" }}>
            <input className="srch-inp" style={{ flex:"2 1 180px" }}
              placeholder="¿Qué servicio necesitas? (Electricista...)"
              value={oficio} onChange={e => setOficio(e.target.value)} onKeyDown={key} />
            <input className="srch-inp" style={{ flex:"1 1 120px" }}
              placeholder="Ciudad"
              value={ciudad} onChange={e => setCiudad(e.target.value)} onKeyDown={key} />
            <button onClick={go}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"13px 24px", fontWeight:700, fontSize:"14px", cursor:"pointer",
                       flexShrink:0, whiteSpace:"nowrap" }}>
              Buscar →
            </button>
          </div>

          {/* Trust tags */}
          <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
            {["✓ Técnicos verificados","✓ Fotos antes/después","✓ Calificaciones reales","✓ Sin comisiones"].map(t => (
              <span key={t} style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"22px 20px" }}>
          <div style={{ display:"flex", justifyContent:"center", gap:"clamp(20px,5vw,72px)",
                        flexWrap:"wrap", maxWidth:"900px", margin:"0 auto" }}>
            {[
              ["30M+",   "Trabajadores técnicos en México"],
              ["100%",   "Gratis para clientes"],
              ["Gemini", "Perfiles mejorados por IA"],
              ["Real",   "Trabajos con evidencia fotográfica"],
            ].map(([v, l]) => (
              <div key={v} style={{ textAlign:"center" }}>
                <div style={{ fontWeight:900, fontSize:"clamp(17px,2.8vw,26px)", color:"#F97316" }}>{v}</div>
                <div style={{ color:"rgba(255,255,255,0.38)", fontSize:"11px", marginTop:"3px", maxWidth:"110px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section style={{ padding:"68px 20px", background:"#F1F5F9" }}>
        <div style={{ maxWidth:"1080px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                        letterSpacing:"0.12em", marginBottom:"8px" }}>
              Servicios disponibles
            </p>
            <h2 style={{ fontSize:"clamp(22px,4vw,38px)", fontWeight:900, color:"#0F172A" }}>
              Todo tipo de técnicos,<br />una sola plataforma
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))", gap:"12px" }}>
            {CATS.map(({ icon, name }) => (
              <button key={name} className="lnd-cat" onClick={() => nav("buscar", { oficio:name })}>
                <div style={{ fontSize:"30px", marginBottom:"10px" }}>{icon}</div>
                <div style={{ fontSize:"13px", fontWeight:700, color:"#0F172A", lineHeight:1.3 }}>{name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────────── */}
      <section style={{ padding:"68px 20px", background:"#fff", borderTop:"1px solid #E2E8F0" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"52px" }}>
            <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                        letterSpacing:"0.12em", marginBottom:"8px" }}>
              Proceso simple
            </p>
            <h2 style={{ fontSize:"clamp(22px,4vw,38px)", fontWeight:900, color:"#0F172A" }}>
              ¿Cómo funciona?
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"32px" }}>
            {STEPS.map(({ icon, step, title, desc }) => (
              <div key={step} style={{ textAlign:"center", padding:"8px" }}>
                <div style={{ position:"relative", display:"inline-block", marginBottom:"20px" }}>
                  <div style={{ width:"64px", height:"64px", background:"#0F172A", borderRadius:"18px",
                                display:"flex", alignItems:"center", justifyContent:"center",
                                fontSize:"26px", boxShadow:"0 8px 20px rgba(15,23,42,0.22)" }}>
                    {icon}
                  </div>
                  <div style={{ position:"absolute", top:"-6px", right:"-6px", width:"22px", height:"22px",
                                background:"#F97316", borderRadius:"50%", display:"flex", alignItems:"center",
                                justifyContent:"center", fontSize:"10px", fontWeight:900, color:"#fff",
                                border:"2px solid #fff" }}>
                    {step.slice(-1)}
                  </div>
                </div>
                <h3 style={{ fontSize:"17px", fontWeight:800, color:"#0F172A", marginBottom:"10px" }}>{title}</h3>
                <p style={{ color:"#64748B", fontSize:"14px", lineHeight:1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TECHNICIANS ──────────────────────────────────────────── */}
      <section style={{ padding:"68px 20px", background:"#F1F5F9" }}>
        <div style={{ maxWidth:"1080px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end",
                        flexWrap:"wrap", gap:"12px", marginBottom:"32px" }}>
            <div>
              <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                          letterSpacing:"0.12em", marginBottom:"8px" }}>
                Técnicos destacados
              </p>
              <h2 style={{ fontSize:"clamp(20px,3.5vw,34px)", fontWeight:900, color:"#0F172A" }}>
                Profesionales verificados
              </h2>
            </div>
            <button onClick={() => nav("buscar")}
              style={{ background:"transparent", color:"#F97316", border:"1.5px solid #F97316",
                       borderRadius:"10px", padding:"9px 18px", fontWeight:700, fontSize:"13px", cursor:"pointer" }}>
              Ver todos →
            </button>
          </div>

          {featured.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", background:"#fff",
                          borderRadius:"20px", border:"1px solid #E2E8F0" }}>
              <div style={{ fontSize:"52px", marginBottom:"14px" }}>🔧</div>
              <p style={{ fontWeight:800, fontSize:"18px", color:"#0F172A", marginBottom:"8px" }}>
                Sé el primero en registrarte
              </p>
              <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"24px" }}>
                Los técnicos registrados aparecen aquí como destacados.
              </p>
              <button onClick={() => nav("registro")}
                style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                         padding:"12px 24px", fontWeight:700, fontSize:"14px", cursor:"pointer" }}>
                Crear perfil gratis →
              </button>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"16px" }}>
              {featured.map(t => (
                <div key={t.id} className="lnd-tech" onClick={() => nav("perfil", { tecnicoId:t.id })}>
                  <div style={{ display:"flex", gap:"12px", alignItems:"flex-start", marginBottom:"14px" }}>
                    <Avatar size={50} nombre={t.nombre} fotoUrl={t.fotoUrl} plan={t.plan} />
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:700, fontSize:"15px", color:"#0F172A", marginBottom:"2px" }}>{t.nombre}</p>
                      <p style={{ color:"#F97316", fontSize:"13px", fontWeight:600 }}>{t.oficio}</p>
                    </div>
                  </div>
                  <p style={{ color:"#64748B", fontSize:"12px", marginBottom:"10px" }}>
                    📍 {t.ciudad}{t.rating > 0 ? ` · ⭐ ${t.rating}` : " · Nuevo"}
                  </p>
                  {t.plan === "pro" && (
                    <span style={{ background:"#FFF7ED", color:"#EA580C", fontSize:"10px",
                                   fontWeight:700, padding:"2px 8px", borderRadius:"6px" }}>
                      ⚡ PRO
                    </span>
                  )}
                  {t.verificado && (
                    <span style={{ background:"#F0FDF4", color:"#059669", fontSize:"10px",
                                   fontWeight:700, padding:"2px 8px", borderRadius:"6px", marginLeft:"4px" }}>
                      ✅ Verificado
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HABILIS CARE ──────────────────────────────────────────────────── */}
      <section style={{ padding:"68px 20px", background:"#fff", borderTop:"1px solid #E2E8F0" }}>
        <div style={{ maxWidth:"1080px", margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"48px", alignItems:"center" }}>
            <div>
              <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                          letterSpacing:"0.12em", marginBottom:"10px" }}>
                🛡️ Habilis Care — Nuevo
              </p>
              <h2 style={{ fontSize:"clamp(22px,4vw,38px)", fontWeight:900, color:"#0F172A", marginBottom:"14px", lineHeight:1.15 }}>
                Mantenimiento preventivo para tus equipos
              </h2>
              <p style={{ color:"#64748B", fontSize:"15px", lineHeight:1.7, marginBottom:"24px" }}>
                Registra tus aires acondicionados, refrigeradores, generadores y más. Habilis Care calcula cuándo necesitan servicio y te conecta con el técnico correcto.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"28px" }}>
                {[
                  ["❄️","AC · Refrigeración · Paneles solares"],
                  ["🚗","Vehículos · Generadores · UPS"],
                  ["📷","CCTV · Redes · Equipos industriales"],
                ].map(([icon,text]) => (
                  <div key={text} style={{ display:"flex", alignItems:"center", gap:"10px",
                                           fontSize:"14px", color:"#374151" }}>
                    <span style={{ fontSize:"20px" }}>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => nav(user ? "habilisCare" : "registro")}
                style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"12px",
                         padding:"14px 28px", fontWeight:800, fontSize:"15px", cursor:"pointer" }}>
                {user ? "Ver mis equipos →" : "Registra tu equipo gratis →"}
              </button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              {[
                { icon:"❄️", name:"Aire acondicionado", salud:82, dias:28 },
                { icon:"☀️", name:"Panel solar",         salud:45, dias:-12 },
                { icon:"🚗", name:"Vehículo",            salud:67, dias:14 },
                { icon:"🔋", name:"UPS sala servidores", salud:91, dias:60 },
              ].map(({ icon, name, salud, dias }) => {
                const color = salud > 80 ? "#10B981" : salud > 50 ? "#F59E0B" : "#EF4444";
                return (
                  <div key={name} style={{ background:"#F8FAFC", border:`1px solid ${salud < 50 ? "rgba(239,68,68,0.3)" : "#E2E8F0"}`,
                                            borderRadius:"14px", padding:"14px" }}>
                    <div style={{ fontSize:"22px", marginBottom:"6px" }}>{icon}</div>
                    <p style={{ fontWeight:700, fontSize:"12px", color:"#0F172A", marginBottom:"3px",
                                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                      <div style={{ flex:1, height:"4px", background:"#E2E8F0", borderRadius:"2px" }}>
                        <div style={{ width:`${salud}%`, height:"4px", background:color, borderRadius:"2px" }} />
                      </div>
                      <span style={{ fontSize:"10px", fontWeight:700, color }}>{salud}%</span>
                    </div>
                    <p style={{ fontSize:"11px", color, marginTop:"4px", fontWeight:600 }}>
                      {dias < 0 ? `Vencido ${Math.abs(dias)}d` : `En ${dias} días`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA TÉCNICOS ──────────────────────────────────────────────────── */}
      <section style={{ background:"#0F172A", padding:"84px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-8%", width:"560px", height:"560px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.14) 0%,transparent 65%)",
                      pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-30%", left:"-5%", width:"400px", height:"400px",
                      background:"radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%)",
                      pointerEvents:"none" }} />
        <div style={{ maxWidth:"700px", margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.12em", marginBottom:"14px" }}>
            ¿Eres técnico?
          </p>
          <h2 style={{ fontSize:"clamp(24px,4.5vw,48px)", fontWeight:900, color:"#fff",
                       lineHeight:1.12, marginBottom:"18px" }}>
            Construye tu reputación<br />profesional con Habilis
          </h2>
          <p style={{ color:"rgba(255,255,255,0.52)", fontSize:"clamp(14px,2vw,17px)",
                      marginBottom:"40px", lineHeight:1.7, maxWidth:"520px", margin:"0 auto 40px" }}>
            Registra tus trabajos con fotos, acumula calificaciones reales y aparece en búsquedas.
            La IA de Gemini mejora tu perfil automáticamente.
          </p>
          <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => nav("registro")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"12px",
                       padding:"16px 32px", fontWeight:800, fontSize:"16px", cursor:"pointer" }}>
              Crea tu perfil gratis →
            </button>
            <button onClick={() => nav("precios")}
              style={{ background:"transparent", color:"rgba(255,255,255,0.6)",
                       border:"1px solid rgba(255,255,255,0.2)", borderRadius:"12px",
                       padding:"16px 24px", fontWeight:600, fontSize:"15px", cursor:"pointer" }}>
              Ver planes
            </button>
          </div>
          <div style={{ display:"flex", gap:"24px", justifyContent:"center", marginTop:"28px", flexWrap:"wrap" }}>
            {["Sin tarjeta de crédito","Plan gratis siempre","Soporte en español"].map(t => (
              <span key={t} style={{ color:"rgba(255,255,255,0.3)", fontSize:"12px" }}>✓ {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ background:"#fff", borderTop:"1px solid #E2E8F0", padding:"48px 20px 28px" }}>
        <div style={{ maxWidth:"1080px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                        gap:"36px", flexWrap:"wrap", marginBottom:"36px" }}>
            <div style={{ maxWidth:"240px" }}>
              <Logo size={30} textColor="#0F172A" />
              <p style={{ color:"#64748B", fontSize:"13px", marginTop:"12px", lineHeight:1.6 }}>
                Infraestructura de confianza para trabajadores técnicos en México.
              </p>
              <p style={{ color:"#94A3B8", fontSize:"12px", marginTop:"8px", fontWeight:600 }}>myhabilis.com</p>
            </div>
            <div style={{ display:"flex", gap:"52px", flexWrap:"wrap" }}>
              <div>
                <p style={{ fontWeight:700, fontSize:"13px", color:"#0F172A", marginBottom:"14px" }}>Plataforma</p>
                {[["Buscar técnicos","buscar"],["Feed de trabajos","feed"],["Precios","precios"]].map(([l,r]) => (
                  <button key={l} onClick={() => nav(r)}
                    style={{ display:"block", background:"none", border:"none", color:"#64748B",
                             fontSize:"13px", marginBottom:"10px", cursor:"pointer", padding:0, textAlign:"left" }}>
                    {l}
                  </button>
                ))}
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:"13px", color:"#0F172A", marginBottom:"14px" }}>Para técnicos</p>
                {[["Crear perfil gratis","registro"],["Mi panel","panel"],["Iniciar sesión","login"]].map(([l,r]) => (
                  <button key={l} onClick={() => nav(r)}
                    style={{ display:"block", background:"none", border:"none", color:"#64748B",
                             fontSize:"13px", marginBottom:"10px", cursor:"pointer", padding:0, textAlign:"left" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop:"1px solid #E2E8F0", paddingTop:"20px", display:"flex",
                        justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
            <p style={{ color:"#94A3B8", fontSize:"12px" }}>© 2025 Habilis · Todos los derechos reservados</p>
            <p style={{ color:"#94A3B8", fontSize:"12px" }}>México · Powered by Google Cloud & Gemini AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
