import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <div class="logo-icon">🛒</div>
          <div class="logo-text">Vente<span>App</span></div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-label">Principal</div>
            <a class="nav-item" routerLink="/dashboard" routerLinkActive="active">
              <span class="material-icons">dashboard</span> Tableau de bord
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-label">Gestion</div>
            <a class="nav-item" routerLink="/ventes" routerLinkActive="active">
              <span class="material-icons">receipt_long</span> Ventes
            </a>
            <a class="nav-item" routerLink="/clients" routerLinkActive="active">
              <span class="material-icons">people</span> Clients
            </a>
            <a class="nav-item" routerLink="/produits" routerLinkActive="active">
              <span class="material-icons">inventory_2</span> Produits
            </a>
          </div>
        </nav>

        <div class="sidebar-user">
          <div class="user-avatar">{{ userInitial() }}</div>
          <div class="user-info">
            <div class="name">{{ userName() }}</div>
            <div class="role">{{ userRole() }}</div>
          </div>
          <button class="logout-btn" (click)="logout()" title="Déconnexion">
            <span class="material-icons">logout</span>
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `
})
export class ShellComponent {
  constructor(private auth: AuthService) {}

  userName = computed(() => this.auth.currentUser()?.fullName || this.auth.currentUser()?.username || '');
  userInitial = computed(() => (this.userName()[0] || 'U').toUpperCase());
  userRole = computed(() => {
    const r = this.auth.currentUser()?.role || '';
    return r.replace('ROLE_', '');
  });

  logout() { this.auth.logout(); }
}
