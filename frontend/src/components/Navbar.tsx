import React from 'react';
import { Link } from 'react-router-dom';
import { CloudRain, Bell, User, MapPin, Globe } from 'lucide-react';
import { useDemo } from '../context/DemoContext';
import { useLanguage } from '../i18n';
import type { Language } from '../i18n';

export const Navbar: React.FC = () => {
  const { isDemoMode, setIsDemoMode, apiAvailable, scenarios, activeScenario, setActiveScenario, location } = useDemo();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <CloudRain className="h-8 w-8 text-brand-600" />
              <span className="font-bold text-xl text-slate-900 tracking-tight">{t('landing.title')}</span>
            </Link>
            
            <div className="ml-6 flex items-center gap-2">
              {apiAvailable && (
                <button 
                  onClick={() => setIsDemoMode(!isDemoMode)}
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${isDemoMode ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-brand-100 text-brand-700 border-brand-200'}`}
                >
                  {isDemoMode ? 'USE API' : 'API ACTIVE'}
                </button>
              )}
              
              {isDemoMode && (
                <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  <span className="text-xs font-bold text-amber-800 uppercase mr-2 hidden md:inline">Demo Mode</span>
                  <select 
                    className="text-xs bg-transparent text-amber-900 font-medium outline-none cursor-pointer"
                    value={activeScenario.id}
                    onChange={(e) => setActiveScenario(scenarios.find(s => s.id === e.target.value) || scenarios[0])}
                  >
                    {scenarios.map(s => (
                      <option key={s.id} value={s.id}>{t(`demo.${s.id}`)}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              <Globe className="h-4 w-4 text-slate-500 mr-2" />
              <select 
                className="text-sm bg-transparent text-slate-700 font-medium outline-none cursor-pointer"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                <option value="en">English</option>
                <option value="gu">ગુજરાતી</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>

            <div className="hidden md:flex items-center gap-1 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
              <MapPin className="h-4 w-4" />
              <span>{location.name}, {location.block}</span>
            </div>
            
            <button className="p-2 text-slate-400 hover:text-slate-500 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-500 bg-slate-100 rounded-full">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
