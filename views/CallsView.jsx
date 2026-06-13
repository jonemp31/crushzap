import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { T } from "../constants/theme.js";
import { CALLS } from "../data/calls.js";
import { Avatar } from "../components/ui/Avatar.jsx";
import { BottomTabs } from "../components/ui/BottomTabs.jsx";

export function CallsView({ activeTab, onTabChange, unreadCount }) {
  const [notice, setNotice] = useState(false);

  useEffect(() => { setNotice(true); }, []);
  const quickActions = [
    { label: "Ligar", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    )},
    { label: "Programar", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    )},
    { label: "Teclado", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
        <circle cx="7" cy="7" r="1.5"/><circle cx="12" cy="7" r="1.5"/><circle cx="17" cy="7" r="1.5"/>
        <circle cx="7" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17" cy="12" r="1.5"/>
        <circle cx="7" cy="17" r="1.5"/><circle cx="12" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/>
      </svg>
    )},
    { label: "Favoritos", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    )},
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{
        padding: "14px 16px 6px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: T.textPrimary, fontSize: 24, fontWeight: 700 }}>Ligações</span>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f">
            <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          </svg>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "16px 12px" }}>
          {quickActions.map((a, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: "#f0f2f5",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {a.icon}
              </div>
              <span style={{ fontSize: 13, color: T.textSecondary }}>{a.label}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary }}>Recentes</span>
        </div>

        {CALLS.map((call) => (
          <div key={call.id} style={{
            display: "flex", alignItems: "center", padding: "10px 16px", gap: 14, cursor: "pointer",
          }}>
            <Avatar emoji={call.emoji} size={50} bg={call.bg} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                color: call.missed ? "#e74c3c" : T.textPrimary,
                fontSize: 16, fontWeight: 400, display: "block",
              }}>{call.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={call.type === "outgoing" ? "#25d366" : (call.missed ? "#e74c3c" : "#25d366")}
                  strokeWidth="2.5">
                  {call.type === "outgoing" ? (
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  ) : (
                    <path d="M17 7L7 17M7 17h10M7 17V7"/>
                  )}
                </svg>
                <span style={{ fontSize: 13, color: T.textSecondary }}>{call.time}</span>
              </div>
            </div>
            <div style={{ flexShrink: 0, cursor: "pointer" }}>
              {call.isVideo ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
                  <rect x="2" y="5" width="14" height="14" rx="2"/><path d="M22 7l-6 5 6 5V7z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              )}
            </div>
          </div>
        ))}

        <div style={{ height: 80 }} />
      </div>

      <div style={{
        position: "absolute", bottom: 76, right: 16,
        width: 56, height: 56, borderRadius: 16,
        background: T.fabBg, display: "flex",
        alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.18)", cursor: "pointer",
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          <path d="M17 1v6M14 4h6" strokeWidth="2"/>
        </svg>
      </div>

      <BottomTabs activeTab={activeTab} onTabChange={onTabChange} unreadCount={unreadCount} />

      {notice && createPortal(
        <div onClick={() => setNotice(false)} style={{
          position: "fixed", inset: 0, zIndex: 3000,
          background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 32px",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 16, padding: "24px 22px",
            maxWidth: 310, width: "100%", textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            fontFamily: "'Poppins', system-ui, sans-serif",
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📞</div>
            <p style={{
              fontSize: 14.5, color: "#333", lineHeight: 1.6,
              margin: "0 0 20px",
            }}>
              Aqui ficará o registro das suas ligações nos últimos dias, por enquanto você ainda não realizou ou recebeu nenhuma ligação. Esses são apenas registros de exemplo!
            </p>
            <button onClick={() => { setNotice(false); onTabChange("chats"); }} style={{
              background: T.fabBg, color: "#fff", border: "none",
              borderRadius: 24, padding: "10px 32px",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>Entendi</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
