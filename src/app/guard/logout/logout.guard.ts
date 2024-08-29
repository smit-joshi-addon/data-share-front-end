import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NbAuthService } from '@nebular/auth';

// Create a guard function using CanActivateFn
export const logoutGuard: CanActivateFn = () => {
  const authService = inject(NbAuthService);
  const router = inject(Router);

  return authService.isAuthenticated()
    .pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          // User is authenticated, allow logout
          localStorage.clear();
          router.navigate(['/auth/login']);
          return true;
        } else {
          // User is not authenticated, redirect to login
          console.warn('Access denied - User not authenticated');
          router.navigate(['/auth/login']);
          return false;
        }
      }),
      catchError(err => {
        console.error('Error in logout guard:', err);
        router.navigate(['/auth/login']);
        return of(false);
      })
    );
};
