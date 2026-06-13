import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { T } from "../constants/theme.js";
import { STATUS_DATA } from "../data/statuses.js";
import { CHANNELS, SUGGESTED_CHANNELS, OFFICIAL_POSTS, PACK_CHANNEL, PACK_POSTS } from "../data/channels.js";
import { Avatar } from "../components/ui/Avatar.jsx";
import { BottomTabs } from "../components/ui/BottomTabs.jsx";

const GREEN = "#10B981";

/* ── Data dinâmica dos posts ── */
function getAppStart() {
  try {
    const stored = localStorage.getItem("cz_start");
    if (stored) return parseInt(stored, 10);
    const now = Date.now();
    localStorage.setItem("cz_start", String(now));
    return now;
  } catch {
    return Date.now();
  }
}

const APP_START = getAppStart();

function timeLabel(daysAgo) {
  if (daysAgo == null) return "";
  const total = daysAgo + Math.floor((Date.now() - APP_START) / 86400000);
  if (total === 0) return "Hoje";
  if (total === 1) return "Ontem";
  return `${total} dias`;
}

/* ── VIP Popup ── */
function ChannelModal({ channel, onClose, onTabChange }) {
  return createPortal(
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.72)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 24px",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#ffffff", borderRadius: 20, padding: "28px 24px 24px",
        width: "100%", maxWidth: 320, position: "relative",
        textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        fontFamily: "'Poppins', system-ui, sans-serif",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14,
          background: "#f0f0f0", border: "none", borderRadius: "50%",
          width: 30, height: 30, color: "#555", fontSize: 16, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>

        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "#f0f0f0", margin: "0 auto 16px",
          overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {channel.photo
            ? <img src={channel.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 28 }}>{channel.emoji}</span>
          }
        </div>

        <div style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 10 }}>
          Modelo Verificada ✨
        </div>

        <div style={{ fontSize: 14, fontWeight: 400, color: "#444", lineHeight: 1.6, marginBottom: 22 }}>
          <strong>O conteúdo privado</strong> é liberado pela própria modelo apenas para seus assinantes. Acesse o link para desbloquear e encontrar o seu par perfeito! 🔥
        </div>

        <button onClick={() => { onClose(); onTabChange("chats"); }} style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none",
          background: GREEN, color: "#fff", fontSize: 15, fontWeight: 700,
          cursor: "pointer", letterSpacing: 0.2,
        }}>
          Acessar VIP agora
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ── Visualizador de Status (multi-item) ── */
const POPPINS = "'Poppins', system-ui, sans-serif";

function StatusViewer({ status, onClose }) {
  const items = status.items || [{ type: "photo", src: status.photo, time: "8h" }];
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  const current = items[index];

  const advance = () => {
    cancelAnimationFrame(rafRef.current);
    if (index + 1 < items.length) {
      setIndex(i => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const startTimer = (ms) => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    const tick = (now) => {
      const pct = Math.min((now - startRef.current) / ms, 1);
      setProgress(pct);
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        advance();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    setProgress(0);
    if (current.type === "photo") startTimer(10000);
    return () => cancelAnimationFrame(rafRef.current);
  }, [index]);

  return createPortal(
    <div style={{
      position: "fixed", inset: 0, zIndex: 3000,
      background: "#000", display: "flex", flexDirection: "column",
    }}>
      {/* Barrinhas de progresso */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 2,
        padding: "10px 12px 0",
        display: "flex", gap: 4,
      }}>
        {items.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3,
            background: "rgba(255,255,255,0.3)", borderRadius: 2, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", background: "#fff", borderRadius: 2,
              width: i < index ? "100%" : i === index ? `${progress * 100}%` : "0%",
            }} />
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{
        position: "absolute", top: 20, left: 0, right: 0, zIndex: 2,
        display: "flex", alignItems: "center", gap: 10, padding: "0 12px",
        fontFamily: POPPINS,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%", overflow: "hidden",
          border: "2px solid #fff", flexShrink: 0,
        }}>
          <img src={status.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>
            {status.name.replace("\n", " ")}
          </div>
          <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 12, fontWeight: 400 }}>
            {current.time}
          </div>
        </div>
        <button onClick={onClose} style={{
          marginLeft: "auto", background: "none", border: "none",
          color: "#fff", fontSize: 22, cursor: "pointer", lineHeight: 1, padding: 6,
        }}>✕</button>
      </div>

      {/* Conteúdo */}
      {current.type === "photo" && (
        <img src={current.src} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      )}
      {current.type === "video" && (
        <video
          key={current.src}
          src={current.src}
          autoPlay
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          onLoadedMetadata={(e) => startTimer(e.target.duration * 1000)}
          onEnded={advance}
        />
      )}
    </div>,
    document.body
  );
}

