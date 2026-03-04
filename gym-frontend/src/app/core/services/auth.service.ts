import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User, Member } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User | Member;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly currentUser = signal<User | Member | null>(null);
  private readonly token = signal<string | null>(null);
  private readonly isAuthenticated = computed(() => this.currentUser() !== null);
  private readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  readonly user = this.currentUser.asReadonly();
  readonly authenticated = this.isAuthenticated;
  readonly admin = this.isAdmin;

  constructor() {
    // Restore user from localStorage on init (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.restoreSession();
    }
  }

  private restoreSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken && storedUser) {
      this.token.set(storedToken);
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password } as LoginRequest),
      );

      this.handleAuthResponse(response);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async register(request: RegisterRequest): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/register`, request),
      );

      this.handleAuthResponse(response);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }

  private handleAuthResponse(response: AuthResponse): void {
    // Map backend role format to frontend format
    const user = {
      ...response.user,
      role: response.user.role.toLowerCase() as 'admin' | 'member',
      membershipStatus: (response.user as Member).membershipStatus?.toLowerCase() as
        | 'active'
        | 'inactive'
        | 'expired'
        | undefined,
    };

    this.token.set(response.token);
    this.currentUser.set(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  getToken(): string | null {
    return this.token();
  }

  // For demo purposes - sets mock user locally
  setMockUser(role: 'admin' | 'member'): void {
    if (role === 'admin') {
      this.currentUser.set({
        id: '1',
        email: 'admin@gym.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        createdAt: new Date(),
      });
    } else {
      this.currentUser.set({
        id: '2',
        email: 'member@gym.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'member',
        membershipStatus: 'active',
        joinDate: new Date('2024-01-15'),
        createdAt: new Date(),
      } as Member);
    }
  }
}
