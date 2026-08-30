---
title: Sık sorulan sorular
description: Alanya çiçek buketi SSS. Teslimat, aynı gün kurye, ödeme, saatler, özel tasarım. Online sipariş balconyflowers.com.
permalink: /sss/
layout_faq: true
---

<nav class="crumbs wrap" aria-label="Sayfa yolu">
  <a href="{{ '/' | relative_url }}">Ana sayfa</a> / <span>SSS</span>
</nav>

<div class="wrap">
  <p class="kicker">Cevaplar</p>
  <h1>Sık sorulan sorular</h1>
  <p class="lead">Kısa sorular, düz cevaplar. Takıldığınız yeri WhatsApp’tan da sorun.</p>
  {% include shop-banner.html %}
  {% for item in site.data.sss %}
  <details>
    <summary>{{ item.q }}</summary>
    <p>{{ item.a }}</p>
  </details>
  {% endfor %}
</div>
