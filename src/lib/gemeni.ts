import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env file");
}

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const apiKey = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({apiKey});



async function Gemeni(prompt:string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
      // responseJsonSchema: zodToJsonSchema(recipeSchema),
    },
  });
  return response;
}


export {ai, Gemeni}