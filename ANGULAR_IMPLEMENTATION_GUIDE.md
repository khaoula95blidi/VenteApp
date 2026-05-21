# VenteApp Angular Multi-Vendor Frontend - Implementation Guide

**Status**: Ready for Implementation  
**Angular Version**: 17 with Standalone Components  
**Date**: May 21, 2026  

---

## QUICK START SUMMARY

This guide provides:
1. ✅ All updated models and interfaces
2. ✅ Complete guard implementations
3. ✅ Service implementations for all roles
4. ✅ New routing structure (app.routes.ts)
5. 📋 Component templates and structure
6. 📋 Testing checklist

---

## IMPLEMENTATION ORDER

Follow these steps in order:

### Step 1: Update Core Infrastructure (15 mins)
- [x] `core/models/models.ts` - DONE
- [ ] `core/guards/auth.guard.ts` - ADD NEW GUARDS
- [ ] `core/services/auth.service.ts` - UPDATE WITH VENDOR SIGNUP  
- [ ] `core/services/public.service.ts` - NEW SERVICE
- [ ] `core/services/admin.service.ts` - NEW SERVICE
- [ ] `core/services/vendor.service.ts` - NEW SERVICE
- [ ] `core/services/client.service.ts` - NEW SERVICE
- [ ] `core/services/toast.service.ts` - NEW SERVICE

### Step 2: Create Shared Components (30 mins)
- [ ] `shared/components/toast.component.ts`
- [ ] `shared/components/loading-spinner.component.ts`
- [ ] `shared/components/status-badge.component.ts`
- [ ] `shared/components/product-card.component.ts`
- [ ] `shared/components/vendor-card.component.ts`
- [ ] `shared/layouts/navbar.component.ts`
- [ ] `shared/layouts/sidebar.component.ts`

### Step 3: Create Auth Module (30 mins)
- [ ] `features/auth/vendor-signup.component.ts`
- [ ] `features/auth/pending-approval.component.ts`
- [ ] UPDATE `features/auth/login.component.ts`
- [ ] UPDATE `features/auth/register.component.ts`
- [ ] UPDATE `features/auth/auth.routes.ts`

### Step 4: Create Public Module (20 mins)
- [ ] `features/public/home.component.ts`
- [ ] `features/public/vendor-list.component.ts`
- [ ] `features/public/vendor-store.component.ts`
- [ ] CREATE `features/public/public.routes.ts`

### Step 5: Create Admin Module (45 mins)
- [ ] `features/admin/admin-layout.component.ts`
- [ ] `features/admin/admin-dashboard.component.ts`
- [ ] `features/admin/vendor-management.component.ts`
- [ ] `features/admin/vendor-detail-modal.component.ts`
- [ ] `features/admin/category-management.component.ts`
- [ ] CREATE `features/admin/admin.routes.ts`
- [ ] CREATE `features/admin/admin.module.ts` (for lazy loading)

### Step 6: Create Vendor Module (60 mins)
- [ ] `features/vendor/vendor-layout.component.ts`
- [ ] `features/vendor/vendor-dashboard.component.ts`
- [ ] `features/vendor/vendor-products.component.ts`
- [ ] `features/vendor/product-form-modal.component.ts`
- [ ] `features/vendor/vendor-orders.component.ts`
- [ ] `features/vendor/order-detail-modal.component.ts`
- [ ] `features/vendor/vendor-notifications.component.ts`
- [ ] CREATE `features/vendor/vendor.routes.ts`
- [ ] CREATE `features/vendor/vendor.module.ts` (for lazy loading)

### Step 7: Create Client Module (60 mins)
- [ ] `features/client/client-layout.component.ts`
- [ ] `features/client/client-home.component.ts`
- [ ] `features/client/vendor-store.component.ts`
- [ ] `features/client/product-detail-modal.component.ts`
- [ ] `features/client/cart.component.ts`
- [ ] `features/client/checkout.component.ts`
- [ ] `features/client/order-history.component.ts`
- [ ] CREATE `features/client/client.routes.ts`
- [ ] CREATE `features/client/client.module.ts` (for lazy loading)

