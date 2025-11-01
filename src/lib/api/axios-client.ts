// src/lib/api/axios-client.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, AUTH_CONFIG, ERROR_MESSAGES } from '@/config/constants';
import { ApiError } from '@/types';

/**
 * Custom Axios client with interceptors for authentication and error handling
 * Following Single Responsibility Principle - handles HTTP communication only
 */
class AxiosClient {
  private client: AxiosInstance;
  private static instance: AxiosClient;

  private constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Singleton pattern - ensures single instance of API client
   */
  public static getInstance(): AxiosClient {
    if (!AxiosClient.instance) {
      AxiosClient.instance = new AxiosClient();
    }
    return AxiosClient.instance;
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token and tenant header
    this.client.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    );

    // Response interceptor - handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      this.handleResponseError.bind(this)
    );
  }

  /**
   * Add authentication token and tenant header to requests
   */
  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = this.getToken();
    const tenant = this.getTenant();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenant) {
      config.headers['x-content-plus-tenant'] = tenant;
    }

    return config;
  }

  /**
   * Handle request errors
   */
  private handleRequestError(error: AxiosError): Promise<never> {
    return Promise.reject(this.normalizeError(error));
  }

  /**
   * Handle response errors - includes token refresh logic
   */
  private async handleResponseError(error: AxiosError): Promise<never> {
    if (!error.response) {
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        statusCode: 0,
      } as ApiError);
    }

    const { status } = error.response;

    // Handle unauthorized errors
    if (status === 401) {
      this.handleUnauthorized();
      return Promise.reject({
        message: ERROR_MESSAGES.UNAUTHORIZED,
        statusCode: 401,
      } as ApiError);
    }

    // Handle session expired
    if (status === 403) {
      return Promise.reject({
        message: ERROR_MESSAGES.SESSION_EXPIRED,
        statusCode: 403,
      } as ApiError);
    }

    return Promise.reject(this.normalizeError(error));
  }

  /**
   * Normalize error response to ApiError format
   */
  private normalizeError(error: AxiosError): ApiError {
    const response = error.response?.data as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    return {
      message: response?.message || error.message || ERROR_MESSAGES.GENERIC_ERROR,
      statusCode: error.response?.status || 500,
      errors: response?.errors,
    };
  }

  /**
   * Handle unauthorized access - clear tokens and redirect to login
   */
  private handleUnauthorized(): void {
    this.clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Get authentication token from storage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  /**
   * Get tenant from storage
   */
  private getTenant(): string {
    if (typeof window === 'undefined') return API_CONFIG.DEFAULT_TENANT;
    return localStorage.getItem('tenant') || API_CONFIG.DEFAULT_TENANT;
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
  }

  /**
   * Get the Axios instance for making requests
   */
  public getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = AxiosClient.getInstance().getClient();
