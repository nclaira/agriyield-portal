'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, AlertTriangle, Gauge, Activity, Sprout, Warehouse } from 'lucide-react';
import type { DistrictRisk } from '@/lib/district-risk.data';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-slate-500">
      Loading map…
    </div>
  ),
});

type Filter = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';
const FILTERS: Filter[] = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

const filterActive: Record<Filter, string> = {
  ALL:    'border-cyan-400/70 bg-cyan-400/10 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.25)]',
  HIGH:   'border-red-500/60 bg-red-500/10 text-red-300',
  MEDIUM: 'border-amber-400/60 bg-amber-400/10 text-amber-300',
  LOW:    'border-emerald-400/60 bg-emerald-400/10 text-emerald-300',
};

function scoreBadge(score: number) {
  if (score > 70) return 'border-red-500/60 bg-red-500/10 text-red-400 ring-1 ring-red-500/30';
  if (score > 50) return 'border-amber-400/60 bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/30';
  return 'border-emerald-400/60 bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/30';
}

export default function Dashboard() {
  const [riskData, setRiskData] = useState<DistrictRisk[]>([]);
  const [filter, setFilter]     = useState<Filter>('ALL');

  useEffect(() => {
    fetch('/api/district-risk')
      .then((r) => r.json())
      .then((r) => setRiskData(r.data ?? []));
  }, []);

  const filtered = useMemo(
    () => (filter === 'ALL' ? riskData : riskData.filter((d) => d.riskCategory === filter)),
    [riskData, filter],
  );

  const highCount = riskData.filter((d) => d.riskCategory === 'HIGH').length;
  const avgRisk   = riskData.length
    ? Math.round(riskData.reduce((s, d) => s + d.riskScore, 0) / riskData.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200">

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#0a0f1a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-400">
              AgriYield Portal
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Post-Harvest Risk Intelligence &amp; Geospatial Analytics
            </p>
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="Risk filter">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                  filter === f
                    ? filterActive[f]
                    : 'border-slate-700/60 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-6 py-6">

        {/* KPI Cards */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-xl border border-slate-800/80 bg-[#0f172a] p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Districts</span>
              <MapPin className="h-5 w-5 text-sky-400" />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-sky-400">{riskData.length || '—'}</p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-[#0f172a] p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">High Risk Zones</span>
              <AlertTriangle className="h-5 w-5 text-rose-500" />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-rose-500">{riskData.length ? highCount : '—'}</p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-[#0f172a] p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Avg Risk Score</span>
              <Gauge className="h-5 w-5 text-amber-400" />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-amber-400">{riskData.length ? avgRisk : '—'}</p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-[#0f172a] p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">System Status</span>
              <span className="flex items-center gap-1.5">
                <Activity className="h-5 w-5 text-emerald-400" />
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
              </span>
            </div>
            <p className="mt-3 text-xl font-bold text-emerald-400">Engine Online</p>
          </div>

        </section>

        {/* Map + Sidebar */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="flex h-[560px] flex-col overflow-hidden rounded-xl border border-slate-800/80 bg-[#0f172a] shadow-xl shadow-black/40">
              <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-800/80 px-5 py-3">
                <h2 className="text-sm font-semibold text-white">District Risk Map — Rwanda</h2>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <LegendDot color="bg-red-500"     label="High" />
                  <LegendDot color="bg-amber-400"   label="Medium" />
                  <LegendDot color="bg-emerald-400" label="Low" />
                </div>
              </div>
              <div className="relative flex-1">
                <MapComponent riskData={filtered} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex h-[560px] flex-col overflow-hidden rounded-xl border border-slate-800/80 bg-[#0f172a] shadow-xl shadow-black/40">
            <div className="flex-shrink-0 border-b border-slate-800/80 px-5 py-3">
              <h2 className="text-sm font-semibold text-white">District Risk Register</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {filtered.length} of {riskData.length} districts shown
              </p>
            </div>
            <ul className="flex-1 divide-y divide-slate-800/60 overflow-y-auto">
              {filtered.map((d) => (
                <li key={d.district} className="px-4 py-3.5 transition-colors hover:bg-slate-800/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold leading-tight text-white">{d.district}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{d.province} Province</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Sprout className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                          {d.crop} · {d.yieldTonnes.toLocaleString()} t
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Warehouse className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                          {d.storageCapacityTonnes.toLocaleString()} t
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex flex-shrink-0 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${scoreBadge(d.riskScore)}`}>
                      {d.riskScore}
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

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
