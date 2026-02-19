export interface Drug {
  id: string;
  name: string;
  class: string;
  description: string;
}

export enum RiskLevel {
  SAFE = 'SAFE',
  CAUTION = 'CAUTION',
  HIGH_RISK = 'HIGH_RISK',
}

export interface GeneResult {
  gene: string;
  genotype: string;
  phenotype: string;
  recommendation: string;
  riskLevel: RiskLevel;
}

export interface AnalysisReport {
  drugName: string;
  summary: string;
  results: GeneResult[];
}