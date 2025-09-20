
import React, { useRef, useEffect } from 'react';
import { AppState, ChatMessage } from '../types';
import { ChatMessageItem } from './ChatMessageItem';
import { InputBar } from './InputBar';

interface ChatWindowProps {
  messages: ChatMessage[];
  onFoodAnalysis: (imageFile: File) => void;
  onElectronicsAnalysis: (modelName: string, imageFile?: File) => void;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  appState: AppState;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onFoodAnalysis,
  onElectronicsAnalysis,
  onSendMessage,
  isLoading,
  appState
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <header className="bg-gray-900 shadow-md p-4 text-center">
        <h1 className="text-2xl font-bold text-teal-400">ECOSAUR</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
        {isLoading && (
            <div className="flex items-center justify-start space-x-3 ml-2">
                <div className="w-12 h-12 flex justify-center items-center rounded-full bg-gray-700">
                    <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse delay-200"></div>
                    <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse delay-400"></div>
                </div>
                <div className="text-gray-400">ECOSAUR is thinking...</div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-4 bg-gray-900 border-t border-gray-700">
        <InputBar
          onFoodAnalysis={onFoodAnalysis}
          onElectronicsAnalysis={onElectronicsAnalysis}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          appState={appState}
        />
      </footer>
    </div>
  );
};
