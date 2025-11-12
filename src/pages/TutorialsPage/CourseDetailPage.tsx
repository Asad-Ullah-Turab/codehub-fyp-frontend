import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCourseById,
  enrollInCourse,
  type Course,
  type CourseEnrollment 
} from '../../functions/CourseFunctions/courseFunctions';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = React.useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await getCourseById(courseId);
      setCourse(response.data);
      setEnrollment(response.enrollment || null);
    } catch (err) {
      console.error('Error loading course:', err);
      setError('Failed to load course. Please try again later.');
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
      console.error('Error enrolling in course:', err);
      // Handle enrollment error
    } finally {
      setEnrolling(false);
    }
  };

  const handleBackClick = () => {
    navigate('/tutorials');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#28a745';
      case 'intermediate':
        return '#ffc107';
      case 'advanced':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="course-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Course not found</h2>
          <p>{error || 'The course you are looking for does not exist.'}</p>
          <button className="back-button" onClick={handleBackClick}>
            Back to Tutorials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="course-container">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Tutorials
        </button>
        
        <div className="course-hero">
          <div className="course-header">
            <div className="course-badges">
              <span className="language-badge">{course.language.toUpperCase()}</span>
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(course.difficulty) }}
              >
                {course.difficulty}
              </span>
            </div>
            
            <h1 className="course-title">{course.title}</h1>
            <p className="course-description">{course.description}</p>
            
            <div className="course-meta">
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span>{course.estimatedHours}h</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📚</span>
                <span>{course.sections?.length || 0} sections</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🎯</span>
                <span>{course.category}</span>
              </div>
            </div>
            
            <div className="course-instructor">
              <div className="instructor-avatar">
                {course.instructor.profilePicture ? (
                  <img 
                    src={course.instructor.profilePicture} 
                    alt={course.instructor.name}
                  />
                ) : (
                  <div className="default-avatar">
                    {course.instructor.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="instructor-info">
                <p className="instructor-label">Instructor</p>
                <p className="instructor-name">{course.instructor.name}</p>
              </div>
            </div>
          </div>
          
          <div className="course-sidebar">
            <div className="pricing-card">
              <div className="price">
                {course.price && course.price > 0 ? `$${course.price}` : 'Free'}
              </div>
              
              {enrollment ? (
                <div className="enrolled-status">
                  <div className="enrolled-icon">✅</div>
                  <p>You are enrolled in this course</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{enrollment.progress}% complete</p>
                </div>
              ) : (
                <button 
                  className="enroll-button"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {course.sections && course.sections.length > 0 && (
          <div className="course-content">
            <h2 className="sections-title">Course Content</h2>
            <div className="sections-list">
              {course.sections.map((section, index) => (
                <div key={section._id} className="section-card">
                  <div className="section-header">
                    <h3 className="section-title">
                      {index + 1}. {section.title}
                    </h3>
                    <span className="lessons-count">
                      {section.lessons?.length || 0} lessons
                    </span>
                  </div>
                  {section.description && (
                    <p className="section-description">{section.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;