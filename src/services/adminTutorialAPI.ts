import api from "./api";
import { API_ENDPOINTS } from '../constants';

// Admin Tutorial API
export const adminTutorialAPI = {
  // Get all tutorials (with filters)
  getAllTutorials: async (params?: {
    page?: number;
    limit?: number;
    language?: string;
    difficulty?: string;
    search?: string;
  }) => {
    const response = await api.get(API_ENDPOINTS.ADMIN_TUTORIALS, { params });
    return response.data;
  },

  // Get single tutorial
  getTutorial: async (id: string) => {
    const response = await api.get(`${API_ENDPOINTS.TUTORIALS}/${id}`);
    return response.data;
  },

  // Create new tutorial
  createTutorial: async (tutorialData: {
    title: string;
    description?: string;
    content: string;
    language: string;
    concept: string;
    difficulty?: string;
    codeExamples?: Array<{ code: string; explanation?: string }>;
    notes?: string[];
    tips?: string[];
    tags?: string[];
    isPremium?: boolean;
  }) => {
    const response = await api.post(API_ENDPOINTS.ADMIN_TUTORIALS, tutorialData);
    return response.data;
  },

  // Update tutorial
  updateTutorial: async (
    id: string,
    tutorialData: {
      title?: string;
      description?: string;
      content?: string;
      language?: string;
      concept?: string;
      difficulty?: string;
      codeExamples?: Array<{ code: string; explanation?: string }>;
      notes?: string[];
      tips?: string[];
      tags?: string[];
      isPremium?: boolean;
    }
  ) => {
    const response = await api.put(`${API_ENDPOINTS.ADMIN_TUTORIALS}/${id}`, tutorialData);
    return response.data;
  },

  // Delete tutorial
  deleteTutorial: async (id: string) => {
    const response = await api.delete(`${API_ENDPOINTS.ADMIN_TUTORIALS}/${id}`);
    return response.data;
  },

  // Get available languages
  getLanguages: async () => {
    const response = await api.get(API_ENDPOINTS.TUTORIALS_LANGUAGES);
    return response.data;
  },

  // Get concepts by language
  getConcepts: async (language: string) => {
    // backend route defined as /tutorials/concepts/:language
    const response = await api.get(`${API_ENDPOINTS.TUTORIALS_CONCEPTS}/${language}`);
    return response.data;
  },
};

export default adminTutorialAPI;
