import { useState, useRef } from "react";
import { transcribirRegistro } from "../lib/gemini.js";

// El dictado existía solo en el alta con Google. Quien se registraba con
// correo llenaba todo a mano — justo el técnico que menos cómodo está
// escribiendo. Aquí queda una sola pieza para las dos rutas de alta.
//
// `onDatos` recibe {oficio, ciudad, experiencia, bio} tal como lo devuelve
// el backend; quien la use decide qué campos aplicar.
const MAX_SEGUNDOS = 60;

export default function RegistroPorVoz({
  onDatos,
  onError,
  // Por defecto dicta el PERFIL; el registro de trabajos pasa su propia
  // función y su propia etiqueta.
  transcribir = transcribirRegistro,
  etiqueta = "🎙️ Llenar con mi voz — di tu oficio, ciudad y experiencia",
}) {
  const [grabando,       setGrabando]       = useState(false);
  const [transcribiendo, setTranscribiendo] = useState(false);
  const [listo,          setListo]          = useState(false);
  const recorderRef = useRef(null);
  const chunksRef   = useRef([]);

  const alternar = async () => {
    if (grabando) { recorderRef.current?.stop(); return; }
    onError?.("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setGrabando(false);
        setTranscribiendo(true);
        try {
          const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
          const base64 = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload  = e => res(e.target.result.split(",")[1]);   // sin el prefijo data:
            r.onerror = () => rej(new Error("No se pudo leer el audio."));
            r.readAsDataURL(blob);
          });
          onDatos(await transcribir(base64, rec.mimeType || "audio/webm"));
          setListo(true);
        } catch (e) {
          console.error(e);
          onError?.(e?.code === "functions/resource-exhausted"
            ? "Muchos intentos seguidos. Espera un momento o llena el formulario a mano."
            : "No se pudo transcribir el audio. Puedes llenar el formulario a mano.");
        } finally { setTranscribiendo(false); }
      };
      rec.start();
      setGrabando(true);
      setListo(false);
      // Corte de seguridad: el backend rechaza audios muy largos.
      setTimeout(() => { if (rec.state === "recording") rec.stop(); }, MAX_SEGUNDOS * 1000);
    } catch {
      onError?.("No pudimos acceder al micrófono. Revisa los permisos del navegador.");
    }
  };

  return (
    <>
      <button type="button" onClick={alternar} disabled={transcribiendo}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
                 gap:"10px", background: grabando ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
                 border: grabando ? "1.5px solid rgba(239,68,68,0.5)" : "1.5px solid rgba(255,255,255,0.14)",
                 borderRadius:"12px", padding:"13px 16px", fontSize:"14px", fontWeight:700,
                 color: grabando ? "#FCA5A5" : "rgba(255,255,255,0.8)", cursor:"pointer",
                 opacity: transcribiendo ? 0.7 : 1 }}>
        {transcribiendo ? (
          <>
            <div style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.3)",
                          borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.75s linear infinite" }} />
            Escuchando lo que dijiste...
          </>
        ) : grabando ? <>⏹ Detener grabación</>
          : <>{etiqueta}</>}
      </button>
      {listo && !transcribiendo && (
        <p style={{ fontSize:"12px", color:"#86EFAC", marginTop:"8px" }}>
          ✓ Listo — revisa que los datos estén bien y ajusta lo que haga falta.
        </p>
      )}
    </>
  );
}
