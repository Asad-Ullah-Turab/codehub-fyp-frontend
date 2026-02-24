/**
 * Tutorial Functions
 * Utility functions for user-facing tutorial operations
 */

import { tutorialAPI } from "../../services/tutorialAPI";

// Type definitions
export interface Tutorial {
  _id: string;
  title: string;
  description: string;
  language: string;
  concept: string;
  mainConcept: boolean;
  difficulty: string;
  content: string;
  notes: string[];
  tips: string[];
  tags: string[];
  codeExamples: Array<{
    title: string;
    description: string;
    code: string;
    input: string;
    expectedOutput: string;
  }>;
}

export interface MainConcepts {
  python: string[];
  javascript: string[];
  cpp: string[];
}

// Main concepts - will be fetched from backend
const MAIN_CONCEPTS_DATA: MainConcepts = {
  python: [
    'Variables',
    'Data Types',
    'Control Flow',
    'Loops',
    'Functions',
  ],
  javascript: [
    'Variables',
    'Conditionals',
    'Loops',
    'Functions',
    'DOM Manipulation',
  ],
  cpp: [
    'Variables',
    'Input/Output',
    'Control Structures',
    'Loops',
    'Functions',
  ],
};

/**
 * Fetch main concepts for all languages
 * @returns MainConcepts object with concepts grouped by language
 */
export const fetchMainConcepts = async (): Promise<MainConcepts> => {
  try {
    const languages = ['python', 'javascript', 'cpp'];
    const result: MainConcepts = {
      python: [],
      javascript: [],
      cpp: [],
    };

    // Fetch concepts for each language using centralized API service
    for (const language of languages) {
      const resp = await tutorialAPI.getConceptsByLanguage(language);
      result[language as keyof MainConcepts] = resp?.concepts || resp?.data || [];
    }

    // Return fetched concepts, fallback to hardcoded if backend fails
    const hasAnyData = Object.values(result).some(arr => arr.length > 0);
    return hasAnyData ? result : MAIN_CONCEPTS_DATA;
  } catch (error) {
    console.error('Error fetching concepts from backend, using defaults:', error);
    return MAIN_CONCEPTS_DATA;
  }
};

/**
 * Fetch tutorials based on filters
 * @param language - Programming language filter
 * @param concept - Tutorial concept filter ('all' or specific concept)
 * @returns Array of tutorials
 */
export const fetchTutorialsByLanguageAndConcept = async (
  language: string,
  concept: string = ''
): Promise<Tutorial[]> => {
  try {
    // Language-specific grouped response
    if (!concept || concept === 'all') {
      const resp = await tutorialAPI.getTutorialsByLanguage(language);
      if (resp?.tutorials) {
        const allTutorials: Tutorial[] = [];
        Object.values(resp.tutorials as Record<string, Tutorial[]>).forEach((conceptTutorials) => {
          allTutorials.push(...conceptTutorials);
        });
        return allTutorials;
      }

      return resp?.data || [];
    }

    // Use general tutorials endpoint with filters
    const resp = await tutorialAPI.getAllTutorials({ language, concept });
    if (Array.isArray(resp)) return resp;
    return resp?.data || [];
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    throw error;
  }
};

/**
 * Fetch a single tutorial by ID
 * @param tutorialId - The tutorial ID
 * @returns Single tutorial object
 */
export const fetchTutorialById = async (tutorialId: string): Promise<Tutorial> => {
  try {
    const resp = await tutorialAPI.getTutorialById(tutorialId);
    return resp?.data;
  } catch (error) {
    console.error('Error fetching tutorial:', error);
    throw error;
  }
};

/**
 * Save tutorial to user's favorites
 * @param tutorialId - The tutorial ID to save
 * @returns Success response
 */
export const saveTutorialToFavorites = async (tutorialId: string): Promise<{ success: boolean }> => {
  try {
    const resp = await tutorialAPI.saveTutorial(tutorialId);
    return resp;
  } catch (error) {
    console.error('Error saving tutorial:', error);
    throw error;
  }
};

/**
 * Utility: Get difficulty color for UI display
 * @param difficulty - Difficulty level
 * @returns Hex color code
 */
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return '#10b981'; // Green
    case 'intermediate':
      return '#f59e0b'; // Amber
    case 'advanced':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Gray
  }
};

/**
 * Utility placeholder (previously returned emojis, now blank). 
 * UI components render their own icons for languages.
 */
export const getLanguageEmoji = (_language: string): string => {
  return '';
};

/**
 * Utility: Format tutorial date
 * @param dateString - Date string
 * @returns Formatted date
 */
export const formatTutorialDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Utility: Get tutorial status badge text
 * @param isSaved - Whether tutorial is saved
 * @returns Status text
 */
export const getTutorialStatusText = (isSaved: boolean): string => {
  return isSaved ? 'Saved' : 'Save for Later';
};

// ========== SAVE TUTORIAL FUNCTIONS ==========

/**
 * Save a tutorial for later viewing
 * @param tutorialId - Tutorial ID to save
 * @returns Promise with save result
 */
export const saveTutorial = async (tutorialId: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const resp = await tutorialAPI.saveTutorial(tutorialId);
    return resp;
  } catch (error) {
    console.error('Error saving tutorial:', error);
    throw error;
  }
};

/**
 * Remove a tutorial from saved list
 * @param tutorialId - Tutorial ID to unsave
 * @returns Promise with unsave result
 */
export const unsaveTutorial = async (tutorialId: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const resp = await tutorialAPI.unsaveTutorial(tutorialId);
    return resp;
  } catch (error) {
    console.error('Error unsaving tutorial:', error);
    throw error;
  }
};

/**
 * Get user's saved tutorials
 * @param filters - Optional filters for language and difficulty
 * @returns Promise with saved tutorials list
 */
export const getSavedTutorials = async (filters?: {
  language?: string;
  difficulty?: string;
}): Promise<{
  success: boolean;
  count: number;
  data: Array<{
    _id: string;
    savedAt: string;
    tutorial: Tutorial;
  }>;
}> => {
  try {
    const resp = await tutorialAPI.getSavedTutorials(filters?.language);
    return resp;
  } catch (error) {
    console.error('Error fetching saved tutorials:', error);
    throw error;
  }
};
