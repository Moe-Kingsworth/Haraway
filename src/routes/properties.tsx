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
import { DISTRICTS, PROPERTY_STATUSES, PROPERTY_TYPES } from "@/lib/constants";
import { formatNgn } from "@/lib/format";
import { getBootstrap } from "@/lib/server/access";
import { listProperties, upsertProperty } from "@/lib/server/crm";
import type { Property } from "@/lib/types";

export const Route = createFileRoute("/properties")({ component: PropertiesPage });

function PropertiesPage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const properties = useQuery({ queryKey: ["properties"], queryFn: () => listProperties() });
  const isAdmin = boot.data?.access.role === "admin";
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);

  const save = useMutation({
    mutationFn: (data: Parameters<typeof upsertProperty>[0]["data"]) => upsertProperty({ data }),
    onSuccess: () => {
      toast.success("Listing saved.");
      setOpen(false);
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader
        kicker="Listings"
        title="On the ground"
        description="Maitama to Life Camp. Open a card to amend price, status or the brief."
        actions={
          isAdmin ? (
            <Button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add listing
            </Button>
          ) : null
        }
      />
      {properties.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (properties.data ?? []).length === 0 ? (
        <EmptyState title="No listings yet" hint="Add a house, plot or plaza to start taking offers." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(properties.data ?? []).map((p) => (
            <Card
              key={p.id}
              className="cursor-pointer"
              onClick={() => {
                if (!isAdmin) return;
                setEditing(p);
                setOpen(true);
              }}
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-lg font-medium tracking-tight">{p.title}</p>
                  <StatusBadge value={p.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {p.district} · {p.address}
                </p>
                <p className="text-sm">
                  {p.type}
                  {p.bedrooms ? ` · ${p.bedrooms} bed` : ""}
                  {p.bathrooms ? ` · ${p.bathrooms} bath` : ""}
                  {p.sizeSqm ? ` · ${p.sizeSqm} m²` : ""}
                </p>
                <p className="font-display text-xl font-medium tabular-nums">{formatNgn(p.priceNgn)}</p>
                {p.description ? <p className="text-sm text-muted-foreground">{p.description}</p> : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PropertyDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        busy={save.isPending}
        onSave={(data) => save.mutate(data)}
      />
    </AppShell>
  );
}

function PropertyDialog({
  open,
  onOpenChange,
  editing,
  busy,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Property | null;
  busy: boolean;
  onSave: (data: Parameters<typeof upsertProperty>[0]["data"]) => void;
}) {
  const [district, setDistrict] = useState("Maitama");
  const [type, setType] = useState("Duplex");
  const [status, setStatus] = useState("available");

  useEffect(() => {
    if (!open) return;
    setDistrict(editing?.district ?? "Maitama");
    setType(editing?.type ?? "Duplex");
    setStatus(editing?.status ?? "available");
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
              title: String(fd.get("title")),
              district,
              address: String(fd.get("address")),
              type,
              status,
              bedrooms: fd.get("bedrooms") ? Number(fd.get("bedrooms")) : null,
              bathrooms: fd.get("bathrooms") ? Number(fd.get("bathrooms")) : null,
              sizeSqm: fd.get("sizeSqm") ? Number(fd.get("sizeSqm")) : null,
              priceNgn: Number(fd.get("priceNgn")),
              description: String(fd.get("description") || ""),
            });
          }}
        >
          <DialogHeader>
            <DialogTitle>{editing ? "Edit listing" : "New listing"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={editing?.title} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={editing?.address} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>District</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
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
                  {PROPERTY_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priceNgn">Price (₦)</Label>
              <Input id="priceNgn" name="priceNgn" type="number" defaultValue={editing?.priceNgn ?? 0} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bedrooms">Beds</Label>
              <Input id="bedrooms" name="bedrooms" type="number" defaultValue={editing?.bedrooms ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bathrooms">Baths</Label>
              <Input id="bathrooms" name="bathrooms" type="number" defaultValue={editing?.bathrooms ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sizeSqm">Size (m²)</Label>
              <Input id="sizeSqm" name="sizeSqm" type="number" defaultValue={editing?.sizeSqm ?? ""} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Brief</Label>
            <Textarea id="description" name="description" defaultValue={editing?.description ?? ""} />
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
