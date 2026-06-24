(function () {
  const LANG_KEY = "sarris-lang";

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
    updateNavLabels(lang);
  }

  function updateNavLabels(lang) {
    const isEl = lang === "lang-el";
    document.querySelectorAll("[data-nav-el]").forEach(function (el) {
      el.textContent = isEl ? el.dataset.navEl : el.dataset.navEn;
    });
  }

  document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(btn.dataset.lang);
    });
  });

  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "lang-en" || saved === "lang-el") {
    setLanguage(saved);
  }

  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 20);
  });

  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle && navbar) {
    navToggle.addEventListener("click", function () {
      navbar.classList.toggle("nav-menu-open");
    });
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    observer.observe(el);
  });

  function getActiveLangRoot() {
    const elBlock = document.querySelector(".lang.lang-el");
    return elBlock.style.display !== "none" ? elBlock : document.querySelector(".lang.lang-en");
  }

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
        if (navbar) navbar.classList.remove("nav-menu-open");
      }
    });
  });
})();
