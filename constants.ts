import { Drug, RiskLevel, AnalysisReport } from './types';

export const COMMON_DRUGS: Drug[] = [
  { id: '1', name: 'Warfarin', class: 'Anticoagulant', description: 'Used to prevent blood clots.' },
  { id: '2', name: 'Clopidogrel', class: 'Antiplatelet', description: 'Used to prevent heart attacks and strokes.' },
  { id: '3', name: 'Simvastatin', class: 'Statin', description: 'Used to lower cholesterol.' },
  { id: '4', name: 'Codeine', class: 'Opioid', description: 'Used to treat pain and coughing.' },
  { id: '5', name: 'Tamoxifen', class: 'SERM', description: 'Used to treat breast cancer.' },
  { id: '6', name: 'Abacavir', class: 'Antiretroviral', description: 'Used to treat HIV/AIDS.' },
];

export const MOCK_REPORTS: Record<string, AnalysisReport> = {
  'Warfarin': {
    drugName: 'Warfarin',
    summary: 'Genetic variations detected in CYP2C9 and VKORC1 indicate increased sensitivity.',
    results: [
      {
        gene: 'CYP2C9',
        genotype: '*2/*3',
        phenotype: 'Poor Metabolizer',
        recommendation: 'Initiate with lower dose. Monitor INR frequently.',
        riskLevel: RiskLevel.HIGH_RISK,
      },
      {
        gene: 'VKORC1',
        genotype: '-1639 G>A (A/A)',
        phenotype: 'High Sensitivity',
        recommendation: 'Requires significantly lower dose.',
        riskLevel: RiskLevel.HIGH_RISK,
      },
    ],
  },
  'Clopidogrel': {
    drugName: 'Clopidogrel',
    summary: 'Reduced metabolism detected. Efficacy may be compromised.',
    results: [
      {
        gene: 'CYP2C19',
        genotype: '*2/*2',
        phenotype: 'Poor Metabolizer',
        recommendation: 'Consider alternative antiplatelet therapy (e.g., prasugrel, ticagrelor).',
        riskLevel: RiskLevel.HIGH_RISK,
      },
    ],
  },
  'Simvastatin': {
    drugName: 'Simvastatin',
    summary: 'Standard risk profile for SLCO1B1.',
    results: [
      {
        gene: 'SLCO1B1',
        genotype: '*1/*1',
        phenotype: 'Normal Function',
        recommendation: 'Initiate therapy with standard dosing.',
        riskLevel: RiskLevel.SAFE,
      },
    ],
  },
  'Codeine': {
    drugName: 'Codeine',
    summary: 'Ultra-rapid metabolism detected. Risk of toxicity.',
    results: [
      {
        gene: 'CYP2D6',
        genotype: '*1/*1xN',
        phenotype: 'Ultra-Rapid Metabolizer',
        recommendation: 'Avoid codeine due to risk of morphine toxicity. Use alternative.',
        riskLevel: RiskLevel.HIGH_RISK,
      },
    ],
  },
};