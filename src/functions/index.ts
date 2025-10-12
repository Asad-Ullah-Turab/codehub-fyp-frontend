// Export all function modules for easy importing

// Authentication functions
export * from './AuthFunctions/authFunctions';

// Code execution functions
export * from './CodeExecution/codeExecutionFunctions';

// Form handling functions
export * from './FormFunctions/formFunctions';

// Navigation functions
export * from './NavigationFunctions/navigationFunctions';

// Utility functions
export * from './UtilityFunctions/utilityFunctions';

// Re-export commonly used functions with aliases for convenience
export {
  handleSignin as signin,
  handleSignup as signup,
  handleLogout as logout,
  handleOAuthLogin as oauthLogin,
} from './AuthFunctions/authFunctions';

export {
  handleCodeExecution as executeCode,
  handleLanguageChange as changeLanguage,
} from './CodeExecution/codeExecutionFunctions';

export {
  handleNavigation as navigate,
  redirectWithParams as redirect,
} from './NavigationFunctions/navigationFunctions';

export {
  validateEmail,
  validatePassword,
  validateName,
} from './AuthFunctions/authFunctions';

export {
  debounce,
  throttle,
  formatDate,
  copyToClipboard,
  getErrorMessage,
} from './UtilityFunctions/utilityFunctions';