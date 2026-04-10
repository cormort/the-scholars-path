/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Article } from "../types";

export const synthesizeArticle = async (inputText: string, apiKey?: string): Promise<Partial<Article>> => {
  if (!apiKey) {
    throw new Error("API Key is required for synthesis.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash", // Using a stable model name
    contents: `Analyze this Japanese text and provide a learning drill. 
    Return a JSON object with: title, description, level (N1-N5), category, content (the original text), 
    translationLiteral, translationNatural, vocabulary (array of {word, reading, meaning, level}), 
    and insight (a short linguistic note).
    
    Text: ${inputText}`,
    config: {
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
