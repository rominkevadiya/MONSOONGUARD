import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface RiskCardProps {
  title: string;
  value: string | number;
  isPercentage?: boolean;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'NEUTRAL';
  icon: LucideIcon;
}

export const RiskCard: React.FC<RiskCardProps> = ({ title, value, isPercentage, level, icon: Icon }) => {
  const getLevelColors = () => {
    switch (level) {
      case 'LOW': return 'bg-brand-50 text-brand-700 border-brand-200';
      case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'HIGH': return 'bg-red-50 text-red-700 border-red-200';
      case 'NEUTRAL': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getIconColors = () => {
    switch (level) {
      case 'LOW': return 'text-brand-600';
      case 'MEDIUM': return 'text-amber-500';
      case 'HIGH': return 'text-red-500';
      case 'NEUTRAL': return 'text-slate-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className={`rounded-xl border p-5 flex flex-col ${getLevelColors()} shadow-sm`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider">{title}</h3>
        <Icon className={`h-5 w-5 ${getIconColors()}`} />
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-bold">
          {value}{isPercentage ? '%' : ''}
        </div>
        {level !== 'NEUTRAL' && (
          <div className="text-xs font-medium mt-1 opacity-80 uppercase">
            {level} RISK
          </div>
        )}
      </div>
    </div>
  );
};
