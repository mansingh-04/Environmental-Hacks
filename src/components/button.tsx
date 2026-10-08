import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-deep text-white shadow-lg shadow-brand-deep/20 hover:bg-brand-deep/90",
  secondary: "bg-surface text-ink ring-1 ring-line hover:bg-white/70",
};

export const buttonStyles = (variant: Variant = "primary", className = "") =>
  `inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold transition active:scale-[0.98] disabled:opacity-50 ${VARIANTS[variant]} ${className}`;

export function Button({
  variant,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={buttonStyles(variant, className)} {...props} />;
}
