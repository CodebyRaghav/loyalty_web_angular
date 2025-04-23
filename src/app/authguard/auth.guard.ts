import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (_route, state) => {
  const _router = inject(Router);
  if (localStorage.getItem('access_token')) {
    // this.navRoute.navigate(['/default']);
    return true;
  }
  _router.navigate(['/guest/login']);
  return false;
};
