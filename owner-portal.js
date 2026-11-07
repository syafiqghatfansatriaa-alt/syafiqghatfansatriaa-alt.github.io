/* SGS Owner Portal — public preview only; intentionally no login form */
(() => {
  const nav = document.getElementById("mainNav");
  if (!nav || document.querySelector(".owner-portal-trigger")) return;

  const lockIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2"></rect>
      <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
      <path d="M12 14v3"></path>
    </svg>`;

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "owner-portal-trigger";
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-controls", "ownerPortalComingSoon");
  trigger.innerHTML = `${lockIcon}<span>Owner Portal</span>`;
  nav.appendChild(trigger);

  const overlay = document.createElement("div");
  overlay.className = "owner-portal-overlay";
  overlay.id = "ownerPortalComingSoon";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "ownerPortalTitle");
  overlay.setAttribute("aria-hidden", "true");

  overlay.innerHTML = `
    <section class="owner-portal-panel" tabindex="-1">
      <button class="owner-portal-close" type="button" aria-label="Close portal">×</button>
      <div class="owner-portal-kicker">SGS · PRIVATE SYSTEM</div>
      <div class="owner-portal-emblem">${lockIcon}</div>
      <h2 id="ownerPortalTitle">OWNER ARCHIVE</h2>
      <p class="owner-portal-subtitle">A Private Space in Development</p>
      <p class="owner-portal-description">
        A secure space for managing the digital journey of
        Syafiq Ghatfan Satria. The private management system is
        currently being prepared.
      </p>
      <div class="owner-portal-status">COMING SOON · ACCESS NOT YET AVAILABLE</div>
      <div class="owner-portal-features" aria-label="Planned features">
        <span>Secure Access</span>
        <span>Content Manager</span>
        <span>Publishing Center</span>
      </div>
      <p class="owner-portal-footer">SGS DIGITAL LEADERSHIP SPACE</p>
    </section>`;

  document.body.appendChild(overlay);

  const closeButton = overlay.querySelector(".owner-portal-close");
  const panel = overlay.querySelector(".owner-portal-panel");

  function openPortal() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("owner-portal-open");
    closeButton.focus();
  }
  function closePortal() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("owner-portal-open");
    trigger.focus();
  }

  trigger.addEventListener("click", openPortal);
  closeButton.addEventListener("click", closePortal);
  overlay.addEventListener("click", event => {
    if (event.target === overlay) closePortal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closePortal();
    }
    if (event.key === "Tab" && overlay.classList.contains("is-open")) {
      const focusable = [closeButton];
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        panel.focus();
      }
    }
  });
})();
