const CHAT_PHOTOS = {
  e6: "https://s3files.autopilots.trade/crushzap/e6.jpg",
};

// Álbum compartilhado pelas duas copys (A e B) da Yasmin
const SLIDESHOW_DUDA = [
  "https://s3files.autopilots.trade/crushzap/galeria.png",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar10.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar11.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar13.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar14.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar16.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar2.jpg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar4.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar6.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar7.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar9.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar5.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/89.jpg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar3.jpg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar8.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar15.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/usar12.jpeg",
  "https://s3files.autopilots.trade/crushzap/crushslide/88.jpeg",
];

// ── ÁUDIOS DE SAUDAÇÃO ──
const AUDIO_SAUDACAO = {
  bomDia:    "https://s3files.autopilots.trade/copysupabase/audios/bomdiaok.opus",
  boaTarde:  "https://s3files.autopilots.trade/copysupabase/audios/boatardeok.opus",
  boaNoite:  "https://s3files.autopilots.trade/copysupabase/audios/boanoiteok.opus",
  madrugada: "https://s3files.autopilots.trade/copysupabase/audios/madrugadaok.opus",
};

function gerarSaudacao() {
  const sortear = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const aberturas = ["oi", "oi", "oie", "oie", "oii", "oii", "hey"];
  const vocativos  = ["amor", "amor", "amor", "bb", "bb", "anjo", "vida", "meu bem", "", "", ""];
  const saud = () => { const a = sortear(aberturas), v = sortear(vocativos); return v ? `${a} ${v}` : a; };
  const frase = (tpl) => saud() + ", " + sortear(tpl);
  const audio = (url) => ({ type: "voice", audio: url, duration: "0:15" });

  // templates
  const tplDemora        = ["vi sua msg agora","acabei de ver aqui","desculpa a demora tava ocupada","acabei de pegar o cel","foi mal a demora"];
  const tplReceptivas    = ["q bom q vc mandou msg","q bom q mandou msg tava no tédio aqui kk","to aqui pode falar","to livre agora pode mandar anjo","q bom q vc apareceu"];
  const tplQuaseDormindo = ["tava quase dormindo mas vi sua msg","ia dormir agora mas vi que vc chamou"];
  const tplMadrugada     = ["tava dormindo vi agora desculpa","acabei de acordar vi que vc mandou","tava dormindo desculpa"];
  const tplAcordando     = ["acabei de acordar","to acordando ainda desculpa","acabei de levantar vi agora"];
  const tplCafe          = ["desculpa tava tomando café aqui","tava tomando meu cafezinho desculpa"];
  const tplTrabalho      = ["desculpa tava presa no trabalho","tava resolvendo coisa do trabalho desculpa","tava respondendo uns emails do serviço vi agora"];
  const tplAlmoco        = ["tava almoçando aqui desculpa","acabei de almoçar vi agora"];
  const tplTarde         = ["tava lá fora desculpa","acabei de chegar vi sua msg","tava resolvendo umas coisas aqui fora"];
  const tplAcademia      = ["tava treinando aqui desculpa","acabei de voltar do treino vi agora"];
  const tplJantar        = ["tava jantando aqui desculpa","acabei de jantar vi agora","tava comendo aqui desculpa"];
  const tplNoite         = ["tava vendo série aqui desculpa","acabei de sair do banho vi agora","tava deitada aqui desculpa"];
  const tplSaindo        = ["tava com a galera aqui desculpa","acabei de chegar do rolê vi agora","tava fora com umas amigas"];
  const tplDomingo       = ["tava na preguiça de domingo aqui kk","to no modo domingo aqui rs","tava de bobeira total aqui no domingo"];

  // relógio Brasil
  const dataBR      = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const h           = dataBR.getHours();
  const min         = dataBR.getMinutes();
  const hd          = h + min / 60;
  const dia         = dataBR.getDay();
  const isDiaUtil       = dia >= 1 && dia <= 5;
  const isSextaOuSabado = dia === 5 || dia === 6;
  const isDomingo       = dia === 0;

  // chance receptivas
  const chanceBase  = [0.22,0.10,0.15,0.20,0.17,0.12,0.11][dia];
  const multi       = hd < 2 ? 2.0 : (hd >= 8.5 && hd < 11) ? 1.8 : (hd >= 14 && hd < 15) ? 1.6 : (hd >= 18 && hd < 19.5) ? 1.5 : 1.0;
  const chanceRecep = Math.min(chanceBase * multi, 0.45);

  // janelas
  const isQuaseDormindo  = hd >= 0   && hd < 2;
  const isMadrugada      = hd >= 2   && hd < 5;
  const isAudioMadrugada = hd >= 2   && hd < 4.5;
  const isAcordando      = hd >= 6   && hd < 8;
  const isBomDia         = hd >= 6   && hd < 11.5;
  const isCafe           = hd >= 6.5 && hd < 8.5;
  const isAlmoco         = hd >= 11  && hd < 14;
  const isTrabalho       = isDiaUtil && hd >= 9 && hd < 17;
  const isBoaTarde       = hd >= 12  && hd < 17.5;
  const isTarde          = hd >= 15  && hd < 18;
  const isAcademia       = hd >= 17  && hd < 20;
  const isJantar         = hd >= 19.5 && hd < 21.5;
  const isBoaNoite       = hd >= 19  && hd < 22.5;
  const isSaindo         = isSextaOuSabado && hd >= 20 && hd < 23;
  const isNoite          = hd >= 22;

  const r = Math.random;

  // seleção em cascata
  if (r() < chanceRecep)                         return { text: frase(tplReceptivas) };
  if (isAudioMadrugada && r() < 0.18)            return audio(AUDIO_SAUDACAO.madrugada);
  if (isBomDia         && r() < 0.07)            return audio(AUDIO_SAUDACAO.bomDia);
  if (isBoaTarde       && r() < 0.11)            return audio(AUDIO_SAUDACAO.boaTarde);
  if (isBoaNoite       && r() < 0.03)            return audio(AUDIO_SAUDACAO.boaNoite);
  if (isQuaseDormindo  && r() < 0.28)            return { text: frase(tplQuaseDormindo) };
  if (isMadrugada      && r() < 0.50)            return { text: frase(tplMadrugada) };
  if (isDomingo && hd >= 10 && r() < 0.35)       return { text: frase(tplDomingo) };
  if (isAcordando      && r() < 0.30)            return { text: frase(tplAcordando) };
  if (isCafe           && r() < 0.40)            return { text: frase(tplCafe) };
  if (isAlmoco         && r() < 0.40)            return { text: frase(tplAlmoco) };
  if (isTrabalho       && r() < 0.20)            return { text: frase(tplTrabalho) };
  if (isAcademia       && r() < 0.15)            return { text: frase(tplAcademia) };
  if (isTarde          && r() < 0.40)            return { text: frase(tplTarde) };
  if (isSaindo         && r() < 0.05)            return { text: frase(tplSaindo) };
  if (isJantar         && r() < 0.40)            return { text: frase(tplJantar) };
  if (isNoite          && r() < 0.40)            return { text: frase(tplNoite) };
  return { text: frase(tplDemora) };
}

