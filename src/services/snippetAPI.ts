import api from './api';
import { API_ENDPOINTS } from '../constants';

export interface CodeSnippet {
  _id: string;
  title: string;
  language: string;
  code: string;
  output?: string;
  createdAt: string;
  updatedAt: string;
}

export const snippetAPI = {
  // Get all user snippets
  async getUserSnippets(): Promise<{ success: boolean; data: CodeSnippet[] }> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    const response = await api.get(API_ENDPOINTS.SNIPPETS);
    return response.data;
  },

  // Get a single snippet
  async getSnippet(id: string): Promise<{ success: boolean; data: CodeSnippet }> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    const response = await api.get(`${API_ENDPOINTS.SNIPPETS}/${id}`);
    return response.data;
  },

  // Create a new snippet
  async createSnippet(data: {
    title: string;
    language: string;
    code: string;
    output?: string;
  }): Promise<{ success: boolean; message: string; data: CodeSnippet }> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    const response = await api.post(API_ENDPOINTS.SNIPPETS, data);
    return response.data;
  },

  // Update a snippet
  async updateSnippet(
    id: string,
    data: Partial<{
      title: string;
      language: string;
      code: string;
      output: string;
    }>
  ): Promise<{ success: boolean; message: string; data: CodeSnippet }> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    const response = await api.put(`${API_ENDPOINTS.SNIPPETS}/${id}`, data);
    return response.data;
  },

  // Delete a snippet
  async deleteSnippet(id: string): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    const response = await api.delete(`${API_ENDPOINTS.SNIPPETS}/${id}`);
    return response.data;
  },
};
