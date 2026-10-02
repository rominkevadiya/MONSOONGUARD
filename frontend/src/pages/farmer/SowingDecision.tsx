import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Check, X, AlertTriangle, Info, Sprout, ArrowLeft, Droplets, CloudRain } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CropType, GrowthStage } from '../../types';

export const SowingDecision: React.FC = () => {
  const { activeScenario, location, crop, setCrop, stage, setStage } = useDemo();
  const data = activeScenario.data;
  const [showReasoning, setShowReasoning] = useState(false);

  const crops: CropType[] = ['Cotton', 'Groundnut', 'Maize', 'Millet', 'Soybean'];
  const stages: GrowthStage[] = ['Pre-sowing', 'Germination', 'Early growth', 'Vegetative', 'Flowering'];

  const getRiskColor = (risk: string) => {
    if (risk === 'LOW') return 'text-brand-600 bg-brand-50 border-brand-200';
    if (risk === 'MEDIUM') return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex items-center gap-4 mb-4">
        <Link to="/farmer" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Should I Sow Now?</h1>
          <p className="text-slate-500">{location.name} • Decision Support</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Crop Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Crop</label>
              <select 
                value={crop}
                onChange={(e) => setCrop(e.target.value as CropType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {crops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Growth Stage</label>
              <select 
                value={stage}
                onChange={(e) => setStage(e.target.value as GrowthStage)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Overall Recommendation */}
        <div className={`border rounded-2xl p-6 shadow-sm flex flex-col justify-center ${getRiskColor(data.sowingRisk)}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">Sowing Risk</h2>
            <Sprout className="h-6 w-6 opacity-80" />
          </div>
          
          <div className="text-4xl font-extrabold mb-2">{data.sowingRisk}</div>
          <p className="text-sm opacity-90 font-medium leading-relaxed">
            {data.sowingRisk === 'HIGH' && "Conditions are currently unfavorable for crop establishment."}
            {data.sowingRisk === 'MEDIUM' && "Exercise caution. Monitor persistence over the next 48 hours."}
            {data.sowingRisk === 'LOW' && "Favorable conditions for crop establishment detected."}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
         <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Risk Factors</h2>
         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
           {[
             { label: 'Initial Rain', val: data.onsetProb, icon: CloudRain },
             { label: 'Persistence', val: data.persistenceProb, icon: CloudRain },
             { label: '7D Dry Spell', val: data.drySpell7Prob, icon: Droplets },
             { label: '14D Dry Spell', val: data.drySpell14Prob, icon: Droplets },
             { label: 'Heavy Rain', val: data.heavyRainProb, icon: AlertTriangle }
           ].map((metric, i) => (
             <div key={i} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
               <metric.icon className="h-5 w-5 text-slate-400 mb-2" />
               <div className="text-xl font-bold text-slate-900">{metric.val}%</div>
               <div className="text-xs text-slate-500 font-medium">{metric.label}</div>
             </div>
           ))}
         </div>
      </div>

      {/* Recommended Window */}
      <div className={`rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${data.sowingRisk === 'HIGH' ? 'bg-red-50 border-2 border-red-200' : 'bg-brand-900 text-white'}`}>
        <div>
          <h2 className={`text-sm font-bold uppercase tracking-wider mb-1 ${data.sowingRisk === 'HIGH' ? 'text-red-700' : 'text-brand-300'}`}>Potential Sowing Window</h2>
          {data.sowingRisk === 'HIGH' ? (
            <div className="text-2xl font-bold text-red-700">Wait for stronger persistence</div>
          ) : (
            <div className="text-2xl font-bold text-white">18 June — 23 June</div>
          )}
        </div>
        <button 
          onClick={() => setShowReasoning(!showReasoning)}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${data.sowingRisk === 'HIGH' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-brand-700 text-white hover:bg-brand-600'}`}
        >
          <Info className="h-4 w-4" />
          Why?
        </button>
      </div>

      {/* Decision Reasoning Panel */}
      {showReasoning && (
        <div className="bg-white border-2 border-brand-200 rounded-2xl p-6 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-brand-600" />
            Why is the risk {data.sowingRisk}?
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-brand-100 text-brand-600 rounded-full p-1"><Check className="h-4 w-4" /></div>
              <p className="text-slate-700">Significant rainfall has been detected ({data.onsetProb}% onset probability).</p>
            </div>

            {data.persistenceProb < 65 ? (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-amber-100 text-amber-600 rounded-full p-1"><AlertTriangle className="h-4 w-4" /></div>
                <p className="text-slate-700">Persistence probability is only {data.persistenceProb}%.</p>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-brand-100 text-brand-600 rounded-full p-1"><Check className="h-4 w-4" /></div>
                <p className="text-slate-700">Strong persistence probability ({data.persistenceProb}%).</p>
              </div>
            )}

            {data.drySpell7Prob > 25 ? (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-amber-100 text-amber-600 rounded-full p-1"><AlertTriangle className="h-4 w-4" /></div>
                <p className="text-slate-700">There remains a {data.drySpell7Prob}% probability of a 7-day dry spell which could damage seedlings.</p>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-brand-100 text-brand-600 rounded-full p-1"><Check className="h-4 w-4" /></div>
                <p className="text-slate-700">Low risk of a 7-day dry spell ({data.drySpell7Prob}%).</p>
              </div>
            )}

            {data.heavyRainProb > 30 ? (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-red-100 text-red-600 rounded-full p-1"><X className="h-4 w-4" /></div>
                <p className="text-slate-700">High heavy rainfall risk ({data.heavyRainProb}%) could cause seed washout.</p>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-brand-100 text-brand-600 rounded-full p-1"><Check className="h-4 w-4" /></div>
                <p className="text-slate-700">Heavy rainfall risk is currently relatively low.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-slate-800 font-medium italic bg-slate-50 p-4 rounded-lg">
            "Monsoon onset-like conditions are present, but persistence is {data.persistenceProb < 65 ? 'not yet sufficiently confirmed for a low-risk' : 'confirmed for a safer'} sowing recommendation."
          </div>
        </div>
      )}

    </div>
  );
};
