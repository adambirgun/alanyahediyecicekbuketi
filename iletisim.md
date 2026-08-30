---
title: İletişim
description: Balcony Flowers iletişim. WhatsApp 0552 379 83 73, Oba adres, info@balconyflowers.com. Online mağaza balconyflowers.com.
permalink: /iletisim/
redirect_from:
  - /iletisim
---

<nav class="crumbs wrap" aria-label="Sayfa yolu">
  <a href="{{ '/' | relative_url }}">Ana sayfa</a> / <span>İletişim</span>
</nav>

<div class="wrap split">
  <div>
    <p class="kicker">Yazın</p>
    <h1>Sipariş ve yol tarifi</h1>
    <p class="lead">Form, telefonunuzdaki WhatsApp sohbetini açar. Kartlı sipariş için <a href="{{ site.shop }}" rel="noopener noreferrer">balconyflowers.com</a>.</p>
    <form data-wa-form>
      <div class="hp" aria-hidden="true">
        <label>Website <input type="text" name="website" data-hp tabindex="-1" autocomplete="off"></label>
      </div>
      <label>Adınız <input name="ad" maxlength="80" required></label>
      <label>Mahalle
        <select name="mahalle">
          <option value="">Seçin</option>
          <option>Oba</option>
          <option>Tosmur</option>
          <option>Cikcilli</option>
          <option>Kestel</option>
          <option>Mahmutlar</option>
          <option>Konaklı</option>
          <option>Diğer / otel</option>
        </select>
      </label>
      <label>Buket notu <textarea name="not" rows="4" maxlength="500" placeholder="Bütçe, renk, teslim saati"></textarea></label>
      <button class="btn" type="submit">WhatsApp’ta gönder</button>
    </form>
  </div>
  <div>
    <ul class="facts">
      <li><span>WhatsApp</span><span><a href="https://wa.me/{{ site.whatsapp }}">{{ site.phone_display }}</a></span></li>
      <li><span>Telefon</span><span><a href="tel:{{ site.phone_tel }}">{{ site.phone_display }}</a></span></li>
      <li><span>E-posta</span><span><a href="mailto:{{ site.email }}">{{ site.email }}</a></span></li>
      <li><span>Adres</span><span>{{ site.address_street }}</span></li>
      <li><span>Harita</span><span><a href="{{ site.maps }}" rel="noopener noreferrer">Google</a></span></li>
      <li><span>Instagram</span><span><a href="{{ site.instagram }}" rel="noopener noreferrer me">@{{ site.instagram_handle }}</a></span></li>
      <li><span>Online mağaza</span><span><a href="{{ site.shop }}" rel="noopener noreferrer">balconyflowers.com</a></span></li>
    </ul>
  </div>
</div>
