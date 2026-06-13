import { useState, useRef, useEffect, useMemo } from "react";

const T = {
  bg: "#ffffff",
  headerBg: "#ffffff",
  chatHeaderBg: "#008069",
  chatBg: "#efeae2",
  bubbleSent: "#d9fdd3",
  bubbleReceived: "#ffffff",
  textPrimary: "#111b21",
  textSecondary: "#667781",
  inputBg: "#f0f2f5",
  borderColor: "#f0f2f5",
  searchBg: "#f0f2f5",
  unreadBadge: "#25d366",
  green: "#008069",
  composerBg: "#f0f2f5",
  fabBg: "#00a884",
};

const CONVERSATIONS = [
  {
    id: "jonatan", name: "Jonatan 2026 (Você)", avatar: "🤳", avatarBg: "#5dade2",
    lastMsg: "✅ https://l.facebook.com/l.php?u=https...", time: "04:20",
    unread: 0, pinned: true, status: "",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Lembrar de checar instâncias amanhã cedo", sent: true, time: "08:00", read: true },
      { id: 3, text: "https://l.facebook.com/l.php?u=https...", sent: true, time: "04:20", read: true },
    ],
  },
  {
    id: "duda", name: "Maria Eduarda", avatar: "🥰", avatarBg: "#f1948a",
    lastMsg: "", time: "18:19", unread: 0,
    status: "visto por último hoje às 18:15",
    messages: [],
  },
  {
    id: "numero", name: "Julia Oliveira", avatar: "🧔", avatarBg: "#6b8e7b",
    lastMsg: "Mals a demora irmão", time: "18:30", subtitle: "Conta comercial",
    status: "visto por último hoje às 18:20", unread: 0,
    messages: [
      { id: 1, type: "date", text: "Quarta-feira" },
      { id: 2, text: "pausa ou nao ?", sent: false, time: "14:14" },
      { id: 3, text: "1,76 de CPA maximo", sent: false, time: "14:14" },
      { id: 4, text: "mas hoje ta 5 e pouco ja", sent: false, time: "14:14" },
      { id: 5, text: "duvida cruel nessa parte rola aqui bastante", sent: false, time: "18:39" },
      { id: 6, text: "campanha no dia ta fraca mas no total ta boa", sent: false, time: "18:39" },
      { id: 7, type: "date", text: "Ontem" },
      { id: 8, text: "eae", sent: false, time: "11:00" },
      { id: 9, text: "monto whats hoje", sent: false, time: "11:04" },
      { id: 10, text: "?", sent: false, time: "11:04" },
      { id: 11, text: "Boa noitee", sent: false, time: "22:53" },
      { id: 12, text: "rapaz tem dia que as campanha demora entrega", sent: false, time: "22:53" },
      { id: 13, text: "q loucura kkk", sent: false, time: "22:53" },
      { id: 14, text: "manin", sent: false, time: "23:14" },
      { id: 15, text: "qual banco ta usadno", sent: false, time: "23:14" },
      { id: 16, text: "pra receber pix", sent: false, time: "23:14" },
      { id: 17, text: "?", sent: false, time: "23:14" },
      { id: 18, type: "date", text: "Hoje" },
      { id: 19, text: "bom dia", sent: false, time: "09:04" },
      { id: 20, text: "Opa", sent: true, time: "18:30", read: true },
      { id: 21, text: "Mals a demora irmão", sent: true, time: "18:30", read: true },
    ],
  },
  {
    id: "davi", name: "Luisa Conrado", avatar: "👦", avatarBg: "#82e0aa",
    lastMsg: "Ksskks", time: "14:11", unread: 0, status: "online",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Quero 10 reais disso", sent: true, time: "13:50", read: true },
      { id: 3, text: "Mim de", sent: true, time: "13:50", read: true },
      { id: 4, text: "Sua vó tá bem manim", sent: true, time: "13:50", read: true },
      { id: 5, text: "Seu vo", sent: true, time: "13:50", read: true },
      { id: 6, text: "Sua mãe", sent: true, time: "13:50", read: true },
      { id: 7, text: "Como tá o pessoal aí", sent: true, time: "13:50", read: true },
      { id: 8, text: "Venha pra ca", sent: false, time: "13:52", reply: { sender: "Você", text: "Quero 10 reais disso" } },
      { id: 9, text: "Homi", sent: false, time: "13:53" },
      { id: 10, text: "Ta ss manin", sent: false, time: "13:53", reply: { sender: "Você", text: "Sua vó tá bem manim" } },
      { id: 11, text: "Os dois vendo filme aqui kakaka", sent: false, time: "13:53" },
      { id: 12, type: "voice", sent: false, time: "13:53", duration: "0:18" },
      { id: 13, text: "Ksskks", sent: true, time: "14:11", read: true },
    ],
  },
  {
    id: "isa", name: "Letícia Alves", avatar: "👩", avatarBg: "#bb8fce",
    lastMsg: "o/", time: "09:04", unread: 0, status: "visto por último hoje às 09:10",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "bom diaa jon", sent: false, time: "08:52" },
      { id: 3, text: "está otimo jon, mt obgd 🙏🏾🙏🏾", sent: false, time: "08:52", reply: { sender: "Você", text: "🎤 Mensagem de voz (0:17)" } },
      { id: 4, text: "blzzz", sent: false, time: "08:53", reply: { sender: "Você", text: "🎤 Mensagem de voz (0:57)" } },
      { id: 5, text: "simmm KSKSKSKSKKSKS", sent: false, time: "08:53", reply: { sender: "Você", text: "🎤 Mensagem de voz (1:40)" } },
      { id: 6, text: "realmente jon, tem que delegar as tarefas", sent: false, time: "08:54", reply: { sender: "Você", text: "🎤 Mensagem de voz (1:40)" } },
      { id: 7, text: "é o melhor jeito", sent: false, time: "08:54" },
      { id: 8, text: "ai voce se sobrecarrega tbm", sent: false, time: "08:55", reply: { sender: "Você", text: "🎤 Mensagem de voz (0:55)" } },
      { id: 9, text: "ss", sent: true, time: "09:04", read: true },
      { id: 10, text: "o/", sent: true, time: "09:04", read: true },
    ],
  },
  {
    id: "mohamed", name: "Sandra Neves", avatar: "🧔", avatarBg: "#6b8e7b",
    lastMsg: "Deve converter bem.. mas esses tipo...", time: "14:56",
    unread: 0, status: "online",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "E aí mano, tudo certo?", sent: false, time: "14:20" },
      { id: 3, text: "Suave demais! E vc?", sent: true, time: "14:21", read: true },
      { id: 4, text: "De boa, olha essa oferta aqui que montei", sent: false, time: "14:35" },
      { id: 5, text: "Manda aí, deixa eu ver", sent: true, time: "14:36", read: true },
      { id: 6, text: "Deve converter bem.. mas esses tipos de headline precisam de mais prova social", sent: false, time: "14:56" },
    ],
  },
  {
    id: "eduardo", name: "Mayara Souza", avatar: "😎", avatarBg: "#82e0aa",
    lastMsg: "Como tá aí irmão ?", time: "16:33", unread: 2,
    status: "visto por último hoje às 16:40",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "E aí Jon!", sent: false, time: "16:30" },
      { id: 3, text: "Como tá aí irmão ?", sent: false, time: "16:33" },
    ],
  },
  {
    id: "lucas", name: "Daniela Ferreira", avatar: "🧢", avatarBg: "#5499c7",
    lastMsg: "Mano, olha esse resultado 🔥", time: "15:47", unread: 1,
    status: "online",
    messages: [
      { id: 1, type: "date", text: "Ontem" },
      { id: 2, text: "Fala Lucas, suave?", sent: true, time: "22:10", read: true },
      { id: 3, text: "Suave demais mano", sent: false, time: "22:12" },
      { id: 4, text: "Tô testando umas campanhas novas aqui", sent: false, time: "22:13" },
      { id: 5, text: "Show! Depois me mostra", sent: true, time: "22:15", read: true },
      { id: 6, type: "date", text: "Hoje" },
      { id: 7, text: "Mano, olha esse resultado 🔥", sent: false, time: "15:47" },
    ],
  },
  {
    id: "camila", name: "Camila Santos", avatar: "👩‍🦰", avatarBg: "#e8a87c",
    lastMsg: "Acabei de enviar no seu email", time: "15:30", unread: 0,
    status: "visto por último hoje às 15:32",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Oi Camila, conseguiu finalizar?", sent: true, time: "15:20", read: true },
      { id: 3, text: "Sim sim!", sent: false, time: "15:28" },
      { id: 4, text: "Acabei de enviar no seu email", sent: false, time: "15:30" },
    ],
  },
  {
    id: "fernanda", name: "Fernanda Costa", avatar: "💁‍♀️", avatarBg: "#d4a03c",
    lastMsg: "Perfeito, obrigada! 😊", time: "14:45", unread: 0,
    status: "visto por último hoje às 14:50",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Fê, tá confirmada pra reunião?", sent: true, time: "14:30", read: true },
      { id: 3, text: "Tô sim, 16h né?", sent: false, time: "14:33" },
      { id: 4, text: "Isso!", sent: true, time: "14:35", read: true },
      { id: 5, text: "Perfeito, obrigada! 😊", sent: false, time: "14:45" },
    ],
  },
  {
    id: "beatriz", name: "Beatriz Lima", avatar: "👩‍💼", avatarBg: "#a569bd",
    lastMsg: "Vou te mandar o link agora", time: "13:58", unread: 1,
    status: "online",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Bia, tem aquele documento?", sent: true, time: "13:40", read: true },
      { id: 3, text: "Tenho sim, deixa eu achar aqui", sent: false, time: "13:50" },
      { id: 4, text: "Vou te mandar o link agora", sent: false, time: "13:58" },
    ],
  },
  {
    id: "amanda", name: "Amanda Ribeiro", avatar: "🙋‍♀️", avatarBg: "#76d7c4",
    lastMsg: "Kkkkk verdade", time: "13:22", unread: 0,
    status: "visto por último hoje às 13:25",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Amanda vc viu aquilo? kkkk", sent: true, time: "13:15", read: true },
      { id: 3, text: "Simm kkkkk", sent: false, time: "13:18" },
      { id: 4, text: "Kkkkk verdade", sent: false, time: "13:22" },
    ],
  },
  {
    id: "carolina", name: "Carolina Mendes", avatar: "👱‍♀️", avatarBg: "#f0b27a",
    lastMsg: "Depois te conto tudo", time: "12:40", unread: 0,
    status: "visto por último hoje às 12:45",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Carol! Como foi lá?", sent: true, time: "12:30", read: true },
      { id: 3, text: "Ai foi ótimo!", sent: false, time: "12:35" },
      { id: 4, text: "Depois te conto tudo", sent: false, time: "12:40" },
    ],
  },
  {
    id: "gabriela", name: "Gabriela Pereira", avatar: "👩‍🎤", avatarBg: "#e74c3c",
    lastMsg: "Bora sim!! 🎉", time: "12:10", unread: 0,
    status: "visto por último hoje às 12:15",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Gabi, vamo sair esse fds?", sent: true, time: "12:00", read: true },
      { id: 3, text: "Bora sim!! 🎉", sent: false, time: "12:10" },
    ],
  },
  {
    id: "isabela", name: "Isabela Martins", avatar: "👩‍🏫", avatarBg: "#85c1e9",
    lastMsg: "Tá bom, fico no aguardo então", time: "11:35", unread: 0,
    status: "visto por último hoje às 11:40",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Isa, preciso de um favor", sent: true, time: "11:20", read: true },
      { id: 3, text: "Fala!", sent: false, time: "11:22" },
      { id: 4, text: "Vou te explicar mais tarde, pode ser?", sent: true, time: "11:30", read: true },
      { id: 5, text: "Tá bom, fico no aguardo então", sent: false, time: "11:35" },
    ],
  },
  {
    id: "natalia", name: "Natália Carvalho", avatar: "🧑‍⚕️", avatarBg: "#58d68d",
    lastMsg: "Amanhã eu passo aí", time: "10:50", unread: 0,
    status: "visto por último hoje às 10:55",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Nat, tudo bem?", sent: true, time: "10:40", read: true },
      { id: 3, text: "Tudo ótimo! E vc?", sent: false, time: "10:44" },
      { id: 4, text: "De boa! Preciso te entregar aquilo", sent: true, time: "10:46", read: true },
      { id: 5, text: "Amanhã eu passo aí", sent: false, time: "10:50" },
    ],
  },
  {
    id: "rafaela", name: "Rafaela Araújo", avatar: "💃", avatarBg: "#f1948a",
    lastMsg: "Tô chegando em 10 min", time: "10:15", unread: 0,
    status: "visto por último hoje às 10:20",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Rafa, onde vc tá?", sent: true, time: "10:10", read: true },
      { id: 3, text: "Tô chegando em 10 min", sent: false, time: "10:15" },
    ],
  },
  {
    id: "vanessa", name: "Vanessa Rodrigues", avatar: "👩‍💻", avatarBg: "#af7ac5",
    lastMsg: "Vou testar aqui e te falo", time: "09:48", unread: 0,
    status: "visto por último hoje às 09:50",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Van, aquele bug resolveu?", sent: true, time: "09:30", read: true },
      { id: 3, text: "Ainda não 😩", sent: false, time: "09:35" },
      { id: 4, text: "Tenta limpar o cache", sent: true, time: "09:40", read: true },
      { id: 5, text: "Vou testar aqui e te falo", sent: false, time: "09:48" },
    ],
  },
  {
    id: "priscila", name: "Priscila Barbosa", avatar: "🧕", avatarBg: "#d5a6bd",
    lastMsg: "Obrigada pela ajuda ❤️", time: "09:10", unread: 0,
    status: "visto por último hoje às 09:15",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Pri bom dia! Conseguiu resolver?", sent: true, time: "08:50", read: true },
      { id: 3, text: "Bom dia! Consegui sim", sent: false, time: "09:05" },
      { id: 4, text: "Obrigada pela ajuda ❤️", sent: false, time: "09:10" },
    ],
  },
  {
    id: "tatiane", name: "Tatiane Moreira", avatar: "👩‍🔬", avatarBg: "#7fb3d8",
    lastMsg: "Semana que vem a gente marca", time: "08:30", unread: 0,
    status: "visto por último hoje às 08:35",
    messages: [
      { id: 1, type: "date", text: "Hoje" },
      { id: 2, text: "Tati, bora almoçar hj?", sent: true, time: "08:20", read: true },
      { id: 3, text: "Hj não consigo 😢", sent: false, time: "08:25" },
      { id: 4, text: "Semana que vem a gente marca", sent: false, time: "08:30" },
    ],
  },
  {
    id: "renata", name: "Renata Gomes", avatar: "👩‍🎨", avatarBg: "#f7dc6f",
    lastMsg: "Ficou lindo! Amei 😍", time: "Ontem", unread: 0,
    status: "visto por último ontem às 22:10",
    messages: [
      { id: 1, type: "date", text: "Ontem" },
      { id: 2, text: "Rê, terminei o design", sent: true, time: "21:50", read: true },
      { id: 3, text: "Manda!", sent: false, time: "21:55" },
      { id: 4, text: "📷 Imagem", sent: true, time: "22:00", read: true },
      { id: 5, text: "Ficou lindo! Amei 😍", sent: false, time: "22:05" },
    ],
  },
];

