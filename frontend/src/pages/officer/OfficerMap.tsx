import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useDemo } from '../../context/DemoContext';
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';

export const OfficerMap: React.FC = () => {
  const { isDemoMode, activeScenario } = useDemo();
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [riskFilter, setRiskFilter] = useState('All');
  const [cropFilter, setCropFilter] = useState('Cotton');

  useEffect(() => {
    const loadMapData = async () => {
      setLoading(true);
      try {
        if (isDemoMode) {
          // Synthetic demo data based on Farmer Demo Mode context
          setLocations([
            {
              location_id: 1, district: "Ahmedabad", block: "Daskroi", village: "Jetalpur", latitude: 22.8833, longitude: 72.5833,
              sowing_risk: activeScenario.data.sowingRisk, onset_probability: activeScenario.data.onsetProb / 100,
              persistence_probability: activeScenario.data.persistenceProb / 100, dry_break_probability: activeScenario.data.drySpell7Prob / 100, heavy_rain_probability: activeScenario.data.heavyRainProb / 100,
            },
            {
              location_id: 2, district: "Ahmedabad", block: "Sanand", village: "Sanand", latitude: 22.9833, longitude: 72.3833,
              sowing_risk: "MEDIUM", onset_probability: 0.82, persistence_probability: 0.61, dry_break_probability: 0.28, heavy_rain_probability: 0.18,
            },
            {
              location_id: 3, district: "Ahmedabad", block: "Bavla", village: "Bavla", latitude: 22.8333, longitude: 72.3667,
              sowing_risk: "LOW", onset_probability: 0.95, persistence_probability: 0.90, dry_break_probability: 0.05, heavy_rain_probability: 0.85,
            }
          ]);
        } else {
          // Fetch map risk from backend, which automatically handles all locations
          // Note: map risk from backend defaults to Cotton.
          // To implement crop filter properly in API mode, we might need a ?crop= query param in backend.
          // For now, we will use the existing `/api/map/risk` which uses Cotton.
          const data = await apiService.getMapRisk();
          setLocations(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadMapData();
  }, [isDemoMode, activeScenario, cropFilter]);

  const getRiskColor = (risk: string) => {
    if (risk === 'HIGH') return '#ef4444'; // red-500
    if (risk === 'MEDIUM') return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };
  
  const filteredLocations = locations.filter(loc => {
    if (riskFilter === 'All') return true;
    if (riskFilter === 'False Onset') return loc.false_onset_detected;
    if (riskFilter === 'Dry Break') return loc.dry_break_probability > 0.5;
    if (riskFilter === 'Heavy Rain') return loc.heavy_rain_probability > 0.3;
    if (riskFilter === 'High Sowing Risk') return loc.sowing_risk === 'HIGH';
    return true;
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Regional Risk Map</h1>
          <p className="text-sm text-slate-500">Geospatial overview of monsoon progression and risks.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 outline-none"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="All">All Risks</option>
            <option value="False Onset">False Onset</option>
            <option value="High Sowing Risk">High Sowing Risk</option>
            <option value="Dry Break">Dry Break</option>
            <option value="Heavy Rain">Heavy Rain</option>
          </select>
          <select 
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 outline-none"
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
          >
            <option value="Cotton">Cotton</option>
            <option value="Groundnut">Groundnut</option>
            <option value="Maize">Maize</option>
            <option value="Millet">Millet</option>
            <option value="Soybean">Soybean</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-slate-200 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative z-0 min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : null}
        
        <MapContainer center={[23.0225, 72.5714]} zoom={9} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredLocations.map((loc) => (
            <CircleMarker
              key={loc.location_id}
              center={[loc.latitude, loc.longitude]}
              radius={10}
              pathOptions={{ 
                color: getRiskColor(loc.sowing_risk),
                fillColor: getRiskColor(loc.sowing_risk),
                fillOpacity: 0.7,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-base mb-0.5">{loc.block}</h3>
                  <p className="text-xs text-slate-500 mb-3">{loc.district} District</p>
                  
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Sowing Risk:</span>
                      <span className={`font-bold ${loc.sowing_risk === 'HIGH' ? 'text-red-600' : loc.sowing_risk === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {loc.sowing_risk}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Onset:</span>
                      <span className="font-medium">{Math.round(loc.onset_probability * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Persistence:</span>
                      <span className="font-medium">{Math.round(loc.persistence_probability * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">7-Day Dry Break:</span>
                      <span className="font-medium">{Math.round(loc.dry_break_probability * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Heavy Rain:</span>
                      <span className="font-medium">{Math.round(loc.heavy_rain_probability * 100)}%</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/officer/block/${loc.location_id}`}
                    className="block w-full text-center bg-slate-900 text-white py-1.5 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
      {/* Block Risk Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
        <div className="border-b border-slate-100 bg-slate-50 p-4">
          <h2 className="font-bold text-slate-800">Blocks Requiring Attention</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Block</th>
                <th className="px-4 py-3 font-semibold">District</th>
                <th className="px-4 py-3 font-semibold text-center">Onset</th>
                <th className="px-4 py-3 font-semibold text-center">Persistence</th>
                <th className="px-4 py-3 font-semibold text-center">Dry Break</th>
                <th className="px-4 py-3 font-semibold text-center">Sowing Risk</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocations.map(loc => (
                <tr key={loc.location_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{loc.block}</td>
                  <td className="px-4 py-3 text-slate-500">{loc.district}</td>
                  <td className="px-4 py-3 text-center">{Math.round(loc.onset_probability * 100)}%</td>
                  <td className="px-4 py-3 text-center">{Math.round(loc.persistence_probability * 100)}%</td>
                  <td className="px-4 py-3 text-center font-medium">{Math.round(loc.dry_break_probability * 100)}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${loc.sowing_risk === 'HIGH' ? 'bg-red-100 text-red-700' : loc.sowing_risk === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {loc.sowing_risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/officer/block/${loc.location_id}`} className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
