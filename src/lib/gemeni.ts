import { GoogleGenAI } from "@google/genai";




// The client gets the API key from the environment variable `GEMINI_API_KEY`.

const ai = process.env.GEMINI_API_KEY ? 
  new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }): null;


async function Gemeni(prompt:string, model:string = "gemini-3-flash-preview", config:object = {
    temperature: 0.2,
    responseMimeType: "application/json",
    },) 
    {
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


export {ai, Gemeni}