import api from "./api";
import axios from "axios";
import { API_ENDPOINTS } from '../constants';

export interface CodeHelpRequest {
  error?: string;
  problem?: string;
  question?: string;
  code?: string;
  language?: string;
  attempt?: string;
}

export interface CodeHelpResponse {
  success: boolean;
  data: {
    explanation?: string;
    hint?: string;
    answer?: string;
  };
}

export const getErrorExplanation = async (error: string, code?: string, language?: string): Promise<string> => {
  try {
    const response = await api.post<CodeHelpResponse>(API_ENDPOINTS.CODEHELP_ERROR_EXPLANATION, { error, code, language });
    return response.data.data.explanation || "";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get error explanation");
    }
    throw error;
  }
};

export const getProblemHint = async (problem: string, code?: string, language?: string, attempt?: string): Promise<string> => {
  try {
    const response = await api.post<CodeHelpResponse>(API_ENDPOINTS.CODEHELP_PROBLEM_HINT, { problem, code, language, attempt });
    return response.data.data.hint || "";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get hint");
    }
    throw error;
  }
};

export const askCodeQuestion = async (question: string, code?: string, language?: string): Promise<string> => {
  try {
    const response = await api.post<CodeHelpResponse>(API_ENDPOINTS.CODEHELP_ASK_QUESTION, { question, code, language });
    return response.data.data.answer || "";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to get answer");
    }
    throw error;
  }
};
