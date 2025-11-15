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
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                  className="text-gray-700 leading-relaxed"
                />
              </div>
            )}
          </div>
        );

      case "code":
        return (
          <div className="space-y-6">
            {lesson.content && (
              <div className="prose max-w-none mb-6">
                <div
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                  className="text-gray-700 leading-relaxed"
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
          <div className="prose max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: lesson.content }}
              className="text-gray-700 leading-relaxed"
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
