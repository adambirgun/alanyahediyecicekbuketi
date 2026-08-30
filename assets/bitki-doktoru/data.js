const PLANT_CATALOG = [
  {
    id: "monstera",
    yerelAd: "Deve Tabanı",
    latince: "Monstera deliciosa",
    sinif: "Araceae · Çiçekli bitkiler",
    boy: "İç mekânda 1–3 m",
    omur: "10–40 yıl",
    tags: ["delik", "yırtık", "geniş yaprak", "salon", "tırmanıcı"],
    ihtiyaclar: {
      isik: "Parlak dolaylı ışık; doğrudan öğle güneşi yakar.",
      su: "Toprağın üst 3–4 cm’i kuruyunca sulayın. Kışın seyreltin.",
      toprak: "Havalı, turba + perlit + kabuk karışımı.",
      nem: "%50–70; yaprakları zaman zaman silin.",
      sicaklik: "18–27 °C; 15 °C altını sevmez.",
      besin: "İlkbahar–yaz ayda bir yarı doz yeşil bitki gübresi."
    }
  },
  {
    id: "pothos",
    yerelAd: "Salon Sarmaşığı",
    latince: "Epipremnum aureum",
    sinif: "Araceae · Çiçekli bitkiler",
    boy: "Sarkan/tırmanan 1–4 m",
    omur: "5–10+ yıl",
    tags: ["sarmaşık", "kalp yaprak", "sarı benek", "kolay"],
    ihtiyaclar: {
      isik: "Az–orta ışıkta yaşar; renkli yapraklar için parlak dolaylı ışık.",
      su: "Toprak neredeyse kuruyunca. Fazla su kök çürütür.",
      toprak: "Geçirgen salon bitkisi harcı.",
      nem: "Orta; kuru havada uçlar kahverengileşir.",
      sicaklik: "16–28 °C.",
      besin: "Büyüme döneminde 4–6 haftada bir."
    }
  },
  {
    id: "sansevieria",
    yerelAd: "Paşa Kılıcı / Kaynana Dili",
    latince: "Dracaena trifasciata",
    sinif: "Asparagaceae",
    boy: "30–120 cm",
    omur: "10+ yıl",
    tags: ["kılıç", "dik", "sert yaprak", "sukulent"],
    ihtiyaclar: {
      isik: "Az ışıktan güneşe kadar dayanıklı.",
      su: "Az sulayın; 2–4 haftada bir yeter. Kışın daha da az.",
      toprak: "Kaktüs/sukulent harcı, çok geçirgen.",
      nem: "Düşük neme dayanır.",
      sicaklik: "15–30 °C.",
      besin: "Yılda 2–3 kez zayıf gübre."
    }
  },
  {
    id: "spathiphyllum",
    yerelAd: "Barış Çiçeği",
    latince: "Spathiphyllum wallisii",
    sinif: "Araceae",
    boy: "30–80 cm",
    omur: "3–10 yıl",
    tags: ["beyaz çiçek", "parlak yaprak", "barış"],
    ihtiyaclar: {
      isik: "Orta, dolaylı ışık. Direkt güneş yakar.",
      su: "Toprak hafif nemli kalsın; kuruyunca yapraklar düşer.",
      toprak: "Organik, nem tutan ama durgun olmayan harç.",
      nem: "Yüksek nem sever.",
      sicaklik: "18–26 °C.",
      besin: "İlkbahar–yaz 3–4 haftada bir."
    }
  },
  {
    id: "ficus-lyrata",
    yerelAd: "Kemancı Yaprağı",
    latince: "Ficus lyrata",
    sinif: "Moraceae",
    boy: "1–3 m",
    omur: "10+ yıl",
    tags: ["keman", "büyük yaprak", "ficus"],
    ihtiyaclar: {
      isik: "Bol parlak dolaylı ışık; yerini sık değiştirmeyin.",
      su: "Üst toprak kuruyunca; eşit sulayın, tabakta su bırakmayın.",
      toprak: "Geçirgen, hafif asidik harç.",
      nem: "%40–60.",
      sicaklik: "18–27 °C; cereyan yok.",
      besin: "Büyüme döneminde ayda bir."
    }
  },
  {
    id: "ficus-elastica",
    yerelAd: "Kauçuk Ağacı",
    latince: "Ficus elastica",
    sinif: "Moraceae",
    boy: "1–4 m",
    omur: "15+ yıl",
    tags: ["kalın yaprak", "parlak", "kauçuk"],
    ihtiyaclar: {
      isik: "Parlak dolaylı ışık.",
      su: "Üst 3 cm kuruyunca.",
      toprak: "Geçirgen salon harcı.",
      nem: "Orta.",
      sicaklik: "16–28 °C.",
      besin: "İlkbahar–yaz ayda bir."
    }
  },
  {
    id: "aloe",
    yerelAd: "Aloe Vera",
    latince: "Aloe vera",
    sinif: "Asphodelaceae",
    boy: "30–90 cm",
    omur: "5–25 yıl",
    tags: ["sukulent", "dişli", "jel", "rozet"],
    ihtiyaclar: {
      isik: "Bol ışık; sabah güneşi ideal.",
      su: "Seyrek, derin sulama. Saksı tamamen kurusun.",
      toprak: "Kaktüs harcı + kaba kum.",
      nem: "Düşük.",
      sicaklik: "13–28 °C.",
      besin: "İlkbaharda bir kez zayıf gübre."
    }
  },
  {
    id: "orchid",
    yerelAd: "Kelebek Orkide",
    latince: "Phalaenopsis spp.",
    sinif: "Orchidaceae",
    boy: "20–70 cm",
    omur: "7–20 yıl (iyi bakımda)",
    tags: ["orkide", "çiçek sapı", "hava kökü"],
    ihtiyaclar: {
      isik: "Doğu penceresi, tül arkasında parlak ışık.",
      su: "Haftada 1; kabuk kuruyunca. Su gövdede birikmesin.",
      toprak: "Çam kabuğu / orkide harcı, asla bahçe toprağı değil.",
      nem: "%50–70.",
      sicaklik: "18–28 °C; gece 3–5 °C düşüş çiçeklenmeyi tetikler.",
      besin: "Zayıf orkide gübresi, 2 haftada bir (çiçekte daha seyrek)."
    }
  },
  {
    id: "areca",
    yerelAd: "Areka Palmiyesi",
    latince: "Dypsis lutescens",
    sinif: "Arecaceae",
    boy: "1–2,5 m",
    omur: "8–15 yıl",
    tags: ["palmiye", "tüy yaprak", "sarı sap"],
    ihtiyaclar: {
      isik: "Parlak dolaylı ışık.",
      su: "Düzenli ama suda bırakmadan.",
      toprak: "Geçirgen, hafif asidik.",
      nem: "Yüksek; kuru havada uç yanması olur.",
      sicaklik: "18–26 °C.",
      besin: "İlkbahar–yaz ayda bir palmiye gübresi."
    }
  },
  {
    id: "african-violet",
    yerelAd: "Afrika Menekşesi",
    latince: "Streptocarpus ionanthus",
    sinif: "Gesneriaceae",
    boy: "10–20 cm",
    omur: "2–5+ yıl",
    tags: ["menekşe", "tüylü yaprak", "küçük çiçek"],
    ihtiyaclar: {
      isik: "Parlak dolaylı; yaprağa soğuk su değmesin.",
      su: "Alttan sulama tercih edilir. Ilık su kullanın.",
      toprak: "Hafif, havalı menekşe harcı.",
      nem: "Yüksek ama yaprak ıslak kalmasın.",
      sicaklik: "18–24 °C.",
      besin: "Zayıf çiçek gübresi, 2 haftada bir."
    }
  },
  {
    id: "calathea",
    yerelAd: "Dua Çiçeği / Calathea",
    latince: "Goeppertia / Calathea spp.",
    sinif: "Marantaceae",
    boy: "30–90 cm",
    omur: "3–10 yıl",
    tags: ["desenli yaprak", "mor alt", "neme hassas"],
    ihtiyaclar: {
      isik: "Orta, dolaylı. Direkt güneş desenleri soldurur.",
      su: "Hafif nemli; kireçsiz / dinlenmiş su.",
      toprak: "Organik, nem tutan harç.",
      nem: "%60+ şart.",
      sicaklik: "18–27 °C.",
      besin: "Büyüme döneminde 4 haftada bir yarı doz."
    }
  },
  {
    id: "anthurium",
    yerelAd: "Flamingo Çiçeği",
    latince: "Anthurium andraeanum",
    sinif: "Araceae",
    boy: "30–70 cm",
    omur: "5–10 yıl",
    tags: ["kırmızı örtü yaprağı", "parlak", "antoryum"],
    ihtiyaclar: {
      isik: "Parlak dolaylı ışık.",
      su: "Üst toprak kuruyunca.",
      toprak: "Havalı, kabuklu salon bitkisi karışımı.",
      nem: "Yüksek.",
      sicaklik: "18–28 °C.",
      besin: "Çiçeklenmede fosfor ağırlıklı, 3–4 haftada bir."
    }
  },
  {
    id: "dieffenbachia",
    yerelAd: "Difenbahya",
    latince: "Dieffenbachia seguine",
    sinif: "Araceae",
    boy: "40–150 cm",
    omur: "5–10 yıl",
    tags: ["alacalı", "kalın gövde", "zehirli özsu"],
    ihtiyaclar: {
      isik: "Orta dolaylı ışık.",
      su: "Düzenli, toprak hafif nemli.",
      toprak: "Organik salon harcı.",
      nem: "Orta–yüksek.",
      sicaklik: "18–26 °C.",
      besin: "İlkbahar–yaz ayda bir."
    }
  },
  {
    id: "succulent",
    yerelAd: "Sukulent (Echeveria vb.)",
    latince: "Echeveria spp.",
    sinif: "Crassulaceae",
    boy: "5–25 cm",
    omur: "3–15 yıl",
    tags: ["rozet", "etli yaprak", "sukulent"],
    ihtiyaclar: {
      isik: "Bol ışık / sabah güneşi.",
      su: "Seyrek, toprak tam kuruyunca.",
      toprak: "Mineral, çok geçirgen.",
      nem: "Düşük.",
      sicaklik: "15–28 °C.",
      besin: "İlkbaharda zayıf sukulent gübresi."
    }
  },
  {
    id: "cactus",
    yerelAd: "Kaktüs",
    latince: "Cactaceae spp.",
    sinif: "Cactaceae",
    boy: "Türe göre 5 cm–2 m",
    omur: "10–100+ yıl",
    tags: ["diken", "etli gövde", "kaktüs"],
    ihtiyaclar: {
      isik: "Bol güneş.",
      su: "Yazın 2–3 haftada bir, kışın neredeyse hiç.",
      toprak: "Kaktüs harcı, drenaj delikli saksı.",
      nem: "Düşük.",
      sicaklik: "10–35 °C (türe göre).",
      besin: "Yaz başında bir kez."
    }
  },
  {
    id: "rose",
    yerelAd: "Gül",
    latince: "Rosa spp.",
    sinif: "Rosaceae",
    boy: "40 cm–3 m",
    omur: "15–50 yıl",
    tags: ["gül", "diken", "çiçek"],
    ihtiyaclar: {
      isik: "Günde en az 6 saat güneş.",
      su: "Kökten, düzenli; yaprakları ıslatmadan.",
      toprak: "Zengin, geçirgen, hafif asidik–nötr.",
      nem: "Hava akışı önemli (mantar önleme).",
      sicaklik: "15–28 °C ideal.",
      besin: "Çiçeklenme döneminde gül gübresi."
    }
  },
  {
    id: "lavender",
    yerelAd: "Lavanta",
    latince: "Lavandula angustifolia",
    sinif: "Lamiaceae",
    boy: "40–80 cm",
    omur: "8–15 yıl",
    tags: ["mor başak", "koku", "gri yaprak"],
    ihtiyaclar: {
      isik: "Tam güneş.",
      su: "Kuraklığa dayanıklı; fazla su öldürür.",
      toprak: "Kireçli, kumlu, çok geçirgen.",
      nem: "Düşük; sık ekim mantar yapar.",
      sicaklik: "Ilıman; kışın iyi drenaj.",
      besin: "Az gübre; fazla azot çiçeği azaltır."
    }
  },
  {
    id: "olive",
    yerelAd: "Zeytin",
    latince: "Olea europaea",
    sinif: "Oleaceae",
    boy: "Saksıda 1–3 m",
    omur: "50+ yıl",
    tags: ["gümüş yaprak", "odunsu", "zeytin"],
    ihtiyaclar: {
      isik: "Tam güneş.",
      su: "Kuruyunca derin sulama.",
      toprak: "Kireçli, taşlı, geçirgen.",
      nem: "Düşük–orta.",
      sicaklik: "Ilıman; don hassasiyeti türe göre.",
      besin: "İlkbaharda dengeli gübre."
    }
  },
  {
    id: "lemon",
    yerelAd: "Limon Ağacı",
    latince: "Citrus limon",
    sinif: "Rutaceae",
    boy: "Saksıda 1–2,5 m",
    omur: "20–50 yıl",
    tags: ["narenciye", "parlak yaprak", "diken"],
    ihtiyaclar: {
      isik: "Bol güneş, günde 6+ saat.",
      su: "Düzenli; toprak tamamen kurumadan.",
      toprak: "Hafif asidik, geçirgen narenciye harcı.",
      nem: "Orta–yüksek.",
      sicaklik: "15–30 °C; ani soğuk şoku yaprak döktürür.",
      besin: "Narenciye gübresi (demir + magnezyum önemli)."
    }
  },
  {
    id: "rosemary",
    yerelAd: "Biberiye",
    latince: "Salvia rosmarinus",
    sinif: "Lamiaceae",
    boy: "40–150 cm",
    omur: "8–20 yıl",
    tags: ["iğne yaprak", "koku", "odunsu"],
    ihtiyaclar: {
      isik: "Tam güneş.",
      su: "Az; toprak kuruyunca.",
      toprak: "Kumlu, geçirgen.",
      nem: "Düşük.",
      sicaklik: "10–28 °C.",
      besin: "Az gübre."
    }
  },
  {
    id: "geranium",
    yerelAd: "Sardunya",
    latince: "Pelargonium spp.",
    sinif: "Geraniaceae",
    boy: "20–60 cm",
    omur: "2–8 yıl",
    tags: ["sardunya", "yuvarlak yaprak", "balkon"],
    ihtiyaclar: {
      isik: "Bol ışık / sabah güneşi.",
      su: "Toprak kuruyunca; tabakta su bırakmayın.",
      toprak: "Geçirgen balkon harcı.",
      nem: "Orta; hava akışı olsun.",
      sicaklik: "12–28 °C.",
      besin: "Çiçek gübresi, 2 haftada bir."
    }
  },
  {
    id: "basil",
    yerelAd: "Fesleğen",
    latince: "Ocimum basilicum",
    sinif: "Lamiaceae",
    boy: "20–60 cm",
    omur: "Tek yıllık (ılıkta daha uzun)",
    tags: ["ot", "yumuşak yaprak", "mutfak"],
    ihtiyaclar: {
      isik: "Günde 6 saat ışık.",
      su: "Düzenli, toprak nemli; ıslak değil.",
      toprak: "Zengin, geçirgen.",
      nem: "Orta.",
      sicaklik: "18–30 °C; soğuğu sevmez.",
      besin: "Azot dengeli, 3 haftada bir."
    }
  },
  {
    id: "mint",
    yerelAd: "Nane",
    latince: "Mentha spp.",
    sinif: "Lamiaceae",
    boy: "20–80 cm",
    omur: "Çok yıllık",
    tags: ["nane", "yayılıcı", "koku"],
    ihtiyaclar: {
      isik: "Parlak ışık / yarı gölge.",
      su: "Nemli toprak; kurumaya hassas.",
      toprak: "Zengin, nem tutan.",
      nem: "Orta–yüksek.",
      sicaklik: "15–26 °C.",
      besin: "Hafif gübre, ayda bir."
    }
  },
  {
    id: "zz",
    yerelAd: "ZZ Bitkisi",
    latince: "Zamioculcas zamiifolia",
    sinif: "Araceae",
    boy: "40–90 cm",
    omur: "5–15 yıl",
    tags: ["parlak yaprakçık", "yumru", "kolay"],
    ihtiyaclar: {
      isik: "Az–orta ışık.",
      su: "Çok seyrek; yumru su depolar.",
      toprak: "Geçirgen.",
      nem: "Düşük–orta.",
      sicaklik: "16–28 °C.",
      besin: "Yılda 2 kez yeter."
    }
  },
  {
    id: "pilea",
    yerelAd: "Pilea / Çin Para Bitkisi",
    latince: "Pilea peperomioides",
    sinif: "Urticaceae",
    boy: "20–40 cm",
    omur: "3–10 yıl",
    tags: ["yuvarlak yaprak", "para", "pilea"],
    ihtiyaclar: {
      isik: "Parlak dolaylı; saksıyı çevirin ki düzgün dursun.",
      su: "Üst toprak kuruyunca.",
      toprak: "Havalı salon harcı.",
      nem: "Orta.",
      sicaklik: "16–24 °C.",
      besin: "Büyüme döneminde ayda bir."
    }
  }
];

