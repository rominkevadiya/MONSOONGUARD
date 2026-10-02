export type CropType = 'Cotton' | 'Groundnut' | 'Maize' | 'Millet' | 'Soybean';
export type GrowthStage = 'Pre-sowing' | 'Germination' | 'Early growth' | 'Vegetative' | 'Flowering';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface LocationInfo {
  id: string;
  name: string;
  block: string;
  district: string;
}

export interface DemoScenario {
  id: string;
  name: string;
  data: {
    onsetProb: number;
    persistenceProb: number;
    drySpell7Prob: number;
    drySpell14Prob: number;
    heavyRainProb: number;
    sowingRisk: RiskLevel;
    falseOnset: boolean;
    falseOnsetReason?: string;
  };
}
