import type { AiScenarioInsight } from "../utils/types.ts";

const extractJsonArray = (text: string): any[] => {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("No JSON array found in AI response");
  }

  return JSON.parse(text.slice(start, end + 1));
};

const normalize = (parsed: any[]): AiScenarioInsight[] => {
  return parsed.map((item: any) => ({
    category: item.category || "Application",
    scenario: item.scenario || "No scenario provided",
    successRate:
  typeof item.successRate === "number"
    ? item.successRate > 1
      ? Math.round(item.successRate)
      : Math.round(item.successRate * 100)
    : 50,
    whyItWorks: item.whyItWorks || "",
    implementationSteps: Array.isArray(item.implementationSteps)
      ? item.implementationSteps
      : [],
    difficulty: item.difficulty || "Medium",
    estimatedCost: item.estimatedCost || "$$",
    pros: item.pros || [],
    cons: item.cons || [],
  }));
};

export const getAiScenario = async (
  idea: string
): Promise<AiScenarioInsight[]> => {
  const groqKey = process.env.GROQ_API_KEY;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: `
You are a senior product strategist.

Generate 30 DISTINCT application scenarios for the idea below.

Idea: "${idea}"

Each scenario must include:
- category
- scenario
- successRate
- whyItWorks
- implementationSteps (3)
- difficulty
- estimatedCost
- pros
- cons

Return ONLY valid JSON array.
            `,
          },
        ],

        // 🔥 FIX: increase output capacity
        max_tokens: 8000,

        temperature: 0.6,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Groq API error ${response.status}: ${JSON.stringify(data)}`
    );
  }

  const text = data?.choices?.[0]?.message?.content || "";

  console.log("RAW AI RESPONSE LENGTH:", text.length);

  try {
    const parsed = extractJsonArray(text);

    return normalize(parsed).slice(0, 30);
  } catch (err) {
    console.error("PARSE ERROR:", text.slice(0, 500));
    throw new Error("Failed to parse AI response");
  }
};