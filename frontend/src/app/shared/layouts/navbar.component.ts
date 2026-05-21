import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <a routerLink="/" class="brand-link">
            <span class="brand-icon">🏪</span>
            <span class="brand-text">VenteApp</span>
          </a>
        </div>

        <div class="navbar-menu">
          <div class="navbar-nav">
            <!-- Admin Links -->
            <ng-container *ngIf="user?.role === 'ROLE_ADMIN'">
              <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
                Dashboard
              </a>
              <a routerLink="/admin/vendors" routerLinkActive="active" class="nav-link">
                Vendors
              </a>
              <a routerLink="/admin/categories" routerLinkActive="active" class="nav-link">
                Categories
              </a>
            </ng-container>

            <!-- Vendor Links -->
            <ng-container *ngIf="user?.role === 'ROLE_VENDOR' && user?.vendorStatus === 'APPROVED'">
              <a routerLink="/vendor/dashboard" routerLinkActive="active" class="nav-link">
                Dashboard
              </a>
              <a routerLink="/vendor/products" routerLinkActive="active" class="nav-link">
                Products
              </a>
              <a routerLink="/vendor/orders" routerLinkActive="active" class="nav-link">
                Orders
              </a>
              <a routerLink="/vendor/notifications" routerLinkActive="active" class="nav-link">
                Notifications
              </a>
            </ng-container>

            <!-- Client Links -->
            <ng-container *ngIf="user?.role === 'ROLE_CLIENT'">
              <a routerLink="/client/home" routerLinkActive="active" class="nav-link">
                Home
              </a>
              <a routerLink="/client/vendors" routerLinkActive="active" class="nav-link">
                Vendors
              </a>
              <a routerLink="/client/cart" routerLinkActive="active" class="nav-link cart-link">
                🛒 Cart <span *ngIf="cartService.getItemCount() > 0" class="cart-badge">{{ cartService.getItemCount() }}</span>
              </a>
              <a routerLink="/client/orders" routerLinkActive="active" class="nav-link">
                Orders
              </a>
            </ng-container>
          </div>

          <div class="navbar-user">
            <div class="user-info">
              <span class="user-name">{{ user?.username }}</span>
              <span *ngIf="user?.vendorStatus" class="user-status">{{ user?.vendorStatus }}</span>
            </div>
            <button (click)="logout()" class="btn-logout">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #2c3e50;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 18px;
    }

    .brand-icon {
      font-size: 24px;
    }

    .navbar-menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;
      flex: 1;
      margin-left: 40px;
    }

    .navbar-nav {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .nav-link {
      color: #ecf0f1;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 4px;
      transition: all 0.2s;
      font-size: 14px;
      font-weight: 500;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-link.active {
      background-color: #3498db;
      color: white;
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
    }

    .user-status {
      font-size: 11px;
      color: #95a5a6;
      text-transform: uppercase;
    }

    .btn-logout {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      background-color: #c0392b;
    }

    .cart-link {
      position: relative;
    }

    .cart-badge {
      background-color: #e74c3c;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      margin-left: 4px;
    }

    @media (max-width: 768px) {
      .navbar-container {
        flex-direction: column;
        height: auto;
        padding: 10px 20px;
      }

      .navbar-menu {
        width: 100%;
        flex-direction: column;
        gap: 16px;
        margin-left: 0;
      }

      .navbar-nav {
        width: 100%;
        flex-wrap: wrap;
        gap: 8px;
      }

      .navbar-user {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService, public cartService: CartService) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
