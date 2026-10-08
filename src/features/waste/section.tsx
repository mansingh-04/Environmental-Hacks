import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icon";

export function Section({
  icon,
  title,
  delay = 0,
  children,
}: {
  icon: IconName;
  title: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-surface p-5 ring-1 ring-line animate-rise" style={{ animationDelay: `${delay}ms` }}>
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted uppercase">
        <Icon name={icon} className="size-4 text-brand" /> {title}
      </h2>
      {children}
    </section>
  );
}
