import { Scenario, ScenarioData, Founder, FundingRound } from '@/types/database';

// Mock data for scenarios without authentication
export const mockScenarios: Scenario[] = [
  {
    id: '1',
    name: 'SaaS Startup Journey',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2', 
    name: 'E-commerce Platform',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'AI/ML Startup',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  }
];

export const mockFounders: Founder[] = [
  { name: 'Alex Chen', equity: 40 },
  { name: 'Sarah Rodriguez', equity: 35 },
  { name: 'David Kim', equity: 25 }
];

export const mockRounds: FundingRound[] = [
  {
    id: 'pre-seed',
    name: 'Pre-Seed',
    investment: 250000,
    valuation: 2000000,
    dilution: 12.5,
    date: '2024-01-15'
  },
  {
    id: 'seed',
    name: 'Seed Round',
    investment: 1500000,
    valuation: 8000000,
    dilution: 18.75,
    date: '2024-06-15'
  },
  {
    id: 'series-a',
    name: 'Series A',
    investment: 5000000,
    valuation: 25000000,
    dilution: 20,
    date: '2024-12-15'
  }
];

export const createMockScenarioData = (scenarioId: string): ScenarioData => {
  const scenario = mockScenarios.find(s => s.id === scenarioId) || mockScenarios[0];
  
  return {
    scenario,
    founders: mockFounders,
    rounds: mockRounds
  };
};

// Simulate async operations
export const MockFunctions = {
  getScenarios: async (): Promise<Scenario[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return mockScenarios;
  },

  getScenarioById: async (id: string): Promise<ScenarioData> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return createMockScenarioData(id);
  },

  createScenario: async (data: { name: string; founders: Founder[] }): Promise<ScenarioData> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newScenario: Scenario = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return {
      scenario: newScenario,
      founders: data.founders,
      rounds: []
    };
  },

  updateScenario: async (id: string, data: Partial<ScenarioData>): Promise<ScenarioData> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return createMockScenarioData(id);
  }
};