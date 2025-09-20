
import React, { useState } from 'react';

interface RecipePromptProps {
  onGenerate: () => void;
}

export const RecipePrompt: React.FC<RecipePromptProps> = ({ onGenerate }) => {
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    onGenerate();
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <p>Would you like a recipe for a healthier, homemade version? You can also ask me any questions about this analysis.</p>
      <button
        onClick={handleClick}
        disabled={isClicked}
        className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        aria-label="Generate a healthier recipe"
      >
        ✨ Generate Healthier Recipe
      </button>
    </div>
  );
};
