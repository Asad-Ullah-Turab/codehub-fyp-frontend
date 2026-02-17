import api from "./api";
import axios from "axios";
import { API_ENDPOINTS } from '../constants';

export interface CodeChatMessage {
  message: string;
  code?: string;
  language?: string;
  error?: string;
  problems?: Array<{
    severity: 'error' | 'warning' | 'info';
    message: string;
    line: number;
    column: number;
  }>;
}

export interface CodeChatResponse {
  success: boolean;
  data: {
    response: string;
  };
}

export interface CodeChatHistory {
  _id: string;
  message: string;
  response: string;
  messageType: 'question' | 'error-help' | 'problem-help' | 'regular';
  createdAt: string;
  code?: string;
  language?: string;
}

// Send a message to the code editor AI assistant
export const sendCodeChatMessage = async (messageData: CodeChatMessage, messageType: string = 'question'): Promise<string> => {
  try {
    const response = await api.post<CodeChatResponse>(API_ENDPOINTS.CODECHAT_MESSAGE, { ...messageData, messageType });
    return response.data.data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to send message to code AI chat");
    }
    throw error;
  }
};

// Get code chat history
export const getCodeChatHistory = async (): Promise<CodeChatHistory[]> => {
  try {
    const response = await api.get<{ success: boolean; data: CodeChatHistory[] }>(API_ENDPOINTS.CODECHAT_HISTORY);
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch code chat history");
    }
    throw error;
  }
};

// Clear code chat history
export const clearCodeChats = async (): Promise<void> => {
  try {
    await api.delete(API_ENDPOINTS.CODECHAT_CLEAR);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to clear code chats");
    }
    throw error;
  }
};