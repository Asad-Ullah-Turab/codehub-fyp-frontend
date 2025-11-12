import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  
  // Redirect to the new course detail page structure
  if (courseId) {
    return <Navigate to={`/course/${courseId}`} replace />;
  }
  
  // If no courseId, redirect to tutorials page
  return <Navigate to="/tutorials" replace />;
};

export default CoursePage;