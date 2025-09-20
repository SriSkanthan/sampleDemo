
import React, { useState, useRef } from 'react';
import { AppState } from '../types';
import { SendIcon, CameraIcon, UploadIcon } from './icons';

interface InputBarProps {
  onFoodAnalysis: (imageFile: File) => void;
  onElectronicsAnalysis: (modelName: string, imageFile?: File) => void;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  appState: AppState;
}

export const InputBar: React.FC<InputBarProps> = ({
  onFoodAnalysis,
  onElectronicsAnalysis,
  onSendMessage,
  isLoading,
  appState
}) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (appState === 'awaiting_food_image') {
        onFoodAnalysis(file);
      } else {
        setImageFile(file);
      }
    }
  };

  const handleSend = () => {
    if (isLoading) return;

    if (appState === 'awaiting_electronics_details') {
      if (text.trim()) {
        onElectronicsAnalysis(text.trim(), imageFile || undefined);
        setText('');
        setImageFile(null);
      }
    } else if (appState === 'active_chat') {
        if(text.trim()) {
            onSendMessage(text.trim());
            setText('');
        }
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'awaiting_food_image':
        return (
          <div className="flex items-center justify-center gap-4 w-full">
            <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <CameraIcon className="w-6 h-6" />
              Take Photo
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <UploadIcon className="w-6 h-6" />
              Upload Image
            </button>
          </div>
        );
      case 'awaiting_electronics_details':
        return (
          <div className="flex items-center gap-2 w-full">
             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
             <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors disabled:opacity-50"
            >
              <UploadIcon className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={imageFile ? `${imageFile.name} | Enter model name...` : "Enter model name..."}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={isLoading || !text.trim()} className="p-3 bg-teal-600 hover:bg-teal-500 rounded-full transition-colors disabled:opacity-50 disabled:bg-gray-600">
              <SendIcon className="w-6 h-6" />
            </button>
          </div>
        );
      case 'active_chat':
      case 'processing':
      default:
        return (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-50"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={appState !== 'active_chat'}
            />
            <button onClick={handleSend} disabled={isLoading || !text.trim() || appState !== 'active_chat'} className="p-3 bg-teal-600 hover:bg-teal-500 rounded-full transition-colors disabled:opacity-50 disabled:bg-gray-600">
              <SendIcon className="w-6 h-6" />
            </button>
          </div>
        );
    }
  };

  return <div className="w-full max-w-4xl mx-auto">{renderContent()}</div>;
};
