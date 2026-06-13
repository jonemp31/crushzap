export function EncryptionCard({ variant }) {
  const text = variant === "crushzap"
    ? "O CrushZap é um aplicativo de relacionamento criado para conectar pessoas próximas com interesses em comum. Suas mensagens e ligações são privadas, protegidas por criptografia e mantidas em sigilo, garantindo mais segurança e privacidade para todos os usuários. Ao usar nosso aplicativo, você concorda com os nossos Termos de Uso."
    : "As mensagens e ligações são privadas, protegidas por criptografia e apagadas após cada conversa. Somente os participantes podem ler, ouvir ou visualizar esse conteúdo.";

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4px 16px 10px" }}>
      <div style={{
        background: "#fdf4c5", borderRadius: 8, padding: "10px 14px",
        fontSize: 12.5, color: "#54656f", lineHeight: 1.45,
        textAlign: "center", maxWidth: 340,
        boxShadow: "0 1px 0.5px rgba(11,20,26,0.06)",
      }}>
        <span>🔒 </span>
        {text}
        <span style={{ fontWeight: 700 }}> Saiba mais</span>
      </div>
    </div>
  );
}
