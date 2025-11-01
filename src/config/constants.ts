// src/config/constants.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://content-plus-core.qa.medad.com',
  DEFAULT_TENANT: process.env.NEXT_PUBLIC_DEFAULT_TENANT || '_default',
  TIMEOUT: 30000, // 30 seconds
} as const;

export const AUTH_CONFIG = {
  TOKEN_KEY: 'content_plus_token',
  USER_KEY: 'content_plus_user',
  REFRESH_TOKEN_KEY: 'content_plus_refresh_token',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

export const SEARCH_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  DEBOUNCE_DELAY: 500, // milliseconds
  MIN_QUERY_LENGTH: 2,
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SEARCH: '/search',
  UPLOAD: '/upload',
  PROFILE: '/profile',
} as const;

export const SEARCH_TYPES = {
  FUZZY: { value: 'fuzzy', label: 'Fuzzy Search', description: 'Approximate matching for typos' },
  EXACT: { value: 'exact', label: 'Exact Match', description: 'Precise text matching' },
  PARTIAL: { value: 'partial', label: 'Partial Match', description: 'Partial text matching' },
  SEMANTIC: {
    value: 'semantic',
    label: 'Semantic Search',
    description: 'AI-powered meaning-based search',
  },
  RAG: {
    value: 'rag',
    label: 'RAG Search',
    description: 'Get AI-generated answers with sources',
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_ERROR: 'Failed to upload document. Please try again.',
  SEARCH_ERROR: 'Search failed. Please try again.',
} as const;
