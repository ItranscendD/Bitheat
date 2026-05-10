"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle,
  Calendar,
  Globe,
  Activity
} from "lucide-react";

const templates = [
  { id: "unicef", name: "UNICEF Venture Fund Progress", icon: Globe, color: "text-blue-600" },
  { id: "who", name: "WHO EPI Coverage Report", icon: Activity, color: "text-emerald-600" },
  { id: "ncdc", name: "NCDC Nigeria Surveillance", icon: ShieldAlert, color: "text-red-600" },
];

function ShieldAlert(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  )
}

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Compliance Reports</h1>
        <p className="text-slate-500">Generate blockchain-verifiable health reports for international agencies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select Template</h2>
          {templates.map((t) => (
            <Card key={t.id} className="cursor-pointer hover:border-primary transition-all group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-slate-50 ${t.color}`}>
                  <t.icon className="w-6 h-6" />
                </div>
                <BitheatText className="font-bold text-sm group-hover:text-primary transition-colors">{t.name}</BitheatText>
              </CardContent>
            </Card>
          ))}
          
          <Card className="shadow-sm border-slate-200">
             <CardHeader>
               <CardTitle className="text-sm font-bold">Report Filters</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-2">
                   <p className="text-xs font-medium text-slate-500">Date Range</p>
                   <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                      <span className="text-sm font-bold">May 2024</span>
                      <Calendar className="w-4 h-4 text-slate-400" />
                   </div>
                </div>
                <div className="space-y-2">
                   <p className="text-xs font-medium text-slate-500">Zone Scope</p>
                   <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                      <span className="text-sm font-bold">All Zones</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                   </div>
                </div>
                <button className="w-100 bg-primary text-white font-bold py-3 rounded-xl mt-4 w-full">
                   Generate Preview
                </button>
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
           <Card className="min-h-[600px] shadow-xl border-slate-200 flex flex-col">
              <CardHeader className="border-b border-slate-100">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-heading">Report Preview</CardTitle>
                    <div className="flex gap-2">
                       <button className="p-2 text-slate-400 hover:text-slate-600">
                          <Printer className="w-5 h-5" />
                       </button>
                       <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold">
                          <Download className="w-4 h-4" />
                          <span>Export PDF</span>
                       </button>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="flex-1 p-12 bg-slate-50/30">
                 <div className="max-w-2xl mx-auto bg-white shadow-sm border border-slate-100 p-12 space-y-8 rounded-sm">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-[10px] font-black text-primary uppercase mb-1 tracking-widest">Confidential Report</p>
                          <h3 className="text-2xl font-heading font-black">UNICEF Progress V1.0</h3>
                       </div>
                       <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded text-[10px] font-black uppercase">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified by Celo</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-100">
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Reporting Period</p>
                          <p className="text-sm font-bold">01 May 2024 - 31 May 2024</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Aggregation Level</p>
                          <p className="text-sm font-bold">National (Nigeria)</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-xs font-bold text-slate-900 uppercase">Executive Summary</p>
                       <p className="text-sm text-slate-600 leading-relaxed">
                          The Bitheat decentralized health ledger recorded a total of <strong>3,852 vaccination events</strong> in the reporting period. Overall coverage in the Adamawa and Borno clusters has increased by 12.5%, surpassing the Phase 2 pilot target.
                       </p>
                    </div>

                    <div className="space-y-4 pt-8">
                       <p className="text-xs font-bold text-slate-900 uppercase">Verifiable Integrity</p>
                       <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                          <p className="text-[10px] font-mono text-slate-400">Blockchain Hash</p>
                          <p className="text-[10px] font-mono break-all text-slate-600">0x7d2f4b9e1a8c3d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f</p>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

function BitheatText({ children, className }: any) {
  return <span className={className}>{children}</span>;
}

function ChevronDown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
