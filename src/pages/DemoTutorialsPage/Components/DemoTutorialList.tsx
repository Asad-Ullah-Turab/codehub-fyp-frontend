import React from 'react';
import { type TutorialItem } from '../../../functions';
import './DemoTutorialList.css';

interface TutorialListProps {
  tutorials: TutorialItem[];
  selectedTutorial: TutorialItem | null;
  savedTutorials: string[];
  loading: boolean;
  onSelectTutorial: (tutorial: TutorialItem) => void;
  onSaveTutorial: (tutorial: TutorialItem) => void;
  onUnsaveTutorial: (tutorialId: string) => void;
}

const TutorialList: React.FC<TutorialListProps> = ({
  tutorials,
  selectedTutorial,
  savedTutorials,
  loading,
  onSelectTutorial,
  onSaveTutorial,
  onUnsaveTutorial
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="tutorial-list">
      <h3>📖 Available Tutorials</h3>
      
      {loading ? (
        <div className="tutorial-loading">
          <p>Loading tutorials...</p>
        </div>
      ) : tutorials.length === 0 ? (
        <div className="tutorial-empty">
          <p>No tutorials available</p>
        </div>
      ) : (
        <div className="tutorials-scroll">
          {tutorials.map(tutorial => (
            <div
              key={tutorial._id}
              className={`tutorial-item ${
                selectedTutorial?._id === tutorial._id ? 'active' : ''
              }`}
              onClick={() => onSelectTutorial(tutorial)}
            >
              <div className="tutorial-item-header">
                <h4>{tutorial.title}</h4>
                <span
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(tutorial.difficulty) }}
                >
                  {tutorial.difficulty}
                </span>
              </div>
              
              <p className="tutorial-description">{tutorial.description}</p>
              
              <div className="tutorial-item-footer">
                <span className="concept-tag">🏷️ {tutorial.concept}</span>
                <button
                  className={`save-btn ${
                    savedTutorials.includes(tutorial._id) ? 'saved' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (savedTutorials.includes(tutorial._id)) {
                      onUnsaveTutorial(tutorial._id);
                    } else {
                      onSaveTutorial(tutorial);
                    }
                  }}
                  title={
                    savedTutorials.includes(tutorial._id)
                      ? 'Remove from saved'
                      : 'Save tutorial'
                  }
                >
                  {savedTutorials.includes(tutorial._id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorialList;
