import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/logo";
import { getPayment } from "@/lib/server/crm";
import { formatDate, formatNgn, nairaToWords } from "@/lib/format";

export const Route = createFileRoute("/receipts_/$id")({
  component: ReceiptPrint,
});

function ReceiptPrint() {
  const { id } = Route.useParams();
  const q = useQuery({
    queryKey: ["payment", id],
    queryFn: () => getPayment({ data: { id: Number(id) } }),
  });
  const p = q.data;

  return (
    <AppShell>
      <div className="print-hidden mb-4 flex flex-wrap items-center justify-between gap-2">
        <Button variant="outline" asChild>
          <Link to="/receipts">Back to receipts</Link>
        </Button>
        <Button onClick={() => window.print()}>Print receipt</Button>
      </div>

      {p ? (
        <article className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 shadow-soft md:p-10">
          <div className="flex items-start justify-between gap-4">
            <Wordmark />
            <div className="text-right">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Official receipt</p>
              <p className="font-medium">{p.receiptNo}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {p.workspace.address}
            <br />
            {p.workspace.phone} · {p.workspace.email}
            <br />
            {p.workspace.rcNumber}
          </p>

          <div className="mt-8 border-y border-border py-6">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Received from</p>
            <p className="mt-1 font-display text-2xl font-medium">{p.clientName}</p>
            <p className="text-sm text-muted-foreground">{p.clientPhone}</p>
          </div>

          <div className="mt-6">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">The sum of</p>
            <p className="mt-1 font-display text-3xl font-medium tabular-nums">{formatNgn(p.amountNgn)}</p>
            <p className="mt-1 text-sm">{nairaToWords(p.amountNgn)}</p>
          </div>

          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Date</dt>
              <dd>{formatDate(p.paidAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Method</dt>
              <dd className="capitalize">{p.method}</dd>
            </div>
            {p.dealReference ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Against</dt>
                <dd>{p.dealReference}</dd>
              </div>
            ) : null}
            {p.propertyTitle ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Property</dt>
                <dd className="text-right">{p.propertyTitle}</dd>
              </div>
            ) : null}
            {p.narration ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Narration</dt>
                <dd className="text-right">{p.narration}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <div className="h-12 border-b border-foreground/30" />
              <p className="mt-2 text-xs text-muted-foreground">Cashier</p>
            </div>
            <div>
              <div className="h-12 border-b border-foreground/30" />
              <p className="mt-2 text-xs text-muted-foreground">Client</p>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            This receipt is issued without prejudice to the contract of sale or lease.
          </p>
        </article>
      ) : (
        <p className="text-sm text-muted-foreground">Loading receipt…</p>
      )}
    </AppShell>
  );
}
