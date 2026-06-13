import { useState, useEffect, useRef } from "react";
import { CALL_MEDIA } from "../data/scripts.js";

export function VideoCallScreen({ callerName, callerAvatar, onDecline, onCallEnd, videoSrc }) {
  const [phase, setPhase] = useState("ringing");
  const [timer, setTimer] = useState(0);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === "ringing") {
      try {
        const audio = new Audio(CALL_MEDIA.ringtone);
        audio.loop = true;
        audio.volume = 1;
        audio.play().catch(() => {});
        audioRef.current = audio;
      } catch(e) {}
      return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "active") {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [phase]);

  const handleAnswer = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
    setPhase("active");
  };

  const handleDecline = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    onDecline();
  };

  const handleHangup = () => {
    if (videoRef.current) videoRef.current.pause();
    clearInterval(timerRef.current);
    onCallEnd(timer);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  if (phase === "ringing") {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
        background: "#0d1117", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between", padding: "64px 0",
      }}>
        {/* Pré-carrega o vídeo silenciosamente durante o toque */}
        <video
          ref={videoRef}
          src={videoSrc || CALL_MEDIA.video}
          preload="auto"
          muted
          playsInline
          style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        />
        <div />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 140, height: 140, borderRadius: "50%", padding: 6,
            border: "3px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center",
            animation: "callPulse 1.5s ease-out infinite",
          }}>
            <img src={callerAvatar} style={{ width: 128, height: 128, borderRadius: "50%", objectFit: "cover" }} />
          </div>
          <span style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginTop: 8 }}>{callerName} 💋</span>
          <span style={{ color: "#9ca3af", fontSize: 14 }}>está te ligando...</span>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
                animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, width: "100%", padding: "0 32px" }}>
          <button onClick={handleDecline} style={{
            flex: 1, padding: "16px 0", borderRadius: 16, background: "#ef4444",
            border: "none", color: "#fff", fontSize: 16, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>✕</span> Recusar
          </button>
          <button onClick={handleAnswer} style={{
            flex: 1, padding: "16px 0", borderRadius: 16, background: "#22c55e",
            border: "none", color: "#fff", fontSize: 16, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>🎥</span> Atender
          </button>
        </div>
        <style>{`
          @keyframes callPulse {
            0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.7); }
            100% { box-shadow: 0 0 0 20px rgba(34,197,94,0); }
          }
          @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-5px); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
      background: "#000",
    }}>
      <video
        ref={videoRef}
        src={videoSrc || CALL_MEDIA.video}
        playsInline
        onEnded={handleHangup}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 10,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <img src={callerAvatar} style={{
          width: 40, height: 40, borderRadius: "50%", objectFit: "cover",
          border: "2px solid rgba(255,255,255,0.6)",
        }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{callerName}</span>
          <span style={{ color: "#fff", fontSize: 12, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{formatTime(timer)}</span>
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: 40, left: 0, right: 0, zIndex: 10,
        display: "flex", justifyContent: "center", gap: 24,
      }}>
        {["🎤", "📹", "⛶"].map((icon, i) => (
          <div key={i} style={{
            width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, cursor: "pointer",
          }}>{icon}</div>
        ))}
        <div onClick={handleHangup} style={{
          width: 48, height: 48, borderRadius: "50%", background: "#ef4444",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, cursor: "pointer",
        }}>📞</div>
      </div>
    </div>
  );
}
