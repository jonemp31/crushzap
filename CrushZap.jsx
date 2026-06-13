import { useState, useEffect, useRef } from "react";
import { T } from "./constants/theme.js";
import { initConversations } from "./data/statuses.js";
import { ConversationList } from "./components/ConversationList.jsx";
import { ChatView } from "./views/ChatView.jsx";
import { UpdatesView } from "./views/UpdatesView.jsx";
import { CallsView } from "./views/CallsView.jsx";
import { CommunitiesView } from "./views/CommunitiesView.jsx";
import { TutorialOverlay } from "./components/TutorialOverlay.jsx";

const CONTAINER_STYLE = {
  width: "100%", height: "100dvh", margin: "0 auto",
  position: "relative", overflow: "hidden",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  background: T.bg,
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
  *::-webkit-scrollbar { display: none; }
  * { -ms-overflow-style: none; scrollbar-width: none; box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
  @media (min-width: 431px) {
    #root {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      background: #efeae2;
    }
    #root > div {
      max-width: 430px;
      box-shadow: 0 0 40px rgba(0,0,0,0.18);
    }
  }
`;

// ── Persistência de sessão (sobrevive a refresh / fechar a aba) ──
// Versionado: ao mudar a estrutura dos dados, suba STATE_KEY para _v2 (descarta o estado antigo)
const STATE_KEY = "cz_state_v1";

let _initialState; // cache: lê o localStorage uma única vez por carregamento
function getInitialState() {
  if (_initialState !== undefined) return _initialState;
  try {
    const raw = localStorage.getItem(STATE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    _initialState = (parsed && Array.isArray(parsed.conversations)) ? parsed : null;
  } catch {
    _initialState = null;
  }
  return _initialState;
}

export default function CrushZap() {
  const saved = getInitialState();
  const [activeTab, setActiveTab] = useState(() => saved?.activeTab ?? "chats");
  const [activeConv, setActiveConv] = useState(() => saved?.activeConv ?? null);
  const [conversations, setConversations] = useState(() => saved?.conversations ?? initConversations());
  const [visitedChats, setVisitedChats] = useState(() => new Set(saved?.visitedChats ?? ["jonatan"]));
  const [geoData, setGeoData] = useState(null);
  const [purchasedChannels, setPurchasedChannels] = useState(() => {
    try { return JSON.parse(localStorage.getItem("crushzap_access") || "{}"); }
    catch { return {}; }
  });
  const [tutorialStep, setTutorialStep] = useState(null);

  // Inicializa o ref já com a conversa restaurada (senão unread/som tratariam o chat aberto como inativo)
  const activeConvRef = useRef(saved?.activeConv ?? null);
  const notifTimestamps = useRef([]);
  const tutorialTimers = useRef([]);
  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);

  const onPurchase = (channelId, txId) => {
    setPurchasedChannels(prev => {
      const updated = { ...prev, [channelId]: { txId: txId || null, purchasedAt: Date.now() } };
      try { localStorage.setItem("crushzap_access", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const playNotifSound = () => {
    const now = Date.now();
    notifTimestamps.current = notifTimestamps.current.filter(t => now - t < 60000);
    if (notifTimestamps.current.length < 3) {
      notifTimestamps.current.push(now);
      const audio = new Audio("https://s3files.autopilots.trade/crushzap/somnotificacao.mp3");
      audio.play().catch(() => {});
    }
  };

  useEffect(() => {
    const setGeo = (city, region, regionCode, country) =>
      setGeoData({ city: city || "", region: region || "", regionCode: regionCode || "", country: country || "" });

    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        if (data.city) return setGeo(data.city, data.region, data.region_code, data.country_name);
        throw new Error("no city");
      })
      .catch(() => {
        fetch("http://ip-api.com/json/?fields=city,regionName,region,country")
          .then(r => r.json())
          .then(data => {
            if (data.city) return setGeo(data.city, data.regionName, data.region, data.country);
            throw new Error("no city");
          })
          .catch(() => setGeo("", "", "", ""));
      });
  }, []);

  // Persiste o estado durável. Transitório (showCall/isTyping/tutorialStep) fica de fora de propósito.
  useEffect(() => {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        conversations,
        visitedChats: [...visitedChats],
        activeTab,
        activeConv,
      }));
    } catch {}
  }, [conversations, visitedChats, activeTab, activeConv]);

  const openChat = (id) => {
    setVisitedChats(prev => new Set([...prev, id]));
    activeConvRef.current = id;
    setActiveConv(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const startTutorial = () => {
    // Step 0: pulsa no botão de voltar (ainda no ChatView)
    setTutorialStep(0);

    const t = [
      // Navega para a lista de conversas e já passa para step 1 (aba Atualizações)
      setTimeout(() => {
        activeConvRef.current = null;
        setActiveConv(null);
        setActiveTab("chats");
        setTutorialStep(1);
      }, 2300),
      // Navega para aba Atualizações
      setTimeout(() => setActiveTab("updates"), 4800),
      // Step 2: pulsa no card do canal
      setTimeout(() => setTutorialStep(2), 5300),
      // Step 3: abre feed do canal + mostra banner
      setTimeout(() => setTutorialStep(3), 8100),
      // Encerra, sinaliza pós-tutorial e volta ao chat
      setTimeout(() => {
        setConversations(prev =>
          prev.map(c => c.id === "duda" ? { ...c, postTutorialPending: true } : c)
        );
        setTutorialStep(null);
        openChat("duda");
      }, 12600),
    ];
    tutorialTimers.current = t;
  };

  const skipTutorial = () => {
    tutorialTimers.current.forEach(clearTimeout);
    tutorialTimers.current = [];
    setTutorialStep(null);
    // Se ainda estiver no ChatView (step 0), permanece; caso contrário volta ao chat
    if (!activeConv) openChat("duda");
  };

  if (activeConv) {
    return (
      <div style={CONTAINER_STYLE}>
        <style>{GLOBAL_CSS}</style>
        <ChatView
          conversation={activeConv}
          onBack={() => { activeConvRef.current = null; setActiveConv(null); }}
          conversations={conversations}
          setConversations={setConversations}
          geoData={geoData}
          activeConvRef={activeConvRef}
          playNotifSound={playNotifSound}
          onPurchase={onPurchase}
          onTutorialStart={startTutorial}
        />
        {/* Overlay presente no branch do ChatView para o step 0 */}
        <TutorialOverlay step={tutorialStep} onSkip={skipTutorial} />
      </div>
    );
  }

  return (
    <div style={CONTAINER_STYLE}>
      <style>{GLOBAL_CSS}</style>
      {activeTab === "chats" && (
        <ConversationList
          conversations={conversations}
          onSelect={openChat}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          visitedChats={visitedChats}
        />
      )}
      {activeTab === "updates" && (
        <UpdatesView
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={totalUnread}
          purchasedChannels={purchasedChannels}
          tutorialOpenPack={tutorialStep === 3}
        />
      )}
      {activeTab === "communities" && (
        <CommunitiesView
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={totalUnread}
        />
      )}
      {activeTab === "calls" && (
        <CallsView
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={totalUnread}
        />
      )}
      <TutorialOverlay step={tutorialStep} onSkip={skipTutorial} />
    </div>
  );
}
