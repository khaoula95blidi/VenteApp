import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/layouts/navbar.component';
import { ToastComponent } from '../../shared/components/toast.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, ToastComponent],
  template: `
    <app-toast></app-toast>
    <app-navbar></app-navbar>

    <main class="client-main">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .client-main {
      min-height: calc(100vh - 60px);
      padding: 20px;
      background-color: #f5f5f5;
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class ClientLayoutComponent {}
