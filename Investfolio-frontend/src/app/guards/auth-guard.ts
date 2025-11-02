import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map(user => !!user),
    tap(isAuthenticated => {
      if (!isAuthenticated) router.navigate(['/login']);
    })
  );
};