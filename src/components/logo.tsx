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
        d="M7.5 15.5 16 9l8.5 6.5M10.5 14v9h11v-9M14.5 23v-4.5h3V23"
        className="stroke-primary-foreground"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Wordmark({
  inverted = false,
  name = "Eden Shelters",
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
          Staff Portal
        </p>
      </div>
    </div>
  );
}
