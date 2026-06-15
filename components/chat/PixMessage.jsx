import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getVariant } from "../../data/scripts.js";

const API_CREATE  = "https://webdurov.autopilots.trade/webhook/asaas-pay";
const API_CONSULT = "https://webdurov.autopilots.trade/webhook/asaas-consulta";
const POLL_MS     = 4000;
const GREEN       = "#10B981";

function IconLock({ size = 13, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}

function IconShield({ size = 13, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function IconBolt({ size = 13, color = GREEN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );
}

function IconCheck({ size = 16, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function IconCopy({ size = 15, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  );
}

function IconRefresh({ color = "#fff" }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
    </svg>
  );
}

function CopyToast({ visible }) {
  return createPortal(
    <>
      <style>{`
        @keyframes pixToastIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes pixToastOut { from { opacity:1; } to { opacity:0; } }
      `}</style>
      <div style={{
        position: "fixed", bottom: 24, left: "50%",
        transform: "translateX(-50%)",
        background: "#0f172a", color: "#fff",
        padding: "12px 20px", borderRadius: 12,
        fontSize: 14, fontWeight: 600,
        fontFamily: "'Poppins', system-ui, sans-serif",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        zIndex: 9999, pointerEvents: "none",
        whiteSpace: "nowrap",
        animation: visible
          ? "pixToastIn 0.25s ease forwards"
          : "pixToastOut 0.25s ease forwards",
      }}>
        Código PIX copiado!
      </div>
    </>,
    document.body
  );
}

function Loader() {
  return (
    <>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" style={{ animation: "pixSpin 1s linear infinite" }}>
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      <style>{`@keyframes pixSpin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

function formatTimer(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function CardTop({ amount, description, contactPhoto, contactName }) {
  return (
    <>
      {/* Zona 1: Header */}
      <div style={{ padding: "14px 14px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#e8e8e8" }}>
          {contactPhoto && <img src={contactPhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>
            {contactName || "CrushZap"}
          </div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>Está te esperando agora ❤️</div>
        </div>
      </div>

      {/* Zona 2: Resumo */}
      <div style={{ padding: "12px 14px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#555", lineHeight: 1.4 }}>{description}</span>
          <span style={{ fontSize: 12, color: "#555", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
            R${amount.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <div style={{ borderTop: "1px solid #eee", margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Total</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: GREEN, fontVariantNumeric: "tabular-nums" }}>
            R${amount.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* Trust badges */}
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { Icon: IconLock,   text: "Compra 100% anônima. Sigilo garantido." },
            { Icon: IconShield, text: "Garantia de acesso - Liberado na hora." },
            { Icon: IconBolt,   text: "Não gostou? Reembolso imediato via PIX." },
          ].map(({ Icon, text }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Icon size={12} />
              <span style={{ fontSize: 11, color: "#666" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function PixMessage({ msg, contactPhoto, contactName, onPaid, savedTx, onTxCreated }) {
  const amount      = msg.amount      || 15;
  const description = msg.description || "Chamada de vídeo ao vivo";

  const [phase, setPhase]     = useState("loading");
  const [tx, setTx]           = useState(null);
  const [copied, setCopied]   = useState(false);
  const [showToast, setToast] = useState(false);
  const [timerSecs, setTimer] = useState(1800);
  const [errMsg, setErrMsg]   = useState("");
  const pollRef  = useRef(null);
  const timerRef = useRef(null);
  const paidRef  = useRef(false);

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }
  function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }
  function startTimer(expiresAt) {
    const secs = expiresAt
      ? Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
      : 1800;
    setTimer(secs);
    timerRef.current = setInterval(() => {
      setTimer(s => { if (s <= 1) { stopTimer(); return 0; } return s - 1; });
    }, 1000);
  }
  function startPolling(txId) {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(API_CONSULT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: txId }),
        });
        const data = await r.json();
        if (data.status === "paid" && !paidRef.current) {
          paidRef.current = true; stopPolling(); stopTimer(); setPhase("paid"); onPaid?.();
        } else if (data.status === "expired" || data.status === "cancelled") {
          stopPolling(); stopTimer(); setPhase("expired");
        }
      } catch {}
    }, POLL_MS);
  }

  async function generatePix() {
    setPhase("loading"); stopPolling(); stopTimer(); paidRef.current = false;
    try {
      const r = await fetch(API_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description, external_id: `cz-${getVariant()}-${Date.now()}` }),
      });
      const data = await r.json();
      if (data.success && data.transaction) {
        setTx(data.transaction); setPhase("ready");
        startTimer(data.transaction.expires_at);
        startPolling(data.transaction.id);
        onTxCreated?.(data.transaction);
      } else {
        setErrMsg("Erro ao gerar PIX. Tente novamente."); setPhase("error");
      }
    } catch {
      setErrMsg("Erro de conexão. Verifique sua internet."); setPhase("error");
    }
  }

  async function checkNow() {
    if (!tx) return;
    try {
      const r = await fetch(API_CONSULT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tx.id }),
      });
      const data = await r.json();
      if (data.status === "paid" && !paidRef.current) {
        paidRef.current = true; stopPolling(); stopTimer(); setPhase("paid"); onPaid?.();
      } else if (data.status === "expired" || data.status === "cancelled") {
        stopPolling(); stopTimer(); setPhase("expired");
      }
    } catch {}
  }

  function copyCode() {
    if (!tx) return;
    navigator.clipboard.writeText(tx.pix_copia_cola).catch(() => {
      const el = document.createElement("textarea");
      el.value = tx.pix_copia_cola;
      document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    });
    setCopied(true);
    setToast(true);
    setTimeout(() => setCopied(false), 2500);
    setTimeout(() => setToast(false), 2500);
  }

  useEffect(() => {
    if (savedTx) {
      const isExpired = savedTx.expires_at
        ? new Date(savedTx.expires_at).getTime() <= Date.now()
        : false;
      if (isExpired) {
        setPhase("expired");
      } else {
        setTx(savedTx);
        setPhase("ready");
        startTimer(savedTx.expires_at);
        startPolling(savedTx.id);
      }
    } else {
      generatePix();
    }
    return () => { stopPolling(); stopTimer(); };
  }, []);

  const card = {
    width: 256, borderRadius: 14, overflow: "hidden",
    background: "#fff", border: "1px solid rgba(0,0,0,0.08)", fontFamily: "inherit",
  };
  const btnGreen = {
    width: "100%", padding: "12px", borderRadius: 10,
    background: GREEN, color: "#fff", border: "none",
    fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: 0.3,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  };

  if (phase === "loading") return (
    <div style={card}>
      <CardTop amount={amount} description={description} contactPhoto={contactPhoto} contactName={contactName} />
      <div style={{ padding: "22px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Loader />
        <span style={{ fontSize: 12, color: "#999" }}>Gerando seu PIX...</span>
      </div>
    </div>
  );

  if (phase === "error") return (
    <div style={card}>
      <CardTop amount={amount} description={description} contactPhoto={contactPhoto} contactName={contactName} />
      <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, color: "#e05555", textAlign: "center" }}>{errMsg}</span>
        <button onClick={generatePix} style={{ ...btnGreen, width: "auto", padding: "9px 20px" }}>
          <IconRefresh /> Tentar novamente
        </button>
      </div>
    </div>
  );

  if (phase === "paid") return (
    <div style={card}>
      <CardTop amount={amount} description={description} contactPhoto={contactPhoto} contactName={contactName} />
      <div style={{ padding: "22px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconCheck size={22} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>Pagamento confirmado!</div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>
            R${amount.toFixed(2).replace(".", ",")} recebido com sucesso
          </div>
        </div>
      </div>
    </div>
  );

  if (phase === "expired") return (
    <div style={card}>
      <CardTop amount={amount} description={description} contactPhoto={contactPhoto} contactName={contactName} />
      <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, color: "#ca8a04", fontWeight: 600 }}>PIX expirado</span>
        <button onClick={generatePix} style={btnGreen}><IconRefresh /> Gerar novo PIX</button>
      </div>
    </div>
  );

  return (
    <div style={card}>
      <CardTop amount={amount} description={description} contactPhoto={contactPhoto} contactName={contactName} />

      {/* Zona 3: PIX gerado */}
      <div style={{ padding: "14px 14px 12px" }}>
        {/* Badge PIX gerado */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconCheck size={12} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>PIX gerado!</span>
        </div>

        {/* Copia e cola */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>
            Copia e cola
          </div>
          <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "8px 10px", border: "1px solid #eee" }}>
            <div style={{ fontSize: 10.5, color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontVariantNumeric: "tabular-nums" }}>
              {tx?.pix_copia_cola}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: "#999" }}>Oferta expira em</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#111", fontVariantNumeric: "tabular-nums" }}>
            {formatTimer(timerSecs)}
          </span>
        </div>

        {/* Botão copiar */}
        <button onClick={copyCode} style={{ ...btnGreen, background: copied ? "#065f46" : GREEN, transition: "background 0.25s", marginBottom: 4 }}>
          {copied ? <><IconCheck size={15} /> CÓDIGO COPIADO!</> : <><IconCopy size={15} /> COPIAR CÓDIGO PIX</>}
        </button>

        {/* Já paguei */}
        <button onClick={checkNow} style={{ width: "100%", background: "none", border: "none", color: "#999", fontSize: 12, cursor: "pointer", padding: "9px 0 4px", textDecoration: "underline", textDecorationColor: "#ddd" }}>
          Já fiz o pagamento
        </button>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f0f0f0", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
        <IconLock size={11} color="#bbb" />
        <span style={{ fontSize: 10, color: "#bbb" }}>100% seguro e criptografado.</span>
      </div>

      {showToast && <CopyToast visible={showToast} />}
    </div>
  );
}
