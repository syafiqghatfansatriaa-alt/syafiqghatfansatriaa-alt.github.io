/* ==========================================
   SGS BRAIN CHALLENGE 3D V2
   FUTURISTIC GRAND LIBRARY
   DISPLAY FIX + STARTUP DIAGNOSTICS
========================================== */

(() => {
  "use strict";

  const game = document.getElementById("sgswBrainGame");

  if (!game || game.dataset.sgs3dV2Loaded === "true") return;

  game.dataset.sgs3dV2Loaded = "true";

  // STARTUP DIAGNOSTIC
  const debug = document.createElement("div");
  debug.id = "sgs3dDebug";
  debug.textContent = "SGS 3D V2: SCRIPT BERJALAN";
  debug.style.cssText =
    "position:fixed;top:10px;left:10px;z-index:999999;background:#071426;color:white;padding:12px;border:2px solid #55caff;font:13px Arial;border-radius:8px;";
  document.body.appendChild(debug);

  let THREE = null;
  let scene = null;
  let camera = null;
  let renderer = null;
  let resizeObserver = null;
  let classObserver = null;
  let animationFrame = null;
  let running = false;
  let clock = 0;

  const world = document.createElement("div");
  world.id = "sgsw3DWorldV2";
  game.prepend(world);

  // 3D WORLD + DASHBOARD DISPLAY FIX
  const style = document.createElement("style");

  style.textContent = `
    #sgswBrainGame {
      position: relative !important;
      isolation: isolate !important;
      overflow: hidden !important;
      min-height: 100vh !important;
      background: #071426 !important;
    }

    #sgsw3DWorldV2 {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
      pointer-events: none;
      background: #071426;
    }

    #sgsw3DWorldV2 canvas {
      display: block;
      width: 100%;
      height: 100%;
    }

    #sgswBrainGame > *:not(#sgsw3DWorldV2) {
      position: relative;
      z-index: 2;
    }

    #sgswBrainGame .sgsw-game-panel,
    #sgswBrainGame .sgsw-character-card {
      background: rgba(5,18,38,.78) !important;
      backdrop-filter: blur(12px);
    }

    /* FIX: SHOW BRAIN GAME IN FULLSCREEN DEVELOPER MODE */
    body.sgsw-dashboard-mode main > #sgswBrainGame.active {
      display: block !important;
      position: fixed !important;
      inset: 0 !important;
      z-index: 100000 !important;
      width: 100% !important;
      max-width: none !important;
      height: 100dvh !important;
      margin: 0 !important;
      padding: 20px !important;
      overflow-y: auto !important;
      background: #071426 !important;
    }
  `;

  document.head.appendChild(style);

  const objects = [];

  function material(color, metalness = .5, roughness = .35) {
    return new THREE.MeshStandardMaterial({
      color,
      metalness,
      roughness
    });
  }

  function addBox(x, y, z, w, h, d, mat) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      mat
    );

    mesh.position.set(x, y, z);
    scene.add(mesh);

    return mesh;
  }

  function addLight(color, intensity, x, y, z) {
    const lamp = new THREE.PointLight(
      color,
      intensity,
      55
    );

    lamp.position.set(x, y, z);
    scene.add(lamp);
  }

  // FUTURISTIC GRAND LIBRARY
  function createLibrary() {
    scene.background = new THREE.Color(0x071426);
    scene.fog = new THREE.FogExp2(0x071426, .012);

    scene.add(
      new THREE.HemisphereLight(
        0x9acbff,
        0x101a30,
        2
      )
    );

    const mainLight = new THREE.DirectionalLight(
      0xe6f2ff,
      2.5
    );

    mainLight.position.set(0, 18, 8);
    scene.add(mainLight);

    addLight(0x168cff, 180, -13, 8, -7);
    addLight(0x168cff, 180, 13, 8, -7);
    addLight(0xffc66e, 120, 0, 12, -20);

    // FLOOR
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      material(0x0b1b31, .85, .2)
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -.1;
    scene.add(floor);

    // FLOOR GRID
    const grid = new THREE.GridHelper(
      90,
      55,
      0x247ac0,
      0x183654
    );

    grid.position.y = -.07;
    grid.material.transparent = true;
    grid.material.opacity = .2;
    scene.add(grid);

    const wall = material(0x122b49, .7, .3);
    const gold = material(0xc59b54, .8, .25);

    const blue = new THREE.MeshBasicMaterial({
      color: 0x168cff
    });

    // WALLS
    addBox(0, 8, -24, 46, 17, 1, wall);
    addBox(-23, 8, -6, 1, 17, 36, wall);
    addBox(23, 8, -6, 1, 17, 36, wall);

    // BOOKSHELVES
    const colors = [
      0x31577d,
      0x8b693b,
      0x315c68,
      0x754a49,
      0x536c87
    ];

    for (const side of [-1, 1]) {
      for (let row = 0; row < 3; row++) {
        const x = side * 18;
        const z = -20 + row * 8;

        addBox(x, 5, z, 5.8, 10, .7, gold);

        for (let level = 0; level < 5; level++) {
          const y = 1.2 + level * 1.8;

          addBox(x, y, z + .45, 5.5, .12, 1, gold);

          for (let b = 0; b < 10; b++) {
            const book = new THREE.Mesh(
              new THREE.BoxGeometry(
                .3 + Math.random() * .12,
                .9 + Math.random() * .6,
                .4
              ),
              material(
                colors[Math.floor(Math.random() * colors.length)],
                .2,
                .6
              )
            );

            book.position.set(
              x - 2.3 + b * .46,
              y + .55,
              z + .5
            );

            scene.add(book);
          }
        }

        addBox(side * 21, 5, z, .06, 9, .08, blue);
      }
    }

    // GOLDEN ARCHES
    for (let i = 0; i < 4; i++) {
      const z = -21 + i * 8;

      addBox(-12, 6, z, .6, 12, .8, gold);
      addBox(12, 6, z, .6, 12, .8, gold);
      addBox(0, 12, z, 24.5, .6, .8, gold);

      addBox(-11.6, 6, z + .5, .07, 11, .08, blue);
      addBox(11.6, 6, z + .5, .07, 11, .08, blue);
    }

    // HOLOGRAPHIC CORE
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.3, 1),
      new THREE.MeshStandardMaterial({
        color: 0x55caff,
        emissive: 0x075baf,
        metalness: .7,
        roughness: .15
      })
    );

    core.position.set(0, 3, -9);
    scene.add(core);
    objects.push(core);

    // HOLOGRAPHIC RING
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.5, .06, 12, 90),
      blue
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, .7, -9);
    scene.add(ring);
    objects.push(ring);

    // FLOATING PARTICLES
    const count = 220;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - .5) * 42;
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
        size: .08,
        transparent: true,
        opacity: .75
      })
    );

    scene.add(particles);
    objects.push(particles);
  }

  // RESPONSIVE RESIZE
  function resize() {
    if (!renderer || !camera) return;

    const width = Math.max(game.clientWidth, 1);
    const height = Math.max(game.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
  }

  // ANIMATION LOOP
  function animate() {
    if (!running) return;

    animationFrame = requestAnimationFrame(animate);
    clock += .008;

    objects.forEach(object => {
      if (object.geometry.type === "OctahedronGeometry") {
        object.rotation.y += .006;
        object.position.y = 3 + Math.sin(clock * 2) * .15;
      }

      if (object.geometry.type === "TorusGeometry") {
        object.rotation.z += .0015;
      }

      if (object.isPoints) {
        object.rotation.y += .0003;
      }
    });

    camera.position.x = Math.sin(clock * .3) * .3;
    camera.position.y = 7 + Math.sin(clock * .5) * .12;
    camera.lookAt(0, 4, -7);

    renderer.render(scene, camera);
  }

  // START 3D ENGINE
  async function start() {
    if (running) return;

    debug.textContent = "SGS 3D V2: MEMULAI...";

    try {
      THREE = await import(
        "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"
      );

      debug.textContent =
        "SGS 3D V2: THREE.JS BERHASIL DIMUAT";

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        48,
        1,
        .1,
        180
      );

      camera.position.set(0, 7, 22);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      });

      debug.textContent =
        "SGS 3D V2: RENDERER BERHASIL DIBUAT";

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.5)
      );

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;

      world.appendChild(renderer.domElement);

      createLibrary();

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(game);

      resize();

      running = true;
      animate();

      debug.textContent =
        "SGS 3D V2: LIBRARY BERHASIL DIMUAT";

      console.log("SGS 3D V2: LIBRARY READY");

    } catch (error) {
      console.error("SGS 3D V2:", error);

      debug.textContent =
        "SGS 3D ERROR: " + error.message;

      world.textContent =
        "3D WORLD ERROR: " + error.message;

      world.style.color = "white";
      world.style.padding = "20px";
    }
  }

  // STOP ENGINE
  function stop() {
    running = false;

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  // CHECK GAME VISIBILITY
  function checkVisibility() {
    if (game.classList.contains("active")) {
      start();
    } else {
      stop();
    }
  }

  // OBSERVE GAME CLASS
  classObserver = new MutationObserver(checkVisibility);

  classObserver.observe(game, {
    attributes: true,
    attributeFilter: ["class"]
  });

  checkVisibility();

  console.log("SGS BRAIN CHALLENGE 3D V2 LOADED");

})();
