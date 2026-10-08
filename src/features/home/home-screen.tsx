import { Button, buttonStyles } from "@/components/button";
import { Icon } from "@/components/icon";
import { UploadLabel } from "@/components/upload-button";

const STEPS = [
  { icon: "recycle", label: "How to dispose" },
  { icon: "coins", label: "What it's worth" },
  { icon: "pin", label: "Where to take it" },
] as const;

export function HomeScreen({ onScan, onImage }: { onScan: () => void; onImage: (file: File) => void }) {
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col overflow-hidden px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-lime/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-32 size-72 rounded-full bg-brand/20 blur-3xl" />

      <header className="relative flex items-center gap-2 animate-rise">
        <span className="grid size-9 place-items-center rounded-xl bg-brand-deep text-lime">
          <Icon name="leaf" className="size-5" />
        </span>
        <span className="text-lg font-bold tracking-tight">CleanItUp</span>
      </header>

      <section className="relative flex flex-1 flex-col justify-center py-10">
        <p className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-brand-deep ring-1 ring-line animate-rise [animation-delay:80ms]">
          <Icon name="sparkle" className="size-3.5" /> AI waste assistant
        </p>
        <h1 className="text-[2.6rem] leading-[1.05] font-bold tracking-tight animate-rise [animation-delay:140ms]">
          Know Your Waste.
          <br />
          <span className="text-brand">Do the Right Thing.</span>
        </h1>
        <p className="mt-4 max-w-xs text-muted animate-rise [animation-delay:200ms]">
          Point your camera at any item. We&apos;ll tell you what it is and what to do with it.
        </p>

        <ul className="mt-8 grid grid-cols-3 gap-2 animate-rise [animation-delay:260ms]">
          {STEPS.map((s) => (
            <li key={s.label} className="flex flex-col gap-2 rounded-2xl bg-surface/80 p-3 ring-1 ring-line backdrop-blur">
              <Icon name={s.icon} className="size-5 text-brand" />
              <span className="text-xs leading-tight font-medium">{s.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="relative flex flex-col gap-3 animate-rise [animation-delay:320ms]">
        <Button onClick={onScan} className="py-5 text-lg">
          <Icon name="camera" className="size-6" /> Scan Waste
        </Button>
        <UploadLabel onImage={onImage} className={buttonStyles("secondary")}>
          <Icon name="upload" /> Upload Image
        </UploadLabel>
      </div>
    </main>
  );
}
