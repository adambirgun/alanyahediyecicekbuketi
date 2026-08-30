function sampleImageStats(img) {
  const canvas = document.createElement("canvas");
  const maxSide = 160;
  const scale = Math.min(maxSide / img.width, maxSide / img.height, 1);
  canvas.width = Math.max(8, Math.round(img.width * scale));
  canvas.height = Math.max(8, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let green = 0, yellow = 0, brown = 0, dark = 0, pale = 0, total = 0;
  let satSum = 0, brightSum = 0, spotLike = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 20) continue;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const bright = (r + g + b) / 3;
    const sat = max === 0 ? 0 : (max - min) / max;
    if (bright > 245 && sat < 0.08) continue;

    total += 1;
    satSum += sat;
    brightSum += bright;

    const isGreen = g > r + 12 && g > b + 8 && g > 50;
    const isYellow = r > 140 && g > 120 && b < 110 && r >= g - 20 && g > b + 25;
    const isBrown = r > 70 && r > g + 10 && g > b && r < 190 && g < 140 && bright < 150;
    const isDark = bright < 42;
    const isPale = bright > 170 && sat < 0.22 && g >= r - 10;

    if (isGreen) green += 1;
    else if (isYellow) yellow += 1;
    else if (isBrown) brown += 1;
    else if (isDark) dark += 1;
    else if (isPale) pale += 1;

    if (bright < 55 && sat > 0.15) spotLike += 1;
  }

  if (!total) {
    return { green: 0, yellow: 0, brown: 0, dark: 0, pale: 0, sat: 0, bright: 0, spots: 0 };
  }

  return {
    green: green / total,
    yellow: yellow / total,
    brown: brown / total,
    dark: dark / total,
    pale: pale / total,
    sat: satSum / total,
    bright: brightSum / total / 255,
    spots: spotLike / total
  };
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Görsel okunamadı. Fotoğrafı yeniden seçin."));
    };
    img.src = url;
  });
}

async function analyzePhotos(files) {
  const perPhoto = [];
  for (const file of files) {
    try {
      const img = await loadImageFromFile(file);
      perPhoto.push({ name: file.name, stats: sampleImageStats(img) });
    } catch {
      perPhoto.push({ name: file.name, stats: null });
    }
  }

  const valid = perPhoto.filter((p) => p.stats);
  const avg = (key) =>
    valid.length ? valid.reduce((s, p) => s + p.stats[key], 0) / valid.length : 0;

  const summary = {
    green: avg("green"),
    yellow: avg("yellow"),
    brown: avg("brown"),
    dark: avg("dark"),
    pale: avg("pale"),
    sat: avg("sat"),
    bright: avg("bright"),
    spots: avg("spots"),
    photoCount: files.length,
    perPhoto
  };

  const issues = [];
  if (summary.yellow > 0.14 || (summary.yellow > 0.08 && summary.green < 0.28)) {
    issues.push("chlorosis");
  }
  if (summary.brown > 0.1 || summary.dark > 0.18) {
    issues.push(summary.bright < 0.38 ? "overwater" : "fungus");
  }
  if (summary.pale > 0.18 && summary.sat < 0.28) issues.push("lowlight");
  if (summary.bright > 0.62 && summary.brown > 0.06) issues.push("sunburn");
  if (summary.spots > 0.07 && summary.green > 0.15) issues.push("pests");
  if (summary.green < 0.18 && summary.brown > 0.05 && summary.yellow < 0.08) {
    issues.push("underwater");
  }
  if (!issues.length) {
    if (summary.green >= 0.32 && summary.yellow < 0.08 && summary.brown < 0.07) {
      issues.push("healthy");
    } else {
      issues.push("underwater");
    }
  }

  let score = 62;
  score += summary.green * 38;
  score -= summary.yellow * 55;
  score -= summary.brown * 70;
  score -= Math.max(0, summary.dark - 0.12) * 40;
  score -= summary.spots * 35;
  if (issues.includes("healthy")) score = Math.max(score, 78);
  else score = Math.min(score, 74);
  score = Math.round(Math.max(18, Math.min(96, score)));

  return { summary, issues: [...new Set(issues)], score, photoCount: files.length };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const comma = result.indexOf(",");
      resolve({
        mime: file.type || "image/jpeg",
        data: comma >= 0 ? result.slice(comma + 1) : result
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function identifyWithGemini(files, apiKey, note) {
  const parts = [
    {
      text: `Sen uzman bir bitki patoloğu, botanikçi ve bitki hemşiresisin. Fotoğraflar aynı bitkinin farklı açılarından.
Kullanıcı notu: ${note || "yok"}

Sadece geçerli JSON döndür, markdown yok. Şema:
{
  "yerelAd": "Türkçe yaygın ad",
  "latinceAd": "Latince",
  "sinif": "familya / sınıf",
  "boy": "tipik boy",
  "omur": "ömür",
  "guven": 0-100,
  "ihtiyaclar": {
    "isik": "",
    "su": "",
    "toprak": "",
    "nem": "",
    "sicaklik": "",
    "besin": ""
  },
  "saglikSkoru": 0-100,
  "saglikOzeti": "2-3 cümle Türkçe",
  "hastaliklar": [
    {
      "ad": "",
      "siddet": "hafif|orta|yüksek",
      "belirtiler": "",
      "neden": "",
      "cozum": ["adım1","adım2"],
      "sure": ""
    }
  ],
  "hemsireNotu": "kısa klinik özet"
}
Emin değilsen en olası türü yaz, guven'i düşür. Hastalık yoksa hastaliklar boş dizi veya koruyucu bakım olsun.
Tüm metinleri sade Türkçe yaz. turgor, kloroz, etiolasyon, NPK, pH gibi uzman terimleri kullanma; herkesin anlayacağı sözcükler seç.`
    }
  ];

  const limited = [...files].slice(0, 6);
  for (const file of limited) {
    const { mime, data } = await fileToBase64(file);
    parts.push({ inline_data: { mime_type: mime, data } });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
      })
    }
  );

  if (!res.ok) {
    try {
      await res.text();
    } catch {
      /* gövde okunamasa da kullanıcıya sade mesaj yeter */
    }
    throw new Error("Yapay zekâ yanıt vermedi. Anahtarı kontrol edin veya Ayarlar’dan silip anahtarsız deneyin.");
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") || "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Yapay zekâ çıktısı okunamadı. Biraz sonra yeniden deneyin.");
  return JSON.parse(match[0]);
}
