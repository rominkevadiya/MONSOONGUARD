import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export const AnalysisPage: React.FC = () => {
  const { location } = useDemo();
  const [timeRange, setTimeRange] = useState('30days');

  // Synthetic demo data for charts
  const rainfallData = [
    { date: 'Jun 1', rainfall: 0, historicalAverage: 2 },
    { date: 'Jun 2', rainfall: 0, historicalAverage: 3 },
    { date: 'Jun 3', rainfall: 0, historicalAverage: 3 },
    { date: 'Jun 4', rainfall: 1, historicalAverage: 5 },
    { date: 'Jun 5', rainfall: 4, historicalAverage: 6 },
    { date: 'Jun 6', rainfall: 12, historicalAverage: 8 },
    { date: 'Jun 7', rainfall: 8, historicalAverage: 9 },
    { date: 'Jun 8', rainfall: 0, historicalAverage: 10 },
    { date: 'Jun 9', rainfall: 22, historicalAverage: 11 },
    { date: 'Jun 10', rainfall: 45, historicalAverage: 12 },
    { date: 'Jun 11', rainfall: 18, historicalAverage: 13 },
    { date: 'Jun 12', rainfall: 5, historicalAverage: 13 },
    { date: 'Jun 13', rainfall: 0, historicalAverage: 14 },
    { date: 'Jun 14', rainfall: 0, historicalAverage: 15 },
  ];

  const persistenceData = [
    { date: 'Jun 8', onsetProb: 40, persistenceProb: 20 },
    { date: 'Jun 9', onsetProb: 65, persistenceProb: 30 },
    { date: 'Jun 10', onsetProb: 88, persistenceProb: 45 },
    { date: 'Jun 11', onsetProb: 92, persistenceProb: 61 },
    { date: 'Jun 12', onsetProb: 85, persistenceProb: 55 },
    { date: 'Jun 13', onsetProb: 82, persistenceProb: 60 },
    { date: 'Jun 14', onsetProb: 82, persistenceProb: 61 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <Link to="/farmer" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Rainfall Analysis</h1>
            <p className="text-slate-500">{location.name} • Trend Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
          <Calendar className="h-4 w-4 text-slate-400 ml-2" />
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
          >
            <option value="7days">Last 7 Days</option>
            <option value="14days">Last 14 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Rainfall Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-6">Daily Rainfall vs Historical Average</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                <Bar dataKey="rainfall" name="Actual Rainfall (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="historicalAverage" name="Historical Avg (mm)" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Probabilities Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-6">Onset & Persistence Probability Trend</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={persistenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOnset" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPersistence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value}%`]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                <Area type="monotone" dataKey="onsetProb" name="Onset Prob." stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorOnset)" />
                <Area type="monotone" dataKey="persistenceProb" name="Persistence Prob." stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPersistence)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
