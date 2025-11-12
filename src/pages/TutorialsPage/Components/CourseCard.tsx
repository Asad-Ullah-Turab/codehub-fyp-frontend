import React from 'react';
import type { Course } from '../../../functions/CourseFunctions/courseFunctions';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500 text-white';
      case 'intermediate':
        return 'bg-yellow-500 text-white';
      case 'advanced':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDuration = (hours: number) => {
    if (!hours || isNaN(hours)) return '0h';
    
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    } else {
      const wholeHours = Math.floor(hours);
      const remainingMinutes = Math.round((hours - wholeHours) * 60);
      return remainingMinutes > 0 ? `${wholeHours}h ${remainingMinutes}m` : `${wholeHours}h`;
    }
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-indigo-200 hover:-translate-y-1 overflow-hidden"
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {course.language.toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {course.description}
        </p>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <span>⏱️</span>
            <span>{formatDuration(course.estimatedHours)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>📚</span>
            <span>{course.sections?.length || 0} sections</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {course.instructor.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-700 font-medium">
              {course.instructor.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {course.price && course.price > 0 ? (
              <span className="text-green-600 font-bold">${course.price}</span>
            ) : (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-semibold">
                Free
              </span>
            )}
            <div className="text-indigo-500 group-hover:translate-x-1 transition-transform duration-300">
              →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;