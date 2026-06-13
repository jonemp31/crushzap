export function ReplyBlock({ reply, isSent }) {
  return (
    <div style={{
      background: isSent ? "rgba(0,0,0,0.05)" : "#f0efe9",
      borderLeft: "4px solid #06cf9c", borderRadius: "4px",
      padding: "4px 8px", marginBottom: 3, minHeight: 32,
    }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#06cf9c", lineHeight: 1.3 }}>{reply.sender}</div>
      <div style={{ fontSize: 13, color: "#667781", lineHeight: 1.3, marginTop: 1 }}>{reply.text}</div>
    </div>
  );
}
