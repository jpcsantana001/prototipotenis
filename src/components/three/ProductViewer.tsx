"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useProgress } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Group } from "three";
import { Shoe } from "./ShoeModel";
import { StudioLighting } from "./Lighting";
import { COLORWAYS, type VariantName } from "@/lib/products";

/** Overlay de carregamento fora do Canvas (evita <Html> dentro de Suspense). */
function Loader() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      <span className="font-mono text-xs tabular-nums">Carregando modelo · {Math.round(progress)}%</span>
    </div>
  );
}

function SpinningShoe({ variant, autoRotate }: { variant: VariantName; autoRotate: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!ref.current || !autoRotate) return;
    ref.current.rotation.y += delta * 0.35;
  });
  return (
    <group rotation={[0.1, -0.5, 0]}>
      <Shoe ref={ref} variant={variant} scale={6} />
    </group>
  );
}

interface ProductViewerProps {
  variant: VariantName;
  className?: string;
}

/**
 * Visualizador 360°: arrastar gira, scroll/pinça dá zoom, auto-rotação pausa
 * quando o usuário interage e retoma depois de alguns segundos.
 */
export function ProductViewer({ variant, className }: ProductViewerProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const controls = useRef<OrbitControlsImpl>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onInteract = () => {
    setAutoRotate(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setAutoRotate(true), 4000);
  };

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const accent = COLORWAYS[variant].accent;

  return (
    <div className={className} role="img" aria-label={`Visualização 3D do tênis na cor ${COLORWAYS[variant].label}. Arraste para girar.`}>
      <Canvas
        camera={{ position: [0, 0.6, 5.2], fov: 30, near: 0.1, far: 50 }}
        dpr={[1, 2]}
        shadows="percentage"
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <StudioLighting accent={accent} />
        <Suspense fallback={null}>
          <SpinningShoe variant={variant} autoRotate={autoRotate} />
          <ContactShadows position={[0, -1.05, 0]} opacity={0.6} scale={7} blur={2} far={2.5} />
        </Suspense>
        <OrbitControls
          ref={controls}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.62}
          onStart={onInteract}
          makeDefault
        />
      </Canvas>
      <Loader />
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[11px] uppercase tracking-widest text-white/70 backdrop-blur">
        Arraste para girar · Scroll para zoom
      </div>
    </div>
  );
}
