import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchMainConcepts, 
  getLanguageEmoji,
  type MainConcepts 
} from '../../functions/TutorialFunctions/tutorialFunctions';
import { 
  getAllCourses, 
  type Course 
} from '../../functions/CourseFunctions/courseFunctions';
import LanguageCard from './Components/LanguageCard';
import CourseCard from './Components/CourseCard';

const TutorialsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mainConcepts, setMainConcepts] = useState<MainConcepts>({
    python: [],
    javascript: [],
    cpp: []
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load tutorials data
      const conceptsData = await fetchMainConcepts();
      setMainConcepts(conceptsData);

      // Load courses data
      const coursesResponse = await getAllCourses({ limit: 8 }); // Get first 8 courses
      setCourses(coursesResponse.data);

    } catch (err) {
      console.error('Error loading page data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageClick = (language: string) => {
    navigate(`/tutorials/${language}`);
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const getLanguages = () => {
    return Object.keys(mainConcepts) as (keyof MainConcepts)[];
  };

  const getTutorialCount = (language: keyof MainConcepts) => {
    return mainConcepts[language]?.length || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading tutorials and courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              onClick={loadPageData}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tutorials Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Tutorials
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn programming concepts with interactive tutorials
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getLanguages().map((language) => (
              <LanguageCard
                key={language}
                language={language}
                emoji={getLanguageEmoji(language)}
                tutorialCount={getTutorialCount(language)}
                onClick={() => handleLanguageClick(language)}
              />
            ))}
          </div>
        </section>

        {/* Courses Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Structured learning paths to master programming skills
            </p>
          </div>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onClick={() => handleCourseClick(course._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white rounded-2xl shadow-lg p-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses available yet</h3>
              <p className="text-gray-600">Check back later for new courses!</p>
            </div>
          )}
          
          <div className="text-center">
            <button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              onClick={() => navigate('/courses')}
            >
              View All Courses
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TutorialsPage;
