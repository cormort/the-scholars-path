/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Article } from "../types";

export const listAvailableModels = async (apiKey: string): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI(apiKey);
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

const parseAIResponse = (text: string) => {
  try {
    // Attempt to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```json\s?([\s\S]*?)\s?```/) || 
                     text.match(/```\s?([\s\S]*?)\s?```/) ||
                     [null, text];
    
    const cleanText = jsonMatch[1] ? jsonMatch[1].trim() : text.trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("JSON Parsing Error:", error, "Raw Text:", text);
    throw new Error("無法解析 AI 回傳的資料格式。");
  }
};

export const createBaseLesson = async (
  inputText: string, 
  apiKey: string, 
  modelName: string = "models/gemini-1.5-flash"
): Promise<Partial<Article>> => {
  const isUrl = inputText.startsWith('http');
  const ai = new GoogleGenAI(apiKey);
  
  // Enable Google Search tool if it's a URL
  const model = ai.getGenerativeModel({ 
    model: modelName,
    tools: isUrl ? [{ googleSearch: {} }] : undefined
  });

  const response = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{
        text: `你是一位精通日文與繁體中文的專業翻譯達人。你的任務是協助協助日語學習者進行文本轉換。

        ${isUrl ? `請先讀取以下網址的內容：${inputText}` : `待分析文本：${inputText}`}

        ### 行為準則：
        1. 針對內容進行兩次翻譯：
           - translationLiteral: 直譯，力求忠於原文字句。
           - translationNatural: 意譯，調整為台灣在地慣用講法。
        2. 保留在原文中的俚語、專有名稱，並在原文後方以括號 () 標註繁體中文翻譯。
        3. 當提及台灣相關地名時，不須冠以『中國』二字。

        ### 輸出格式：
        請返回 JSON：
        {
          "title": "專業標題",
          "description": "背景描述",
          "level": "N1-N5",
          "category": "分類",
          "content": "標註過術語的原文内容",
          "translationLiteral": "直譯結果",
          "translationNatural": "意譯結果"
        }

        注意：請務必只輸出 JSON 格式。`
      }]
    }],
    generationConfig: { responseMimeType: "application/json" }
  });

  return parseAIResponse(response.text || '{}');
};

export const fetchVocabulary = async (
  inputText: string, 
  apiKey: string, 
  modelName: string = "models/gemini-1.5-flash"
): Promise<Article['vocabulary']> => {
  const ai = new GoogleGenAI(apiKey);
  const model = ai.getGenerativeModel({ model: modelName });
  const response = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{
        text: `請從以下日文文本中萃取 5-8 個關鍵詞彙。
        返回格式：JSON 陣列 [{"word": "單字", "reading": "讀音", "meaning": "繁中意義", "level": "N1-N5"}]
        
        文本：
        ${inputText}`
      }]
    }],
    generationConfig: { responseMimeType: "application/json" }
  });

  return parseAIResponse(response.text || '[]');
};

export const fetchLinguisticInsight = async (
  inputText: string, 
  apiKey: string, 
  modelName: string = "models/gemini-1.5-flash"
): Promise<string> => {
  const ai = new GoogleGenAI(apiKey);
  const model = ai.getGenerativeModel({ model: modelName });
  const response = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{
        text: `請針對以下日文文本，提供專業的語言點評、文法解析或文化脈絡說明。
        以繁體中文撰寫，字數約 150-300 字，由淺入深，展現專家視野。
        
        文本：
        ${inputText}`
      }]
    }]
  });

  return response.text || '';
};
