"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Inclinação máxima em graus. */
  max?: number;
  style?: CSSProperties;
}

/**
 * Card com tilt 3D (perspective + rotateX/rotateY) e brilho que segue o ponteiro.
 * Toda a animação é feita com CSS custom properties — sem re-render do React
 * por movimento do mouse, o que mantém 60 fps mesmo com dezenas de cards.
 */
export function TiltCard({ children, className = "", max = 10, style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
    const my = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${mx * max * 2}deg`);
    el.style.setProperty("--rx", `${-my * max * 2}deg`);
    el.style.setProperty("--mx", `${mx * 2}`);
    el.style.setProperty("--my", `${my * 2}`);
    el.style.setProperty("--shine", "1");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
    el.style.setProperty("--shine", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt relative ${className}`}
      style={style}
    >
      {children}
      <div aria-hidden className="tilt-shine pointer-events-none absolute inset-0 rounded-[inherit]" />
    </div>
  );
}
