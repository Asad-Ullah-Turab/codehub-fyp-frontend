import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTutorialsByLanguageAndConcept,
  fetchTutorialById,
  saveTutorial,
  unsaveTutorial,
  getSavedTutorials,
  type Tutorial,
} from "../../../functions/TutorialFunctions/tutorialFunctions";
import { useAuth } from "../../../hooks/useAuth";
import AIChatAssistant from "../../../components/AIChatAssistant";

const LanguageTutorialsPage: React.FC = () => {
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

  const loadTutorials = React.useCallback(async () => {
    if (!language) return;

    try {
      setLoading(true);
      setError(null);

      const tutorialsData = await fetchTutorialsByLanguageAndConcept(
        language,
        "all"
      );
      setTutorials(tutorialsData);

      // Auto-select first tutorial if available
      if (tutorialsData.length > 0) {
        setSelectedTutorial(tutorialsData[0]);
      }
    } catch (err) {
      console.error("Error loading tutorials:", err);
      setError("Failed to load tutorials. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [language]);

  React.useEffect(() => {
    loadTutorials();
  }, [loadTutorials]);

  const handleTutorialSelect = async (tutorial: Tutorial) => {
    if (selectedTutorial?._id === tutorial._id) return;

    try {
      setTutorialLoading(true);
      const fullTutorial = await fetchTutorialById(tutorial._id);
      setSelectedTutorial(fullTutorial);

      // Check if tutorial is saved
      if (isAuthenticated) {
        try {
          const savedTutorials = await getSavedTutorials();
          const isCurrentTutorialSaved = savedTutorials.data.some(
            (saved) => saved.tutorial._id === tutorial._id
          );
          setIsSaved(isCurrentTutorialSaved);
        } catch (saveCheckError) {
          console.log("Could not check save status:", saveCheckError);
          setIsSaved(false);
        }
      } else {
        setIsSaved(false);
      }
    } catch (err) {
      console.error("Error loading tutorial details:", err);
    } finally {
      setTutorialLoading(false);
    }
  };

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

  const getLanguageEmoji = (lang: string) => {
    switch (lang?.toLowerCase()) {
      case "python":
        return "🐍";
      case "javascript":
        return "🟨";
      case "cpp":
        return "⚡";
      default:
        return "💻";
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
            onClick={loadTutorials}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackClick}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <span>←</span>
                <span>Back to Tutorials</span>
              </button>

              <div className="flex items-center space-x-3">
                <span className="text-3xl">
                  {getLanguageEmoji(language || "")}
                </span>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language
                      ? language.charAt(0).toUpperCase() + language.slice(1)
                      : "Language"}{" "}
                    Tutorials
                  </h1>
                  <p className="text-sm text-gray-500">
                    {tutorials.length} tutorial
                    {tutorials.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden bg-gray-100 hover:bg-gray-200 p-2 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                All Tutorials
              </h2>

              {tutorials.length > 0 ? (
                <div className="space-y-3">
                  {tutorials.map((tutorial) => (
                    <div
                      key={tutorial._id}
                      onClick={() => handleTutorialSelect(tutorial)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedTutorial?._id === tutorial._id
                          ? "bg-indigo-50 border-2 border-indigo-200"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-indigo-600">
                          {tutorial.concept}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            tutorial.difficulty
                          )}`}
                        >
                          {tutorial.difficulty}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                        {tutorial.title}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-2">
                        {tutorial.description}
                      </p>

                      {tutorial.tags && tutorial.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tutorial.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {tutorial.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{tutorial.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📚</div>
                  <p className="text-gray-500">No tutorials found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {selectedTutorial ? (
            <div className="h-full overflow-y-auto bg-white">
              {tutorialLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto p-8">
                  {/* Tutorial Header */}
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-3 mb-4 items-center justify-between">
                      <div className="flex flex-wrap gap-3">
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                          {selectedTutorial.language.toUpperCase()}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {selectedTutorial.concept}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                            selectedTutorial.difficulty
                          )}`}
                        >
                          {selectedTutorial.difficulty}
                        </span>
                      </div>

                      {/* Save Button */}
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 ${
                          isSaved
                            ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                            : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                        } ${
                          savingTutorial
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:shadow-md"
                        }`}
                        onClick={handleSaveTutorial}
                        disabled={savingTutorial}
                      >
                        {savingTutorial ? (
                          <span className="animate-pulse">⏳</span>
                        ) : (
                          <span className="text-lg">
                            {isSaved ? "❤️" : "🤍"}
                          </span>
                        )}
                        <span className="font-medium">
                          {savingTutorial
                            ? "Saving..."
                            : isSaved
                            ? "Saved"
                            : "Save Tutorial"}
                        </span>
                      </button>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {selectedTutorial.title}
                    </h1>

                    <p className="text-lg text-gray-600 mb-6">
                      {selectedTutorial.description}
                    </p>

                    {selectedTutorial.tags &&
                      selectedTutorial.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTutorial.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Tutorial Content */}
                  <div className="prose prose-lg max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedTutorial.content,
                      }}
                    />
                  </div>

                  {/* Notes Section */}
                  {selectedTutorial.notes &&
                    selectedTutorial.notes.length > 0 && (
                      <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                          Notes
                        </h2>
                        <div className="space-y-4">
                          {selectedTutorial.notes.map((note, index) => (
                            <div
                              key={index}
                              className="flex space-x-3 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400"
                            >
                              <div className="text-blue-600 text-xl">📝</div>
                              <p className="text-gray-700">{note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Tips Section */}
                  {selectedTutorial.tips &&
                    selectedTutorial.tips.length > 0 && (
                      <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                          Tips
                        </h2>
                        <div className="space-y-4">
                          {selectedTutorial.tips.map((tip, index) => (
                            <div
                              key={index}
                              className="flex space-x-3 p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-400"
                            >
                              <div className="text-yellow-600 text-xl">💡</div>
                              <p className="text-gray-700">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Code Examples Section */}
                  {selectedTutorial.codeExamples &&
                    selectedTutorial.codeExamples.length > 0 && (
                      <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                          Code Examples
                        </h2>
                        <div className="space-y-8">
                          {selectedTutorial.codeExamples.map(
                            (example, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-2xl overflow-hidden"
                              >
                                <div className="p-6 bg-white border-b">
                                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {example.title}
                                  </h3>
                                  <p className="text-gray-600">
                                    {example.description}
                                  </p>
                                </div>

                                <div className="space-y-0">
                                  {/* Code Block */}
                                  <div>
                                    <div className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
                                      <span className="text-sm font-medium">
                                        Code
                                      </span>
                                      <button
                                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                                        onClick={() =>
                                          navigator.clipboard.writeText(
                                            example.code
                                          )
                                        }
                                      >
                                        Copy
                                      </button>
                                    </div>
                                    <pre className="p-6 bg-gray-900 text-gray-100 overflow-x-auto">
                                      <code>{example.code}</code>
                                    </pre>
                                  </div>

                                  {/* Input Block */}
                                  {example.input && (
                                    <div>
                                      <div className="px-6 py-3 bg-blue-800 text-white">
                                        <span className="text-sm font-medium">
                                          Input
                                        </span>
                                      </div>
                                      <pre className="p-6 bg-blue-900 text-blue-100 overflow-x-auto">
                                        <code>{example.input}</code>
                                      </pre>
                                    </div>
                                  )}

                                  {/* Output Block */}
                                  {example.expectedOutput && (
                                    <div>
                                      <div className="px-6 py-3 bg-green-800 text-white">
                                        <span className="text-sm font-medium">
                                          Expected Output
                                        </span>
                                      </div>
                                      <pre className="p-6 bg-green-900 text-green-100 overflow-x-auto">
                                        <code>{example.expectedOutput}</code>
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
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
        {showAIChat && (
          <div className="w-96 flex-shrink-0">
            <AIChatAssistant
              context="tutorial"
              contextTitle={selectedTutorial?.title}
            />
          </div>
        )}
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageTutorialsPage;
