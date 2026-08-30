const state = {
  files: [],
  report: null,
  plan: null
};

const $ = (id) => document.getElementById(id);

function settings() {
  return {
    clinic: localStorage.getItem("yk_clinic") || "Balcony Flowers",
    apiKey: localStorage.getItem("yk_gemini") || "",
    notify: localStorage.getItem("yk_notify") === "1"
  };
}

function saveSettings() {
  const nameEl = $("clinicName");
  if (nameEl) localStorage.setItem("yk_clinic", nameEl.value.trim() || "Balcony Flowers");
  localStorage.setItem("yk_gemini", $("geminiKey").value.trim());
  const brand = $("brandTitle");
  if (brand) brand.textContent = settings().clinic;
  const msg = $("saveMsg");
  if (msg) {
    msg.hidden = false;
    setTimeout(() => {
      msg.hidden = true;
    }, 3500);
  }
}

function initBrand() {
  const brand = $("brandTitle");
  if (brand) brand.textContent = settings().clinic;
  const nameEl = $("clinicName");
  if (nameEl) nameEl.value = settings().clinic;
  $("geminiKey").value = settings().apiKey;
  document.querySelectorAll(".owner-only").forEach((el) => {
    el.hidden = true;
  });
}

function openGeminiModal() {
  $("geminiModal").hidden = false;
  document.body.classList.add("clinic-modal-open");
}

function closeGeminiModal() {
  $("geminiModal").hidden = true;
  document.body.classList.remove("clinic-modal-open");
}

function addFiles(list) {
  const incoming = [...list].filter((f) => f.type.startsWith("image/"));
  incoming.forEach((file) => {
    if (state.files.length >= 8) return;
    const angles = ANGLE_OPTIONS.map((a) => a.id);
    const used = state.files.map((x) => x.angle);
    const next = angles.find((a) => !used.includes(a)) || "leaf";
    state.files.push({ file, angle: next, url: URL.createObjectURL(file) });
  });
  renderThumbs();
}

function renderThumbs() {
  const box = $("thumbs");
  box.innerHTML = "";
  state.files.forEach((item, i) => {
    const el = document.createElement("div");
    el.className = "thumb";
    el.innerHTML = `
      <button class="x" type="button" data-i="${i}" aria-label="Kaldır">×</button>
      <img alt="" src="${item.url}">
      <select data-angle="${i}">
        ${ANGLE_OPTIONS.map((a) => `<option value="${a.id}" ${a.id === item.angle ? "selected" : ""}>${a.label}</option>`).join("")}
      </select>`;
    box.appendChild(el);
  });
  $("photoCount").textContent = state.files.length ? `${state.files.length} fotoğraf` : "Henüz fotoğraf yok";
}

function renderPlantList(filter) {
  const list = searchPlants(filter);
  $("plantList").innerHTML = list
    .map(
      (p, i) =>
        `<option value="${p.id}" ${i === 0 ? "selected" : ""}>${p.yerelAd} — ${p.latince}</option>`
    )
    .join("");
}

function healthLabel(score) {
  if (score >= 80) return "İyi — koruyucu bakım";
  if (score >= 60) return "Dikkat — izlenmeli";
  if (score >= 40) return "Tedavi gerekli";
  return "Acil bakım";
}

