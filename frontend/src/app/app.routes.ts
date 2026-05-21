import { Routes } from '@angular/router';
import { authGuard, publicGuard, adminGuard, vendorApprovedGuard, clientGuard, pendingApprovalGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/auth-shell.component').then(m => m.AuthShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/public/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'vendor-signup',
        loadComponent: () => import('./features/auth/vendor-signup.component').then(m => m.VendorSignupComponent)
      },
      // TEMPORARILY DISABLED TO TEST
      // {
      //   path: 'pending',
      //   canActivate: [pendingApprovalGuard],
      //   loadComponent: () => import('./features/auth/pending-approval.component').then(m => m.PendingApprovalComponent)
      // }
      {
        path: 'pending',
        loadComponent: () => import('./features/public/home.component').then(m => m.HomeComponent)
      }
    ]
  },
  {
    path: 'client',
    canActivate: [authGuard, clientGuard],
    loadComponent: () => import('./features/client/client-layout.component').then(m => m.ClientLayoutComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/client/client-home.component').then(m => m.ClientHomeComponent)
      },
      {
        path: 'vendors',
        loadComponent: () => import('./features/public/vendor-list.component').then(m => m.VendorListComponent)
      },
      {
        path: 'vendors/:id',
        loadComponent: () => import('./features/client/vendor-store.component').then(m => m.VendorStoreComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/client/cart.component').then(m => m.CartComponent)
      },
      {
        path: 'checkout',
        loadComponent: () => import('./features/client/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/client/order-history.component').then(m => m.OrderHistoryComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'vendors',
        loadComponent: () => import('./features/admin/vendor-management.component').then(m => m.VendorManagementComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/admin/category-management.component').then(m => m.CategoryManagementComponent)
      }
    ]
  },
  {
    path: 'vendor',
    canActivate: [authGuard, vendorApprovedGuard],
    loadComponent: () => import('./features/vendor/vendor-layout.component').then(m => m.VendorLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/vendor/vendor-dashboard.component').then(m => m.VendorDashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/vendor/vendor-products.component').then(m => m.VendorProductsComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/vendor/vendor-orders.component').then(m => m.VendorOrdersComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/vendor/vendor-notifications.component').then(m => m.VendorNotificationsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
