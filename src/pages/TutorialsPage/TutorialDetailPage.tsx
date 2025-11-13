import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTutorialById,
  saveTutorial,
  unsaveTutorial,
  type Tutorial,
} from "../../functions/TutorialFunctions/tutorialFunctions";
import { useAuth } from "../../hooks/useAuth";

const TutorialDetailPage: React.FC = () => {
  const { language, tutorialId } = useParams<{
    language: string;
    tutorialId: string;
  }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingTutorial, setSavingTutorial] = useState(false);

  // Debug authentication state
  React.useEffect(() => {
    console.log("TutorialDetailPage - isAuthenticated:", isAuthenticated);
    console.log("TutorialDetailPage - tutorialId:", tutorialId);
  }, [isAuthenticated, tutorialId]);

  const loadTutorial = React.useCallback(async () => {
    if (!tutorialId) return;

    try {
      setLoading(true);
      setError(null);

      const tutorialData = await fetchTutorialById(tutorialId);
      setTutorial(tutorialData);

      // Check if tutorial is saved (only if authenticated)
      if (isAuthenticated) {
        try {
          const { getSavedTutorials } = await import(
            "../../functions/TutorialFunctions/tutorialFunctions"
          );
          const savedTutorials = await getSavedTutorials();
          const isCurrentTutorialSaved = savedTutorials.data.some(
            (saved) => saved.tutorial._id === tutorialId
          );
          setIsSaved(isCurrentTutorialSaved);
        } catch (saveCheckError) {
          console.log("Could not check save status:", saveCheckError);
          // Don't set error for this, just continue without save status
        }
      }
    } catch (err) {
      console.error("Error loading tutorial:", err);
      setError("Failed to load tutorial. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [tutorialId, isAuthenticated]);

  React.useEffect(() => {
    loadTutorial();
  }, [loadTutorial]);

  const handleBackClick = () => {
    if (language) {
      navigate(`/tutorials/${language}`);
    } else {
      navigate("/tutorials");
    }
  };

  const handleSaveTutorial = async () => {
    console.log("Save button clicked! isAuthenticated:", isAuthenticated);

    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to signin");
      navigate("/signin");
      return;
    }

    if (!tutorialId) {
      console.log("No tutorial ID");
      return;
    }

    try {
      setSavingTutorial(true);
      console.log(
        "Attempting to save/unsave tutorial:",
        tutorialId,
        "isSaved:",
        isSaved
      );

      if (isSaved) {
        await unsaveTutorial(tutorialId);
        setIsSaved(false);
        console.log("Tutorial unsaved successfully");
      } else {
        await saveTutorial(tutorialId);
        setIsSaved(true);
        console.log("Tutorial saved successfully");
      }
    } catch (err) {
      console.error("Error saving/unsaving tutorial:", err);
      setError(err instanceof Error ? err.message : "Failed to save tutorial");
    } finally {
      setSavingTutorial(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "#28a745";
      case "intermediate":
        return "#ffc107";
      case "advanced":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tutorial not found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The tutorial you are looking for does not exist."}
          </p>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            onClick={handleBackClick}
          >
            Back to Tutorials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition-colors"
          onClick={handleBackClick}
        >
          ← Back to{" "}
          {language
            ? `${language.charAt(0).toUpperCase()}${language.slice(1)}`
            : "Tutorials"}
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header with badges and save button */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {tutorial.language.toUpperCase()}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {tutorial.concept}
              </span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{
                  backgroundColor: getDifficultyColor(tutorial.difficulty),
                }}
              >
                {tutorial.difficulty}
              </span>
            </div>

            {/* Save Button - Always Visible for Testing */}
            <div className="flex justify-end">
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
                  <span className="text-lg">{isSaved ? "❤️" : "🤍"}</span>
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
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {tutorial.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{tutorial.description}</p>

          {tutorial.tags && tutorial.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tutorial.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tutorial Content
            </h2>
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: tutorial.content }}
            />
          </div>

          {tutorial.notes && tutorial.notes.length > 0 && (
            <div className="bg-blue-50 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📝 Notes
              </h2>
              <div className="space-y-4">
                {tutorial.notes.map((note, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="text-blue-500 text-xl">📝</div>
                    <p className="text-gray-700 leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tutorial.tips && tutorial.tips.length > 0 && (
            <div className="bg-yellow-50 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Tips</h2>
              <div className="space-y-4">
                {tutorial.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="text-yellow-500 text-xl">💡</div>
                    <p className="text-gray-700 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tutorial.codeExamples && tutorial.codeExamples.length > 0 && (
            <div className="bg-gray-50 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                💻 Code Examples
              </h2>
              <div className="space-y-6">
                {tutorial.codeExamples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {example.title}
                      </h3>
                      <p className="text-gray-600">{example.description}</p>
                    </div>

                    <div className="bg-gray-900">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                        <span className="text-gray-300 text-sm font-medium">
                          Code
                        </span>
                        <button
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          onClick={() =>
                            navigator.clipboard.writeText(example.code)
                          }
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="p-4 text-green-400 text-sm overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                    </div>

                    {example.input && (
                      <div className="bg-blue-900">
                        <div className="px-4 py-2 bg-blue-800">
                          <span className="text-blue-200 text-sm font-medium">
                            Input
                          </span>
                        </div>
                        <pre className="p-4 text-blue-200 text-sm overflow-x-auto">
                          <code>{example.input}</code>
                        </pre>
                      </div>
                    )}

                    {example.expectedOutput && (
                      <div className="bg-green-900">
                        <div className="px-4 py-2 bg-green-800">
                          <span className="text-green-200 text-sm font-medium">
                            Expected Output
                          </span>
                        </div>
                        <pre className="p-4 text-green-200 text-sm overflow-x-auto">
                          <code>{example.expectedOutput}</code>
                        </pre>
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
