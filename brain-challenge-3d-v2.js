/* =========================================================
   SGS BRAIN CHALLENGE — IMMERSIVE 3D ENVIRONMENT
   FUTURISTIC GRAND LIBRARY / NO CHARACTERS
   Three.js r180 · Responsive · Touch + Mouse camera
========================================================= */
(() => {
  "use strict";
  const game = document.getElementById("sgswBrainGame");
  if (!game || game.dataset.sgs3dV2Loaded === "true") return;
  game.dataset.sgs3dV2Loaded = "true";

  let THREE, scene, camera, renderer, observer;
  let raf = 0, running = false, elapsed = 0;
  let targetYaw = 0, yaw = 0, targetPitch = 0, pitch = 0;
  let dragging = false, lastX = 0, lastY = 0, pointerDown = false;

  const world = document.createElement("div");
  world.id = "sgs3DLibraryWorld";
  world.setAttribute("aria-hidden", "true");
  game.prepend(world);

  const style = document.createElement("style");
  style.textContent = [
    "#sgswBrainGame{position:relative!important;isolation:isolate!important;overflow:hidden!important;min-height:100vh!important;min-height:100dvh!important;width:100%!important;max-width:none!important;background:#07111f!important;color:#f4f7ff;padding:clamp(14px,3vw,34px)!important}",
    "#sgs3DLibraryWorld{position:absolute!important;inset:0!important;z-index:0!important;overflow:hidden!important;background:linear-gradient(#07111f,#10243b 60%,#07111f);pointer-events:auto}",
    "#sgs3DLibraryWorld canvas{display:block!important;width:100%!important;height:100%!important}",
    "#sgswBrainGame>*:not(#sgs3DLibraryWorld){position:relative;z-index:2}",
    "#sgswBrainGame .sgsw-character-stage,#sgswBrainGame .sgsw-game-atmosphere{display:none!important}",
    "#sgswBrainGame .sgsw-game-back{position:relative;z-index:5;background:rgba(5,15,29,.76)!important;border:1px solid rgba(132,198,255,.55)!important;backdrop-filter:blur(12px)}",
    "#sgswBrainGame .sgsw-game-panel{max-width:850px;margin:clamp(90px,17vh,170px) auto 35px!important;background:rgba(5,15,29,.72)!important;border:1px solid rgba(125,190,245,.5)!important;box-shadow:0 22px 70px rgba(0,0,0,.42),inset 0 0 35px rgba(83,157,224,.08)!important;backdrop-filter:blur(14px)}",
    "#sgswBrainGame .sgsw-game-question{background:rgba(7,24,43,.82)!important}",
    "body.sgsw-dashboard-mode main>#sgswBrainGame.active{display:block!important;position:fixed!important;inset:0!important;z-index:100000!important;width:100%!important;max-width:none!important;height:100vh!important;height:100dvh!important;margin:0!important;padding:clamp(12px,2vw,26px)!important;overflow-y:auto!important;background:#07111f!important}",
    "@media(max-width:650px){#sgswBrainGame .sgsw-game-panel{margin-top:clamp(80px,13vh,125px)!important;padding:18px!important}#sgswBrainGame .sgsw-game-back{font-size:11px}}"
  ].join("");
  document.head.appendChild(style);

  const mats = { book: [] };

  function makeMat(color, metalness, roughness, emissive, emissiveIntensity) {
    return new THREE.MeshStandardMaterial({
      color, metalness, roughness,
      emissive: emissive || 0x000000,
      emissiveIntensity: emissiveIntensity || 0
    });
  }

  function box(parent, x, y, z, w, h, d, mat, cast) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = !!cast;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function strip(parent, x, y, z, w, h, d, color) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshBasicMaterial({ color, toneMapped: false })
    );
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  function createBookcase(parent, x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    parent.add(g);
    box(g, 0, 4.5, 0, 5.1, 9, .72, mats.darkWood, true);
    box(g, 0, 8.92, .03, 5.25, .18, .9, mats.gold, true);
    box(g, 0, .12, .03, 5.25, .24, .9, mats.gold, true);

    for (let level = 1; level <= 4; level++) {
      const y = level * 1.78;
      box(g, 0, y, .48, 5, .14, .95, mats.gold, true);
      for (let i = 0; i < 11; i++) {
        const bw = .27 + (i % 3) * .035;
        const bh = 1.05 + ((i * 7 + level * 3) % 6) * .09;
        const book = box(
          g, -2.25 + i * .43, y + .13 + bh / 2, .43,
          bw, bh, .42, mats.book[(i + level) % mats.book.length], true
        );
        book.rotation.z = ((i % 3) - 1) * .025;
      }
    }
    for (const sx of [-2.48, 2.48]) box(g, sx, 4.5, .12, .16, 9.1, .95, mats.gold, true);
    strip(g, -2.55, 4.6, .61, .045, 8.6, .035, 0x5bbcff);
    strip(g, 2.55, 4.6, .61, .045, 8.6, .035, 0x5bbcff);
  }

  function createArch(parent, z, width, height) {
    const g = new THREE.Group();
    g.position.z = z;
    parent.add(g);
    const x = width / 2;
    box(g, -x, height / 2, 0, .42, height, .65, mats.gold, true);
    box(g, x, height / 2, 0, .42, height, .65, mats.gold, true);
    box(g, 0, height, 0, width + .4, .42, .65, mats.gold, true);
    strip(g, -x + .24, height / 2, .36, .055, height - .5, .045, 0x3aaeff);
    strip(g, x - .24, height / 2, .36, .055, height - .5, .045, 0x3aaeff);
    strip(g, 0, height - .25, .36, width - .6, .055, .045, 0x3aaeff);
  }

  function createLibrary() {
    scene.background = new THREE.Color(0x071321);
    scene.fog = new THREE.FogExp2(0x071321, .0125);

    mats.stone = makeMat(0x17283a, .55, .28);
    mats.floor = makeMat(0x101f30, .72, .24);
    mats.darkWood = makeMat(0x182b3d, .38, .4);
    mats.gold = makeMat(0xb18a4d, .78, .24);
    mats.trim = makeMat(0x304a61, .72, .28);
    mats.glass = makeMat(0x1c5478, .48, .18, 0x0c4770, .7);
    mats.book = [
      makeMat(0x526b7c, .18, .7), makeMat(0x765b42, .18, .7),
      makeMat(0x355b65, .18, .7), makeMat(0x6e4850, .18, .7),
      makeMat(0x8b744c, .18, .7), makeMat(0x40527a, .18, .7)
    ];

    scene.add(new THREE.HemisphereLight(0xb9d9ff, 0x182234, 1.55));
    const key = new THREE.DirectionalLight(0xffe4b5, 2.1);
    key.position.set(-5, 18, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -25;
    key.shadow.camera.right = 25;
    key.shadow.camera.top = 25;
    key.shadow.camera.bottom = -25;
    scene.add(key);

    const blueLight = new THREE.PointLight(0x398dff, 95, 48, 1.8);
    blueLight.position.set(0, 8, -12);
    scene.add(blueLight);
    const warmLight = new THREE.PointLight(0xffc879, 70, 35, 1.7);
    warmLight.position.set(0, 10, 10);
    scene.add(warmLight);

    // Continuous enclosing floor, walls and ceiling.
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(58, 72), mats.floor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -.12, -7);
    floor.receiveShadow = true;
    scene.add(floor);

    const tileMat = new THREE.MeshStandardMaterial({
      color: 0x263b50, metalness: .58, roughness: .3,
      transparent: true, opacity: .48
    });
    for (let z = 25; z >= -39; z -= 4) box(scene, 0, -.055, z, 38, .035, .045, tileMat, false);
    for (let x = -18; x <= 18; x += 4) box(scene, x, -.052, -7, .045, .035, 64, tileMat, false);

    box(scene, 0, 8.5, -40, 42, 17, 1.1, mats.stone, true);
    box(scene, -21, 8.5, -7, 1.1, 17, 66, mats.stone, true);
    box(scene, 21, 8.5, -7, 1.1, 17, 66, mats.stone, true);
    box(scene, 0, 17, -7, 42, .8, 66, mats.darkWood, true);

    // Ceiling ribs establish scale and perspective.
    for (let z = 23; z >= -35; z -= 8) {
      box(scene, 0, 16.45, z, 39, .42, .65, mats.gold, true);
      box(scene, -18, 8.8, z, .38, 15.5, .55, mats.trim, true);
      box(scene, 18, 8.8, z, .38, 15.5, .55, mats.trim, true);
    }

    // Long side galleries filled with complete bookcases.
    for (let z = 18; z >= -30; z -= 8) {
      createBookcase(scene, -16.5, z);
      createBookcase(scene, 16.5, z);
    }

    // Repeating grand arches and supporting piers.
    for (let z = 20; z >= -28; z -= 12) {
      createArch(scene, z, 25, 14.2);
      for (const x of [-12.9, 12.9]) {
        box(scene, x, 7.1, z, .95, 14.2, 1.1, mats.trim, true);
        box(scene, x, 14.25, z, 1.35, .35, 1.45, mats.gold, true);
        strip(scene, x, 7.3, z + .58, .08, 12.9, .045, 0x4cbaff);
      }
    }

    // Tall luminous windows on both sides.
    for (const side of [-1, 1]) {
      for (let z = 13; z >= -27; z -= 10) {
        box(scene, side * 20.35, 10, z, .18, 6.8, 4.8, mats.glass, false);
        box(scene, side * 20.15, 10, z, .22, 7.2, 5.2, mats.gold, true);
        box(scene, side * 20, 10, z, .18, .12, 5, mats.gold, false);
        box(scene, side * 20, 10, z, .18, 7, .12, mats.gold, false);
      }
    }

    // Reading tables with warm lamp details.
    for (let z = 10; z >= -22; z -= 10) {
      const table = new THREE.Group();
      table.position.set(0, 0, z);
      scene.add(table);
      box(table, 0, 1.25, 0, 5.2, .22, 2.1, mats.gold, true);
      box(table, 0, .62, 0, .32, 1.1, .32, mats.trim, true);
      box(table, 0, .08, 0, 3.8, .14, 1.5, mats.darkWood, true);
      for (const x of [-1.7, 1.7]) {
        const lamp = new THREE.Mesh(
          new THREE.CylinderGeometry(.12, .22, .55, 16),
          new THREE.MeshStandardMaterial({
            color: 0xd2b16e, emissive: 0x5c3b12, emissiveIntensity: .55
          })
        );
        lamp.position.set(x, 1.62, 0);
        table.add(lamp);
      }
    }

    // Monumental glowing doorway at the far end.
    const portal = new THREE.Group();
    portal.position.set(0, 0, -34);
    scene.add(portal);
    box(portal, 0, 7, 0, 12, 14, .7, mats.darkWood, true);
    box(portal, 0, 7, .42, 10.8, 12.8, .16, mats.glass, false);
    box(portal, -5.8, 7, .65, .25, 14, .3, mats.gold, true);
    box(portal, 5.8, 7, .65, .25, 14, .3, mats.gold, true);
    box(portal, 0, 13.8, .65, 11.8, .25, .3, mats.gold, true);
    const portalGlow = new THREE.PointLight(0x3e9cff, 125, 30, 1.6);
    portalGlow.position.set(0, 7, -29);
    scene.add(portalGlow);

    for (const x of [-8, 0, 8]) strip(scene, x, 16.48, -7, .07, .05, 56, 0x70bfff);

    // Fine ambient dust for depth, kept subtle.
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - .5) * 34;
      positions[i * 3 + 1] = 1 + Math.random() * 14;
      positions[i * 3 + 2] = -38 + Math.random() * 62;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({
      color: 0xa6d8ff, size: .045, transparent: true, opacity: .42, depthWrite: false
    })));
  }

  function resize() {
    if (!renderer || !camera) return;
    const w = Math.max(world.clientWidth, 1);
    const h = Math.max(world.clientHeight, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function animate() {
    if (!running) return;
    raf = requestAnimationFrame(animate);
    elapsed += .008;
    yaw += (targetYaw - yaw) * .035;
    pitch += (targetPitch - pitch) * .035;
    camera.position.x = Math.sin(elapsed * .11) * .22 + yaw * 2.2;
    camera.position.y = 5.8 + Math.sin(elapsed * .35) * .08 + pitch * 1.1;
    camera.position.z = 17 + Math.cos(elapsed * .09) * .18;
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
    renderer.render(scene, camera);
  }

  function onDown(e) {
    if (e.target.closest("button,a,input,textarea")) return;
    pointerDown = true;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  }
  function onMove(e) {
    if (!dragging || !pointerDown) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    targetYaw = Math.max(-.58, Math.min(.58, targetYaw - dx * .003));
    targetPitch = Math.max(-.16, Math.min(.16, targetPitch - dy * .0015));
  }
  function onUp() {
    pointerDown = false;
    dragging = false;
  }

  async function start() {
    if (running) return;
    try {
      if (!("WebGL2RenderingContext" in window)) {
        throw new Error("Browser ini belum menyediakan WebGL2.");
      }
      THREE = await import("https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js");
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(58, 1, .1, 180);
      camera.position.set(0, 5.8, 17);
      camera.lookAt(0, 6, -10);

      renderer = new THREE.WebGLRenderer({
        antialias: true, alpha: false, powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      world.replaceChildren(renderer.domElement);

      createLibrary();
      observer = new ResizeObserver(resize);
      observer.observe(game);
      resize();

      world.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", onUp, { passive: true });

      running = true;
      animate();
      console.info("SGS 3D LIBRARY: READY");
    } catch (err) {
      console.error("SGS 3D Library failed:", err);
      const message = document.createElement("div");
      message.style.cssText = "position:absolute;inset:12px;display:grid;place-items:center;padding:20px;color:#fff;background:#071321;border:1px solid #c58f55;font:14px Arial;text-align:center";
      message.textContent = "Lingkungan 3D belum dapat dimuat pada browser ini. Detail: " +
        (err && err.message ? err.message : "unknown error");
      world.replaceChildren(message);
    }
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function visibilityChanged() {
    if (game.classList.contains("active")) requestAnimationFrame(() => start());
    else stop();
  }

  const classObserver = new MutationObserver(visibilityChanged);
  classObserver.observe(game, { attributes: true, attributeFilter: ["class"] });
  visibilityChanged();
})();
