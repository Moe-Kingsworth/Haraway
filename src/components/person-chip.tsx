import { avatarTone } from "@/lib/constants";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PersonChip({
  id,
  name,
  meta,
  size = "md",
}: {
  id: number;
  name: string;
  meta?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full font-medium",
          size === "sm" ? "size-7 text-xs" : "size-9 text-xs",
          avatarTone(id),
        )}
      >
        {initials(name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{name}</span>
        {meta ? <span className="block truncate text-xs text-muted-foreground">{meta}</span> : null}
      </span>
    </div>
  );
}
