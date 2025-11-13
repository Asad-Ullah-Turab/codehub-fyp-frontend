import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseById,
  enrollInCourse,
  type Course,
  type CourseEnrollment,
} from "../../../functions/CourseFunctions/courseFunctions";
import AIChatAssistant from "../../../components/AIChatAssistant";

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(true);

  const loadCourse = React.useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getCourseById(courseId);
      setCourse(response.data);
      setEnrollment(response.enrollment || null);
    } catch (err) {
      console.error("Error loading course:", err);
      setError("Failed to load course. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  React.useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleEnroll = async () => {
    if (!courseId || enrolling) return;

    try {
      setEnrolling(true);
      const response = await enrollInCourse(courseId);

      if (response.success) {
        setEnrollment(response.enrollment || null);
        // Optionally show success message
      }
    } catch (err) {
      console.error("Error enrolling in course:", err);
      // Handle enrollment error
    } finally {
      setEnrolling(false);
    }
  };

  const handleBackClick = () => {
    navigate("/tutorials");
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course not found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The course you are looking for does not exist."}
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
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition-colors"
              onClick={handleBackClick}
            >
              ← Back to Tutorials
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {course.language.toUpperCase()}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{
                        backgroundColor: getDifficultyColor(course.difficulty),
                      }}
                    >
                      {course.difficulty}
                    </span>
                  </div>

                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {course.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-6 mb-8 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">⏱️</span>
                      <span className="font-medium">
                        {course.estimatedHours}h
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">📚</span>
                      <span className="font-medium">
                        {course.sections?.length || 0} sections
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🎯</span>
                      <span className="font-medium">{course.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
                      {course.instructor.profilePicture ? (
                        <img
                          src={course.instructor.profilePicture}
                          alt={course.instructor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-indigo-600 font-bold text-lg">
                          {course.instructor.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Instructor</p>
                      <p className="font-semibold text-gray-900">
                        {course.instructor.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                {course.sections && course.sections.length > 0 && (
                  <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Course Content
                    </h2>
                    <div className="space-y-4">
                      {course.sections.map((section, index) => (
                        <div
                          key={section._id}
                          className="border border-gray-200 rounded-xl p-6 hover:border-indigo-200 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {index + 1}. {section.title}
                            </h3>
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                              {section.lessons?.length || 0} lessons
                            </span>
                          </div>
                          {section.description && (
                            <p className="text-gray-600 mt-2">
                              {section.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {course.price && course.price > 0
                        ? `$${course.price}`
                        : "Free"}
                    </div>
                  </div>

                  {enrollment ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 py-3 px-4 rounded-lg">
                        <span className="text-2xl">✅</span>
                        <p className="font-semibold">You are enrolled</p>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span className="font-semibold">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
                        onClick={() => navigate(`/courses/${course._id}/learn`)}
                      >
                        Continue Learning
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? "Enrolling..." : "Enroll Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Panel */}
        {showAIChat && (
          <div className="w-96 flex-shrink-0">
            <AIChatAssistant context="course" contextTitle={course?.title} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
