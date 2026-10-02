import React from 'react';
import { Link } from 'react-router-dom';
import { CloudRain, Sprout, Map, AlertTriangle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto">
      <div className="bg-brand-100 text-brand-700 px-4 py-1 rounded-full text-sm font-semibold mb-6 uppercase tracking-wider">
        SIH 2026 Prototype
      </div>
      
      <CloudRain className="h-20 w-20 text-brand-600 mb-6" />
      
      <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
        From First Rain to <span className="text-brand-600">Safer Sowing Decisions</span>
      </h1>
      
      <p className="text-xl text-slate-600 mb-10 max-w-2xl">
        Hyperlocal, probability-based monsoon persistence and crop establishment decision support system.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Link 
          to="/farmer" 
          className="flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Sprout className="h-5 w-5" />
          Explore Farmer Dashboard
        </Link>
        <Link 
          to="/officer" 
          className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Map className="h-5 w-5" />
          View Officer Dashboard
        </Link>
      </div>

      <div className="w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500">
          <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">1</div><span>Initial Rain</span></div>
          <div className="hidden md:block h-px w-10 bg-slate-200"></div>
          <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">2</div><span>Persistence Risk</span></div>
          <div className="hidden md:block h-px w-10 bg-slate-200"></div>
          <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">3</div><span>False-Onset Check</span></div>
          <div className="hidden md:block h-px w-10 bg-slate-200"></div>
          <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">4</div><span>Sowing Window</span></div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-100 px-4 py-3 rounded-lg w-full">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
        <p className="text-left">
          <strong>Disclaimer:</strong> MonsoonGuard is a decision-support prototype and does not replace official weather forecasts or agricultural advisories.
        </p>
      </div>
    </div>
  );
};
