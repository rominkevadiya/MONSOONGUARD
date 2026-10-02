import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { apiService } from '../../services/api';
import { ArrowLeft, AlertOctagon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BlockDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDemoMode, activeScenario } = useDemo();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [rainfallData, setRainfallData] = useState<any[]>([]);
  const [advisoryCache, setAdvisoryCache] = useState<Record<string, any>>({});

  const [selectedCrop, setSelectedCrop] = useState('Cotton');
  const [selectedStage, setSelectedStage] = useState('Pre-sowing');

  const CROPS = ["Cotton", "Groundnut", "Maize", "Millet", "Soybean"];
  const STAGES = ["Pre-sowing", "Germination", "Early growth", "Vegetative", "Flowering"];

  useEffect(() => {
    const loadBlockData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        if (isDemoMode) {
          setLocation({
            id: Number(id), village: "Demo Village", block: "Demo Block", district: "Demo District", state: "Gujarat", latitude: 22.0, longitude: 72.0
          });
          setRisk({
            onset: { probability: activeScenario.data.onsetProb / 100 },
            persistence: { probability: activeScenario.data.persistenceProb / 100 },
            dry_spell: { seven_day_probability: activeScenario.data.drySpell7Prob / 100, fourteen_day_probability: activeScenario.data.drySpell14Prob / 100 },
            heavy_rain: { probability: activeScenario.data.heavyRainProb / 100 },
            sowing: { risk: activeScenario.data.sowingRisk, confidence: "Medium" },
            false_onset: { detected: activeScenario.data.falseOnset, reason: activeScenario.data.falseOnsetReason },
            forecast_horizon_days: 7
          });
          setRainfallData([
            { date: "2026-06-14", rainfall_mm: 5 },
            { date: "2026-06-15", rainfall_mm: 45 },
            { date: "2026-06-16", rainfall_mm: 65 },
            { date: "2026-06-17", rainfall_mm: 12 },
            { date: "2026-06-18", rainfall_mm: 0 }
          ]);
        } else {
          // Fetch Location
          const locData = await apiService.getLocations();
          const targetLoc = locData.find((l: any) => l.id === Number(id));
          if (!targetLoc) throw new Error("Location not found");
          setLocation(targetLoc);

          // Fetch Risk
          const riskData = await apiService.getRisk(Number(id), selectedCrop);
          setRisk(riskData);

          // Fetch Rainfall
          const rain = await apiService.getRainfall(Number(id));
          setRainfallData(rain.reverse().map((r: any) => ({ date: r.date, rainfall_mm: r.rainfall_mm })));

          // Pre-fetch all crop base risks for matrix
        }
      } catch (err) {
        setError('Failed to load block data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBlockData();
  }, [id, isDemoMode, activeScenario, selectedCrop]);

  useEffect(() => {
    // Fetch advisory when crop/stage changes
    const loadAdvisory = async () => {
      if (!id || isDemoMode) return;
      const key = `${selectedCrop}-${selectedStage}`;
      if (advisoryCache[key]) return;

      try {
        const adv = await apiService.getAdvisory(Number(id), selectedCrop, selectedStage);
        setAdvisoryCache(prev => ({ ...prev, [key]: adv }));
      } catch (e) {
        console.error(e);
      }
    };
    loadAdvisory();
  }, [id, selectedCrop, selectedStage, isDemoMode]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error || !location || !risk) return <div className="text-red-500 font-bold p-4 bg-red-50 rounded-lg">{error || 'Data missing'}</div>;

  const currentAdvisory = advisoryCache[`${selectedCrop}-${selectedStage}`] || {
    risk_level: risk.sowing.risk,
    before_sowing: ["Check local advisory.", "Monitor moisture."],
    after_initial_rain: ["Track persistence."],
    during_crop_growth: ["Re-evaluate risk."]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <Link to="/officer/map" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Map
      </Link>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{location.block} Block Overview</h1>
          <p className="text-slate-500">{location.district} District • Lat: {location.latitude.toFixed(2)}, Lon: {location.longitude.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Current Sowing Risk</div>
          <div className={`inline-block px-4 py-1.5 rounded-lg font-bold text-lg ${risk.sowing.risk === 'HIGH' ? 'bg-red-100 text-red-700' : risk.sowing.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {risk.sowing.risk}
          </div>
        </div>
      </div>

      {/* False Onset Alert */}
      {risk.false_onset.detected && (
        <div className="bg-purple-100 border-l-4 border-purple-600 p-6 rounded-r-xl">
          <div className="flex items-start gap-4">
            <AlertOctagon className="h-8 w-8 text-purple-700 shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-purple-900 mb-1">FALSE-ONSET / DRY-BREAK RISK</h2>
              <p className="text-purple-800 font-medium mb-3">Onset-like rainfall has been detected, but persistence remains uncertain.</p>

              <div className="bg-white/60 p-4 rounded-lg mb-3">
                <p className="text-sm text-purple-900"><span className="font-bold">Reasoning:</span> {risk.false_onset.reason || 'Initial rainfall is strong but persistence probability is low.'}</p>
              </div>

              <h3 className="font-bold text-sm text-purple-900 mb-1">Why this matters:</h3>
              <p className="text-sm text-purple-800">Initial rainfall is not necessarily sufficient evidence of sustained monsoon conditions. Premature sowing may lead to crop failure if the subsequent dry spell exceeds seedling survivability.</p>
            </div>
          </div>
        </div>
      )}

      {!risk.false_onset.detected && (
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
          <p className="text-slate-600 font-medium flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-slate-400"></div>
            No false-onset condition currently detected.
          </p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-500 uppercase">Onset</div>
          <div className="text-2xl font-bold mt-1">{Math.round(risk.onset.probability * 100)}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-500 uppercase">Persistence</div>
          <div className="text-2xl font-bold mt-1">{Math.round(risk.persistence.probability * 100)}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-500 uppercase">7-Day Dry Spell</div>
          <div className="text-2xl font-bold mt-1 text-amber-600">{Math.round(risk.dry_spell.seven_day_probability * 100)}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-500 uppercase">14-Day Dry Spell</div>
          <div className="text-2xl font-bold mt-1">{Math.round(risk.dry_spell.fourteen_day_probability * 100)}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-500 uppercase">Heavy Rain</div>
          <div className="text-2xl font-bold mt-1 text-blue-600">{Math.round(risk.heavy_rain.probability * 100)}%</div>
        </div>
      </div>

      {/* Charts & Analytics */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Rainfall Analysis</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="rainfall_mm" name="Rainfall (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crop Matrix & Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Crop-Specific Matrix</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Crop</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-medium text-slate-700"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Growth Stage</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-medium text-slate-700"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase mb-2">Calculated Risk for Selection</div>
            <div className={`p-4 rounded-lg font-bold text-center border ${currentAdvisory.risk_level === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : currentAdvisory.risk_level === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              {currentAdvisory.risk_level}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 text-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-bold">Targeted Advisory</h2>
            <p className="text-slate-400 text-sm">Actionable guidance for {selectedCrop} during {selectedStage}</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Before Sowing</h3>
              <ul className="space-y-2">
                {currentAdvisory.before_sowing.map((item: string, i: number) => (
                  <li key={i} className="flex gap-3 text-slate-300"><span className="text-blue-500">•</span> {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">After Initial Rain</h3>
              <ul className="space-y-2">
                {currentAdvisory.after_initial_rain.map((item: string, i: number) => (
                  <li key={i} className="flex gap-3 text-slate-300"><span className="text-emerald-500">•</span> {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">During Crop Growth</h3>
              <ul className="space-y-2">
                {currentAdvisory.during_crop_growth.map((item: string, i: number) => (
                  <li key={i} className="flex gap-3 text-slate-300"><span className="text-purple-500">•</span> {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
