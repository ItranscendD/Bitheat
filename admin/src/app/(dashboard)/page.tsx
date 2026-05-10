"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Syringe, 
  UserCheck, 
  RefreshCcw,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const data = [
  { name: "Day 1", coverage: 40 },
  { name: "Day 5", coverage: 45 },
  { name: "Day 10", coverage: 52 },
  { name: "Day 15", coverage: 61 },
  { name: "Day 20", coverage: 75 },
  { name: "Day 25", coverage: 82 },
  { name: "Today", coverage: 85 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Health Overview</h1>
        <p className="text-slate-500">Real-time vaccination and child health metrics across Nigeria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Children" value="1,240" icon={Users} color="text-indigo-600" />
        <KpiCard title="Vaccinations" value="3,852" icon={Syringe} color="text-emerald-600" />
        <KpiCard title="Active CHWs" value="42" icon={UserCheck} color="text-amber-600" />
        <KpiCard title="Pending Syncs" value="15" icon={RefreshCcw} color="text-slate-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-heading">Vaccination Coverage Trend</CardTitle>
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% this month</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="coverage" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertItem camp="Adamawa Cluster" type="Measles Surge" severity="critical" time="2h ago" />
            <AlertItem camp="Borno Sector 4" type="Low Coverage" severity="warning" time="5h ago" />
            <AlertItem camp="Maiduguri A" type="System Sync Delay" severity="info" time="1d ago" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AlertItem({ camp, type, severity, time }: any) {
  const colors: any = {
    critical: "bg-red-50 text-red-700 border-red-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    info: "bg-blue-50 text-blue-700 border-blue-100"
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[severity]} space-y-1`}>
      <div className="flex items-center justify-between">
        <p className="font-bold text-sm">{type}</p>
        <span className="text-[10px] uppercase font-black opacity-60">{time}</span>
      </div>
      <p className="text-xs opacity-80">{camp}</p>
    </div>
  );
}
