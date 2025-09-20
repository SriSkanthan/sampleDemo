
import React from 'react';

export type AnalysisMode = 'none' | 'food' | 'electronics';

export type AppState =
  | 'awaiting_mode'
  | 'awaiting_food_image'
  | 'awaiting_electronics_details'
  | 'processing'
  | 'active_chat';

export type MessageSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: React.ReactNode;
}

export interface FoodAnalysisResult {
  productName: string;
  healthScore: number;
  beneficialIngredients: { name: string; benefit: string }[];
  harmfulIngredients: { name: string; risk: string }[];
  summary: {
    merits: string[];
    demerits: string[];
  };
}

export interface ElectronicsAnalysisResult {
  ecoScore: number;
  deviceType: string;
  analysis: {
    merits: string[];
    demerits: string[];
  };
  carbonFootprint: string;
  annualEnergyConsumption: string;
}
