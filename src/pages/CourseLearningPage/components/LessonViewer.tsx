import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CourseLesson, CourseSection } from "../../../functions/CourseFunctions/courseFunctions";

interface LessonViewerProps {
  lesson: CourseLesson;
  section: CourseSection;
  onComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isCompleted: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  section,
  onComplete,
  onNext,
  onPrevious,
  isCompleted,
  canGoPrevious,
  canGoNext,
}) => {
  const [showCompletePrompt, setShowCompletePrompt] = useState(false);

  const handleCompleteClick = () => {
    if (isCompleted) {
      onNext();
    } else {
      setShowCompletePrompt(true);
    }
  };

  const handleConfirmComplete = () => {
    setShowCompletePrompt(false);
    onComplete();
  };

  // Add custom styles for HTML content
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .lesson-content h2 {
        font-size: 1.875rem;
        font-weight: 700;
        color: #1f2937;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e5e7eb;
      }
      .lesson-content h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #374151;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }
      .lesson-content p {
        font-size: 1.125rem;
        line-height: 1.75;
        color: #4b5563;
        margin-bottom: 1rem;
      }
      .lesson-content ul {
        list-style-type: disc;
        margin-left: 2rem;
        margin-bottom: 1rem;
      }
      .lesson-content li {
        font-size: 1.125rem;
        line-height: 1.75;
        color: #4b5563;
        margin-bottom: 0.5rem;
      }
      .lesson-content strong {
        font-weight: 600;
        color: #1f2937;
      }
      .lesson-content code {
        background-color: #f3f4f6;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
        color: #dc2626;
      }
      .lesson-content pre {
        background-color: #1f2937;
        color: #f9fafb;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 1rem 0;
      }
      .lesson-content pre code {
        background-color: transparent;
        color: inherit;
        padding: 0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const renderLessonContent = () => {
    switch (lesson.type) {
      case "video":
        return (
          <div className="space-y-6">
            {lesson.videoUrl && (
              <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                <iframe
                  src={lesson.videoUrl}
                  title={lesson.title}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}
            {lesson.content && (
              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                  className="lesson-content"
                />
              </div>
            )}
          </div>
        );

      case "code":
        return (
          <div className="space-y-6">
            {lesson.content && (
              <div className="prose prose-lg max-w-none mb-6">
                <div
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                  className="lesson-content"
                />
              </div>
            )}
            {lesson.codeExample && (
              <div className="rounded-xl overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">
                    Code Example
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(lesson.codeExample || "")
                    }
                    className="text-gray-300 hover:text-white text-sm px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <SyntaxHighlighter
                  language="python"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    fontSize: "0.9rem",
                  }}
                  showLineNumbers
                >
                  {lesson.codeExample}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        );

      case "text":
      default:
        return (
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: lesson.content }}
              className="lesson-content"
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          {section.title} / Lesson {lesson.order}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-gray-600 mt-2">{lesson.description}</p>
        )}
        {isCompleted && (
          <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span className="mr-2">✓</span>
            Completed
          </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-6">
        {renderLessonContent()}
      </div>

      {/* Code Examples Section */}
      {lesson.codeExamples && lesson.codeExamples.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">💻</span>
            Code Examples
          </h2>
          <div className="space-y-6">
            {lesson.codeExamples.map((example, index) => (
              <div key={example._id || index} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{example.title}</h3>
                  {example.description && (
                    <p className="text-gray-600 mt-1">{example.description}</p>
                  )}
                </div>
                <div className="bg-gray-900">
                  <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
                    <span className="text-gray-300 text-sm font-medium">
                      {example.language || 'C++'}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(example.code)}
                      className="text-gray-300 hover:text-white text-sm px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={example.language || 'cpp'}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '0.9rem',
                    }}
                    showLineNumbers
                  >
                    {example.code}
                  </SyntaxHighlighter>
                </div>
                {(example.input || example.expectedOutput) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50">
                    {example.input && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Input:</h4>
                        <pre className="text-sm text-blue-800 whitespace-pre-wrap">{example.input}</pre>
                      </div>
                    )}
                    {example.expectedOutput && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h4 className="text-sm font-semibold text-green-900 mb-2">Expected Output:</h4>
                        <pre className="text-sm text-green-800 whitespace-pre-wrap">{example.expectedOutput}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips Section */}
      {lesson.tips && lesson.tips.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">💡</span>
            Pro Tips
          </h2>
          <ul className="space-y-3">
            {lesson.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-yellow-600 mt-1">▸</span>
                <span className="text-gray-700 text-lg">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes Section */}
      {lesson.notes && lesson.notes.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">📝</span>
            Important Notes
          </h2>
          <ul className="space-y-3">
            {lesson.notes.map((note, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">●</span>
                <span className="text-gray-700 text-lg">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resources Section */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border-2 border-purple-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">📚</span>
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all"
              >
                <span className="text-2xl">
                  {resource.type === 'documentation' ? '📖' : resource.type === 'video' ? '🎥' : '🔗'}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-500 capitalize">{resource.type}</p>
                </div>
                <span className="text-purple-600">→</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="flex items-center space-x-4">
          {!isCompleted && (
            <button
              onClick={handleCompleteClick}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Mark as Complete
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Complete Confirmation Modal */}
      {showCompletePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Mark Lesson as Complete?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this lesson as complete? This will
              update your progress and move you to the next lesson.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCompletePrompt(false)}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmComplete}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonViewer;
