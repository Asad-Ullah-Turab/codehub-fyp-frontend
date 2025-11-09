import api from "./api";

export const adminAPI = {
  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get("/admin/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // User management
  getAllUsers: async (page = 1, limit = 10, search = "", role = "", status = "") => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        role,
        status,
      });
      const response = await api.get(`/admin/users?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  searchUsers: async (query: string) => {
    try {
      const response = await api.get(`/admin/users/search?query=${query}`);
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },

  updateUserStatus: async (userId: string, accountStatus: string) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, {
        accountStatus,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

  changeUserRole: async (userId: string, role: string) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, {
        role,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing user role:", error);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
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
      const response = await api.get(`/admin/tutorials?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      throw error;
    }
  },

  createTutorial: async (tutorialData: Record<string, unknown>) => {
    try {
      const response = await api.post("/admin/tutorials", tutorialData);
      return response.data;
    } catch (error) {
      console.error("Error creating tutorial:", error);
      throw error;
    }
  },

  updateTutorial: async (tutorialId: string, tutorialData: Record<string, unknown>) => {
    try {
      const response = await api.put(`/admin/tutorials/${tutorialId}`, tutorialData);
      return response.data;
    } catch (error) {
      console.error("Error updating tutorial:", error);
      throw error;
    }
  },

  deleteTutorial: async (tutorialId: string) => {
    try {
      const response = await api.delete(`/admin/tutorials/${tutorialId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      throw error;
    }
  },

  // Analytics
  getAnalytics: async () => {
    try {
      const response = await api.get("/admin/analytics");
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  },
};
