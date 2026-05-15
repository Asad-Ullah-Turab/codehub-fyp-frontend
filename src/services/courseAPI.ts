import api from './api';
import { API_ENDPOINTS } from '../constants';

export const courseAPI = {
  getAllCourses: async (params?: Record<string, unknown>) => {
    const response = await api.get(API_ENDPOINTS.COURSES, { params });
    return response.data;
  },

  getCoursesByLanguage: async (language: string, page = 1, limit = 10) => {
    const response = await api.get(`${API_ENDPOINTS.COURSES}/language/${language}`, { params: { page, limit } });
    return response.data;
  },

  getCourseById: async (id: string) => {
    const response = await api.get(`${API_ENDPOINTS.COURSES}/${id}`);
    return response.data;
  },

  enrollInCourse: async (courseId: string) => {
    const response = await api.post(API_ENDPOINTS.COURSES_ENROLL, { courseId });
    return response.data;
  },

  getUserEnrolledCourses: async () => {
    const response = await api.get(API_ENDPOINTS.COURSES_USER_ENROLLED);
    return response.data;
  },

  getEnrollmentDetails: async (courseId: string) => {
    const response = await api.get(`${API_ENDPOINTS.COURSES}/${courseId}/enrollment`);
    return response.data;
  },

  completeLessonProgress: async (courseId: string, sectionId: string, lessonId: string, timeSpentMinutes?: number) => {
    const body: Record<string, unknown> = { courseId, sectionId, lessonId };
    if (typeof timeSpentMinutes === 'number') body.timeSpentMinutes = timeSpentMinutes;
    const response = await api.put(`${API_ENDPOINTS.COURSES}/${courseId}/progress/lesson`, body);
    return response.data;
  },

  submitQuizAnswers: async (quizId: string, courseId: string, sectionId: string | null, answers: Record<string, unknown>) => {
    const response = await api.post(`${API_ENDPOINTS.COURSES}/quizzes/${quizId}/submit`, { quizId, courseId, sectionId, answers });
    return response.data;
  },

  getQuizDetails: async (quizId: string) => {
    const response = await api.get(`${API_ENDPOINTS.COURSES}/quizzes/${quizId}`);
    return response.data;
  },

  getUserCertificates: async () => {
    const response = await api.get(`${API_ENDPOINTS.ADMIN_COURSES}/user/certificates`);
    return response.data;
  },

  getCertificateById: async (certificateId: string) => {
    const response = await api.get(`${API_ENDPOINTS.ADMIN_COURSES}/certificates/${certificateId}`);
    return response.data;
  },

  addCourseReview: async (courseId: string, rating: number, comment?: string) => {
    const response = await api.post(`${API_ENDPOINTS.COURSES}/${courseId}/reviews`, { rating, comment });
    return response.data;
  },

  getCourseReviews: async (courseId: string, page = 1, limit = 10, sortBy = 'recent') => {
    const response = await api.get(`${API_ENDPOINTS.COURSES}/${courseId}/reviews`, {
      params: { page, limit, sortBy }
    });
    return response.data;
  },

  markReviewHelpful: async (reviewId: string) => {
    const response = await api.post(`${API_ENDPOINTS.COURSES}/reviews/${reviewId}/helpful`);
    return response.data;
  },
};

export default courseAPI;
