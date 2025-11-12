import React from 'react';
import './LanguageCard.css';

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
    <div className="language-card" onClick={onClick}>
      <div className="language-emoji">{emoji}</div>
      <div className="language-info">
        <h3 className="language-name">{language}</h3>
        <p className="tutorial-count">
          {tutorialCount} tutorial{tutorialCount !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="card-arrow">→</div>
    </div>
  );
};

export default LanguageCard;