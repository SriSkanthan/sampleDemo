
import React from 'react';
import { FoodAnalysisResult } from '../types';
import { ScoreDisplay } from './ScoreDisplay';
import { ThumbsUpIcon, ThumbsDownIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface FoodAnalysisCardProps {
  result: FoodAnalysisResult;
}

export const FoodAnalysisCard: React.FC<FoodAnalysisCardProps> = ({ result }) => {
  return (
    <div className="space-y-4 p-1">
      <ScoreDisplay score={result.healthScore} title="Health Score" />
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="flex items-center text-lg font-semibold text-green-400 mb-2">
          <ThumbsUpIcon className="w-5 h-5 mr-2" />
          Merits
        </h3>
        <ul className="list-none space-y-1 text-gray-300">
          {result.summary.merits.map((item, i) => (
            <li key={i} className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" /> {item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="flex items-center text-lg font-semibold text-red-400 mb-2">
          <ThumbsDownIcon className="w-5 h-5 mr-2" />
          Demerits
        </h3>
        <ul className="list-none space-y-1 text-gray-300">
          {result.summary.demerits.map((item, i) => (
            <li key={i} className="flex items-start"><XCircleIcon className="w-5 h-5 text-red-500 mr-2 mt-1 flex-shrink-0" /> {item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-200 mb-3">Ingredient Breakdown</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-green-400 mb-1">Beneficial Ingredients</h4>
            {result.beneficialIngredients.map((ing, i) => (
              <p key={i} className="text-sm text-gray-400"><strong className="text-gray-300">{ing.name}:</strong> {ing.benefit}</p>
            ))}
          </div>
          <div>
            <h4 className="font-semibold text-red-400 mb-1">Potentially Harmful Ingredients</h4>
            {result.harmfulIngredients.map((ing, i) => (
              <p key={i} className="text-sm text-gray-400"><strong className="text-gray-300">{ing.name}:</strong> {ing.risk}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