function renderReport() {
  const r = state.report;
  const p = state.plan;
  $("report").classList.add("on");
  $("scoreNum").textContent = r.saglikSkoru;
  $("scoreLabel").textContent = healthLabel(r.saglikSkoru);
  $("idName").textContent = r.yerelAd;
  $("idLatin").textContent = r.latinceAd;
  $("idMeta").innerHTML = `
    <div><i>Sınıf</i> ${esc(r.sinif)}</div>
    <div><i>Boy</i> ${esc(r.boy)}</div>
    <div><i>Ömür</i> ${esc(r.omur)}</div>
    <div><i>Eminlik</i> %${esc(r.guven)}</div>
    <div><i>Kaynak</i> ${r.kaynak === "yapay-zeka" ? "Yapay zekâ ve renk analizi" : "Renk analizi ve bitki listesi"}</div>`;
  const n = r.ihtiyaclar || {};
  $("needs").innerHTML = [
    ["Işık", n.isik],
    ["Su", n.su],
    ["Toprak", n.toprak],
    ["Nem", n.nem],
    ["Sıcaklık", n.sicaklik],
    ["Besin", n.besin]
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<div><b>${k}</b>${esc(v)}</div>`)
    .join("");

  $("healthText").textContent = r.saglikOzeti;
  $("diseases").innerHTML = (r.hastaliklar || [])
    .map((h) => {
      const ok = /yok|sağlıklı|belirtisi yok/i.test(h.ad);
      const steps = Array.isArray(h.cozum) ? h.cozum : String(h.cozum || "").split(/(?<=\.)\s+/);
      return `<article class="disease ${ok ? "ok" : ""}">
        <strong>${esc(h.ad)}</strong>
        ${h.siddet ? `<div>Şiddet: ${esc(h.siddet)}</div>` : ""}
        <p>${esc(h.belirtiler || "")}</p>
        <p><b>Neden:</b> ${esc(h.neden || "")}</p>
        <ol>${steps.filter(Boolean).map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
        <p><b>Süre:</b> ${esc(h.sure || "")}</p>
      </article>`;
    })
    .join("");

  $("process").innerHTML = p.surec
    .map(
      (s, i) => `<div class="tl">
        <div><div class="dot"></div>${i < p.surec.length - 1 ? '<div class="line"></div>' : ""}</div>
        <div><b>${esc(s.adım)}</b><div>${esc(s.aciklama)}</div></div>
      </div>`
    )
    .join("");

  $("supports").innerHTML = p.destekler
    .map(
      (d) => `<article><strong>${esc(d.ad)}</strong><p>${esc(d.neden)}</p><p>${esc(d.nasil)}</p></article>`
    )
    .join("");

  $("daily").innerHTML = p.gunlukKontrol
    .map((g) => `<div class="task"><time>${esc(g.saat)}</time><div><b>${esc(g.gorev)}</b><div>${esc(g.neden)}</div></div></div>`)
    .join("");

  renderCalendar();
  $("nurseNote").textContent = r.hemsireNotu || "";
  $("reportStamp").textContent = `${r.clinicName} · ${new Date(r.tarih).toLocaleString("tr-TR")}`;
  $("report").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCalendar() {
  const saved = JSON.parse(localStorage.getItem("yk_tasks") || "{}");
  $("calendar").innerHTML = state.plan.days
    .map((t) => {
      const done = saved[t.id] || t.done;
      t.done = done;
      return `<div class="task ${done ? "done" : ""}">
        <time>${esc(t.tarihYazi)}<br>${esc(t.saat)}</time>
        <div><b>${esc(t.baslik)}</b><div>${esc(t.detay)}</div></div>
        <button class="check" type="button" data-task="${t.id}">${done ? "Geri al" : "Tamam"}</button>
      </div>`;
    })
    .join("");
}

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function runExam() {
  if (!state.files.length) {
    alert("En az bir bitki fotoğrafı yükleyin. Farklı açılardan çekmek teşhisi güçlendirir.");
    return;
  }
  $("scan").classList.add("on");
  $("scanMsg").textContent = "Yaprak rengi, lekeler ve canlılık inceleniyor…";
  $("report").classList.remove("on");
  $("analyzeBtn").disabled = true;

  try {
    const files = state.files.map((x) => x.file);
    const vision = await analyzePhotos(files);
    const cfg = settings();
    const note = $("note").value.trim();
    const plantId = $("plantList").value;
    let plant = findPlantById(plantId) || guessPlantFromNote(note) || PLANT_CATALOG[0];

    let report;
    if (cfg.apiKey) {
      $("scanMsg").textContent = "Yapay zekâ fotoğrafları inceliyor…";
      try {
        const ai = await identifyWithGemini(files, cfg.apiKey, note);
        report = mergeAiReport(ai, vision, cfg.clinic, note);
      } catch (err) {
        console.warn(err);
        report = buildLocalReport({ plant, vision, note, clinicName: cfg.clinic });
        report.hemsireNotu =
          (report.hemsireNotu || "") +
          " Yapay zekâ anahtarı şu an kullanılamadı; rapor renk analizi ve bitki listesi ile hazırlandı.";
      }
    } else {
      report = buildLocalReport({ plant, vision, note, clinicName: cfg.clinic });
    }

    state.report = report;
    state.plan = buildCarePlan(report);
    localStorage.setItem("yk_last", JSON.stringify({ report, plan: state.plan }));
    renderReport();
    if (cfg.notify) scheduleNotifications(state.plan);
  } catch (err) {
    alert("Analiz tamamlanamadı. Fotoğrafları tekrar yükleyip deneyin.");
  } finally {
    $("scan").classList.remove("on");
    $("analyzeBtn").disabled = false;
  }
}

function scheduleNotifications(plan) {
  if (!("Notification" in window)) return;
  const setup = () => {
    plan.days.forEach((t) => {
      const when = new Date(t.tarih);
      const [h, m] = t.saat.split(":").map(Number);
      when.setHours(h || 9, m || 0, 0, 0);
      const ms = when.getTime() - Date.now();
      if (ms > 0 && ms < 7 * 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          new Notification(`${t.bitki} bakımı`, { body: `${t.saat} · ${t.baslik}` });
        }, ms);
      }
    });
  };
  if (Notification.permission === "granted") setup();
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((p) => {
      if (p === "granted") {
        localStorage.setItem("yk_notify", "1");
        setup();
      }
    });
  }
}

function bind() {
  const drop = $("drop");
  const file = $("file");
  drop.addEventListener("click", () => file.click());
  drop.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      file.click();
    }
  });
  file.addEventListener("change", () => addFiles(file.files));
  ["dragenter", "dragover"].forEach((ev) =>
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add("drag");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.remove("drag");
    })
  );
  drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

  $("thumbs").addEventListener("click", (e) => {
    const btn = e.target.closest(".x");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    URL.revokeObjectURL(state.files[i].url);
    state.files.splice(i, 1);
    renderThumbs();
  });
  $("thumbs").addEventListener("change", (e) => {
    if (e.target.matches("select[data-angle]")) {
      state.files[Number(e.target.dataset.angle)].angle = e.target.value;
    }
  });

  $("plantSearch").addEventListener("input", (e) => renderPlantList(e.target.value));
  $("analyzeBtn").addEventListener("click", runExam);
  $("printBtn").addEventListener("click", () => window.print());
  $("icsBtn").addEventListener("click", () => {
    if (!state.report) return;
    downloadText(
      `${state.report.yerelAd}-bakim-takvimi.ics`,
      buildICS(state.report, state.plan),
      "text/calendar;charset=utf-8"
    );
  });
  $("notifyBtn").addEventListener("click", () => {
    if (!state.plan) return;
    scheduleNotifications(state.plan);
    alert("Bu tarayıcı açıkken önümüzdeki 7 gün için bildirim denenecek. Kalıcı hatırlatma için “Telefon takvimine ekle”yi kullanın.");
  });
  $("calendar").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-task]");
    if (!btn || !state.plan) return;
    const saved = JSON.parse(localStorage.getItem("yk_tasks") || "{}");
    const id = btn.dataset.task;
    saved[id] = !saved[id];
    localStorage.setItem("yk_tasks", JSON.stringify(saved));
    renderCalendar();
  });

  $("settingsBtn").addEventListener("click", () => {
    $("settings").classList.toggle("on");
  });
  $("saveSettings").addEventListener("click", saveSettings);
  $("openGeminiHelp").addEventListener("click", openGeminiModal);
  $("closeGeminiHelp").addEventListener("click", closeGeminiModal);
  $("closeGeminiHelp2").addEventListener("click", closeGeminiModal);
  $("geminiModal").addEventListener("click", (e) => {
    if (e.target === $("geminiModal")) closeGeminiModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("geminiModal").hidden) closeGeminiModal();
  });

  renderPlantList("");
  initBrand();

  const last = localStorage.getItem("yk_last");
  if (last) {
    try {
      const parsed = JSON.parse(last);
      state.report = parsed.report;
      state.plan = parsed.plan;
      if (state.report && state.plan) renderReport();
    } catch {
      /* ignore */
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bind);
} else {
  bind();
}
