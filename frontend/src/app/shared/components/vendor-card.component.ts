import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vendor } from '../../core/models/models';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-vendor-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="vendor-card">
      <div class="vendor-header">
        <h3 class="vendor-name">{{ vendor.companyName }}</h3>
        <app-status-badge *ngIf="vendor.vendorStatus" [status]="vendor.vendorStatus"></app-status-badge>
      </div>

      <div class="vendor-body">
        <div class="vendor-info">
          <p class="info-item">
            <span class="label">Owner:</span>
            <span class="value">{{ vendor.fullName }}</span>
          </p>
          <p class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ vendor.email }}</span>
          </p>
        </div>

        <div class="vendor-stats">
          <div class="stat">
            <span class="stat-value">{{ vendor.totalProducts || 0 }}</span>
            <span class="stat-label">Products</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ vendor.totalOrders || 0 }}</span>
            <span class="stat-label">Orders</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ formatRevenue(vendor.totalRevenue) }}</span>
            <span class="stat-label">Revenue</span>
          </div>
        </div>
      </div>

      <div class="vendor-footer">
        <button (click)="onViewClick()" class="btn-primary">
          View Store
        </button>
        <button *ngIf="showActions" (click)="onApprove()" class="btn-success">
          Approve
        </button>
        <button *ngIf="showActions" (click)="onReject()" class="btn-danger">
          Reject
        </button>
      </div>
    </div>
  `,
  styles: [`
    .vendor-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
    }

    .vendor-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #3498db;
    }

    .vendor-header {
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .vendor-name {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .vendor-body {
      padding: 16px;
      flex: 1;
    }

    .vendor-info {
      margin-bottom: 16px;
    }

    .info-item {
      margin: 0 0 8px 0;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
    }

    .label {
      color: #999;
      font-weight: 500;
    }

    .value {
      color: #333;
      font-weight: 500;
    }

    .vendor-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid #eee;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 16px;
      font-weight: bold;
      color: #2ecc71;
    }

    .stat-label {
      display: block;
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
      margin-top: 4px;
    }

    .vendor-footer {
      padding: 12px;
      background-color: #f9f9f9;
      display: flex;
      gap: 8px;
      border-top: 1px solid #e0e0e0;
    }

    button {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .btn-success {
      background-color: #2ecc71;
      color: white;
    }

    .btn-success:hover {
      background-color: #27ae60;
    }

    .btn-danger {
      background-color: #e74c3c;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c0392b;
    }
  `]
})
export class VendorCardComponent {
  @Input() vendor!: Vendor;
  @Input() showActions = false;
  @Output() view = new EventEmitter<Vendor>();
  @Output() approve = new EventEmitter<Vendor>();
  @Output() reject = new EventEmitter<Vendor>();

  onViewClick(): void {
    this.view.emit(this.vendor);
  }

  onApprove(): void {
    this.approve.emit(this.vendor);
  }

  onReject(): void {
    this.reject.emit(this.vendor);
  }

  formatRevenue(revenue?: number): string {
    if (!revenue) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(revenue);
  }
}
