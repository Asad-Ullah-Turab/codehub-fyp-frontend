import api from './api';

const BASE = '/creator-subscription';

export const creatorSubscriptionAPI = {
  getStatus: async () => {
    const res = await api.get(`${BASE}/status`);
    return res.data;
  },

  createCheckoutSession: async () => {
    const res = await api.post(`${BASE}/create-checkout-session`);
    return res.data;
  },

  cancel: async () => {
    const res = await api.post(`${BASE}/cancel`);
    return res.data;
  },

  startConnectOnboarding: async () => {
    const res = await api.post(`${BASE}/connect/onboard`);
    return res.data;
  },

  getConnectStatus: async () => {
    const res = await api.get(`${BASE}/connect/status`);
    return res.data;
  },

  getPayouts: async (page = 1, limit = 12) => {
    const res = await api.get(`${BASE}/payouts`, { params: { page, limit } });
    return res.data;
  },

  triggerPayouts: async () => {
    const res = await api.post(`${BASE}/payouts/trigger`);
    return res.data;
  },

  saveGeminiKey: async (apiKey: string) => {
    const res = await api.put(`${BASE}/gemini-key`, { apiKey });
    return res.data;
  },

  deleteGeminiKey: async () => {
    const res = await api.delete(`${BASE}/gemini-key`);
    return res.data;
  },
};
