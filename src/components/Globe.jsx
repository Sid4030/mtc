import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";

const Globe = () => {
    const mountRef = useRef(null);
    const { scrollYProgress } = useScroll();

    const scale = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [1, 1.4, 1.4, 1.2]
    );

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 0.95, 1],
        [1, 0.45, 0.45, 0.8, 1]
    );

    // Removed dynamic scroll blur because blurring a WebGL canvas causes severe lag in Chromium browsers


    const y = useTransform(
        scrollYProgress,
        [0, 0.8, 1],
        ["0vh", "0vh", "40vh"]
    );

    useEffect(() => {
        let renderer = null;
        let scene = new THREE.Scene();
        let camera, globeGroup;
        let globe, points, uniforms, pointsGeo;
        let raycaster = new THREE.Raycaster();
        let pointerPos = new THREE.Vector2();
        let globeUV = new THREE.Vector2();
        let raycastNeeded = false;
        let rotationSpeed = window.innerWidth < 700 ? 0.001 : 0.0016;
        let animationFrameId;
        let cleanupFn = null;
        let isDestroyed = false;

        const assetPaths = [
            "/04_rainbow1k.jpg",
            "/00_earthmap1k.jpg",
            "/01_earthbump1k.jpg",
        ];
        let [otherMap, colorMap, elevMap] = [null, null, null];
        let alphaMap = null;

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
                                        ? Math.min(4, renderer.capabilities.getMaxAnisotropy())
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

        function getCameraSettings() {
            const isMobile = window.innerWidth < 700;
            return {
                cameraZ: isMobile ? 3.2 : 2.8,
                cameraY: 0,
                globeVerticalOffset: 0
            };
        }

        function getDetailLevel() {
            const w = window.innerWidth, h = window.innerHeight;
            if (w * h > 2e6) return 50;
            return 35;
        }

        function setupGlobeMaterials() {
            const globeGeo = new THREE.IcosahedronGeometry(1, 14);
            const globeMat = new THREE.MeshBasicMaterial({
                color: 0x0099ff,
                wireframe: true,
                transparent: true,
                opacity: 0.1
            });
            globe = new THREE.Mesh(globeGeo, globeMat);
            globeGroup.add(globe);

            const detail = getDetailLevel();
            pointsGeo = new THREE.IcosahedronGeometry(1, detail);

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

            let size = window.innerWidth < 700 ? 3.0 : 4.5;

            uniforms = {
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
            points = new THREE.Points(pointsGeo, pointsMat);
            globeGroup.add(points);

            if (!scene.children.some((x) => x.isLight)) {
                scene.add(new THREE.HemisphereLight(0xffffff, 0x080820, 2.5));
            }

            // Starfield — reduced count for performance
            const starsGeo = new THREE.BufferGeometry();
            const starsCount = 800;
            const posArray = new Float32Array(starsCount * 3);
            const sizeArray = new Float32Array(starsCount);

            for (let i = 0; i < starsCount; i++) {
                const radius = 15 + Math.random() * 25;
                const u = Math.random();
                const v = Math.random();
                const theta = u * 2.0 * Math.PI;
                const phi = Math.acos(2.0 * v - 1.0);
                posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                posArray[i * 3 + 2] = radius * Math.cos(phi);
                sizeArray[i] = Math.random() < 0.1
                    ? (Math.random() * 0.05 + 0.02)
                    : (Math.random() * 0.02 + 0.005);
            }

            starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            starsGeo.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

            const starVertexShader = `
                attribute float size;
                varying float vOpacity;
                uniform float time;
                void main() {
                    vOpacity = 0.5 + 0.5 * sin(time * 0.001 + position.x * 0.1);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `;
            const starFragmentShader = `
                varying float vOpacity;
                void main() {
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    if(length(coord) > 0.5) discard;
                    gl_FragColor = vec4(1.0, 1.0, 1.0, vOpacity * 0.8);
                }
            `;

            uniforms.time = { value: 0 };

            const starsMat = new THREE.ShaderMaterial({
                uniforms: { time: uniforms.time },
                vertexShader: starVertexShader,
                fragmentShader: starFragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            globeGroup.add(new THREE.Points(starsGeo, starsMat));

            // Space dust — increased count for better "water flow" effect
            const dustGeo = new THREE.BufferGeometry();
            const dustCount = 450;
            const dustPosArray = new Float32Array(dustCount * 3);
            const dustSpeedArray = new Float32Array(dustCount);

            for (let i = 0; i < dustCount; i++) {
                dustPosArray[i * 3] = (Math.random() - 0.5) * 30;
                dustPosArray[i * 3 + 1] = (Math.random() - 0.5) * 15;
                dustPosArray[i * 3 + 2] = -5 - Math.random() * 10;
                dustSpeedArray[i] = 0.01 + Math.random() * 0.02;
            }

            dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPosArray, 3));
            dustGeo.setAttribute('speed', new THREE.BufferAttribute(dustSpeedArray, 1));

            const dustMat = new THREE.PointsMaterial({
                size: 0.15,
                color: 0x00f2fe,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            globeGroup.userData.dustMesh = new THREE.Points(dustGeo, dustMat);
            scene.add(globeGroup.userData.dustMesh);
        }

        function init() {
            const { cameraZ, cameraY, globeVerticalOffset } = getCameraSettings();
            renderer = new THREE.WebGLRenderer({
                antialias: false, // Disabled for perf — not noticeable on a point cloud
                alpha: true,
                powerPreference: "high-performance"
            });
            renderer.setClearColor(0x000000, 0);
            renderer.setPixelRatio(1);
            renderer.setSize(window.innerWidth, window.innerHeight);

            const domEl = renderer.domElement;
            Object.assign(domEl.style, {
                position: "absolute",
                left: "0",
                top: "0",
                width: "100%",
                height: "100%",
                pointerEvents: "auto",
                background: "transparent",
                display: "block",
                opacity: "0" // Start hidden — fade in after ready
            });

            if (mountRef.current) {
                mountRef.current.appendChild(domEl);
            }

            camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            camera.position.set(0, cameraY, cameraZ);
            camera.lookAt(0, 0, 0);

            globeGroup = new THREE.Group();
            globeGroup.position.set(0, globeVerticalOffset, 0);
            scene.add(globeGroup);

            // Pointer events
            const handlePointerMove = (clientX, clientY) => {
                const rect = renderer.domElement.getBoundingClientRect();
                pointerPos.set(
                    ((clientX - rect.left) / rect.width) * 2 - 1,
                    -((clientY - rect.top) / rect.height) * 2 + 1
                );
                raycastNeeded = true;
            };

            let lastMove = 0;
            const throttledPointerMove = (evt) => {
                const now = performance.now();
                if (now - lastMove > 32) { // Throttle to ~30fps for pointer — saves CPU
                    handlePointerMove(evt.clientX, evt.clientY);
                    lastMove = now;
                }
            };

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

            const handleResize = () => {
                const { cameraZ: newZ, cameraY: newY, globeVerticalOffset: newOffset } = getCameraSettings();
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.position.set(0, newY, newZ);
                camera.lookAt(0, 0, 0);
                globeGroup.position.set(0, newOffset, 0);
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                rotationSpeed = window.innerWidth < 700 ? 0.001 : 0.0016;

                if (uniforms && uniforms.size) {
                    uniforms.size.value = window.innerWidth < 700 ? 3.0 : 4.5;
                }
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                if (renderer && domEl.parentNode) {
                    domEl.parentNode.removeChild(domEl);
                    renderer.dispose();
                }
            };
        }

        let lastFrame = performance.now();
        let frameCount = 0;
        function animate() {
            if (isDestroyed) return;

            // Pause rendering when modal is open or tab hidden — huge perf saving
            if (document.hidden || document.body.classList.contains('modal-open')) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }
            const now = performance.now();
            const isBgMode = document.body.classList.contains('globe-background-mode');
            const frameDelay = isBgMode ? 50 : 16.6; // 20fps in bg vs 60fps in foreground

            if (now - lastFrame > frameDelay) {
                if (globeGroup) {
                    globeGroup.rotation.y += rotationSpeed;

                    if (uniforms && uniforms.time) {
                        uniforms.time.value = now;
                    }

                    // Dust animation — skip in background mode for perf
                    if (!isBgMode && globeGroup.userData.dustMesh) {
                        const dustGeometry = globeGroup.userData.dustMesh.geometry;
                        const positions = dustGeometry.attributes.position.array;
                        const speeds = dustGeometry.attributes.speed.array;

                        for (let i = 0; i < speeds.length; i++) {
                            positions[i * 3] += speeds[i];
                            positions[i * 3 + 1] += Math.sin(now * 0.001 + positions[i * 3]) * 0.01;
                            if (positions[i * 3] > 15) {
                                positions[i * 3] = -15;
                            }
                        }
                        dustGeometry.attributes.position.needsUpdate = true;
                    }
                }
                frameCount++;
                // Only raycast every 5th frame and never in background mode
                if (!isBgMode && frameCount % 5 === 0) handleRaycast();
                renderer.render(scene, camera);
                lastFrame = now;
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        function handleRaycast() {
            if (!raycastNeeded || !globe) return;
            raycastNeeded = false;

            raycaster.setFromCamera(pointerPos, camera);
            const intersects = raycaster.intersectObjects([globe], false);
            if (intersects.length > 0 && intersects[0].uv) {
                globeUV.copy(intersects[0].uv);
            } else {
                globeUV.set(0, 0);
            }
            if (uniforms) uniforms.mouseUV.value.copy(globeUV);
        }

        // Start preloading textures immediately so network time overlaps with intro
        const texturePromise = preloadTextures(assetPaths).catch(err => {
            console.error("Globe texture error:", err);
            return [null, null, null];
        });

        // CRITICAL: Wait for intro animation to hit the 'fading' stage before
        // initializing WebGL. This hides shader compilation behind the black
        // overlay and makes the globe immediately visible when the overlay fades.
        let pollId;
        function pollIntro() {
            if (isDestroyed) return;
            if (window.__mcmsft_intro_shown === true || window.__mcmsft_intro_fading === true) {
                cleanupFn = init();
                texturePromise
                    .then((texs) => {
                        if (isDestroyed) return;
                        [otherMap, colorMap, elevMap] = texs;
                        alphaMap = elevMap; // Reuse elevation map as alpha map
                        setupGlobeMaterials();

                        // Render a single frame first so WebGL compiles shaders
                        renderer.render(scene, camera);

                        // Reveal canvas instantly since the #mcmsft_intro_fade handles the fade-in perfectly
                        requestAnimationFrame(() => {
                            if (isDestroyed || !renderer) return;
                            gsap.set(renderer.domElement, { opacity: 1 });
                            animate();
                        });
                    });
            } else {
                pollId = setTimeout(pollIntro, 100);
            }
        }
        pollIntro();

        return () => {
            isDestroyed = true;
            clearTimeout(pollId);
            cancelAnimationFrame(animationFrameId);
            if (cleanupFn) cleanupFn();
        };
    }, []);

    return (
        <motion.div
            id="globe-bg"
            ref={mountRef}
            className="globe-container"
            style={{ scale, opacity, y, willChange: "transform, opacity" }}
        ></motion.div>
    );
};

export default Globe;
