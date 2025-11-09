const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const adminAPI = {
  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // User management
  getAllUsers: async (page = 1, limit = 10, search = '', role = '', status = '') => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        role,
        status,
      });
      const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  searchUsers: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/search?query=${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to search users');
      return await response.json();
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  updateUserStatus: async (userId, accountStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ accountStatus }),
      });
      if (!response.ok) throw new Error('Failed to update user status');
      return await response.json();
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  changeUserRole: async (userId, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error('Failed to change user role');
      return await response.json();
    } catch (error) {
      console.error('Error changing user role:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Tutorial management
  getAllTutorials: async (page = 1, limit = 10, language = '', search = '') => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        language,
        search,
      });
      const response = await fetch(`${API_BASE_URL}/admin/tutorials?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch tutorials');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      throw error;
    }
  },

  createTutorial: async (tutorialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/tutorials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(tutorialData),
      });
      if (!response.ok) throw new Error('Failed to create tutorial');
      return await response.json();
    } catch (error) {
      console.error('Error creating tutorial:', error);
      throw error;
    }
  },

  updateTutorial: async (tutorialId, tutorialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/tutorials/${tutorialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(tutorialData),
      });
      if (!response.ok) throw new Error('Failed to update tutorial');
      return await response.json();
    } catch (error) {
      console.error('Error updating tutorial:', error);
      throw error;
    }
  },

  deleteTutorial: async (tutorialId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/tutorials/${tutorialId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete tutorial');
      return await response.json();
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      throw error;
    }
  },

  // Analytics
  getAnalytics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },
};
