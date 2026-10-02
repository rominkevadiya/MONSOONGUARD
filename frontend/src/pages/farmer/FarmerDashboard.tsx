import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { RiskCard } from '../../components/RiskCard';
import { CloudRain, Droplets, CloudLightning, Sprout, ArrowRight, AlertOctagon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FarmerDashboard: React.FC = () => {
  const { activeScenario, location } = useDemo();
  const data = activeScenario.data;

  // Determine styles for main status based on false onset
  const statusBg = data.falseOnset ? 'bg-red-50 border-red-200' : 'bg-brand-50 border-brand-200';
  const statusText = data.falseOnset ? 'text-red-800' : 'text-brand-800';
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Farm Overview</h1>
          <p className="text-slate-500">{location.name}, {location.block}</p>
        </div>
        <Link to="/farmer/location" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Change Location
        </Link>
      </div>

      {/* Main Status */}
      <div className={`p-6 rounded-2xl border shadow-sm ${statusBg}`}>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-80">Monsoon Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-4xl font-extrabold mb-1">{data.onsetProb}%</div>
            <div className="text-sm font-medium opacity-80">Onset Probability</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold mb-1">{data.persistenceProb}%</div>
            <div className="text-sm font-medium opacity-80">Persistence Probability</div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
            Confidence: <span className="font-bold">{data.sowingRisk === 'HIGH' ? 'High' : 'Medium'}</span>
          </div>
          <div className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
            Forecast Horizon: <span className="font-bold">7 days</span>
          </div>
        </div>

        {data.falseOnset ? (
          <div className={`p-4 rounded-lg bg-red-100 ${statusText} flex items-start gap-3`}>
            <AlertOctagon className="h-6 w-6 shrink-0" />
            <div>
              <p className="font-bold">False-Onset Warning</p>
              <p className="text-sm mt-1">{data.falseOnsetReason}</p>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-lg bg-white/60 ${statusText}`}>
            <p className="font-medium">
              Onset-like rainfall detected — persistence still being evaluated.
            </p>
          </div>
        )}
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <RiskCard 
          title="Onset" 
          value={data.onsetProb} 
          isPercentage 
          level={data.onsetProb > 70 ? 'LOW' : 'HIGH'} 
          icon={CloudRain} 
        />
        <RiskCard 
          title="Dry-Break" 
          value={data.drySpell7Prob} 
          isPercentage 
          level={data.drySpell7Prob > 50 ? 'HIGH' : data.drySpell7Prob > 30 ? 'MEDIUM' : 'LOW'} 
          icon={Droplets} 
        />
        <RiskCard 
          title="Heavy Rain" 
          value={data.heavyRainProb} 
          isPercentage 
          level={data.heavyRainProb > 50 ? 'HIGH' : data.heavyRainProb > 30 ? 'MEDIUM' : 'LOW'} 
          icon={CloudLightning} 
        />
        <RiskCard 
          title="Sowing" 
          value={data.sowingRisk} 
          level={data.sowingRisk} 
          icon={Sprout} 
        />
      </div>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/farmer/advisory" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg group-hover:bg-brand-100 transition-colors">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Crop Advisory</h3>
              <p className="text-sm text-slate-500">Actionable guidance</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-brand-500" />
        </Link>
        <Link to="/farmer/analysis" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
              <CloudRain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Rainfall Analysis</h3>
              <p className="text-sm text-slate-500">Historical & trends</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-brand-500" />
        </Link>
      </div>

      {/* Sowing Window */}
      <div className={`border rounded-2xl p-6 shadow-sm ${data.sowingRisk === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
        <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${data.sowingRisk === 'HIGH' ? 'text-red-700' : 'text-slate-500'}`}>Potential Sowing Window</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {data.sowingRisk === 'HIGH' ? (
              <div className="text-2xl font-bold text-red-600">Wait for stronger persistence</div>
            ) : (
              <div className="text-2xl font-bold text-slate-900">18 June — 23 June</div>
            )}
            <div className="text-sm text-slate-500 mt-1">
              {data.sowingRisk === 'HIGH' 
                ? "Current risk is too high for safe crop establishment."
                : "Potential lower-risk window based on 7-day persistence forecast."}
            </div>
          </div>
          
          <Link 
            to="/farmer/sowing"
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Sowing Decision
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Why it matters */}
      <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-2">Why This Matters</h3>
        <p className="text-slate-600 mb-4 text-sm leading-relaxed">
          Initial rainfall does not automatically confirm sustained monsoon conditions. Sowing too early without persistence increases the risk of seed mortality during dry breaks.
        </p>
        <Link to="/farmer/sowing" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
          View Decision Reasoning <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  );
};
