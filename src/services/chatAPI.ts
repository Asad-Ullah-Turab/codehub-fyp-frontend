import api from "./api";
import axios from "axios";
import { API_ENDPOINTS } from '../constants';

export interface ChatMessage {
  message: string;
  context?: "course" | "tutorial";
  contextId?: string;
  contextTitle?: string;
  contentScope?: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    response: string;
  };
}

export const sendMessage = async (messageData: ChatMessage): Promise<string> => {
  try {
    const response = await api.post<ChatResponse>(API_ENDPOINTS.AICHAT_MESSAGE, messageData);
    return response.data.data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to send message to AI chat");
    }
    throw error;
  }
};

export const clearChats = async (): Promise<void> => {
  try {
    await api.delete(API_ENDPOINTS.AICHAT_CLEAR);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to clear chats");
    }
    throw error;
  }
};

export const getChatHistory = async (context?: string, contextId?: string): Promise<any[]> => {
  try {
    const params = new URLSearchParams();
    if (context) params.append('context', context);
    if (contextId) params.append('contextId', contextId);

    const response = await api.get<{ success: boolean; data: any[] }>(API_ENDPOINTS.AICHAT_HISTORY + (params.toString() ? '?' + params.toString() : ''));

    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch chat history"
      );
    }
    throw error;
  }
};