const CALL_MEDIA = {
  video: "https://s3files.autopilots.trade/crushzap/vnew.mp4",
  ringtone: "https://s3files.autopilots.trade/crushzap/ligacao.mp3",
};

const CHAT_PHOTOS = {
  e6: "https://s3files.autopilots.trade/crushzap/e6.jpg",
};

/* ─── CHAT SCRIPTS ─── */
const CHAT_SCRIPTS = {
  duda: [
    {
      // Step 0: First contact - lead sends any message
      messages: [
        { text: "oii, tudo bem? 😊" },
        { text: "qual seu nome?" },
      ],
    },
    {
      // Step 1: Lead replies with their name
      messages: [
        { text: (conv) => {
            const firstName = conv.name.split(" ")[0];
            const age = 18 + Math.floor(Math.random() * 11);
            return `prazer ❤️ eu sou a ${firstName}, tenho ${age} anos`;
          } },
        { text: "ce é de onde?" },
      ],
    },
    {
      // Step 2: Lead replies where they're from
      messages: (conv, geo) => {
        if (geo?.city) {
          return [
            { text: `ahh legal, eu moro aqui em ${geo.city} ${geo.regionCode}` },
            { text: "e me conta" },
            { text: "tá sozinho aí agora? rs" },
          ];
        }
        return [
          { text: "ahh legal, não conheço muito aqui a região" },
          { text: "mas até que não to tão longe kk" },
          { text: "e me conta" },
          { text: "tá sozinho aí agora? rs" },
        ];
      },
    },
    // Step 3, 4... (future steps go here)
    {
      // Step 3: Lead responds if alone — send photo
      messages: [
        { text: "te mandar um presente rs 😏" },
        { image: CHAT_PHOTOS.e6, preDelay: [6, 10] },
        { text: "essa sou eu rs" },
        { text: "oq achou? quer ver mais?" },
        { text: "seja sincero hein kkk 😌🙈" },
      ],
    },
    {
      // Step 4: Lead responds about photo — push to video call
      messages: [
        { text: "gatinho ❤️" },
        { text: "quer me ver ao vivo?", preDelay: [5, 8] },
        { text: "aqui tem chamada de vídeo" },
        { text: "posso te ligar?" },
      ],
    },
    {
      // Step 5: Lead agrees to call — trigger video call
      action: "call",
      delay: 5,
    },
  ],
};

