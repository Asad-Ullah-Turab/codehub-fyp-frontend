import api from './api';
import { API_ENDPOINTS } from '../constants';

export const profileAPI = {
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.PROFILE_BASE);
    return response.data;
  },

  updateProfile: async (profileData: Record<string, unknown>) => {
    const response = await api.put(API_ENDPOINTS.PROFILE_BASE, profileData);
    return response.data;
  },

  uploadProfilePicture: async (file: File) => {
    const form = new FormData();
    form.append('profilePicture', file);
    const response = await api.post(API_ENDPOINTS.PROFILE_UPLOAD_PICTURE, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  applyForCreatorRole: async (applicationData: {
    message: string;
    portfolioLink?: string;
    experienceSummary?: string;
  }) => {
    const response = await api.post(API_ENDPOINTS.PROFILE_CREATOR_APPLICATION, applicationData);
    return response.data;
  },

  markPromptShown: async () => {
    const response = await api.post(API_ENDPOINTS.PROFILE_PROMPT_SHOWN);
    return response.data;
  },

  getCourseProgress: async () => {
    const response = await api.get(API_ENDPOINTS.PROFILE_PROGRESS_COURSES);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get(API_ENDPOINTS.PROFILE_DASHBOARD);
    return response.data;
  },

  getUserEnrollments: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get(API_ENDPOINTS.PROFILE_ENROLLMENTS, { params });
    return response.data;
  },

  getUserCertificates: async (page = 1, limit = 6) => {
    const response = await api.get(API_ENDPOINTS.PROFILE_CERTIFICATES, { params: { page, limit } });
    return response.data;
  },

  updateEnrollmentStatus: async (enrollmentId: string, status: string) => {
    const response = await api.put(`${API_ENDPOINTS.PROFILE_ENROLLMENTS}/${enrollmentId}/status`, { status });
    return response.data;
  },

  // Convenience wrapper for saved tutorials (delegates to tutorial endpoints)
  getSavedTutorials: async (language?: string) => {
    const response = await api.get(API_ENDPOINTS.TUTORIALS_USER_SAVED, { params: language ? { language } : undefined });
    return response.data;
  },
};

export default profileAPI;
