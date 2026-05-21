import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../../shared/components/toast.component';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent],
  template: `
    <div class="auth-shell">
      <app-toast></app-toast>

      <header class="auth-header">
        <div class="header-container">
          <a routerLink="/" class="brand">
            <span class="brand-icon">🏪</span>
            <span class="brand-text">VenteApp</span>
          </a>
        </div>
      </header>

      <main class="auth-main">
        <router-outlet></router-outlet>
      </main>

      <footer class="auth-footer">
        <p>&copy; 2026 VenteApp Marketplace. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .auth-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-header {
      background-color: rgba(0, 0, 0, 0.2);
      padding: 20px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 20px;
    }

    .brand-icon {
      font-size: 28px;
    }

    .auth-main {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
    }

    .auth-footer {
      padding: 20px;
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 13px;
      background-color: rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      .auth-main {
        padding: 20px 10px;
      }

      .brand-text {
        display: none;
      }
    }
  `]
})
export class AuthShellComponent {}
