import { type FormEvent, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setBearerToken, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getRoleLandingPath } from "@/lib/constants";
import { getLoginStaffProfile } from "@/lib/server/access";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) {
    return <Navigate to="/" />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    try {
      const cleanEmail = email.trim();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error || !data?.session) {
        toast.error("Invalid email or password");
        setBusy(false);
        return;
      }

      // Synchronize bearer token for server functions
      setBearerToken(data.session.access_token);

      // Verify staff role & status
      try {
        const profile = await getLoginStaffProfile();

        if (profile.status === "suspended" || profile.status === "exited") {
          toast.error("Your account has been suspended. Contact your administrator.");
          await signOut("/login");
          setBusy(false);
          return;
        }

        if (profile.mustChangePassword) {
          window.location.href = "/change-password";
          return;
        }

        const landing = getRoleLandingPath(profile.role);
        window.location.href = landing;
      } catch (err) {
        // Fallback redirect if profile fetch fails
        console.error("Profile resolution error:", err);
        window.location.href = "/";
      }
    } catch {
      toast.error("Invalid email or password");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-svh flex flex-col justify-center items-center bg-[#F9F7F4] p-4 sm:p-6">
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#E8E4DD] shadow-sm p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="/logo.png"
            alt="Eden Shelters"
            className="h-10 w-auto object-contain mb-5"
          />
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Staff Portal
          </h1>
          <p className="mt-1 text-xs text-muted-foreground tracking-wide uppercase">
            F8, Melita Plaza, Area 11 Garki · Abuja
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@edenshelters.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
              className="h-11 border-[#DDD7CD] focus-visible:ring-[#C9A84C]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={busy}
                className="h-11 pr-11 border-[#DDD7CD] focus-visible:ring-[#C9A84C]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full h-11 bg-[#C9A84C] hover:bg-[#B8973B] text-white font-medium text-sm rounded-lg transition-colors shadow-none cursor-pointer"
          >
            {busy ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center">
        Eden Shelters · RC 1847291 · Estate operations, Abuja
      </p>
    </main>
  );
}
