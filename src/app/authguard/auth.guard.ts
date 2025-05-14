import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (_route, state) => {
  const _router = inject(Router);
  if (localStorage.getItem('access_token') && localStorage.getItem('role')) {
    if (localStorage.getItem('role') == 'user') {
      if (localStorage.getItem('hcode')) {
        const allowedRoutes = ['/dashboard', '/user-history'];
        if (allowedRoutes.includes(state.url)) {
          return true;
        } else {
          _router.navigate(['/dashboard']);
          return false;
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        _router.navigate(['/login']);
        return false;
      }
    } else {
      return true;
    }
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('hcode');
  _router.navigate(['/login']);
  return false;
};
