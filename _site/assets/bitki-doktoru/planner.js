function findPlantById(id) {
  return PLANT_CATALOG.find((p) => p.id === id) || null;
}

function searchPlants(query) {
  const q = (query || "").toLocaleLowerCase("tr");
  if (!q) return PLANT_CATALOG;
  return PLANT_CATALOG.filter((p) => {
    const blob = [p.yerelAd, p.latince, p.sinif, ...(p.tags || [])].join(" ").toLocaleLowerCase("tr");
    return blob.includes(q);
  });
}

function guessPlantFromNote(note) {
  if (!note) return PLANT_CATALOG[0];
  const q = note.toLocaleLowerCase("tr");
  const scored = PLANT_CATALOG.map((p) => {
    let s = 0;
    const hay = [p.yerelAd, p.latince, ...(p.tags || [])].join(" ").toLocaleLowerCase("tr");
    hay.split(/[\s/(),.-]+/).forEach((w) => {
      if (w.length > 2 && q.includes(w)) s += 2;
    });
    if (q.includes(p.yerelAd.toLocaleLowerCase("tr"))) s += 8;
    return { p, s };
  }).sort((a, b) => b.s - a.s);
  return scored[0].s > 0 ? scored[0].p : null;
}

function issuesFromNote(note) {
  const q = (note || "").toLocaleLowerCase("tr");
  const extra = [];
  if (/ıslak|fazla su|aşırı sul|çürük|küf|tabak/.test(q)) extra.push("overwater");
  if (/susuz|kurumuş toprak|gevre|solgun/.test(q)) extra.push("underwater");
  if (/sarı|soluk|kloroz/.test(q)) extra.push("chlorosis");
  if (/yanık|direkt güneş/.test(q)) extra.push("sunburn");
  if (/karanlık|az ışık|uzam/.test(q)) extra.push("lowlight");
  if (/bit|örümcek|pamuk|zararlı|ağ /.test(q)) extra.push("pests");
  if (/leke|mantar|küf/.test(q)) extra.push("fungus");
  return extra;
}

function buildLocalReport({ plant, vision, note, clinicName }) {
  const merged = [...issuesFromNote(note), ...(vision.issues || [])].filter(Boolean);
  let issues = [...new Set(merged)];
  if (issues.some((id) => id !== "healthy")) issues = issues.filter((id) => id !== "healthy");
  if (!issues.length) issues = ["healthy"];
  const photoCount = vision.photoCount || vision.summary?.photoCount || 0;
  const primaryId = issues.includes("healthy") && issues.length > 1
    ? issues.find((id) => id !== "healthy")
    : issues[0];
  const hastaliklar = issues
    .filter((id) => id !== "healthy" || issues.length === 1)
    .map((id) => {
      const d = DISEASES[id];
      return {
        ad: d.ad,
        siddet: d.siddetSablon,
        belirtiler: d.belirtiler,
        neden: d.neden,
        cozum: d.cozum,
        sure: d.sure
      };
    });

  const saglikOzeti = issues.includes("healthy") && issues.length === 1
    ? `${plant.yerelAd} genel olarak canlı görünüyor. Fotoğraflardaki yeşil oran yüksek; düzenli bakım yeterli.`
    : `${plant.yerelAd} üzerinde ${hastaliklar.map((h) => h.ad).join("; ")} belirtileri öne çıkıyor. ${photoCount} açıdan bakılan görüntüler ve gözlem notunuz bu teşhisi destekliyor.`;

  return {
    kaynak: "yerel",
    clinicName,
    tarih: new Date().toISOString(),
    note: note || "",
    yerelAd: plant.yerelAd,
    latinceAd: plant.latince,
    sinif: plant.sinif,
    boy: plant.boy,
    omur: plant.omur,
    guven: plant && note ? 72 : 58,
    ihtiyaclar: plant.ihtiyaclar,
    saglikSkoru: issues.includes("healthy") && issues.length === 1
      ? vision.score
      : Math.min(vision.score, 72),
    saglikOzeti,
    hastaliklar,
    hemsireNotu: issues.includes("healthy") && issues.length === 1
      ? "Hasta değil; düzenli kontrol ve mevsim ayarı yeterli."
      : "Önce su-ışık dengesini düzeltin, sonra besin ve zararlı tedavisine geçin. Aynı anda ağır gübre + ilaç uygulamayın.",
    vision,
    primaryId
  };
}