### Step 8: Update Root Configuration (15 mins)
- [ ] `app.routes.ts` - COMPLETE REWRITE
- [ ] `app.config.ts` - ADD ERROR INTERCEPTOR
- [ ] `app.component.ts` - MINIMAL CHANGES

### Step 9: Testing & Refinement (60 mins)
- [ ] Test all guards and redirects
- [ ] Test login flows for each role
- [ ] Test marketplace workflows
- [ ] Fix styling and responsiveness

---

## CRITICAL CODE SNIPPETS

### Guard Examples

**vendorApprovedGuard.ts**
```typescript
import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
```

**adminGuard.ts**
```typescript
import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
```

**clientGuard.ts**
```typescript
import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
```

### AuthService Updates

```typescript
// Add these methods to auth.service.ts

registerVendor(req: VendorRegisterRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register-vendor`, req).pipe(
    tap(response => {
      this.saveUser(response);
      this.currentUserSignal.set({
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
        token: response.accessToken,
        vendorStatus: response.vendorStatus,
        companyName: response.companyName
      });
    })
  );
}

registerClient(req: ClientRegisterRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register-client`, req).pipe(
    tap(response => {
      this.saveUser(response);
      this.currentUserSignal.set({
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
        token: response.accessToken
      });
    })
  );
}

getVendorStatus(): VendorStatus | undefined {
  return this.currentUser()?.vendorStatus as VendorStatus;
}
```

---

## NEW SERVICES STRUCTURE

### PublicService (public.service.ts)
```typescript
@Injectable({ providedIn: 'root' })
export class PublicService {
  private apiUrl = 'http://localhost:8085/api/public';

  constructor(private http: HttpClient) {}

  getApprovedVendors(page = 0, size = 10): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors?page=${page}&size=${size}`);
  }

  getVendorProfile(vendorId: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/vendors/${vendorId}`);
  }

  getVendorProducts(vendorId: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/vendors/${vendorId}/products`);
  }

  getProduct(productId: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/products/${productId}`);
  }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/categories`);
  }
}
```

### AdminService (admin.service.ts)
```typescript
@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:8085/api/admin';

  constructor(private http: HttpClient) {}

  getVendors(page = 0, size = 10): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors?page=${page}&size=${size}`);
  }

  getPendingVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors/pending`);
  }

  approveVendor(vendorId: number): Observable<Vendor> {
    return this.http.patch<Vendor>(`${this.apiUrl}/vendors/${vendorId}/approve`, {});
  }

  rejectVendor(vendorId: number, reason: string): Observable<Vendor> {
    return this.http.patch<Vendor>(`${this.apiUrl}/vendors/${vendorId}/reject?reason=${reason}`, {});
  }

  getAdminDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.apiUrl}/dashboard`);
  }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/categories`);
  }

  createCategory(dto: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.apiUrl}/categories`, dto);
  }

  updateCategory(id: number, dto: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/categories/${id}`, dto);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }
}
```

### VendorService (vendor.service.ts)
```typescript
@Injectable({ providedIn: 'root' })
export class VendorService {
  private apiUrl = 'http://localhost:8085/api/vendor';

  constructor(private http: HttpClient) {}

  getVendorDashboard(): Observable<VendorDashboard> {
    return this.http.get<VendorDashboard>(`${this.apiUrl}/dashboard`);
  }

