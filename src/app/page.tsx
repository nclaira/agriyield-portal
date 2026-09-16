'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function Home() {
  const [riskData, setRiskData] = useState([]);

  useEffect(() => {
    fetch('/api/district-risk')
      .then((res) => res.json())
      .then((res) => setRiskData(res.data));
  }, []);

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">AgriYield Portal</h1>
      <p className="text-slate-600 mb-6">NISR Hackathon 2026 • Post-Harvest Risk Engine</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapComponent riskData={riskData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">District Overview</h2>
          <ul className="space-y-3">
            {riskData.map((item: any) => (
              <li key={item.district} className="flex justify-between items-center border-b pb-2">
                <div>
                  <span className="font-medium text-slate-700">{item.district}</span>
                  <span className="text-xs text-slate-400 block">{item.crop}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  item.riskCategory === 'HIGH' ? 'bg-red-100 text-red-700' :
                  item.riskCategory === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {item.riskScore} ({item.riskCategory})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}