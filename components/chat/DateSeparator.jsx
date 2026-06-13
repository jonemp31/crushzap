export function DateSeparator({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
      <div style={{
        background: "#e2ddd5", borderRadius: 8, padding: "5px 12px",
        fontSize: 12.5, color: "#54656f", fontWeight: 500,
        boxShadow: "0 1px 0.5px rgba(11,20,26,0.06)",
      }}>{text}</div>
    </div>
  );
}
