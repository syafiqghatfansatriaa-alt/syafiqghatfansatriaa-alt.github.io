
/* SGS BRAIN CHALLENGE - GAME ENGINE */

(() => {
  const $ = id => document.getElementById(id);

  const brainCard = $("sgswBrainCard");
  const dashboard = $("sgsDeveloperDashboard");
  const game = $("sgswBrainGame");
  const back = $("sgswBrainBack");

  const questionNumber = $("sgswQuestionNumber");
  const progressFill = $("sgswProgressFill");
  const questionText = $("sgswQuestion");
  const answersBox = $("sgswAnswers");
  const feedback = $("sgswFeedback");
  const nextButton = $("sgswNextQuestion");
  const scoreText = $("sgswScore");

  if (
    !brainCard || !dashboard || !game || !back ||
    !questionNumber || !progressFill || !questionText ||
    !answersBox || !feedback || !nextButton || !scoreText
  ) {
    console.warn("SGS Brain Challenge: Elemen belum lengkap.");
    return;
  }

  const header = dashboard.querySelector(".sgsw-dashboard-header");
  const grid = dashboard.querySelector(".sgsw-dashboard-grid");
  const actions = dashboard.querySelector(".sgsw-dashboard-actions");

  const questions = [
    {
      type: "Pilihan Ganda",
      question: "Jika 2, 4, 8, 16, ... angka berikutnya adalah?",
      answers: ["18", "24", "30", "32"],
      correct: 3,
      explanation: "Setiap angka dikalikan dua."
    },
    {
      type: "Penalaran",
      question: "Semua mawar adalah bunga. Sebagian bunga berwarna merah. Apakah pasti semua mawar merah?",
      answers: ["Ya, pasti", "Tidak dapat dipastikan", "Tidak ada mawar merah", "Semua bunga adalah mawar"],
      correct: 1,
      explanation: "Informasi tersebut tidak cukup untuk memastikan warna semua mawar."
    },
    {
      type: "Pengetahuan Umum",
      question: "Apa ibu kota Jepang?",
      answers: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correct: 2,
      explanation: "Tokyo adalah ibu kota Jepang."
    },
    {
      type: "Matematika",
      question: "Berapakah hasil 15 × 6?",
      answers: ["80", "85", "90", "95"],
      correct: 2,
      explanation: "15 dikalikan 6 sama dengan 90."
    },
    {
      type: "Sains",
      question: "Planet yang dikenal sebagai Planet Merah adalah?",
      answers: ["Venus", "Mars", "Jupiter", "Merkurius"],
      correct: 1,
      explanation: "Mars tampak kemerahan karena mineral besi di permukaannya."
    },
    {
      type: "Bahasa",
      question: "Sinonim kata 'cermat' adalah?",
      answers: ["Teliti", "Ceroboh", "Lambat", "Bingung"],
      correct: 0,
      explanation: "Cermat memiliki arti teliti atau hati-hati."
    },
    {
      type: "Logika",
      question: "Ada 5 burung di pohon. Dua terbang pergi. Berapa burung yang tersisa?",
      answers: ["2", "3", "5", "7"],
      correct: 1,
      explanation: "Lima dikurangi dua sama dengan tiga."
    },
    {
      type: "Teknologi",
      question: "Kepanjangan CPU adalah?",
      answers: [
        "Central Processing Unit",
        "Computer Personal Utility",
        "Central Program User",
        "Control Power Unit"
      ],
      correct: 0,
      explanation: "CPU adalah Central Processing Unit."
    },
    {
      type: "Pola Angka",
      question: "Angka berikutnya: 3, 6, 9, 12, ...",
      answers: ["13", "14", "15", "18"],
      correct: 2,
      explanation: "Pola bertambah tiga setiap langkah."
    },
    {
      type: "Pemecahan Masalah",
      question: "Kamu memiliki satu apel dan ingin membaginya sama rata kepada dua orang. Apa yang paling tepat?",
      answers: [
        "Simpan sendiri",
        "Potong menjadi dua bagian sama besar",
        "Berikan semuanya kepada satu orang",
        "Buang apelnya"
      ],
      correct: 1,
      explanation: "Membagi menjadi dua bagian sama besar adalah solusi yang adil."
    }
  ];

  let current = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    const item = questions[current];
    answered = false;

    questionNumber.textContent =
      `QUESTION ${current + 1} / ${questions.length}`;

    questionText.textContent = item.question;
    feedback.textContent = item.type;
    answersBox.innerHTML = "";
    nextButton.disabled = true;

    progressFill.style.width =
      `${(current / questions.length) * 100}%`;

    item.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sgsw-answer";
      button.textContent =
        `${String.fromCharCode(65 + index)}. ${answer}`;

      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;

        const correct = index === item.correct;

        if (correct) {
          score += 10;
          button.classList.add("correct");
          feedback.textContent = `✓ Benar! ${item.explanation}`;
        } else {
          button.classList.add("wrong");
          feedback.textContent =
            `Belum tepat. Jawaban benar: ${item.answers[item.correct]}. ${item.explanation}`;

          answersBox.children[item.correct].classList.add("correct");
        }

        Array.from(answersBox.children).forEach(choice => {
          choice.disabled = true;
        });

        scoreText.textContent = `SKOR: ${score}`;
        nextButton.disabled = false;
      });

      answersBox.appendChild(button);
    });

    nextButton.textContent =
      current === questions.length - 1
        ? "LIHAT HASIL"
        : "LANJUTKAN →";
  }

  function openGame() {
    if (header) header.style.display = "none";
    if (grid) grid.style.display = "none";
    if (actions) actions.style.display = "none";

    current = 0;
    score = 0;
    scoreText.textContent = "SKOR: 0";

    game.classList.add("active");
    renderQuestion();

    game.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeGame() {
    game.classList.remove("active");

    if (header) header.style.display = "";
    if (grid) grid.style.display = "";
    if (actions) actions.style.display = "";

    dashboard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function finishGame() {
    progressFill.style.width = "100%";
    questionNumber.textContent = "SELESAI";

    questionText.textContent = "Tantangan selesai!";
    answersBox.innerHTML = "";

    feedback.textContent =
      `Skor akhir kamu ${score} dari ${questions.length * 10} poin.`;

    nextButton.textContent = "ULANGI PERMAINAN";
    nextButton.disabled = false;

    nextButton.onclick = () => {
      nextButton.onclick = null;
      openGame();
    };
  }

  nextButton.addEventListener("click", () => {
    if (nextButton.textContent === "ULANGI PERMAINAN") return;

    if (!answered) return;

    if (current < questions.length - 1) {
      current++;
      renderQuestion();
    } else {
      finishGame();
    }
  });

  brainCard.style.cursor = "pointer";
  brainCard.setAttribute("role", "button");
  brainCard.setAttribute("tabindex", "0");

  brainCard.addEventListener("click", openGame);

  brainCard.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGame();
    }
  });

  back.addEventListener("click", closeGame);

  console.log("SGS Brain Challenge Game Engine aktif.");
})();
