/* =========================================================
   Natalia Cardoso — Memorial Website
   main.js
   =========================================================
   Sections:
   1. Language handling (splash + persistent switch)
   2. Mobile nav toggle
   3. Gallery build + horizontal scroll controls
   4. Lightbox
   ========================================================= */

   (function () {
    "use strict";
  
    var LANG_KEY = "natalia-memorial-lang";
  
    /* ---------------------------------------------------------
       1. LANGUAGE
       --------------------------------------------------------- */
    var html = document.documentElement;
    var splash = document.getElementById("splash");
    var site = document.getElementById("site");
  
    function setLang(lang) {
      if (lang !== "pt" && lang !== "es") lang = "pt";
      html.setAttribute("data-lang", lang);
      html.setAttribute("lang", lang);
      try { sessionStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage unavailable, ignore */ }
  
      document.querySelectorAll(".lang-switch-btn").forEach(function (btn) {
        var isCurrent = btn.getAttribute("data-select-lang") === lang;
        btn.setAttribute("aria-current", isCurrent ? "true" : "false");
      });
    }
  
    var SPLASH_FADE_MS = 750; // keep in sync with .splash transition duration in style.css
    var prefersReducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    function enterSite(lang) {
      setLang(lang);
  
      function reveal() {
        splash.hidden = true;
        site.hidden = false;
        site.classList.add("is-entering");
      }
  
      if (prefersReducedMotion) {
        reveal();
        return;
      }
  
      splash.classList.add("is-hiding");
      setTimeout(reveal, SPLASH_FADE_MS);
    }
  
    function enterSiteImmediately(lang) {
      setLang(lang);
      splash.hidden = true;
      site.hidden = false;
    }
  
    // Wire up every language button (splash buttons + header switcher)
    document.querySelectorAll("[data-select-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-select-lang");
        if (site.hidden) {
          enterSite(lang);
        } else {
          setLang(lang);
        }
      });
    });
  
    // If a language was already chosen this visit, skip the splash
    var storedLang = null;
    try { storedLang = sessionStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
    if (storedLang === "pt" || storedLang === "es") {
      enterSiteImmediately(storedLang);
    } else {
      setLang("pt");
    }
  
    /* ---------------------------------------------------------
       2. MOBILE NAV
       --------------------------------------------------------- */
    var navToggle = document.querySelector(".nav-toggle");
    var primaryNav = document.getElementById("primary-nav");
  
    if (navToggle && primaryNav) {
      navToggle.addEventListener("click", function () {
        var isOpen = primaryNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
  
      // Close mobile nav after choosing a section
      primaryNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          primaryNav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  
    /* ---------------------------------------------------------
       3. GALLERY
       --------------------------------------------------------- */
    var GALLERY_COUNT = 52;          // gallery1.jpg ... gallery52.jpg
    var GALLERY_EXT = "jpeg";        // change if files use a different extension
    var galleryTrack = document.getElementById("gallery-track");
    var galleryImages = []; // { src, alt }
  
    if (galleryTrack) {
      for (var i = 1; i <= GALLERY_COUNT; i++) {
        var src = "images/gallery" + i + "." + GALLERY_EXT;
        var altPt = "Momento " + i + " da vida de Natalia Cardoso";
        galleryImages.push({ src: src, altPt: altPt });
  
        var li = document.createElement("li");
        li.className = "gallery-item";
  
        var btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-index", String(i - 1));
        btn.setAttribute("aria-label", altPt);
  
        var img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
  
        btn.appendChild(img);
        li.appendChild(btn);
        galleryTrack.appendChild(li);
      }
  
      galleryTrack.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-index]");
        if (!btn) return;
        openLightbox(parseInt(btn.getAttribute("data-index"), 10));
      });
  
      var prevArrow = document.querySelector(".gallery-arrow-prev");
      var nextArrow = document.querySelector(".gallery-arrow-next");
      function scrollGallery(dir) {
        var item = galleryTrack.querySelector(".gallery-item");
        var step = item ? item.getBoundingClientRect().width + 16 : 220;
        galleryTrack.scrollBy({ left: dir * step * 2, behavior: "smooth" });
      }
      if (prevArrow) prevArrow.addEventListener("click", function () { scrollGallery(-1); });
      if (nextArrow) nextArrow.addEventListener("click", function () { scrollGallery(1); });
  
      var scrollHint = document.getElementById("gallery-scroll-hint");
      if (scrollHint) {
        var dismissHint = function () {
          scrollHint.classList.add("is-dismissed");
          galleryTrack.removeEventListener("scroll", dismissHint);
        };
        galleryTrack.addEventListener("scroll", dismissHint, { passive: true });
      }
    }
  
    /* ---------------------------------------------------------
       4. LIGHTBOX
       --------------------------------------------------------- */
    var lightbox = document.getElementById("lightbox");
    var lightboxImage = document.getElementById("lightbox-image");
    var currentIndex = 0;
    var lastFocusedElement = null;
  
    function openLightbox(index) {
      if (!galleryImages.length) return;
      currentIndex = index;
      updateLightboxImage();
      lastFocusedElement = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      var closeBtn = lightbox.querySelector("[data-lightbox-close]");
      if (closeBtn) closeBtn.focus();
      document.addEventListener("keydown", onLightboxKeydown);
    }
  
    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onLightboxKeydown);
      if (lastFocusedElement) lastFocusedElement.focus();
    }
  
    function updateLightboxImage() {
      var item = galleryImages[currentIndex];
      if (!item) return;
      lightboxImage.src = item.src;
      lightboxImage.alt = item.altPt;
    }
  
    function showNext() {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateLightboxImage();
    }
    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImage();
    }
  
    function onLightboxKeydown(e) {
      if (e.key === "Escape") { closeLightbox(); }
      else if (e.key === "ArrowRight") { showNext(); }
      else if (e.key === "ArrowLeft") { showPrev(); }
      else if (e.key === "Tab") {
        // simple focus trap among the three lightbox controls
        var focusables = lightbox.querySelectorAll("button");
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }
  
    if (lightbox) {
      lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
      lightbox.querySelector("[data-lightbox-next]").addEventListener("click", showNext);
      lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", showPrev);
  
      // Click outside the image (on the dark backdrop) also closes it
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }
  
    /* ---------------------------------------------------------
       5. SECTION REVEAL ON SCROLL
       --------------------------------------------------------- */
    var revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length) {
      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      } else {
        var revealObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  
        revealEls.forEach(function (el) { revealObserver.observe(el); });
      }
    }
  
    /* ---------------------------------------------------------
       6. FLOATING "MEMORIAL INFO" BUTTON
       --------------------------------------------------------- */
    var memorialFab = document.getElementById("memorial-fab");
    var heroSection = document.getElementById("inicio");
  
    // Hidden while on the hero, AND for the entire closing stretch of the
    // page (Memorial info onward) so it never overlaps the memorial card,
    // the thank-you message, or the footer name/dates.
    var fabHideZoneIds = ["memorial", "mensagem", "site-footer"];
  
    if (memorialFab && heroSection && "IntersectionObserver" in window) {
      var heroVisible = true;
      var hideZoneVisible = {};
  
      function updateFabVisibility() {
        var anyHideZoneVisible = Object.keys(hideZoneVisible).some(function (id) {
          return hideZoneVisible[id];
        });
        var shouldShow = !heroVisible && !anyHideZoneVisible;
        memorialFab.classList.toggle("is-visible", shouldShow);
      }
  
      var heroObserver = new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
        updateFabVisibility();
      }, { threshold: 0 });
      heroObserver.observe(heroSection);
  
      fabHideZoneIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        hideZoneVisible[id] = false;
        var observer = new IntersectionObserver(function (entries) {
          hideZoneVisible[id] = entries[0].isIntersecting;
          updateFabVisibility();
        }, { threshold: 0 });
        observer.observe(el);
      });
    }
  
  })();