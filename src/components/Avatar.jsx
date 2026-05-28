// Reusable avatar: shows photo when available, falls back to colored initials.
// Shows orange border for Pro members. Shows spinner while uploading.
export default function Avatar({ nombre, fotoUrl, size = 48, plan = "gratis", uploading = false, style = {} }) {
  const r   = Math.round(size * 0.28);
  const fs  = Math.round(size * 0.40);
  const letter = ((nombre || "").trim().charAt(0).toUpperCase()) || "T";
  const isPro  = plan === "pro";

  return (
    <div style={{
      width: size, height: size, borderRadius: r + "px", flexShrink: 0,
      border: isPro ? "2.5px solid #F97316" : "2.5px solid rgba(255,255,255,0.08)",
      overflow: "hidden", position: "relative",
      background: fotoUrl && !uploading ? "#E2E8F0" : "linear-gradient(135deg,#0F172A,#1E3A5F)",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "opacity 0.2s",
      opacity: uploading ? 0.65 : 1,
      ...style,
    }}>
      {uploading ? (
        <div style={{ width: Math.round(size * 0.38) + "px", height: Math.round(size * 0.38) + "px",
                      border: "2.5px solid rgba(255,255,255,0.35)", borderTopColor: "#fff",
                      borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
      ) : fotoUrl ? (
        <img src={fotoUrl} alt={nombre || "avatar"}
             style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <span style={{ color: "#fff", fontWeight: 900, fontSize: fs + "px", userSelect: "none",
                       lineHeight: 1 }}>
          {letter}
        </span>
      )}
    </div>
  );
}
