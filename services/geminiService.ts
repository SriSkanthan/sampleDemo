import { GoogleGenAI, Chat, Type } from "@google/genai";
import { AnalysisMode, FoodAnalysisResult, ElectronicsAnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = async (file: File): Promise<{ mimeType: string, data: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return reject(new Error("Failed to read file as base64 string."));
            }
            const [header, data] = reader.result.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
            resolve({ mimeType, data });
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

const foodResponseSchema = {
    type: Type.OBJECT,
    properties: {
        productName: { type: Type.STRING, description: 'The name of the food product identified from the image, e.g., "Chocolate Chip Cookies".' },
        healthScore: { type: Type.INTEGER, description: 'Overall health score from 0 to 100, where 100 is healthiest.' },
        beneficialIngredients: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, benefit: { type: Type.STRING } },
                required: ["name", "benefit"]
            }
        },
        harmfulIngredients: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, risk: { type: Type.STRING } },
                required: ["name", "risk"]
            }
        },
        summary: {
            type: Type.OBJECT,
            properties: {
                merits: { type: Type.ARRAY, items: { type: Type.STRING } },
                demerits: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["merits", "demerits"]
        }
    },
    required: ["productName", "healthScore", "beneficialIngredients", "harmfulIngredients", "summary"]
};


export const startChatSession = async (mode: AnalysisMode): Promise<Chat> => {
    const systemInstruction = mode === 'food'
        ? "You are an expert nutritionist and food scientist named ECOSAUR. You analyze food products for their health impact. You communicate in a friendly, clear, and helpful manner."
        : "You are an expert in consumer electronics and environmental sustainability, named ECOSAUR. You analyze gadgets for their eco-friendliness. You are informative, objective, and provide actionable advice.";
    
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        }
    });
};

export const analyzeFood = async (chat: Chat, imageFile: File): Promise<FoodAnalysisResult | string> => {
    const { mimeType, data } = await fileToBase64(imageFile);
    const imagePart = { inlineData: { mimeType, data } };
    const textPart = { text: "Analyze the food product in this image. Use OCR to read the ingredients and nutritional facts. Provide a detailed analysis based on established dietary guidelines. Return the analysis in the specified JSON format." };

    const response = await chat.sendMessage({
        // FIX: For multipart messages, the `message` property should be an array of Parts, not an object containing a `parts` property.
        message: [textPart, imagePart],
        config: {
            responseMimeType: 'application/json',
            responseSchema: foodResponseSchema
        }
    });

    try {
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as FoodAnalysisResult;
        return result;
    } catch (e) {
        console.error("Error parsing food analysis JSON:", e);
        return "I couldn't structure the analysis correctly. The product might be unusual or the image unclear. Here's the raw data I found: " + response.text;
    }
};

export const analyzeElectronics = async (chat: Chat, modelName: string): Promise<ElectronicsAnalysisResult | string> => {
    const prompt = `Please act as an expert on consumer electronics and environmental impact. The user wants to analyze the following gadget: "${modelName}".
    1. Use Google Search to find the official specifications for this model.
    2. Based on the specs, analyze its eco-friendliness.
    3. Your entire response MUST be a single JSON object enclosed in a \`\`\`json ... \`\`\` markdown block. Do not add any text before or after it.
    The JSON object must have this exact structure:
    {
      "ecoScore": number (An eco-friendliness score from 0-100, where 100 is best),
      "deviceType": "string" (e.g., 'Laptop', 'Smartphone', 'Headphones'),
      "analysis": {
        "merits": ["string array of positive points like energy efficiency, recycled materials"],
        "demerits": ["string array of negative points like poor repairability, high power consumption, rare earth minerals"]
      },
      "carbonFootprint": "string" (Estimated lifetime carbon footprint, e.g., '25 kg CO2e'),
      "annualEnergyConsumption": "string" (Estimated annual energy use, e.g., '15 kWh/year')
    }`;

    const response = await chat.sendMessage({
        message: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });
    
    try {
        const textResponse = response.text;
        const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/);
        if (!jsonMatch || !jsonMatch[1]) {
            throw new Error("No JSON block found in the response.");
        }
        const jsonText = jsonMatch[1].trim();
        const result = JSON.parse(jsonText) as ElectronicsAnalysisResult;
        return result;
    } catch (e) {
        console.error("Error parsing electronics analysis JSON:", e);
        return "I found some information but couldn't structure it properly. This might happen with very new or obscure devices. Here's what I found: " + response.text;
    }
};

export const continueChat = async (chat: Chat, message: string): Promise<string> => {
    const response = await chat.sendMessage({ message });
    return response.text;
};
