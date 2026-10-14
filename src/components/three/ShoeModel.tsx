"use client";

import { useEffect, useMemo, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { VariantName } from "@/lib/products";

export const SHOE_URL = "/models/shoe.glb";
const DRACO_PATH = "/draco/";

/** Pré-carrega o GLB (chame em qualquer página que vá usar o modelo). */
export function preloadShoe() {
  useGLTF.preload(SHOE_URL, DRACO_PATH);
}

interface VariantsExtension {
  variants: { name: string }[];
}
interface MeshVariantMapping {
  mappings: { material: number; variants: number[] }[];
}

type GLTFWithParser = GLTF & {
  parser: {
    getDependency: (type: "material", index: number) => Promise<THREE.Material>;
    assignFinalMaterial: (mesh: THREE.Mesh) => void;
  };
};

/**
 * Carrega o tênis e expõe a cena + um mapa variante → material.
 * A troca de cor é síncrona depois que os materiais são resolvidos,
 * o que permite animar/trocar no meio de um scroll sem flicker.
 */
export function useShoe() {
  const gltf = useGLTF(SHOE_URL, DRACO_PATH) as unknown as GLTFWithParser;
  const [materials, setMaterials] = useState<Record<string, THREE.Material> | null>(null);

  // Clona a cena para cada instância (hero e viewer podem coexistir).
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const mesh = useMemo(() => {
    let found: THREE.Mesh | null = null;
    scene.traverse((o) => {
      if (!found && (o as THREE.Mesh).isMesh) found = o as THREE.Mesh;
    });
    return found as THREE.Mesh | null;
  }, [scene]);

  useEffect(() => {
    let cancelled = false;
    const ext = gltf.userData?.gltfExtensions?.KHR_materials_variants as VariantsExtension | undefined;
    const meshExt = mesh?.userData?.gltfExtensions?.KHR_materials_variants as MeshVariantMapping | undefined;
    if (!ext || !meshExt || !mesh) return;

    (async () => {
      const entries = await Promise.all(
        ext.variants.map(async (v, i) => {
          const mapping = meshExt.mappings.find((m) => m.variants.includes(i));
          if (!mapping) return [v.name, null] as const;
          const mat = await gltf.parser.getDependency("material", mapping.material);
          return [v.name, mat] as const;
        }),
      );
      if (cancelled) return;
      const map: Record<string, THREE.Material> = {};
      // nomes no GLB são minúsculos ("street"); normalizamos para a chave usada no app.
      for (const [name, mat] of entries) if (mat) map[name.toLowerCase()] = mat;
      setMaterials(map);
    })();

    return () => {
      cancelled = true;
    };
  }, [gltf, mesh]);

  return { scene, mesh, materials, gltf };
}

interface ShoeProps {
  variant: VariantName;
  /** Escala uniforme. O modelo original mede ~30 cm. */
  scale?: number;
  children?: never;
}

/**
 * Tênis com a variante de cor aplicada. Expõe a ref do grupo para animação
 * (rotação/posição) pelo componente pai.
 */
export function Shoe({ variant, scale = 1, ref }: ShoeProps & { ref?: React.Ref<THREE.Group> }) {
  const { scene, materials, gltf } = useShoe();

  useEffect(() => {
    if (!materials) return;
    const mat = materials[variant.toLowerCase()];
    if (!mat) return;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.material = mat;
      gltf.parser.assignFinalMaterial(m);
      m.castShadow = true;
    });
  }, [variant, scene, materials, gltf]);

  // Centraliza o modelo na origem para rotações previsíveis.
  const offset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    return center.multiplyScalar(-1);
  }, [scene]);

  return (
    <group ref={ref} scale={scale}>
      <primitive object={scene} position={offset} />
    </group>
  );
}
