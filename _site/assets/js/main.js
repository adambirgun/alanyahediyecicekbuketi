(function () {
  "use strict";

  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var form = document.querySelector("[data-wa-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var trap = form.querySelector("[data-hp]");
      if (trap && trap.value) {
        return;
      }
      var name = (form.querySelector("[name='ad']") || {}).value || "";
      var mahalle = (form.querySelector("[name='mahalle']") || {}).value || "";
      var not = (form.querySelector("[name='not']") || {}).value || "";
      var parts = [
        "Merhaba, Alanya Hediye Çiçek Buketi / Balcony Flowers.",
        name ? "Ad: " + name : "",
        mahalle ? "Mahalle: " + mahalle : "",
        not ? "İstek: " + not : ""
      ].filter(Boolean);
      var url = "https://wa.me/905523798373?text=" + encodeURIComponent(parts.join("\n"));
      window.location.assign(url);
    });
  }
})();
