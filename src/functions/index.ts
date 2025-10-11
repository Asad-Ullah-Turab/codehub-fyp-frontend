// Export all function modules for easy importing

// Authentication functions
export * from './authFunctions';

// Code execution functions
export * from './codeExecutionFunctions';

// Form handling functions
export * from './formFunctions';

// Navigation functions
export * from './navigationFunctions';

// Utility functions
export * from './utilityFunctions';

// Re-export commonly used functions with aliases for convenience
export {
  handleSignin as signin,
  handleSignup as signup,
  handleLogout as logout,
  handleOAuthLogin as oauthLogin,
} from './authFunctions';

export {
  handleCodeExecution as executeCode,
  handleLanguageChange as changeLanguage,
} from './codeExecutionFunctions';

export {
  handleNavigation as navigate,
  redirectWithParams as redirect,
} from './navigationFunctions';

export {
  validateEmail,
  validatePassword,
  validateName,
} from './authFunctions';

export {
  debounce,
  throttle,
  formatDate,
  copyToClipboard,
  getErrorMessage,
} from './utilityFunctions';