function mergeAiReport(ai, vision, clinicName, note) {
  const plantMatch =
    searchPlants(ai.yerelAd || "")[0] ||
    searchPlants(ai.latinceAd || "")[0] ||
    guessPlantFromNote(ai.yerelAd) ||
    PLANT_CATALOG[0];

  const ihtiyaclar = { ...plantMatch.ihtiyaclar, ...(ai.ihtiyaclar || {}) };
  const score = Number.isFinite(ai.saglikSkoru)
    ? Math.round((ai.saglikSkoru * 0.7 + vision.score * 0.3))
    : vision.score;

  return {
    kaynak: "yapay-zeka",
    clinicName,
    tarih: new Date().toISOString(),
    note: note || "",
    yerelAd: ai.yerelAd || plantMatch.yerelAd,
    latinceAd: ai.latinceAd || plantMatch.latince,
    sinif: ai.sinif || plantMatch.sinif,
    boy: ai.boy || plantMatch.boy,
    omur: ai.omur || plantMatch.omur,
    guven: ai.guven ?? 80,
    ihtiyaclar,
    saglikSkoru: score,
    saglikOzeti: ai.saglikOzeti || "",
    hastaliklar: Array.isArray(ai.hastaliklar) && ai.hastaliklar.length
      ? ai.hastaliklar
      : buildLocalReport({ plant: plantMatch, vision, note, clinicName }).hastaliklar,
    hemsireNotu: ai.hemsireNotu || "",
    vision,
    primaryId: vision.issues[0]
  };
}

function dayName(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
}

