export interface Founder {
  name: string;
  equity: number;
}

export interface FundingRound {
  id: string;
  name: string;
  investment: number;
  valuation: number;
  dilution: number;
  date: string;
}

export interface Scenario {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ScenarioData {
  scenario: Scenario;
  founders: Founder[];
  rounds: FundingRound[];
}