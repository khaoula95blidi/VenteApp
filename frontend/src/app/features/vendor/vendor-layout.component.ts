import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/layouts/navbar.component';
import { SidebarComponent, SidebarItem } from '../../shared/layouts/sidebar.component';
import { ToastComponent } from '../../shared/components/toast.component';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, ToastComponent],
  template: `
    <app-toast></app-toast>
    <app-navbar></app-navbar>

    <div class="vendor-layout">
      <app-sidebar [items]="sidebarItems"></app-sidebar>

      <main class="vendor-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .vendor-layout {
      display: flex;
      min-height: calc(100vh - 60px);
    }

    .vendor-main {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
  `]
})
export class VendorLayoutComponent {
  sidebarItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: '📊',
      route: '/vendor/dashboard'
    },
    {
      label: 'Products',
      icon: '📦',
      route: '/vendor/products'
    },
    {
      label: 'Orders',
      icon: '🛒',
      route: '/vendor/orders'
    },
    {
      label: 'Notifications',
      icon: '🔔',
      route: '/vendor/notifications'
    }
  ];
}
