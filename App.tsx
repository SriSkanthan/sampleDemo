
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { InitialScreen } from './components/InitialScreen';
import { ChatWindow } from './components/ChatWindow';
import { startChatSession, analyzeFood, analyzeElectronics, continueChat } from './services/geminiService';
import { AnalysisMode, AppState, ChatMessage, FoodAnalysisResult, ElectronicsAnalysisResult } from './types';
import { FoodAnalysisCard } from './components/FoodAnalysisCard';
import { ElectronicsAnalysisCard } from './components/ElectronicsAnalysisCard';
import { RecipePrompt } from './components/RecipePrompt';

const simpleUUID = () => "id-" + Math.random().toString(36).substring(2, 9);

const App: React.FC = () => {
  const [mode, setMode] = useState<AnalysisMode>('none');
  const [appState, setAppState] = useState<AppState>('awaiting_mode');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastAnalyzedFood, setLastAnalyzedFood] = useState<string | null>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  const addMessage = useCallback((sender: 'user' | 'ai', content: React.ReactNode) => {
    setMessages(prev => [...prev, { id: simpleUUID(), sender, content }]);
  }, []);

  const handleModeSelect = useCallback(async (selectedMode: AnalysisMode) => {
    setMode(selectedMode);
    const welcomeMessage = selectedMode === 'food'
      ? "Great! Let's analyze a food product. Please upload a clear picture of its ingredients list and nutritional facts."
      : "Excellent choice. To analyze an electronic gadget, please upload a photo and enter its model name.";
    
    setMessages([{ id: simpleUUID(), sender: 'ai', content: welcomeMessage }]);

    try {
      setIsLoading(true);
      chatSessionRef.current = await startChatSession(selectedMode);
      setAppState(selectedMode === 'food' ? 'awaiting_food_image' : 'awaiting_electronics_details');
    } catch (error) {
      console.error("Failed to start chat session:", error);
      addMessage('ai', 'Sorry, I couldn\'t connect to the AI service. Please check your connection or API key and refresh.');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const handleGenerateRecipe = useCallback(async () => {
    if (!lastAnalyzedFood || !chatSessionRef.current) return;

    const userMessage = `Yes, please generate a healthier recipe for ${lastAnalyzedFood}.`;
    addMessage('user', userMessage);

    setIsLoading(true);
    setAppState('processing');
    try {
        const prompt = `That sounds great. Please provide a simple, healthy, homemade recipe for ${lastAnalyzedFood}. The recipe should be easy to follow.`;
        const response = await continueChat(chatSessionRef.current, prompt);
        addMessage('ai', response);
    } catch(error) {
        console.error("Recipe generation error:", error);
        addMessage('ai', "I'm having trouble coming up with a recipe right now. Please try again in a moment.");
    } finally {
        setIsLoading(false);
        setAppState('active_chat');
    }
  }, [lastAnalyzedFood, addMessage]);

  const handleFoodAnalysis = useCallback(async (imageFile: File) => {
    addMessage('user', <img src={URL.createObjectURL(imageFile)} alt="Food product" className="rounded-lg max-h-48" />);
    setIsLoading(true);
    setAppState('processing');
    try {
      if (!chatSessionRef.current) throw new Error("Chat session not initialized.");
      const result: FoodAnalysisResult | string = await analyzeFood(chatSessionRef.current, imageFile);
      
      if (typeof result === 'string') {
        addMessage('ai', result);
      } else {
        addMessage('ai', <FoodAnalysisCard result={result} />);
        setLastAnalyzedFood(result.productName);
        addMessage('ai', <RecipePrompt onGenerate={handleGenerateRecipe} />);
      }
      setAppState('active_chat');
    } catch (error) {
      console.error("Food analysis error:", error);
      addMessage('ai', 'I had trouble analyzing that image. Please try another one, ensuring the text is clear.');
      setAppState('awaiting_food_image');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, handleGenerateRecipe]);

  const handleElectronicsAnalysis = useCallback(async (modelName: string, imageFile?: File) => {
    let userContent: React.ReactNode = `Analyzing: ${modelName}`;
    if(imageFile) {
        userContent = <>
            <img src={URL.createObjectURL(imageFile)} alt={modelName} className="rounded-lg max-h-48 mb-2" />
            <p>Model: {modelName}</p>
        </>
    }
    addMessage('user', userContent);
    setIsLoading(true);
    setAppState('processing');
    try {
        if (!chatSessionRef.current) throw new Error("Chat session not initialized.");
        const result: ElectronicsAnalysisResult | string = await analyzeElectronics(chatSessionRef.current, modelName);

        if (typeof result === 'string') {
            addMessage('ai', result);
        } else {
            addMessage('ai', <ElectronicsAnalysisCard result={result} />);
            addMessage('ai', "You can ask for a comparison with another device or ask any other questions you have.");
        }
        setAppState('active_chat');
    } catch (error) {
        console.error("Electronics analysis error:", error);
        addMessage('ai', 'I couldn\'t find information for that model. Please double-check the model name and try again.');
        setAppState('awaiting_electronics_details');
    } finally {
        setIsLoading(false);
    }
  }, [addMessage]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !chatSessionRef.current) return;
    addMessage('user', text);
    setIsLoading(true);
    setAppState('processing');
    try {
        const response = await continueChat(chatSessionRef.current, text);
        addMessage('ai', response);
    } catch(error) {
        console.error("Chat error:", error);
        addMessage('ai', "I'm having trouble responding right now. Please try again in a moment.");
    } finally {
        setIsLoading(false);
        setAppState('active_chat');
    }
  }, [addMessage]);

  if (mode === 'none') {
    return <InitialScreen onModeSelect={handleModeSelect} />;
  }

  return (
    <ChatWindow
      messages={messages}
      onFoodAnalysis={handleFoodAnalysis}
      onElectronicsAnalysis={handleElectronicsAnalysis}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      appState={appState}
    />
  );
};

export default App;
