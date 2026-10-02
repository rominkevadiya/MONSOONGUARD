import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { apiService } from '../../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const OfficerAnalytics: React.FC = () => {
  const { isDemoMode, activeScenario } = useDemo();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    riskDistribution: [],
    onsetDistribution: [],
    persistenceDistribution: []
  });

  const COLORS = {
    HIGH: '#ef4444',
    MEDIUM: '#f59e0b',
    LOW: '#10b981',
    ProbLow: '#94a3b8',
    ProbMed: '#60a5fa',
    ProbHigh: '#3b82f6'
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        let mapData;
        if (isDemoMode) {
          mapData = [
            { sowing_risk: activeScenario.data.sowingRisk, onset_probability: activeScenario.data.onsetProb / 100, persistence_probability: activeScenario.data.persistenceProb / 100 },
            { sowing_risk: 'MEDIUM', onset_probability: 0.6, persistence_probability: 0.5 },
            { sowing_risk: 'LOW', onset_probability: 0.9, persistence_probability: 0.8 },
            { sowing_risk: 'LOW', onset_probability: 0.95, persistence_probability: 0.9 }
          ];
        } else {
          mapData = await apiService.getMapRisk();
        }

        // Process Risk Distribution
        const high = mapData.filter((d: any) => d.sowing_risk === 'HIGH').length;
        const med = mapData.filter((d: any) => d.sowing_risk === 'MEDIUM').length;
        const low = mapData.filter((d: any) => d.sowing_risk === 'LOW').length;

        // Process Onset Distribution (<40%, 40-70%, >70%)
        const onsetLow = mapData.filter((d: any) => d.onset_probability < 0.4).length;
        const onsetMed = mapData.filter((d: any) => d.onset_probability >= 0.4 && d.onset_probability <= 0.7).length;
        const onsetHigh = mapData.filter((d: any) => d.onset_probability > 0.7).length;

        // Process Persistence Distribution
        const persLow = mapData.filter((d: any) => d.persistence_probability < 0.4).length;
        const persMed = mapData.filter((d: any) => d.persistence_probability >= 0.4 && d.persistence_probability <= 0.7).length;
        const persHigh = mapData.filter((d: any) => d.persistence_probability > 0.7).length;

        setData({
          riskDistribution: [
            { name: 'HIGH', value: high },
            { name: 'MEDIUM', value: med },
            { name: 'LOW', value: low }
          ],
          onsetDistribution: [
            { name: '< 40%', value: onsetLow },
            { name: '40 - 70%', value: onsetMed },
            { name: '> 70%', value: onsetHigh }
          ],
          persistenceDistribution: [
            { name: '< 40%', value: persLow },
            { name: '40 - 70%', value: persMed },
            { name: '> 70%', value: persHigh }
          ]
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [isDemoMode, activeScenario]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return percent > 0 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Regional Risk Analytics</h1>
        <p className="text-slate-500">Macro-level distribution of climate variables across the state.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sowing Risk Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 text-center">Sowing Risk Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.riskDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Onset Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 text-center">Onset Probability Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.onsetDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" name="Blocks" radius={[4, 4, 0, 0]}>
                  {data.onsetDistribution.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.ProbLow : index === 1 ? COLORS.ProbMed : COLORS.ProbHigh} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Persistence Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 text-center">Persistence Prob. Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.persistenceDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" name="Blocks" radius={[4, 4, 0, 0]}>
                  {data.persistenceDistribution.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.ProbLow : index === 1 ? COLORS.ProbMed : COLORS.ProbHigh} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
