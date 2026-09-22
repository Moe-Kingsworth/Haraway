import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PAYMENT_METHODS } from "@/lib/constants";
import { formatDate, formatNgn, todayWAT } from "@/lib/format";
import { getBootstrap } from "@/lib/server/access";
import { createPayment, listClients, listDeals, listPayments } from "@/lib/server/crm";

export const Route = createFileRoute("/receipts")({ component: ReceiptsPage });

function ReceiptsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const payments = useQuery({ queryKey: ["payments"], queryFn: () => listPayments() });
  const clients = useQuery({ queryKey: ["clients"], queryFn: () => listClients() });
  const deals = useQuery({ queryKey: ["deals"], queryFn: () => listDeals() });
  const isAdmin = boot.data?.access.role === "admin";
  const [open, setOpen] = useState(false);

  const save = useMutation({
    mutationFn: (data: Parameters<typeof createPayment>[0]["data"]) => createPayment({ data }),
    onSuccess: (res) => {
      toast.success(`Receipt ${res.receiptNo} issued.`);
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["payments"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["deals"] });
      if (res.id) {
        void navigate({ to: "/receipts/$id", params: { id: String(res.id) } });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader
        kicker="Receipts"
        title="Money in"
        description="Every naira that crossed the desk. Issue a receipt, then print it for the file."
        actions={isAdmin ? <Button onClick={() => setOpen(true)}>Issue receipt</Button> : null}
      />
      {payments.isLoading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : (payments.data ?? []).length === 0 ? (
        <EmptyState title="No receipts yet" hint="Issue a receipt when money lands." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="text-xs tracking-wide text-muted-foreground uppercase">
              <tr className="border-b border-border">
                <th className="py-2 pr-3 font-medium">Receipt</th>
                <th className="py-2 pr-3 font-medium">Client</th>
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Method</th>
                <th className="py-2 pr-3 font-medium">Amount</th>
                <th className="py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {(payments.data ?? []).map((p) => (
                <tr key={p.id} className="border-b border-border/70">
                  <td className="py-3 pr-3">
                    <p className="font-medium">{p.receiptNo}</p>
                    <p className="text-xs text-muted-foreground">{p.dealReference ?? p.narration}</p>
                  </td>
                  <td className="py-3 pr-3">{p.clientName}</td>
                  <td className="py-3 pr-3 tabular-nums">{formatDate(p.paidAt)}</td>
                  <td className="py-3 pr-3">
                    <StatusBadge value={p.method} />
                  </td>
                  <td className="py-3 pr-3 tabular-nums font-medium">{formatNgn(p.amountNgn)}</td>
                  <td className="py-3">
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/receipts/$id" params={{ id: String(p.id) }}>
                        Open
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaymentDialog
        open={open}
        onOpenChange={setOpen}
        clients={(clients.data ?? []).map((c) => ({ id: c.id, name: c.fullName }))}
        deals={(deals.data ?? []).map((d) => ({
          id: d.id,
          label: `${d.reference} · ${d.clientName}`,
          clientId: d.clientId,
        }))}
        busy={save.isPending}
        onSave={(data) => save.mutate(data)}
      />
    </AppShell>
  );
}

function PaymentDialog({
  open,
  onOpenChange,
  clients,
  deals,
  busy,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  clients: { id: number; name: string }[];
  deals: { id: number; label: string; clientId: number }[];
  busy: boolean;
  onSave: (data: Parameters<typeof createPayment>[0]["data"]) => void;
}) {
  const [clientId, setClientId] = useState("");
  const [dealId, setDealId] = useState("none");
  const [method, setMethod] = useState("transfer");

  useEffect(() => {
    if (!open) return;
    setClientId(clients[0] ? String(clients[0].id) : "");
    setDealId("none");
    setMethod("transfer");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onSave({
              clientId: Number(clientId),
              dealId: dealId === "none" ? null : Number(dealId),
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
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Linked form</Label>
            <Select
              value={dealId}
              onValueChange={(v) => {
                setDealId(v);
                if (v !== "none") {
                  const d = deals.find((x) => String(x.id) === v);
                  if (d) setClientId(String(d.clientId));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {deals.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amountNgn">Amount (₦)</Label>
              <Input id="amountNgn" name="amountNgn" type="number" required min={1} />
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
            <Textarea id="narration" name="narration" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy || !clientId}>
              Issue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
