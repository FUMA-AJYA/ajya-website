
/* ==========================================
   AJYA OFFICIAL WEBSITE
   STEP 17 - SHARED SITE SYSTEM
========================================== */

"use strict";

/* ==========================================
   1. SITE SETTINGS
========================================== */

const AJYA_PAGES = [
  { key: "home", href: "index.html#home", en: "HOME", ja: "ホーム" },
  { key: "about", href: "about.html", en: "ABOUT", ja: "AJYAについて" },
  { key: "activities", href: "activities.html", en: "ACTIVITIES", ja: "活動紹介" },
  { key: "projects", href: "projects.html", en: "PROJECTS", ja: "プロジェクト" },
  { key: "events", href: "events.html", en: "EVENTS", ja: "イベント" },
  { key: "news", href: "news.html", en: "NEWS", ja: "ニュース" },
  { key: "partners", href: "partners.html", en: "PARTNERS", ja: "パートナー" },
  { key: "contact", href: "contact.html", en: "CONTACT", ja: "お問い合わせ" }
];

const AJYA_MAIN_KEYS = [
  "home",
  "about",
  "activities",
  "projects",
  "events"
];

const AJYA_MORE_KEYS = [
  "news",
  "partners",
  "contact"
];

/* ==========================================
   2. TRANSLATIONS
========================================== */

const translations = {
  en: {
    heroTitle: "Connecting Youth.<br>Driving Change.",
    heroDescription:
      "Connecting young people across Africa and Japan to turn ideas into action.",
    discoverButton: "DISCOVER AJYA",

    aboutTitle: "ABOUT AJYA",
    aboutDescription:
      "Africa & Japan Youth Alliance connects young people across Africa and Japan.",

    activitiesTitle: "3 Pillars & 2 Enablers",
    activitiesDescription:
      "A shared framework for youth-led action.",

    projectsTitle: "FEATURED PROJECT",

    contactTitle: "CONTACT",
    contactDescription: "Contact information coming soon.",

    more: "MORE",
    menu: "MENU",
    closeMenu: "Close menu"
  },

  ja: {
    heroTitle: "若者をつなぐ。<br>変化を生み出す。",
    heroDescription:
      "アフリカと日本の若者をつなぎ、アイデアを具体的な行動へと変えていきます。",
    discoverButton: "AJYAについて知る",

    aboutTitle: "AJYAについて",
    aboutDescription:
      "日アフリカユース連合（AJYA）は、アフリカと日本の若者をつなぐ団体です。",

    activitiesTitle: "3つの柱と2つの基盤",
    activitiesDescription:
      "若者主体の行動を支える共通の枠組みです。",

    projectsTitle: "主要プロジェクト",

    contactTitle: "お問い合わせ",
    contactDescription: "お問い合わせ先は準備中です。",

    more: "その他",
    menu: "メニュー",
    closeMenu: "メニューを閉じる"
  }
};

/* ==========================================
   3. LANGUAGE STATE
========================================== */

let currentLanguage = "en";

try {
  const savedLanguage = localStorage.getItem("ajya-language");
  if (savedLanguage === "en" || savedLanguage === "ja") {
    currentLanguage = savedLanguage;
  }
} catch (error) {
  // Local storage may be unavailable in some browsers.
}

/* ==========================================
   4. HELPERS
========================================== */

function getCurrentPage() {
  const filename =
    window.location.pathname.split("/").pop() || "index.html";

  if (filename === "index.html") return "home";

  const page = AJYA_PAGES.find(item =>
    item.href.split("#")[0] === filename
  );

  return page ? page.key : "home";
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setSelectorText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function getPage(key) {
  return AJYA_PAGES.find(page => page.key === key);
}

function createNavLink(page) {
  const link = document.createElement("a");

  link.href = page.href;
  link.textContent = page[currentLanguage];
  link.dataset.navKey = page.key;

  if (getCurrentPage() === page.key) {
    link.setAttribute("aria-current", "page");
  }

  return link;
}

/* ==========================================
   5. SHARED HEADER
========================================== */

function buildHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  header.classList.add("ajya-header");

  // Rebuild the header from one shared definition.
  header.replaceChildren();

  const logo = document.createElement("a");
  logo.href = "index.html#home";
  logo.className = "logo";
  logo.innerHTML = "AJYA<span>.</span>";
  logo.setAttribute("aria-label", "AJYA Home");

  const desktopNav = document.createElement("nav");
  desktopNav.className = "ajya-desktop-nav";
  desktopNav.setAttribute("aria-label", "Main navigation");

  AJYA_MAIN_KEYS.forEach(key => {
    desktopNav.appendChild(createNavLink(getPage(key)));
  });

  // MORE dropdown
  const more = document.createElement("details");
  more.className = "ajya-more";

  const moreSummary = document.createElement("summary");
  moreSummary.id = "ajyaMoreLabel";
  moreSummary.textContent = translations[currentLanguage].more;

  const moreLinks = document.createElement("div");
  moreLinks.className = "ajya-more-links";

  AJYA_MORE_KEYS.forEach(key => {
    moreLinks.appendChild(createNavLink(getPage(key)));
  });

  if (AJYA_MORE_KEYS.includes(getCurrentPage())) {
    more.classList.add("ajya-more-active");
  }

  more.append(moreSummary, moreLinks);
  desktopNav.appendChild(more);

  // Header controls
  const controls = document.createElement("div");
  controls.className = "ajya-header-controls";

  const languageButton = document.createElement("button");
  languageButton.id = "languageBtn";
  languageButton.type = "button";
  languageButton.className = "ajya-language-btn";
  languageButton.addEventListener("click", switchLanguage);

  const menuButton = document.createElement("button");
  menuButton.id = "ajyaMenuBtn";
  menuButton.type = "button";
  menuButton.className = "ajya-menu-btn";
  menuButton.setAttribute("aria-controls", "ajyaMobileNav");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.addEventListener("click", toggleMobileMenu);

  controls.append(languageButton, menuButton);

  // Mobile navigation
  const mobileNav = document.createElement("nav");
  mobileNav.id = "ajyaMobileNav";
  mobileNav.className = "ajya-mobile-nav";
  mobileNav.setAttribute("aria-label", "Mobile navigation");
  mobileNav.hidden = true;

  AJYA_PAGES.forEach(page => {
    const link = createNavLink(page);
    link.addEventListener("click", closeMobileMenu);
    mobileNav.appendChild(link);
  });

  header.append(logo, desktopNav, controls, mobileNav);

  // Close MORE when clicking outside.
  document.addEventListener("click", event => {
    if (!more.contains(event.target)) {
      more.open = false;
    }
  });

  // Escape key closes menus.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      more.open = false;
      closeMobileMenu();
    }
  });
}

