
(() => {
  const button = document.getElementById("sgswOwnerAccess");
  if (!button) return;

  const temporaryCode = "Scorpioon161110";

  button.addEventListener("click", () => {
    const enteredCode = window.prompt(
      "SGS OWNER ACCESS\nMasukkan kode pengembangan:"
    );

    if (enteredCode === null) return;

    if (enteredCode === temporaryCode) {
      document.body.classList.add("sgsw-owner-mode");
      button.textContent = "✓ OWNER MODE ACTIVE";
      button.disabled = true;

      document.querySelectorAll(".sgsw-status").forEach(status => {
        status.textContent = "OWNER MODE · DEVELOPMENT";
      });

      alert("Owner access berhasil dibuka!");
    } else {
      alert("Kode tidak sesuai. Akses ditolak.");
    }
  });
})();
