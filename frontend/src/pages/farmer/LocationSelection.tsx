import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { demoLocations } from '../../data/demoData';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { useLanguage } from '../../i18n';

export const LocationSelection: React.FC = () => {
  const { location, setLocation } = useDemo();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSelect = (locId: string) => {
    const selected = demoLocations.find(l => l.id === locId);
    if (selected) {
      setLocation(selected);
      navigate('/farmer');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('common.selectLocation')}</h1>
        <p className="text-slate-500">{t('sowing.decisionSupport')}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search block or village..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Demo Locations</h2>
          
          {demoLocations.map(loc => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors ${
                location.id === loc.id 
                  ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${location.id === loc.id ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{loc.name}</div>
                  <div className="text-sm text-slate-500">{loc.block}, {loc.district}</div>
                </div>
              </div>
              
              {location.id === loc.id && (
                <div className="text-sm font-semibold text-brand-600">Selected</div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>Prototype Note:</strong> For the SIH demo, only a limited set of locations in Gujarat have synthetic deterministic data available.
      </div>
    </div>
  );
};
