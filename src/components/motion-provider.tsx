"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { transition } from "@/lib/motion";

/** Honours prefers-reduced-motion: transforms are skipped, opacity fades remain. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={transition}>
      {children}
    </MotionConfig>
  );
}
