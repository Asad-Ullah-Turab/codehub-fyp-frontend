import api from './api';

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

    const response = await api.get('/snippets');
    return response;
  },

  // Get a single snippet
  async getSnippet(id: string): Promise<{ success: boolean; data: CodeSnippet }> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    const response = await api.get(`/snippets/${id}`);
    return response;
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

    const response = await api.post('/snippets', data);
    return response;
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

    const response = await api.put(`/snippets/${id}`, data);
    return response;
  },

  // Delete a snippet
  async deleteSnippet(id: string): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    const response = await api.delete(`/snippets/${id}`);
    return response;
  },
};
