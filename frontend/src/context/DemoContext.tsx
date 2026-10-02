import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { DemoScenario, LocationInfo, CropType, GrowthStage } from '../types';
import { demoScenarios, demoLocations } from '../data/demoData';
import { apiService } from '../services/api';

interface DemoContextType {
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  activeScenario: DemoScenario;
  setActiveScenario: (scenario: DemoScenario) => void;
  scenarios: DemoScenario[];
  location: LocationInfo;
  setLocation: (loc: LocationInfo) => void;
  crop: CropType;
  setCrop: (crop: CropType) => void;
  stage: GrowthStage;
  setStage: (stage: GrowthStage) => void;
  apiAvailable: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [activeScenario, setActiveScenario] = useState<DemoScenario>(demoScenarios[1]);
  const [location, setLocation] = useState<LocationInfo>(demoLocations[0]);
  const [crop, setCrop] = useState<CropType>('Cotton');
  const [stage, setStage] = useState<GrowthStage>('Pre-sowing');

  // Check health and try to fetch from API
  useEffect(() => {
    const checkApi = async () => {
      try {
        await apiService.getHealth();
        setApiAvailable(true);
      } catch (err) {
        setApiAvailable(false);
        setIsDemoMode(true); // Fallback to demo mode if API fails
      }
    };
    checkApi();
  }, []);

  useEffect(() => {
    if (!isDemoMode && apiAvailable) {
      // Assuming location ID maps to database location IDs (1-10)
      const fetchApiData = async () => {
        try {
          const locIndex = demoLocations.findIndex(l => l.id === location.id) + 1;
          const riskData = await apiService.getRisk(locIndex, crop);
          
          // Map backend schema to frontend demo schema for seamless integration
          setActiveScenario({
            id: 'api-data',
            name: 'Live API Data',
            data: {
              onsetProb: Math.round(riskData.onset.probability * 100),
              persistenceProb: Math.round(riskData.persistence.probability * 100),
              drySpell7Prob: Math.round(riskData.dry_spell.seven_day_probability * 100),
              drySpell14Prob: Math.round(riskData.dry_spell.fourteen_day_probability * 100),
              heavyRainProb: Math.round(riskData.heavy_rain.probability * 100),
              sowingRisk: riskData.sowing.risk as any,
              falseOnset: riskData.false_onset.detected,
              falseOnsetReason: riskData.false_onset.reason
            }
          });
        } catch (err) {
          console.error("API Fetch Error:", err);
          setIsDemoMode(true); // Fallback
        }
      };
      fetchApiData();
    }
  }, [isDemoMode, apiAvailable, location, crop]);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        setIsDemoMode,
        activeScenario,
        setActiveScenario,
        scenarios: demoScenarios,
        location,
        setLocation,
        crop,
        setCrop,
        stage,
        setStage,
        apiAvailable
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within DemoProvider');
  return context;
};