const DECLINE_SCRIPTS = [
  {
    // 1ª recusa
    messages: [
      { text: "uai amor, pq recusou?" },
      { text: "eu sou real viu rs" },
      { text: "vou te ligar agora tá? atende aí ❤️" },
    ],
    retryCall: true,
  },
  {
    // 2ª recusa
    messages: [
      { text: "poxa gatinho, n quer me ver não? rs" },
      { text: "atende aí" },
    ],
    retryCall: true,
  },
  {
    // 3ª recusa
    messages: [
      { text: "oxi rs" },
      { text: "to insistindo pq queria q vc me visse aqui" },
      { text: "de verdade é rapidinho" },
      { text: "prometo, atende?" },
    ],
    retryCall: true,
  },
  {
    // 4ª recusa — desiste
    messages: [
      { text: "entendi" },
      { text: "tá bom então, sem pressão rs" },
      { text: "quando vc puder e quiser me ver" },
      { text: "só me mandar um oi aqui," },
      { text: "tá?" },
      { text: "vou estar por aqui" },
      { text: "se eu n estiver" },
      { text: "qnd entrar vejo as msgs" },
    ],
    retryCall: false,
  },
];

const STATUS_DATA = [
  { id: "me", name: "Adicionar\nstatus", emoji: "🤳", bg: "#5dade2", isMe: true },
  { id: "gustavo", name: "Gustavo cf", emoji: "👨‍👧", bg: "#27ae60", seen: false },
  { id: "eduardo", name: "Eduardo\nLemes", emoji: "😎", bg: "#82e0aa", seen: false },
  { id: "leandro", name: "Leandro\nSouza", emoji: "🕊️", bg: "#8e7b6b", seen: true },
];

const CHANNELS = [
  { id: "pack", name: "Pack de Figurinhas 🦊", emoji: "🐱", bg: "#f5b041", lastMsg: "🟣 Figurinha", time: "18:42", unread: 2 },
  { id: "cruzeiro1", name: "Cruzeiro | Diário Celeste", emoji: "⭐", bg: "#1a5276", lastMsg: "🔗 Cria do Cruzeiro, Cauan Baptistella u...", time: "16:35", unread: 43 },
  { id: "ge", name: "ge.globo | Cruzeiro", emoji: "⚽", bg: "#27ae60", lastMsg: "📷 Visando o futuro! 🦊🤝 Em meio à f...", time: "16:34", unread: 5 },
  { id: "cruzeiro2", name: "Cruzeiro Esporte Clube", emoji: "⭐", bg: "#1a5276", lastMsg: "🔗 https://www.instagram.com/p/DZd...", time: "Ontem", unread: 30 },
];

const SUGGESTED_CHANNELS = [
  { id: "uol", name: "UOL | Cruzeiro Agora ✅", emoji: "⭐", bg: "#1a5276", followers: "135 mil seguidores" },
];

const CALLS = [
  { id: 1, name: "Operação Zaps | Davi", emoji: "⚡", bg: "#27ae60", missed: true, type: "incoming", time: "Hoje 10:38", isVideo: false },
  { id: 2, name: "Davi Conrado (4)", emoji: "👦", bg: "#82e0aa", missed: true, type: "incoming", time: "Hoje 10:34", isVideo: false },
  { id: 3, name: "Duda 🥰", emoji: "🥰", bg: "#f1948a", missed: false, type: "outgoing", time: "Ontem 21:18", isVideo: false },
  { id: 4, name: "work together", emoji: "💼", bg: "#aab7b8", missed: true, type: "incoming", time: "Ontem 07:55", isVideo: true },
  { id: 5, name: "Eduardo Lemes", emoji: "😎", bg: "#82e0aa", missed: false, type: "outgoing", time: "10 de junho 23:39", isVideo: false },
  { id: 6, name: "San", emoji: "👨", bg: "#5dade2", missed: false, type: "incoming", time: "10 de junho 16:46", isVideo: false },
  { id: 7, name: "Bora fica gostoso", emoji: "🍕", bg: "#f5b041", missed: true, type: "incoming", time: "10 de junho 13:50", isVideo: false },
  { id: 8, name: "Davi Conrado", emoji: "👦", bg: "#82e0aa", missed: true, type: "incoming", time: "10 de junho 12:27", isVideo: false },
];

