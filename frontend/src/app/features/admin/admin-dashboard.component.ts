import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { AdminService } from '../../core/services/admin.service';
import { AdminDashboard } from '../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="dashboard">
      <h1>Admin Dashboard</h1>

      <app-loading-spinner [isLoading]="loading()" message="Loading dashboard..."></app-loading-spinner>

      <div *ngIf="!loading() && data()" class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">👥</span>
          <h3>Total Vendors</h3>
          <p class="stat-value">{{ data()?.totalVendors || 0 }}</p>
        </div>
        <div class="stat-card">
          <span class="stat-icon">✅</span>
          <h3>Approved Vendors</h3>
          <p class="stat-value">{{ data()?.approvedVendors || 0 }}</p>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⏳</span>
          <h3>Pending Vendors</h3>
          <p class="stat-value">{{ data()?.pendingVendors || 0 }}</p>
        </div>
        <div class="stat-card">
          <span class="stat-icon">👤</span>
          <h3>Total Clients</h3>
          <p class="stat-value">{{ data()?.totalClients || 0 }}</p>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📦</span>
          <h3>Total Products</h3>
          <p class="stat-value">{{ data()?.totalProducts || 0 }}</p>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📂</span>
          <h3>Total Categories</h3>
          <p class="stat-value">{{ data()?.totalCategories || 0 }}</p>
        </div>
      </div>

      <div *ngIf="error()" class="error-message">
        {{ error() }}
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 32px;
      font-size: 32px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 10px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
    }

    .stat-card:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-4px);
    }

    .stat-icon {
      font-size: 32px;
      display: block;
      margin-bottom: 12px;
    }

    .stat-card h3 {
      margin: 0 0 12px 0;
      color: #7f8c8d;
      font-size: 13px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .stat-value {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      color: #2c3e50;
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 16px;
      border-radius: 6px;
      margin-top: 20px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  data = signal<AdminDashboard | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAdminDashboard().subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load dashboard');
        this.loading.set(false);
      }
    });
  }
}
