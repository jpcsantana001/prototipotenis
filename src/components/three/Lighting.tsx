"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Iluminação de estúdio totalmente procedural (sem HDR externo):
 * um softbox grande por cima, um rim light frio por trás e um fill quente.
 * Funciona offline e mantém o bundle pequeno.
 */
export function StudioLighting({ accent = "#ffffff" }: { accent?: string }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[3, 6, 4]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <Environment resolution={256} frames={1}>
        {/* softbox superior */}
        <Lightformer form="rect" intensity={4} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
        {/* rim frio atrás */}
        <Lightformer form="rect" intensity={2.5} color="#9fc9ff" position={[-4, 2, -4]} scale={[3, 6, 1]} />
        {/* fill com a cor do produto */}
        <Lightformer form="circle" intensity={1.5} color={accent} position={[4, 1, 3]} scale={3} />
        {/* chão escuro para reflexos sutis na sola */}
        <Lightformer form="rect" intensity={0.3} color="#202024" position={[0, -3, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
      </Environment>
    </>
  );
}
