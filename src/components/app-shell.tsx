import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Receipt,
  ScrollText,
  Users,
  Wallet,
  CalendarCheck,
  LineChart,
  Briefcase,
  Home,
  Landmark,
} from "lucide-react";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getBootstrap } from "@/lib/server/access";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Workspace } from "@/lib/types";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard, adminOnly: false },
  { href: "/desk", label: "My desk", icon: Home, adminOnly: false },
  { href: "/staff", label: "People", icon: Users, adminOnly: true },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck, adminOnly: false },
  { href: "/payroll", label: "Payroll", icon: Wallet, adminOnly: false },
  { href: "/performance", label: "Performance", icon: LineChart, adminOnly: false },
  { href: "/tasks", label: "Tasks", icon: ClipboardList, adminOnly: false },
  { href: "/clients", label: "Clients", icon: Briefcase, adminOnly: false },
  { href: "/properties", label: "Listings", icon: Building2, adminOnly: false },
  { href: "/deals", label: "Purchase forms", icon: ScrollText, adminOnly: false },
  { href: "/receipts", label: "Receipts", icon: Receipt, adminOnly: false },
  { href: "/settings", label: "Company", icon: Landmark, adminOnly: true },
] as const;

function NavLinks({
  role,
  onNavigate,
  pathname,
}: {
  role: "admin" | "staff";
  onNavigate?: () => void;
  pathname: string;
}) {
  const items = NAV.filter((item) => !item.adminOnly || role === "admin");
  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={cn(
              "flex h-10 items-center gap-3 rounded-sm px-3 text-sm transition-colors",
              active
                ? "bg-sidebar-foreground/10 text-sidebar-foreground"
                : "text-sidebar-muted hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({
  role,
  workspace,
  onNavigate,
  pathname,
}: {
  role: "admin" | "staff";
  workspace: Workspace;
  onNavigate?: () => void;
  pathname: string;
}) {
  return (
    <>
      <div className="px-5 pt-6 pb-5">
        <Wordmark inverted name={workspace.companyName} />
        <p className="mt-3 text-xs text-sidebar-muted">{workspace.tagline}</p>
      </div>
      <NavLinks role={role} onNavigate={onNavigate} pathname={pathname} />
      <div className="mt-auto px-5 py-5">
        <p className="text-xs leading-relaxed text-sidebar-muted">{workspace.address}</p>
      </div>
    </>
  );
}

const FALLBACK_WORKSPACE: Workspace = {
  userId: "",
  companyName: "Aso Terrace",
  tagline: "Estate operations, Abuja",
  address: "Plot 42, Aminu Kano Crescent, Wuse II, Abuja, FCT",
  phone: "+234 9 461 2200",
  email: "ops@asoterrace.ng",
  rcNumber: "RC 1847291",
};

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bootstrap = useQuery({
    queryKey: ["bootstrap"],
    queryFn: () => getBootstrap(),
    enabled: Boolean(user),
  });
  const [open, setOpen] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-svh">
        <aside className="hidden h-svh w-60 shrink-0 flex-col bg-sidebar md:flex">
          <div className="px-5 pt-6 pb-5">
            <Wordmark inverted />
            <p className="mt-3 text-xs text-sidebar-muted">Loading the desk…</p>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <p className="mb-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">Aso Terrace</p>
          <h1 className="mb-4 font-display text-2xl font-medium tracking-tight">The operations desk</h1>
          <Skeleton className="h-40 w-full rounded-xl" />
        </main>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const role = bootstrap.data?.access.role ?? "admin";
  const workspace = bootstrap.data?.access.workspace ?? FALLBACK_WORKSPACE;

  return (
    <div className="flex min-h-svh">
      <aside className="print-hidden hidden h-svh w-60 shrink-0 flex-col bg-sidebar md:flex">
        <SidebarBody role={role} workspace={workspace} pathname={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="print-hidden sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-muted-foreground">
              {new Intl.DateTimeFormat("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                timeZone: "Africa/Lagos",
              }).format(new Date())}
              <span className="hidden sm:inline"> · West Africa Time</span>
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            {role === "admin" ? "Operations desk" : "Team desk"}
          </Badge>
          <UserButton />
        </header>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0">
            <SidebarBody
              role={role}
              workspace={workspace}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
