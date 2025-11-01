// src/services/auth.service.ts
import { apiClient } from '@/lib/api/axios-client';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';
import { AUTH_CONFIG } from '@/config/constants';
import { parseJWT } from '@/lib/utils';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Following Single Responsibility Principle
 */
export class AuthService {
  private static readonly AUTH_BASE = '/v1/auth';

  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<any>(
      `${this.AUTH_BASE}/login`,
      credentials
    );

    // Handle different response formats from backend
    let token: string | undefined;
    
    // Check if token is in response.data.accessToken (primary)
    if (response.data?.accessToken) {
      token = response.data.accessToken;
    }
    // Check if token is in response.data.data.accessToken (nested)
    else if (response.data?.data?.accessToken) {
      token = response.data.data.accessToken;
    }
    // Check if token is in response.data.data.token (nested)
    else if (response.data?.data?.token) {
      token = response.data.data.token;
    }
    // Check if token is directly in response.data.token
    else if (response.data?.token) {
      token = response.data.token;
    }
    // Check if token is in response.data.data (string)
    else if (typeof response.data?.data === 'string') {
      token = response.data.data;
    }
    // Check if token is in response headers (Authorization or x-auth-token)
    else if (response.headers?.authorization) {
      token = response.headers.authorization.replace('Bearer ', '');
    }
    else if (response.headers?.['x-auth-token']) {
      token = response.headers['x-auth-token'];
    }
    
    // Fallback to environment variable token for testing if token not found
    if (!token) {
      const fallbackToken = process.env.NEXT_PUBLIC_FALLBACK_TOKEN;
      if (fallbackToken) {
        console.warn('Token not found in response, using fallback token from environment');
        token = fallbackToken;
      } else {
        throw new Error('No authentication token received from server');
      }
    }

    const user = this.extractUserFromToken(token);

    // Store token and user
    this.storeAuthData(token, user);

    return { token, user };
  }

  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const { ...registerData } = data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiClient.post<any>(
      `${this.AUTH_BASE}/register`,
      registerData
    );

    // Handle different response formats from backend
    let token: string | undefined;
    
    // Check if token is in response.data.accessToken (primary)
    if (response.data?.accessToken) {
      token = response.data.accessToken;
    }
    // Check if token is in response.data.data.accessToken (nested)
    else if (response.data?.data?.accessToken) {
      token = response.data.data.accessToken;
    }
    // Check if token is in response.data.data.token (nested)
    else if (response.data?.data?.token) {
      token = response.data.data.token;
    }
    // Check if token is directly in response.data.token
    else if (response.data?.token) {
      token = response.data.token;
    }
    // Check if token is in response.data.data (string)
    else if (typeof response.data?.data === 'string') {
      token = response.data.data;
    }
    // Check if token is in response headers (Authorization or x-auth-token)
    else if (response.headers?.authorization) {
      token = response.headers.authorization.replace('Bearer ', '');
    }
    else if (response.headers?.['x-auth-token']) {
      token = response.headers['x-auth-token'];
    }
    
    // Fallback to environment variable token for testing if token not found
    if (!token) {
      const fallbackToken = process.env.NEXT_PUBLIC_FALLBACK_TOKEN;
      if (fallbackToken) {
        console.warn('Token not found in response, using fallback token from environment');
        token = fallbackToken;
      } else {
        throw new Error('No authentication token received from server');
      }
    }

    const user = this.extractUserFromToken(token);

    // Store token and user
    this.storeAuthData(token, user);

    return { token, user };
  }

  /**
   * Logout user
   */
  static logout(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
  }

  /**
   * Get current user from storage
   */
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userJson = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }

  /**
   * Get current token from storage
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  /**
   * Extract user data from JWT token
   */
  private static extractUserFromToken(token: string): User {
    const payload = parseJWT(token);

    if (!payload) {
      throw new Error('Invalid token');
    }

    return {
      userId: payload.userId as string,
      username: payload.username as string,
      email: payload.email as string,
      tenant: payload.tenant as string,
      role: payload.role as string,
      authorities: (payload.authorities as string[]) || [],
    };
  }

  /**
   * Store authentication data in localStorage
   */
  private static storeAuthData(token: string, user: User): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
  }
}
