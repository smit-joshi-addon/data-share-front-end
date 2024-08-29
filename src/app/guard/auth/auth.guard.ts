import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Create a guard function using CanActivateFn
export const authGuard: CanActivateFn = (
  route,
  state
): Observable<boolean> | Promise<boolean> | boolean => {
  const authService = inject(NbAuthService);
  const router = inject(Router);

  return authService.isAuthenticated()
    .pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true; // Allow navigation
        } else {
          console.warn('Access denied - User not authenticated');
          router.navigate(['/auth/login']); // Redirect to login
          return false; // Prevent navigation
        }
      }),
      catchError(err => {
        console.error('Error in auth guard:', err);
        router.navigate(['/auth/login']); // Redirect to login on error
        return of(false); // Prevent navigation
      })
    );
};
