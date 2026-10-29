/**
 * Google Gemini Serverless Integration for RAGora.
 * Runs in Next.js App Router on Vercel Serverless.
 */

const DEFAULT_GEMINI_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "";

const MODELS_TO_TRY = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-3-flash-preview",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

export async function callGeminiServerless(prompt, customKey = null, preferredModel = null) {
  const key = customKey || DEFAULT_GEMINI_KEY;
  if (!key) {
    throw new Error("No Google Gemini API key configured.");
  }

  const models = preferredModel
    ? [preferredModel, ...MODELS_TO_TRY.filter((m) => m !== preferredModel)]
    : MODELS_TO_TRY;

  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const payload = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = new Error(`HTTP ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const candidates = data.candidates || [];
      if (candidates.length > 0 && candidates[0].content?.parts?.length > 0) {
        const text = candidates[0].content.parts[0].text?.trim() || "";
        return { success: true, text, model, provider: "gemini" };
      }
    } catch (e) {
      lastError = e;
    }
  }

  return {
    success: false,
    error: lastError ? lastError.message : "All Gemini model candidates failed.",
    provider: "gemini",
  };
}
