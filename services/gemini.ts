
import { GoogleGenAI, Type } from "@google/genai";
import { Win } from "../types";

export const generateMonthlyInsight = async (wins: Win[], monthName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const winsContext = wins.map(w => `- ${w.title}: ${w.impact} (${w.okrCategory}) - ${w.team}`).join('\n');
  
  const prompt = `
    Analyze the following work achievements (wins) for the month of ${monthName} for Team 1 & Team 2 (Strategy & Plans context).
    Generate a high-energy, motivational "Spotify Wrapped" style summary.
    Provide a snappy title for the month, a concise summary of the collective impact, and a creative insight about the team's strengths.
    
    Wins:
    ${winsContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            monthTitle: { type: Type.STRING, description: "A creative name for this month's achievement vibe" },
            impactSummary: { type: Type.STRING, description: "A high-level summary of the quantified impact" },
            teamInsight: { type: Type.STRING, description: "A motivational insight about the team's performance" },
            topStrengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 key areas where the team excelled" }
          },
          required: ["monthTitle", "impactSummary", "teamInsight", "topStrengths"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Insight failed:", error);
    return {
      monthTitle: "The Unstoppable Surge",
      impactSummary: "The team delivered consistent results across all strategic pillars.",
      teamInsight: "Your ability to pivot and focus on high-impact OKRs remains your greatest asset.",
      topStrengths: ["Agility", "Strategic Alignment", "Collaborative Spirit"]
    };
  }
};
