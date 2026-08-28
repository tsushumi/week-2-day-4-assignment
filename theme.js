// Flowline — shared theme toggle
// Applies saved/preferred theme immediately (before paint) to avoid a flash,
// then wires up any [data-theme-toggle] checkbox found on the page.
(function () {
  const STORAGE_KEY = "flowline-theme";
  const root = document.documentElement;

  const saved = localStorage.getItem(STORAGE_KEY);
  const preferred =
    saved || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  root.setAttribute("data-theme", preferred);

  function initToggle() {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    toggle.checked = root.getAttribute("data-theme") === "dark";

    toggle.addEventListener("change", () => {
      const next = toggle.checked ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initToggle);
  } else {
    initToggle();
  }
})();
