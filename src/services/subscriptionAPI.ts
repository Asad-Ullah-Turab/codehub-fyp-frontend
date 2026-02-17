import api from './api';

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

    const response = await api.post('/newsletter/subscribe', { email: email.trim() });

    return {
      status: 'success',
      message: response.message || 'Successfully subscribed to CodeHub newsletter!',
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