import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8 shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M8 23h16M10.5 18.5h11M13 14h6M15.2 9.5h1.6"
        className="stroke-primary-foreground"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Wordmark({
  inverted = false,
  name = "Aso Terrace",
}: {
  inverted?: boolean;
  name?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark className={inverted ? "[&_rect]:fill-sidebar-foreground [&_path]:stroke-sidebar" : undefined} />
      <div className="leading-tight">
        <p
          className={cn(
            "font-display text-base font-medium tracking-tight",
            inverted ? "text-sidebar-foreground" : "text-foreground",
          )}
        >
          {name}
        </p>
        <p className={cn("text-xs tracking-wide uppercase", inverted ? "text-sidebar-muted" : "text-muted-foreground")}>
          Abuja
        </p>
      </div>
    </div>
  );
}
