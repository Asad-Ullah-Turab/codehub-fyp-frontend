// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER: "user",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  SIGNUP: "/auth/signup",
  SIGNIN: "/auth/signin",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/me",
  GOOGLE_OAUTH: "/auth/google",
  GITHUB_OAUTH: "/auth/github",
  CODE_EXECUTE: "/code/execute",
  
  // Auth (email / password helpers)
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_RESET_OTP: '/auth/verify-reset-otp',
  RESET_PASSWORD: '/auth/reset-password',

  // Tutorials
  TUTORIALS: "/tutorials",
  TUTORIALS_CREATE: "/tutorials/create",
  TUTORIALS_SAVE: "/tutorials/save",
  TUTORIALS_USER_SAVED: "/tutorials/user/saved",
  TUTORIALS_USER_CREATED: "/tutorials/user/created",
  TUTORIALS_LANGUAGES: "/tutorials/languages",
  TUTORIALS_CONCEPTS: "/tutorials/concepts",

  // Profile
  PROFILE_BASE: '/profile',
  PROFILE_UPLOAD_PICTURE: '/profile/upload-picture',
  PROFILE_PROMPT_SHOWN: '/profile/prompt-shown',
  PROFILE_PROGRESS_COURSES: "/profile/progress/courses",
  PROFILE_DASHBOARD: "/profile/dashboard",
  PROFILE_ENROLLMENTS: "/profile/enrollments",
  PROFILE_CERTIFICATES: "/profile/certificates",

  // Courses
  COURSES: "/courses",
  COURSES_ENROLL: "/courses/enroll",
  COURSES_USER_ENROLLED: "/courses/user/enrolled",

  // AI / Chat / Code helpers
  AICHAT_MESSAGE: "/aichat/message",
  AICHAT_HISTORY: "/aichat/history",
  AICHAT_CLEAR: "/aichat/clear",
  CODECHAT_MESSAGE: "/codechat/message",
  CODECHAT_HISTORY: "/codechat/history",
  CODECHAT_CLEAR: "/codechat/clear",
  CODEHELP_ERROR_EXPLANATION: "/codehelp/error-explanation",
  CODEHELP_PROBLEM_HINT: "/codehelp/problem-hint",
  CODEHELP_ASK_QUESTION: "/codehelp/ask-question",

  // Views / analytics
  VIEWS_TUTORIAL_VIEW: '/views/tutorials/{tutorialId}/view',
  VIEWS_COURSE_VIEW: '/views/courses/{courseId}/view',
  VIEWS_TUTORIALS_MOST_VIEWED: '/views/tutorials/most-viewed',
  VIEWS_COURSES_MOST_VIEWED: '/views/courses/most-viewed',
  VIEWS_MOST_VIEWED: '/views/most-viewed',

  // Misc
  SNIPPETS: "/snippets",
  NEWSLETTER_SUBSCRIBE: "/newsletter/subscribe",
  CONTACT: "/contact",

  // Admin
  ADMIN_TUTORIALS: "/admin/tutorials",
  ADMIN_COURSES: "/admin/courses",
  ADMIN_USERS: "/admin/users",
  ADMIN_STATS: "/admin/stats",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_RECENT_ACTIVITY: "/admin/recent-activity",  ADMIN_CERTIFICATES: '/admin/certificates',  ADMIN_CERTIFICATES_PENDING: "/admin/certificates/pending",
  ADMIN_NEWSLETTER_SUBSCRIPTIONS: "/admin/newsletter-subscriptions",
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  EDITOR: "/editor",
  OAUTH_SUCCESS: "/auth/success",
  EMAIL_VERIFICATION: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  TUTORIALS: "/tutorials",
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_TUTORIALS: "/admin/tutorials",
  ADMIN_ANALYTICS: "/admin/analytics",
} as const;

// Admin roles
export const ADMIN_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

// Account status
export const ACCOUNT_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  PENDING: "pending",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  ADMIN_DASHBOARD_LIMIT: 20,
} as const;

// Language options
export const LANGUAGES = {
  PYTHON: "python",
  JAVASCRIPT: "javascript",
  CPP: "cpp",
} as const;

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;
