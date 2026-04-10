/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Article } from "../types";

export const listAvailableModels = async (apiKey: string): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Note: The @google/genai library might not expose listModels directly in some versions
    // If it's missing, we return a sane default list.
    // However, the standard REST API and some library versions support it.
    // For now, let's assume it's available or use a fallback.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
      return data.models
        .filter((m: any) => m.supportedGenerationMethods.includes('generateContent'))
        .map((m: any) => m.name);
    }
    return ['models/gemini-1.5-flash', 'models/gemini-1.5-pro'];
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return ['models/gemini-1.5-flash', 'models/gemini-1.5-pro'];
  }
};

export const synthesizeArticle = async (
  inputText: string, 
  apiKey: string, 
  modelName: string = "models/gemini-1.5-flash"
): Promise<Partial<Article>> => {
  if (!apiKey) {
    throw new Error("API Key is required for synthesis.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = ai.models.getGenerativeModel({ model: modelName });
  const response = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{
        text: `Analyze this Japanese text and provide a learning drill. 
        Return a JSON object with: title, description, level (N1-N5), category, content (the original text), 
        translationLiteral, translationNatural, vocabulary (array of {word, reading, meaning, level}), 
        and insight (a short linguistic note).
        
        Text: ${inputText}`
      }]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          level: { type: Type.STRING },
          category: { type: Type.STRING },
          content: { type: Type.STRING },
          translationLiteral: { type: Type.STRING },
          translationNatural: { type: Type.STRING },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                reading: { type: Type.STRING },
                meaning: { type: Type.STRING },
                level: { type: Type.STRING },
              }
            }
          },
          insight: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
