(() => {
  const heroAnimation = document.querySelector("[data-animated-src]");
  const motionToggle = document.querySelector("[data-motion-toggle]");

  if (heroAnimation && motionToggle) {
    const animatedSrc = heroAnimation.dataset.animatedSrc;
    const posterSrc = heroAnimation.dataset.posterSrc;
    let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderMotionState = () => {
      heroAnimation.src = paused ? posterSrc : animatedSrc;
      motionToggle.textContent = paused ? "Play animation" : "Pause animation";
      motionToggle.setAttribute("aria-label", `${paused ? "Play" : "Pause"} data science animation`);
      motionToggle.setAttribute("aria-pressed", String(paused));
    };

    renderMotionState();
    motionToggle.addEventListener("click", () => {
      paused = !paused;
      renderMotionState();
    });
  }

  const controls = document.querySelector("[data-project-controls]");
  const cards = Array.from(document.querySelectorAll("[data-work-card]"));
  const buttons = Array.from(document.querySelectorAll("[data-project-filter]"));
  const search = document.querySelector("#project-search");
  const results = document.querySelector("#project-results");

  if (!controls || cards.length === 0 || buttons.length === 0 || !search || !results) return;

  let selectedKind = "all";
  controls.hidden = false;
  results.hidden = false;

  const updateProjects = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    for (const card of cards) {
      const kindMatches = selectedKind === "all" || card.dataset.workKind === selectedKind;
      const queryMatches = query.length === 0 || card.textContent.toLocaleLowerCase().includes(query);
      const isVisible = kindMatches && queryMatches;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    }

    if (visibleCount === 0) {
      results.textContent = "No projects match those filters. Try another topic or category.";
    } else if (visibleCount === cards.length && selectedKind === "all" && query.length === 0) {
      results.textContent = `Showing all ${cards.length} projects`;
    } else {
      results.textContent = `Showing ${visibleCount} of ${cards.length} projects`;
    }
  };

  for (const button of buttons) {
    button.addEventListener("click", () => {
      selectedKind = button.dataset.projectFilter || "all";
      for (const option of buttons) {
        const isSelected = option === button;
        option.classList.toggle("is-active", isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
      }
      updateProjects();
    });
  }

  search.addEventListener("input", updateProjects);
  updateProjects();
})();
