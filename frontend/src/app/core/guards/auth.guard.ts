import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const publicGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUser();

  if (!auth.isLoggedIn()) return true;

  if (!user) return true;

  const currentUrl = state.url;
  let targetRoute = '';

  if (user.role === 'ROLE_ADMIN') {
    targetRoute = '/admin/dashboard';
  } else if (user.role === 'ROLE_VENDOR') {
    targetRoute = user.vendorStatus === 'APPROVED' ? '/vendor/dashboard' : '/pending';
  } else if (user.role === 'ROLE_CLIENT') {
    targetRoute = '/client/home';
  }

  // If already navigating to target route, allow it (prevent loop)
  if (currentUrl.startsWith(targetRoute)) {
    return true;
  }

  router.navigate([targetRoute]);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (!user || user.role !== 'ROLE_ADMIN') {
    if (user?.role === 'ROLE_VENDOR') {
      router.navigate(['/vendor/dashboard']);
    } else {
      router.navigate(['/client/home']);
    }
    return false;
  }

  return true;
};

export const vendorApprovedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (user.role !== 'ROLE_VENDOR') {
    router.navigate(['/client/home']);
    return false;
  }

  if (user.vendorStatus !== 'APPROVED') {
    router.navigate(['/pending']);
    return false;
  }

  return true;
};

export const clientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (!user || user.role !== 'ROLE_CLIENT') {
    if (user?.role === 'ROLE_ADMIN') {
      router.navigate(['/admin/dashboard']);
    } else if (user?.role === 'ROLE_VENDOR') {
      router.navigate(['/vendor/dashboard']);
    } else {
      router.navigate(['/login']);
    }
    return false;
  }

  return true;
};

export const pendingApprovalGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (user.role !== 'ROLE_VENDOR') {
    if (user.role === 'ROLE_ADMIN') {
      router.navigate(['/admin/dashboard']);
    } else if (user.role === 'ROLE_CLIENT') {
      router.navigate(['/client/home']);
    }
    return false;
  }

  if (user.vendorStatus === 'APPROVED') {
    router.navigate(['/vendor/dashboard']);
    return false;
  }

  if (user.vendorStatus === 'REJECTED') {
    router.navigate(['/login']);
    return false;
  }

  if (user.vendorStatus !== 'PENDING') {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
