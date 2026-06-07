import * as THREE from "three";

/**
 * Unified globe dots density for mobile and desktop.
 * Dots now use the same density/detail across devices.
 * Code kept optimized for smoother performance.
 */

// --- ASSET LOADING ---
const assetPaths = [
  "./src/04_rainbow1k.jpg",    // hover/interaction map
  "./src/00_earthmap1k.jpg",   // base map (controls dot color & country shapes)
  "./src/01_earthbump1k.jpg",  // bump/elevation (adds surface contour)
  "./src/02_earthspec1k.jpg"   // alpha/mask
];
let [otherMap, colorMap, elevMap, alphaMap] = [null, null, null, null];
let renderer = null;

// Texture preloading with optimized params
function preloadTextures(paths) {
  const loader = new THREE.TextureLoader();
  return Promise.all(
    paths.map(
      (p) =>
        new Promise((resolve, reject) => {
          loader.load(
            p,
            (tex) => {
              tex.minFilter = THREE.LinearFilter;
              tex.magFilter = THREE.LinearFilter;
              tex.anisotropy = renderer
                ? Math.min(8, renderer.capabilities.getMaxAnisotropy())
                : 1;
              tex.generateMipmaps = false;
              resolve(tex);
            },
            undefined,
            reject
          );
        })
    )
  );
}

// --- Scene Setup ---
const scene = new THREE.Scene();

function getCameraSettings() {
  const isMobile = window.innerWidth < 700;
  return {
    cameraZ: 0.20,
    cameraY: isMobile ? 0.21 : 0.21,
    globeVerticalOffset: isMobile ? -1.37 : -1.37
  };
}
let { cameraZ, cameraY, globeVerticalOffset } = getCameraSettings();

renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const domEl = renderer.domElement;
Object.assign(domEl.style, {
  position: "absolute",
  left: "0",
  top: "0",
  width: "100vw",
  height: "100vh",
  pointerEvents: "auto",
  background: "transparent",
  display: "block"
});
document.getElementById("globe-bg").appendChild(domEl);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, cameraY, cameraZ);
camera.lookAt(0, 0, 0);

const globeGroup = new THREE.Group();
globeGroup.position.set(0, globeVerticalOffset, 0);
scene.add(globeGroup);

// This function returns the "detail" level (icosahedron subdivisions)
// Same for all device sizes for consistent dots everywhere
function getDetailLevel() {
  const w = window.innerWidth, h = window.innerHeight;
  // Use a consistent, visually satisfying detail level for all
  if (w * h > 2e6) return 220;
  return 180;
}

