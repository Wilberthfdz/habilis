import { useEffect, useState } from "react";
import Nav from "../components/Nav.jsx";
import Logo from "../components/Logo.jsx";
import { obtenerVerificacion, subirVerificacion } from "../lib/firebase.js";

// Comprime una imagen a máx. 900px (legible para revisión manual) antes de
// convertirla a base64 — mismo patrón que la foto de perfil pero con más
// resolución, porque un INE ilegible no sirve para verificar nada.
const comprimir = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 900;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo procesar la imagen."))), "image/jpeg", 0.72);
    };
    img.onerror = () => reject(new Error("No se pudo leer la imagen."));
    img.src = ev.target.result;
  };
  reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
  reader.readAsDataURL(file);
});

const ESTADO_INFO = {
  pendiente: { color: "#92400E", bg: "#FEF3C7", texto: "Estamos revisando tus documentos. Normalmente tardamos menos de 48 horas." },
  aprobado:  { color: "#15803D", bg: "#DCFCE7", texto: "¡Tu identidad fue verificada! Ya tienes la insignia de verificado en tu perfil." },
  rechazado: { color: "#B91C1C", bg: "#FEE2E2", texto: "Tu verificación fue rechazada. Puedes corregir y volver a enviarla." },
};

export default function Verificacion({ nav, user }) {
  const [verif, setVerif] = useState(undefined); // undefined=cargando, null=sin solicitud
  const [ineFile, setIneFile] = useState(null);
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    obtenerVerificacion(user.uid).then(setVerif).catch(() => setVerif(null));
  }, [user]);

  const enviar = async () => {
    if (!ineFile) { setError("Sube una foto o escaneo de tu INE."); return; }
    setError(""); setEnviando(true);
    try {
      const ineBlob = await comprimir(ineFile);
      const comprobanteBlob = comprobanteFile ? await comprimir(comprobanteFile) : null;
      await subirVerificacion(user.uid, ineBlob, comprobanteBlob);
      setVerif(await obtenerVerificacion(user.uid));
      setIneFile(null); setComprobanteFile(null);
    } catch (e) {
      setError(e.message || "No se pudo enviar. Intenta de nuevo.");
    } finally { setEnviando(false); }
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#F1F5F9" }}>
        <Nav nav={nav} user={user} />
        <div style={{ maxWidth: 480, margin: "60px auto", padding: 20, textAlign: "center" }}>
          <p style={{ color: "#64748B", marginBottom: 16 }}>Inicia sesión para verificar tu identidad.</p>
          <button className="h-btn-orange" style={{ padding: "11px 24px" }} onClick={() => nav("login")}>Iniciar sesión</button>
        </div>
      </div>
    );
  }

  const estadoActual = verif?.estado;
  const info = estadoActual ? ESTADO_INFO[estadoActual] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9" }}>
      <Nav nav={nav} user={user} />

      <div style={{ background: "#0A1120", padding: "56px 20px 64px", textAlign: "center" }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: "#F07020", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
          Confianza
        </p>
        <h1 style={{ fontSize: "clamp(26px,4.5vw,38px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
          Verifica tu identidad
        </h1>
        <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.65)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          Los técnicos verificados generan más confianza y aparecen con la insignia ✅ en su perfil público.
        </p>
      </div>

      <div style={{ maxWidth: 560, margin: "-32px auto 60px", padding: "0 20px" }}>
        <div className="h-card" style={{ padding: "clamp(20px,4vw,28px)" }}>
          {verif === undefined ? (
            <p style={{ color: "#94A3B8", textAlign: "center" }}>Cargando…</p>
          ) : (
            <>
              {info && (
                <div style={{ background: info.bg, color: info.color, borderRadius: 10, padding: "12px 14px", fontSize: 13.5, marginBottom: 18, lineHeight: 1.6 }}>
                  {info.texto}
                </div>
              )}

              {estadoActual === "pendiente" ? (
                <p style={{ color: "#64748B", fontSize: 13.5 }}>Tu solicitud ya está en revisión — no puedes editarla hasta que respondamos.</p>
              ) : (
                <>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                    Foto o escaneo de tu INE (obligatorio)
                  </label>
                  <input type="file" accept="image/*" onChange={(e) => setIneFile(e.target.files?.[0] || null)}
                    style={{ marginBottom: 16, fontSize: 13 }} />

                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                    Comprobante de oficio (opcional — certificación, diploma, licencia)
                  </label>
                  <input type="file" accept="image/*" onChange={(e) => setComprobanteFile(e.target.files?.[0] || null)}
                    style={{ marginBottom: 16, fontSize: 13 }} />

                  {error && <p style={{ color: "#DC2626", fontSize: 13, marginBottom: 12 }}>{error}</p>}

                  <button className="h-btn-orange" onClick={enviar} disabled={enviando || !ineFile}
                    style={{ padding: "12px 22px", fontSize: 14, opacity: enviando || !ineFile ? 0.5 : 1, width: "100%" }}>
                    {enviando ? "Enviando…" : estadoActual === "rechazado" ? "Volver a enviar" : "Enviar para revisión"}
                  </button>

                  <p style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 12, lineHeight: 1.6 }}>
                    Tus documentos solo los ve el equipo de Habilis para verificar tu identidad — nunca se muestran públicamente.
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ padding: 22, textAlign: "center", background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <Logo size={22} textColor="#0A1120" onClick={() => nav("landing")} />
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 8 }}>© 2026 Habilis · Hecho en México</p>
      </div>
    </div>
  );
}
