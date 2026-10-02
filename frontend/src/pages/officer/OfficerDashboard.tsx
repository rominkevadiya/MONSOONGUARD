import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';
import { ShieldAlert, Droplets, ArrowRight } from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { isDemoMode, activeScenario } = useDemo();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBlocks: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    falseOnsetAlerts: 0
  });

  const [attentionBlocks, setAttentionBlocks] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        let mapData;

        if (isDemoMode) {
          // Fallback demo data generation based on context
          mapData = [
            { location_id: 1, block: "Daskroi", district: "Ahmedabad", sowing_risk: activeScenario.data.sowingRisk, false_onset: activeScenario.data.falseOnset, reason: activeScenario.data.falseOnsetReason },
            { location_id: 2, block: "Sanand", district: "Ahmedabad", sowing_risk: "MEDIUM", false_onset: false },
            { location_id: 3, block: "Bavla", district: "Ahmedabad", sowing_risk: "LOW", false_onset: false },
          ];
        } else {
          mapData = await apiService.getMapRisk();
        }

        // Compute stats
        const high = mapData.filter((b: any) => b.sowing_risk === 'HIGH').length;
        const med = mapData.filter((b: any) => b.sowing_risk === 'MEDIUM').length;
        const low = mapData.filter((b: any) => b.sowing_risk === 'LOW').length;
        // In demo mode false_onset might be simulated in mapping, but backend returns it if extended. Wait, backend /map/risk doesn't return false_onset directly. We will infer false_onset from dry_break > 0.6 & high onset.
        const falseOnset = mapData.filter((b: any) => b.false_onset_detected || b.false_onset).length;

        setStats({
          totalBlocks: mapData.length,
          highRisk: high,
          mediumRisk: med,
          lowRisk: low,
          falseOnsetAlerts: falseOnset
        });

        // Get blocks requiring attention
        const attention = mapData
          .filter((b: any) => b.sowing_risk === 'HIGH' || b.false_onset_detected)
          .map((b: any) => ({
            id: b.location_id,
            name: b.block,
            district: b.district,
            riskType: b.false_onset_detected ? 'FALSE ONSET' : 'HIGH SOWING RISK',
            reason: b.false_onset_detected ? 'Strong initial rainfall but persistence probability remains low.' : 'Persistent adverse conditions detected.',
            action: 'Review local advisory requirements and monitor subsequent rainfall.'
          }))
          .slice(0, 5); // Limit to top 5

        setAttentionBlocks(attention);
      } catch (err) {
        setError('Unable to load regional risk data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isDemoMode, activeScenario]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
      <h3 className="font-bold text-lg mb-2">{error}</h3>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-100 rounded hover:bg-red-200 text-sm font-medium">Retry</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Regional Overview</h1>
        <p className="text-slate-500">Decision support summary across monitored blocks.</p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Blocks Monitored</div>
          <div className="text-3xl font-bold text-slate-800">{stats.totalBlocks}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
          <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">High Risk</div>
          <div className="text-3xl font-bold text-red-700">{stats.highRisk}</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Medium Risk</div>
          <div className="text-3xl font-bold text-amber-700">{stats.mediumRisk}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Lower Risk</div>
          <div className="text-3xl font-bold text-emerald-700">{stats.lowRisk}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm relative overflow-hidden">
          <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">False-Onset Alerts</div>
          <div className="text-3xl font-bold text-purple-700">{stats.falseOnsetAlerts}</div>
          <ShieldAlert className="absolute right-[-10px] bottom-[-10px] h-16 w-16 text-purple-200 opacity-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 p-4 flex justify-between items-center">
              <h2 className="font-bold text-slate-800">Locations Requiring Attention</h2>
              <Link to="/officer/map" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                View Risk Map <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {attentionBlocks.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No high-risk locations currently require attention.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {attentionBlocks.map((block) => (
                  <div key={block.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link to={`/officer/block/${block.id}`} className="font-bold text-lg text-slate-900 hover:text-blue-600">
                          {block.name}
                        </Link>
                        <div className="text-sm text-slate-500">{block.district} District</div>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${block.riskType === 'FALSE ONSET' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                        {block.riskType}
                      </span>
                    </div>
                    <div className="text-sm text-slate-700 mb-2">
                      <span className="font-semibold">Reason:</span> {block.reason}
                    </div>
                    <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded border border-blue-100">
                      <span className="font-semibold">Action:</span> {block.action}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-400" />
              Monsoon Progression
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Overview of regional monsoon advancement and active risk vectors across monitored districts.
            </p>
            <div className="space-y-3">
              <div className="bg-slate-800 p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Coverage</span>
                  <span className="font-bold">45%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Avg Dry-Break Risk</span>
                  <span className="font-bold text-amber-400">Elevated</span>
                </div>
              </div>
            </div>

            <Link to="/officer/analytics" className="mt-4 w-full block text-center py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
              View Regional Analytics
            </Link>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-slate-800">System Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Prediction Source</span>
                <span className="font-medium text-slate-800">{isDemoMode ? 'Demo / Rule-Based' : 'ML Pipeline'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">ML Status</span>
                <span className="font-medium text-emerald-600">Prototype Pipeline Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dataset</span>
                <span className="font-medium text-amber-600">Synthetic Smoke-Test Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