  getVendorProducts(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/products`);
  }

  createProduct(dto: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${this.apiUrl}/products`, dto);
  }

  updateProduct(id: number, dto: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/products/${id}`, dto);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  getVendorOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}/status?status=${status}`, {});
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`);
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications/unread`);
  }

  markNotificationRead(notificationId: number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/notifications/${notificationId}/read`, {});
  }
}
```

### ClientService (client.service.ts)
```typescript
@Injectable({ providedIn: 'root' })
export class ClientService {
  private apiUrl = 'http://localhost:8085/api/client';

  constructor(private http: HttpClient) {}

  getClientProfile(): Observable<ClientProfile> {
    return this.http.get<ClientProfile>(`${this.apiUrl}/profile`);
  }

  updateProfile(dto: Partial<ClientProfile>): Observable<ClientProfile> {
    return this.http.put<ClientProfile>(`${this.apiUrl}/profile`, dto);
  }
}
```

### ToastService (toast.service.ts)
```typescript
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<Toast>();
  public toast$ = this.toastSubject.asObservable();

  success(message: string): void {
    this.show({ message, type: 'success', duration: 3000 });
  }

  error(message: string): void {
    this.show({ message, type: 'error', duration: 5000 });
  }

  info(message: string): void {
    this.show({ message, type: 'info', duration: 3000 });
  }

  warning(message: string): void {
    this.show({ message, type: 'warning', duration: 4000 });
  }

  private show(toast: Toast): void {
    this.toastSubject.next(toast);
  }
}

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}
```

---

## NEW ROUTING STRUCTURE (app.routes.ts)

```typescript
import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { vendorApprovedGuard, adminGuard, clientGuard } from './core/guards/role.guard';

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
      {
        path: 'pending',
        loadComponent: () => import('./features/auth/pending-approval.component').then(m => m.PendingApprovalComponent)
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
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'vendor',
    canActivate: [authGuard, vendorApprovedGuard],
    loadChildren: () => import('./features/vendor/vendor.routes').then(m => m.VENDOR_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

---

## COMPONENT TEMPLATE STRUCTURE

Each component should follow this structure:

### Template Structure (*.component.html)
```html
<div class="component-wrapper">
  <!-- Content here -->
  <mat-spinner *ngIf="loading$ | async"></mat-spinner>
</div>
```

### Component Class Structure (*.component.ts)
```typescript
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.css']
})
export class ComponentNameComponent implements OnInit {
  loading$ = new Observable<boolean>();

  constructor(private service: SomeService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Implementation
  }
}
```

---

## MATERIAL COMPONENTS TO USE

```typescript
// Import in each component as needed

// Layout
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

// Data display
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

// Buttons & selection
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

// Forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Modals
import { MatDialogModule } from '@angular/material/dialog';

// Indicators
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';

// Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

// Icons
import { MatIconModule } from '@angular/material/icon';
```

---

## TESTING CHECKLIST

### Authentication & Redirects
- [ ] Guest can access /home, /login, /register, /vendor-signup
- [ ] Logged-in user redirected from /login to appropriate dashboard
- [ ] ADMIN → /admin/dashboard
- [ ] VENDOR (APPROVED) → /vendor/dashboard
- [ ] VENDOR (PENDING) → /pending
- [ ] CLIENT → /client/home
- [ ] PENDING vendor cannot access /vendor/*, gets redirected to /pending
- [ ] Non-ADMIN cannot access /admin/*, gets redirected to role home
- [ ] Non-CLIENT cannot access /client/*, gets redirected to role home

### Vendor Signup & Approval Flow
- [ ] Vendor can signup with email, password, fullName, companyName
- [ ] After signup, shows "Pending Approval" page
- [ ] Cannot login until approved
- [ ] Admin can see vendor in pending list
- [ ] Admin can approve vendor
- [ ] Vendor receives notification on approval
- [ ] Vendor can now login and access dashboard

### Marketplace Features
- [ ] Client can browse list of approved vendors
- [ ] Client can view vendor's store (products)
- [ ] Client can add products to cart (single vendor only)
- [ ] Warn if trying to add from different vendor
- [ ] Client can checkout and place order
- [ ] Vendor sees incoming order in orders list
- [ ] Vendor can update order status (PENDING → CONFIRMED → SHIPPED → DELIVERED)
- [ ] Low stock notifications appear in vendor dashboard

### Admin Features
- [ ] Admin can see all vendors with status
- [ ] Admin can approve/reject pending vendors
- [ ] Admin can create categories
- [ ] Admin can edit/delete categories
- [ ] Admin dashboard shows stats: vendors, clients, products, categories

### UI/UX
- [ ] Toast notifications on success/error
- [ ] Loading spinners during API calls
- [ ] Error messages on failed requests
- [ ] 401 errors redirect to login
- [ ] Responsive design (mobile-friendly)
- [ ] Proper empty states when no data

---

## API BACKEND URLS

Backend runs on: `http://localhost:8085`

