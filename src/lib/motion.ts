import type { Transition, Variants } from "motion/react";

/** One easing curve and timing scale for the whole app. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const DURATION = { fast: 0.18, base: 0.32, slow: 0.5 } as const;

export const transition: Transition = { duration: DURATION.base, ease: EASE };

export const stagger = (step = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren } },
});

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition },
};
