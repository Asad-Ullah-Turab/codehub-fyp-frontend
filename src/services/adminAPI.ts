import api from "./api";
import { API_ENDPOINTS } from '../constants';

export const adminAPI = {
  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN_STATS);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // User management
  getAllUsers: async (
    page = 1,
    limit = 10,
    search = "",
    role = "",
    status = "",
    plan = ""
  ) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        role,
        status,
        plan,
      });
      const response = await api.get(`${API_ENDPOINTS.ADMIN_USERS}?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  searchUsers: async (query: string) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ADMIN_USERS}/search?query=${query}`);
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },

  getUserDetails: async (userId: string) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ADMIN_USERS}/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  },

  updateUserDetails: async (
    userId: string,
    userData: Record<string, unknown>
  ) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.ADMIN_USERS}/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user details:", error);
      throw error;
    }
  },

  updateUserStatus: async (
    userId: string,
    accountStatus: string,
    reason?: string
  ) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/status`, {
        accountStatus,
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

  changeUserRole: async (userId: string, role: string) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/role`, {
        role,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing user role:", error);
      throw error;
    }
  },

  sendEmailToUser: async (userId: string, subject: string, message: string) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/send-email`, {
        subject,
        message,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.ADMIN_USERS}/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Tutorial management
  getAllTutorials: async (page = 1, limit = 10, language = "", search = "") => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        language,
        search,
      });
      const response = await api.get(`${API_ENDPOINTS.ADMIN_TUTORIALS}?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      throw error;
    }
  },

  createTutorial: async (tutorialData: Record<string, unknown>) => {
    try {
      const response = await api.post(API_ENDPOINTS.ADMIN_TUTORIALS, tutorialData);
      return response.data;
    } catch (error) {
      console.error("Error creating tutorial:", error);
      throw error;
    }
  },

  updateTutorial: async (
    tutorialId: string,
    tutorialData: Record<string, unknown>
  ) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.ADMIN_TUTORIALS}/${tutorialId}`, tutorialData);
      return response.data;
    } catch (error) {
      console.error("Error updating tutorial:", error);
      throw error;
    }
  },

  deleteTutorial: async (tutorialId: string) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.ADMIN_TUTORIALS}/${tutorialId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      throw error;
    }
  },

  // Analytics
  getAnalytics: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN_ANALYTICS);
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  },

  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ADMIN_RECENT_ACTIVITY}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  },

  // Admin: certificate management
  getPendingCertificates: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.ADMIN_CERTIFICATES_PENDING}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pending certificates:", error);
      throw error;
    }
  },

  approveCertificate: async (certificateId: string) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.ADMIN_CERTIFICATES}/${certificateId}/approve`);
      return response.data;
    } catch (error) {
      console.error("Error approving certificate:", error);
      throw error;
    }
  },

  rejectCertificate: async (certificateId: string, rejectionReason: string) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.ADMIN_CERTIFICATES}/${certificateId}/reject`, { rejectionReason });
      return response.data;
    } catch (error) {
      console.error("Error rejecting certificate:", error);
      throw error;
    }
  },

  // Newsletter subscriptions
  getNewsletterSubscriptions: async (filters: { search?: string; page?: number; limit?: number } = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await api.get(`${API_ENDPOINTS.ADMIN_NEWSLETTER_SUBSCRIPTIONS}?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching newsletter subscriptions:", error);
      throw error;
    }
  },
};
