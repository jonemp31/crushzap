import { useState, useEffect, useRef, useMemo } from "react";
import { DoubleCheck } from "../ui/DoubleCheck.jsx";

const BAR_COUNT = 32;

function seedRandom(seed, index) {
  const x = Math.sin(seed * 9301 + index * 49297 + 826) * 233280;
  return x - Math.floor(x);
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function VoiceMessage({ msg, isSent, contactPhoto }) {
  const [playing, setPlaying]       = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const audioRef = useRef(null);

  // Fixed heights — seeded by id so they never change on re-render
  const barHeights = useMemo(() => {
    const seed = typeof msg.id === "number" ? msg.id : 42;
    return Array.from({ length: BAR_COUNT }, (_, i) => {
      const r = seedRandom(seed, i);
      // Bias toward mid-heights for a natural waveform look
      return 4 + Math.pow(r, 0.7) * 20;
    });
  }, [msg.id]);

  useEffect(() => {
    if (!msg.audio) return;
    const audio = new Audio(msg.audio);
    audioRef.current = audio;

    const onMeta = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnd  = () => { setPlaying(false); setCurrentTime(0); };

    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audio.src = "";
    };
  }, [msg.audio]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const progress  = duration > 0 ? currentTime / duration : 0;
  const activeBar = Math.floor(progress * BAR_COUNT);
  const accent    = isSent ? "#25d366" : "#53bdeb";
  const hasAudio  = !!msg.audio;

  const staticDuration = msg.duration || (duration ? formatTime(duration) : "0:00");
  const leftLabel = (playing || currentTime > 0) ? formatTime(currentTime) : staticDuration;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 230, padding: "3px 0" }}>

      {/* ── Play / Pause button ── */}
      <div
        onClick={hasAudio ? togglePlay : undefined}
        style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "#8696a0",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, cursor: hasAudio ? "pointer" : "default",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      >
        {playing ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
            <rect x="5" y="3" width="5" height="18" rx="1.5"/>
            <rect x="14" y="3" width="5" height="18" rx="1.5"/>
          </svg>
        ) : (
          <svg width="13" height="15" viewBox="0 0 13 16" fill="#fff" style={{ marginLeft: 2 }}>
            <path d="M1.5 1.2l10 6.3-10 6.3V1.2z"/>
          </svg>
        )}
      </div>

      {/* ── Waveform + timer ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        {/* Bars row */}
        <div
          onClick={hasAudio ? handleSeek : undefined}
          style={{
            display: "flex", alignItems: "center", gap: 2,
            height: 28, cursor: hasAudio ? "pointer" : "default",
          }}
        >
          {barHeights.map((h, i) => {
            const isPlayed = i < activeBar;
            const isDot    = i === activeBar;

            if (isDot) {
              return (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: accent, flexShrink: 0, alignSelf: "center",
                  boxShadow: `0 0 3px ${accent}88`,
                }} />
              );
            }
            return (
              <div key={i} style={{
                width: 2.5,
                height: h,
                borderRadius: 2,
                background: isPlayed ? accent : (isSent ? "#a8d5a2" : "#c0d8e8"),
                flexShrink: 0,
                transition: "background 0.06s",
              }} />
            );
          })}
        </div>

        {/* Timer + timestamp na mesma linha */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11.5, color: "#667781", fontVariantNumeric: "tabular-nums" }}>
              {leftLabel}
            </span>
            {(playing || currentTime > 0) && (
              <span style={{ fontSize: 11.5, color: "#a8b5bc", fontVariantNumeric: "tabular-nums" }}>
                / {staticDuration}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 11, color: "#667781" }}>{msg.time}</span>
            {isSent && <DoubleCheck read={msg.read} />}
          </div>
        </div>
      </div>

      {/* ── Avatar com mic badge ── */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "#dfe5e7", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}>
          {contactPhoto
            ? <img src={contactPhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 20 }}>🎤</span>
          }
        </div>
        {/* Mic badge */}
        <div style={{
          position: "absolute", bottom: -1, right: -1,
          width: 17, height: 17, borderRadius: "50%",
          background: accent,
          border: "2px solid #fff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="8" height="10" viewBox="0 0 10 13" fill="#fff">
            <rect x="3" y="0" width="4" height="7" rx="2"/>
            <path d="M1.5 5.5c0 1.9 1.6 3.5 3.5 3.5s3.5-1.6 3.5-3.5"
              stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <line x1="5" y1="9" x2="5" y2="12"
              stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

    </div>
  );
}
