import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchTutorialById,
  type Tutorial 
} from '../../functions/TutorialFunctions/tutorialFunctions';

const TutorialDetailPage: React.FC = () => {
  const { language, tutorialId } = useParams<{ language: string; tutorialId: string }>();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTutorial = React.useCallback(async () => {
    if (!tutorialId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tutorialData = await fetchTutorialById(tutorialId);
      setTutorial(tutorialData);
    } catch (err) {
      console.error('Error loading tutorial:', err);
      setError('Failed to load tutorial. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [tutorialId]);

  React.useEffect(() => {
    loadTutorial();
  }, [loadTutorial]);

  const handleBackClick = () => {
    if (language) {
      navigate(`/tutorials/${language}`);
    } else {
      navigate('/tutorials');
    }
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

  if (loading) {
    return (
      <div className="tutorial-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="tutorial-detail-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Tutorial not found</h2>
          <p>{error || 'The tutorial you are looking for does not exist.'}</p>
          <button className="back-button" onClick={handleBackClick}>
            Back to Tutorials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tutorial-detail-page">
      <div className="tutorial-container">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to {language ? `${language.charAt(0).toUpperCase()}${language.slice(1)}` : 'Tutorials'}
        </button>
        
        <div className="tutorial-header">
          <div className="tutorial-badges">
            <span className="language-badge">{tutorial.language.toUpperCase()}</span>
            <span className="concept-badge">{tutorial.concept}</span>
            <span 
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(tutorial.difficulty) }}
            >
              {tutorial.difficulty}
            </span>
          </div>
          
          <h1 className="tutorial-title">{tutorial.title}</h1>
          <p className="tutorial-description">{tutorial.description}</p>
          
          {tutorial.tags && tutorial.tags.length > 0 && (
            <div className="tutorial-tags">
              {tutorial.tags.map((tag, index) => (
                <span key={index} className="tutorial-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="tutorial-content">
          <div className="content-section">
            <h2>Tutorial Content</h2>
            <div 
              className="tutorial-text"
              dangerouslySetInnerHTML={{ __html: tutorial.content }}
            />
          </div>
          
          {tutorial.notes && tutorial.notes.length > 0 && (
            <div className="content-section">
              <h2>Notes</h2>
              <div className="notes-list">
                {tutorial.notes.map((note, index) => (
                  <div key={index} className="note-item">
                    <div className="note-icon">📝</div>
                    <p>{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {tutorial.tips && tutorial.tips.length > 0 && (
            <div className="content-section">
              <h2>Tips</h2>
              <div className="tips-list">
                {tutorial.tips.map((tip, index) => (
                  <div key={index} className="tip-item">
                    <div className="tip-icon">💡</div>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {tutorial.codeExamples && tutorial.codeExamples.length > 0 && (
            <div className="content-section">
              <h2>Code Examples</h2>
              <div className="examples-list">
                {tutorial.codeExamples.map((example, index) => (
                  <div key={index} className="example-card">
                    <div className="example-header">
                      <h3>{example.title}</h3>
                      <p>{example.description}</p>
                    </div>
                    
                    <div className="code-block">
                      <div className="code-header">
                        <span>Code</span>
                        <button 
                          className="copy-button"
                          onClick={() => navigator.clipboard.writeText(example.code)}
                        >
                          Copy
                        </button>
                      </div>
                      <pre><code>{example.code}</code></pre>
                    </div>
                    
                    {example.input && (
                      <div className="code-block">
                        <div className="code-header">
                          <span>Input</span>
                        </div>
                        <pre><code>{example.input}</code></pre>
                      </div>
                    )}
                    
                    {example.expectedOutput && (
                      <div className="code-block">
                        <div className="code-header">
                          <span>Expected Output</span>
                        </div>
                        <pre><code>{example.expectedOutput}</code></pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialDetailPage;