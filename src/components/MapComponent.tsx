'use client';

import { useEffect, useRef } from 'react';
import type { DistrictRisk } from '@/lib/district-risk.data';

const CATEGORY_COLOR: Record<DistrictRisk['riskCategory'], string> = {
  HIGH:   '#ef4444',
  MEDIUM: '#f59e0b',
  LOW:    '#10b981',
};

export default function MapComponent({ riskData }: { riskData: DistrictRisk[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<import('leaflet').Map | null>(null);
  const layerRef     = useRef<import('leaflet').LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [-2.05, 29.9],
        zoom: 9,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles &copy; Esri', maxZoom: 16 },
      ).addTo(map);

      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current   = map;
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current   = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import('leaflet');
      if (cancelled || !layerRef.current) return;
      layerRef.current.clearLayers();
      for (const d of riskData) {
        const color = CATEGORY_COLOR[d.riskCategory];
        const gap   = Math.max(0, d.yieldTonnes - d.storageCapacityTonnes);
        L.circleMarker([d.lat, d.lng], {
          radius: 8 + d.riskScore / 8,
          color, weight: 2, fillColor: color, fillOpacity: 0.35,
        }).bindPopup(
          `<div style="font-family:ui-sans-serif,system-ui;min-width:180px;color:#e2e8f0">
            <strong style="font-size:14px;color:#fff">${d.district}</strong>
            <div style="margin-top:4px;color:#94a3b8;font-size:12px">${d.province} Province &middot; ${d.crop}</div>
            <div style="margin-top:8px;font-size:12px">Yield: <b style="color:#fff">${d.yieldTonnes.toLocaleString()} t</b></div>
            <div style="font-size:12px">Storage: <b style="color:#fff">${d.storageCapacityTonnes.toLocaleString()} t</b></div>
            <div style="font-size:12px">Gap: <b style="color:${color}">${gap.toLocaleString()} t</b></div>
            <div style="margin-top:6px;font-size:12px">Risk: <b style="color:${color}">${d.riskScore} &mdash; ${d.riskCategory}</b></div>
          </div>`,
        ).addTo(layerRef.current);
      }
    })();
    return () => { cancelled = true; };
  }, [riskData]);

  return <div ref={containerRef} className="h-full w-full" style={{ background: '#0f172a' }} />;
}
