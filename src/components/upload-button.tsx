import type { ReactNode } from "react";

/** A label wrapping a hidden file input, so the whole element opens the image picker natively. */
export function UploadLabel({
  onImage,
  className,
  ariaLabel,
  children,
}: {
  onImage: (file: File) => void;
  className: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <label className={`cursor-pointer ${className}`} aria-label={ariaLabel}>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onImage(file);
        }}
      />
      {children}
    </label>
  );
}
