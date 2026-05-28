// Habilis logo: navy badge with orange H + Phillips-screw dot below
export default function Logo({ size = 32, textColor = "#fff", onClick, style = {} }) {
  const w = size;
  const h = Math.round(size * 1.2); // 40:48 ratio

  return (
    <div
      style={{ display:"inline-flex", alignItems:"center", gap: Math.round(size * 0.28) + "px", cursor: onClick ? "pointer" : "default", userSelect:"none", ...style }}
      onClick={onClick}
    >
      <svg width={w} height={h} viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
        {/* Badge background */}
        <rect width="40" height="48" rx="9" fill="#0F172A" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
        {/* H — left vertical */}
        <rect x="6" y="6" width="7" height="23" rx="2" fill="#F97316"/>
        {/* H — right vertical */}
        <rect x="27" y="6" width="7" height="23" rx="2" fill="#F97316"/>
        {/* H — crossbar */}
        <rect x="6" y="15" width="28" height="6" rx="2" fill="#F97316"/>
        {/* Screw head — circle */}
        <circle cx="20" cy="39.5" r="5" fill="#F97316"/>
        {/* Screw — Phillips cross slot */}
        <line x1="20" y1="36.5" x2="20" y2="42.5" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="17" y1="39.5" x2="23" y2="39.5" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
      <span style={{
        color: textColor,
        fontWeight: 900,
        fontSize: Math.round(size * 0.5) + "px",
        letterSpacing: "0.06em",
        fontFamily: "'Inter', system-ui, sans-serif",
        lineHeight: 1,
      }}>
        HABILIS
      </span>
    </div>
  );
}
