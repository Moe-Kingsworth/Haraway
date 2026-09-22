import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Wordmark } from "@/components/logo";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPayment, getDeal, upsertDeal } from "@/lib/server/crm";
import { DEAL_STATUSES, PAYMENT_METHODS } from "@/lib/constants";
import { formatDate, formatNgn, nairaToWords, todayWAT } from "@/lib/format";

export const Route = createFileRoute("/deals_/$id")({
  component: DealPrint,
});

function DealPrint() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const q = useQuery({
    queryKey: ["deal", id],
    queryFn: () => getDeal({ data: { id: Number(id) } }),
  });
  const d = q.data;
  const [status, setStatus] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [method, setMethod] = useState("transfer");
  const current = status ?? d?.status ?? "draft";
  const balance = d ? Math.max(0, d.offerNgn - d.paidNgn) : 0;

  const save = useMutation({
    mutationFn: (next: string) => {
      if (!d) throw new Error("Form not loaded.");
      return upsertDeal({
        data: {
          id: d.id,
          clientId: d.clientId,
          propertyId: d.propertyId,
          staffId: d.staffId,
          kind: d.kind,
          offerNgn: d.offerNgn,
          status: next,
          paymentPlan: d.paymentPlan ?? undefined,
          issuedAt: next === "draft" ? d.issuedAt : d.issuedAt ?? todayWAT(),
          notes: d.notes ?? undefined,
        },
      });
    },
    onSuccess: () => {
      toast.success("Form updated.");
      void qc.invalidateQueries({ queryKey: ["deal", id] });
      void qc.invalidateQueries({ queryKey: ["deals"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const pay = useMutation({
    mutationFn: (data: { amountNgn: number; method: string; paidAt: string; narration: string }) => {
      if (!d) throw new Error("Form not loaded.");
      return createPayment({
        data: {
          clientId: d.clientId,
          dealId: d.id,
          amountNgn: data.amountNgn,
          method: data.method,
          paidAt: data.paidAt,
          narration: data.narration,
        },
      });
    },
    onSuccess: (res) => {
      toast.success(`Receipt ${res.receiptNo} issued.`);
      setPayOpen(false);
      void qc.invalidateQueries({ queryKey: ["deal", id] });
      void qc.invalidateQueries({ queryKey: ["deals"] });
      void qc.invalidateQueries({ queryKey: ["payments"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      if (res.id) {
        void navigate({ to: "/receipts/$id", params: { id: String(res.id) } });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell>
      <div className="print-hidden mb-4 flex flex-wrap items-center justify-between gap-2">
        <Button variant="outline" asChild>
          <Link to="/deals">Back to forms</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {d ? (
            <Select
              value={current}
              onValueChange={(v) => {
                setStatus(v);
                save.mutate(v);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEAL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          {d && balance > 0 ? (
            <Button variant="secondary" onClick={() => setPayOpen(true)}>
              Issue receipt
            </Button>
          ) : null}
          <Button onClick={() => window.print()}>Print form</Button>
        </div>
      </div>

      {d ? (
        <article className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-8 shadow-soft md:p-12">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
            <Wordmark />
            <div className="text-right text-sm">
              <p className="font-medium">{d.reference}</p>
              <StatusBadge value={d.status} />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {d.workspace.address} · {d.workspace.phone} · {d.workspace.rcNumber}
          </p>
          <h1 className="mt-8 font-display text-3xl font-medium tracking-tight">
            {d.kind === "lease" ? "Offer to Lease" : "Offer to Purchase"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Issued {d.issuedAt ? formatDate(d.issuedAt) : "as a draft"} · {d.paymentPlan ?? "outright"}
          </p>

          <section className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Purchaser / Lessee</p>
              <p className="mt-1 font-medium">{d.clientName}</p>
              <p className="text-sm text-muted-foreground">{d.clientPhone}</p>
              {d.clientEmail ? <p className="text-sm text-muted-foreground">{d.clientEmail}</p> : null}
            </div>
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Vendor</p>
              <p className="mt-1 font-medium">{d.workspace.companyName}</p>
              <p className="text-sm text-muted-foreground">for the beneficial owner, as disclosed</p>
              <p className="text-sm text-muted-foreground">Agent: {d.staffName ?? "the desk"}</p>
            </div>
          </section>

          <section className="mt-8">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">The property</p>
            <p className="mt-1 font-medium">{d.propertyTitle}</p>
            <p className="text-sm text-muted-foreground">
              {d.propertyAddress}, {d.propertyDistrict}, Abuja, FCT
            </p>
          </section>

          <section className="mt-8 rounded-lg bg-background p-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Consideration</p>
            <p className="mt-1 font-display text-3xl font-medium tabular-nums">{formatNgn(d.offerNgn)}</p>
            <p className="mt-1 text-sm">{nairaToWords(d.offerNgn)}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Received to date {formatNgn(d.paidNgn)} · Balance {formatNgn(balance)}
            </p>
          </section>

          {d.notes ? (
            <section className="mt-6">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Special conditions</p>
              <p className="mt-1 text-sm">{d.notes}</p>
            </section>
          ) : null}

          <section className="mt-12 grid gap-10 sm:grid-cols-2">
            <SignLine label="Purchaser / Lessee" />
            <SignLine label={`For ${d.workspace.companyName}`} />
          </section>
          <p className="mt-8 text-xs text-muted-foreground">
            Subject to contract, good title, and the Land Use Act. This form is not a conveyance.
          </p>
        </article>
      ) : (
        <p className="text-sm text-muted-foreground">Loading form…</p>
      )}

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="print-hidden">
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              pay.mutate({
                amountNgn: Number(fd.get("amountNgn")),
                method,
                paidAt: String(fd.get("paidAt") || todayWAT()),
                narration: String(fd.get("narration") || ""),
              });
            }}
          >
            <DialogHeader>
              <DialogTitle>Issue receipt</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {d?.clientName} · balance {formatNgn(balance)}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="amountNgn">Amount (₦)</Label>
                <Input
                  id="amountNgn"
                  name="amountNgn"
                  type="number"
                  required
                  min={1}
                  defaultValue={balance || undefined}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="paidAt">Date</Label>
                <Input id="paidAt" name="paidAt" type="date" defaultValue={todayWAT()} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="narration">Narration</Label>
              <Textarea
                id="narration"
                name="narration"
                defaultValue={d ? `${d.reference} — ${d.propertyTitle}` : ""}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={pay.isPending}>
                Issue
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function SignLine({ label }: { label: string }) {
  return (
    <div>
      <div className="h-16 border-b border-foreground/30" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
