(function () {
  const LANG_KEY = "sarris-lang";
  const THEME_KEY = "sarris-theme";
  const COOKIE_KEY = "sarris-cookie-consent";
  const cfg = window.SITE_CONFIG || {};

  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const backToTop = document.querySelector(".back-to-top");
  const lightbox = document.getElementById("lightbox");
  const faqPanel = document.getElementById("faqPanel");
  const faqToggle = document.querySelector(".faq-toggle");
  const cookieBanner = document.getElementById("cookieBanner");

  function setLanguage(lang) {
    document.querySelectorAll(".lang").forEach(function (el) {
      el.style.display = "none";
    });
    document.querySelectorAll("." + lang).forEach(function (el) {
      el.style.display = "block";
    });

    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    document.documentElement.lang = lang === "lang-el" ? "el" : "en";
    localStorage.setItem(LANG_KEY, lang);
    updateI18nLabels(lang);
    setupScrollSpy();
    updateFaqLanguage(lang);
  }

  function updateI18nLabels(lang) {
    const isEl = lang === "lang-el";
    document.querySelectorAll("[data-nav-el]").forEach(function (el) {
      el.textContent = isEl ? el.dataset.navEl : el.dataset.navEn;
    });
  }

  function updateFaqLanguage(lang) {
    const isEl = lang === "lang-el";
    document.querySelectorAll("[data-faq-q-el]").forEach(function (el) {
      el.textContent = isEl ? el.dataset.faqQEl : el.dataset.faqQEn;
    });
    document.querySelectorAll("[data-faq-a-el]").forEach(function (el) {
      el.textContent = isEl ? el.dataset.faqAEl : el.dataset.faqAEn;
    });
  }

  function getActiveLangRoot() {
    const elBlock = document.querySelector(".lang.lang-el");
    return elBlock.style.display !== "none" ? elBlock : document.querySelector(".lang.lang-en");
  }

  function isGreek() {
    return document.documentElement.lang === "el";
  }

  document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(btn.dataset.lang);
    });
  });

  const savedLang = localStorage.getItem(LANG_KEY);
  if (savedLang === "lang-en" || savedLang === "lang-el") {
    setLanguage(savedLang);
  } else {
    updateFaqLanguage("lang-el");
  }

  /* ── Theme ── */
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    const btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.setAttribute("aria-label", theme === "dark"
        ? (isGreek() ? "Φωτεινό θέμα" : "Light mode")
        : (isGreek() ? "Σκοτεινό θέμα" : "Dark mode"));
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    setTheme(savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  }

  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ── Scroll ── */
  window.addEventListener("scroll", function () {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 20);
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 500);
  });

  if (navToggle && navbar) {
    navToggle.addEventListener("click", function () {
      const isOpen = navbar.classList.toggle("nav-menu-open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      e.preventDefault();
      const section = hash.slice(1);
      const root = getActiveLangRoot();
      const target = root.querySelector('[data-section="' + section + '"]');
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        closeMobileNav();
      }
    });
  });

  function closeMobileNav() {
    if (navbar) navbar.classList.remove("nav-menu-open");
    if (navToggle) {
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  }

  let scrollSpyObserver = null;

  function setupScrollSpy() {
    if (scrollSpyObserver) scrollSpyObserver.disconnect();
    const root = getActiveLangRoot();
    const navLinks = document.querySelectorAll(".nav-links a[data-section-link]");
    const sections = root.querySelectorAll("[data-section]");
    if (!sections.length) return;

    scrollSpyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section");
            navLinks.forEach(function (link) {
              link.classList.toggle("active", link.dataset.sectionLink === id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      scrollSpyObserver.observe(section);
    });
  }

  setupScrollSpy();

  /* ── Contact forms (FormSubmit) ── */
  const formEmail = cfg.formEmail || "sarrisxristoforos@gmail.com";

  document.querySelectorAll(".contact-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = form.querySelector(".btn-submit");
      const status = form.querySelector(".form-status");
      const isEl = form.dataset.lang === "el";

      const payload = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value,
        _subject: isEl ? "Νέο μήνυμα από sarris-site" : "New message from sarris-site",
        _captcha: "false",
        _template: "table"
      };

      btn.disabled = true;
      btn.textContent = isEl ? "Αποστολή..." : "Sending...";
      if (status) {
        status.className = "form-status";
        status.textContent = "";
      }

      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(formEmail), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("fail");
          form.reset();
          if (status) {
            status.className = "form-status form-status--success";
            status.textContent = isEl
              ? "Το μήνυμα εστάλη! Θα επικοινωνήσω μαζί σας σύντομα."
              : "Message sent! I will get back to you soon.";
          }
        })
        .catch(function () {
          if (status) {
            status.className = "form-status form-status--error";
            status.textContent = isEl
              ? "Σφάλμα αποστολής. Καλέστε μας: +30 694 859 8823 ή +30 28410 234448."
              : "Send failed. Please call: +30 694 859 8823 or +30 28410 234448.";
          }
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = isEl ? "Αποστολή" : "Send";
        });
    });
  });

  /* ── Gallery lightbox ── */
  function openLightbox(imgSrc, caption) {
    if (!lightbox) return;
    lightbox.querySelector(".lightbox-img").src = imgSrc;
    lightbox.querySelector(".lightbox-caption").textContent = caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".gallery-item").forEach(function (item) {
    function activate() {
      const img = item.querySelector("img");
      const cap = item.querySelector(".gallery-caption");
      if (img) openLightbox(img.src, cap ? cap.textContent : img.alt);
    }
    item.addEventListener("click", activate);
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  if (lightbox) {
    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  /* ── FAQ panel ── */
  function openFaq() {
    if (faqPanel) {
      faqPanel.classList.add("open");
      faqPanel.setAttribute("aria-hidden", "false");
    }
  }

  function closeFaq() {
    if (faqPanel) {
      faqPanel.classList.remove("open");
      faqPanel.setAttribute("aria-hidden", "true");
    }
  }

  if (faqToggle) faqToggle.addEventListener("click", openFaq);
  document.querySelectorAll(".faq-close").forEach(function (btn) {
    btn.addEventListener("click", closeFaq);
  });

  /* ── Cookies & Analytics ── */
  function loadAnalytics() {
    const gaId = cfg.googleAnalyticsId;
    if (!gaId || window.__gaLoaded) return;
    window.__gaLoaded = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });
  }

  function handleCookieConsent(accepted) {
    localStorage.setItem(COOKIE_KEY, accepted ? "accepted" : "declined");
    if (cookieBanner) cookieBanner.hidden = true;
    if (accepted) loadAnalytics();
  }

  const cookieChoice = localStorage.getItem(COOKIE_KEY);
  if (cookieChoice === "accepted") {
    loadAnalytics();
    if (cookieBanner) cookieBanner.hidden = true;
  } else if (cookieChoice === "declined") {
    if (cookieBanner) cookieBanner.hidden = true;
  }

  document.getElementById("cookieAccept")?.addEventListener("click", function () {
    handleCookieConsent(true);
  });
  document.getElementById("cookieDecline")?.addEventListener("click", function () {
    handleCookieConsent(false);
  });
})();