function isoDate(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildCarePlan(report) {
  const sick = report.hastaliklar.filter((h) => !/yok|sağlıklı|belirtisi yok/i.test(h.ad));
  const isSick = sick.length > 0 && !/belirtisi yok/i.test(sick[0]?.ad || "");
  const days = [];

  const templates = isSick
    ? [
        { gun: 0, saat: "09:00", baslik: "Karantina ve ilk muayene", detay: "Bitkiyi diğerlerinden ayırın. Toprak nemini, saksı drenajını ve yaprak altını kontrol edin. Durgun suyu boşaltın." },
        { gun: 0, saat: "18:00", baslik: "Yaprak temizliği", detay: "Nemli yumuşak bezle toz ve olası zararlıları silin. Hasta yaprakları steril makasla alın." },
        { gun: 1, saat: "09:30", baslik: "Sulama kararı", detay: "Parmak testi: üst 2–3 cm ıslaksa sulamayın. Kuruysa oda ılıklığında, tabağa su bırakmadan sulayın." },
        { gun: 1, saat: "19:00", baslik: "Işık ayarı", detay: "Yanık varsa tül arkasına alın; soluksa daha aydınlık dolaylı ışığa kaydırın. Yeri ani değiştirmeyin." },
        { gun: 2, saat: "10:00", baslik: "Zararlı taraması", detay: "Yaprak altı, boğum ve toprak yüzeyi. Unlu bit / ağ / yapışkanlık varsa izolasyon + sabunlu silme." },
        { gun: 3, saat: "09:00", baslik: "Tedavi uygulaması", detay: (sick[0]?.cozum && sick[0].cozum[0]) || "Teşhise uygun ilk tedavi adımını uygulayın. Doz aşımı yapmayın." },
        { gun: 4, saat: "18:00", baslik: "Nem ve hava", detay: "Kuru havadaysa taş tepsi veya oda nemi. Mantar varsa yaprak ıslatmayın, hava akışı açın." },
        { gun: 5, saat: "10:00", baslik: "İkinci kontrol", detay: "Yeni leke yayılıyor mu? Skoru not edin. Kötüleşiyorsa kök kontrolü planlayın." },
        { gun: 7, saat: "09:00", baslik: "Haftalık değerlendirme", detay: "Yeni yaprak var mı, yapraklar dikleşti mi? Gerekirse saksı değişimi veya tekrar ilaçlama (zararlıda 3. tur)." },
        { gun: 10, saat: "10:00", baslik: "Besin (yalnızca kök sağlamsa)", detay: "Çürük şüphesi yoksa yarı doz gübre. Hasta köke gübre yok." },
        { gun: 14, saat: "09:00", baslik: "Kontrol raporu", detay: "Fotoğrafları aynı açılardan tekrar çekin, skoru karşılaştırın. Takvimi 2. 14 güne uzatın veya koruyucu moda geçin." }
      ]
    : [
        { gun: 0, saat: "09:00", baslik: "Günlük bakış", detay: "Yaprak rengi, dik duruş, toprak yüzeyi. Anormallik yoksa dokunmayın." },
        { gun: 0, saat: "19:00", baslik: "Işık / çevirme", detay: "Saksıyı 90° çevirin ki gelişim dengeli olsun." },
        { gun: 2, saat: "10:00", baslik: "Nem kontrolü", detay: "Parmak testi; türe göre sulayın veya bekleyin." },
        { gun: 4, saat: "18:00", baslik: "Yaprak bakımı", detay: "Toz alın. Gözenekler açılır, zararlı erken yakalanır." },
        { gun: 7, saat: "09:00", baslik: "Haftalık bakım turu", detay: "Saksı delikleri, tuz birikimi, uç yanığı, zararlı. Gerekirse ılık duş." },
        { gun: 10, saat: "10:00", baslik: "Besin günü", detay: "Büyüme mevsiminde yarı doz. Kışın atlayın." },
        { gun: 14, saat: "09:00", baslik: "Fotoğraflı kontrol", detay: "Aynı açılardan kare alın, gelişimi arşivleyin." }
      ];

  templates.forEach((t) => {
    days.push({
      ...t,
      tarih: isoDate(t.gun),
      tarihYazi: dayName(t.gun),
      bitki: report.yerelAd,
      done: false,
      id: `d${t.gun}-${t.saat}`
    });
  });

  const destekler = [];
  if (isSick) {
    if (report.primaryId === "overwater" || /sulama|kök/i.test(sick[0]?.ad || "")) {
      destekler.push(
        { ad: "Geçirgen harç + perlit", neden: "Kök oksijeni", nasil: "Eski ıslak toprağı ayırıp taze karışıma geçin." },
        { ad: "Drenaj delikli saksı", neden: "Su birikmesin", nasil: "Tabakta su bırakmayın." }
      );
    }
    if (report.primaryId === "pests" || /zararlı|bit|örümcek/i.test(sick.map((s) => s.ad).join(" "))) {
      destekler.push({
        ad: "Neem (hint) yağı veya arap sabunu karışımı",
        neden: "Yumuşak vücutlu zararlılar",
        nasil: "Akşam, gölgede, 5–7 günde 3 uygulama. Çiçek açıkken dikkat."
      });
    }
    if (report.primaryId === "chlorosis" || /kloroz|eksik/i.test(sick.map((s) => s.ad).join(" "))) {
      destekler.push({
        ad: "Demir katkılı veya dengeli yeşil bitki gübresi",
        neden: "Renk ve büyüme",
        nasil: "Yarı doz, nemli toprağa. Kireçli suyu dinlendirin."
      });
    }
    if (report.primaryId === "fungus" || /mantar|leke/i.test(sick.map((s) => s.ad).join(" "))) {
      destekler.push({
        ad: "Bakırlı mantar ilacı (etiket dozu)",
        neden: "Leke yayılımını durdurmak",
        nasil: "Hasta yaprağı temizleyip havalandırın, sonra uygulayın."
      });
    }
    destekler.push({
      ad: "Temiz budama makası ve kolonya veya alkol",
      neden: "Temiz kesi, bulaşmayı önler",
      nasil: "Her kesimde aleti silin."
    });
  } else {
    destekler.push(
      { ad: "Türe uygun gübre", neden: "Koruyucu besleme", nasil: "Mevsiminde yarı doz." },
      { ad: "Yaprak bezi / duş", neden: "Toz ve zararlı erken tanı", nasil: "Ayda 1–2." },
      { ad: "Nem tepsisi veya nem ölçer", neden: "Ortam dengesi", nasil: "Calathea, orkide, areka için özellikle." }
    );
  }

  const gunlukKontrol = [
    { saat: "Sabah", gorev: "Gözle bak: solgunluk, leke, zararlı, toprak rengi", neden: "Erken müdahale" },
        { saat: "Öğle", gorev: "Işık kontrolü: yakıcı mı, yetersiz mi?", neden: "Yanık ve cılız uzamayı önlemek" },
    { saat: "Akşam", gorev: "Saksı tabağı boş mu? Hava akışı var mı?", neden: "Kök çürüğü ve mantar" }
  ];

  const surec = isSick
    ? [
        { adım: "1. Durumu sabitleyin", aciklama: "Su, ışık, ayırma — ilk 72 saat." },
        { adım: "2. Tedavi", aciklama: "Teşhise özel uygulama — 3.–10. gün." },
        { adım: "3. Besleme", aciklama: "Kök sağlamsa yarı doz gübre — yaklaşık 10. gün." },
        { adım: "4. Takip", aciklama: "14. gün aynı açılardan fotoğraf çekip karşılaştırın." }
      ]
    : [
        { adım: "1. Koru", aciklama: "Mevcut dengeyi bozmayın." },
        { adım: "2. Rutin", aciklama: "Sulama + çevirme + temizlik." },
        { adım: "3. Mevsim", aciklama: "Kışın su ve gübreyi azaltın." }
      ];

  return { days, destekler, gunlukKontrol, surec, isSick };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function toICSDate(date, saat) {
  const [h, m] = (saat || "09:00").split(":").map(Number);
  const d = new Date(date);
  d.setHours(h || 9, m || 0, 0, 0);
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    "00"
  );
}

function buildICS(report, plan) {
  const stamp = new Date();
  const dtStamp =
    stamp.getUTCFullYear() +
    pad(stamp.getUTCMonth() + 1) +
    pad(stamp.getUTCDate()) +
    "T" +
    pad(stamp.getUTCHours()) +
    pad(stamp.getUTCMinutes()) +
    "00Z";

  const events = plan.days.map((task, i) => {
    const start = toICSDate(task.tarih, task.saat);
    const endDate = new Date(task.tarih);
    const [h, m] = task.saat.split(":").map(Number);
    endDate.setHours((h || 9) + 1, m || 0, 0, 0);
    const end =
      endDate.getFullYear() +
      pad(endDate.getMonth() + 1) +
      pad(endDate.getDate()) +
      "T" +
      pad(endDate.getHours()) +
      pad(endDate.getMinutes()) +
      "00";
    const desc = String(task.detay).replace(/\n/g, "\\n").replace(/,/g, "\\,");
    return [
      "BEGIN:VEVENT",
      `UID:bitki-${report.yerelAd.replace(/\s+/g, "-")}-${i}@yaprak-klinigi`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${report.yerelAd} · ${task.baslik}`,
      `DESCRIPTION:${desc}`,
      "END:VEVENT"
    ].join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Yaprak Klinigi//Bitki Hemsire//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR"
  ].join("\r\n");
}

function downloadText(filename, text, mime) {
  const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
