
import React from 'react';
import { ChatMessage } from '../types';
import { UserIcon, BotIcon } from './icons';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-700">
            <BotIcon className="w-6 h-6 text-teal-400" />
        </div>
      )}
      
      <div className={`max-w-xl p-4 rounded-2xl shadow ${
        isUser
          ? 'bg-teal-600 rounded-br-none'
          : 'bg-gray-700 rounded-bl-none'
      }`}>
        {typeof message.content === 'string' ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          message.content
        )}
      </div>

      {isUser && (
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-700">
            <UserIcon className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );
};
