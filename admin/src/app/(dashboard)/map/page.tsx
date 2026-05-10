"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchZoneMap } from "@/lib/celoDataService";
import { MapPin, Users, ShieldCheck, AlertCircle } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiYml0aGVhdCIsImEiOiJjbHcxbWN3Ym0wMDByMmtvNXN3YmN3YmN3In0.fake-token";

export default function MapPage() {
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [selectedCamp, setSelectedCamp] = useState<any>(null);

  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [8.6753, 9.0820], // Nigeria
      zoom: 5.5,
    });

    map.current.on("load", async () => {
      const data: any = await fetchZoneMap();
      
      map.current.addSource("camps", {
        type: "geojson",
        data: data
      });

      map.current.addLayer({
        id: "camp-circles",
        type: "circle",
        source: "camps",
        paint: {
          "circle-radius": [
            "interpolate", ["linear"], ["get", "population"],
            1000, 8,
            5000, 20
          ],
          "circle-color": [
            "match", ["get", "risk"],
            "low", "#10B981",
            "medium", "#F59E0B",
            "high", "#EF4444",
            "#6B7280"
          ],
          "circle-opacity": 0.7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff"
        }
      });

      map.current.on("click", "camp-circles", (e: any) => {
        const props = e.features[0].properties;
        setSelectedCamp(props);
      });

      map.current.on("mouseenter", "camp-circles", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "camp-circles", () => {
        map.current.getCanvas().style.cursor = "";
      });
    });
  }, []);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Health Risk Map</h1>
          <p className="text-slate-500">Geospatial distribution of vaccination coverage and patient clusters.</p>
        </div>
      </div>

      <div className="flex-1 relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Legend */}
        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-lg space-y-3">
          <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Risk Levels</p>
          <div className="space-y-2">
            <LegendItem color="bg-emerald-500" label="Low (< 40% Unvax)" />
            <LegendItem color="bg-amber-500" label="Medium (40-70% Unvax)" />
            <LegendItem color="bg-red-500" label="High (> 70% Unvax)" />
          </div>
        </div>

        {/* Slide-over Detail */}
        {selectedCamp && (
          <div className="absolute top-8 right-8 w-80 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-heading font-bold text-slate-900">{selectedCamp.name}</h2>
              <button onClick={() => setSelectedCamp(null)} className="text-slate-400 hover:text-slate-600">
                <AlertCircle className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-6">
              <StatItem icon={Users} label="Camp Population" value={selectedCamp.population.toLocaleString()} />
              <StatItem icon={ShieldCheck} label="Vaccination Coverage" value={`${selectedCamp.coverage}%`} color="text-emerald-600" />
              <StatItem icon={MapPin} label="Coordinates" value="13.15, 11.83" />
              
              <div className="pt-4 border-t border-slate-100">
                 <p className="text-xs font-bold text-slate-400 uppercase mb-3">Status</p>
                 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                   selectedCamp.risk === 'low' ? 'bg-emerald-50 text-emerald-700' : 
                   selectedCamp.risk === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                 }`}>
                   <span className={`w-2 h-2 rounded-full ${
                     selectedCamp.risk === 'low' ? 'bg-emerald-500' : 
                     selectedCamp.risk === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                   }`} />
                   {selectedCamp.risk.toUpperCase()} RISK
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color = "text-slate-900" }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
