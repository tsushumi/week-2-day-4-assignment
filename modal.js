(function () {
  const TRANSITION_MS = 250;
  let activeOverlay = null;

  function openModal(overlay) {
    if (!overlay) return;
    activeOverlay = overlay;

    overlay.classList.add("is-open");
    // Force layout so the browser registers the "closed" state before we
    // flip to "visible" — otherwise the opacity transition gets skipped.
    // eslint-disable-next-line no-unused-expressions
    overlay.offsetHeight;
    requestAnimationFrame(() => overlay.classList.add("is-visible"));

    document.body.style.overflow = "hidden";
  }

  function closeModal(overlay) {
    if (!overlay || !overlay.classList.contains("is-open")) return;

    overlay.classList.remove("is-visible");
    window.setTimeout(() => {
      overlay.classList.remove("is-open");
    }, TRANSITION_MS);

    activeOverlay = null;
    document.body.style.overflow = "";
  }

  // Open triggers
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const overlay = document.getElementById(btn.getAttribute("data-open-modal"));
      openModal(overlay);
    });
  });

  // Close triggers: Close button / X button
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(btn.closest("[data-modal]"));
    });
  });

  // Close trigger: clicking the overlay itself (outside the modal box)
  document.querySelectorAll("[data-modal]").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // Close trigger: Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeOverlay) {
      closeModal(activeOverlay);
    }
  });
})();
