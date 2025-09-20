import React from 'react';
import ReactMarkdown from 'react-markdown';
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

      <div className={`max-w-xl rounded-2xl shadow ${
        isUser
          ? 'bg-teal-600'
          : 'bg-gray-700'
      }`}>
        <div className="p-4">
          {typeof message.content === 'string' ? (
            // Apply styling to a wrapper div, not the component itself
            <div className="prose prose-invert prose-sm">
              <ReactMarkdown
                components={{
                  // This ensures links open in a new tab
                  a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            message.content
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-700">
          <UserIcon className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );
};