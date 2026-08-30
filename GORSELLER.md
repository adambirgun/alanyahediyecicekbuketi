# Görseller rehberi

Bu dosya sitede **görünmez**. Fotoğraf adı, hedef boyut ve klasör yolu içindir. Yapay stok çiçek kullanmayın; Oba tezgâhında çekilmiş gerçek buket koyun.

Yayına aldıktan sonra WhatsApp ve Google önizlemesi için `og.png` şart. SVG paylaşım kartı çoğu uygulamada boş veya kırık çıkar.

## Şu an repoda olanlar

| Dosya adı | Konum | Tür | Yaklaşık ölçü | Not |
| --- | --- | --- | --- | --- |
| `og.svg` | `assets/img/og.svg` | SVG | 1200 × 630 (viewBox) | Geçici paylaşım görseli. **PNG ile değiştirin.** |
| `favicon.svg` | `assets/img/favicon.svg` | SVG | kare, ölçeklenir | Tarayıcı ikonu. İsterseniz 512 × 512 PNG ekleyin. |
| `README.txt` | `assets/img/buketler/README.txt` | metin | — | Kısa hatırlatma; asıl liste bu dosyadır. |

Buket JPG’leri henüz yok. Aşağıdaki adlarla aynı klasöre koyunca ürün sayfasındaki çizim yerine fotoğraf alınır (kurulum notu en altta).

## Hedef: paylaşım ve ikon

| Dosya adı | Konum | Ölçü (px) | Ağırlık | Ne işe yarar |
| --- | --- | --- | --- | --- |
| `og.png` | `assets/img/og.png` | **1200 × 630** | 150–250 KB, sRGB | WhatsApp, Facebook, Google kartı. Buket + “Balcony Flowers Alanya” yazısı yeter. |
| `favicon-512.png` | `assets/img/favicon-512.png` | **512 × 512** | &lt; 80 KB | İsteğe bağlı; `site.webmanifest` ve Apple ikonu. |
| `favicon.svg` | `assets/img/favicon.svg` | kare SVG | küçük kalsın | Mevcut ikon; silmeyin. |

`og.png` koyduktan sonra `_includes/head.html` içindeki `og.svg` yollarını `og.png` yapın.

## Hedef: buket fotoğrafları

Hepsi: `assets/img/buketler/`

Ölçü: **1600 × 1200** (4:3, yatay). sRGB JPEG, kalite 80–85, dosya başına **200–400 KB**. Dikey çektiyseniz 4:3’e kırpın; kenarda tezgâh dağınık kalmasın.

| Dosya adı | Ürün sayfası | Konu |
| --- | --- | --- |
| `gul-buketi.jpg` | `/buketler/gul-buketi/` | Gül buketi, o günün dalı |
| `kir-buketi.jpg` | `/buketler/kir-buketi/` | Mevsim kır |
| `papatya-buketi.jpg` | `/buketler/papatya-buketi/` | Küçük papatya |
| `papatya-buketi-l.jpg` | `/buketler/papatya-buketi-l/` | Büyük papatya |
| `rengarenk-buket.jpg` | `/buketler/rengarenk-buket/` | Karışık renk |
| `aycicek-buketi.jpg` | `/buketler/aycicek-buketi/` | Ayçiçeği |
| `kalp-vazoda-papatya-gul.jpg` | `/buketler/kalp-vazoda-papatya-gul/` | Vazoda papatya ve gül |
| `isikli-kalp-buketi.jpg` | `/buketler/isikli-kalp-buketi/` | Işıklı kalp |
| `isiltili-gul-buketi.jpg` | `/buketler/isiltili-gul-buketi/` | Işıltılı gül |
| `lavanta-kutusu.jpg` | `/buketler/lavanta-kutusu/` | Lavanta kutusu |

Dosya adı **küçük harf, Türkçe karakter yok**, tam olarak yukarıdaki gibi olmalı. `Işıklı` değil `isikli`.

## İsteğe bağlı mağaza fotoğrafları

| Dosya adı | Konum | Ölçü | Nerede kullanılır |
| --- | --- | --- | --- |
| `oba-magaza.jpg` | `assets/img/oba-magaza.jpg` | 1600 × 1200 | `/magazalar/oba/` — vitrin veya tezgâh |
| `alanyum-kose.jpg` | `assets/img/alanyum-kose.jpg` | 1600 × 1200 | `/magazalar/alanyum/` — AVM köşesi |

Bu ikisini koyunca ilgili `.md` dosyasına şöyle bir satır ekleyin:

```html
<img src="{{ '/assets/img/oba-magaza.jpg' | relative_url }}" width="1600" height="1200" alt="Balcony Flowers Oba tezgâhı">
```

## Ürün sayfasında fotoğrafı açmak

Fotoğraflar klasöre girdikten sonra `_layouts/product.html` içindeki SVG bloğunu bununla değiştirin:

```html
<img src="{{ '/assets/img/buketler/' | append: page.slug | append: '.jpg' | relative_url }}" width="1600" height="1200" alt="{{ page.title }}">
```

Ana sayfa ve `/buketler/` kartlarındaki küçük çizim için aynı dosyayı 800 × 600 kırpılmış kopya olarak `assets/img/buketler/thumbs/` altına koymaya gerek yok; tarayıcı büyüğü küçültür. İsterseniz thumb için **800 × 600**, aynı dosya adı.

## Çekim notu

- Gün ışığı veya vitrin ışığı; sarı filtre yok.
- Telefon yeter; 12 MP civarı, HDR kapalı daha doğal durur.
- Logo, fiyat etiketi, rastgele el fotoğrafta olmasın.
- Aynı buketi her gün yeniden çekmeyin; stok değişince bir kare güncelleyin.
