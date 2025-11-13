import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTutorialsByLanguageAndConcept,
  saveTutorial,
  unsaveTutorial,
  getSavedTutorials,
  type Tutorial,
} from "../../../functions/TutorialFunctions/tutorialFunctions";
import { useAuth } from "../../../hooks/useAuth";
import AIChatAssistant from "../../../components/AIChatAssistant";

const TutorialsDetailPage: React.FC = () => {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tutorialLoading, setTutorialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingTutorial, setSavingTutorial] = useState(false);
  const [showAIChat, setShowAIChat] = useState(true);

  const handleTutorialSelect = async (tutorial: Tutorial) => {
    console.log("Tutorial selected:", tutorial.title, tutorial._id);
    console.log("Full tutorial object:", tutorial);
    console.log(
      "Tutorial has content:",
      !!tutorial.content,
      "Content length:",
      tutorial.content?.length
    );

    try {
      setTutorialLoading(true);

      // Always use the tutorial data we have since backend API is failing
      // The tutorials list should have all the data we need
      console.log("Using tutorial data directly (API may be unavailable)");
      setSelectedTutorial(tutorial);

      // Check if tutorial is saved
      if (isAuthenticated) {
        try {
          const savedTutorials = await getSavedTutorials();
          const isCurrentTutorialSaved = savedTutorials.data?.some(
            (saved) => saved.tutorial?._id === tutorial._id
          );
          setIsSaved(!!isCurrentTutorialSaved);
        } catch (saveCheckError) {
          console.log("Could not check save status:", saveCheckError);
          setIsSaved(false);
        }
      } else {
        setIsSaved(false);
      }
    } catch (err) {
      console.error("Error loading tutorial details:", err);
      // Still try to show the tutorial with whatever data we have
      setSelectedTutorial(tutorial);
      setError(null); // Clear any previous errors
    } finally {
      setTutorialLoading(false);
    }
  };

  React.useEffect(() => {
    const loadTutorials = async () => {
      if (!language) return;

      try {
        setLoading(true);
        setError(null);

        console.log("Loading tutorials for language:", language);
        const tutorialsData = await fetchTutorialsByLanguageAndConcept(
          language,
          "all"
        );
        console.log("Tutorials loaded:", tutorialsData.length, tutorialsData);
        console.log("First tutorial full data:", JSON.stringify(tutorialsData[0], null, 2));
        setTutorials(tutorialsData);

        // Don't auto-select, let user choose
        setSelectedTutorial(null);
      } catch (err) {
        console.error("Error loading tutorials:", err);
        setError("Failed to load tutorials. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadTutorials();
  }, [language]);

  const handleBackClick = () => {
    navigate("/tutorials");
  };

  const handleSaveTutorial = async () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    if (!selectedTutorial?._id) return;

    try {
      setSavingTutorial(true);

      if (isSaved) {
        await unsaveTutorial(selectedTutorial._id);
        setIsSaved(false);
      } else {
        await saveTutorial(selectedTutorial._id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error saving/unsaving tutorial:", err);
    } finally {
      setSavingTutorial(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Loading {language} tutorials...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed left-0 top-1/2 z-50 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg shadow-lg transition-all"
          style={{
            transform: `translateY(-50%) ${
              sidebarOpen ? "translateX(256px)" : "translateX(0)"
            }`,
          }}
        >
          {sidebarOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>

        {/* Sidebar - Similar to image */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden flex flex-col`}
        >
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Filter tutorials"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
            <div className="space-y-2">
              {tutorials.map((tutorial) => (
                <div
                  key={tutorial._id}
                  onClick={() => handleTutorialSelect(tutorial)}
                  className={`p-3 rounded-lg cursor-pointer transition-all text-sm ${
                    selectedTutorial?._id === tutorial._id
                      ? "bg-blue-50 border border-blue-200 text-blue-800"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="font-medium mb-1">• {tutorial.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Tutorial Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {selectedTutorial ? (
              <>
                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-200 px-6 py-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <button
                      onClick={handleBackClick}
                      className="hover:text-blue-600"
                    >
                      Home
                    </button>
                    <span className="mx-2">/</span>
                    <span className="hover:text-blue-600 cursor-pointer">
                      {selectedTutorial.language}
                    </span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">
                      {selectedTutorial.concept}
                    </span>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto p-8">
                  {tutorialLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    <>
                      {/* Tutorial Header */}
                      <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                          {selectedTutorial.title}
                        </h1>

                        {selectedTutorial.description && (
                          <p className="text-gray-700 mb-6">
                            {selectedTutorial.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {selectedTutorial.language.toUpperCase()}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                                selectedTutorial.difficulty
                              )}`}
                            >
                              {selectedTutorial.difficulty}
                            </span>
                          </div>

                          <button
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              isSaved
                                ? "bg-red-50 text-red-600 border border-red-200"
                                : "bg-blue-50 text-blue-600 border border-blue-200"
                            } ${
                              savingTutorial ? "opacity-60" : "hover:shadow-md"
                            }`}
                            onClick={handleSaveTutorial}
                            disabled={savingTutorial}
                          >
                            {isSaved ? "Saved ❤️" : "Save 🤍"}
                          </button>
                        </div>
                      </div>
                      {/* Tutorial Content */}
                      {selectedTutorial.content &&
                        selectedTutorial.content.length > 0 && (
                          <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                              Content
                            </h2>
                            <div className="prose prose-lg max-w-none bg-white rounded-lg p-6 border border-gray-200">
                              {selectedTutorial.content.split('\n').map((line, index) => {
                                // Render Markdown-style content as HTML
                                if (line.startsWith('## ')) {
                                  return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                                } else if (line.startsWith('### ')) {
                                  return <h3 key={index} className="text-xl font-semibold text-gray-800 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                                } else if (line.startsWith('- **') && line.includes('**:')) {
                                  const match = line.match(/- \*\*(.*?)\*\*:(.*)/);
                                  if (match) {
                                    return <li key={index} className="ml-4 text-gray-700"><strong>{match[1]}</strong>:{match[2]}</li>;
                                  }
                                  return <li key={index} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>;
                                } else if (line.startsWith('- ')) {
                                  return <li key={index} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>;
                                } else if (line.trim() === '') {
                                  return <br key={index} />;
                                } else if (line.includes('**')) {
                                  // Handle bold text
                                  const parts = line.split('**');
                                  return (
                                    <p key={index} className="text-gray-700 mb-2">
                                      {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                                    </p>
                                  );
                                } else {
                                  return <p key={index} className="text-gray-700 mb-2">{line}</p>;
                                }
                              })}
                            </div>
                          </div>
                        )}
                      {/* Code Examples */}
                      {selectedTutorial.codeExamples &&
                        selectedTutorial.codeExamples.length > 0 && (
                          <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                              Code Examples
                            </h2>
                            {selectedTutorial.codeExamples.map(
                              (example, index) => (
                                <div key={index} className="mb-6">
                                  {example.description && (
                                    <p className="text-gray-700 mb-3">
                                      {example.description}
                                    </p>
                                  )}
                                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                                      <span className="text-white text-sm font-medium">
                                        {example.title}
                                      </span>
                                      <button
                                        className="flex items-center space-x-1 text-white text-sm hover:text-gray-300"
                                        onClick={() =>
                                          navigator.clipboard.writeText(
                                            example.code
                                          )
                                        }
                                      >
                                        <span>📋</span>
                                        <span>Copy</span>
                                      </button>
                                    </div>
                                    <pre className="p-4 text-sm text-gray-100 overflow-x-auto hide-scrollbar">
                                      <code>{example.code}</code>
                                    </pre>
                                  </div>

                                  {/* Input/Output Section */}
                                  {(example.input ||
                                    example.expectedOutput) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                      {example.input && (
                                        <div className="bg-blue-50 rounded-lg p-4">
                                          <h4 className="text-sm font-semibold text-blue-900 mb-2">
                                            Input:
                                          </h4>
                                          <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                                            {example.input}
                                          </pre>
                                        </div>
                                      )}
                                      {example.expectedOutput && (
                                        <div className="bg-green-50 rounded-lg p-4">
                                          <h4 className="text-sm font-semibold text-green-900 mb-2">
                                            Expected Output:
                                          </h4>
                                          <pre className="text-sm text-green-800 whitespace-pre-wrap">
                                            {example.expectedOutput}
                                          </pre>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}{" "}
                      {/* Key Takeaways Box */}
                      {selectedTutorial.notes &&
                        selectedTutorial.notes.length > 0 && (
                          <div className="bg-gray-100 rounded-lg p-6 mb-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                              Key Takeaways
                            </h2>
                            <ul className="space-y-2">
                              {selectedTutorial.notes.map((note, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-gray-700 mr-2">•</span>
                                  <span className="text-gray-700">{note}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      {/* Tips Section */}
                      {selectedTutorial.tips &&
                        selectedTutorial.tips.length > 0 && (
                          <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                              Tips
                            </h2>
                            <div className="space-y-3">
                              {selectedTutorial.tips.map((tip, index) => (
                                <div
                                  key={index}
                                  className="flex space-x-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400"
                                >
                                  <div className="text-yellow-600 text-xl">
                                    💡
                                  </div>
                                  <p className="text-gray-700">{tip}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      {/* Tags Section */}
                      {selectedTutorial.tags &&
                        selectedTutorial.tags.length > 0 && (
                          <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                              Tags
                            </h2>
                            <div className="flex flex-wrap gap-2">
                              {selectedTutorial.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {/* Navigation Buttons */}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                        <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900">
                          <span>←</span>
                          <span>Previous</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                          <span>Next</span>
                          <span>→</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">👆</div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Tutorial
                  </h2>
                  <p className="text-gray-600">
                    Choose a tutorial from the sidebar to get started
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* AI Assistant Panel */}
          {showAIChat && (
            <div className="w-96 flex-shrink-0">
              <AIChatAssistant
                context="tutorial"
                contextTitle={selectedTutorial?.title}
              />
            </div>
          )}
        </div>

        {/* AI Chat Toggle Button */}
        <button
          onClick={() => setShowAIChat(!showAIChat)}
          className="fixed right-0 top-1/2 z-50 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-l-lg shadow-lg transition-all"
          style={{
            transform: `translateY(-50%) ${
              showAIChat ? "translateX(-384px)" : "translateX(0)"
            }`,
          }}
        >
          {showAIChat ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
};

export default TutorialsDetailPage;
