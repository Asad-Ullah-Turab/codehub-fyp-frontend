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
import './TutorialsPage.css';

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
      <div className="tutorials-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tutorials and courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tutorials-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={loadPageData}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tutorials-page">
      <div className="tutorials-container">
        {/* Tutorials Section */}
        <section className="tutorials-section">
          <div className="section-header">
            <h1 className="section-title">Tutorials</h1>
            <p className="section-description">
              Learn programming concepts with interactive tutorials
            </p>
          </div>
          
          <div className="language-grid">
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
        <section className="courses-section">
          <div className="section-header">
            <h2 className="section-title">Courses</h2>
            <p className="section-description">
              Structured learning paths to master programming skills
            </p>
          </div>
          
          {courses.length > 0 ? (
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onClick={() => handleCourseClick(course._id)}
                />
              ))}
            </div>
          ) : (
            <div className="no-courses">
              <div className="no-courses-icon">📚</div>
              <h3>No courses available yet</h3>
              <p>Check back later for new courses!</p>
            </div>
          )}
          
          <div className="view-all-container">
            <button 
              className="view-all-button"
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
