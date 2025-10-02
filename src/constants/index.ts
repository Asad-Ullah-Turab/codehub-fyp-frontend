// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  SIGNUP: '/auth/signup',
  SIGNIN: '/auth/signin',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/me',
  GOOGLE_OAUTH: '/auth/google',
  GITHUB_OAUTH: '/auth/github',
  CODE_EXECUTE: '/code/execute',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup', 
  EDITOR: '/editor',
  OAUTH_SUCCESS: '/auth/success',
  EMAIL_VERIFICATION: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;