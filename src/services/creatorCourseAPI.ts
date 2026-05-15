import api from "./api";
import { API_ENDPOINTS } from "../constants";
import type { Course } from "./adminCourseAPI";

export interface CreatorCourseFormData {
  title: string;
  description: string;
  shortDescription: string;
  language: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  certificateTemplate: "standard" | "distinguished" | "excellence";
  certificateSignerName?: string;
  certificateSignerTitle?: string;
  certificateSealLabel?: string;
  certificateFooterText?: string;
  tags: string[];
  prerequisites: string[];
  targetAudience: string;
  learningObjectives: string[];
  outcomes: string[];
  requirements: string[];
  isPremium?: boolean;
}

export const creatorCourseAPI = {
  createCourse: async (courseData: CreatorCourseFormData) => {
    const response = await api.post(API_ENDPOINTS.CREATOR_COURSES, courseData);
    return response.data;
  },

  getMyCourses: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get(API_ENDPOINTS.CREATOR_COURSES_MY, { params });
    return response.data;
  },

  updateCourse: async (courseId: string, courseData: Partial<CreatorCourseFormData>) => {
    const response = await api.put(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}`, courseData);
    return response.data;
  },

  getCourse: async (courseId: string) => {
    const response = await api.get(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}`);
    return response.data;
  },

  requestPublishCourse: async (courseId: string) => {
    const response = await api.patch(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}/publish-request`);
    return response.data;
  },

  togglePublishCourse: async (courseId: string) => {
    const response = await api.patch(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}/publish`);
    return response.data;
  },

  deleteCourse: async (courseId: string) => {
    const response = await api.delete(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}`);
    return response.data;
  },

  getCourseSections: async (courseId: string) => {
    const response = await api.get(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}/sections`);
    return response.data;
  },

  createSection: async (
    courseId: string,
    sectionData: {
      title: string;
      description?: string;
      order: number;
      estimatedHours?: number;
    },
  ) => {
    const response = await api.post(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}/sections`, sectionData);
    return response.data;
  },

  updateSection: async (
    sectionId: string,
    sectionData: {
      title?: string;
      description?: string;
      order?: number;
      estimatedHours?: number;
    },
  ) => {
    const response = await api.put(`${API_ENDPOINTS.CREATOR_COURSES}/sections/${sectionId}`, sectionData);
    return response.data;
  },

  deleteSection: async (sectionId: string) => {
    const response = await api.delete(`${API_ENDPOINTS.CREATOR_COURSES}/sections/${sectionId}`);
    return response.data;
  },

  getSectionLessons: async (sectionId: string) => {
    const response = await api.get(`${API_ENDPOINTS.CREATOR_COURSES}/sections/${sectionId}/lessons`);
    return response.data;
  },

  createLesson: async (
    sectionId: string,
    lessonData: {
      title: string;
      description?: string;
      content: string;
      order: number;
      videoUrl?: string;
      duration?: number;
      codeExamples?: any[];
      notes?: string[];
      tips?: string[];
      resources?: any[];
      difficulty?: string;
      estimatedHours?: number;
    },
  ) => {
    const response = await api.post(`${API_ENDPOINTS.CREATOR_COURSES}/sections/${sectionId}/lessons`, lessonData);
    return response.data;
  },

  updateLesson: async (
    lessonId: string,
    lessonData: {
      title?: string;
      description?: string;
      content?: string;
      order?: number;
      videoUrl?: string;
      duration?: number;
      codeExamples?: any[];
      notes?: string[];
      tips?: string[];
      resources?: any[];
      difficulty?: string;
      estimatedHours?: number;
    },
  ) => {
    const response = await api.put(`${API_ENDPOINTS.CREATOR_COURSES}/lessons/${lessonId}`, lessonData);
    return response.data;
  },

  deleteLesson: async (lessonId: string) => {
    const response = await api.delete(`${API_ENDPOINTS.CREATOR_COURSES}/lessons/${lessonId}`);
    return response.data;
  },

  createOrUpdateQuiz: async (quizData: {
    courseId?: string;
    sectionId?: string;
    title: string;
    description?: string;
    type: "section-quiz" | "final-quiz" | "practice-quiz";
    questions: any[];
    passingScore?: number;
    timeLimit?: number;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    showAnswerExplanation?: boolean;
    retakeAllowed?: boolean;
    maxRetakes?: number;
  }) => {
    const response = await api.post(`${API_ENDPOINTS.CREATOR_COURSES}/${quizData.courseId}/quizzes`, quizData);
    return response.data;
  },

  getQuiz: async (quizId: string) => {
    const response = await api.get(`${API_ENDPOINTS.CREATOR_COURSES}/quizzes/${quizId}`);
    return response.data;
  },

  updateQuiz: async (
    quizId: string,
    quizData: {
      title?: string;
      description?: string;
      questions?: any[];
      passingScore?: number;
      timeLimit?: number;
      shuffleQuestions?: boolean;
      shuffleOptions?: boolean;
      showAnswerExplanation?: boolean;
      retakeAllowed?: boolean;
      maxRetakes?: number;
    },
  ) => {
    const response = await api.put(`${API_ENDPOINTS.CREATOR_COURSES}/quizzes/${quizId}`, quizData);
    return response.data;
  },

  deleteQuiz: async (quizId: string) => {
    const response = await api.delete(`${API_ENDPOINTS.CREATOR_COURSES}/quizzes/${quizId}`);
    return response.data;
  },

  generateSectionWithAI: async (courseId: string, topic: string) => {
    const res = await api.post(`/creator/courses/${courseId}/sections/generate-ai`, { topic });
    return res.data;
  },

  getCourseEnrollments: async (courseId: string) => {
    const response = await api.get(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}/enrollments`);
    return response.data;
  },

  getCourseRatings: async (courseId: string) => {
    const response = await api.get(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}/ratings`);
    return response.data;
  },

  getPendingPublishRequests: async (page = 1, limit = 20) => {
    const response = await api.get(API_ENDPOINTS.ADMIN_CREATOR_COURSE_PUBLISH_REQUESTS_PENDING, {
      params: { page, limit },
    });
    return response.data;
  },

  getCourseReviewsForCreator: async (courseId: string, page = 1, limit = 20) => {
    const response = await api.get(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  getCreatorReviewsSummary: async () => {
    const response = await api.get(`${API_ENDPOINTS.CREATOR_COURSES}/reviews/summary`);
    return response.data;
  },

  getCourseAnalytics: async (courseId: string) => {
    const res = await api.get(`/creator/courses/${courseId}/analytics`);
    return res.data;
  },

  reviewPublishRequest: async (
    courseId: string,
    action: "approve" | "reject",
    comment?: string,
  ) => {
    const response = await api.patch(`${API_ENDPOINTS.ADMIN_CREATOR_COURSE_PUBLISH_REQUESTS}/${courseId}/review`, {
      action,
      comment,
    });
    return response.data;
  },
};

export type { Course };

export default creatorCourseAPI;
