import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { ClientService } from '../../core/services/client.service';
import { Order } from '../../core/models/models';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, StatusBadgeComponent],
  template: `
    <div class="order-history">
      <h1>Order History</h1>
      <app-loading-spinner [isLoading]="loading()"></app-loading-spinner>

      <div *ngIf="!loading() && orders().length > 0" class="orders-list">
        <div *ngFor="let order of orders()" class="order-item">
          <div class="order-header">
            <h3>#{{ order.orderNumber }}</h3>
            <app-status-badge [status]="order.status || 'PENDING'"></app-status-badge>
          </div>
          <p><strong>Vendor:</strong> {{ order.vendorCompanyName }}</p>
          <p><strong>Total:</strong> {{ order.totalAmount | currency }}</p>
          <p><strong>Date:</strong> {{ order.createdAt | date }}</p>
        </div>
      </div>

      <div *ngIf="!loading() && orders().length === 0" class="empty-state">
        <p>No orders yet.</p>
      </div>
    </div>
  `,
  styles: [`
    .order-history { padding: 40px 20px; max-width: 800px; margin: 0 auto; }
    h1 { color: #2c3e50; margin-bottom: 32px; }
    .orders-list { display: flex; flex-direction: column; gap: 12px; }
    .order-item { background: white; padding: 16px; border-radius: 6px; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .order-header h3 { margin: 0; }
    .order-item p { margin: 4px 0; color: #7f8c8d; }
    .empty-state { text-align: center; padding: 40px; }
  `]
})
export class OrderHistoryComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.getClientOrders().subscribe({
      next: (res) => { this.orders.set(res); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
