export function DoubleCheck({ read }) {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" style={{ marginLeft: 3, flexShrink: 0 }}>
      <path d="M0.5 5.5L3.5 8.5L10.5 1.5" stroke={read ? "#53bdeb" : "#8696a0"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 5.5L7.5 8.5L14.5 1.5" stroke={read ? "#53bdeb" : "#8696a0"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
