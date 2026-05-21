import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/layouts/navbar.component';
import { SidebarComponent, SidebarItem } from '../../shared/layouts/sidebar.component';
import { ToastComponent } from '../../shared/components/toast.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, ToastComponent],
  template: `
    <app-toast></app-toast>
    <app-navbar></app-navbar>

    <div class="admin-layout">
      <app-sidebar [items]="sidebarItems"></app-sidebar>

      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: calc(100vh - 60px);
    }

    .admin-main {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
  `]
})
export class AdminLayoutComponent {
  sidebarItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: '📊',
      route: '/admin/dashboard'
    },
    {
      label: 'Vendors',
      icon: '👥',
      route: '/admin/vendors'
    },
    {
      label: 'Categories',
      icon: '📂',
      route: '/admin/categories'
    }
  ];
}