const AVATARS = {
  duda: "https://s3files.autopilots.trade/crushzap/fotoschats/mariaeduada.jpg",
  numero: "https://s3files.autopilots.trade/crushzap/fotoschats/p1.jpg",
  davi: "https://s3files.autopilots.trade/crushzap/fotoschats/9.png",
  isa: "https://s3files.autopilots.trade/crushzap/fotoschats/8.png",
  mohamed: "https://s3files.autopilots.trade/crushzap/fotoschats/7.png",
  eduardo: "https://s3files.autopilots.trade/crushzap/fotoschats/6.png",
  lucas: "https://s3files.autopilots.trade/crushzap/fotoschats/5.png",
  camila: "https://s3files.autopilots.trade/crushzap/fotoschats/4.png",
  fernanda: "https://s3files.autopilots.trade/crushzap/fotoschats/3.png",
  beatriz: "https://s3files.autopilots.trade/crushzap/fotoschats/2.png",
  amanda: "https://s3files.autopilots.trade/crushzap/fotoschats/19.png",
  carolina: "https://s3files.autopilots.trade/crushzap/fotoschats/18.png",
  gabriela: "https://s3files.autopilots.trade/crushzap/fotoschats/17.png",
  isabela: "https://s3files.autopilots.trade/crushzap/fotoschats/16.png",
  natalia: "https://s3files.autopilots.trade/crushzap/fotoschats/14.png",
  rafaela: "https://s3files.autopilots.trade/crushzap/fotoschats/13.png",
  vanessa: "https://s3files.autopilots.trade/crushzap/fotoschats/12.png",
  priscila: "https://s3files.autopilots.trade/crushzap/fotoschats/11.png",
  tatiane: "https://s3files.autopilots.trade/crushzap/fotoschats/10.png",
  renata: "https://s3files.autopilots.trade/crushzap/fotoschats/nova.jpg",
};

/* ─── WALLPAPER ─── */
const wallpaperSvg = `url("data:image/webp;base64,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")`;

/* ─── SHARED COMPONENTS ─── */
function DoubleCheck({ read }) {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" style={{ marginLeft: 3, flexShrink: 0 }}>
      <path d="M0.5 5.5L3.5 8.5L10.5 1.5" stroke={read ? "#53bdeb" : "#8696a0"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 5.5L7.5 8.5L14.5 1.5" stroke={read ? "#53bdeb" : "#8696a0"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#8696a0">
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
    </svg>
  );
}

function Avatar({ emoji, size = 50, bg = "#dfe5e7", photo }) {
  if (photo) {
    return (
      <img src={photo} style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        objectFit: "cover",
      }} />
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

function ChatTabIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c0-1.032-.597-1.646-2.064-1.646z"
        fill={active ? T.green : "none"} stroke={active ? "none" : "#54656f"} strokeWidth="1.5"/>
    </svg>
  );
}

function UpdatesTabIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={active ? "none" : "#54656f"} fill={active ? T.green : "none"} strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3.5" stroke={active ? "#fff" : "#54656f"} fill="none" strokeWidth="1.5"/>
    </svg>
  );
}

/* ─── BOTTOM TABS ─── */
function BottomTabs({ activeTab, onTabChange, unreadCount }) {
  const tabs = [
    { label: "Conversas", id: "chats", count: unreadCount },
    { label: "Atualizações", id: "updates" },
    { label: "Comunidades", id: "communities" },
    { label: "Ligações", id: "calls" },
  ];

  return (
    <div style={{
      display: "flex", borderTop: "1px solid #e9edef",
      background: "#ffffff", padding: "6px 0 10px",
    }}>
      {tabs.map((tab, i) => {
        const isActive = activeTab === tab.id;
        return (
          <div key={i} onClick={() => onTabChange(tab.id)} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3, cursor: "pointer",
          }}>
            <div style={{ position: "relative" }}>
              {isActive ? (
                <div style={{
                  background: "#d8fdd2", borderRadius: 16,
                  padding: "4px 18px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {i === 0 && <ChatTabIcon active />}
                  {i === 1 && <UpdatesTabIcon active />}
                  {i === 2 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={T.green}>
                      <path d="M17 20c0-1.657-2.239-3-5-3s-5 1.343-5 3"/><circle cx="12" cy="10" r="3"/>
                      <path d="M21 17c0-1.1-1.343-2-3-2-.824 0-1.563.293-2.08.75"/><circle cx="18" cy="10" r="2"/>
                      <path d="M3 17c0-1.1 1.343-2 3-2 .824 0 1.563.293 2.08.75"/><circle cx="6" cy="10" r="2"/>
                    </svg>
                  )}
                  {i === 3 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={T.green}>
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  )}
                </div>
              ) : (
                <div style={{ padding: "4px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i === 0 && <ChatTabIcon />}
                  {i === 1 && <UpdatesTabIcon />}
                  {i === 2 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
                      <path d="M17 20c0-1.657-2.239-3-5-3s-5 1.343-5 3"/><circle cx="12" cy="10" r="3"/>
                      <path d="M21 17c0-1.1-1.343-2-3-2-.824 0-1.563.293-2.08.75"/><circle cx="18" cy="10" r="2"/>
                      <path d="M3 17c0-1.1 1.343-2 3-2 .824 0 1.563.293 2.08.75"/><circle cx="6" cy="10" r="2"/>
                    </svg>
                  )}
                  {i === 3 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  )}
                </div>
              )}
              {tab.count > 0 && (
                <div style={{
                  position: "absolute", top: -2, right: isActive ? 2 : -12,
                  background: T.unreadBadge, color: "#fff", borderRadius: 10,
                  minWidth: 20, height: 20, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 11, fontWeight: 700, padding: "0 5px",
                }}>{tab.count}</div>
              )}
            </div>
            <span style={{
              color: isActive ? T.textPrimary : T.textSecondary,
              fontSize: 12, fontWeight: isActive ? 600 : 400,
            }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── UPDATES VIEW ─── */
function UpdatesView({ activeTab, onTabChange, unreadCount }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bg }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px 6px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: T.textPrimary, fontSize: 24, fontWeight: 700 }}>Atualizações</span>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f">
            <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          </svg>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Status section */}
        <div style={{ padding: "12px 16px 4px" }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary }}>Status</span>
        </div>

        <div style={{
          display: "flex", gap: 8, padding: "8px 16px 16px",
          overflowX: "auto", WebkitOverflowScrolling: "touch",
        }}>
          {STATUS_DATA.map((s) => (
            <div key={s.id} style={{
              width: 110, minWidth: 110, height: 160, borderRadius: 14,
              background: s.bg, position: "relative", cursor: "pointer",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              overflow: "hidden", flexShrink: 0,
              border: s.isMe ? "1.5px solid #e0e0e0" : "none",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "linear-gradient(transparent 40%, rgba(0,0,0,0.5) 100%)",
              }} />
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 36,
              }}>
                {s.emoji}
              </div>
              {s.isMe && (
                <div style={{
                  position: "absolute", bottom: 52, right: 8,
                  width: 24, height: 24, borderRadius: "50%",
                  background: T.unreadBadge, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                    <path d="M12 5v14M5 12h14" strokeWidth="2"/>
                  </svg>
                </div>
              )}
              {!s.isMe && !s.seen && (
                <div style={{
                  position: "absolute", top: 4, left: 4, right: 4, bottom: 4,
                  borderRadius: 12, border: "2.5px solid #25d366",
                  pointerEvents: "none",
                }} />
              )}
              <div style={{
                padding: "6px 8px", position: "relative", zIndex: 1,
              }}>
                <span style={{
                  fontSize: 12, color: "#fff", fontWeight: 500,
                  lineHeight: 1.2, whiteSpace: "pre-line",
                }}>{s.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Canais section */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 16px 4px",
        }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary }}>Canais</span>
          <button style={{
            background: "none", border: "1.5px solid #e0e0e0", borderRadius: 20,
            padding: "6px 18px", fontSize: 14, color: T.green,
            fontWeight: 500, cursor: "pointer",
          }}>
            Descobrir
          </button>
        </div>

        <div style={{ paddingTop: 4 }}>
          {CHANNELS.map((ch) => (
            <div key={ch.id} style={{
              display: "flex", alignItems: "center", padding: "10px 16px",
              gap: 14, cursor: "pointer",
            }}>
              <Avatar emoji={ch.emoji} size={52} bg={ch.bg} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{
                    color: T.textPrimary, fontSize: 16, fontWeight: 400,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{ch.name}</span>
                  <span style={{
                    color: ch.unread > 0 ? T.unreadBadge : T.textSecondary,
                    fontSize: 12, flexShrink: 0, marginLeft: 8,
                  }}>{ch.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    color: T.textSecondary, fontSize: 14,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
                  }}>{ch.lastMsg}</span>
                  {ch.unread > 0 && (
                    <div style={{
                      background: T.unreadBadge, color: "#fff", borderRadius: 12,
                      minWidth: 22, height: 22, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 12, fontWeight: 600, padding: "0 5px",
                      marginLeft: 8, flexShrink: 0,
                    }}>{ch.unread}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Encontrar canais */}
        <div style={{ padding: "12px 16px 6px" }}>
          <span style={{ fontSize: 14, color: T.green }}>Encontrar canais para seguir</span>
        </div>

        {SUGGESTED_CHANNELS.map((ch) => (
          <div key={ch.id} style={{
            display: "flex", alignItems: "center", padding: "10px 16px", gap: 14,
          }}>
            <Avatar emoji={ch.emoji} size={52} bg={ch.bg} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ color: T.textPrimary, fontSize: 16 }}>{ch.name}</span>
              <div style={{ color: T.textSecondary, fontSize: 13, marginTop: 1 }}>{ch.followers}</div>
            </div>
            <button style={{
              background: T.unreadBadge, color: "#fff", border: "none",
              borderRadius: 20, padding: "7px 18px", fontSize: 14,
              fontWeight: 600, cursor: "pointer",
            }}>
              Seguir
            </button>
          </div>
        ))}

        <div style={{ height: 80 }} />
      </div>

      {/* FABs */}
      <div style={{
        position: "absolute", bottom: 76, right: 16,
        display: "flex", flexDirection: "column", gap: 12, alignItems: "center",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: T.inputBg, display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)", cursor: "pointer",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: T.fabBg, display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)", cursor: "pointer",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
            <path d="M17 7v4M15 9h4" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      <BottomTabs activeTab={activeTab} onTabChange={onTabChange} unreadCount={unreadCount} />
    </div>
  );
}

/* ─── CALLS VIEW ─── */
function CallsView({ activeTab, onTabChange, unreadCount }) {
  const quickActions = [
    { label: "Ligar", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    )},
    { label: "Programar", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    )},
    { label: "Teclado", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
        <circle cx="7" cy="7" r="1.5"/><circle cx="12" cy="7" r="1.5"/><circle cx="17" cy="7" r="1.5"/>
        <circle cx="7" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17" cy="12" r="1.5"/>
        <circle cx="7" cy="17" r="1.5"/><circle cx="12" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/>
      </svg>
    )},
    { label: "Favoritos", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    )},
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bg }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px 6px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: T.textPrimary, fontSize: 24, fontWeight: 700 }}>Ligações</span>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f">
            <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          </svg>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Quick actions */}
        <div style={{
          display: "flex", justifyContent: "space-around", padding: "16px 12px",
        }}>
          {quickActions.map((a, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: "#f0f2f5",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {a.icon}
              </div>
              <span style={{ fontSize: 13, color: T.textSecondary }}>{a.label}</span>
            </div>
          ))}
        </div>

        {/* Recentes */}
        <div style={{ padding: "8px 16px 4px" }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary }}>Recentes</span>
        </div>

        {CALLS.map((call) => (
          <div key={call.id} style={{
            display: "flex", alignItems: "center", padding: "10px 16px", gap: 14, cursor: "pointer",
          }}>
            <Avatar emoji={call.emoji} size={50} bg={call.bg} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                color: call.missed ? "#e74c3c" : T.textPrimary,
                fontSize: 16, fontWeight: 400, display: "block",
              }}>{call.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={call.type === "outgoing" ? "#25d366" : (call.missed ? "#e74c3c" : "#25d366")}
                  strokeWidth="2.5">
                  {call.type === "outgoing" ? (
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  ) : (
                    <path d="M17 7L7 17M7 17h10M7 17V7"/>
                  )}
                </svg>
                <span style={{ fontSize: 13, color: T.textSecondary }}>{call.time}</span>
              </div>
            </div>
            <div style={{ flexShrink: 0, cursor: "pointer" }}>
              {call.isVideo ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
                  <rect x="2" y="5" width="14" height="14" rx="2"/><path d="M22 7l-6 5 6 5V7z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              )}
            </div>
          </div>
        ))}

        <div style={{ height: 80 }} />
      </div>

      {/* FAB */}
      <div style={{
        position: "absolute", bottom: 76, right: 16,
        width: 56, height: 56, borderRadius: 16,
        background: T.fabBg, display: "flex",
        alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.18)", cursor: "pointer",
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          <path d="M17 1v6M14 4h6" strokeWidth="2"/>
        </svg>
      </div>

      <BottomTabs activeTab={activeTab} onTabChange={onTabChange} unreadCount={unreadCount} />
    </div>
  );
}

