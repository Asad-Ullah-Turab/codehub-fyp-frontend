import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchTutorialsByLanguageAndConcept,
  type Tutorial 
} from '../../functions/TutorialFunctions/tutorialFunctions';
import './LanguageTutorialsPage.css';

const LanguageTutorialsPage: React.FC = () => {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTutorials = React.useCallback(async () => {
    if (!language) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch tutorials for this language
      const tutorialsData = await fetchTutorialsByLanguageAndConcept(language, 'all');
      setTutorials(tutorialsData);
    } catch (err) {
      console.error('Error loading tutorials:', err);
      setError('Failed to load tutorials. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    loadTutorials();
  }, [loadTutorials]);

  const handleTutorialClick = (tutorialId: string) => {
    navigate(`/tutorials/${language}/${tutorialId}`);
  };

  const handleBackClick = () => {
    navigate('/tutorials');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#28a745';
      case 'intermediate':
        return '#ffc107';
      case 'advanced':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getLanguageEmoji = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return '🐍';
      case 'javascript':
        return '🟨';
      case 'cpp':
        return '⚡';
      default:
        return '💻';
    }
  };

  if (loading) {
    return (
      <div className="language-tutorials-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading {language} tutorials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="language-tutorials-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={loadTutorials}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="language-tutorials-page">
      <div className="tutorials-container">
        <div className="page-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back to Tutorials
          </button>
          
          <div className="language-header">
            <div className="language-emoji">{getLanguageEmoji(language || '')}</div>
            <div className="language-info">
              <h1 className="language-title">
                {language ? language.charAt(0).toUpperCase() + language.slice(1) : 'Language'} Tutorials
              </h1>
              <p className="tutorials-count">
                {tutorials.length} tutorial{tutorials.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>

        {tutorials.length > 0 ? (
          <div className="tutorials-grid">
            {tutorials.map((tutorial) => (
              <div 
                key={tutorial._id} 
                className="tutorial-card"
                onClick={() => handleTutorialClick(tutorial._id)}
              >
                <div className="tutorial-header">
                  <div className="tutorial-concept">{tutorial.concept}</div>
                  <div 
                    className="tutorial-difficulty"
                    style={{ backgroundColor: getDifficultyColor(tutorial.difficulty) }}
                  >
                    {tutorial.difficulty}
                  </div>
                </div>
                
                <div className="tutorial-content">
                  <h3 className="tutorial-title">{tutorial.title}</h3>
                  <p className="tutorial-description">{tutorial.description}</p>
                  
                  {tutorial.tags && tutorial.tags.length > 0 && (
                    <div className="tutorial-tags">
                      {tutorial.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tutorial-tag">
                          {tag}
                        </span>
                      ))}
                      {tutorial.tags.length > 3 && (
                        <span className="tutorial-tag more-tags">
                          +{tutorial.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="tutorial-footer">
                  <div className="tutorial-examples">
                    📝 {tutorial.codeExamples?.length || 0} examples
                  </div>
                  <div className="tutorial-arrow">→</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tutorials">
            <div className="no-tutorials-icon">📚</div>
            <h3>No tutorials found</h3>
            <p>There are no tutorials available for {language} yet.</p>
            <button className="back-button-alt" onClick={handleBackClick}>
              Browse Other Languages
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageTutorialsPage;