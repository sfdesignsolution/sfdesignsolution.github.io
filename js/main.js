/* ==========================================================================
   SF Design Solution — Site Interactions
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var body = doc.body;

  /* -------- Header shadow on scroll -------- */
  var header = doc.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------- Mobile navigation -------- */
  var toggle = doc.querySelector(".nav__toggle");
  var navMenu = doc.querySelector(".nav__menu");

  function closeNav() {
    body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && navMenu) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    navMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* -------- Active nav link by current file -------- */
  var path = window.location.pathname.split("/").pop() || "index.html";
  doc.querySelectorAll(".nav__link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var target = href.split("#")[0].split("/").pop();
    if (target === path) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* -------- Scroll reveal -------- */
  var revealEls = doc.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* -------- Animated counters -------- */
  var counters = doc.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          var decimals = (String(target).split(".")[1] || "").length;
          var duration = 1400;
          var start = null;

          function tick(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var value = (target * eased).toFixed(decimals);
            el.textContent = value + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
          }
          requestAnimationFrame(tick);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* -------- Portfolio filter -------- */
  var filterBtns = doc.querySelectorAll(".filter[data-filter]");
  var galleryItems = doc.querySelectorAll(".gallery__item");
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        galleryItems.forEach(function (item) {
          var cat = item.getAttribute("data-category") || "";
          var show = key === "all" || cat.split(" ").indexOf(key) !== -1;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* -------- Lightbox -------- */
  var lb = doc.querySelector(".lightbox");
  if (lb && galleryItems.length) {
    var lbImg = lb.querySelector("img");
    var itemsArr = Array.prototype.slice.call(galleryItems);
    var current = 0;

    function show(index) {
      var visible = itemsArr.filter(function (i) { return !i.classList.contains("is-hidden"); });
      if (!visible.length) return;
      current = (index + visible.length) % visible.length;
      var img = visible[current].querySelector("img");
      lbImg.src = img.getAttribute("data-full") || img.src;
      lbImg.alt = img.alt || "";
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      body.classList.add("nav-open");
    }

    function hide() {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      body.classList.remove("nav-open");
    }

    function move(dir) {
      var visible = itemsArr.filter(function (i) { return !i.classList.contains("is-hidden"); });
      current = (current + dir + visible.length) % visible.length;
      var img = visible[current].querySelector("img");
      lbImg.src = img.getAttribute("data-full") || img.src;
      lbImg.alt = img.alt || "";
    }

    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var visible = itemsArr.filter(function (i) { return !i.classList.contains("is-hidden"); });
        show(visible.indexOf(item));
      });
    });

    lb.querySelector(".lightbox__close").addEventListener("click", hide);
    lb.querySelector(".lightbox__nav--next").addEventListener("click", function (e) { e.stopPropagation(); move(1); });
    lb.querySelector(".lightbox__nav--prev").addEventListener("click", function (e) { e.stopPropagation(); move(-1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) hide(); });

    doc.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    });
  }

  /* -------- Contact form (static-site friendly) -------- */
  var form = doc.querySelector("form[data-form]");
  if (form) {
    var success = form.querySelector(".form__success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var endpoint = form.getAttribute("data-endpoint");

      if (endpoint) {
        var data = new FormData(form);
        fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        })
          .then(function (r) {
            if (!r.ok) throw new Error("Request failed");
            form.reset();
            if (success) success.classList.add("is-visible");
          })
          .catch(function () {
            alert("Maaf, penghantaran gagal. Sila hubungi kami melalui WhatsApp.");
          });
      } else {
        var name = (form.querySelector("[name=name]") || {}).value || "";
        var phone = (form.querySelector("[name=phone]") || {}).value || "";
        var service = (form.querySelector("[name=service]") || {}).value || "Interior Design";
        var message = (form.querySelector("[name=message]") || {}).value || "";
        var text =
          "Hi SF Design Solution, saya " + name +
          ". Saya berminat dengan servis " + service + "." +
          (message ? "\n\n" + message : "") +
          "\n\nNo. tel: " + phone;
        window.open("https://wa.me/60197630972?text=" + encodeURIComponent(text), "_blank");
        form.reset();
        if (success) success.classList.add("is-visible");
      }
    });
  }

  /* -------- Footer year -------- */
  var yearEl = doc.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
