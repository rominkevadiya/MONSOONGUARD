import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { ArrowLeft, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdvisoryPage: React.FC = () => {
  const { activeScenario, location, crop, stage } = useDemo();
  const risk = activeScenario.data.sowingRisk;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/farmer" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Crop Advisory</h1>
          <p className="text-slate-500">Actionable guidance based on local risks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">CROP</div>
          <div className="text-lg font-bold text-slate-900">{crop}</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">STAGE</div>
          <div className="text-lg font-bold text-slate-900">{stage}</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">OVERALL RISK</div>
          <div className={`text-lg font-bold ${risk === 'HIGH' ? 'text-red-600' : risk === 'MEDIUM' ? 'text-amber-600' : 'text-brand-600'}`}>
            {risk}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-slate-500" />
            <h2 className="font-bold text-slate-800">BEFORE SOWING</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Monitor persistence confirmation over the next 48 hours.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Avoid immediate sowing if rainfall breaks or shows signs of weakening.</span>
              </li>
              <li className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Check official local agricultural advisory for {location.district} district.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-slate-500" />
            <h2 className="font-bold text-slate-800">AFTER INITIAL RAIN</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Monitor rainfall continuity to ensure soil moisture reaches required depth for {crop}.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Monitor dry-break probability carefully if sowing has already occurred.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-slate-500" />
            <h2 className="font-bold text-slate-800">DURING CROP GROWTH</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Track localized rainfall risk via the dashboard on a weekly basis.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">Re-evaluate risk after significant weather events or prolonged dry spells.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
