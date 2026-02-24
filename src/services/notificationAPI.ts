import api from './api';
import { API_ENDPOINTS } from '../constants';

export interface NotificationType {
  _id: string;
  type: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<NotificationType[]> => {
  const response = await api.get(API_ENDPOINTS.NOTIFICATIONS || '/notifications');
  return response.data.data;
};

export const markNotificationRead = async (id: string): Promise<any> => {
  const response = await api.post(API_ENDPOINTS.NOTIFICATIONS_MARK_READ || '/notifications/mark-read', { id });
  return response.data.data;
};
export const markAllNotificationsRead = async (): Promise<any> => {
  const response = await api.post(API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ || '/notifications/mark-all-read');
  return response.data;
};
