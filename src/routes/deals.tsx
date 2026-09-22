import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DEAL_KINDS, DEAL_STATUSES, PAYMENT_PLANS } from "@/lib/constants";
import { formatDate, formatNgn, todayWAT } from "@/lib/format";
import { getBootstrap } from "@/lib/server/access";
import { listClients, listDeals, listProperties, upsertDeal } from "@/lib/server/crm";
import { listStaff } from "@/lib/server/people";

export const Route = createFileRoute("/deals")({ component: DealsPage });

function DealsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const deals = useQuery({ queryKey: ["deals"], queryFn: () => listDeals() });
  const clients = useQuery({ queryKey: ["clients"], queryFn: () => listClients() });
  const properties = useQuery({ queryKey: ["properties"], queryFn: () => listProperties() });
  const staff = useQuery({ queryKey: ["staff"], queryFn: () => listStaff() });
  const [open, setOpen] = useState(false);
  const isAdmin = boot.data?.access.role === "admin";

  const save = useMutation({
    mutationFn: (data: Parameters<typeof upsertDeal>[0]["data"]) => upsertDeal({ data }),
    onSuccess: (res) => {
      toast.success("Purchase form saved.");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["deals"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      if (res.id) {
        void navigate({ to: "/deals/$id", params: { id: String(res.id) } });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader
        kicker="Purchase forms"
        title="Offers and leases"
        description="From draft to completed. Open a form to print the paper the client signs."
        actions={<Button onClick={() => setOpen(true)}>New form</Button>}
      />
      {deals.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (deals.data ?? []).length === 0 ? (
        <EmptyState title="No purchase forms yet" hint="Raise an offer or lease against a listing." />
      ) : (
        <div className="space-y-3">
          {(deals.data ?? []).map((d) => (
            <Card key={d.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium">
                    {d.reference} · {d.kind}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {d.clientName} — {d.propertyTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {d.issuedAt ? formatDate(d.issuedAt) : "Not issued"} · Paid {formatNgn(d.paidNgn)} of{" "}
                    {formatNgn(d.offerNgn)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={d.status} />
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/deals/$id" params={{ id: String(d.id) }}>
                      Open form
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DealDialog
        open={open}
        onOpenChange={setOpen}
        isAdmin={Boolean(isAdmin)}
        clients={(clients.data ?? []).map((c) => ({ id: c.id, name: c.fullName }))}
        properties={(properties.data ?? []).map((p) => ({
          id: p.id,
          name: `${p.title} · ${formatNgn(p.priceNgn)}`,
          price: p.priceNgn,
        }))}
        staff={(staff.data ?? []).map((s) => ({ id: s.id, name: s.fullName }))}
        defaultStaffId={boot.data?.access.staffId ?? null}
        busy={save.isPending}
        onSave={(data) => save.mutate(data)}
      />
    </AppShell>
  );
}

function DealDialog({
  open,
  onOpenChange,
  isAdmin,
  clients,
  properties,
  staff,
  defaultStaffId,
  busy,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isAdmin: boolean;
  clients: { id: number; name: string }[];
  properties: { id: number; name: string; price: number }[];
  staff: { id: number; name: string }[];
  defaultStaffId: number | null;
  busy: boolean;
  onSave: (data: Parameters<typeof upsertDeal>[0]["data"]) => void;
}) {
  const [clientId, setClientId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [staffId, setStaffId] = useState("none");
  const [kind, setKind] = useState("sale");
  const [status, setStatus] = useState("draft");
  const [plan, setPlan] = useState("outright");

  useEffect(() => {
    if (!open) return;
    setClientId(clients[0] ? String(clients[0].id) : "");
    setPropertyId(properties[0] ? String(properties[0].id) : "");
    setStaffId(defaultStaffId ? String(defaultStaffId) : "none");
    setKind("sale");
    setStatus("draft");
    setPlan("outright");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const prop = properties.find((p) => String(p.id) === propertyId);
            onSave({
              clientId: Number(clientId),
              propertyId: Number(propertyId),
              staffId: staffId === "none" ? null : Number(staffId),
              kind,
              offerNgn: Number(fd.get("offerNgn") || prop?.price || 0),
              status,
              paymentPlan: plan,
              issuedAt: status === "draft" ? null : todayWAT(),
              notes: String(fd.get("notes") || ""),
            });
          }}
        >
          <DialogHeader>
            <DialogTitle>New purchase form</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
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
            <Label>Listing</Label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select listing" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Kind</Label>
              <Select value={kind} onValueChange={setKind}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_KINDS.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
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
            </div>
            <div className="space-y-1.5">
              <Label>Plan</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_PLANS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offerNgn">Offer (₦)</Label>
              <Input
                id="offerNgn"
                name="offerNgn"
                type="number"
                defaultValue={properties.find((p) => String(p.id) === propertyId)?.price ?? 0}
              />
            </div>
          </div>
          {isAdmin ? (
            <div className="space-y-1.5">
              <Label>Agent</Label>
              <Select value={staffId} onValueChange={setStaffId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy || !clientId || !propertyId}>
              Create form
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
