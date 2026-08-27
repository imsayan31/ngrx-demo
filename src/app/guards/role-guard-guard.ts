import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getRole();
  const allowedRoles = route.data?.['roles'] as string[];
  if (userRole && allowedRoles?.includes(userRole)) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
