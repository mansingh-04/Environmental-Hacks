"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { DURATION, EASE } from "@/lib/motion";

/** Animates a number by writing to the DOM directly, so React doesn't re-render every frame. */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = String(value);
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration: DURATION.slow * 2,
      ease: EASE,
      onUpdate: (v) => (el.textContent = String(Math.round(v))),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, reduced]);

  return <span ref={ref}>{value}</span>;
}
