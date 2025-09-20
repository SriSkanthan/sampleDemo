
import React from 'react';
import { ElectronicsAnalysisResult } from '../types';
import { ScoreDisplay } from './ScoreDisplay';
import { ThumbsUpIcon, ThumbsDownIcon, CheckCircleIcon, XCircleIcon, ZapIcon, GlobeIcon } from './icons';

interface ElectronicsAnalysisCardProps {
  result: ElectronicsAnalysisResult;
}

export const ElectronicsAnalysisCard: React.FC<ElectronicsAnalysisCardProps> = ({ result }) => {
  return (
    <div className="space-y-4 p-1">
      <ScoreDisplay score={result.ecoScore} title="Eco Score" />
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">Eco-Impact Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div className="flex items-center">
            <GlobeIcon className="w-6 h-6 text-blue-400 mr-3" />
            <div>
              <p className="font-semibold">{result.carbonFootprint}</p>
              <p className="text-sm text-gray-400">Lifetime Carbon Footprint</p>
            </div>
          </div>
          <div className="flex items-center">
            <ZapIcon className="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <p className="font-semibold">{result.annualEnergyConsumption}</p>
              <p className="text-sm text-gray-400">Annual Energy Use</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">Device Type: {result.deviceType}</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="flex items-center text-lg font-semibold text-green-400 mb-2">
          <ThumbsUpIcon className="w-5 h-5 mr-2" />
          Merits
        </h3>
        <ul className="list-none space-y-1 text-gray-300">
          {result.analysis.merits.map((item, i) => (
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
          {result.analysis.demerits.map((item, i) => (
            <li key={i} className="flex items-start"><XCircleIcon className="w-5 h-5 text-red-500 mr-2 mt-1 flex-shrink-0" /> {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
