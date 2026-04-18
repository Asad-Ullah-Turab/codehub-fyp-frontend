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

  requestPublishCourse: async (courseId: string) => {
    const response = await api.patch(`${API_ENDPOINTS.CREATOR_COURSES}/${courseId}/publish-request`);
    return response.data;
  },

  getPendingPublishRequests: async (page = 1, limit = 20) => {
    const response = await api.get(API_ENDPOINTS.ADMIN_CREATOR_COURSE_PUBLISH_REQUESTS_PENDING, {
      params: { page, limit },
    });
    return response.data;
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