/* ─── COMMUNITIES VIEW ─── */
function CommunitiesView({ activeTab, onTabChange, unreadCount }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bg }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px 6px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: T.textPrimary, fontSize: 24, fontWeight: 700 }}>Comunidades</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f">
          <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
        </svg>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        {/* Illustration */}
        <div style={{
          width: 200, height: 200, borderRadius: 24, background: "#e8f5e9",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 28, position: "relative",
        }}>
          <div style={{ fontSize: 48, position: "absolute", top: 30, left: 40 }}>👥</div>
          <div style={{
            width: 80, height: 80, borderRadius: 16, background: "#00a884",
            position: "absolute", bottom: 30, right: 30,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 20, color: "#fff", fontWeight: 700 }}>÷ × + −</span>
          </div>
          <div style={{ fontSize: 36, position: "absolute", bottom: 40, left: 35 }}>🍏</div>
          <div style={{
            position: "absolute", top: 20, right: 40,
            fontSize: 12, color: T.green, transform: "rotate(15deg)",
          }}>✏️</div>
        </div>

        <span style={{
          fontSize: 22, fontWeight: 600, color: T.textPrimary,
          textAlign: "center", lineHeight: 1.3, marginBottom: 14,
        }}>
          Conecte-se com outras pessoas com as comunidades
        </span>

        <span style={{
          fontSize: 15, color: T.textSecondary, textAlign: "center",
          lineHeight: 1.5, marginBottom: 32, maxWidth: 340,
        }}>
          As comunidades permitem reunir pessoas em grupos de assuntos específicos e receber avisos de admins com facilidade. As comunidades das quais você participa serão exibidas nesta tela.
        </span>

        <button style={{
          width: "100%", maxWidth: 340, padding: "14px 0",
          background: T.fabBg, color: "#fff", border: "none",
          borderRadius: 28, fontSize: 16, fontWeight: 600,
          cursor: "pointer", marginBottom: 24,
        }}>
          Criar comunidade
        </button>

        <span style={{
          fontSize: 14, color: T.textSecondary, textAlign: "center",
          lineHeight: 1.5,
        }}>
          Toque no ícone 📋 na aba Conversas para criar uma comunidade.
        </span>
      </div>

      <BottomTabs activeTab={activeTab} onTabChange={onTabChange} unreadCount={unreadCount} />
    </div>
  );
}

/* ─── VOICE MESSAGE BUBBLE ─── */
function VoiceMessage({ msg }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 200 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", background: "#8696a0",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="14" height="16" viewBox="0 0 14 16" fill="#fff"><path d="M1 1l12 7-12 7V1z"/></svg>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2, height: 20 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#25d366", flexShrink: 0 }}/>
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} style={{
              width: 2.5, borderRadius: 1,
              height: 3 + Math.random() * 14,
              background: "#8696a0", flexShrink: 0,
            }}/>
          ))}
        </div>
        <span style={{ fontSize: 11, color: "#667781" }}>{msg.duration}</span>
      </div>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", background: "#dfe5e7",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16,
      }}>🎤</div>
    </div>
  );
}

