import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, take } from 'rxjs/operators';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map(user => {
      // If the user IS logged in...
      if (user) {
        // ...redirect them to the dashboard and block access to the public page.
        router.navigate(['/dashboard']);
        return false;
      }
      // If the user is NOT logged in, allow access.
      return true;
    })
  );
};