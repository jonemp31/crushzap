export function CallStatusMessage({ msg }) {
  const isMissed = msg.callStatus === "missed";
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
      <div style={{
        background: "#e2ddd5", borderRadius: 8, padding: "5px 12px",
        fontSize: 12.5, color: isMissed ? "#e74c3c" : "#54656f", fontWeight: 500,
        boxShadow: "0 1px 0.5px rgba(11,20,26,0.06)",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        {msg.callStatus === "ended" && <span style={{ fontSize: 13 }}>📹</span>}
        {isMissed && <span style={{ fontSize: 13 }}>📵</span>}
        {msg.text}
        <span style={{ color: "#667781", fontWeight: 400, marginLeft: 4, fontSize: 11 }}>{msg.time}</span>
      </div>
    </div>
  );
}
