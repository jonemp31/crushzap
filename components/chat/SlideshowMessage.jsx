import { useState, useEffect, useRef } from "react";
import { DoubleCheck } from "../ui/DoubleCheck.jsx";

export function SlideshowMessage({ msg, isSent }) {
  const [current, setCurrent] = useState(0);
  const [sw, setSw] = useState(280);
  const [done, setDone] = useState(false);
  const wrapRef = useRef(null);
  const stepRef = useRef(0);
  const intervalRef = useRef(null);
  const images = msg.slideshow;
  const total = images.length;

  useEffect(() => {
    if (wrapRef.current) setSw(wrapRef.current.offsetWidth);

    intervalRef.current = setInterval(() => {
      stepRef.current += 1;
      if (stepRef.current >= total) {
        setCurrent(0);
        setDone(true);
        clearInterval(intervalRef.current);
      } else {
        setCurrent(stepRef.current);
      }
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [total]);

  // Snap back to first frame when cycle ends, no slide animation
  const noTransition = done && current === 0;

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={wrapRef}
        style={{ overflow: "hidden", borderRadius: 5, maxWidth: 280, width: "100%" }}
      >
        <div style={{
          display: "flex",
          transform: `translateX(${-current * sw}px)`,
          transition: noTransition ? "none" : "transform 0.45s ease",
        }}>
          {images.map((url, i) => (
            <img
              key={i}
              src={url}
              style={{
                width: sw, minWidth: sw, height: 220,
                objectFit: "cover", display: "block", flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{
        position: "absolute", bottom: 26, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 4, pointerEvents: "none",
      }}>
        {images.map((_, i) => (
          <div key={i} style={{
            width: i === current ? 8 : 5, height: 5, borderRadius: 3,
            background: i === current ? "#fff" : "rgba(255,255,255,0.5)",
            transition: "width 0.3s ease, background 0.3s ease",
          }} />
        ))}
      </div>

      {/* Timestamp overlay */}
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
