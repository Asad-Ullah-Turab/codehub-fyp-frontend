import api from './api';

export const profileAPI = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (profileData: Record<string, unknown>) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  uploadProfilePicture: async (file: File) => {
    const form = new FormData();
    form.append('profilePicture', file);
    const response = await api.post('/profile/upload-picture', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  markPromptShown: async () => {
    const response = await api.post('/profile/prompt-shown');
    return response.data;
  },

  getCourseProgress: async () => {
    const response = await api.get('/profile/progress/courses');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/profile/dashboard');
    return response.data;
  },

  getUserEnrollments: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/profile/enrollments', { params });
    return response.data;
  },

  getUserCertificates: async (page = 1, limit = 6) => {
    const response = await api.get('/profile/certificates', { params: { page, limit } });
    return response.data;
  },

  updateEnrollmentStatus: async (enrollmentId: string, status: string) => {
    const response = await api.put(`/profile/enrollments/${enrollmentId}/status`, { status });
    return response.data;
  },

  // Convenience wrapper for saved tutorials (delegates to tutorial endpoints)
  getSavedTutorials: async (language?: string) => {
    const response = await api.get('/tutorials/user/saved', { params: language ? { language } : undefined });
    return response.data;
  },
};

export default profileAPI;
