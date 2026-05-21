import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { VendorService } from '../../core/services/vendor.service';
import { Order } from '../../core/models/models';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, StatusBadgeComponent],
  template: `
    <div class="vendor-orders">
      <h1>My Orders</h1>
      <app-loading-spinner [isLoading]="loading()"></app-loading-spinner>

      <div *ngIf="!loading() && orders().length > 0" class="orders-list">
        <div *ngFor="let order of orders()" class="order-item">
          <div class="order-header">
            <h3>Order #{{ order.orderNumber }}</h3>
            <app-status-badge [status]="order.status || 'PENDING'"></app-status-badge>
          </div>
          <div class="order-details">
            <p><strong>Client:</strong> {{ order.clientNom }}</p>
            <p><strong>Total:</strong> {{ order.totalAmount | currency }}</p>
            <p><strong>Date:</strong> {{ order.createdAt | date }}</p>
          </div>
          <button class="btn-view">View Details</button>
        </div>
      </div>

      <div *ngIf="!loading() && orders().length === 0" class="empty-state">
        <p>No orders yet.</p>
      </div>
    </div>
  `,
  styles: [`
    .vendor-orders { padding: 20px; }
    h1 { color: #2c3e50; margin-bottom: 24px; }
    .orders-list { display: flex; flex-direction: column; gap: 16px; }
    .order-item { background: white; padding: 16px; border-radius: 6px; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .order-header h3 { margin: 0; color: #2c3e50; }
    .order-details { font-size: 13px; color: #7f8c8d; margin-bottom: 12px; }
    .order-details p { margin: 4px 0; }
    .btn-view { padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .empty-state { text-align: center; padding: 40px; }
  `]
})
export class VendorOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);

  constructor(private vendorService: VendorService) {}

  ngOnInit(): void {
    this.vendorService.getVendorOrders().subscribe({
      next: (res) => { this.orders.set(res); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
