// The client gets the API key from the environment variable `GEMINI_API_KEY`.

// Initializes the Gemini AI client and exports a wrapper function for
// generating content with pre-configured defaults.
//
// The client is lazily initialized — if GEMINI_API_KEY is missing, the file
// can still be imported without crashing (returns null). The error is thrown
// only when Gemeni() is actually called, making this CI-safe.

// Exports:
//   ai      — the raw GoogleGenAI client (null if no API key)
//   Gemeni  — wrapper function with default model and config

// Usage:
//   import { Gemeni } from "@/lib/gemeni";
//   const response = await Gemeni("your prompt here");

// Override defaults:
//   const response = await Gemeni("prompt", "gemini-2.0-flash", { temperature: 0.5 });

// Docs:
// - Google GenAI SDK: https://www.npmjs.com/package/@google/genai
// - Gemini quickstart: https://ai.google.dev/gemini-api/docs/quickstart?lang=node
// - Structured output: https://ai.google.dev/gemini-api/docs/structured-output?lang=node
// - Generation config: https://ai.google.dev/gemini-api/docs/text-generation?lang=node#configure

import { GoogleGenAI } from "@google/genai";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

async function Gemeni(
  prompt: string,
  model: string = "gemini-2.5-flash",
  config: object = {
    temperature: 0.2,
    responseMimeType: "application/json",
  },
) {
  if (!ai) {
    throw new Error("Missing GEMINI_API_KEY in .env file");
  }
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: config,
  });
  return response;
}

export { ai, Gemeni };
