import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isApiRequest = req.url.startsWith('{backend_api_url}'); 

  if (authService.isAuthenticated() && isApiRequest) {
    return from(authService.getToken()).pipe(
      switchMap(token => {
        if (token) {
          const clonedReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
          return next(clonedReq);
        }
        return next(req);
      })
    );
  }
  return next(req);
};