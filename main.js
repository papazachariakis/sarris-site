(function () {
  const LANG_KEY = "sarris-lang";
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const backToTop = document.querySelector(".back-to-top");

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
    setupScrollSpy();
  }

  function updateNavLabels(lang) {
    const isEl = lang === "lang-el";
    document.querySelectorAll("[data-nav-el]").forEach(function (el) {
      el.textContent = isEl ? el.dataset.navEl : el.dataset.navEn;
    });
  }

  function getActiveLangRoot() {
    const elBlock = document.querySelector(".lang.lang-el");
    return elBlock.style.display !== "none" ? elBlock : document.querySelector(".lang.lang-en");
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
        if (navbar) {
          navbar.classList.remove("nav-menu-open");
          if (navToggle) {
            navToggle.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
          }
        }
      }
    });
  });

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
})();
