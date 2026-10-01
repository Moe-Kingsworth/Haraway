import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-mark.png"
      alt="Eden Shelters"
      className={cn("size-8 shrink-0 object-contain", className)}
    />
  );
}

export function Wordmark({
  inverted = false,
  name = "Eden Shelters",
  className,
}: {
  inverted?: boolean;
  name?: string;
  className?: string;
}) {
  if (name && name !== "Eden Shelters") {
    return (
      <div className={cn("flex items-center gap-2.5", className)}>
        <LogoMark />
        <div className="leading-tight">
          <p
            className={cn(
              "font-display text-base font-medium tracking-tight",
              inverted ? "text-sidebar-foreground" : "text-foreground",
            )}
          >
            {name}
          </p>
          <p
            className={cn(
              "text-xs tracking-wide uppercase",
              inverted ? "text-sidebar-muted" : "text-muted-foreground",
            )}
          >
            Staff Portal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <img
        src={inverted ? "/logo-inverted.png" : "/logo.png"}
        alt={name}
        className="h-9 w-auto max-w-full object-contain"
      />
    </div>
  );
}