/* ==========================================
   6. MOBILE MENU
========================================== */

function toggleMobileMenu() {
  const menu = document.getElementById("ajyaMobileNav");
  const button = document.getElementById("ajyaMenuBtn");

  if (!menu || !button) return;

  const isOpening = menu.hidden;

  menu.hidden = !isOpening;
  button.setAttribute(
    "aria-expanded",
    String(isOpening)
  );

  updateMenuButtonLabel();
}

function closeMobileMenu() {
  const menu = document.getElementById("ajyaMobileNav");
  const button = document.getElementById("ajyaMenuBtn");

  if (!menu || !button) return;

  menu.hidden = true;
  button.setAttribute("aria-expanded", "false");

  updateMenuButtonLabel();
}

function updateMenuButtonLabel() {
  const button = document.getElementById("ajyaMenuBtn");
  const menu = document.getElementById("ajyaMobileNav");

  if (!button || !menu) return;

  const t = translations[currentLanguage];

  button.textContent = menu.hidden ? "☰" : "✕";
  button.setAttribute(
    "aria-label",
    menu.hidden ? t.menu : t.closeMenu
  );
}

/* ==========================================
   7. LANGUAGE UPDATE
========================================== */

function updateLanguage() {
  const t = translations[currentLanguage];

  document.documentElement.lang = currentLanguage;

  // Shared navigation
  document.querySelectorAll("[data-nav-key]").forEach(link => {
    const page = getPage(link.dataset.navKey);

    if (page) {
      link.textContent = page[currentLanguage];
    }
  });

  const moreLabel = document.getElementById("ajyaMoreLabel");
  if (moreLabel) moreLabel.textContent = t.more;

  // Home hero
  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) heroTitle.innerHTML = t.heroTitle;

  setText("heroDescription", t.heroDescription);
  if (!document.body.classList.contains("home-renewal")) setSelectorText(".hero .btn", t.discoverButton);

  if (!document.body.classList.contains("home-renewal")) {
  // Home about section
  setSelectorText("#about h2", t.aboutTitle);
  setSelectorText(
    "#about .section-heading > p:not(.section-label)",
    t.aboutDescription
  );

  // Home activities section
  setSelectorText("#activities h2", t.activitiesTitle);
  setText("activitiesDescription", t.activitiesDescription);

  // Home projects section
  setSelectorText("#projects h2", t.projectsTitle);

  // Home contact section
  setSelectorText("#contact h2", t.contactTitle);
  setSelectorText(
    "#contact .section-heading > p:not(.section-label)",
    t.contactDescription
  );

  }

  // All other translated text
  document.querySelectorAll("[data-en][data-ja]")
    .forEach(element => {
      const translatedText =
        element.getAttribute("data-" + currentLanguage);

      if (translatedText !== null) {
        element.textContent = translatedText;
      }
    });

  // Language button
  const languageButton = document.getElementById("languageBtn");

  if (languageButton) {
    languageButton.textContent =
      currentLanguage === "en" ? "JP" : "EN";

    languageButton.setAttribute(
      "aria-label",
      currentLanguage === "en"
        ? "Switch to Japanese"
        : "Switch to English"
    );
  }

  updateMenuButtonLabel();
}

/* ==========================================
   8. SWITCH LANGUAGE
========================================== */

function switchLanguage() {
  currentLanguage =
    currentLanguage === "en" ? "ja" : "en";

  try {
    localStorage.setItem("ajya-language", currentLanguage);
  } catch (error) {
    // The current page will still switch language.
  }

  updateLanguage();
}

/* ==========================================
   9. INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  updateLanguage();
});

/* ==========================================
   END
========================================== */

// Graceful fallback for photo slots without uploaded images.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[data-photo-fallback]').forEach(img => {
    const fallback = () => img.closest('.aj-photo')?.classList.add('aj-missing');
    img.addEventListener('error', fallback, {once:true});
    if (img.complete && img.naturalWidth === 0) fallback();
  });
});

// Logo files can be added later without changing HTML. Text remains until image loads.
document.querySelectorAll('img[data-logo]').forEach(img => {
  const show = () => img.closest('.aj-logo-tile')?.classList.add('logo-loaded');
  if (img.complete && img.naturalWidth > 0) show();
  else img.addEventListener('load', show, {once:true});
});
