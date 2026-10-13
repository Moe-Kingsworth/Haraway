import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  LogIn,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { Wordmark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DEPARTMENTS } from "@/lib/constants";
import { getPublicJobPostings } from "@/lib/server/jobs";

export const Route = createFileRoute("/careers")({ component: CareersPage });

function CareersPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const query = useQuery({
    queryKey: ["public-jobs"],
    queryFn: () => getPublicJobPostings(),
  });

  const jobs = query.data ?? [];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (deptFilter !== "all" && job.department !== deptFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchDesc = job.description.toLowerCase().includes(q);
        const matchDept = job.department.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchDept) return false;
      }
      return true;
    });
  }, [jobs, deptFilter, search]);

  return (
    <div className="min-h-svh bg-[#F9F7F4] text-foreground flex flex-col selection:bg-accent/20">
      {/* Public Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-[#F9F7F4]/90 backdrop-blur-md px-4 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/careers" className="flex items-center gap-2">
            <Wordmark name="Eden Shelters" />
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                <LogIn className="mr-1.5 size-3.5" />
                Staff Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border/50 bg-gradient-to-b from-[#4B2E1E]/5 to-transparent px-4 py-16 sm:px-8 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <Badge className="bg-[#C9A84C]/20 text-[#4B2E1E] border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold">
            <Sparkles className="mr-1.5 size-3.5 text-[#C9A84C]" />
            Careers at Eden Shelters
          </Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-[#4B2E1E]">
            Build the Future of Prime Estate Operations in Abuja
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We are assembling Nigeria’s leading property professionals — from luxury sales specialists
            and legal closing counsels to operational leaders delivering Maitama, Guzape, and Asokoro landmarks.
          </p>
        </div>
      </section>

      {/* Job Listings Main Content */}
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-12 sm:px-8 space-y-8">
        {/* Search & Filter Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-border shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search open positions by role or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-xs bg-transparent border-border/70"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="size-4 text-muted-foreground hidden sm:inline-block" />
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="h-10 w-full sm:w-44 text-xs">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Listings Section */}
        {query.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-56 rounded-xl bg-white" />
            <Skeleton className="h-56 rounded-xl bg-white" />
            <Skeleton className="h-56 rounded-xl bg-white" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-white p-16 text-center space-y-3">
            <Briefcase className="mx-auto size-12 text-muted-foreground/40" />
            <h3 className="text-base font-semibold text-foreground">No open positions at this time</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Check back soon or revisit this page as our recruitment team periodically posts new vacancies.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="rounded-2xl border border-border/80 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <CardContent className="p-6 space-y-4 flex flex-col flex-1 justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="border-border text-[11px] text-muted-foreground">
                        {job.department}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {new Date(job.createdAt).toLocaleDateString("en-GB", {
                          dateStyle: "medium",
                        })}
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-semibold tracking-tight text-[#4B2E1E] line-clamp-1">
                      {job.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-accent" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-accent" />
                        {job.employmentType}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed pt-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/60">
                    <Link
                      to="/careers/$id"
                      params={{ id: job.id }}
                      className="w-full block"
                    >
                      <Button className="w-full bg-[#C9A84C] text-[#4B2E1E] hover:bg-[#C9A84C]/90 font-semibold text-xs h-10 shadow-sm cursor-pointer">
                        Apply Now
                        <ArrowRight className="ml-1.5 size-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer className="mt-auto border-t border-border/60 bg-white px-4 py-8 sm:px-8 text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-semibold text-foreground">Eden Shelters Limited</p>
            <p>F8, Melita Plaza, Gimbiya Street, Area 11 Garki FCT, Abuja</p>
            <p>RC 1847291 · ops@edenshelters.ng · +234 9 461 2200</p>
          </div>
          <div className="text-center sm:text-right">
            <p>© {new Date().getFullYear()} Eden Shelters. All rights reserved.</p>
            <p className="text-[11px] text-muted-foreground/80 mt-1">Equal opportunity estate employer.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
