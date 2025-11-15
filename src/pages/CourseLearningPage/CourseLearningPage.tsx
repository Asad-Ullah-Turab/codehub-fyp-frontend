import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseById,
  getEnrollmentDetails,
  enrollInCourse,
  completeLessonProgress,
  type Course,
  type CourseEnrollment,
  type CourseSection,
  type CourseLesson,
} from "../../functions/CourseFunctions/courseFunctions";
import CourseLessonViewer from "./components/CourseLessonViewer";
import AIChatAssistant from "../../components/AIChatAssistant/AIChatAssistant";

const CourseLearningPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  // Load course data
  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);

        const courseResponse = await getCourseById(courseId);
        setCourse(courseResponse.data);
        setEnrollment(courseResponse.enrollment || null);

        // Auto-select first lesson if enrolled
        if (courseResponse.enrollment && courseResponse.data.sections?.length > 0) {
          const firstSection = courseResponse.data.sections[0];
          if (firstSection.lessons?.length > 0) {
            setSelectedSection(firstSection);
            setSelectedLesson(firstSection.lessons[0]);
          }
        }

        // Try to get detailed enrollment data
        if (courseResponse.enrollment) {
          try {
            const enrollmentResponse = await getEnrollmentDetails(courseId);
            setEnrollment(enrollmentResponse.data);
          } catch (err) {
            console.log("Using basic enrollment data");
          }
        }
      } catch (err: any) {
        console.error("Error loading course data:", err);
        setError(err.message || "Failed to load course. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  const handleLessonSelect = (section: CourseSection, lesson: CourseLesson) => {
    setLessonLoading(true);
    setSelectedSection(section);
    setSelectedLesson(lesson);
    setLessonLoading(false);
  };

  const handleNextLesson = () => {
    if (!course || !selectedSection || !selectedLesson) return;

    const currentSectionIndex = course.sections.findIndex(s => s._id === selectedSection._id);
    const currentLessonIndex = selectedSection.lessons.findIndex(l => l._id === selectedLesson._id);

    // Check if there's a next lesson in current section
    if (currentLessonIndex < selectedSection.lessons.length - 1) {
      handleLessonSelect(selectedSection, selectedSection.lessons[currentLessonIndex + 1]);
    } else if (currentSectionIndex < course.sections.length - 1) {
      // Move to first lesson of next section
      const nextSection = course.sections[currentSectionIndex + 1];
      if (nextSection.lessons?.length > 0) {
        handleLessonSelect(nextSection, nextSection.lessons[0]);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousLesson = () => {
    if (!course || !selectedSection || !selectedLesson) return;

    const currentSectionIndex = course.sections.findIndex(s => s._id === selectedSection._id);
    const currentLessonIndex = selectedSection.lessons.findIndex(l => l._id === selectedLesson._id);

    // Check if there's a previous lesson in current section
    if (currentLessonIndex > 0) {
      handleLessonSelect(selectedSection, selectedSection.lessons[currentLessonIndex - 1]);
    } else if (currentSectionIndex > 0) {
      // Move to last lesson of previous section
      const prevSection = course.sections[currentSectionIndex - 1];
      if (prevSection.lessons?.length > 0) {
        handleLessonSelect(prevSection, prevSection.lessons[prevSection.lessons.length - 1]);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackClick = () => {
    navigate("/tutorials");
  };

  const handleEnroll = async () => {
    if (!courseId) return;

    try {
      await enrollInCourse(courseId);
      // Reload page to show enrolled state
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to enroll in course");
    }
  };

  // Filter all lessons across sections
  const getAllLessons = () => {
    if (!course) return [];
    return course.sections.flatMap(section =>
      section.lessons.map(lesson => ({ section, lesson }))
    );
  };

  const filteredLessons = getAllLessons().filter(({ section, lesson }) =>
    lesson.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    section.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    lesson.difficulty?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || "Course not found"}</p>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            onClick={() => navigate("/tutorials")}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If not enrolled, show enrollment page
  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {course.language.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
              course.difficulty === 'beginner' ? 'bg-green-600' :
              course.difficulty === 'intermediate' ? 'bg-yellow-600' : 'bg-red-600'
            }`}>
              {course.difficulty}
            </span>
            <span className="text-gray-700 flex items-center gap-1">
              ⏱️ {course.estimatedHours}h
            </span>
            <span className="text-gray-700 flex items-center gap-1">
              📚 {course.sections?.length || 0} sections
            </span>
          </div>

          <button
            onClick={handleEnroll}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors mb-4"
          >
            Enroll in Course
          </button>
          
          <button
            onClick={handleBackClick}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Tutorials
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="flex h-screen bg-gray-50 overflow-hidden overflow-x-hidden">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute z-10 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg shadow-lg transition-all duration-300"
          style={{
            left: sidebarOpen ? "256px" : "0px",
            top: "50vh",
            transform: "translateY(-50%)",
          }}
        >
          {sidebarOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        {/* Sidebar */}
        <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden flex flex-col`}>
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Filter lessons"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
            <div className="space-y-2">
              {filteredLessons.length > 0 ? (
                filteredLessons.map(({ section, lesson }) => (
                  <div
                    key={lesson._id}
                    onClick={() => handleLessonSelect(section, lesson)}
                    className={`p-3 rounded-lg cursor-pointer transition-all text-sm ${
                      selectedLesson?._id === lesson._id
                        ? "bg-blue-50 border border-blue-200 text-blue-800"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="font-medium mb-1">• {lesson.title}</div>
                    <div className="text-xs text-gray-500">{section.title}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No lessons found
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar and AI Button */}
          <div className="p-4 border-t border-gray-200 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span className="font-semibold">{enrollment.overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enrollment.overallProgress}%` }}
                ></div>
              </div>
            </div>
            
            <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Generate with AI
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Lesson Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar overflow-x-hidden">
            {selectedLesson ? (
              <>
                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-200 px-6 py-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <button onClick={handleBackClick} className="hover:text-blue-600">
                      Home
                    </button>
                    <span className="mx-2">/</span>
                    <span className="hover:text-blue-600 cursor-pointer">{course.title}</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{selectedSection?.title}</span>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto p-8 overflow-x-hidden">
                  {lessonLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    <CourseLessonViewer
                      lesson={selectedLesson}
                      section={selectedSection!}
                      onNext={handleNextLesson}
                      onPrevious={handlePreviousLesson}
                    />
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex items-center justify-between bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <button
                      onClick={handlePreviousLesson}
                      disabled={
                        course.sections[0]._id === selectedSection?._id &&
                        selectedSection.lessons[0]._id === selectedLesson._id
                      }
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <span>←</span>
                      Previous
                    </button>

                    <button
                      onClick={handleNextLesson}
                      disabled={
                        course.sections[course.sections.length - 1]._id === selectedSection?._id &&
                        selectedSection.lessons[selectedSection.lessons.length - 1]._id === selectedLesson._id
                      }
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-lg">Select a lesson to begin learning</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Chat Assistant */}
          {showAIChat && (
            <div className="w-96 border-l border-gray-200 bg-white overflow-hidden flex flex-col relative">
              <AIChatAssistant context="course-learning" contextTitle={course.title} />
            </div>
          )}
        </div>

        {/* AI Chat Toggle Button */}
        <button
          onClick={() => setShowAIChat(!showAIChat)}
          className="absolute z-10 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-l-lg shadow-lg transition-all duration-300"
          style={{
            right: showAIChat ? "384px" : "0px",
            top: "50vh",
            transform: "translateY(-50%)",
          }}
        >
          {showAIChat ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
};

export default CourseLearningPage;
