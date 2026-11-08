 
/* =================================================
   SGS BRAIN CHALLENGE
   REAL THREE.JS FUTURISTIC LIBRARY
   FIX: INITIALIZE ONLY WHEN GAME IS VISIBLE
================================================= */

(() => {
  const game = document.getElementById("sgswBrainGame");
  if (!game || game.dataset.sgs3dReady === "true") return;

  game.dataset.sgs3dReady = "true";

  let THREE;
  let scene;
  let camera;
  let renderer;
  let observer;
  let animationId;
  let started = false;
  let clock = 0;

  const animatedObjects = [];
  const particleSystems = [];

  /* ---------- 3D WORLD CONTAINER ---------- */

  const world = document.createElement("div");
  world.id = "sgsw3DWorld";
  game.prepend(world);

  /* ---------- BACKGROUND FIX ---------- */

  const style = document.createElement("style");

  style.textContent = `
    #sgswBrainGame {
      position:relative !important;
      isolation:isolate !important;
      overflow:hidden !important;
      width:100% !important;
      max-width:none !important;
      min-height:100vh !important;
      margin:0 !important;
      background:transparent !important;
    }

    #sgswBrainGame::before,
    #sgswBrainGame::after {
      display:none !important;
    }

    #sgsw3DWorld {
      position:absolute;
      inset:0;
      z-index:0;
      min-height:100%;
      overflow:hidden;
      pointer-events:none;
      background:#071426;
    }

    #sgsw3DWorld canvas {
      position:absolute;
      inset:0;
      display:block;
      width:100% !important;
      height:100% !important;
    }

    #sgswBrainGame > *:not(#sgsw3DWorld) {
      position:relative;
      z-index:2;
    }

    #sgswBrainGame .sgsw-game-panel {
      background:rgba(6,20,39,.76) !important;
      backdrop-filter:blur(9px);
    }

    #sgswBrainGame .sgsw-character-card {
      background:rgba(9,29,53,.76) !important;
      backdrop-filter:blur(9px);
    }
  `;

  document.head.appendChild(style);

  /* ---------- MATERIALS ---------- */

  const makeMaterial = (color, metalness = 0.5, roughness = 0.35) =>
    new THREE.MeshStandardMaterial({
      color,
      metalness,
      roughness
    });

  function box(parent, x, y, z, w, h, d, material) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      material
    );

    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  function light(color, intensity, x, y, z, distance = 40) {
    const lamp = new THREE.PointLight(color, intensity, distance);
    lamp.position.set(x, y, z);
    scene.add(lamp);
    return lamp;
  }

  /* ---------- INITIALIZATION ---------- */

  async function initialize() {
    try {
      THREE = await import(
        "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"
      );

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x071426);
      scene.fog = new THREE.FogExp2(0x071426, 0.009);

      camera = new THREE.PerspectiveCamera(48, 1, 0.1, 180);
      camera.position.set(0, 7, 22);
      camera.lookAt(0, 4, -5);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.5)
      );

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      world.appendChild(renderer.domElement);

      createLighting();
      createFloor();
      createWalls();
      createBookshelves();
      createArches();
      createCeiling();
      createHologram();
      createParticles();

      observer = new ResizeObserver(resize);
      observer.observe(game);

      resize();
      animate();

      console.log("SGS 3D LIBRARY: READY");

    } catch (error) {
      console.error("SGS 3D Library Error:", error);

      world.innerHTML = `
        <div style="
          padding:24px;
          color:#9ecfff;
          text-align:center;
        ">
          3D environment could not be loaded.
          Please check your internet connection.
        </div>
      `;
    }
  }

  /* ---------- LIGHTING ---------- */

  function createLighting() {
    scene.add(
      new THREE.HemisphereLight(
        0x9bcaff,
        0x101a30,
        2
      )
    );

    const main = new THREE.DirectionalLight(0xe4f1ff, 2.2);
    main.position.set(0, 18, 10);
    scene.add(main);

    light(0x168cff, 150, -12, 8, -5, 55);
    light(0x168cff, 130, 12, 8, -8, 55);
    light(0xffc66e, 90, 0, 10, -18, 45);
    light(0x287dff, 65, 0, 4, 8, 30);
  }

  /* ---------- REFLECTIVE FLOOR ---------- */

  function createFloor() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      makeMaterial(0x0b1b31, 0.82, 0.2)
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.12;
    scene.add(floor);

    const grid = new THREE.GridHelper(
      90,
      55,
      0x247ac0,
      0x183654
    );

    grid.position.y = -0.08;
    grid.material.transparent = true;
    grid.material.opacity = 0.2;
    scene.add(grid);

    const blue = new THREE.MeshBasicMaterial({
      color: 0x168cff
    });

    for (const x of [-10, -5, 5, 10]) {
      box(scene, x, -0.04, -8, 0.035, 0.025, 42, blue);
    }

    box(
      scene,
      0, -0.025, -7,
      0.07, 0.03, 30,
      new THREE.MeshBasicMaterial({ color: 0xd9a94e })
    );
  }

  /* ---------- LIBRARY WALLS ---------- */

  function createWalls() {
    const wall = makeMaterial(0x122b49, 0.65, 0.3);
    const trim = makeMaterial(0x24496c, 0.8, 0.25);

    const blue = new THREE.MeshBasicMaterial({
      color: 0x168cff
    });

    box(scene, 0, 8, -23, 46, 17, 1, wall);

    for (let x = -19; x <= 19; x += 4.75) {
      box(scene, x, 8, -22.35, 0.09, 14, 0.08, blue);
      box(scene, x, 15.2, -22.3, 4.4, 0.12, 0.15, trim);
    }

    box(scene, -22.5, 7, -6, 1, 14, 34, wall);
    box(scene, 22.5, 7, -6, 1, 14, 34, wall);

    for (const x of [-22, 22]) {
      box(scene, x, 7, -6, 0.08, 13, 0.08, blue);
    }
  }

  /* ---------- BOOKSHELVES ---------- */

  function createBookshelves() {
    const frame = makeMaterial(0x203e5e, 0.72, 0.3);

    const colors = [
      0x1a4d78,
      0x315b82,
      0x8b693b,
      0x18334f,
      0x536c87,
      0x8d4d46
    ];

    const blue = new THREE.MeshBasicMaterial({
      color: 0x279fff
    });

    for (const side of [-1, 1]) {
      for (let row = 0; row < 3; row++) {
        const z = -19 + row * 7;
        const x = side * 18;

        box(scene, x, 5, z, 5.8, 10, 0.65, frame);

        for (let level = 0; level < 5; level++) {
          const y = 1.2 + level * 1.8;

          box(
            scene,
            x, y, z + 0.42,
            5.5, 0.12, 1.1,
            frame
          );

          for (let b = 0; b < 11; b++) {
            const book = new THREE.Mesh(
              new THREE.BoxGeometry(
                0.28 + Math.random() * 0.16,
                0.95 + Math.random() * 0.55,
                0.42
              ),
              makeMaterial(
                colors[Math.floor(Math.random() * colors.length)],
                0.25,
                0.55
              )
            );

            book.position.set(
              x - 2.35 + b * 0.46,
              y + 0.55,
              z + 0.48
            );

            scene.add(book);
          }
        }

        box(
          scene,
          x + side * 2.9,
          5,
          z + 0.4,
          0.045, 9, 0.05,
          blue
        );
      }
    }
  }

  /* ---------- GRAND ARCHITECTURE ---------- */

  function createArches() {
    const archMaterial = makeMaterial(0x244a70, 0.85, 0.22);

    const blue = new THREE.MeshBasicMaterial({
      color: 0x278fff
    });

    const gold = new THREE.MeshBasicMaterial({
      color: 0xd9ad62
    });

    for (let i = 0; i < 4; i++) {
      const arch = new THREE.Group();

      const left = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 12, 0.75),
        archMaterial
      );

      left.position.set(-12, 6, 0);

      const right = left.clone();
      right.position.x = 12;

      const top = new THREE.Mesh(
        new THREE.BoxGeometry(24.5, 0.7, 0.75),
        archMaterial
      );

      top.position.y = 12;

      const leftGlow = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 11, 0.08),
        blue
      );

      leftGlow.position.set(-11.6, 6, 0.4);

      const rightGlow = leftGlow.clone();
      rightGlow.position.x = 11.6;

      arch.add(left, right, top, leftGlow, rightGlow);
      arch.position.z = -20 + i * 8;

      scene.add(arch);
    }

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.045, 12, 100),
      blue
    );

    ring.position.set(0, 10, -21);
    scene.add(ring);

    const ringGold = new THREE.Mesh(
      new THREE.TorusGeometry(4.4, 0.035, 12, 100),
      gold
    );

    ringGold.position.set(0, 10, -20.9);
    scene.add(ringGold);

    animatedObjects.push(ring, ringGold);
  }

  /* ---------- CEILING ---------- */

  function createCeiling() {
    const ceiling = makeMaterial(0x10243d, 0.7, 0.3);
    const beams = makeMaterial(0x315477, 0.8, 0.25);

    const glow = new THREE.MeshBasicMaterial({
      color: 0x247fff
    });

    box(scene, 0, 16, -7, 45, 0.8, 34, ceiling);

    for (let z = -22; z <= 8; z += 7) {
      box(scene, 0, 15.35, z, 44, 0.22, 0.3, beams);

      const strip = box(
        scene,
        0, 15.18, z,
        30, 0.035, 0.06,
        glow
      );

      animatedObjects.push(strip);
    }

    for (const x of [-10, -5, 0, 5, 10]) {
      box(scene, x, 15.45, -7, 0.045, 0.04, 26, glow);
    }
  }

  /* ---------- CENTRAL HOLOGRAM ---------- */

  function createHologram() {
    const group = new THREE.Group();

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3.5, 0.5, 64),
      makeMaterial(0x173a5e, 0.85, 0.2)
    );

    base.position.y = 0.25;
    group.add(base);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.15, 0.07, 12, 80),
      new THREE.MeshBasicMaterial({ color: 0x299fff })
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.55;
    group.add(ring);

    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.1, 1),
      new THREE.MeshStandardMaterial({
        color: 0x4cbdff,
        emissive: 0x075baf,
        metalness: 0.6,
        roughness: 0.18
      })
    );

    core.position.y = 2.4;
    group.add(core);

    group.position.set(0, 0, -8);
    scene.add(group);

    animatedObjects.push(ring, core);
  }

  /* ---------- ATMOSPHERE ---------- */

  function createParticles() {
    const count = 180;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 42;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = -25 + Math.random() * 38;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0x83caff,
        size: 0.075,
        transparent: true,
        opacity: 0.7
      })
    );

    scene.add(particles);
    particleSystems.push(particles);
  }

  /* ---------- RESIZE ---------- */

  function resize() {
    if (!renderer || !camera) return;

    const width = Math.max(game.clientWidth, 1);
    const height = Math.max(game.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
  }

  /* ---------- ANIMATION ---------- */

  function animate() {
    animationId = requestAnimationFrame(animate);
    clock += 0.008;

    animatedObjects.forEach((item) => {
      if (item.geometry.type === "TorusGeometry") {
        item.rotation.z += 0.0015;
      }

      if (item.geometry.type === "OctahedronGeometry") {
        item.rotation.y += 0.006;
        item.position.y = 2.4 + Math.sin(clock * 2) * 0.16;
      }
    });

    particleSystems.forEach(item => {
      item.rotation.y += 0.00025;
    });

    camera.position.x = Math.sin(clock * 0.35) * 0.35;
    camera.position.y = 7 + Math.sin(clock * 0.5) * 0.12;

    camera.lookAt(0, 4, -5);

    renderer.render(scene, camera);
  }

  /* ---------- START ONLY WHEN GAME OPENS ---------- */

  function startWhenVisible() {
    if (started || !game.classList.contains("active")) return;

    started = true;
    initialize();
  }

  observer = new MutationObserver(startWhenVisible);

  observer.observe(game, {
    attributes: true,
    attributeFilter: ["class"]
  });

  startWhenVisible();

})();
