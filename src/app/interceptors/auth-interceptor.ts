import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {Router} from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        alert('JWT expired or invalid');
        localStorage.removeItem('token');
        router.navigate(["/login"]);
        // Login redirect will be added next
      }
      return throwError(() => error);
    }));
  }
  return next(req);
};
