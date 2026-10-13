import { type FormEvent, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getRoleLandingPath } from "@/lib/constants";
import { completePasswordChange } from "@/lib/server/access";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/change-password")({
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const { user, isPending } = useCurrentUserState();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!isPending && !user) {
    return <Navigate to="/login" />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      // 1. Update password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message || "Failed to update password.");
        setBusy(false);
        return;
      }

      // 2. Set must_change_password = false on staff record in DB
      const res = await completePasswordChange();

      // 3. Success toast
      toast.success("Password updated. Welcome to Eden Shelters Staff Portal.");

      // 4. Redirect to role dashboard
      const landing = getRoleLandingPath(res.role);
      window.location.href = landing;
    } catch (err) {
      console.error("Password change error:", err);
      toast.error("An error occurred while updating your password.");
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
            Set New Password
          </h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Your account requires a password change before continuing to the desk.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
                disabled={busy}
                className="h-11 pr-11 border-[#DDD7CD] focus-visible:ring-[#C9A84C]"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                tabIndex={-1}
                className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
                disabled={busy}
                className="h-11 pr-11 border-[#DDD7CD] focus-visible:ring-[#C9A84C]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
                className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
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
            {busy ? "Updating password…" : "Update Password"}
          </Button>
        </form>
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center">
        Eden Shelters · RC 1847291 · Estate operations, Abuja
      </p>
    </main>
  );
}
