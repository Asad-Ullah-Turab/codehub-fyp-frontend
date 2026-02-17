import api from "./api";
import { API_ENDPOINTS } from '../constants';

export const contactAPI = {
  // Get all contact forms
  getAllContacts: (filters: { search?: string; status?: string; page?: number; limit?: number } = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return api.get(`${API_ENDPOINTS.CONTACT}?${params}`);
  },

  // Public: submit contact form
  submitContact: (formData: { fullName: string; email: string; subject: string; message: string }) => {
    return api.post(API_ENDPOINTS.CONTACT, formData);
  },

  // Reply to a specific contact
  replyToContact: (contactId: string, replyData: { subject: string; message: string }) => {
    return api.post(`${API_ENDPOINTS.CONTACT}/${contactId}/reply`, replyData);
  },

  // Get a specific contact
  getContact: (contactId: string) => {
    return api.get(`${API_ENDPOINTS.CONTACT}/${contactId}`);
  },

  // Update contact status
  updateContactStatus: (contactId: string, status: string) => {
    return api.patch(`${API_ENDPOINTS.CONTACT}/${contactId}/status`, { status });
  },

  // Delete a contact
  deleteContact: (contactId: string) => {
    return api.delete(`${API_ENDPOINTS.CONTACT}/${contactId}`);
  },
};