export const CALL_MEDIA = {
  video: "https://s3files.autopilots.trade/crushzap/vnew.mp4",
  ringtone: "https://s3files.autopilots.trade/crushzap/ligacao.mp3",
};

export const CHAT_SCRIPTS = {
  duda_A: [
    {
      // Step 0: First contact — greeting generated by time/day context
      messages: () => [
        gerarSaudacao(),
        { text: "tudo bem?" },
      ],
    },
    {
      // Step 1: Lead replies with their name
      messages: [
        { text: (conv) => {
            const firstName = conv.name.split(" ")[0];
            const age = 18 + Math.floor(Math.random() * 8);
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
            { text: `ahh legal, eu moro aqui em ${geo.city.toLowerCase()} ${geo.regionCode.toLowerCase()}` },
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
    {
      // Step 3: Lead responds if alone — send photo
      messages: [
        { text: "te mandar um presente rs 😏" },
        { image: CHAT_PHOTOS.e6, preDelay: [6, 10] },
        { text: "essa sou eu rs" },
        { text: "oq achou?" },
        { text: "quer ver mais? 😌🙈" },
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
    {
      // Step 6: Lead responds to "o que vc achou?" after the call
      messages: [
        { text: "você gosta de putaria amor?" },
        { text: "🙈", preDelay: [2, 2] },
      ],
    },
    {
      // Step 7: Lead responds to "🙈" — escalate through pix ask
      messages: [
        { text: "ai delicia rs ❤️", preDelay: [6, 10] },
        { text: "vou fazer uma coisa q n faço pra ninguém", preDelay: [3, 6] },
        { text: "juro amor", preDelay: [3, 5] },
        { text: "só pq gostei de vc", preDelay: [3, 6] },
        { text: "te mandar uns mimos 😏", preDelay: [3, 5] },
        { text: "só pra vc me conhecer melhor", preDelay: [3, 6] },
        { text: "tá? rsrs", preDelay: [2, 4] },
        { text: "aproveita viu", preDelay: [2, 4] },
        { video: "https://s3files.autopilots.trade/crushzap/video2crushzap.mp4", preDelay: [9, 15] },
        { video: "https://s3files.autopilots.trade/crushzap/video3crushzap.mp4", preDelay: [5, 5] },
        { text: "gostou amor?", preDelay: [5, 5] },
        { text: "to boazinha hoje rs", preDelay: [3, 6] },
        { text: "vou te mandar uma fotinha aqui de presente", preDelay: [3, 5] },
        { text: "peraí, rapidinhooo", preDelay: [3, 5] },
        { text: "pronto gatinho", preDelay: [6, 10] },
        { text: "essa é só sua, só pra vc bb", preDelay: [3, 5] },
        { image: "https://s3files.autopilots.trade/crushzap/e3.jpg", preDelay: [4, 7] },
        { text: "foto de agora", preDelay: [3, 5] },
        { text: "ainda to assim aqui rsrs", preDelay: [2, 4] },
        { text: "sozinha e com vontade 🙈😌", preDelay: [3, 5] },
        { text: "sabe oq eu tava pensando?", preDelay: [3, 5] },
        { text: "oq vc acha da gente", preDelay: [5, 8] },
        { text: "continuar a chamada de vídeo?", preDelay: [3, 5] },
        { text: "tipo...", preDelay: [5, 8] },
        { text: "eu aqui, vc aí", preDelay: [3, 5] },
        { text: "só nós dois bem gostoso rs", preDelay: [3, 5] },
        { text: "e eu ainda posso te mandar todos os meus vídeos", preDelay: [3, 5] },
        { text: "tenho uns vídeos aqui bem quentes rs 😏", preDelay: [5, 8] },
        { slideshow: SLIDESHOW_DUDA, preDelay: [3, 5] },
        { text: "te mando todos de presente", preDelay: [3, 5] },
        { text: "se vc aceitar e puder me ajudar tbm rs", preDelay: [3, 5] },
        { text: "me ajuda com 15 reais no pix amor?", preDelay: [5, 8] },
        { text: "topa? ❤️", preDelay: [3, 5] },
        { text: "manda o pix e eu já te ligo agora", preDelay: [5, 8] },
        { type: "pix", amount: 15, description: "Chamada de vídeo ao vivo", preDelay: [1, 1] },
      ],
    },
  ],
};

// ── Teste A/B/C/D/E de copy: sorteio 20% cada no 1º acesso, travado por lead ──
const VARIANTS = ["A", "B", "C", "D", "E"];
let _variant;
export function getVariant() {
  if (_variant) return _variant;
  try {
    let v = localStorage.getItem("cz_variant");
    if (!VARIANTS.includes(v)) {
      v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
      localStorage.setItem("cz_variant", v);
    }
    _variant = v;
  } catch {
    _variant = "A";
  }
  return _variant;
}

// ── Variante B do funil da Yasmin (copy 2) — PIX R$15,01 ──
CHAT_SCRIPTS.duda_B = [
  {
    // Step 0: saudação fixa
    messages: [
      { text: "Oi amor, tudo bem?" },
    ],
  },
  {
    // Step 1: apresentação + foto (cedo) + chamariz
    messages: [
      { text: "prazer ❤️ eu sou a Yasmin, tenho 22 anos" },
      { image: CHAT_PHOTOS.e6, preDelay: [6, 10] },
      { text: "quer ver mais? 🙈" },
    ],
  },
  {
    // Step 2: de onde é
    messages: [
      { text: "ce é de onde?" },
    ],
  },
  {
    // Step 3: cidade dinâmica (mora na cidade do lead) + tá sozinho
    messages: (conv, geo) => {
      if (geo?.city) {
        return [
          { text: `ahh legal, eu moro aqui em ${geo.city.toLowerCase()} ${geo.regionCode.toLowerCase()}` },
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
  {
    // Step 4: puxa para a chamada
    messages: [
      { text: "gatinho ❤️" },
      { text: "aqui tem chamada de vídeo", preDelay: [5, 8] },
      { text: "quer me ver? 😏" },
      { text: "posso te ligar?" },
    ],
  },
  {
    // Step 5: chamada
    action: "call",
    delay: 5,
  },
  {
    // Step 6: após a chamada
    messages: [
      { text: "vc gosta de putaria amor? 🙈" },
    ],
  },
  {
    // Step 7: escalada → slide → pix (15,01)
    messages: [
      { text: "ai delicia rs ❤️", preDelay: [6, 10] },
      { text: "sabe oq eu tava pensando?", preDelay: [3, 5] },
      { text: "oq vc acha da gente", preDelay: [5, 8] },
      { text: "continuar essa chamada de vídeo?", preDelay: [3, 5] },
      { text: "só nós dois bem gostoso rs", preDelay: [3, 5] },
      { text: "e eu ainda posso te mandar", preDelay: [3, 5] },
      { text: "todos os meus vídeos e conteúdos", preDelay: [3, 5] },
      { slideshow: SLIDESHOW_DUDA, preDelay: [3, 5] },
      { text: "te mando todos de presente 😏", preDelay: [3, 5] },
      { text: "se vc aceitar e puder me ajudar tbm rs", preDelay: [3, 5] },
      { text: "me ajuda com 15 reais no pix amor?", preDelay: [5, 8] },
      { text: "topa? ❤️", preDelay: [3, 5] },
      { text: "manda o pix que eu já te ligo agora", preDelay: [5, 8] },
      { type: "pix", amount: 15.01, description: "Chamada de vídeo ao vivo", preDelay: [1, 1] },
    ],
  },
];

// ── Variante C do funil da Yasmin (copy 3) — curta/direta, PIX R$15,02 ──
CHAT_SCRIPTS.duda_C = [
  {
    // Step 0: saudação carente
    messages: [
      { text: "oi amor 🙈" },
      { text: "que bom que vc apareceu," },
      { text: "tava morrendo de tédio e com vontade aqui rs" },
      { text: "tudo bem gatinho?" },
    ],
  },
  {
    // Step 1: prova (foto cedo) + já puxa a ligação
    messages: [
      { text: "deixa eu já te mostrar com quem vc tá falando 😏" },
      { image: CHAT_PHOTOS.e6, preDelay: [6, 10] },
      { text: "sou eu amor ❤️" },
      { text: "quer me ver ao vivo agora? 🙈" },
      { text: "posso te ligar?" },
    ],
  },
  {
    // Step 2: chamada
    action: "call",
    delay: 5,
  },
  {
    // Step 3: micro-compromisso (yes-ladder)
    messages: [
      { text: "me fala uma coisa... vc tá com vontade igual eu tô? 😏" },
    ],
  },
  {
    // Step 4: oferta direta → slide → pix (15,02)
    messages: [
      { text: "então deixa eu te dar um presente", preDelay: [4, 7] },
      { text: "vou te mandar todos os meus vídeos e fotos mais quentes 😈", preDelay: [3, 5] },
      { slideshow: SLIDESHOW_DUDA, preDelay: [3, 5] },
      { text: "te dou tudo isso amor", preDelay: [3, 5] },
      { text: "só me ajuda com 15 reais no pix?", preDelay: [5, 8] },
      { text: "aí eu já te ligo de novo e a gente continua bem gostoso 🙈", preDelay: [3, 5] },
      { text: "topa? ❤️", preDelay: [3, 5] },
      { type: "pix", amount: 15.02, description: "Chamada de vídeo ao vivo", preDelay: [1, 1] },
    ],
  },
];

// ── Variante D do funil da Yasmin (copy 4) — guiada por dados, fecho anti-objeção, PIX R$15,03 ──
CHAT_SCRIPTS.duda_D = [
  {
    // Step 0: saudação quente que espelha a energia direta do lead
    messages: [
      { text: "oi gatinho 🙈" },
      { text: "vc apareceu na hora certa, tava louca pra mostrar uma coisa pra alguém 😏" },
      { text: "tudo bem amor?" },
    ],
  },
  {
    // Step 1: dá o que ele quer (ver) na hora + já puxa a ligação
    messages: [
      { text: "deixa eu te mostrar com quem vc tá falando 🙈" },
      { image: CHAT_PHOTOS.e6, preDelay: [6, 10] },
      { text: "gostou? 😏" },
      { text: "quer me ver ao vivo agora? aqui dá chamada de vídeo" },
      { text: "posso te ligar amor?" },
    ],
  },
  {
    // Step 2: chamada
    action: "call",
    delay: 5,
  },
  {
    // Step 3: micro-compromisso + espelha o "manda" dele
    messages: [
      { text: "me fala... vc quer que eu te mande TUDO agora? meus vídeos e fotos mais safadas 😈" },
    ],
  },
  {
    // Step 4: fecho com os 3 matadores de objeção (golpe / preço / adiar)
    messages: [
      { text: "então é rapidinho amor 🙈", preDelay: [4, 7] },
      { slideshow: SLIDESHOW_DUDA, preDelay: [3, 5] },
      { text: "te mando TUDO isso agora + te ligo de novo pra gente continuar 😏", preDelay: [3, 5] },
      { text: "é só 15 reais no pix, menos que um lanche kkk", preDelay: [3, 5] },
      { text: "e vc acabou de me ver ao vivo, sabe que sou real ❤️", preDelay: [3, 5] },
      { text: "manda agora que eu tô aqui pronta te esperando 🔥", preDelay: [3, 5] },
      { text: "topa? 🙈", preDelay: [3, 5] },
      { type: "pix", amount: 15.03, description: "Chamada de vídeo ao vivo", preDelay: [1, 1] },
    ],
  },
];

// ── Variante E (copy 5) — IDÊNTICA à copy4, só muda o preço (teste puro de preço): PIX R$10,00 ──
// Clona a copy4 trocando o valor do PIX e a frase que cita o preço ("15 reais" → "10 reais").
CHAT_SCRIPTS.duda_E = CHAT_SCRIPTS.duda_D.map(step =>
  Array.isArray(step.messages)
    ? { ...step, messages: step.messages.map(m =>
        m.type === "pix" ? { ...m, amount: 10.00 }
        : (m.text && m.text.includes("15 reais")) ? { ...m, text: m.text.replace("15 reais", "10 reais") }
        : m
      ) }
    : step
);

// Resolve o script da conversa, aplicando a variante A/B/C/D/E só na Yasmin (duda)
export function getChatScript(conversation) {
  if (conversation === "duda") return CHAT_SCRIPTS["duda_" + getVariant()];
  return CHAT_SCRIPTS[conversation];
}

export const POST_CALL_SCRIPTS = {
  duda_A: [
    { text: "foi rapidinho" },
    { text: "só pra vc ver q sou eu mesma" },
    { text: "fiquei até com vergonha rs" },
    { text: "o que vc achou? ❤️" },
  ],
  duda_B: [
    { text: "foi rapidinho" },
    { text: "só pra vc ver q sou eu mesma" },
    { text: "fiquei até com vergonha rs" },
    { text: "gostou? ❤️" },
  ],
  duda_C: [
    { text: "viu que sou real? 🙈" },
    { text: "fiquei toda arrepiada de te ver rs" },
    { text: "gostou de mim amor? ❤️" },
  ],
  duda_D: [
    { text: "viu? sou eu de verdade 🙈" },
    { text: "ninguém me vê assim ao vivo, só vc rs" },
    { text: "gostou de mim amor? ❤️" },
  ],
};
// copy5 usa o mesmo pós-chamada da copy4 (teste de preço puro)
POST_CALL_SCRIPTS.duda_E = POST_CALL_SCRIPTS.duda_D;

// Resolve o pós-chamada, aplicando a variante A/B/C/D/E só na Yasmin (duda)
export function getPostCallScript(conversation) {
  if (conversation === "duda") return POST_CALL_SCRIPTS["duda_" + getVariant()];
  return POST_CALL_SCRIPTS[conversation];
}

export const POST_PIX_SCRIPTS = {
  duda: [
    { text: "recebi aqui gatinhoo", preDelay: [3, 6] },
    { text: "muito obrigada amor ❤️", preDelay: [3, 6] },
    { text: "de coração mesmo, viu?", preDelay: [3, 6] },
    { text: "pronto pra gozar bem gostoso pra mim? 😏", preDelay: [3, 6] },
    { text: "vou liberar os meus conteúdos", preDelay: [7, 12] },
    { text: "aqui agora pra você", preDelay: [3, 6] },
    { text: "bem rapidinho", preDelay: [3, 6] },
    { text: "e te ligo aí, tá bom? 🙈", preDelay: [3, 6] },
    { text: "vou te mostrar como acessar os meus conteúdos, tá? 😏", preDelay: [5, 8] },
    { text: "só seguir esse passo a passo", preDelay: [3, 5] },
  ],
};

export const POST_TUTORIAL_SCRIPTS = {
  duda: {
    messages: [
      { text: "viu amor? ❤️",                    preDelay: [3, 6] },
      { text: "tá tudo 100% liberado pra vc",     preDelay: [3, 6] },
      { text: "depois acessa lá 🙏",              preDelay: [3, 6] },
      { text: "vou te ligar aí agora, tá?",       preDelay: [3, 6] },
      { text: "🙈😏",                             preDelay: [3, 6] },
    ],
    callVideo: "https://s3files.autopilots.trade/crushzap/chamadadevideoyasmin1000.mp4",
    callDelay: 3,
    declineMessages: [
      { text: "amor?",                            preDelay: [3, 6] },
      { text: "o que houve?",                     preDelay: [4, 8] },
      { text: "vamos gatinhoo me atende aí",      preDelay: [4, 8] },
    ],
    declineCallDelay: 3,
  },
};

export const SUPPORT_WELCOME_SCRIPTS = {
  jonatan: [
    { text: "Oi, tudo bem? Seja bem vindo(a)!",                              preDelay: [1, 2] },
    { text: "Esse é um canal de informações, novidades, dicas e suporte!",   preDelay: [3, 6] },
    { text: "Caso você precise de algo:",                                    preDelay: [3, 6] },
    { text: "Estamos aqui 24 horas para ajudar ❤️",                          preDelay: [3, 6] },
    { text: "Deixe sua mensagem e responderemos assim que possível",         preDelay: [3, 6] },
    { text: "P.S:",                                                                                                                          preDelay: [7, 11] },
    { text: "Nosso aplicativo foi lançado há menos de 2 semanas e já somos mais de 10.000 usuários ativos, obrigado de coração por isso", preDelay: [2, 2] },
    { text: "equipe crushzap",                                                                                                                preDelay: [2, 2] },
  ],
};

export const DECLINE_SCRIPTS = [
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
