/**
 * Tutorial Functions
 * Utility functions for user-facing tutorial operations
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Main concepts - hardcoded but can be fetched from backend
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
  // In future, fetch from backend
  // const response = await fetch(`${API_BASE_URL}/tutorials/concepts`);
  // return await response.json();
  return MAIN_CONCEPTS_DATA;
};

/**
 * Fetch tutorials based on filters
 * @param language - Programming language filter
 * @param concept - Tutorial concept filter
 * @returns Array of tutorials
 */
export const fetchTutorialsByLanguageAndConcept = async (
  language: string,
  concept: string = ''
): Promise<Tutorial[]> => {
  try {
    let url = `${API_BASE_URL}/tutorials?language=${language}`;
    if (concept) {
      url += `&concept=${concept}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch tutorials');
    
    const data = await response.json();
    return data.data || [];
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
    const response = await fetch(`${API_BASE_URL}/tutorials/${tutorialId}`);
    if (!response.ok) throw new Error('Failed to fetch tutorial');
    
    const data = await response.json();
    return data.data;
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
    const response = await fetch(`${API_BASE_URL}/tutorials/${tutorialId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to save tutorial');
    
    return await response.json();
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
 * Utility: Get language emoji for UI display
 * @param language - Programming language
 * @returns Emoji string
 */
export const getLanguageEmoji = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'python':
      return '🐍';
    case 'javascript':
      return '🟨';
    case 'cpp':
      return '⚙️';
    default:
      return '💻';
  }
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
