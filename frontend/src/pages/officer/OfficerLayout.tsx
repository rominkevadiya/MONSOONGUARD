import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, AlertTriangle, BarChart3, Shield } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const OfficerLayout: React.FC = () => {
  const location = useLocation();
  const { isDemoMode, setIsDemoMode, apiAvailable } = useDemo();

  const links = [
    { to: "/officer", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/officer/map", label: "Risk Map", icon: MapIcon },
    { to: "/officer/alerts", label: "Alerts", icon: AlertTriangle },
    { to: "/officer/analytics", label: "Analytics", icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="font-bold text-xl tracking-tight">MonsoonGuard</span>
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Extension Officer</div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => {
            const isActive = link.exact 
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.to} 
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">Region</div>
            <div className="font-semibold mb-3">Gujarat</div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Mode</span>
              <button 
                onClick={() => setIsDemoMode(!isDemoMode)}
                disabled={!apiAvailable}
                className={`text-[10px] font-bold px-2 py-1 rounded border ${isDemoMode ? 'bg-amber-900/50 text-amber-400 border-amber-700' : 'bg-blue-900/50 text-blue-400 border-blue-700'}`}
              >
                {isDemoMode ? 'DEMO MODE' : 'API ACTIVE'}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
