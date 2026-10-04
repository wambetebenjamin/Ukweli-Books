"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js floating open book (user spec):
 *  - low-poly, paper-white pages; cover colour #1089ff extracted from the
 *    uploaded design source ($primary in carbook-master/scss/style.scss)
 *  - rotates on Y at 0.008 rad per frame
 *  - page ripple via subtle sine-wave vertex displacement
 *  - pauses off-viewport and on hover · DPR capped at 1.5
 *  - plain key + ambient lighting only (no excessive scene lighting)
 * Reduced-motion → renders one neutral frame, no loop.
 */
export default function ThreeBook() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 2.1, 7.4);
    camera.lookAt(0, 0.15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(2.5, 4, 3);
    scene.add(key);

    /* ------------------------------------------------ book model */
    const book = new THREE.Group();
    const COVER_COLOR = 0x1089ff; // extracted $primary
    const ACCENT_COLOR = 0x01d28e; // extracted $secondary
    const PAPER = 0xf9f8f3;

    const coverMat = new THREE.MeshStandardMaterial({ color: COVER_COLOR, roughness: 0.75, flatShading: true });
    const paperMat = new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.95, flatShading: true, side: THREE.DoubleSide });
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0xe8e6de, roughness: 1, flatShading: true });
    const accentMat = new THREE.MeshStandardMaterial({ color: ACCENT_COLOR, roughness: 0.6, flatShading: true });

    const OPEN = 0.3; // tent angle
    const HALF_W = 1.62;
    const HEIGHT = 2.2;

    const pivots: THREE.Group[] = [];
    const ripple: { geo: THREE.PlaneGeometry | null } = { geo: null };

    (["left", "right"] as const).forEach((side) => {
      const sign = side === "left" ? -1 : 1;
      const pivot = new THREE.Group();
      pivot.rotation.z = sign * OPEN * -1 * sign * sign; // ±OPEN around spine
      pivot.rotation.z = side === "left" ? OPEN : -OPEN;

      const cover = new THREE.Mesh(new THREE.BoxGeometry(HALF_W, 0.055, HEIGHT), coverMat);
      cover.position.set(sign * (HALF_W / 2), 0, 0);
      pivot.add(cover);

      // page block (thin box beneath the ripple sheet)
      const block = new THREE.Mesh(new THREE.BoxGeometry(HALF_W * 0.94, 0.05, HEIGHT * 0.94), edgeMat);
      block.position.set(sign * (HALF_W / 2) * 0.97, 0.055, 0);
      pivot.add(block);

      // top page sheet (rippling on the side the camera favours — both actually)
      const geo = new THREE.PlaneGeometry(HALF_W * 0.94, HEIGHT * 0.94, 18, 8);
      geo.rotateX(-Math.PI / 2);
      const sheet = new THREE.Mesh(geo, paperMat);
      sheet.position.set(sign * (HALF_W / 2) * 0.97, 0.088, 0);
      pivot.add(sheet);
      if (side === "left") ripple.geo = geo;

      pivots.push(pivot);
      book.add(pivot);
    });

    // spine accent (extracted secondary colour)
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, HEIGHT), accentMat);
    spine.position.y = -0.01;
    book.add(spine);

    // bookmark ribbon
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, HEIGHT * 0.5), accentMat);
    ribbon.position.set(0.12, 0.115, 0.4);
    ribbon.rotation.y = 0.12;
    book.add(ribbon);

    book.position.y = -0.15;
    scene.add(book);

    /* ------------------------------------------------ animation */
    let raf = 0;
    let inView = true;
    let hovered = false;
    let rippleOriginal: Float32Array | null = null;
    if (ripple.geo) {
      rippleOriginal = (ripple.geo.attributes.position.array as Float32Array).slice();
    }

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0.02 });
    io.observe(mount);
    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    mount.addEventListener("mouseenter", onEnter);
    mount.addEventListener("mouseleave", onLeave);

    const start = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!inView || hovered) return;
      const t = (performance.now() - start) / 1000;
      book.rotation.y += 0.008;                           // spec: 0.008 rad/frame
      book.position.y = -0.15 + Math.sin(t * 0.9) * 0.07; // gentle bob
      if (ripple.geo && rippleOriginal) {
        const pos = ripple.geo.attributes.position as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        for (let i = 0; i < pos.count; i++) {
          const x = rippleOriginal[i * 3];
          const z = rippleOriginal[i * 3 + 2];
          const edge = 1 - Math.min(1, Math.abs(x) / (HALF_W * 0.47));
          arr[i * 3 + 1] = rippleOriginal[i * 3 + 1] + Math.sin(x * 2.4 + z * 1.3 + t * 1.6) * 0.016 * edge;
        }
        pos.needsUpdate = true;
        ripple.geo.computeVertexNormals();
      }
      renderer.render(scene, camera);
    };

    if (reduced) {
      renderer.render(scene, camera); // one neutral frame, no loop
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mount.removeEventListener("mouseenter", onEnter);
      mount.removeEventListener("mouseleave", onLeave);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} aria-hidden />;
}
