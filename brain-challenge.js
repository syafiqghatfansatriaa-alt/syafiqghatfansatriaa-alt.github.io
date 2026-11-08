/* SGS BRAIN CHALLENGE - NAVIGATION ENGINE */

(() => {
  const brainCard = document.getElementById("sgswBrainCard");
  const dashboard = document.getElementById("sgsDeveloperDashboard");
  const gameScreen = document.getElementById("sgswBrainGame");
  const backButton = document.getElementById("sgswBrainBack");

  if (!brainCard || !dashboard || !gameScreen || !backButton) {
    console.warn("SGS Brain Challenge: Element belum ditemukan.");
    return;
  }

  const dashboardHeader = dashboard.querySelector(".sgsw-dashboard-header");
  const dashboardGrid = dashboard.querySelector(".sgsw-dashboard-grid");
  const dashboardActions = dashboard.querySelector(".sgsw-dashboard-actions");

  function openBrainChallenge() {
    if (dashboardHeader) dashboardHeader.style.display = "none";
    if (dashboardGrid) dashboardGrid.style.display = "none";
    if (dashboardActions) dashboardActions.style.display = "none";

    gameScreen.classList.add("active");
    gameScreen.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeBrainChallenge() {
    gameScreen.classList.remove("active");

    if (dashboardHeader) dashboardHeader.style.display = "";
    if (dashboardGrid) dashboardGrid.style.display = "";
    if (dashboardActions) dashboardActions.style.display = "";

    dashboard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  brainCard.style.cursor = "pointer";
  brainCard.setAttribute("role", "button");
  brainCard.setAttribute("tabindex", "0");

  brainCard.addEventListener("click", openBrainChallenge);

  brainCard.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openBrainChallenge();
    }
  });

  backButton.addEventListener("click", closeBrainChallenge);

  console.log("SGS Brain Challenge berhasil dimuat.");
})();
