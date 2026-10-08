import type { CSSProperties } from "react";

const CORNERS: { position: string; edges: (keyof CSSProperties)[] }[] = [
  { position: "top-0 left-0", edges: ["borderTopWidth", "borderLeftWidth"] },
  { position: "top-0 right-0", edges: ["borderTopWidth", "borderRightWidth"] },
  { position: "bottom-0 left-0", edges: ["borderBottomWidth", "borderLeftWidth"] },
  { position: "bottom-0 right-0", edges: ["borderBottomWidth", "borderRightWidth"] },
];

/** Precise inspection-frame corner brackets. Colour comes from a border-colour class. */
export function FrameCorners({ className = "border-paper", size = "size-6", weight = 2 }: { className?: string; size?: string; weight?: number }) {
  return (
    <>
      {CORNERS.map(({ position, edges }) => (
        <span
          key={position}
          aria-hidden
          className={`pointer-events-none absolute border-0 border-solid ${size} ${position} ${className}`}
          style={Object.fromEntries(edges.map((e) => [e, weight]))}
        />
      ))}
    </>
  );
}
