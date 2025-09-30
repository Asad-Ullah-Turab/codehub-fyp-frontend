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
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup', 
  EDITOR: '/editor',
  OAUTH_SUCCESS: '/auth/success',
} as const;