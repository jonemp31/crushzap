import { T } from "../../constants/theme.js";
import { DoubleCheck } from "../ui/DoubleCheck.jsx";
import { ReplyBlock } from "./ReplyBlock.jsx";
import { VoiceMessage } from "./VoiceMessage.jsx";
import { VideoMessage } from "./VideoMessage.jsx";
import { SlideshowMessage } from "./SlideshowMessage.jsx";
import { PixMessage } from "./PixMessage.jsx";

export function MessageBubble({ msg, contactPhoto, contactName, onPaid, onTxCreated }) {
  const isSent      = msg.sent;
  const isVoice     = msg.type === "voice";
  const isPix       = msg.type === "pix";
  const isImage     = !!msg.image;
  const isVideo     = !!msg.video;
  const isSlideshow = !!msg.slideshow;
  return (
    <div style={{
      display: "flex", justifyContent: isSent ? "flex-end" : "flex-start",
      paddingLeft: isSent ? 50 : 0, paddingRight: isSent ? 0 : 50, marginBottom: 2,
    }}>
      <div style={{
        background: isSent ? T.bubbleSent : T.bubbleReceived, color: T.textPrimary,
        borderRadius: isSent ? "7.5px 7.5px 0 7.5px" : "7.5px 7.5px 7.5px 0",
        padding: (isImage || isVideo || isSlideshow || isPix) ? "3px 3px 2px" : isVoice ? "4px 6px 2px" : "4px 7px 5px",
        maxWidth: "85%", minWidth: isVoice ? 240 : isPix ? 246 : 0,
        boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
        overflow: "hidden",
      }}>
        {msg.sender && (
          <div style={{
            color: ["#e06055", "#53bdeb", "#d4a03c", "#1fa855", "#ab47bc", "#e67e22"][msg.sender.charCodeAt(0) % 6],
            fontSize: 13, fontWeight: 600, marginBottom: 1, lineHeight: 1.35,
          }}>{msg.sender}</div>
        )}
        {msg.reply && <ReplyBlock reply={msg.reply} isSent={isSent} />}
        {isImage ? (
          <div style={{ position: "relative", minWidth: 200 }}>
            <img
              src={msg.image}
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
              style={{
                width: "100%", maxWidth: 280, minHeight: 160,
                borderRadius: 5, display: "block",
                objectFit: "cover",
              }}
            />
            <div style={{
              display: "none", width: 280, height: 200, borderRadius: 5,
              background: "#e0ddd5", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 6,
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#b5b3ab">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <span style={{ fontSize: 12, color: "#8696a0" }}>📷 Foto</span>
            </div>
            <div style={{
              position: "absolute", bottom: 4, right: 6,
              background: "rgba(0,0,0,0.45)", borderRadius: 8,
              padding: "1px 6px", display: "flex", alignItems: "center", gap: 3,
            }}>
              <span style={{ fontSize: 11, color: "#fff" }}>{msg.time}</span>
              {isSent && <DoubleCheck read={msg.read} />}
            </div>
          </div>
        ) : isPix ? (
          <PixMessage msg={msg} contactPhoto={contactPhoto} contactName={contactName} onPaid={onPaid} savedTx={msg.pixTx} onTxCreated={onTxCreated} />
        ) : isSlideshow ? (
          <SlideshowMessage msg={msg} isSent={isSent} />
        ) : isVideo ? (
          <VideoMessage msg={msg} isSent={isSent} />
        ) : isVoice ? (
          <VoiceMessage msg={msg} isSent={isSent} contactPhoto={contactPhoto} />
        ) : (
          <div style={{ display: "inline" }}>
            <span style={{ fontSize: 14.5, lineHeight: 1.32, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{msg.text}</span>
            <span style={{
              fontSize: 11, color: "#667781", float: "right", marginLeft: 8, marginTop: 1,
              display: "inline-flex", alignItems: "center", flexShrink: 0, position: "relative", top: 4,
            }}>
              {msg.time}
              {isSent && <DoubleCheck read={msg.read} />}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
