import { T } from "../../constants/theme.js";

export function RecordingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", paddingRight: 50, marginBottom: 2 }}>
      <div style={{
        background: T.bubbleReceived,
        borderRadius: "7.5px 7.5px 7.5px 0",
        padding: "10px 14px",
        boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
        display: "flex", alignItems: "center", gap: 10,
      }}>

        {/* Mic com ripple */}
        <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
          {/* Anel 1 */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid #8696a0",
            animation: "ripple1 1.6s ease-out infinite",
          }} />
          {/* Anel 2 */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid #8696a0",
            animation: "ripple1 1.6s ease-out 0.5s infinite",
          }} />
          {/* Círculo central */}
          <div style={{
            position: "absolute", inset: 4, borderRadius: "50%",
            background: "#8696a0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="11" height="14" viewBox="0 0 11 15" fill="none">
              <rect x="3" y="0" width="5" height="9" rx="2.5" fill="#fff"/>
              <path d="M1 7c0 2.5 2 4.5 4.5 4.5S10 9.5 10 7"
                stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
              <line x1="5.5" y1="11.5" x2="5.5" y2="14.5"
                stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="3" y1="14.5" x2="8" y2="14.5"
                stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Barras de onda */}
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {[
            { h: 8,  delay: "0s"    },
            { h: 14, delay: "0.15s" },
            { h: 20, delay: "0.3s"  },
            { h: 14, delay: "0.45s" },
            { h: 8,  delay: "0.6s"  },
          ].map((bar, i) => (
            <div key={i} style={{
              width: 3, borderRadius: 2,
              background: "#8696a0",
              animation: `wavebar 0.9s ease-in-out ${bar.delay} infinite`,
              height: bar.h,
            }} />
          ))}
        </div>

      </div>

      <style>{`
        @keyframes ripple1 {
          0%   { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.8);  opacity: 0;   }
        }
        @keyframes wavebar {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50%       { transform: scaleY(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
