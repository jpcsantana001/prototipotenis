"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useProgress } from "@react-three/drei";
import { MathUtils } from "three";
import type { Group } from "three";
import type { MotionValue } from "motion/react";
import { Shoe } from "./ShoeModel";
import { StudioLighting } from "./Lighting";
import { COLORWAYS, type VariantName } from "@/lib/products";

/* ------------------------------------------------------------------ */
/* Keyframes do storytelling (t = progresso do scroll, 0 → 1)          */
/* ------------------------------------------------------------------ */

interface Key {
  t: number;
  rotY: number;
  rotX: number;
  rotZ: number;
  x: number;
  y: number;
  scale: number;
}

const KEYS: Key[] = [
  // capítulo 0 — hero: 3/4 de frente, flutuando
  { t: 0.0, rotY: -0.6, rotX: 0.15, rotZ: -0.15, x: 0.0, y: 1.02, scale: 3.9 },
  // capítulo 1 — construção: perfil lateral, aproxima
  { t: 0.25, rotY: 0.08, rotX: 0.12, rotZ: 0.0, x: 0.9, y: 0.0, scale: 6.6 },
  // capítulo 2 — cores: gira 360° enquanto troca de cor
  { t: 0.45, rotY: Math.PI * 1.5, rotX: 0.3, rotZ: 0.1, x: -0.8, y: 0.1, scale: 5.6 },
  { t: 0.7, rotY: Math.PI * 3.3, rotX: -0.1, rotZ: 0.05, x: -0.8, y: 0.0, scale: 5.6 },
  // capítulo 3 — CTA: posa à direita, vista de cima
  { t: 1.0, rotY: Math.PI * 3.8, rotX: 0.55, rotZ: -0.2, x: 1.1, y: -0.3, scale: 5.0 },
];

const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

function sample(t: number): Key {
  if (t <= KEYS[0].t) return KEYS[0];
  for (let i = 1; i < KEYS.length; i++) {
    const a = KEYS[i - 1];
    const b = KEYS[i];
    if (t <= b.t) {
      const u = ease((t - a.t) / (b.t - a.t));
      return {
        t,
        rotY: MathUtils.lerp(a.rotY, b.rotY, u),
        rotX: MathUtils.lerp(a.rotX, b.rotX, u),
        rotZ: MathUtils.lerp(a.rotZ, b.rotZ, u),
        x: MathUtils.lerp(a.x, b.x, u),
        y: MathUtils.lerp(a.y, b.y, u),
        scale: MathUtils.lerp(a.scale, b.scale, u),
      };
    }
  }
  return KEYS[KEYS.length - 1];
}

/** Qual variante de cor mostrar em cada trecho do scroll. */
export function variantForProgress(t: number): VariantName {
  if (t < 0.45) return "Street";
  if (t < 0.58) return "Midnight";
  if (t < 0.72) return "Beach";
  return "Street";
}

/* ------------------------------------------------------------------ */

interface RigProps {
  progress: MotionValue<number>;
  variant: VariantName;
  reducedMotion: boolean;
  isMobile: boolean;
}

function ShoeRig({ progress, variant, reducedMotion, isMobile }: RigProps) {
  const group = useRef<Group>(null);
  const pivot = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    const p = pivot.current;
    if (!g || !p) return;

    const k = sample(progress.get());
    const dt = Math.min(delta, 1 / 30);
    const sm = 6; // suavização (maior = mais rápido)

    // pose principal (vem do scroll)
    g.rotation.y = MathUtils.damp(g.rotation.y, k.rotY, sm, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, k.rotX, sm, dt);
    g.rotation.z = MathUtils.damp(g.rotation.z, k.rotZ, sm, dt);
    g.position.x = MathUtils.damp(g.position.x, isMobile ? k.x * 0.25 : k.x, sm, dt);
    g.position.y = MathUtils.damp(g.position.y, k.y, sm, dt);
    const s = isMobile ? k.scale * 0.72 : k.scale;
    g.scale.setScalar(MathUtils.damp(g.scale.x, s, sm, dt));

    if (reducedMotion) return;

    // flutuação + parallax do mouse (no pivot, para não brigar com o scroll)
    const time = state.clock.elapsedTime;
    const bob = Math.sin(time * 1.2) * 0.04;
    const px = state.pointer.x;
    const py = state.pointer.y;
    p.position.y = MathUtils.damp(p.position.y, bob, 4, dt);
    p.rotation.y = MathUtils.damp(p.rotation.y, px * 0.25, 4, dt);
    p.rotation.x = MathUtils.damp(p.rotation.x, -py * 0.15, 4, dt);
  });

  return (
    <group ref={pivot}>
      <Shoe ref={group} variant={variant} scale={5.2} />
    </group>
  );
}

interface HeroSceneProps {
  progress: MotionValue<number>;
  variant: VariantName;
  reducedMotion?: boolean;
  isMobile?: boolean;
}

/** Indicador de download do modelo (fora do Canvas). */
function HeroLoader() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute left-1/2 top-[38vh] flex -translate-x-1/2 flex-col items-center gap-2 text-fg-muted" aria-live="polite">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
      <span className="text-[10px] uppercase tracking-[0.3em]">Carregando 3D · {Math.round(progress)}%</span>
    </div>
  );
}

export function HeroScene({ progress, variant, reducedMotion = false, isMobile = false }: HeroSceneProps) {
  const accent = COLORWAYS[variant].accent;
  return (
    <>
    <HeroLoader />
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 30, near: 0.1, far: 50 }}
      dpr={[1, 1.75]}
      shadows="percentage"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <StudioLighting accent={accent} />
      <Suspense fallback={null}>
        <ShoeRig progress={progress} variant={variant} reducedMotion={reducedMotion} isMobile={isMobile} />
        <ContactShadows position={[0, -1.35, 0]} opacity={0.55} scale={8} blur={2.4} far={3} color="#000" />
      </Suspense>
    </Canvas>
    </>
  );
}
