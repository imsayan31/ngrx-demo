import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private authService = inject(AuthService);

  private get role(): string | null {
    return this.authService.getRole();
  }

  canViewEmployees(): boolean {
    return this.role === 'ADMIN' ||
      this.role === 'HR_ADMIN' ||
      this.role === 'MANAGER';
  }

  canCreateEmployee(): boolean {
    return this.role === 'ADMIN' ||
      this.role === 'HR_ADMIN';
  }

  canEditEmployee(): boolean {
    return this.role === 'ADMIN' ||
      this.role === 'HR_ADMIN';
  }

  canDeleteEmployee(): boolean {
    return this.role === 'ADMIN' ||
      this.role === 'HR_ADMIN';
  }

}
