import type { RecommendationResult } from "./recommend";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Best free models on OpenRouter, tried in order until one responds.
// If a model is rate-limited / unavailable, we fall through to the next.
const FREE_MODELS = [
  "deepseek/deepseek-chat-v3-0324:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "mistralai/mistral-small-3.2-24b-instruct:free",
];

export type Profile = {
  name: string;
  qualification: string;
  experience: string;
  profession: string;
  careerGoal: string;
};

const SYSTEM_PROMPT =
  "You are an academic career advisor for AcdyOn. Given a person's profile and the credential we recommend, write a warm, encouraging, and specific 2-3 sentence explanation of WHY this pathway fits them. Reference their experience, qualification, and career goal naturally. Do not use markdown, headings, or bullet points. Do not restate the recommendation name in a list. Write in second person ('you'). Keep it under 75 words.";

/**
 * Generates a personalised explanation for the recommendation using a free
 * OpenRouter model. Falls back to the deterministic rules-based reason if no
 * API key is configured or every model fails — so the app always works.
 */
export async function generateExplanation(
  profile: Profile,
  recommendation: RecommendationResult["recommendation"],
  fallbackReason: string
): Promise<{ reason: string; aiGenerated: boolean; model: string | null }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { reason: fallbackReason, aiGenerated: false, model: null };
  }

  const userPrompt = `Profile:
- Name: ${profile.name}
- Highest qualification: ${profile.qualification}
- Years of work experience: ${profile.experience}
- Current profession: ${profile.profession}
- Career goal: ${profile.careerGoal}

Recommended pathway: ${recommendation}

Write the explanation.`;

  for (const model of FREE_MODELS) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          // Optional attribution headers recommended by OpenRouter
          "HTTP-Referer": "https://acdyon-pathway.vercel.app",
          "X-Title": "AcdyOn Academic Pathway Engine",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const text: string | undefined = data?.choices?.[0]?.message?.content
        ?.toString()
        .trim();

      if (text) {
        return { reason: text, aiGenerated: true, model };
      }
    } catch {
      // Network error, timeout, or rate limit — try the next model.
      continue;
    }
  }

  return { reason: fallbackReason, aiGenerated: false, model: null };
}
