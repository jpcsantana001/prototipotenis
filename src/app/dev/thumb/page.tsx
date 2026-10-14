"use client";

/**
 * Página utilitária (não linkada) usada por `scripts/render-thumbs.mjs`
 * para pré-renderizar as thumbs do catálogo a partir do modelo 3D.
 * Uso: /dev/thumb?variant=Street|Beach|Midnight
 */

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { Shoe } from "@/components/three/ShoeModel";
import { StudioLighting } from "@/components/three/Lighting";
import type { VariantName } from "@/lib/products";

function ThumbScene() {
  const params = useSearchParams();
  const variant = (params.get("variant") as VariantName) ?? "Street";
  return (
    <Canvas
      camera={{ position: [0, 0.9, 5.2], fov: 30 }}
      dpr={2}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      style={{ width: 1200, height: 960, background: "transparent" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <StudioLighting />
      <Suspense fallback={null}>
        <group rotation={[0.18, -0.75, -0.12]}>
          <Shoe variant={variant} scale={7} />
        </group>
      </Suspense>
    </Canvas>
  );
}

export default function ThumbPage() {
  return (
    <div style={{ background: "transparent", width: 1200, height: 960 }} data-thumb>
      <style>{`html, body { background: transparent !important; }`}</style>
      <Suspense fallback={null}>
        <ThumbScene />
      </Suspense>
    </div>
  );
}