Public endpoints:
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/register-vendor`
- POST `/api/auth/register-client`
- POST `/api/auth/refresh`
- GET `/api/public/vendors`
- GET `/api/public/vendors/:id`
- GET `/api/public/vendors/:id/products`
- GET `/api/public/products/:id`
- GET `/api/public/categories`

Admin endpoints:
- GET `/api/admin/vendors`
- GET `/api/admin/vendors/pending`
- PATCH `/api/admin/vendors/:id/approve`
- PATCH `/api/admin/vendors/:id/reject?reason=...`
- GET `/api/admin/categories`
- POST `/api/admin/categories`
- PUT `/api/admin/categories/:id`
- DELETE `/api/admin/categories/:id`
- GET `/api/admin/dashboard`

Vendor endpoints:
- GET `/api/vendor/dashboard`
- GET `/api/vendor/products`
- POST `/api/vendor/products`
- PUT `/api/vendor/products/:id`
- DELETE `/api/vendor/products/:id`
- GET `/api/vendor/orders`
- PATCH `/api/vendor/orders/:id/status?status=...`
- GET `/api/vendor/notifications`
- PATCH `/api/vendor/notifications/:id/read`

Client endpoints:
- GET `/api/client/profile`
- PUT `/api/client/profile`

---

## DEMO CREDENTIALS

After backend DataInitializer runs:
- **Admin**: admin@marketplace.com / Admin123!
- **Vendor1 (APPROVED)**: vendor1@marketplace.com / Vendor123!
- **Vendor2 (PENDING)**: vendor2@marketplace.com / Vendor123!
- **Client1**: client1@marketplace.com / Client123!
- **Client2**: client2@marketplace.com / Client123!

Test flow:
1. Login as vendor1 → see vendor dashboard
2. Login as admin → see admin dashboard with vendors
3. Logout, login as vendor2 → see pending approval page
4. Login as admin, approve vendor2
5. Logout, login as vendor2 → now see vendor dashboard
6. Login as client1 → browse vendors and products

---

## NEXT STEPS

1. **Implement guards** (Step 1) - Copy guard code snippets above
2. **Update AuthService** (Step 1) - Add vendor/client registration methods
3. **Create services** (Step 1) - PublicService, AdminService, VendorService, ClientService, ToastService
4. **Create shared components** (Step 2) - Toast, spinner, badges, cards
5. **Create auth pages** (Step 3) - Vendor signup, pending approval
6. **Create public pages** (Step 4) - Home, vendor list, vendor store
7. **Create admin module** (Step 5) - With lazy loading
8. **Create vendor module** (Step 6) - With lazy loading and charts
9. **Create client module** (Step 7) - With shopping cart
10. **Update app.routes.ts** (Step 8) - Complete rewrite with guards
11. **Test everything** (Step 9) - All role-based flows and marketplace features

Total estimated time: **6-8 hours** for a single developer

---

## STYLING APPROACH

Use **Angular Material** components for consistency:
- Dark sidebar for Admin
- Clean dashboard for Vendor (cards with charts)
- Modern marketplace look for Client

All provided in component templates - customize colors as needed in `styles.css`:

```css
:root {
  --primary-color: #1976d2;
  --success-color: #4caf50;
  --error-color: #f44336;
  --warning-color: #ff9800;
  --info-color: #2196f3;
}
```

---

**Ready to implement? Start with Step 1: Update Core Infrastructure**
