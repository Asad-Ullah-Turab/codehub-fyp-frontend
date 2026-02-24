import api from './api';
import { API_ENDPOINTS } from '../constants';

export interface SubscriptionData {
  email: string;
}

export interface SubscriptionResponse {
  status: string;
  message: string;
  data?: {
    subscriptionId: string;
    email: string;
  };
  errors?: string[];
}

// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string): Promise<SubscriptionResponse> => {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return {
        status: 'error',
        message: 'Email is required',
        errors: ['Email is required']
      };
    }
    if (!emailRegex.test(email)) {
      return {
        status: 'error',
        message: 'Please provide a valid email address',
        errors: ['Please provide a valid email address']
      };
    }

    const response = await api.post(API_ENDPOINTS.NEWSLETTER_SUBSCRIBE, { email: email.trim() });

    return {
      status: 'success',
      message: response.data?.message || 'Successfully subscribed to CodeHub newsletter!',
      data: response.data
    };
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    const message = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
    const errors = error?.response?.data?.errors || ['Network error or server unavailable'];
    return {
      status: 'error',
      message,
      errors,
    };
  }
};

// ---------- Stripe subscription helpers ----------

export const createCheckoutSession = async (): Promise<{ url: string }> => {
  const response = await api.post(API_ENDPOINTS.SUBSCRIPTIONS_CREATE_SESSION);
  return response.data.data;
};

export const getSubscriptionStatus = async (): Promise<any> => {
  const response = await api.get(API_ENDPOINTS.SUBSCRIPTIONS_STATUS);
  return response.data.data;
};

export const cancelSubscription = async (): Promise<any> => {
  const response = await api.post(API_ENDPOINTS.SUBSCRIPTIONS_CANCEL);
  return response.data.data;
};
