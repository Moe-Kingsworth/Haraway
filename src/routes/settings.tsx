import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getBootstrap, updateWorkspace } from "@/lib/server/access";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const isAdmin = boot.data?.access.role === "admin";
  const ws = boot.data?.access.workspace;

  const save = useMutation({
    mutationFn: (data: Parameters<typeof updateWorkspace>[0]["data"]) => updateWorkspace({ data }),
    onSuccess: () => {
      toast.success("Company file saved.");
      void qc.invalidateQueries({ queryKey: ["bootstrap"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader
        kicker="Company"
        title="The firm"
        description="Name, address and RC number as they appear on purchase forms and receipts."
      />

      {!ws ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : !isAdmin ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            Only the operations desk can amend the company file.
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Letterhead</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              key={ws.companyName + ws.rcNumber}
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                save.mutate({
                  companyName: String(fd.get("companyName")),
                  tagline: String(fd.get("tagline")),
                  address: String(fd.get("address")),
                  phone: String(fd.get("phone")),
                  email: String(fd.get("email")),
                  rcNumber: String(fd.get("rcNumber")),
                });
              }}
            >
              <Field label="Company name" name="companyName" defaultValue={ws.companyName} required />
              <Field label="Tagline" name="tagline" defaultValue={ws.tagline} />
              <Field label="Address" name="address" defaultValue={ws.address} required />
              <Field label="Phone" name="phone" defaultValue={ws.phone} required />
              <Field label="Email" name="email" type="email" defaultValue={ws.email} required />
              <Field label="RC number" name="rcNumber" defaultValue={ws.rcNumber} required />
              <Button type="submit" disabled={save.isPending}>
                Save letterhead
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} required={required} />
    </div>
  );
}
