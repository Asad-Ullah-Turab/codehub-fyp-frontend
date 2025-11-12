import React from 'react';

interface LanguageCardProps {
  language: string;
  emoji: string;
  tutorialCount: number;
  onClick: () => void;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  emoji,
  tutorialCount,
  onClick,
}) => {
  return (
    <div 
      className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-white relative overflow-hidden"
      onClick={onClick}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{emoji}</div>
          <div>
            <h3 className="text-xl font-bold capitalize">{language}</h3>
            <p className="text-white/80">
              {tutorialCount} tutorial{tutorialCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="text-2xl transform group-hover:translate-x-1 transition-transform duration-300">
          →
        </div>
      </div>
    </div>
  );
};

export default LanguageCard;