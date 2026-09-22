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
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getBootstrap } from "@/lib/server/access";
import { listStaff, listTasks, upsertTask } from "@/lib/server/people";
import type { TaskRow } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

const COLS = ["todo", "doing", "blocked", "done"] as const;

function TasksPage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const tasks = useQuery({ queryKey: ["tasks"], queryFn: () => listTasks() });
  const staff = useQuery({ queryKey: ["staff"], queryFn: () => listStaff() });
  const isAdmin = boot.data?.access.role === "admin";
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaskRow | null>(null);

  const save = useMutation({
    mutationFn: (data: Parameters<typeof upsertTask>[0]["data"]) => upsertTask({ data }),
    onSuccess: () => {
      toast.success("Task saved.");
      setOpen(false);
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const move = useMutation({
    mutationFn: (data: { id: number; status: string }) =>
      upsertTask({
        data: {
          id: data.id,
          title: tasks.data?.find((t) => t.id === data.id)?.title ?? "Task",
          status: data.status,
          priority: tasks.data?.find((t) => t.id === data.id)?.priority ?? "medium",
        },
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader
        kicker="Tasks"
        title="On the board"
        description="What the house is carrying. Move a card when the work moves."
        actions={
          isAdmin ? (
            <Button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              New task
            </Button>
          ) : null
        }
      />

      {tasks.isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-64 shrink-0 rounded-xl" />
          ))}
        </div>
      ) : (tasks.data ?? []).length === 0 ? (
        <EmptyState title="The board is empty" hint="Assign the first piece of work." />
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex min-w-max gap-4 pb-2 xl:min-w-0 xl:grid xl:grid-cols-4">
            {COLS.map((col) => {
              const items = (tasks.data ?? []).filter((t) => t.status === col);
              return (
                <div key={col} className="w-64 shrink-0 xl:w-auto">
                  <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    {col === "todo" ? "To do" : col === "doing" ? "In hand" : col}
                  </p>
                  <div className="space-y-2">
                    {items.map((t) => (
                      <Card
                        key={t.id}
                        className={cn("cursor-pointer overflow-hidden")}
                        onClick={() => {
                          setEditing(t);
                          setOpen(true);
                        }}
                      >
                        <CardContent className="space-y-2 p-4">
                          <p className="text-sm font-medium break-words">{t.title}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge value={t.priority} />
                            {t.dueDate ? (
                              <span className="text-xs text-muted-foreground">{formatDate(t.dueDate)}</span>
                            ) : null}
                          </div>
                          {t.staffName ? <p className="text-xs text-muted-foreground">{t.staffName}</p> : null}
                          <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
                            {COLS.filter((c) => c !== t.status).map((c) => (
                              <Button
                                key={c}
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                                onClick={() => move.mutate({ id: t.id, status: c })}
                              >
                                {c === "todo" ? "To do" : c === "doing" ? "In hand" : c}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <TaskDialog
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

function TaskDialog({
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
  editing: TaskRow | null;
  isAdmin: boolean;
  staff: { id: number; name: string }[];
  busy: boolean;
  onSave: (data: Parameters<typeof upsertTask>[0]["data"]) => void;
}) {
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [staffId, setStaffId] = useState("none");

  useEffect(() => {
    if (!open) return;
    setPriority(editing?.priority ?? "medium");
    setStatus(editing?.status ?? "todo");
    setStaffId(editing?.staffId ? String(editing.staffId) : "none");
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          key={editing?.id ?? "new"}
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onSave({
              id: editing?.id,
              title: String(fd.get("title")),
              description: String(fd.get("description") || ""),
              staffId: staffId === "none" ? null : Number(staffId),
              priority,
              status,
              dueDate: String(fd.get("dueDate") || "") || null,
            });
          }}
        >
          <DialogHeader>
            <DialogTitle>{editing ? "Task" : "New task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={editing?.title} required readOnly={!isAdmin && Boolean(editing)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Notes</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={editing?.description ?? ""}
              readOnly={!isAdmin && Boolean(editing)}
            />
          </div>
          {isAdmin ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Assign</Label>
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
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dueDate">Due</Label>
                <Input id="dueDate" name="dueDate" type="date" defaultValue={editing?.dueDate ?? ""} />
              </div>
            </>
          ) : null}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
