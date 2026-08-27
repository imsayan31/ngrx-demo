import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
}

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = '/api/auth';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = {
      username,
      password
    };
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      ) as JwtPayload;

      return payload.role;
    } catch (error) {
      console.error('Unable to decode JWT:', error);
      return null;
    }
  }

  getUsername(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      ) as JwtPayload;

      return payload.sub;
    } catch (error) {
      console.error('Unable to decode JWT:', error);
      return null;
    }
  }

  getDashboardRoute(): string {
    const role = this.getRole();
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'HR_ADMIN':
        return '/hr/dashboard';
      case 'MANAGER':
        return '/manager/dashboard';
      case 'EMPLOYEE':
        return '/employee/dashboard';
      default:
        return '/login';
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
