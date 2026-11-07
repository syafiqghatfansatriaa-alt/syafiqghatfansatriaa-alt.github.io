/* SGS Cinematic Motion Add-on — no external libraries, no audio autoplay */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const portal = document.querySelector(".portal");

  // Cinematic portal exit, while preserving the site's original enter/skip handlers.
  function markPortalExit() {
    if (portal) portal.classList.add("leaving");
  }
  document.getElementById("enterButton")?.addEventListener("click", markPortalExit, { once: true });
  document.getElementById("skipButton")?.addEventListener("click", markPortalExit, { once: true });

  // Reveal content as it enters the viewport.
  const revealTargets = document.querySelectorAll(
    ".section-heading, .about-grid, .timeline, .role-card, .achievement-card, " +
    ".certificate-feature, .experience-callout, .initiative-card, .activity-row, " +
    ".gallery-item, .contact-grid, .support-copy"
  );
  revealTargets.forEach((el, index) => {
    el.classList.add("sgs-reveal");
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 75}ms`;
  });

  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("sgs-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add("sgs-visible"));
  }

  // Add a subtle orbit accent around the existing profile frame.
  const frame = document.querySelector(".photo-frame");
  if (frame && !reduceMotion.matches) {
    const orbit = document.createElement("span");
    orbit.className = "sgs-orbit-accent";
    orbit.setAttribute("aria-hidden", "true");
    frame.appendChild(orbit);
  }

  // Give visitors control over motion.
  const toggle = document.createElement("button");
  toggle.className = "sgs-motion-toggle";
  toggle.type = "button";
  toggle.textContent = "Pause motion";
  toggle.setAttribute("aria-pressed", "false");
  document.body.appendChild(toggle);

  let paused = false;
  toggle.addEventListener("click", () => {
    paused = !paused;
    document.documentElement.classList.toggle("sgs-motion-paused", paused);
    document.querySelectorAll("*").forEach(el => {
      if (paused) el.style.animationPlayState = "paused";
      else el.style.removeProperty("animation-play-state");
    });
    toggle.textContent = paused ? "Resume motion" : "Pause motion";
    toggle.setAttribute("aria-pressed", String(paused));
  });

  // Respect changes to the operating-system motion preference.
  reduceMotion.addEventListener?.("change", event => {
    if (event.matches) {
      document.querySelectorAll(".sgs-reveal").forEach(el => el.classList.add("sgs-visible"));
      document.querySelector(".sgs-orbit-accent")?.remove();
    }
  });
})();
