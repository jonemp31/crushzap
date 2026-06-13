import { T } from "../constants/theme.js";
import { BottomTabs } from "../components/ui/BottomTabs.jsx";

export function CommunitiesView({ activeTab, onTabChange, unreadCount }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{
        padding: "14px 16px 6px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: T.textPrimary, fontSize: 24, fontWeight: 700 }}>Comunidades</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f">
          <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
        </svg>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <img src="https://s3files.autopilots.trade/crushzap/atualizacoes/comunidades.png"
          style={{ width: 242, height: 242, objectFit: "cover", borderRadius: 24, marginBottom: 28 }}
        />

        <span style={{
          fontSize: 22, fontWeight: 600, color: T.textPrimary,
          textAlign: "center", lineHeight: 1.3, marginBottom: 14,
        }}>
          Conecte-se com outras pessoas da sua região com as comunidades
        </span>

        <span style={{
          fontSize: 15, color: T.textSecondary, textAlign: "center",
          lineHeight: 1.5, marginBottom: 32, maxWidth: 340,
        }}>
          As comunidades permitem reunir pessoas que estão mais próximas de você e receber avisos de encontros com facilidade. As comunidades das quais você participa serão exibidas nesta tela.
        </span>

        <button onClick={() => onTabChange("chats")} style={{
          width: "100%", maxWidth: 340, padding: "14px 0",
          background: T.fabBg, color: "#fff", border: "none",
          borderRadius: 28, fontSize: 16, fontWeight: 600,
          cursor: "pointer", marginBottom: 24,
          whiteSpace: "pre-line", lineHeight: 1.4,
        }}>
          {"Você ainda não participa de\nnenhuma comunidade"}
        </button>

        <span style={{
          fontSize: 14, color: T.textSecondary, textAlign: "center", lineHeight: 1.5,
        }}>
          Para participar de uma comunidade você precisa receber um convite de uma mulher ou modelo verificada da sua região.
        </span>
      </div>

      <BottomTabs activeTab={activeTab} onTabChange={onTabChange} unreadCount={unreadCount} />
    </div>
  );
}