function ReplyBlock({ reply, isSent }) {
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

function DateSeparator({ text }) {
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

function EncryptionCard() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4px 16px 10px" }}>
      <div style={{
        background: "#fdf4c5", borderRadius: 8, padding: "10px 14px",
        fontSize: 12.5, color: "#54656f", lineHeight: 1.45,
        textAlign: "center", maxWidth: 340,
        boxShadow: "0 1px 0.5px rgba(11,20,26,0.06)",
      }}>
        <span>🔒 </span>
        As mensagens e ligações são privadas, protegidas por criptografia e apagadas após cada conversa. Somente os participantes podem ler, ouvir ou visualizar esse conteúdo.
        <span style={{ fontWeight: 700 }}> Saiba mais</span>
      </div>
    </div>
  );
}

function CallStatusMessage({ msg }) {
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

function MessageBubble({ msg }) {
  const isSent = msg.sent;
  const isVoice = msg.type === "voice";
  const isImage = !!msg.image;
  return (
    <div style={{
      display: "flex", justifyContent: isSent ? "flex-end" : "flex-start",
      paddingLeft: isSent ? 50 : 0, paddingRight: isSent ? 0 : 50, marginBottom: 2,
    }}>
      <div style={{
        background: isSent ? T.bubbleSent : T.bubbleReceived, color: T.textPrimary,
        borderRadius: isSent ? "7.5px 7.5px 0 7.5px" : "7.5px 7.5px 7.5px 0",
        padding: isImage ? "3px 3px 2px" : isVoice ? "4px 6px 2px" : "4px 7px 5px",
        maxWidth: "85%", minWidth: isVoice ? 240 : 0,
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
        ) : isVoice ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <VoiceMessage msg={msg} />
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 2, gap: 2 }}>
              <span style={{ fontSize: 11, color: "#667781" }}>{msg.time}</span>
              {isSent && <DoubleCheck read={msg.read} />}
            </div>
          </div>
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

/* ─── TYPING INDICATOR ─── */
function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", paddingRight: 50, marginBottom: 2 }}>
      <div style={{
        background: T.bubbleReceived, borderRadius: "7.5px 7.5px 7.5px 0",
        padding: "9px 14px", boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%", background: "#8696a0",
            animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
        <style>{`
          @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-5px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ─── CONVERSATION LIST ─── */
function ConversationList({ conversations, onSelect, activeTab, onTabChange, visitedChats }) {
  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.bg }}>
      <div style={{
        background: T.headerBg, padding: "14px 16px 6px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, display: "flex", alignItems: "baseline" }}>
          <span style={{ fontSize: 20, color: T.textPrimary }}>crush</span>
          <span style={{ fontSize: 20, color: "#25D366" }}>zap</span>
        </span>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#54656f">
            <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          </svg>
        </div>
      </div>

      <div style={{ padding: "10px 16px 6px" }}>
        <div style={{
          background: T.searchBg, borderRadius: 8, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <span style={{ color: "#8696a0", fontSize: 16 }}>Pesquisar usuários ou conversas</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingTop: 4 }}>
        {conversations.map((conv) => {
          const visited = visitedChats.has(conv.id);
          return (
          <div key={conv.id} onClick={() => onSelect(conv.id)} style={{
            display: "flex", alignItems: "center", padding: "12px 16px",
            gap: 14, cursor: "pointer",
          }}>
            <Avatar emoji={conv.avatar} size={52} bg={conv.avatarBg} photo={AVATARS[conv.id]} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <span style={{
                  color: T.textPrimary, fontSize: 17, fontWeight: 400,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{conv.name}</span>
                <span style={{
                  color: conv.unread > 0 ? T.unreadBadge : T.textSecondary,
                  fontSize: 12, flexShrink: 0, marginLeft: 8,
                }}>{conv.time}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  color: T.textSecondary,
                  fontSize: 14,
                  overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap", flex: 1, display: "flex", alignItems: "center", gap: 3,
                }}>
                  {visited && conv.messages[conv.messages.length - 1]?.sent && (
                    <DoubleCheck read={conv.messages[conv.messages.length - 1]?.read} />
                  )}
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {visited ? conv.lastMsg : "Toque para conversar"}
                  </span>
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, flexShrink: 0 }}>
                  {conv.pinned && <PinIcon />}
                  {conv.online && <div style={{ width: 13, height: 13, borderRadius: "50%", background: T.unreadBadge }} />}
                  {conv.unread > 0 && (
                    <div style={{
                      background: T.unreadBadge, color: "#fff", borderRadius: 12,
                      minWidth: 22, height: 22, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 12, fontWeight: 600, padding: "0 5px",
                    }}>{conv.unread}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* FABs */}
      <div style={{ position: "absolute", bottom: 76, right: 16, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)", cursor: "pointer",
        }}>
          <span style={{ fontSize: 18, color: "#fff" }}>✦</span>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: T.fabBg, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)", cursor: "pointer",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
            <path d="M19 3H5c-1 0-2 .6-2 1.6V21l3.5-3.5h12.5c1 0 2-1.1 2-2.1V4.6C21 3.6 20 3 19 3z"/>
            <path d="M12 7v6M9 10h6" stroke={T.fabBg} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <BottomTabs activeTab={activeTab} onTabChange={onTabChange} unreadCount={totalUnread} />
    </div>
  );
}


/* ─── VIDEO CALL SCREEN ─── */
function VideoCallScreen({ callerName, callerAvatar, onDecline, onCallEnd }) {
  const [phase, setPhase] = useState("ringing");
  const [timer, setTimer] = useState(0);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  // Ringtone
  useEffect(() => {
    if (phase === "ringing") {
      try {
        const audio = new Audio(CALL_MEDIA.ringtone);
        audio.loop = true;
        audio.volume = 1;
        audio.play().catch(() => {});
        audioRef.current = audio;
      } catch(e) {}
      return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
    }
  }, [phase]);

  // Timer for active phase
  useEffect(() => {
    if (phase === "active") {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [phase]);

  const handleAnswer = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPhase("active");
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const handleDecline = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    onDecline();
  };

  const handleHangup = () => {
    if (videoRef.current) videoRef.current.pause();
    clearInterval(timerRef.current);
    onCallEnd(timer);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  if (phase === "ringing") {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
        background: "#0d1117", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between", padding: "64px 0",
      }}>
        <div />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 140, height: 140, borderRadius: "50%", padding: 6,
            border: "3px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center",
            animation: "callPulse 1.5s ease-out infinite",
          }}>
            <img src={callerAvatar} style={{ width: 128, height: 128, borderRadius: "50%", objectFit: "cover" }} />
          </div>
          <span style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginTop: 8 }}>{callerName} 💋</span>
          <span style={{ color: "#9ca3af", fontSize: 14 }}>está te ligando...</span>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
                animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, width: "100%", padding: "0 32px" }}>
          <button onClick={handleDecline} style={{
            flex: 1, padding: "16px 0", borderRadius: 16, background: "#ef4444",
            border: "none", color: "#fff", fontSize: 16, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>✕</span> Recusar
          </button>
          <button onClick={handleAnswer} style={{
            flex: 1, padding: "16px 0", borderRadius: 16, background: "#22c55e",
            border: "none", color: "#fff", fontSize: 16, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>🎥</span> Atender
          </button>
        </div>
        <style>{`
          @keyframes callPulse {
            0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.7); }
            100% { box-shadow: 0 0 0 20px rgba(34,197,94,0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
      background: "#000",
    }}>
      <video
        ref={videoRef}
        src={CALL_MEDIA.video}
        playsInline
        onEnded={handleHangup}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 10,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <img src={callerAvatar} style={{
          width: 40, height: 40, borderRadius: "50%", objectFit: "cover",
          border: "2px solid rgba(255,255,255,0.6)",
        }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{callerName}</span>
          <span style={{ color: "#fff", fontSize: 12, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{formatTime(timer)}</span>
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: 40, left: 0, right: 0, zIndex: 10,
        display: "flex", justifyContent: "center", gap: 24,
      }}>
        {["🎤", "📹", "⛶"].map((icon, i) => (
          <div key={i} style={{
            width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, cursor: "pointer",
          }}>{icon}</div>
        ))}
        <div onClick={handleHangup} style={{
          width: 48, height: 48, borderRadius: "50%", background: "#ef4444",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, cursor: "pointer",
        }}>📞</div>
      </div>
    </div>
  );
}

/* ─── CHAT VIEW ─── */
function ChatView({ conversation, onBack, conversations, setConversations, geoData }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const messagesEnd = useRef(null);
  const scriptRunning = useRef(false);
  const conv = conversations.find((c) => c.id === conversation);

  useEffect(() => {
    setTimeout(() => messagesEnd.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [conv?.messages.length, isTyping, showCall]);

  // Go "Online agora" after 5-12s
  useEffect(() => {
    if (conversation === "jonatan") return;
    const delay = (12 + Math.random() * 6) * 1000;
    const timer = setTimeout(() => {
      setConversations(prev =>
        prev.map(c => c.id === conversation ? { ...c, status: "Online agora" } : c)
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [conversation]);

  const handleBack = () => {
    if (conversation !== "jonatan") {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setConversations(prev =>
        prev.map(c => c.id === conversation
          ? { ...c, status: `visto por último hoje às ${h}:${m}` } : c)
      );
    }
    onBack();
  };

  const handleDecline = () => {
    setShowCall(false);
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    // Add missed call message
    setConversations(prev =>
      prev.map(c => c.id === conversation
        ? { ...c, messages: [...c.messages, { id: Date.now(), type: "call", callStatus: "missed", text: "Chamada de vídeo perdida", time: timeStr }] } : c)
    );

    const count = conv?.declineCount || 0;
    if (count >= DECLINE_SCRIPTS.length) return;

    const script = DECLINE_SCRIPTS[count];
    // Increment declineCount immediately
    setConversations(prev =>
      prev.map(c => c.id === conversation ? { ...c, declineCount: count + 1 } : c)
    );

    const sendDeclineMsg = (index) => {
      if (index >= script.messages.length) {
        if (script.retryCall) {
          setTimeout(() => setShowCall(true), 5000);
        }
        return;
      }
      const msg = script.messages[index];
      const preDelay = index === 0 ? 3000 + Math.random() * 2500 : 1500 + Math.random() * 1500;

      setTimeout(() => {
        setIsTyping(true);
        const msgText = typeof msg.text === "function" ? msg.text(conv, geoData) : msg.text;
        const typingDuration = Math.min(7000, Math.max(1500, 1200 + msgText.length * (70 + Math.random() * 40)));

        setTimeout(() => {
          setIsTyping(false);
          const replyTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          const reply = { id: Date.now() + index, text: msgText, sent: false, time: replyTime };
          setConversations(prev =>
            prev.map(c => c.id === conversation
              ? { ...c, messages: [...c.messages, reply], lastMsg: msgText, time: replyTime } : c)
          );
          sendDeclineMsg(index + 1);
        }, typingDuration);
      }, preDelay);
    };
    sendDeclineMsg(0);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newMsg = { id: Date.now(), text: input.trim(), sent: true, time: timeStr, read: false };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversation) return c;
        let msgs = [...c.messages];
        if (msgs.length === 0) {
          const months = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
          const dateStr = `${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
          msgs.push({ id: Date.now() - 2, type: "date", text: dateStr });
          msgs.push({ id: Date.now() - 1, type: "encryption" });
        }
        msgs.push(newMsg);
        return { ...c, messages: msgs, lastMsg: input.trim(), time: timeStr };
      })
    );
    setInput("");

    // Check for script
    const script = CHAT_SCRIPTS[conversation];
    const step = conv?.scriptStep || 0;

    if (script && step < script.length && !scriptRunning.current) {
      const currentStep = script[step];

      // Handle action steps (like video call)
      if (currentStep.action === "call") {
        setConversations(prev =>
          prev.map(c => c.id === conversation ? { ...c, scriptStep: step + 1 } : c)
        );
        setTimeout(() => setShowCall(true), (currentStep.delay || 5) * 1000);
        return;
      }

      // Resolve messages — can be array or function(conv, geoData)
      const stepMessages = typeof currentStep.messages === "function"
        ? currentStep.messages(conv, geoData)
        : currentStep.messages;
      // Lock and advance step IMMEDIATELY
      scriptRunning.current = true;
      setConversations(prev =>
        prev.map(c => c.id === conversation ? { ...c, scriptStep: step + 1 } : c)
      );
      // Execute scripted messages sequentially
      const sendScriptMsg = (index) => {
        if (index >= stepMessages.length) {
          scriptRunning.current = false;
          return;
        }
        const msg = stepMessages[index];
        const isImg = !!msg.image;

        // Custom preDelay or default
        let preDelay;
        if (msg.preDelay) {
          preDelay = (msg.preDelay[0] + Math.random() * (msg.preDelay[1] - msg.preDelay[0])) * 1000;
        } else {
          preDelay = index === 0 ? 3000 + Math.random() * 2500 : 1500 + Math.random() * 1500;
        }

        setTimeout(() => {
          setIsTyping(true);
          const msgText = msg.text ? (typeof msg.text === "function" ? msg.text(conv, geoData) : msg.text) : "";
          const typingDuration = isImg
            ? 1000 + Math.random() * 800
            : Math.min(7000, Math.max(1500, 1200 + msgText.length * (70 + Math.random() * 40)));

          setTimeout(() => {
            setIsTyping(false);
            const replyTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
            const reply = isImg
              ? { id: Date.now() + index, image: msg.image, sent: false, time: replyTime }
              : { id: Date.now() + index, text: msgText, sent: false, time: replyTime };
            const lastMsg = isImg ? "📷 Foto" : msgText;
            setConversations(prev =>
              prev.map(c => c.id === conversation
                ? { ...c, messages: [...c.messages, reply], lastMsg, time: replyTime } : c)
            );
            sendScriptMsg(index + 1);
          }, typingDuration);
        }, preDelay);
      };
      sendScriptMsg(0);
    }
  };

  if (!conv) return null;

  if (showCall) {
    return (
      <VideoCallScreen
        callerName={conv.name.split(" ")[0]}
        callerAvatar={AVATARS[conv.id]}
        onDecline={handleDecline}
        onCallEnd={(duration) => {
          setShowCall(false);
          const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          const mm = Math.floor(duration / 60).toString().padStart(2, "0");
          const ss = (duration % 60).toString().padStart(2, "0");
          setConversations(prev =>
            prev.map(c => c.id === conversation
              ? { ...c, messages: [
                  ...c.messages,
                  { id: Date.now(), type: "call", callStatus: "started", text: "Chamada de vídeo iniciada", time: timeStr },
                  { id: Date.now() + 1, type: "call", callStatus: "ended", text: `Chamada de vídeo - ${mm}:${ss}`, time: timeStr },
                ] } : c)
          );
        }}
      />
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: T.chatBg }}>
      <div style={{
        background: T.chatHeaderBg, padding: "6px 6px 6px 2px",
        display: "flex", alignItems: "center", gap: 6, minHeight: 56,
      }}>
        <button onClick={handleBack} style={{
          background: "none", border: "none", color: "#fff",
          fontSize: 24, cursor: "pointer", padding: "4px 6px", lineHeight: 1,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <Avatar emoji={conv.avatar} size={40} bg={conv.avatarBg} photo={AVATARS[conv.id]} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: "#fff", fontSize: 16, fontWeight: 500,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{conv.name}</div>
          {conv.status && (
            <div style={{ color: isTyping ? "#fff" : "#d0e8d0", fontSize: 12 }}>
              {isTyping ? "digitando..." : conv.status}
            </div>
          )}
          {!conv.status && isTyping && (
            <div style={{ color: "#fff", fontSize: 12 }}>digitando...</div>
          )}
          {conv.subtitle && (
            <div style={{ color: "#d0e8d0", fontSize: 12 }}>{conv.subtitle}</div>
          )}
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="14" rx="2"/><circle cx="12" cy="11" r="3"/>
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          </svg>
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: "auto", padding: "4px 12px",
        backgroundImage: wallpaperSvg,
        backgroundSize: "320px 470px",
        backgroundRepeat: "repeat",
      }}>
        {conv.messages.length === 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0", marginTop: 8 }}>
              <div style={{
                background: "#e2ddd5", borderRadius: 8, padding: "5px 12px",
                fontSize: 12.5, color: "#54656f",
                boxShadow: "0 1px 0.5px rgba(11,20,26,0.06)",
              }}>Envie uma mensagem para iniciar a conversa</div>
            </div>
            <EncryptionCard />
          </>
        )}
        {conv.messages.map((msg) => {
          if (msg.type === "date") return <DateSeparator key={msg.id} text={msg.text} />;
          if (msg.type === "encryption") return <EncryptionCard key={msg.id} />;
          if (msg.type === "call") return <CallStatusMessage key={msg.id} msg={msg} />;
          return <MessageBubble key={msg.id} msg={msg} />;
        })}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEnd} />
      </div>

      <div style={{
        display: "flex", alignItems: "center", padding: "4px 6px", gap: 5, background: T.composerBg,
      }}>
        <div style={{
          width: 36, height: 36, display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", flexShrink: 0,
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#54656f" strokeWidth="1.4"/>
            <circle cx="8.5" cy="10.5" r="1.2" fill="#54656f"/>
            <circle cx="15.5" cy="10.5" r="1.2" fill="#54656f"/>
            <path d="M8.5 14.5c0 0 1.5 2 3.5 2s3.5-2 3.5-2" stroke="#54656f" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          background: "#fff", borderRadius: 21, padding: "7px 12px",
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Mensagem"
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: T.textPrimary, fontSize: 16,
            }}
          />
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginLeft: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </div>
        <button onClick={sendMessage} style={{
          background: T.fabBg, border: "none", borderRadius: "50%",
          width: 46, height: 46, display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", flexShrink: 0,
        }}>
          {input.trim() ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── DYNAMIC LAST SEEN ─── */
function generateDynamicStatuses() {
  const now = new Date();
  const ids = CONVERSATIONS.filter(c => c.id !== "jonatan").map(c => c.id);
  const total = ids.length;
  const GAP = 3;

  // Generate available slots from 4 to 180, spaced by GAP
  const allSlots = [];
  for (let m = 4; m <= 180; m += GAP) allSlots.push(m);

  // Shuffle slots, then sort picked ones per distribution
  const shuffledSlots = [...allSlots].sort(() => Math.random() - 0.5);

  // Pick slots per range bucket
  const buckets = [
    { min: 4, max: 45, count: Math.round(total * 0.7) },
    { min: 46, max: 75, count: Math.max(1, Math.round(total * 0.1)) },
    { min: 76, max: 130, count: Math.max(1, Math.round(total * 0.1)) },
  ];
  const lastCount = total - buckets.reduce((a, b) => a + b.count, 0);
  buckets.push({ min: 131, max: 180, count: lastCount });

  const picked = [];
  for (const bucket of buckets) {
    const available = shuffledSlots.filter(
      s => s >= bucket.min && s <= bucket.max && !picked.includes(s)
    );
    const take = available.slice(0, bucket.count);
    picked.push(...take);
    // If not enough in range, pick nearest available
    if (take.length < bucket.count) {
      const remaining = bucket.count - take.length;
      const extras = shuffledSlots.filter(s => !picked.includes(s));
      picked.push(...extras.slice(0, remaining));
    }
  }

  // Shuffle assignment to chats
  const shuffledIds = [...ids].sort(() => Math.random() - 0.5);
  const statuses = {};
  shuffledIds.forEach((id, i) => {
    const mins = picked[i] || 4;
    const seen = new Date(now.getTime() - mins * 60000);
    const h = seen.getHours().toString().padStart(2, "0");
    const m = seen.getMinutes().toString().padStart(2, "0");
    statuses[id] = `visto por último hoje às ${h}:${m}`;
  });
  return statuses;
}

function initConversations() {
  const statuses = generateDynamicStatuses();
  const now = new Date();
  const nowStr = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
  return CONVERSATIONS.map(c => {
    if (c.id === "jonatan") return c;
    return { ...c, status: statuses[c.id] || c.status };
  });
}

/* ─── APP ─── */
export default function WhatsAppClone() {
  const [activeTab, setActiveTab] = useState("chats");
  const [activeConv, setActiveConv] = useState(null);
  const [conversations, setConversations] = useState(initConversations);
  const [visitedChats, setVisitedChats] = useState(new Set(["jonatan"]));
  const [geoData, setGeoData] = useState(null);
  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);

  // Fetch user's city by IP — ipapi.co → ip-api.com → fallback
  useEffect(() => {
    const setGeo = (city, region, regionCode, country) =>
      setGeoData({ city: city || "", region: region || "", regionCode: regionCode || "", country: country || "" });

    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        if (data.city) return setGeo(data.city, data.region, data.region_code, data.country_name);
        throw new Error("no city");
      })
      .catch(() => {
        fetch("http://ip-api.com/json/?fields=city,regionName,region,country")
          .then(r => r.json())
          .then(data => {
            if (data.city) return setGeo(data.city, data.regionName, data.region, data.country);
            throw new Error("no city");
          })
          .catch(() => setGeo("", "", "", ""));
      });
  }, []);

  const openChat = (id) => {
    setVisitedChats(prev => new Set([...prev, id]));
    setActiveConv(id);
  };

  if (activeConv) {
    return (
      <div style={{
        width: "100%", maxWidth: 430, height: "100dvh", margin: "0 auto",
        position: "relative", overflow: "hidden",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        background: T.bg,
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
          *::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <ChatView
          conversation={activeConv}
          onBack={() => setActiveConv(null)}
          conversations={conversations}
          setConversations={setConversations}
          geoData={geoData}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: "100%", maxWidth: 430, height: "100dvh", margin: "0 auto",
      position: "relative", overflow: "hidden",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      background: T.bg,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
        *::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {activeTab === "chats" && (
        <ConversationList
          conversations={conversations}
          onSelect={openChat}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          visitedChats={visitedChats}
        />
      )}
      {activeTab === "updates" && (
        <UpdatesView
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={totalUnread}
        />
      )}
      {activeTab === "communities" && (
        <CommunitiesView
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={totalUnread}
        />
      )}
      {activeTab === "calls" && (
        <CallsView
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={totalUnread}
        />
      )}
    </div>
  );
}
