
/* =========================================
   SGS BRAIN CHALLENGE — 3D WORLD ENGINE
   THREE.JS FOUNDATION
   VEKTOR & KIBOY WORLD
========================================= */

(() => {
  const game = document.getElementById("sgswBrainGame");

  if (!game) {
    console.warn("SGS 3D: Brain Challenge screen tidak ditemukan.");
    return;
  }

  let renderer;
  let scene;
  let camera;
  let animationFrame;
  let resizeObserver;
  let THREE;

  const state = {
    active: true,
    clock: 0,
    particles: [],
    pillars: [],
    characterPlatforms: []
  };

  const style = document.createElement("style");
  style.textContent = `
    #sgsw3DWorld {
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      z-index:0;
      pointer-events:none;
      overflow:hidden;
    }

    #sgsw3DWorld canvas {
      display:block;
      width:100%;
      height:100%;
    }

    #sgswBrainGame {
      position:relative;
      isolation:isolate;
      overflow:hidden;
      background:#061326;
    }

    #sgswBrainGame > *:not(#sgsw3DWorld) {
      position:relative;
    }
  `;
  document.head.appendChild(style);

  const world = document.createElement("div");
  world.id = "sgsw3DWorld";
  game.prepend(world);

  function createMaterial(THREE, color, emissive = 0x000000) {
    return new THREE.MeshStandardMaterial({
      color,
      emissive,
      metalness: 0.65,
      roughness: 0.32
    });
  }

  async function initialize() {
    try {
      THREE = await import(
        "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"
      );

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x061326);
      scene.fog = new THREE.FogExp2(0x071a35, 0.018);

      camera = new THREE.PerspectiveCamera(
        48,
        1,
        0.1,
        1000
      );

      camera.position.set(0, 8, 24);
      camera.lookAt(0, 3, 0);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.5)
      );

      renderer.shadowMap.enabled = false;

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      world.appendChild(renderer.domElement);

      createLighting();
      createFloor();
      createArchitecture();
      createCharacterPlatforms();
      createParticles();

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(game);

      resize();
      animate();

      console.log("SGS 3D World berhasil dimuat.");

    } catch (error) {
      console.error("SGS 3D gagal dimuat:", error);
      world.innerHTML = `
        <div style="
          color:#9ecfff;
          padding:20px;
          font:14px Arial;
        ">
          SGS 3D World belum dapat dimuat.
          Periksa koneksi internet dan dukungan WebGL.
        </div>
      `;
    }
  }

  function createLighting() {
    const ambient = new THREE.AmbientLight(
      0x8dbbff,
      1.4
    );
    scene.add(ambient);

    const blueLight = new THREE.PointLight(
      0x168cff,
      100,
      55
    );
    blueLight.position.set(-8, 10, 5);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(
      0xffbd58,
      75,
      45
    );
    goldLight.position.set(9, 8, -5);
    scene.add(goldLight);

    const topLight = new THREE.DirectionalLight(
      0xffffff,
      1.5
    );
    topLight.position.set(0, 15, 8);
    scene.add(topLight);
  }

  function createFloor() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      createMaterial(THREE, 0x091a31)
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.1;
    scene.add(floor);

    const grid = new THREE.GridHelper(
      100,
      80,
      0x1678c9,
      0x12365b
    );

    grid.position.y = 0.015;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    scene.add(grid);
  }

  function createArchitecture() {
    const wallMaterial = createMaterial(
      THREE,
      0x102b4b
    );

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x168cff
    });

    // Dinding belakang
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(42, 18, 1),
      wallMaterial
    );

    backWall.position.set(0, 8, -12);
    scene.add(backWall);

    // Pilar futuristik
    for (let i = 0; i < 8; i++) {
      const x = -17 + i * 4.8;

      const pillar = new THREE.Group();

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 12, 1.15),
        wallMaterial
      );

      body.position.y = 6;

      const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 9, 0.08),
        glowMaterial
      );

      light.position.set(0.59, 6, 0.59);

      pillar.add(body, light);
      pillar.position.set(x, 0, -11);

      scene.add(pillar);
      state.pillars.push(pillar);
    }

    // Ornamen lingkaran bercahaya
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.055, 12, 100),
      new THREE.MeshBasicMaterial({
        color: 0x268fff
      })
    );

    ring.position.set(0, 9, -10);
    scene.add(ring);

    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.7, 0.035, 10, 100),
      new THREE.MeshBasicMaterial({
        color: 0xe9b65d
      })
    );

    innerRing.position.set(0, 9, -9.8);
    scene.add(innerRing);
  }

  function createCharacterPlatforms() {
    const positions = [-5, 5];

    positions.forEach((x, index) => {
      const platform = new THREE.Group();

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(
          2.1,
          2.35,
          0.45,
          48
        ),
        createMaterial(
          THREE,
          0x173c64,
          0x062b5c
        )
      );

      base.position.y = 0.25;
      platform.add(base);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
          2.05,
          0.07,
          12,
          64
        ),
        new THREE.MeshBasicMaterial({
          color: index === 0 ? 0x28aaff : 0xe8bd65
        })
      );

      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.5;
      platform.add(ring);

      platform.position.set(x, 0, 1);
      scene.add(platform);

      state.characterPlatforms.push({
        group: platform,
        ring,
        index
      });
    });
  }

  function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const count = 180;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = Math.random() * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0x78caff,
      size: 0.09,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(
      geometry,
      material
    );

    scene.add(particles);
    state.particles.push(particles);
  }

  function resize() {
    if (!renderer || !camera) return;

    const width = Math.max(game.clientWidth, 1);
    const height = Math.max(game.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
  }

  function animate() {
    animationFrame = requestAnimationFrame(animate);

    if (!renderer || !scene || !camera) return;

    state.clock += 0.01;

    state.characterPlatforms.forEach((item, i) => {
      item.ring.rotation.z += 0.004 + i * 0.001;
      item.group.position.y =
        Math.sin(state.clock + i) * 0.06;
    });

    state.pillars.forEach((pillar, i) => {
      pillar.children[1].material.opacity =
        0.65 + Math.sin(state.clock * 2 + i) * 0.2;
    });

    state.particles.forEach(particle => {
      particle.rotation.y += 0.0005;
    });

    renderer.render(scene, camera);
  }

  function stop() {
    if (!state.active) return;

    state.active = false;
    cancelAnimationFrame(animationFrame);

    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    if (renderer) {
      renderer.dispose();
    }
  }

  window.addEventListener("pagehide", stop, {
    once: true
  });

  initialize();
})();
