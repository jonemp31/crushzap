import { T } from "../../constants/theme.js";

function ChatTabIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c0-1.032-.597-1.646-2.064-1.646z"
        fill={active ? T.green : "none"} stroke={active ? "none" : "#54656f"} strokeWidth="1.5"/>
    </svg>
  );
}

function UpdatesTabIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active ? "none" : "#54656f"} fill={active ? T.green : "none"} strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3.5" stroke={active ? "#fff" : "#54656f"} fill="none" strokeWidth="1.5"/>
    </svg>
  );
}

export function BottomTabs({ activeTab, onTabChange, unreadCount }) {
  const tabs = [
    { label: "Conversas",   id: "chats",       count: unreadCount },
    { label: "Atualizações",id: "updates" },
    { label: "Comunidades", id: "communities" },
    { label: "Ligações",    id: "calls" },
  ];

  return (
    <div style={{
      display: "flex", borderTop: "1px solid #e9edef",
      background: "#ffffff", padding: "6px 0 10px",
    }}>
      {tabs.map((tab, i) => {
        const isActive = activeTab === tab.id;
        return (
          <div key={i} onClick={() => onTabChange(tab.id)} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3, cursor: "pointer",
          }}>
            <div style={{ position: "relative" }}>
              {isActive ? (
                <div style={{
                  background: "#d8fdd2", borderRadius: 16,
                  padding: "4px 18px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {i === 0 && <ChatTabIcon active />}
                  {i === 1 && <UpdatesTabIcon active />}
                  {i === 2 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={T.green}>
                      <path d="M17 20c0-1.657-2.239-3-5-3s-5 1.343-5 3"/><circle cx="12" cy="10" r="3"/>
                      <path d="M21 17c0-1.1-1.343-2-3-2-.824 0-1.563.293-2.08.75"/><circle cx="18" cy="10" r="2"/>
                      <path d="M3 17c0-1.1 1.343-2 3-2 .824 0 1.563.293 2.08.75"/><circle cx="6" cy="10" r="2"/>
                    </svg>
                  )}
                  {i === 3 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={T.green}>
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  )}
                </div>
              ) : (
                <div style={{ padding: "4px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i === 0 && <ChatTabIcon />}
                  {i === 1 && <UpdatesTabIcon />}
                  {i === 2 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
                      <path d="M17 20c0-1.657-2.239-3-5-3s-5 1.343-5 3"/><circle cx="12" cy="10" r="3"/>
                      <path d="M21 17c0-1.1-1.343-2-3-2-.824 0-1.563.293-2.08.75"/><circle cx="18" cy="10" r="2"/>
                      <path d="M3 17c0-1.1 1.343-2 3-2 .824 0 1.563.293 2.08.75"/><circle cx="6" cy="10" r="2"/>
                    </svg>
                  )}
                  {i === 3 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  )}
                </div>
              )}
              {tab.count > 0 && (
                <div style={{
                  position: "absolute", top: -2, right: isActive ? 2 : -12,
                  background: T.unreadBadge, color: "#fff", borderRadius: 10,
                  minWidth: 20, height: 20, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 11, fontWeight: 700, padding: "0 5px",
                }}>{tab.count}</div>
              )}
            </div>
            <span style={{
              color: isActive ? T.textPrimary : T.textSecondary,
              fontSize: 12, fontWeight: isActive ? 600 : 400,
            }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}
