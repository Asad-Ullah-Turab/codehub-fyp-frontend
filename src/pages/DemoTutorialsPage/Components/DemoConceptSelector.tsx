import React from 'react';
import './DemoConceptSelector.css';

interface ConceptSelectorProps {
  concepts: string[];
  selectedConcept: string;
  onConceptChange: (concept: string) => void;
}

const ConceptSelector: React.FC<ConceptSelectorProps> = ({
  selectedConcept,
  concepts,
  onConceptChange
}) => {
  return (
    <div className="concept-selector">
      <h3>Main Concepts</h3>
      <p className="concept-subtitle">Select a concept to learn</p>
      
      <div className="concepts-list">
        {/* Show all concepts button */}
        <button
          className={`concept-btn ${selectedConcept === '' ? 'active' : ''}`}
          onClick={() => onConceptChange('')}
        >
          📋 All Concepts
        </button>

        {/* Individual concepts */}
        {concepts.map(concept => (
          <button
            key={concept}
            className={`concept-btn ${selectedConcept === concept ? 'active' : ''}`}
            onClick={() => onConceptChange(concept)}
          >
            ✨ {concept}
          </button>
        ))}
      </div>

      <div className="concept-info">
        <p className="info-text">
          💡 Tip: Select a concept to see tutorials specific to that topic. AI can generate custom tutorials based on your learning pace.
        </p>
      </div>
    </div>
  );
};

export default ConceptSelector;
