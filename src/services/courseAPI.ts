import api from './api';

export const courseAPI = {
  getAllCourses: async (params?: Record<string, unknown>) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCoursesByLanguage: async (language: string, page = 1, limit = 10) => {
    const response = await api.get(`/courses/language/${language}`, { params: { page, limit } });
    return response.data;
  },

  getCourseById: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  enrollInCourse: async (courseId: string) => {
    const response = await api.post('/courses/enroll', { courseId });
    return response.data;
  },

  getUserEnrolledCourses: async () => {
    const response = await api.get('/courses/user/enrolled');
    return response.data;
  },

  getEnrollmentDetails: async (courseId: string) => {
    const response = await api.get(`/courses/${courseId}/enrollment`);
    return response.data;
  },

  completeLessonProgress: async (courseId: string, sectionId: string, lessonId: string, timeSpentMinutes?: number) => {
    const body: Record<string, unknown> = { courseId, sectionId, lessonId };
    if (typeof timeSpentMinutes === 'number') body.timeSpentMinutes = timeSpentMinutes;
    const response = await api.put(`/courses/${courseId}/progress/lesson`, body);
    return response.data;
  },

  submitQuizAnswers: async (quizId: string, courseId: string, sectionId: string | null, answers: Record<string, unknown>) => {
    const response = await api.post(`/courses/quizzes/${quizId}/submit`, { quizId, courseId, sectionId, answers });
    return response.data;
  },

  getQuizDetails: async (quizId: string) => {
    const response = await api.get(`/courses/quizzes/${quizId}`);
    return response.data;
  },

  getUserCertificates: async () => {
    const response = await api.get('/admin/courses/user/certificates');
    return response.data;
  },

  getCertificateById: async (certificateId: string) => {
    const response = await api.get(`/admin/courses/certificates/${certificateId}`);
    return response.data;
  },
};

export default courseAPI;