const DISEASES = {
  overwater: {
    id: "overwater",
    ad: "Aşırı sulama / kök stresi",
    siddetSablon: "orta–yüksek",
    belirtiler: "Sararma, yumuşak gövde, sürekli ıslak toprak, küf kokusu, alt yaprakların dökülmesi.",
    neden: "Kökler havasız kalır; çürüme ve mantar başlar.",
    cozum: [
      "Sulamayı hemen kesin. Toprağın en az 4–5 cm’inin kurumasına izin verin.",
      "Saksı tabağındaki durgun suyu boşaltın.",
      "Gerekirse bitkiyi söküp çürük, kahverengi-siyah, cıvık kökleri steril makasla kesin.",
      "Geçirgen taze harca, drenaj delikli saksıya aktarın.",
      "İlk 7–10 gün gölge-dolaylı ışıkta tutun, gübre vermeyin."
    ],
    sure: "Hafif vakada 10–14 gün, kök çürümesinde 3–6 hafta."
  },
  underwater: {
    id: "underwater",
    ad: "Susuzluk / düzensiz sulama",
    siddetSablon: "hafif–orta",
    belirtiler: "Solgunluk, gevreklik, kahverengi kuru uçlar, toprağın saksı kenarından çekilmesi.",
    neden: "Yapraklar su kaybedip dik duramaz; uçlar kurur.",
    cozum: [
      "Oda ılıklığında bolca sulayın; fazla suyun delikten akmasını bekleyin.",
      "Çok kurumuş toprağı 10 dakika ılık suya oturtun (saksıyı su dolu kaba koyun), sonra çıkarın.",
      "Bundan sonra parmak testi yapın: üst 2–3 cm kuruyunca sulayın.",
      "Kuru uçları kesin; ölü doku yeniden yeşermez."
    ],
    sure: "24–72 saatte toparlanma başlar; uçlar kalıcı olabilir."
  },
  chlorosis: {
    id: "chlorosis",
    ad: "Sararma (demir, magnezyum veya azot eksikliği)",
    siddetSablon: "orta",
    belirtiler: "Damarlar yeşil kalıp yaprak sarılaşır veya tüm yaprak soluk yeşil görünür.",
    neden: "Kireçli su, yetersiz gübre veya kök hasarı yüzünden bitki besini alamaz.",
    cozum: [
      "Sulama suyunu bir gece dinlendirin veya süzün (kireç azalır).",
      "Damar arası sarıysa demir katkılı gübre; her yer soluksa dengeli yeşil bitki gübresi verin (yarı doz).",
      "Kök çürüğü varsa önce onu tedavi edin; hasta köke gübre vermeyin.",
      "Limon ve dua çiçeğinde kireçsiz su özellikle önemlidir."
    ],
    sure: "Yeni yapraklar 2–4 haftada yeşile döner; eski sarı yapraklar genelde düzelmez."
  },
  sunburn: {
    id: "sunburn",
    ad: "Güneş yanığı / ışık şoku",
    siddetSablon: "hafif–orta",
    belirtiler: "Beyaz-bej lekeler, kuru kahverengi yama, ani solma.",
    neden: "Direkt öğle güneşi veya gölgeden birden güney penceresine taşıma.",
    cozum: [
      "Bitkiyi parlak ama dolaylı ışığa alın; tül kullanın.",
      "Yanık dokuyu kesmeyin hemen — sağlam dokuyu korur. Tamamen ölüyse temizleyin.",
      "Yeni yere 7–10 günde kademeli alıştırın."
    ],
    sure: "Yeni sağlıklı yaprak 3–6 hafta."
  },
  lowlight: {
    id: "lowlight",
    ad: "Yetersiz ışık",
    siddetSablon: "hafif",
    belirtiler: "Cılız uzama, soluk renk, çiçek yok, küçük yaprak.",
    neden: "Işık yetmez; bitki pencereye doğru zayıf uzar.",
    cozum: [
      "Daha aydınlık bir pencereye alın veya bitki lambası kullanın (günde 10–12 saat).",
      "Sulamayı azaltın; az ışıkta su daha yavaş biter.",
      "Cılız uzayan sapları kısaltın."
    ],
    sure: "Yeni kompakt gelişim 3–8 hafta."
  },
  pests: {
    id: "pests",
    ad: "Zararlı şüphesi (unlu bit, kırmızı örümcek, yaprak biti)",
    siddetSablon: "orta",
    belirtiler: "İnce ağ, yapışkan ballı madde, beyaz pamuksu kümeler, beneklenme, yaprak altı hareket.",
    neden: "Kuru hava, stres, bulaşma.",
    cozum: [
      "Bitkiyi diğerlerinden ayırın.",
      "Yaprak altını nemli bezle silin; duşta ılık su ile durulayın (orkide çiçeğine dikkat).",
      "Neem (hint) yağı veya sabunlu su (1 litre suya 1 çay kaşığı arap sabunu) 5–7 günde 3 kez uygulayın.",
      "Unlu bitte pamuk + alkol ile tek tek temizleyin.",
      "Kırmızı örümcekte nemi yükseltin."
    ],
    sure: "3 haftalık takip; yumurta döngüsü nedeniyle tek uygulama yetmez."
  },
  fungus: {
    id: "fungus",
    ad: "Yaprak lekesi / mantar",
    siddetSablon: "orta–yüksek",
    belirtiler: "Kahverengi-siyah halkalı lekeler, sarı hale, küf, yaprak çürümesi.",
    neden: "Islak yaprak + durgun hava + fazla nem.",
    cozum: [
      "Hasta yaprakları temizleyip ev dışı çöpe atın (kompostlamayın).",
      "Hava akışı sağlayın; yaprakları ıslatarak sulamayın.",
      "Bakırlı veya türe uygun bitki mantar ilacını etiket dozunda kullanın.",
      "Sulama sıklığını düşürün."
    ],
    sure: "Yayılma 7–10 günde durur; izler kalıcı olabilir."
  },
  edema: {
    id: "edema",
    ad: "Ödem (su kabarcığı)",
    siddetSablon: "hafif",
    belirtiler: "Yaprak altında su dolu kabarcıklar. Mantar değildir.",
    neden: "Kökler, yaprağın kullanabileceğinden daha hızlı su alır.",
    cozum: [
      "Sulama aralığını açın.",
      "Işığı biraz artırın.",
      "Kabarcıkları koparmayın."
    ],
    sure: "Yeni yapraklar sağlıklı çıkar; eski iz kalabilir."
  },
  healthy: {
    id: "healthy",
    ad: "Aktif hastalık belirtisi yok",
    siddetSablon: "yok",
    belirtiler: "Canlı yeşil, yapraklar dik, uç yanığı yok veya çok az.",
    neden: "Bakım genel olarak uygun; koruyucu rutin yeterli.",
    cozum: [
      "Mevcut ışık-su dengesini koruyun.",
      "Ayda bir yaprak silme ve zararlı kontrolü yapın.",
      "Mevsime göre gübre ve sulamayı ayarlayın."
    ],
    sure: "Koruyucu bakım süreklidir."
  }
};

const ANGLE_OPTIONS = [
  { id: "front", label: "Ön" },
  { id: "side", label: "Yan" },
  { id: "top", label: "Üst" },
  { id: "leaf", label: "Yaprak yakını" },
  { id: "soil", label: "Toprak / saksı" },
  { id: "stem", label: "Gövde" },
  { id: "flower", label: "Çiçek" },
  { id: "damage", label: "Sorunlu bölge" }
];
