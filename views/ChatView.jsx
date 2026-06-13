import { useState, useEffect, useRef } from "react";
import { T, AVATARS, wallpaperSvg } from "../constants/theme.js";
import { CHAT_SCRIPTS, DECLINE_SCRIPTS, POST_CALL_SCRIPTS, POST_PIX_SCRIPTS, POST_TUTORIAL_SCRIPTS, SUPPORT_WELCOME_SCRIPTS } from "../data/scripts.js";
import { Avatar } from "../components/ui/Avatar.jsx";
import { TypingIndicator } from "../components/ui/TypingIndicator.jsx";
import { RecordingIndicator } from "../components/ui/RecordingIndicator.jsx";
import { DateSeparator } from "../components/chat/DateSeparator.jsx";
import { EncryptionCard } from "../components/chat/EncryptionCard.jsx";
import { CallStatusMessage } from "../components/chat/CallStatusMessage.jsx";
import { MessageBubble } from "../components/chat/MessageBubble.jsx";
import { VideoCallScreen } from "../components/VideoCallScreen.jsx";

const PIX_CHANNEL_MAP = { duda: "pack" };

export function ChatView({ conversation, onBack, conversations, setConversations, geoData, activeConvRef, playNotifSound, onPurchase, onTutorialStart }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const messagesEnd = useRef(null);
  const scriptRunning = useRef(false);
  const autoCallTimerRef = useRef(null);
  const pendingCallTimerRef = useRef(null);
  const autoContinueTimerRef = useRef(null);
  const runStepRef = useRef(null);
  const postPixFiredRef = useRef(false);
  const [callVideoSrc, setCallVideoSrc] = useState(null);
  const postTutorialFiredRef = useRef(false);
  const postTutorialModeRef = useRef(false);
  const postTutorialDeclinedRef = useRef(false);
  const runPostTutorialRef = useRef(null);
  const welcomeFiredRef = useRef(false);
  const runWelcomeRef = useRef(null);
  const conv = conversations.find((c) => c.id === conversation);
  const scriptStepRef = useRef(conv?.scriptStep ?? 0);
  // Avança o contador de forma síncrona (ref) + persiste no estado (closure-safe)
  const setScriptStep = (n) => {
    scriptStepRef.current = n;
    setConversations(prev => prev.map(c => c.id === conversation ? { ...c, scriptStep: n } : c));
  };
  const isInactive = () => activeConvRef?.current !== conversation;
  const unreadIncrement = (c) => isInactive() ? (c.unread || 0) + 1 : 0;
  const notifyIfInactive = () => { if (isInactive()) playNotifSound?.(); };

  useEffect(() => {
    setTimeout(() => messagesEnd.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [conv?.messages.length, isTyping, isRecording, showCall]);

  useEffect(() => {
    const convState = conversations.find(c => c.id === conversation);
    if (!convState?.postTutorialPending || postTutorialFiredRef.current) return;
    postTutorialFiredRef.current = true;
    setConversations(prev =>
      prev.map(c => c.id === conversation ? { ...c, postTutorialPending: false } : c)
    );
    setTimeout(() => runPostTutorialRef.current?.(), 800);
  }, []);

  // Boas-vindas do canal de suporte (apenas na primeira abertura do chat Crushzap)
  useEffect(() => {
    if (conversation !== "jonatan" || welcomeFiredRef.current) return;
    const convState = conversations.find(c => c.id === conversation);
    if (convState?.welcomeFired) return;
    welcomeFiredRef.current = true;
    setConversations(prev =>
      prev.map(c => c.id === conversation ? { ...c, welcomeFired: true } : c)
    );
    setTimeout(() => runWelcomeRef.current?.(), 600);
  }, []);

  useEffect(() => {
    if (conversation === "jonatan") return;
    const delay = (12 + Math.random() * 6) * 1000;
    const timer = setTimeout(() => {
      setConversations(prev =>
        prev.map(c => c.id === conversation ? { ...c, status: "Online agora" } : c)
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [conversation]);

  // Limpa timers de chamada pendentes ao desmontar (evita setState fora de tela)
  useEffect(() => () => {
    clearTimeout(autoCallTimerRef.current);
    clearTimeout(pendingCallTimerRef.current);
    clearTimeout(autoContinueTimerRef.current);
  }, []);

  const handleBack = () => {
    if (conversation !== "jonatan") {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setConversations(prev =>
        prev.map(c => c.id === conversation
          ? { ...c, status: `visto por último hoje às ${h}:${m}` } : c)
      );
    }
    onBack();
  };

  const handleDecline = () => {
    setShowCall(false);
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setConversations(prev =>
      prev.map(c => c.id === conversation
        ? { ...c, messages: [...c.messages, { id: Date.now(), type: "call", callStatus: "missed", text: "Chamada de vídeo perdida", time: timeStr }] } : c)
    );

    // Intercepts the first decline after the tutorial call
    if (postTutorialModeRef.current && !postTutorialDeclinedRef.current) {
      postTutorialDeclinedRef.current = true;
      const ptScript = POST_TUTORIAL_SCRIPTS[conversation];
      if (ptScript) {
        const sendDecline = (index) => {
          if (index >= ptScript.declineMessages.length) {
            setTimeout(() => setShowCall(true), ptScript.declineCallDelay * 1000);
            return;
          }
          const msg = ptScript.declineMessages[index];
          const preDelay = (msg.preDelay[0] + Math.random() * (msg.preDelay[1] - msg.preDelay[0])) * 1000;
          setTimeout(() => {
            setIsTyping(true);
            const typingDuration = Math.min(7000, Math.max(1500, 1200 + msg.text.length * (70 + Math.random() * 40)));
            setTimeout(() => {
              setIsTyping(false);
              const replyTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
              setConversations(prev =>
                prev.map(c => c.id === conversation
                  ? { ...c, messages: [...c.messages, { id: Date.now() + index, text: msg.text, sent: false, time: replyTime }], lastMsg: msg.text, time: replyTime, unread: unreadIncrement(c) }
                  : c)
              );
              notifyIfInactive();
              sendDecline(index + 1);
            }, typingDuration);
          }, preDelay);
        };
        sendDecline(0);
      }
      return;
    }

    const count = conv?.declineCount || 0;
    if (count >= DECLINE_SCRIPTS.length) {
      scriptRunning.current = false; // sem mais tentativas: destrava o funil
      return;
    }

    const script = DECLINE_SCRIPTS[count];
    // Mantém o funil travado enquanto houver nova tentativa de chamada; libera se desistiu
    scriptRunning.current = !!script.retryCall;
    setConversations(prev =>
      prev.map(c => c.id === conversation ? { ...c, declineCount: count + 1 } : c)
    );

    const sendDeclineMsg = (index) => {
      if (index >= script.messages.length) {
        if (script.retryCall) setTimeout(() => setShowCall(true), 5000);
        return;
      }
      const msg = script.messages[index];
      const preDelay = index === 0 ? 3000 + Math.random() * 2500 : 1500 + Math.random() * 1500;
      setTimeout(() => {
        setIsTyping(true);
        const msgText = typeof msg.text === "function" ? msg.text(conv, geoData) : msg.text;
        const typingDuration = Math.min(7000, Math.max(1500, 1200 + msgText.length * (70 + Math.random() * 40)));
        setTimeout(() => {
          setIsTyping(false);
          const replyTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          setConversations(prev =>
            prev.map(c => c.id === conversation
              ? { ...c, messages: [...c.messages, { id: Date.now() + index, text: msgText, sent: false, time: replyTime }], lastMsg: msgText, time: replyTime, unread: unreadIncrement(c) } : c)
          );
          notifyIfInactive();
          sendDeclineMsg(index + 1);
        }, typingDuration);
      }, preDelay);
    };
    sendDeclineMsg(0);
  };

  const runPostPixMessages = () => {
    if (postPixFiredRef.current) return;
    // Guard persistente: sobrevive ao unmount/remount do ChatView
    const convState = conversations.find(c => c.id === conversation);
    if (convState?.postPixFired) return;

    postPixFiredRef.current = true;
    setConversations(prev =>
      prev.map(c => c.id === conversation ? { ...c, postPixFired: true } : c)
    );

    // Meta Pixel — Purchase (browser-only). Optional chaining: nunca quebra se o pixel não carregar.
    const pixAmount = convState?.messages.find(m => m.type === "pix")?.amount ?? 15;
    window.fbq?.("track", "Purchase", { value: pixAmount, currency: "BRL" });

    const channelId = PIX_CHANNEL_MAP[conversation];
    if (channelId) {
      const pixMsg = convState?.messages.find(m => m.type === "pix" && m.pixTx);
      onPurchase?.(channelId, pixMsg?.pixTx?.id || null);
    }

    const messages = POST_PIX_SCRIPTS[conversation];
    if (!messages) return;
    const send = (index) => {
      if (index >= messages.length) {
        onTutorialStart?.();
        return;
      }
      const msg = messages[index];
      const preDelay = msg.preDelay
        ? (msg.preDelay[0] + Math.random() * (msg.preDelay[1] - msg.preDelay[0])) * 1000
        : (index === 0 ? 3000 + Math.random() * 2500 : 1500 + Math.random() * 1500);
      setTimeout(() => {
        setIsTyping(true);
        const typingDuration = Math.min(7000, Math.max(1500, 1200 + msg.text.length * (70 + Math.random() * 40)));
        setTimeout(() => {
          setIsTyping(false);
          const replyTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          setConversations(prev =>
            prev.map(c => c.id === conversation
              ? { ...c, messages: [...c.messages, { id: Date.now() + index, text: msg.text, sent: false, time: replyTime }], lastMsg: msg.text, time: replyTime, unread: unreadIncrement(c) }
              : c)
          );
          notifyIfInactive();
          send(index + 1);
        }, typingDuration);
      }, preDelay);
    };
    send(0);
  };

  const runSupportWelcome = () => {
    const messages = SUPPORT_WELCOME_SCRIPTS[conversation];
    if (!messages) return;
    const send = (index) => {
      if (index >= messages.length) return;
      const msg = messages[index];
      const preDelay = (msg.preDelay[0] + Math.random() * (msg.preDelay[1] - msg.preDelay[0])) * 1000;
      setTimeout(() => {
        setIsTyping(true);
        const typingDuration = Math.min(7000, Math.max(1500, 1200 + msg.text.length * (70 + Math.random() * 40)));
        setTimeout(() => {
          setIsTyping(false);
          const replyTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          setConversations(prev =>
            prev.map(c => c.id === conversation
              ? { ...c, messages: [...c.messages, { id: Date.now() + index, text: msg.text, sent: false, time: replyTime }], lastMsg: msg.text, time: replyTime, unread: unreadIncrement(c) }
              : c)
          );
          notifyIfInactive();
          send(index + 1);
        }, typingDuration);
      }, preDelay);
    };
    send(0);
  };
  runWelcomeRef.current = runSupportWelcome;

  const runPostTutorialMessages = () => {
    const script = POST_TUTORIAL_SCRIPTS[conversation];
    if (!script) return;
    postTutorialModeRef.current = true;
    setCallVideoSrc(script.callVideo);
    const send = (index) => {
      if (index >= script.messages.length) {
        setTimeout(() => setShowCall(true), script.callDelay * 1000);
        return;
      }
      const msg = script.messages[index];
      const preDelay = (msg.preDelay[0] + Math.random() * (msg.preDelay[1] - msg.preDelay[0])) * 1000;
      setTimeout(() => {
        setIsTyping(true);
        const typingDuration = Math.min(7000, Math.max(1500, 1200 + msg.text.length * (70 + Math.random() * 40)));
        setTimeout(() => {
          setIsTyping(false);
          const replyTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          setConversations(prev =>
            prev.map(c => c.id === conversation
              ? { ...c, messages: [...c.messages, { id: Date.now() + index, text: msg.text, sent: false, time: replyTime }], lastMsg: msg.text, time: replyTime, unread: unreadIncrement(c) }
              : c)
          );
          notifyIfInactive();
          send(index + 1);
        }, typingDuration);
      }, preDelay);
    };
    send(0);
  };
  runPostTutorialRef.current = runPostTutorialMessages;

  const runPostCallMessages = () => {
    const messages = POST_CALL_SCRIPTS[conversation];
    if (!messages) { scriptRunning.current = false; return; }
    const send = (index) => {
      if (index >= messages.length) {
        scriptRunning.current = false; // POST_CALL terminou: libera o funil
        return;
      }
      const msg = messages[index];
      const preDelay = index === 0 ? 5000 : 1500 + Math.random() * 1500;
      setTimeout(() => {
        setIsTyping(true);
        const typingDuration = Math.min(7000, Math.max(1500, 1200 + msg.text.length * (70 + Math.random() * 40)));
        setTimeout(() => {
          setIsTyping(false);
          const replyTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          setConversations(prev =>
            prev.map(c => c.id === conversation
              ? { ...c, messages: [...c.messages, { id: Date.now() + index, text: msg.text, sent: false, time: replyTime }], lastMsg: msg.text, time: replyTime, unread: unreadIncrement(c) }
              : c)
          );
          notifyIfInactive();
          send(index + 1);
        }, typingDuration);
      }, preDelay);
    };
    send(0);
  };

  // ── Shared step runner (used by sendMessage + auto-advance timer) ──
  const runStep = (stepIndex) => {
    const script = CHAT_SCRIPTS[conversation];
    if (!script || stepIndex >= script.length || scriptRunning.current) return;
    const stepDef = script[stepIndex];
    if (!stepDef || stepDef.action) return;

    const stepMessages = typeof stepDef.messages === "function"
      ? stepDef.messages(conv, geoData)
      : stepDef.messages;

    scriptRunning.current = true;
    setScriptStep(stepIndex + 1);

    const sendMsg = (index) => {
      if (index >= stepMessages.length) {
        scriptRunning.current = false;
        // Auto-call on next step
        const nextStepDef = script[stepIndex + 1];
        if (nextStepDef?.action === "call") {
          autoCallTimerRef.current = setTimeout(() => {
            autoCallTimerRef.current = null;
            // Trava o funil até a chamada resolver e avança além do step de chamada
            scriptRunning.current = true;
            setScriptStep(stepIndex + 2);
            setShowCall(true);
          }, 15000);
        }
        // Auto-advance to next step after delay
        if (stepDef.autoAdvanceDelay) {
          autoContinueTimerRef.current = setTimeout(() => {
            autoContinueTimerRef.current = null;
            runStepRef.current?.(stepIndex + 1);
          }, stepDef.autoAdvanceDelay * 1000);
        }
        return;
      }

      const msg = stepMessages[index];
      const isImg       = !!msg.image;
      const isAudio     = !!msg.audio;
      const isVideo     = !!msg.video;
      const isSlideshow = !!msg.slideshow;
      const isPix       = msg.type === "pix";

      let preDelay;
      if (msg.preDelay) {
        preDelay = (msg.preDelay[0] + Math.random() * (msg.preDelay[1] - msg.preDelay[0])) * 1000;
      } else {
        preDelay = index === 0 ? 3000 + Math.random() * 2500 : 1500 + Math.random() * 1500;
      }

      setTimeout(() => {
        if (isAudio) setIsRecording(true); else setIsTyping(true);
        const msgText = (!isImg && !isAudio && !isVideo && !isSlideshow && !isPix && msg.text)
          ? (typeof msg.text === "function" ? msg.text(conv, geoData) : msg.text)
          : "";
        const typingDuration = isAudio
          ? 3000 + Math.random() * 2000
          : (isImg || isVideo || isSlideshow || isPix)
          ? 1000 + Math.random() * 500
          : Math.min(7000, Math.max(1500, 1200 + msgText.length * (70 + Math.random() * 40)));

        setTimeout(() => {
          if (isAudio) setIsRecording(false); else setIsTyping(false);
          const replyTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          const reply = isImg
            ? { id: Date.now() + index, image: msg.image, sent: false, time: replyTime }
            : isSlideshow
            ? { id: Date.now() + index, slideshow: msg.slideshow, sent: false, time: replyTime }
            : isVideo
            ? { id: Date.now() + index, video: msg.video, sent: false, time: replyTime }
            : isPix
            ? { id: Date.now() + index, type: "pix", amount: msg.amount, description: msg.description, sent: false, time: replyTime }
            : isAudio
            ? { id: Date.now() + index, type: "voice", audio: msg.audio, duration: msg.duration || "0:15", sent: false, time: replyTime }
            : { id: Date.now() + index, text: msgText, sent: false, time: replyTime };
          const lastMsg = isImg ? "📷 Foto" : isSlideshow ? "🖼️ Álbum" : isVideo ? "📹 Vídeo" : isPix ? "💰 PIX" : isAudio ? "🎤 Áudio" : msgText;
          setConversations(prev =>
            prev.map(c => c.id === conversation
              ? { ...c, messages: [...c.messages, reply], lastMsg, time: replyTime, unread: unreadIncrement(c) } : c)
          );
          notifyIfInactive();
          sendMsg(index + 1);
        }, typingDuration);
      }, preDelay);
    };

    sendMsg(0);
  };
  // Keep ref always pointing to latest runStep (avoids stale closure in timers)
  runStepRef.current = runStep;

  const sendMessage = () => {
    if (!input.trim()) return;
    if (autoCallTimerRef.current) {
      clearTimeout(autoCallTimerRef.current);
      autoCallTimerRef.current = null;
    }
    if (autoContinueTimerRef.current) {
      clearTimeout(autoContinueTimerRef.current);
      autoContinueTimerRef.current = null;
    }
    const now = new Date();
    const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newMsg = { id: Date.now(), text: input.trim(), sent: true, time: timeStr, read: false };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversation) return c;
        let msgs = [...c.messages];
        if (msgs.length === 0) {
          const months = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
          const dateStr = `${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
          msgs.push({ id: Date.now() - 2, type: "date", text: dateStr });
          msgs.push({ id: Date.now() - 1, type: "encryption" });
        }
        msgs.push(newMsg);
        return { ...c, messages: msgs, lastMsg: input.trim(), time: timeStr };
      })
    );
    setInput("");

    const script = CHAT_SCRIPTS[conversation];
    const step = scriptStepRef.current;

    if (script && step < script.length && !scriptRunning.current) {
      const currentStep = script[step];

      if (currentStep.action === "call") {
        // Trava o funil (impede que mensagens durante a contagem disparem o próximo step)
        scriptRunning.current = true;
        setScriptStep(step + 1);
        // Timer cancelável e que NÃO é limpo pelas próximas mensagens do usuário
        pendingCallTimerRef.current = setTimeout(() => {
          pendingCallTimerRef.current = null;
          setShowCall(true);
        }, (currentStep.delay || 5) * 1000);
        return;
      }

      runStep(step);
    }
  };

  if (!conv) return null;

  if (showCall) {
    return (
      <VideoCallScreen
        callerName={conv.name.split(" ")[0]}
        callerAvatar={AVATARS[conv.id]}
        videoSrc={callVideoSrc}
        onDecline={handleDecline}
        onCallEnd={(duration) => {
          setShowCall(false);
          const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          const mm = Math.floor(duration / 60).toString().padStart(2, "0");
          const ss = (duration % 60).toString().padStart(2, "0");
          setConversations(prev =>
            prev.map(c => c.id === conversation
              ? { ...c, messages: [
                  ...c.messages,
                  { id: Date.now(), type: "call", callStatus: "started", text: "Chamada de vídeo iniciada", time: timeStr },
                  { id: Date.now() + 1, type: "call", callStatus: "ended", text: `Chamada de vídeo - ${mm}:${ss}`, time: timeStr },
                ] } : c)
          );
          // Mantém o funil travado durante o POST_CALL (liberado ao fim de runPostCallMessages)
          if (!postTutorialModeRef.current) runPostCallMessages();
          else scriptRunning.current = false;
        }}
      />
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.chatBg }}>
      <div style={{
        background: T.chatHeaderBg, padding: "6px 6px 6px 2px",
        display: "flex", alignItems: "center", gap: 6, minHeight: 56,
      }}>
        <button onClick={handleBack} style={{
          background: "none", border: "none", color: "#fff",
          fontSize: 24, cursor: "pointer", padding: "4px 6px", lineHeight: 1,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <Avatar emoji={conv.avatar} size={40} bg={conv.avatarBg} photo={AVATARS[conv.id]} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: "#fff", fontSize: 16, fontWeight: 500,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{conv.name}</div>
          {conv.status && (
            <div style={{ color: (isTyping || isRecording) ? "#fff" : "#d0e8d0", fontSize: 12 }}>
              {isRecording ? "gravando..." : isTyping ? "digitando..." : conv.status}
            </div>
          )}
          {!conv.status && (isTyping || isRecording) && (
            <div style={{ color: "#fff", fontSize: 12 }}>
              {isRecording ? "gravando..." : "digitando..."}
            </div>
          )}
          {conv.subtitle && (
            <div style={{ color: "#d0e8d0", fontSize: 12 }}>{conv.subtitle}</div>
          )}
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="14" rx="2"/><circle cx="12" cy="11" r="3"/>
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          </svg>
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: "auto", padding: "4px 12px",
        backgroundImage: wallpaperSvg,
        backgroundSize: "320px 470px",
        backgroundRepeat: "repeat",
      }}>
        {conv.messages.length === 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0", marginTop: 8 }}>
              <div style={{
                background: "#e2ddd5", borderRadius: 8, padding: "5px 12px",
                fontSize: 12.5, color: "#54656f",
                boxShadow: "0 1px 0.5px rgba(11,20,26,0.06)",
              }}>Envie uma mensagem para iniciar a conversa</div>
            </div>
            <EncryptionCard />
          </>
        )}
        {conv.messages.map((msg, idx) => {
          if (msg.type === "date") {
            const isFirstDate = !conv.messages.slice(0, idx).some(m => m.type === "date");
            const needsEncCard = isFirstDate && conversation !== "jonatan" && !conv.messages.some(m => m.type === "encryption");
            if (needsEncCard) return [
              <DateSeparator key={msg.id} text={msg.text} />,
              <EncryptionCard key={`enc-${msg.id}`} />,
            ];
            return <DateSeparator key={msg.id} text={msg.text} />;
          }
          if (msg.type === "encryption") return <EncryptionCard key={msg.id} variant={conversation === "jonatan" ? "crushzap" : undefined} />;
          if (msg.type === "call") return <CallStatusMessage key={msg.id} msg={msg} />;
          return <MessageBubble key={msg.id} msg={msg} contactPhoto={AVATARS[conv.id]} contactName={conv.name} onPaid={runPostPixMessages} onTxCreated={(tx) => {
            setConversations(prev =>
              prev.map(c => c.id === conversation
                ? { ...c, messages: c.messages.map(m => m.id === msg.id ? { ...m, pixTx: tx } : m) }
                : c)
            );
          }} />;
        })}
        {isTyping && <TypingIndicator />}
        {isRecording && <RecordingIndicator />}
        <div ref={messagesEnd} />
      </div>

      <div style={{
        display: "flex", alignItems: "center", padding: "4px 6px", gap: 5, background: T.composerBg,
      }}>
        <div style={{
          width: 36, height: 36, display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", flexShrink: 0,
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#54656f" strokeWidth="1.4"/>
            <circle cx="8.5" cy="10.5" r="1.2" fill="#54656f"/>
            <circle cx="15.5" cy="10.5" r="1.2" fill="#54656f"/>
            <path d="M8.5 14.5c0 0 1.5 2 3.5 2s3.5-2 3.5-2" stroke="#54656f" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          background: "#fff", borderRadius: 21, padding: "7px 12px",
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Mensagem"
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: T.textPrimary, fontSize: 16,
            }}
          />
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginLeft: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </div>
        <button onClick={sendMessage} style={{
          background: T.fabBg, border: "none", borderRadius: "50%",
          width: 46, height: 46, display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", flexShrink: 0,
        }}>
          {input.trim() ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
