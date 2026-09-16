'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

interface RiskData {
  district: string;
  riskScore: number;
  riskCategory: string;
  crop: string;
}

function SetBounds({ geoJsonData }: { geoJsonData: any }) {
  const map = useMap();
  useEffect(() => {
    if (geoJsonData && map) {
      const geoJsonLayer = L.geoJSON(geoJsonData);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [geoJsonData, map]);
  return null;
}

export default function MapComponent({ riskData }: { riskData: RiskData[] }) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    fetch('/data/rwanda-districts.geojson')
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
      .catch((err) => console.error('GeoJSON load error:', err));
  }, []);

  const getDistrictColor = (districtName: string) => {
    const match = riskData.find((d) => d.district.toLowerCase() === districtName.toLowerCase());
    if (!match) return '#cbd5e1';
    if (match.riskCategory === 'HIGH') return '#ef4444';
    if (match.riskCategory === 'MEDIUM') return '#f59e0b';
    return '#10b981';
  };

  const styleFeature = (feature: any) => {
    const name = feature.properties.ADM2_EN || feature.properties.name || '';
    return {
      fillColor: getDistrictColor(name),
      weight: 1.5,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const name = feature.properties.ADM2_EN || feature.properties.name || 'Unknown District';
    const match = riskData.find((d) => d.district.toLowerCase() === name.toLowerCase());
    
    const tooltipContent = match
      ? `<strong>${name}</strong><br/>Crop: ${match.crop}<br/>Risk: ${match.riskScore} (${match.riskCategory})`
      : `<strong>${name}</strong><br/>No SAS Data Available`;

    layer.bindTooltip(tooltipContent, { sticky: true });
  };

  if (!geoJsonData) return <div className="p-4 text-slate-500">Loading geospatial layers...</div>;

  return (
    <div className="h-[550px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
      <MapContainer 
        center={[-1.9403, 29.8739]} 
        zoom={9} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <GeoJSON data={geoJsonData} style={styleFeature} onEachFeature={onEachFeature} />
        <SetBounds geoJsonData={geoJsonData} />
      </MapContainer>
    </div>
  );
}