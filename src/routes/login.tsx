import { type FormEvent, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/logo";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" />;

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0] || "Colleague",
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (res.error) throw new Error(res.error.message || "Could not create the account.");
      } else {
        const res = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (res.error) throw new Error(res.error.message || "Could not sign in.");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between bg-sidebar px-10 py-10 text-sidebar-foreground lg:flex">
        <Wordmark inverted />
        <div className="max-w-md">
          <p className="text-xs tracking-[0.2em] text-sidebar-muted uppercase">Wuse II · Abuja</p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
            The house, the people, the closings — on one desk.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-muted">
            Attendance, payroll, tasks and the client file, from first viewing to the receipt.
            Built for a terrace house that actually sells.
          </p>
        </div>
        <p className="text-xs text-sidebar-muted">Plot 42, Aminu Kano Crescent · RC 1847291</p>
      </section>

      <section className="flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Wordmark />
          </div>
          <h2 className="font-display text-2xl font-medium tracking-tight">Sign in to the desk</h2>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            Operations leads use Google or X. Team members join with the work email on their staff
            file.
          </p>

          {isPending ? (
            <p className="text-sm text-muted-foreground">Loading the desk…</p>
          ) : (
            <>
              {authEnabled ? (
                <div className="space-y-2">
                  {GROK_PROVIDERS.map((p) => (
                    <Button
                      key={p.providerId}
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                    >
                      Continue with {p.label}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sign-in is disabled.</p>
              )}

              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or with email
                <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={onEmail} className="space-y-3">
                {mode === "up" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                ) : null}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in"}
                </Button>
              </form>

              <button
                type="button"
                className="mt-4 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setMode(mode === "in" ? "up" : "in");
                  setError(null);
                }}
              >
                {mode === "in" ? "New to the house? Create an account" : "Already on the desk? Sign in"}
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
