import React from 'react';
import type { Course } from '../../../functions/CourseFunctions/courseFunctions';
import './CourseCard.css';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  return (
    <div className="course-card" onClick={onClick}>
      <div className="course-header">
        <div className="course-language">{course.language.toUpperCase()}</div>
        <div 
          className="course-difficulty"
          style={{ backgroundColor: getDifficultyColor(course.difficulty) }}
        >
          {course.difficulty}
        </div>
      </div>
      
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        
        <div className="course-meta">
          <div className="course-duration">
            <span className="meta-icon">⏱️</span>
            {formatDuration(course.duration)}
          </div>
          
          <div className="course-sections">
            <span className="meta-icon">📚</span>
            {course.sections?.length || 0} sections
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
          <span className="instructor-name">{course.instructor.name}</span>
        </div>
      </div>
      
      <div className="course-footer">
        {course.price > 0 ? (
          <div className="course-price">${course.price}</div>
        ) : (
          <div className="course-free">Free</div>
        )}
        <div className="course-arrow">→</div>
      </div>
    </div>
  );
};

export default CourseCard;