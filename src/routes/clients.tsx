import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
import { CLIENT_STAGE_LABELS, CLIENT_STAGES, CLIENT_TYPES } from "@/lib/constants";
import { getBootstrap } from "@/lib/server/access";
import { listClients, upsertClient } from "@/lib/server/crm";
import { listStaff } from "@/lib/server/people";
import type { Client } from "@/lib/types";

export const Route = createFileRoute("/clients")({ component: ClientsPage });

function ClientsPage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const clients = useQuery({ queryKey: ["clients"], queryFn: () => listClients() });
  const staff = useQuery({ queryKey: ["staff"], queryFn: () => listStaff() });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const isAdmin = boot.data?.access.role === "admin";

  const save = useMutation({
    mutationFn: (data: Parameters<typeof upsertClient>[0]["data"]) => upsertClient({ data }),
    onSuccess: () => {
      toast.success("Client file saved.");
      setOpen(false);
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const advance = useMutation({
    mutationFn: (c: Client) => {
      const i = CLIENT_STAGES.indexOf(c.stage as (typeof CLIENT_STAGES)[number]);
      const next = CLIENT_STAGES[i + 1];
      if (!next || next === "lost") throw new Error("This file is already at the end.");
      return upsertClient({
        data: {
          id: c.id,
          fullName: c.fullName,
          email: c.email ?? undefined,
          phone: c.phone,
          type: c.type,
          stage: next,
          source: c.source ?? undefined,
          assignedStaffId: c.assignedStaffId,
          notes: c.notes ?? undefined,
        },
      });
    },
    onSuccess: () => {
      toast.success("Stage updated.");
      void qc.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader
        kicker="Clients"
        title="The book"
        description="The pipeline from first call to a signed C of O. Open a card to amend the file."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add client
          </Button>
        }
      />
      {clients.isLoading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : (clients.data ?? []).length === 0 ? (
        <EmptyState title="The book is empty" hint="Add a buyer, seller or investor to start a file." />
      ) : (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {CLIENT_STAGES.map((stage) => {
            const items = (clients.data ?? []).filter((c) => c.stage === stage);
            return (
              <div key={stage} className="w-64 shrink-0">
                <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  {CLIENT_STAGE_LABELS[stage]} · {items.length}
                </p>
                <div className="space-y-2">
                  {items.map((c) => (
                    <Card
                      key={c.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setEditing(c);
                        setOpen(true);
                      }}
                    >
                      <CardContent className="space-y-2 p-4">
                        <p className="text-sm font-medium">{c.fullName}</p>
                        <p className="text-xs text-muted-foreground">{c.phone}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge value={c.type} />
                        </div>
                        {c.assignedStaffName ? (
                          <p className="text-xs text-muted-foreground">{c.assignedStaffName}</p>
                        ) : null}
                        {stage !== "closed" && stage !== "lost" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              advance.mutate(c);
                            }}
                          >
                            Advance
                          </Button>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ClientDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        isAdmin={Boolean(isAdmin)}
        staff={(staff.data ?? []).map((s) => ({ id: s.id, name: s.fullName }))}
        busy={save.isPending}
        onSave={(data) => save.mutate(data)}
      />
    </AppShell>
  );
}

function ClientDialog({
  open,
  onOpenChange,
  editing,
  isAdmin,
  staff,
  busy,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Client | null;
  isAdmin: boolean;
  staff: { id: number; name: string }[];
  busy: boolean;
  onSave: (data: Parameters<typeof upsertClient>[0]["data"]) => void;
}) {
  const [type, setType] = useState("buyer");
  const [stage, setStage] = useState("lead");
  const [assigned, setAssigned] = useState("none");

  useEffect(() => {
    if (!open) return;
    setType(editing?.type ?? "buyer");
    setStage(editing?.stage ?? "lead");
    setAssigned(editing?.assignedStaffId ? String(editing.assignedStaffId) : "none");
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <form
          key={editing?.id ?? "new"}
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onSave({
              id: editing?.id,
              fullName: String(fd.get("fullName")),
              email: String(fd.get("email") || ""),
              phone: String(fd.get("phone")),
              type,
              stage,
              source: String(fd.get("source") || ""),
              assignedStaffId: assigned === "none" ? null : Number(assigned),
              notes: String(fd.get("notes") || ""),
            });
          }}
        >
          <DialogHeader>
            <DialogTitle>{editing ? "Client file" : "New client"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" defaultValue={editing?.fullName} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={editing?.phone} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={editing?.email ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {CLIENT_STAGE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="source">Source</Label>
              <Input id="source" name="source" defaultValue={editing?.source ?? ""} />
            </div>
            {isAdmin ? (
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Assigned agent</Label>
                <Select value={assigned} onValueChange={setAssigned}>
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
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={editing?.notes ?? ""} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
