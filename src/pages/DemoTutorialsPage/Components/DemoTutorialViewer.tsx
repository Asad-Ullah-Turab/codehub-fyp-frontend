import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type TutorialItem } from "../../../functions";
import "./DemoTutorialViewer.css";

interface TutorialViewerProps {
  tutorial: TutorialItem;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
}

const TutorialViewer: React.FC<TutorialViewerProps> = ({
  tutorial,
  isSaved,
  onSave,
  onUnsave,
}) => {
  const navigate = useNavigate();
  const [selectedExample, setSelectedExample] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const getLanguageIcon = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "python":
        return "🐍";
      case "javascript":
        return "🟨";
      case "cpp":
        return "⚙️";
      default:
        return "💻";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "#10b981";
      case "intermediate":
        return "#f59e0b";
      case "advanced":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const handleCopyCode = () => {
    const code = tutorial.codeExamples[selectedExample].code;
    navigator.clipboard.writeText(code).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleRunCode = () => {
    const code = tutorial.codeExamples[selectedExample].code;
    const language = tutorial.language;

    // Navigate to editor with code and language as state
    navigate("/editor", {
      state: {
        code,
        language,
        tutorialTitle: tutorial.title,
        exampleTitle: tutorial.codeExamples[selectedExample].title,
      },
    });
  };

  return (
    <div className="tutorial-viewer">
      {/* Header */}
      <div className="viewer-header">
        <div className="header-top">
          <h2>{tutorial.title}</h2>
          <button
            className={`save-tutorial-btn ${isSaved ? "saved" : ""}`}
            onClick={isSaved ? onUnsave : onSave}
          >
            {isSaved ? "❤️ Saved" : "🤍 Save"}
          </button>
        </div>

        <div className="header-meta">
          <span className="language-badge">
            {getLanguageIcon(tutorial.language)}{" "}
            {tutorial.language.toUpperCase()}
          </span>
          <span
            className="difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(tutorial.difficulty) }}
          >
            {tutorial.difficulty}
          </span>
          <span className="concept-badge">📚 {tutorial.concept}</span>
        </div>

        <p className="tutorial-description">{tutorial.description}</p>
      </div>

      {/* Main Content */}
      <div className="viewer-content">
        <section className="content-section">
          <h3>📖 Content</h3>
          <div className="content-text">
            {tutorial.content.split("\n").map((line, idx) => {
              if (line.startsWith("##")) {
                return <h3 key={idx}>{line.replace("##", "").trim()}</h3>;
              } else if (line.startsWith("###")) {
                return <h4 key={idx}>{line.replace("###", "").trim()}</h4>;
              } else if (line.startsWith("-")) {
                return <li key={idx}>{line.replace("-", "").trim()}</li>;
              } else if (line.trim() === "") {
                return <br key={idx} />;
              }
              return <p key={idx}>{line}</p>;
            })}
          </div>
        </section>

        {/* Notes and Tips */}
        <div className="notes-tips-container">
          {tutorial.notes && tutorial.notes.length > 0 && (
            <section className="content-section">
              <h3>📝 Key Notes</h3>
              <ul className="notes-list">
                {tutorial.notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </section>
          )}

          {tutorial.tips && tutorial.tips.length > 0 && (
            <section className="content-section">
              <h3>💡 Tips & Best Practices</h3>
              <ul className="tips-list">
                {tutorial.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Code Examples */}
        {tutorial.codeExamples && tutorial.codeExamples.length > 0 && (
          <section className="content-section code-examples-section">
            <h3>👨‍💻 Code Examples</h3>

            {/* Example Selector */}
            <div className="examples-selector">
              {tutorial.codeExamples.map((example, idx) => (
                <button
                  key={idx}
                  className={`example-btn ${
                    selectedExample === idx ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedExample(idx);
                    setShowOutput(false);
                  }}
                >
                  {example.title}
                </button>
              ))}
            </div>

            {/* Selected Example */}
            {tutorial.codeExamples[selectedExample] && (
              <div className="example-viewer">
                <div className="example-header">
                  <h4>{tutorial.codeExamples[selectedExample].title}</h4>
                  <p>{tutorial.codeExamples[selectedExample].description}</p>
                </div>

                {/* Code Display */}
                <div className="code-container">
                  <pre>
                    <code className={`language-${tutorial.language}`}>
                      {tutorial.codeExamples[selectedExample].code}
                    </code>
                  </pre>
                  <button
                    className="copy-btn"
                    title="Copy code"
                    onClick={handleCopyCode}
                  >
                    {copySuccess ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>

                {/* Output Section */}
                {tutorial.codeExamples[selectedExample].expectedOutput && (
                  <div className="output-section">
                    <button
                      className="output-toggle"
                      onClick={() => setShowOutput(!showOutput)}
                    >
                      {showOutput ? "▼" : "▶"} Expected Output
                    </button>
                    {showOutput && (
                      <pre className="output-display">
                        {tutorial.codeExamples[selectedExample].expectedOutput}
                      </pre>
                    )}
                  </div>
                )}

                {/* Try It Button */}
                <div className="action-buttons">
                  <button className="try-btn" onClick={handleRunCode}>
                    ▶️ Run Code
                  </button>
                  <button className="ai-btn">🤖 Get AI Explanation</button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Tags */}
      {tutorial.tags && tutorial.tags.length > 0 && (
        <div className="viewer-tags">
          {tutorial.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* AI Tutorial Generation CTA */}
      <div className="ai-generation-cta">
        <p>
          🤖 <strong>Want personalized learning?</strong> Our AI can generate
          custom tutorials tailored to your learning pace and style.
        </p>
        <button className="cta-btn">Generate Custom Tutorial</button>
      </div>
    </div>
  );
};

export default TutorialViewer;
