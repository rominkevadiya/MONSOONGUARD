import type { DemoScenario, LocationInfo } from '../types';

export const demoLocations: LocationInfo[] = [
  { id: 'jetalpur', name: 'Jetalpur', block: 'Daskroi', district: 'Ahmedabad' },
  { id: 'sanand', name: 'Sanand', block: 'Sanand', district: 'Ahmedabad' },
];

export const demoScenarios: DemoScenario[] = [
  {
    id: 'persistent-onset',
    name: 'Persistent Onset',
    data: {
      onsetProb: 82,
      persistenceProb: 85,
      drySpell7Prob: 15,
      drySpell14Prob: 21,
      heavyRainProb: 18,
      sowingRisk: 'LOW',
      falseOnset: false,
    }
  },
  {
    id: 'false-onset',
    name: 'False Onset (Dry Break)',
    data: {
      onsetProb: 82,
      persistenceProb: 35,
      drySpell7Prob: 78,
      drySpell14Prob: 65,
      heavyRainProb: 5,
      sowingRisk: 'HIGH',
      falseOnset: true,
      falseOnsetReason: "Initial rainfall signal is strong but persistence probability is low (35%) and 7-day dry break risk is high (78%)."
    }
  },
  {
    id: 'heavy-rain',
    name: 'Heavy Rain Risk',
    data: {
      onsetProb: 95,
      persistenceProb: 90,
      drySpell7Prob: 5,
      drySpell14Prob: 10,
      heavyRainProb: 85,
      sowingRisk: 'HIGH',
      falseOnset: false,
    }
  },
  {
    id: 'uncertain',
    name: 'Uncertain Persistence',
    data: {
      onsetProb: 82,
      persistenceProb: 61,
      drySpell7Prob: 28,
      drySpell14Prob: 21,
      heavyRainProb: 18,
      sowingRisk: 'MEDIUM',
      falseOnset: false,
    }
  }
];
