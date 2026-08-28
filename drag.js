(function () {
  const list = document.getElementById("priority-list");
  let draggedItem = null;

  function clearIndicators() {
    list.querySelectorAll(".priority-item").forEach((li) => {
      li.classList.remove("drop-before", "drop-after");
    });
  }

  function renumber() {
    list.querySelectorAll(".priority-item").forEach((li, index) => {
      li.querySelector(".badge-num").textContent = index + 1;
    });
  }

  list.addEventListener("dragstart", (e) => {
    const item = e.target.closest(".priority-item");
    if (!item) return;
    draggedItem = item;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.dataset.id);
    // Delay the opacity change one frame so the browser has already
    // captured the drag ghost image at full opacity.
    requestAnimationFrame(() => item.classList.add("is-dragging"));
  });

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const target = e.target.closest(".priority-item");
    clearIndicators();
    if (!target || target === draggedItem) return;

    const rect = target.getBoundingClientRect();
    const isBefore = e.clientY - rect.top < rect.height / 2;
    target.classList.add(isBefore ? "drop-before" : "drop-after");
  });

  list.addEventListener("drop", (e) => {
    e.preventDefault();
    const target = e.target.closest(".priority-item");
    clearIndicators();
    if (!target || !draggedItem || target === draggedItem) return;

    const rect = target.getBoundingClientRect();
    const isBefore = e.clientY - rect.top < rect.height / 2;

    if (isBefore) {
      list.insertBefore(draggedItem, target);
    } else {
      list.insertBefore(draggedItem, target.nextSibling);
    }

    renumber();
  });

  list.addEventListener("dragend", () => {
    if (draggedItem) draggedItem.classList.remove("is-dragging");
    clearIndicators();
    draggedItem = null;
  });

  renumber();
})();
