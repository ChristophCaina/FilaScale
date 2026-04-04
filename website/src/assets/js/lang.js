/**
 * FilaScale Language Switcher + Mobile Menu
 */

(function () {
  // Active nav link: re-evaluate based on actual browser URL.
  // This overrides any incorrect server-side aria-current attributes.
  const currentPath = window.location.pathname;
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href) return;
    // Root language pages (/FilaScale/de/, /FilaScale/en/) need exact match.
    // Section pages (/FilaScale/de/install/, etc.) use prefix match.
    const segments = href.replace(/^\/[^/]+/, "").split("/").filter(Boolean);
    const isRoot = segments.length <= 1;
    const active = isRoot ? currentPath === href : currentPath.startsWith(href);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // Mobile menu toggle
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
