import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8">
      <div className="flex items-center gap-4 bg-slate-100 px-3 py-1.5 rounded-md w-96">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search for IDP camps, CHWs, or records..." 
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-1.5 hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">Dr. Sarah K.</p>
            <p className="text-xs text-slate-500">UNICEF Coordinator</p>
          </div>
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};
