import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ink";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  secondary: "border border-line bg-surface text-ink hover:border-ink/30",
  ink: "bg-ink text-paper hover:bg-ink/90",
};

export const buttonStyles = (variant: Variant = "primary", className = "") =>
  `inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-[15px] font-semibold transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${className}`;

export function Button({
  variant,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={buttonStyles(variant, className)} {...props} />;
}
