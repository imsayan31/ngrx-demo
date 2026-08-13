import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
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
        // Login redirect will be added next
      }
      return throwError(() => error);
    }));
  }
  return next(req);
};
