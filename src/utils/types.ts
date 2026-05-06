export interface AiScenarioInsight {
  category: string;
  scenario: string;
  successRate: number;

  whyItWorks: string;       
  implementationSteps: string[];
  difficulty: "Low" | "Medium" | "High";
  estimatedCost: string;
  pros: string[];
  cons: string[];
}