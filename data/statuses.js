import { CONVERSATIONS } from "./conversations.js";

export const STATUS_DATA = [
  { id: "me",      name: "Yasmin\nAlmeida",   photo: "https://s3files.autopilots.trade/crushzap/atualizacoes/e.jpg", bg: "#5dade2", isMe: true, items: [
    { type: "photo", src: "https://s3files.autopilots.trade/crushzap/atualizacoes/e.jpg",              time: "8h"  },
    { type: "video", src: "https://s3files.autopilots.trade/crushzap/atualizacoes/statusyamins2.mp4",  time: "10h" },
    { type: "video", src: "https://s3files.autopilots.trade/crushzap/atualizacoes/statusyasmin.mp4",   time: "11h" },
  ]},
  { id: "gustavo", name: "Marina",            photo: "https://s3files.autopilots.trade/crushzap/atualizacoes/teste3434.jpg",                          bg: "#27ae60", seen: false },
  { id: "eduardo", name: "Bianca\nOliver",    photo: "https://s3files.autopilots.trade/crushzap/atualizacoes/asdasdasd.jpg",                           bg: "#82e0aa", seen: false },
  { id: "leandro", name: "Nanda\nAraújo",     photo: "https://s3files.autopilots.trade/crushzap/atualizacoes/loiradodos.jpg",                          bg: "#8e7b6b", seen: true },
  { id: "amanda",  name: "Paloma\nPereira",   photo: "https://s3files.autopilots.trade/crushzap/atualizacoes/5110f7bdd4a38b43ccc935fe186d2c87.jpg",    bg: "#c0392b", seen: false },
  { id: "rafael",  name: "Fernanda\nLemos",   photo: "https://s3files.autopilots.trade/crushzap/atualizacoes/55597c2d1bbe9d84933afb79202a02b3.jpg",    bg: "#f39c12", seen: true },
];

export function generateDynamicStatuses() {
  const now = new Date();
  const ids = CONVERSATIONS.filter(c => c.id !== "jonatan").map(c => c.id);
  const total = ids.length;
  const GAP = 3;

  const allSlots = [];
  for (let m = 4; m <= 180; m += GAP) allSlots.push(m);

  const shuffledSlots = [...allSlots].sort(() => Math.random() - 0.5);

  const buckets = [
    { min: 4,   max: 45,  count: Math.round(total * 0.7) },
    { min: 46,  max: 75,  count: Math.max(1, Math.round(total * 0.1)) },
    { min: 76,  max: 130, count: Math.max(1, Math.round(total * 0.1)) },
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
    if (take.length < bucket.count) {
      const remaining = bucket.count - take.length;
      const extras = shuffledSlots.filter(s => !picked.includes(s));
      picked.push(...extras.slice(0, remaining));
    }
  }

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

function getAppStartTime() {
  try {
    let ts = localStorage.getItem("cz_start");
    if (!ts) {
      ts = String(Date.now());
      localStorage.setItem("cz_start", ts);
    }
    const d = new Date(parseInt(ts, 10));
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  } catch {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }
}

export function initConversations() {
  const statuses = generateDynamicStatuses();
  const startTime = getAppStartTime();
  return CONVERSATIONS.map(c => {
    if (c.id === "jonatan") return { ...c, time: startTime };
    return { ...c, status: statuses[c.id] || c.status };
  });
}
