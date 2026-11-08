
/* ============================================
   SGS BRAIN CHALLENGE
   FUTURISTIC 3D LIBRARY ENVIRONMENT
   THREE.JS r180
============================================ */

(() => {
  const game = document.getElementById("sgswBrainGame");
  if (!game || game.dataset.sgs3dReady === "true") return;
  game.dataset.sgs3dReady = "true";

  let THREE, scene, camera, renderer, observer;
  let frame = 0;
  let clock = 0;

  const animated = [];
  const particles = [];

  const style = document.createElement("style");
  style.textContent = `
    #sgsw3DWorld {
      position:absolute;
      inset:0;
      z-index:0;
      overflow:hidden;
      pointer-events:none;
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

  const material = (color, metalness = 0.5, roughness = 0.35) =>
    new THREE.MeshStandardMaterial({
      color,
      metalness,
      roughness
    });

  function addBox(parent, x, y, z, w, h, d, mat) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      mat
    );
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  function addLight(color, intensity, x, y, z, distance = 35) {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(x, y, z);
    scene.add(light);
    return light;
  }

  async function initialize() {
    try {
      THREE = await import(
        "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"
      );

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x071426);
      scene.fog = new THREE.FogExp2(0x071426, 0.012);

      camera = new THREE.PerspectiveCamera(48, 1, 0.1, 180);
      camera.position.set(0, 7, 22);
      camera.lookAt(0, 4, -5);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
      });

      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      world.appendChild(renderer.domElement);

      createLighting();
      createFloor();
      createLibraryWalls();
      createBookshelves();
      createGrandArches();
      createCeiling();
      createCentralHologram();
      createAtmosphere();

      observer = new ResizeObserver(resize);
      observer.observe(game);
      resize();
      animate();

      console.log("SGS Futuristic Library 3D loaded.");

    } catch (error) {
      console.error("SGS 3D error:", error);
      world.innerHTML =
        '<div style="padding:20px;color:#9ecfff">3D World tidak dapat dimuat. Periksa koneksi internet dan dukungan WebGL.</div>';
    }
  }

  function createLighting() {
    scene.add(new THREE.HemisphereLight(0x9bcaff, 0x101a30, 2));

    const main = new THREE.DirectionalLight(0xe4f1ff, 2.2);
    main.position.set(0, 18, 10);
    scene.add(main);

    addLight(0x168cff, 150, -12, 8, -5, 55);
    addLight(0x168cff, 130, 12, 8, -8, 55);
    addLight(0xffc66e, 90, 0, 10, -18, 45);
    addLight(0x287dff, 65, 0, 4, 8, 30);
  }

  function createFloor() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      material(0x0b1b31, 0.82, 0.2)
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.12;
    scene.add(floor);

    const grid = new THREE.GridHelper(90, 55, 0x247ac0, 0x183654);
    grid.position.y = -0.08;
    grid.material.transparent = true;
    grid.material.opacity = 0.2;
    scene.add(grid);

    // Garis cahaya pada lantai
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x168cff });
    for (let x of [-10, -5, 5, 10]) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.025, 42),
        lineMat
      );
      line.position.set(x, -0.04, -8);
      scene.add(line);
    }

    // Jalur emas menuju pusat ruangan
    const goldLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.03, 30),
      new THREE.MeshBasicMaterial({ color: 0xd9a94e })
    );
    goldLine.position.set(0, -0.025, -7);
    scene.add(goldLine);
  }

  function createLibraryWalls() {
    const wall = material(0x122b49, 0.65, 0.3);
    const trim = material(0x24496c, 0.8, 0.25);
    const glow = new THREE.MeshBasicMaterial({ color: 0x168cff });

    // Dinding belakang
    addBox(scene, 0, 8, -23, 46, 17, 1, wall);

    // Panel-panel dinding
    for (let x = -19; x <= 19; x += 4.75) {
      addBox(scene, x, 8, -22.35, 0.09, 14, 0.08, glow);
      addBox(scene, x, 15.2, -22.3, 4.4, 0.12, 0.15, trim);
    }

    // Dinding samping
    addBox(scene, -22.5, 7, -6, 1, 14, 34, wall);
    addBox(scene, 22.5, 7, -6, 1, 14, 34, wall);

    for (const x of [-22, 22]) {
      const strip = addBox(scene, x, 7, -6, 0.08, 13, 0.08, glow);
      strip.material = glow;
    }
  }

  function createBookshelves() {
    const frameMat = material(0x203e5e, 0.72, 0.3);
    const bookColors = [
      0x1a4d78, 0x315b82, 0x8b693b,
      0x18334f, 0x536c87, 0x8d4d46
    ];

    // Rak kiri dan kanan, tersusun berlapis ke belakang
    for (const side of [-1, 1]) {
      for (let row = 0; row < 3; row++) {
        const z = -19 + row * 7;
        const x = side * 18;

        addBox(scene, x, 5, z, 5.8, 10, 0.65, frameMat);

        for (let level = 0; level < 5; level++) {
          const y = 1.2 + level * 1.8;

          addBox(
            scene, x, y, z + 0.42,
            5.5, 0.12, 1.1, frameMat
          );

          for (let b = 0; b < 11; b++) {
            const book = new THREE.Mesh(
              new THREE.BoxGeometry(
                0.28 + Math.random() * 0.16,
                0.95 + Math.random() * 0.55,
                0.42
              ),
              new THREE.MeshStandardMaterial({
                color: bookColors[
                  Math.floor(Math.random() * bookColors.length)
                ],
                metalness: 0.25,
                roughness: 0.55
              })
            );

            book.position.set(
              x - 2.35 + b * 0.46,
              y + 0.55,
              z + 0.48
            );
            scene.add(book);
          }
        }

        // Cahaya vertikal di sisi rak
        const light = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 9, 0.05),
          new THREE.MeshBasicMaterial({ color: 0x279fff })
        );
        light.position.set(x + side * 2.9, 5, z + 0.4);
        scene.add(light);
      }
    }
  }

  function createGrandArches() {
    const archMat = material(0x244a70, 0.85, 0.22);
    const blue = new THREE.MeshBasicMaterial({ color: 0x278fff });
    const gold = new THREE.MeshBasicMaterial({ color: 0xd9ad62 });

    // Deretan lengkungan arsitektur
    for (let i = 0; i < 4; i++) {
      const z = -20 + i * 8;
      const arch = new THREE.Group();

      const left = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 12, 0.75), archMat
      );
      left.position.set(-12, 6, 0);

      const right = left.clone();
      right.position.x = 12;

      const top = new THREE.Mesh(
        new THREE.BoxGeometry(24.5, 0.7, 0.75), archMat
      );
      top.position.y = 12;

      const leftGlow = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 11, 0.08), blue
      );
      leftGlow.position.set(-11.6, 6, 0.4);

      const rightGlow = leftGlow.clone();
      rightGlow.position.x = 11.6;

      arch.add(left, right, top, leftGlow, rightGlow);
      arch.position.z = z;
      scene.add(arch);
    }

    // Cincin dekoratif di pusat ruangan
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.045, 12, 100),
      blue
    );
    ring.position.set(0, 10, -21);
    scene.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.4, 0.035, 12, 100),
      gold
    );
    ring2.position.set(0, 10, -20.9);
    scene.add(ring2);

    animated.push(ring, ring2);
  }

  function createCeiling() {
    const ceilingMat = material(0x10243d, 0.7, 0.3);
    addBox(scene, 0, 16, -7, 45, 0.8, 34, ceilingMat);

    const beamMat = material(0x315477, 0.8, 0.25);
    const glow = new THREE.MeshBasicMaterial({ color: 0x247fff });

    for (let z = -22; z <= 8; z += 7) {
      addBox(scene, 0, 15.35, z, 44, 0.22, 0.3, beamMat);

      const light = addBox(scene, 0, 15.18, z, 30, 0.035, 0.06, glow);
      animated.push(light);
    }

    // Panel langit-langit bercahaya
    for (let x of [-10, -5, 0, 5, 10]) {
      addBox(
        scene, x, 15.45, -7,
        0.045, 0.04, 26, glow
      );
    }
  }

  function createCentralHologram() {
    const group = new THREE.Group();

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3.5, 0.5, 64),
      material(0x173a5e, 0.85, 0.2)
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

    animated.push(ring, core);
  }

  function createAtmosphere() {
    const count = 220;
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

    const points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0x83caff,
        size: 0.075,
        transparent: true,
        opacity: 0.7
      })
    );

    scene.add(points);
    particles.push(points);
  }

  function resize() {
    if (!renderer || !camera) return;

    const w = Math.max(game.clientWidth, 1);
    const h = Math.max(game.clientHeight, 1);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function animate() {
    frame = requestAnimationFrame(animate);
    clock += 0.008;

    animated.forEach((item, i) => {
      if (item.geometry.type === "TorusGeometry") {
        item.rotation.z += 0.0015 + i * 0.0002;
      } else if (item.geometry.type === "OctahedronGeometry") {
        item.rotation.y += 0.006;
        item.position.y = 2.4 + Math.sin(clock * 2) * 0.16;
      }
    });

    particles.forEach(item => {
      item.rotation.y += 0.00025;
    });

    // Gerakan kamera yang sangat halus
    camera.position.x = Math.sin(clock * 0.35) * 0.35;
    camera.position.y = 7 + Math.sin(clock * 0.5) * 0.12;
    camera.lookAt(0, 4, -5);

    renderer.render(scene, camera);
  }

  function cleanup() {
    cancelAnimationFrame(frame);
    if (observer) observer.disconnect();
    if (renderer) renderer.dispose();
  }

  window.addEventListener("pagehide", cleanup, { once: true });
  initialize();
})();
