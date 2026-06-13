import { createPortal } from "react-dom";

const CSS = `
  @keyframes tut-ring {
    0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(2);   opacity: 0; }
  }
  @keyframes tut-ring2 {
    0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0.7; }
    100% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
  }
  @keyframes tut-fade {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
`;

/* labelDir: "right" (default) | "below" | "left" */
function TapRing({ x, y, label, labelDir = "right" }) {
  const labelStyle = {
    position: "absolute",
    background: "rgba(0,0,0,0.85)",
    color: "#fff",
    padding: "7px 14px",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    whiteSpace: "nowrap",
    animation: "tut-fade 0.4s ease",
    pointerEvents: "none",
  };

  let labelPos = {};
  let arrowStyle = {};

  if (labelDir === "right") {
    labelPos = { top: "50%", left: "calc(50% + 48px)", transform: "translateY(-50%)" };
    arrowStyle = {
      position: "absolute", left: -7, top: "50%", transform: "translateY(-50%)",
      width: 0, height: 0,
      borderTop: "7px solid transparent",
      borderBottom: "7px solid transparent",
      borderRight: "7px solid rgba(0,0,0,0.85)",
    };
  } else if (labelDir === "left") {
    labelPos = { top: "50%", right: "calc(50% + 48px)", transform: "translateY(-50%)" };
    arrowStyle = {
      position: "absolute", right: -7, top: "50%", transform: "translateY(-50%)",
      width: 0, height: 0,
      borderTop: "7px solid transparent",
      borderBottom: "7px solid transparent",
      borderLeft: "7px solid rgba(0,0,0,0.85)",
    };
  } else {
    // below
    labelPos = { top: "calc(50% - 58px)", left: "50%", transform: "translateX(-50%)", textAlign: "center" };
    arrowStyle = {
      position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)",
      width: 0, height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent",
      borderTop: "7px solid rgba(0,0,0,0.85)",
    };
  }

  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", width: 72, height: 72, borderRadius: "50%",
        border: "2.5px solid rgba(255,255,255,0.9)",
        animation: "tut-ring 1.1s ease-out infinite",
        top: "50%", left: "50%",
      }} />
      <div style={{
        position: "absolute", width: 48, height: 48, borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.65)",
        animation: "tut-ring2 1.1s ease-out infinite 0.15s",
        top: "50%", left: "50%",
      }} />
      <div style={{
        position: "absolute", width: 18, height: 18, borderRadius: "50%",
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 0 12px rgba(255,255,255,0.6)",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
      }} />
      {label && (
        <div style={{ ...labelStyle, ...labelPos }}>
          <div style={arrowStyle} />
          {label}
        </div>
      )}
    </div>
  );
}

export function TutorialOverlay({ step, onSkip }) {
  if (step === null || step === undefined) return null;

  return createPortal(
    <>
      <style>{CSS}</style>
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.52)",
        pointerEvents: "all",
      }}>

        {/* Botão pular */}
        <button onClick={onSkip} style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.28)",
          borderRadius: 20, color: "#fff",
          fontSize: 13, fontFamily: "'Poppins', sans-serif",
          padding: "6px 18px", cursor: "pointer",
          pointerEvents: "all",
        }}>
          Pular
        </button>

        {/* Step 0 — botão de voltar (ainda no chat) */}
        {step === 0 && (
          <TapRing
            x="26px"
            y="28px"
            label="Voltar para Atualizações"
            labelDir="right"
          />
        )}

        {/* Step 1 — aba Atualizações (bottom nav) */}
        {step === 1 && (
          <>
            <div style={{
              position: "absolute", bottom: 78, left: 0, right: 0,
              textAlign: "center", color: "#fff",
              fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 500,
              animation: "tut-fade 0.4s ease",
            }}>
              Toque em <strong>Atualizações</strong>
            </div>
            <TapRing x="37.5%" y="calc(100% - 28px)" labelDir="below" />
          </>
        )}

        {/* Step 2 — card Privacy Da Yasmin (lista de canais) */}
        {step === 2 && (
          <>
            <div style={{
              position: "absolute", top: 290, left: 0, right: 0,
              textAlign: "center", color: "#fff",
              fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 500,
              padding: "0 32px", lineHeight: 1.4,
              animation: "tut-fade 0.4s ease",
            }}>
              Aqui está o canal <strong>Privacy Da Yasmin 😈</strong>
            </div>
            <TapRing x="50%" y="342px" label="Toque para abrir" labelDir="right" />
          </>
        )}

        {/* Step 3 — banner de conteúdos (canal aberto) */}
        {step === 3 && (
          <div style={{
            position: "absolute", bottom: 24, left: 16, right: 16,
            background: "linear-gradient(135deg, #12001f, #1e003a)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20, padding: "24px 20px 20px",
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: "0 10px 50px rgba(0,0,0,0.7)",
            animation: "tut-fade 0.5s ease",
          }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>😈🔥</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              Aqui ficam todos os meus conteúdos!
            </div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.55 }}>
              Acesse sempre que quiser — tudo exclusivo pra você 💕
            </div>
            <div style={{ marginTop: 14, color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
              Voltando ao chat em instantes...
            </div>
          </div>
        )}

      </div>
    </>,
    document.body
  );
}
