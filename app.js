
const opening = document.getElementById("opening");
const mainSpace = document.getElementById("mainSpace");
const enterBtn = document.getElementById("enterBtn");
const skipBtn = document.getElementById("skipBtn");
const homeBtn = document.getElementById("homeBtn");
const soundBtn = document.getElementById("soundBtn");
const contentPanel = document.getElementById("contentPanel");
const pageContent = document.getElementById("pageContent");
const backBtn = document.getElementById("backBtn");

function enterWorld() {
  opening.classList.add("hidden");
  mainSpace.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

enterBtn.addEventListener("click", enterWorld);
skipBtn.addEventListener("click", enterWorld);

homeBtn.addEventListener("click", () => {
  contentPanel.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

backBtn.addEventListener("click", () => {
  contentPanel.classList.add("hidden");
  document.querySelector(".navigation-grid").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

const pages = {
  about: {
    title: "About Me",
    text: `
      <p>Halo, saya Syafiq Ghatfan Satria.</p>
      <p>Saya adalah pelajar yang memiliki ketertarikan pada kepemimpinan,
      organisasi, sastra, dan pengembangan diri.</p>
      <p>Learn. Lead. Contribute.</p>
    `
  },
  leadership: {
    title: "Leadership & Organization",
    text: `
      <p>Ketua MPK SMAN 2 Sungai Kakap.</p>
      <p>Ketua Pramuka SMAN 2 Sungai Kakap.</p>
      <p>Anggota DKR, PMR, ROHIS, dan Drumband.</p>
      <p>Saya percaya kepemimpinan berarti merangkul,
      mendengarkan, dan bekerja nyata.</p>
    `
  },
  achievements: {
    title: "Achievements & Recognition",
    text: `
      <p>Juara 1 Pidato/Tausiyah tingkat SMP.</p>
      <p>Juara 2 Berpuisi tingkat SMP.</p>
      <p>Juara 1 Tausiyah antar kelas.</p>
      <p>Juara 3 Fashion Show antar kelas.</p>
    `
  },
  activities: {
    title: "Activities & Initiatives",
    text: `
      <p><strong>Sampah yang Bijak ialah Sampah yang Bernilai</strong></p>
      <p>Gagasan pengelolaan sampah agar memiliki nilai manfaat.</p>
      <p><strong>Siswa Bersuara, Kami Mengolah</strong></p>
      <p>Gagasan penyaluran aspirasi dan evaluasi siswa.</p>
      <p>Program-program ini masih dalam tahap perencanaan.</p>
    `
  },
  gallery: {
    title: "Gallery & Documentation",
    text: `
      <p>Dokumentasi perjalanan organisasi dan kegiatan.</p>
      <div class="gallery-grid">
        <img src="assets/1000035803.jpg" alt="Profil">
        <img src="assets/1000035778.jpg" alt="Kegiatan PMR">
        <img src="assets/1000035510.jpg" alt="Sertifikat">
        <img src="assets/1000035771.jpg" alt="Kegiatan Pramuka">
        <img src="assets/1000032721.jpg" alt="Kebersamaan">
        <img src="assets/1000032726.jpg" alt="Kegiatan di Kantor Bupati">
        <img src="assets/1000032733.jpg" alt="Kegiatan Pramuka">
        <img src="assets/1000035773.png" alt="Drumband">
        <img src="assets/1000032520.png" alt="Kegiatan budaya">
      </div>
    `
  },
  contact: {
    title: "Contact",
    text: `
      <p>Terhubung dan berkolaborasi bersama saya.</p>
      <p>Email: <a href="mailto:syafiqghatfansatriaa@gmail.com">syafiqghatfansatriaa@gmail.com</a></p>
      <p>Instagram: <a href="https://www.instagram.com/ghatfan_satria1/" target="_blank" rel="noopener"> @ghatfan_satria1</a></p>
    `
  },
  support: {
    title: "Support My Journey",
    text: `
      <p>Dukungan sukarela untuk membantu perjalanan belajar,
      dokumentasi, dan pengembangan karya digital saya.</p>
      <p><a href="https://sociabuzz.com/syafiqgs/tribe" target="_blank" rel="noopener">SociaBuzz</a></p>
      <p><a href="https://saweria.co/syafiqco" target="_blank" rel="noopener">Saweria</a></p>
    `
  },
  vision: {
    title: "My Vision",
    text: `
      <p>Terus belajar, membangun kepemimpinan yang bermanfaat,
      dan menghadirkan kontribusi nyata bagi lingkungan sekitar.</p>
    `
  }
};

document.querySelectorAll(".nav-card").forEach(button => {
  button.addEventListener("click", () => {
    const page = pages[button.dataset.page];
    if (!page) return;

    pageContent.innerHTML = `<h2>${page.title}</h2>${page.text}`;
    contentPanel.classList.remove("hidden");
    contentPanel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

soundBtn.addEventListener("click", () => {
  alert("Audio sinematik belum diaktifkan pada versi ini.");
});