// Main globe and dots setup (optimized, consistent everywhere)
function setupGlobeMaterials() {
  const globeGeo = new THREE.IcosahedronGeometry(1, 16);
  const globeMat = new THREE.MeshBasicMaterial({
    color: 0x0099ff,
    wireframe: true,
    transparent: true,
    opacity: 0.1
  });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  globeGroup.add(globe);

  // Dots (points), always high-res for all
  const detail = getDetailLevel();
  const pointsGeo = new THREE.IcosahedronGeometry(1, detail);

  // --- SHADERS ---
  const vertexShader = `
    uniform float size;
    uniform sampler2D elevTexture;
    uniform vec2 mouseUV;
    varying vec2 vUv;
    varying float vVisible;
    varying float vDist;
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float elv = texture2D(elevTexture, vUv).r;
      vec3 vNormal = normalMatrix * normal;
      vVisible = step(0.0, dot(-normalize(mvPosition.xyz), normalize(vNormal)));
      mvPosition.z += 0.35 * elv;
      float dist = distance(mouseUV, vUv);
      float zDisp = 0.0;
      float thresh = 0.04;
      if (dist < thresh) {
        zDisp = (thresh - dist) * 2.0;
      }
      vDist = dist;
      mvPosition.z += zDisp;
      gl_PointSize = size;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  const fragmentShader = `
    uniform sampler2D colorTexture;
    uniform sampler2D alphaTexture;
    uniform sampler2D otherTexture;
    varying vec2 vUv;
    varying float vVisible;
    varying float vDist;
    void main() {
      if (floor(vVisible + 0.1) == 0.0) discard;
      float alpha = 1.0 - texture2D(alphaTexture, vUv).r;
      vec3 color = texture2D(colorTexture, vUv).rgb;
      vec3 other = texture2D(otherTexture, vUv).rgb;
      float thresh = 0.04;
      if (vDist < thresh) {
        color = mix(color, other, (thresh - vDist) * 50.0);
      }
      gl_FragColor = vec4(color, alpha);
    }
  `;

  // Same dot size logic for all devices for visual uniformity
  let size;
  if (window.innerWidth < 700) {
    size = 2.1;
  } else {
    size = 3.4;
  }

  const uniforms = {
    size: { value: size },
    colorTexture: { value: colorMap },
    otherTexture: { value: otherMap },
    elevTexture: { value: elevMap },
    alphaTexture: { value: alphaMap },
    mouseUV: { value: new THREE.Vector2(0.0, 0.0) }
  };

  const pointsMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  globeGroup.add(points);

  // Hemisphere light for subtle ambient (if not already added)
  if (!scene.children.some((x) => x.isLight)) {
    scene.add(new THREE.HemisphereLight(0xffffff, 0x080820, 2.5));
  }

  return { globe, points, uniforms, pointsGeo };
}

// --- Interaction logic ---
const raycaster = new THREE.Raycaster();
const pointerPos = new THREE.Vector2();
const globeUV = new THREE.Vector2();
let globe, points, uniforms, pointsGeo;

let raycastNeeded = false;
function handleRaycast() {
  if (!globe || !raycastNeeded) return;
  raycastNeeded = false;

  raycaster.setFromCamera(pointerPos, camera);
  const intersects = raycaster.intersectObjects([globe], false);
  if (intersects.length > 0 && intersects[0].uv) {
    globeUV.copy(intersects[0].uv);
  }
  if (uniforms) uniforms.mouseUV.value.copy(globeUV);
}

function handlePointerMove(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointerPos.set(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1
  );
  raycastNeeded = true;
}

let lastMove = 0;
function throttledPointerMove(evt) {
  const now = performance.now();
  if (now - lastMove > 12) {
    handlePointerMove(evt.clientX, evt.clientY);
    lastMove = now;
  }
}
domEl.addEventListener("mousemove", throttledPointerMove, { passive: true });
domEl.addEventListener("touchmove", (evt) => {
  if (evt.touches && evt.touches.length)
    handlePointerMove(evt.touches[0].clientX, evt.touches[0].clientY);
}, { passive: true });

domEl.addEventListener("mouseleave", () => {
  globeUV.set(0, 0);
  if (uniforms) uniforms.mouseUV.value.copy(globeUV);
});
domEl.addEventListener("touchend", () => {
  globeUV.set(0, 0);
  if (uniforms) uniforms.mouseUV.value.copy(globeUV);
});

// Same rotation speed for visual harmony, minor tweak for very small screens
let rotationSpeed = window.innerWidth < 700 ? 0.0012 : 0.002;
let lastFrame = performance.now();

function animate() {
  if (document.hidden) {
    requestAnimationFrame(animate);
    return;
  }
  const now = performance.now();
  if (now - lastFrame > 1000 / 60) {
    globeGroup.rotation.y += rotationSpeed;
    handleRaycast();
    renderer.render(scene, camera);
    lastFrame = now;
  } else if (raycastNeeded) {
    handleRaycast();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  let { cameraZ: newZ, cameraY: newY, globeVerticalOffset: newOffset } = getCameraSettings();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.position.set(0, newY, newZ);
  camera.lookAt(0, 0, 0);
  globeGroup.position.set(0, newOffset, 0);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  domEl.style.width = "100vw";
  domEl.style.height = "100vh";
  rotationSpeed = window.innerWidth < 700 ? 0.0012 : 0.002;

  if (points && pointsGeo) {
    const needDetail = getDetailLevel();
    if (pointsGeo.parameters.detail !== needDetail) {
      const newPointsGeo = new THREE.IcosahedronGeometry(1, needDetail);
      points.geometry.dispose();
      points.geometry = newPointsGeo;
    }
  }

  if (uniforms && uniforms.size) {
    uniforms.size.value = window.innerWidth < 700 ? 2.1 : 3.4;
  }
});

// Entrypoint
preloadTextures(assetPaths)
  .then((texs) => {
    [otherMap, colorMap, elevMap, alphaMap] = texs;
    ({ globe, points, uniforms, pointsGeo } = setupGlobeMaterials());
    animate();
  })
  .catch((err) => {
    console.error("Error while loading globe textures:", err);
    const el = document.createElement("div");
    el.innerText =
      "Failed to load globe assets. Check your image files: " +
      assetPaths.join(", ");
    Object.assign(el.style, {
      position: "fixed",
      top: "5vw",
      left: "0",
      width: "100vw",
      textAlign: "center",
      fontSize: "2rem",
      color: "#e00",
      zIndex: 10000,
      background: "rgba(255,255,255,0.88)"
    });
    document.body.appendChild(el);
  });
