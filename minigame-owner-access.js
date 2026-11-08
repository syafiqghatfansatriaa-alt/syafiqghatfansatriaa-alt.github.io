
(() => {
  const button = document.getElementById("sgswOwnerAccess");
  const world = document.getElementById("minigame-world");
  const dashboard = document.getElementById("sgsDeveloperDashboard");
  const backButton = document.getElementById("sgswBackToWorld");

  if (!button || !world || !dashboard || !backButton) return;

  const temporaryCode = "Scorpioon161110";

  button.addEventListener("click", () => {
    const enteredCode = window.prompt(
      "SGS OWNER ACCESS\nMasukkan kode pengembangan:"
    );

    if (enteredCode === null) return;

    if (enteredCode === temporaryCode) {
      world.style.display = "none";
      dashboard.classList.add("active");

      window.scrollTo({
        top: dashboard.offsetTop,
        behavior: "smooth"
      });
    } else {
      alert("Kode tidak sesuai. Akses ditolak.");
    }
  });

  backButton.addEventListener("click", () => {
    dashboard.classList.remove("active");
    world.style.display = "";

    world.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
})();
