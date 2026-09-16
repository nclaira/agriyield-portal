import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import {
  MapPin,
  AlertTriangle,
  Gauge,
  Activity,
  Sprout,
  Warehouse,
} from "lucide-react";
import { RiskMap } from "@/components/RiskMap";
import { getDistrictRisk } from "@/lib/district-risk.functions";
import type { DistrictRisk } from "@/lib/district-risk.data";

type Filter = "ALL" | "HIGH" | "MEDIUM" | "LOW";

const riskQueryOptions = queryOptions({
  queryKey: ["district-risk"],
  queryFn: (): Promise<DistrictRisk[]> => getDistrictRisk(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriYield Portal — Post-Harvest Risk Intelligence" },
      {
        name: "description",
        content:
          "Geospatial dashboard tracking post-harvest storage risk across Rwandan districts, powered by agricultural survey data.",
      },
      { property: "og:title", content: "AgriYield Portal — Post-Harvest Risk Intelligence" },
      {
        property: "og:description",
        content:
          "Geospatial dashboard tracking post-harvest storage risk across Rwandan districts, powered by agricultural survey data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(riskQueryOptions),
  errorComponent: ({ error }) => (
    <div role="alert" className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="bg-slate-950 text-slate-300">Not found.</div>,
  component: Dashboard,
});

const FILTERS: Filter[] = ["ALL", "HIGH", "MEDIUM", "LOW"];

const filterStyles: Record<Filter, { active: string }> = {
  ALL: { active: "border-sky-500/60 bg-sky-500/15 text-sky-300" },
  HIGH: { active: "border-red-500/60 bg-red-500/15 text-red-300" },
  MEDIUM: { active: "border-amber-500/60 bg-amber-500/15 text-amber-300" },
  LOW: { active: "border-emerald-500/60 bg-emerald-500/15 text-emerald-300" },
};

const badgeStyles: Record<DistrictRisk["riskCategory"], string> = {
  HIGH: "border-red-500/40 bg-red-500/10 text-red-400",
  MEDIUM: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  LOW: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
};

function Dashboard() {
  const { data: riskData } = useSuspenseQuery(riskQueryOptions);
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = useMemo(
    () => (filter === "ALL" ? riskData : riskData.filter((d) => d.riskCategory === filter)),
    [riskData, filter],
  );

  const highRiskCount = riskData.filter((d) => d.riskCategory === "HIGH").length;
  const avgRisk =
    riskData.length > 0
      ? Math.round(riskData.reduce((sum, d) => sum + d.riskScore, 0) / riskData.length)
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              AgriYield Portal
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Post-Harvest Risk Intelligence &amp; Geospatial Analytics
            </p>
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="Risk category filter">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                  filter === f
                    ? filterStyles[f].active
                    : "border-slate-700 bg-slate-900/80 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {/* Stat cards */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<MapPin className="h-5 w-5 text-sky-400" />}
            label="Total Districts"
            value={String(riskData.length)}
            accent="text-sky-400"
          />
          <StatCard
            icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
            label="High Risk Zones"
            value={String(highRiskCount)}
            accent="text-red-400"
          />
          <StatCard
            icon={<Gauge className="h-5 w-5 text-amber-400" />}
            label="Avg Risk Score"
            value={String(avgRisk)}
            accent="text-amber-400"
          />
          <StatCard
            icon={<Activity className="h-5 w-5 text-emerald-400" />}
            label="System Status"
            value="Engine Online"
            accent="text-emerald-400"
            pulse
          />
        </section>

        {/* Split view */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Map panel */}
          <div className="lg:col-span-2">
            <div className="flex h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
                <h2 className="text-sm font-semibold text-slate-200">
                  District Risk Map — Rwanda
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <LegendDot color="bg-red-500" label="High" />
                  <LegendDot color="bg-amber-500" label="Medium" />
                  <LegendDot color="bg-emerald-500" label="Low" />
                </div>
              </div>
              <div className="relative flex-1">
                <ClientOnly
                  fallback={
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      Loading map…
                    </div>
                  }
                >
                  <RiskMap data={filtered} />
                </ClientOnly>
              </div>
            </div>
          </div>

          {/* Sidebar list */}
          <div className="flex h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/30">
            <div className="border-b border-slate-800 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-200">
                District Risk Register
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {filtered.length} of {riskData.length} districts shown
              </p>
            </div>
            <ul className="flex-1 divide-y divide-slate-800/70 overflow-y-auto">
              {filtered.map((d) => (
                <li
                  key={d.district}
                  className="px-5 py-4 transition-colors hover:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">{d.district}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {d.province} Province
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${badgeStyles[d.riskCategory]}`}
                    >
                      {d.riskScore}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Sprout className="h-3.5 w-3.5 text-emerald-500" />
                      {d.crop} · {d.yieldTonnes.toLocaleString()} t
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Warehouse className="h-3.5 w-3.5 text-slate-500" />
                      {d.storageCapacityTonnes.toLocaleString()} t
                    </span>
                  </div>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-slate-500">
                  No districts match this filter.
                </li>
              )}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  pulse,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  pulse?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/20 backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <span className="relative">
          {icon}
          {pulse && (
            <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-emerald-400" />
          )}
        </span>
      </div>
      <p className={`mt-3 text-2xl font-bold tabular-nums ${accent}`}>{value}</p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
