---
title: Alanya çiçek buketi
description: Alanya çiçek buketi. Balcony Flowers, Oba ve Alanyum AVM. Ücretsiz kapıya teslim, WhatsApp 0552 379 83 73. Online sipariş balconyflowers.com.
permalink: /
redirect_from:
  - /ana-sayfa
  - /ana-sayfa/
date_modified: "2026-08-28"
---

<section class="hero wrap">
  <p class="kicker">Oba · Alanyum AVM · Alanya</p>
  <h1>Alanya çiçek buketi</h1>
  <p class="lead">Balcony Flowers, Oba’daki tezgâhta kesme çiçekle buket kurar. Alanyum AVM’de hazır duranlar vardır. Alanya içinde kapıya ücretsiz bırakırız. WhatsApp’tan mahalleyi yazın; kartlı alışveriş için balconyflowers.com açık.</p>
  <div class="actions">
    <a href="https://wa.me/{{ site.whatsapp }}?text={{ 'Merhaba, Alanya için çiçek buketi sipariş etmek istiyorum.' | uri_escape }}">WhatsApp’tan yazın</a>
    <a class="ghost" href="{{ site.shop }}" rel="noopener noreferrer">balconyflowers.com</a>
    <a class="ghost" href="{{ '/buketler/' | relative_url }}">Buketlere bakın</a>
  </div>
  <p class="meta-row">
    <span>Mağaza {{ site.hours_store }}, her gün</span>
    <span>Teslimat {{ site.hours_delivery }}</span>
    <span>{{ site.phone_display }}</span>
  </p>
</section>

{% include shop-banner.html %}

<div class="wrap">
  <h2>Kısa cevap</h2>
  <p class="prose">Alanya’da çiçek buketi için Balcony Flowers. Tezgâh Oba’da, Çalış sitesi, Eczacılar Caddesi. İkinci durak Alanyum AVM içindeki köşe. Aynı gün kapıya 10:30–18:00. WhatsApp {{ site.phone_display }}. Kart ve sepet <a href="{{ site.shop }}" rel="noopener noreferrer">balconyflowers.com</a>’da.</p>

  <h2>Nasıl sipariş verilir</h2>
  <p class="prose">Üç yol var. Aynı gün ve özel tasarım için WhatsApp. Kart ve sepet için <a href="{{ site.shop }}" rel="noopener noreferrer">balconyflowers.com</a>. Görmek, dokunmak için Oba mağaza veya Alanyum köşesi. Sıra aynı: yer, saat, bütçe, fotoğraf teyidi, yola çıkış.</p>

  <div class="grid cards mt">
    <a class="card" href="{{ '/siparis/' | relative_url }}">
      <p class="kicker">Sipariş</p>
      <h3>WhatsApp, mağaza, online</h3>
      <p>Fotoğraflı teyit. Teslim saatini birlikte kilitleriz.</p>
    </a>
    <a class="card" href="{{ '/teslimat/' | relative_url }}">
      <p class="kicker">Teslimat</p>
      <h3>Alanya içi kapıya, ücretsiz</h3>
      <p>Oba–Tosmur hattı aynı gün. Uzak mahallede önce teyit.</p>
    </a>
    <a class="card" href="{{ '/magazalar/' | relative_url }}">
      <p class="kicker">İki nokta</p>
      <h3>Oba atölye, Alanyum köşe</h3>
      <p>Özel tasarım Oba’da. Hazır buket AVM’de.</p>
    </a>
    <a class="card" href="{{ '/bitki-doktoru/' | relative_url }}">
      <p class="kicker">Saksı</p>
      <h3>Bitki doktoru</h3>
      <p>Fotoğraftan bakım önerisi. Buket siparişi değildir.</p>
    </a>
  </div>

  <h2>Buketler</h2>
  <p class="note">Aşağıdaki fiyatlar vitrin örneğidir. Güncel tutar ve stok için WhatsApp veya balconyflowers.com.</p>
  <div class="grid cards">
    {% for item in site.buketler %}
    <a class="card" href="{{ item.url | relative_url }}">
      <div class="figure">{% include flower.svg %}</div>
      <h3>{{ item.title }}</h3>
      <p class="price">{{ item.price_display }}</p>
      <p>{{ item.lead }}</p>
    </a>
    {% endfor %}
  </div>

  <h2>Sık sorulanlar</h2>
  {% for item in site.data.sss limit:4 %}
  <details>
    <summary>{{ item.q }}</summary>
    <p>{{ item.a }}</p>
  </details>
  {% endfor %}
  <p><a href="{{ '/sss/' | relative_url }}">Tüm sorular</a></p>

  <h2>Neredeyiz</h2>
  <div class="prose">
    <p>{{ site.address_street }}, {{ site.postal }} {{ site.city }}/{{ site.region }}. İkinci nokta Alanyum AVM içindeki Balcony Corner. Telefon {{ site.phone_display }}. E-posta {{ site.email }}. <a href="{{ site.maps }}" rel="noopener noreferrer">Haritada aç</a>.</p>
  </div>
</div>
