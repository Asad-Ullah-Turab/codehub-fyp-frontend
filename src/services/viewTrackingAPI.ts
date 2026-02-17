import api from "./api";

export const viewTrackingAPI = {
  // Track views
  trackTutorialView: async (tutorialId: string) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.VIEWS_TUTORIAL_VIEW.replace('{tutorialId}', tutorialId)}`);
      return response.data;
    } catch (error) {
      console.error("Error tracking tutorial view:", error);
      throw error;
    }
  },

  trackCourseView: async (courseId: string) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.VIEWS_COURSE_VIEW.replace('{courseId}', courseId)}`);
      return response.data;
    } catch (error) {
      console.error("Error tracking course view:", error);
      throw error;
    }
  },

  // Get most viewed content
  getMostViewedTutorials: async (limit: number = 10) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VIEWS_TUTORIALS_MOST_VIEWED}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching most viewed tutorials:", error);
      throw error;
    }
  },

  getMostViewedCourses: async (limit: number = 10) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VIEWS_COURSES_MOST_VIEWED}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching most viewed courses:", error);
      throw error;
    }
  },

  getMostViewedContent: async (limit: number = 10) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.VIEWS_MOST_VIEWED}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching most viewed content:", error);
      throw error;
    }
  },
};

export default viewTrackingAPI;
