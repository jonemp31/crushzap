export function Avatar({ emoji, size = 50, bg = "#dfe5e7", photo }) {
  if (photo) {
    return (
      <img src={photo} style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        objectFit: "cover",
      }} />
    );
  }
  if (emoji === "cz") {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: bg, display: "flex", alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: size * 0.36, lineHeight: 1, letterSpacing: "-0.5px" }}>
          <span style={{ color: "#ffffff" }}>c</span>
          <span style={{ color: "#25D366" }}>z</span>
        </span>
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: size * 0.45,
    }}>
      {emoji}
    </div>
  );
}
