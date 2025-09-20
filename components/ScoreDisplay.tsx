
import React from 'react';

interface ScoreDisplayProps {
  score: number;
  title: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, title }) => {
  const getScoreColor = (s: number) => {
    if (s >= 75) return 'text-green-400';
    if (s >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrackColor = (s: number) => {
    if (s >= 75) return 'stroke-green-400';
    if (s >= 40) return 'stroke-yellow-400';
    return 'stroke-red-400';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-700"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className={getTrackColor(score)}
            strokeWidth="10"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              transition: 'stroke-dashoffset 0.5s ease-in-out'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
      <h2 className="text-xl font-semibold mt-3">{title}</h2>
    </div>
  );
};
