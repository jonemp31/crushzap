import { useState, useRef } from "react";
import { DoubleCheck } from "../ui/DoubleCheck.jsx";

export function VideoMessage({ msg, isSent }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleClick = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleEnded = () => {
    const v = videoRef.current;
    if (v) { v.currentTime = 0; }
    setPlaying(false);
  };

  return (
    <div style={{ position: "relative", minWidth: 200, cursor: "pointer" }} onClick={handleClick}>
      <video
        ref={videoRef}
        src={msg.video}
        preload="metadata"
        playsInline
        onEnded={handleEnded}
        style={{ width: "100%", maxWidth: 280, borderRadius: 5, display: "block" }}
      />

      {!playing && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 5,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="20" viewBox="0 0 13 16" fill="#fff" style={{ marginLeft: 3 }}>
              <path d="M1.5 1.2l10 6.3-10 6.3V1.2z"/>
            </svg>
          </div>
        </div>
      )}

      <div style={{
        position: "absolute", bottom: 4, right: 6,
        background: "rgba(0,0,0,0.45)", borderRadius: 8,
        padding: "1px 6px", display: "flex", alignItems: "center", gap: 3,
      }}>
        <span style={{ fontSize: 11, color: "#fff" }}>{msg.time}</span>
        {isSent && <DoubleCheck read={msg.read} />}
      </div>
    </div>
  );
}
