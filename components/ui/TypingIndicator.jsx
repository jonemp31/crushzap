import { T } from "../../constants/theme.js";

export function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", paddingRight: 50, marginBottom: 2 }}>
      <div style={{
        background: T.bubbleReceived, borderRadius: "7.5px 7.5px 7.5px 0",
        padding: "9px 14px", boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%", background: "#8696a0",
            animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
        <style>{`
          @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-5px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