/* ── Player de vídeo com Intersection Observer (autoplay no viewport) ── */
function VideoPost({ src, crop }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {}); else v.pause();
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", aspectRatio: "9/16", background: "#000", borderRadius: "8px 8px 0 0", overflow: "hidden" }}>
      <video
        ref={videoRef}
        src={src}
        playsInline
        loop
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...(crop && { transform: "scale(1.43)" }) }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div onClick={togglePlay} style={{ position: "absolute", inset: 0, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        {!playing && (
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Feed genérico de canal ── */
function ChannelFeedView({ onBack, channel, posts }) {
  const feedRef = useRef(null);

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    const delay = setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 300);
    return () => clearTimeout(delay);
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.chatBg }}>
      {/* Header */}
      <div style={{
        background: T.chatHeaderBg, padding: "6px 10px",
        display: "flex", alignItems: "center", gap: 10, minHeight: 56,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer", padding: "4px 4px",
          display: "flex", alignItems: "center",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: channel.bg || "#111",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0, overflow: "hidden",
        }}>
          {channel.photo
            ? <img src={channel.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span>{channel.emoji}</span>
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 600, display: "block",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {channel.name}
          </span>
          <div style={{ color: "#d0e8d0", fontSize: 12 }}>{channel.followers}</div>
        </div>

        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          </svg>
        </div>
      </div>

      {/* Feed */}
      <div ref={feedRef} style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {posts.map((post) => (
          <div key={post.id} style={{ margin: "6px 12px 4px" }}>
            <div style={{
              background: "#fff", borderRadius: "8px 8px 8px 0",
              boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
              overflow: "hidden", maxWidth: 340,
            }}>
              {post.video && <VideoPost src={post.video} crop={post.crop} />}
              {post.photo && (
                <img src={post.photo} style={{
                  width: "100%", display: "block",
                  maxHeight: 260, objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
                }} />
              )}
              <div style={{ padding: "10px 12px 6px", fontSize: 14.5, color: "#111", lineHeight: 1.45, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {post.segments
                  ? post.segments.map((seg, i) => (
                      <span key={i} style={seg.bold ? { fontWeight: 700 } : undefined}>{seg.text}</span>
                    ))
                  : post.text
                }
              </div>
              <div style={{
                padding: "4px 12px 8px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{
                  background: "#f0f0f0", borderRadius: 20,
                  padding: "3px 10px", display: "flex", alignItems: "center", gap: 5, fontSize: 12,
                }}>
                  <span>{post.reactions.emojis}</span>
                  <span style={{ color: "#555", fontWeight: 500 }}>{post.reactions.count}</span>
                  <span style={{ color: "#bbb", margin: "0 2px" }}>·</span>
                  <span style={{ color: "#555" }}>↗ {post.shares}</span>
                </div>
                <span style={{ fontSize: 11, color: "#8696a0" }}>{post.time ?? timeLabel(post.daysAgo)}</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

/* ── View Principal ── */
export function UpdatesView({ activeTab, onTabChange, unreadCount, purchasedChannels, tutorialOpenPack }) {
  const dragRef = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showFeed, setShowFeed] = useState(false);
  const [showPackFeed, setShowPackFeed] = useState(false);
  const [viewingStatus, setViewingStatus] = useState(null);

  const onDragStart = (e) => {
    const d = dragRef.current;
    d.isDown = true;
    d.startX = e.pageX - e.currentTarget.offsetLeft;
    d.scrollLeft = e.currentTarget.scrollLeft;
    e.currentTarget.style.cursor = "grabbing";
  };
  const onDragEnd = (e) => {
    dragRef.current.isDown = false;
    e.currentTarget.style.cursor = "grab";
  };
  const onDragMove = (e) => {
    const d = dragRef.current;
    if (!d.isDown) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    e.currentTarget.scrollLeft = d.scrollLeft - (x - d.startX);
  };

  if (showPackFeed || (tutorialOpenPack && purchasedChannels?.pack)) {
    return <ChannelFeedView
      onBack={tutorialOpenPack ? () => {} : () => setShowPackFeed(false)}
      channel={PACK_CHANNEL}
      posts={PACK_POSTS}
    />;
  }

  if (showFeed) {
    return <ChannelFeedView
      onBack={() => setShowFeed(false)}
      channel={{ ...SUGGESTED_CHANNELS[0], followers: "135 mil seguidores" }}
      posts={OFFICIAL_POSTS}
    />;
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{
        padding: "14px 16px 6px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: T.textPrimary, fontSize: 24, fontWeight: 700 }}>Atualizações</span>
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
        <div style={{ padding: "12px 16px 4px" }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary }}>Status</span>
        </div>

        <div style={{
          display: "flex", gap: 8, padding: "8px 16px 16px",
          overflowX: "auto", WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none", msOverflowStyle: "none",
          cursor: "grab", userSelect: "none",
        }}
          onWheel={(e) => { e.currentTarget.scrollLeft += e.deltaY; }}
          onMouseDown={onDragStart}
          onMouseLeave={onDragEnd}
          onMouseUp={onDragEnd}
          onMouseMove={onDragMove}
        >
          {STATUS_DATA.map((s) => (
            <div key={s.id} onClick={() => {
              if (s.id === "me" && purchasedChannels?.pack) {
                setViewingStatus(s);
              } else {
                setSelectedChannel({ photo: s.photo, name: s.name });
              }
            }} style={{
              width: 110, minWidth: 110, height: 160, borderRadius: 14,
              background: s.bg, position: "relative", cursor: "pointer",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              overflow: "hidden", flexShrink: 0,
              border: s.isMe ? "1.5px solid #e0e0e0" : "none",
            }}>
              {s.photo && (
                <img src={s.photo} style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  objectFit: "cover",
                }} />
              )}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "linear-gradient(transparent 40%, rgba(0,0,0,0.5) 100%)",
              }} />
              {!s.photo && (
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)", fontSize: 36,
                }}>{s.emoji}</div>
              )}
              <div style={{ padding: "6px 8px", position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: 12, color: "#fff", fontWeight: 500, lineHeight: 1.2, whiteSpace: "pre-line" }}>
                  {s.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 16px 4px",
        }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary }}>Conteúdos</span>
          <button style={{
            background: "none", border: "1.5px solid #e0e0e0", borderRadius: 20,
            padding: "6px 18px", fontSize: 14, color: T.green, fontWeight: 500, cursor: "pointer",
          }}>Descobrir</button>
        </div>

        <div style={{ paddingTop: 4 }}>
          {CHANNELS.map((ch) => (
            <div key={ch.id} onClick={() => {
              if (ch.id === "pack" && purchasedChannels?.pack) {
                setShowPackFeed(true);
              } else {
                setSelectedChannel(ch);
              }
            }} style={{
              display: "flex", alignItems: "center", padding: "10px 16px",
              gap: 14, cursor: "pointer",
            }}>
              <Avatar emoji={ch.emoji} size={52} bg={ch.bg} photo={ch.photo} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{
                    color: T.textPrimary, fontSize: 16, fontWeight: 400,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{ch.name}</span>
                  <span style={{ color: ch.unread > 0 ? T.unreadBadge : T.textSecondary, fontSize: 12, flexShrink: 0, marginLeft: 8 }}>
                    {ch.time}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    color: T.textSecondary, fontSize: 14,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
                  }}>{ch.lastMsg}</span>
                  {ch.unread > 0 && (
                    <div style={{
                      background: T.unreadBadge, color: "#fff", borderRadius: 12,
                      minWidth: 22, height: 22, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 12, fontWeight: 600, padding: "0 5px",
                      marginLeft: 8, flexShrink: 0,
                    }}>{ch.unread}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 16px 6px" }}>
          <span style={{ fontSize: 14, color: T.green }}>Encontrar garotas para acompanhar</span>
        </div>

        {SUGGESTED_CHANNELS.map((ch) => (
          <div key={ch.id} onClick={() => setShowFeed(true)} style={{
            display: "flex", alignItems: "center", padding: "10px 16px", gap: 14, cursor: "pointer",
          }}>
            <Avatar emoji={ch.emoji} size={52} bg={ch.bg} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ color: T.textPrimary, fontSize: 16 }}>{ch.name}</span>
              <div style={{ color: T.textSecondary, fontSize: 13, marginTop: 1 }}>{ch.followers}</div>
            </div>
            <button style={{
              background: T.unreadBadge, color: "#fff", border: "none",
              borderRadius: 20, padding: "7px 18px", fontSize: 14,
              fontWeight: 600, cursor: "pointer",
            }}>Seguir</button>
          </div>
        ))}

        <div style={{ height: 80 }} />
      </div>

      <div style={{
        position: "absolute", bottom: 76, right: 16,
        display: "flex", flexDirection: "column", gap: 12, alignItems: "center",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%", background: T.inputBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)", cursor: "pointer",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: T.fabBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)", cursor: "pointer",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
            <path d="M17 7v4M15 9h4" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      <BottomTabs activeTab={activeTab} onTabChange={onTabChange} unreadCount={unreadCount} />

      {selectedChannel && (
        <ChannelModal
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
          onTabChange={onTabChange}
        />
      )}

      {viewingStatus && (
        <StatusViewer
          status={viewingStatus}
          onClose={() => setViewingStatus(null)}
        />
      )}
    </div>
  );
}
