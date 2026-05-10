"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

const alerts = [
  { id: 1, camp: "Adamawa Cluster", type: "Measles Surge", severity: "critical", time: "2h ago", status: "new" },
  { id: 2, camp: "Borno Sector 4", type: "Low Coverage Alert", severity: "high", time: "5h ago", status: "acknowledged" },
  { id: 3, camp: "Maiduguri A", type: "System Sync Delay", severity: "medium", time: "1d ago", status: "resolved" },
  { id: 4, camp: "Yobe East", type: "Malaria Spike", severity: "high", time: "2d ago", status: "new" },
];

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Active Alerts</h1>
          <p className="text-slate-500">Real-time epidemiological and system-level surge detections.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-100">
           <ShieldAlert className="w-5 h-5" />
           <span className="font-bold">2 Critical Alerts</span>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="shadow-sm border-slate-200 overflow-hidden group hover:border-primary transition-all">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className={`w-2 h-20 ${
                  alert.severity === 'critical' ? 'bg-red-500' : 
                  alert.severity === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                
                <div className="flex-1 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`p-3 rounded-2xl ${
                      alert.severity === 'critical' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading font-bold text-lg text-slate-900">{alert.type}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          alert.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                          alert.status === 'acknowledged' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-slate-500 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.camp}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors">
                      Acknowledge
                    </button>
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
