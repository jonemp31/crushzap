import { T, AVATARS } from "../constants/theme.js";
import { Avatar } from "./ui/Avatar.jsx";
import { DoubleCheck } from "./ui/DoubleCheck.jsx";
import { PinIcon } from "./ui/PinIcon.jsx";
import { BottomTabs } from "./ui/BottomTabs.jsx";

export function ConversationList({ conversations, onSelect, activeTab, onTabChange, visitedChats }) {
  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{
        background: T.headerBg, padding: "14px 16px 6px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, display: "flex", alignItems: "baseline" }}>
          <span style={{ fontSize: 20, color: T.textPrimary }}>crush</span>
          <span style={{ fontSize: 20, color: "#25D366" }}>zap</span>
        </span>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f">
            <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          </svg>
        </div>
      </div>

      <div style={{ padding: "10px 16px 6px" }}>
        <div style={{
          background: T.searchBg, borderRadius: 8, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <span style={{ color: "#8696a0", fontSize: 16 }}>Pesquisar usuários ou conversas</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingTop: 4 }}>
        {conversations.map((conv) => {
          const visited = visitedChats.has(conv.id);
          return (
            <div key={conv.id} onClick={() => onSelect(conv.id)} style={{
              display: "flex", alignItems: "center", padding: "12px 16px",
              gap: 14, cursor: "pointer",
            }}>
              <Avatar emoji={conv.avatar} size={52} bg={conv.avatarBg} photo={AVATARS[conv.id]} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{
                    color: T.textPrimary, fontSize: 17, fontWeight: 400,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{conv.name}</span>
                  <span style={{
                    color: conv.unread > 0 ? T.unreadBadge : T.textSecondary,
                    fontSize: 12, flexShrink: 0, marginLeft: 8,
                  }}>{conv.status === "Online agora" ? "online" : conv.status?.startsWith("visto por último hoje às ") ? conv.status.slice("visto por último hoje às ".length) : conv.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    color: T.textSecondary,
                    fontSize: 14,
                    overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap", flex: 1, display: "flex", alignItems: "center", gap: 3,
                  }}>
                    {visited && conv.messages[conv.messages.length - 1]?.sent && (
                      <DoubleCheck read={conv.messages[conv.messages.length - 1]?.read} />
                    )}
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {visited ? conv.lastMsg : "Toque para conversar"}
                    </span>
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, flexShrink: 0 }}>
                    {conv.pinned && <PinIcon />}
                    {conv.online && <div style={{ width: 13, height: 13, borderRadius: "50%", background: T.unreadBadge }} />}
                    {conv.unread > 0 && (
                      <div style={{
                        background: T.unreadBadge, color: "#fff", borderRadius: 12,
                        minWidth: 22, height: 22, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 12, fontWeight: 600, padding: "0 5px",
                      }}>{conv.unread}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FABs */}
      <div style={{ position: "absolute", bottom: 76, right: 16, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)", cursor: "pointer",
        }}>
          <span style={{ fontSize: 18, color: "#fff" }}>✦</span>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: T.fabBg, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)", cursor: "pointer",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
            <path d="M19 3H5c-1 0-2 .6-2 1.6V21l3.5-3.5h12.5c1 0 2-1.1 2-2.1V4.6C21 3.6 20 3 19 3z"/>
            <path d="M12 7v6M9 10h6" stroke={T.fabBg} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <BottomTabs activeTab={activeTab} onTabChange={onTabChange} unreadCount={totalUnread} />
    </div>
  );
}
