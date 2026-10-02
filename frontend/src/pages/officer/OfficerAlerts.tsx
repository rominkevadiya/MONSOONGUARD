import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { apiService } from '../../services/api';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OfficerAlerts: React.FC = () => {
  const { isDemoMode, activeScenario } = useDemo();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      try {
        let mapData;
        if (isDemoMode) {
          mapData = [
            { location_id: 1, block: "Daskroi", district: "Ahmedabad", sowing_risk: activeScenario.data.sowingRisk, onset_probability: activeScenario.data.onsetProb/100, dry_break_probability: activeScenario.data.drySpell7Prob/100, heavy_rain_probability: activeScenario.data.heavyRainProb/100 }
          ];
        } else {
          mapData = await apiService.getMapRisk();
        }

        const generatedAlerts: any[] = [];
        
        mapData.forEach((loc: any) => {
          if (loc.false_onset_detected) {
            generatedAlerts.push({
              id: `alert-fo-${loc.location_id}`,
              location_id: loc.location_id,
              block: loc.block,
              district: loc.district,
              type: 'FALSE ONSET',
              probability: Math.round(loc.dry_break_probability * 100),
              confidence: 'High',
              timestamp: new Date().toISOString(),
              status: 'New'
            });
          }
          
          if (loc.heavy_rain_probability > 0.7) {
            generatedAlerts.push({
              id: `alert-hr-${loc.location_id}`,
              location_id: loc.location_id,
              block: loc.block,
              district: loc.district,
              type: 'HIGH HEAVY-RAIN RISK',
              probability: Math.round(loc.heavy_rain_probability * 100),
              confidence: 'Medium',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              status: 'New'
            });
          }
          
          if (loc.sowing_risk === 'HIGH' && !loc.false_onset_detected) {
             generatedAlerts.push({
              id: `alert-sr-${loc.location_id}`,
              location_id: loc.location_id,
              block: loc.block,
              district: loc.district,
              type: 'HIGH SOWING RISK',
              probability: null, // Risk level rather than prob
              confidence: 'High',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              status: 'Reviewed'
            });
          }
        });
        
        setAlerts(generatedAlerts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    loadAlerts();
  }, [isDemoMode, activeScenario]);

  const markAsReviewed = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'Reviewed' } : a));
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Alerts</h1>
        <p className="text-slate-500">Automated risk detection requiring officer review.</p>
      </div>
      
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-slate-700">No active alerts</h3>
            <p className="text-slate-500">All monitored regions are within acceptable parameters.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`bg-white rounded-xl border shadow-sm flex flex-col md:flex-row overflow-hidden ${alert.status === 'New' ? 'border-l-4 border-l-red-500 border-t-slate-200 border-r-slate-200 border-b-slate-200' : 'border-slate-200 opacity-75'}`}>
              <div className="p-5 flex-1 flex items-start gap-4">
                <div className={`p-3 rounded-full mt-1 shrink-0 ${alert.type === 'FALSE ONSET' ? 'bg-purple-100 text-purple-600' : 'bg-red-100 text-red-600'}`}>
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${alert.type === 'FALSE ONSET' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                      {alert.type}
                    </span>
                    {alert.status === 'New' && (
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">NEW</span>
                    )}
                  </div>
                  
                  <Link to={`/officer/block/${alert.location_id}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 mb-1 block">
                    {alert.block}, {alert.district}
                  </Link>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    {alert.probability !== null && (
                      <span className="font-medium text-slate-800">Probability: {alert.probability}%</span>
                    )}
                    <span>Confidence: {alert.confidence}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-5 md:w-64 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between">
                <div className="flex items-center text-xs text-slate-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
                
                <div className="space-y-2">
                  <Link 
                    to={`/officer/block/${alert.location_id}`}
                    className="block w-full text-center border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                  >
                    View Details
                  </Link>
                  {alert.status === 'New' && (
                    <button 
                      onClick={() => markAsReviewed(alert.id)}
                      className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Mark Reviewed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
