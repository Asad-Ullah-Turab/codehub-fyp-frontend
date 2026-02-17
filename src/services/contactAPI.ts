import axiosInstance from "./api";

export const contactAPI = {
  // Get all contact forms
  getAllContacts: (filters: { search?: string; status?: string; page?: number; limit?: number } = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return axiosInstance.get(`/contact?${params}`);
  },

  // Public: submit contact form
  submitContact: (formData: { fullName: string; email: string; subject: string; message: string }) => {
    return axiosInstance.post('/contact', formData);
  },

  // Reply to a specific contact
  replyToContact: (contactId: string, replyData: { subject: string; message: string }) => {
    return axiosInstance.post(`/contact/${contactId}/reply`, replyData);
  },

  // Get a specific contact
  getContact: (contactId: string) => {
    return axiosInstance.get(`/contact/${contactId}`);
  },

  // Update contact status
  updateContactStatus: (contactId: string, status: string) => {
    return axiosInstance.patch(`/contact/${contactId}/status`, { status });
  },

  // Delete a contact
  deleteContact: (contactId: string) => {
    return axiosInstance.delete(`/contact/${contactId}`);
  },
};
