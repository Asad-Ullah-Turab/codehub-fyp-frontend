import React from 'react';
import './DemoLanguageSelector.css';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  const languages = [
    { id: 'python', name: '🐍 Python', icon: '🐍' },
    { id: 'javascript', name: '🟨 JavaScript', icon: '🟨' },
    { id: 'cpp', name: '⚙️ C++', icon: '⚙️' }
  ];

  return (
    <div className="language-selector">
      <h3>Select Language</h3>
      <div className="language-buttons">
        {languages.map(lang => (
          <button
            key={lang.id}
            className={`language-btn ${selectedLanguage === lang.id ? 'active' : ''}`}
            onClick={() => onLanguageChange(lang.id)}
            title={`Learn ${lang.name}`}
          >
            <span className="language-icon">{lang.icon}</span>
            <span className="language-text">{lang.name.split(' ')[1]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
