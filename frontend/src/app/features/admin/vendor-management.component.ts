import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { VendorCardComponent } from '../../shared/components/vendor-card.component';
import { AdminService } from '../../core/services/admin.service';
import { Vendor } from '../../core/models/models';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-vendor-management',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, VendorCardComponent],
  template: `
    <div class="vendor-management">
      <h1>Vendor Management</h1>

      <div class="tabs">
        <button [class.active]="tab() === 'all'" (click)="tab.set('all')" class="tab-btn">All Vendors</button>
        <button [class.active]="tab() === 'pending'" (click)="tab.set('pending')" class="tab-btn">Pending</button>
      </div>

      <app-loading-spinner [isLoading]="loading()" message="Loading vendors..."></app-loading-spinner>

      <div *ngIf="!loading()" class="vendors-grid">
        <app-vendor-card
          *ngFor="let vendor of filteredVendors()"
          [vendor]="vendor"
          [showActions]="true"
          (approve)="approveVendor($event)"
          (reject)="rejectVendor($event)"
        ></app-vendor-card>
      </div>

      <div *ngIf="!loading() && filteredVendors().length === 0" class="empty-state">
        <p>No vendors found.</p>
      </div>

      <div *ngIf="error()" class="error-message">
        {{ error() }}
      </div>
    </div>
  `,
  styles: [`
    .vendor-management {
      padding: 40px 20px;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 32px;
    }

    .tabs {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .tab-btn {
      padding: 10px 20px;
      border: 2px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .tab-btn.active {
      border-color: #3498db;
      background-color: #3498db;
      color: white;
    }

    .vendors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 16px;
      border-radius: 6px;
    }
  `]
})
export class VendorManagementComponent implements OnInit {
  vendors = signal<Vendor[]>([]);
  loading = signal(true);
  error = signal('');
  tab = signal<'all' | 'pending'>('all');

  constructor(private adminService: AdminService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.adminService.getVendors().subscribe({
      next: (res) => {
        this.vendors.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load vendors');
        this.loading.set(false);
      }
    });
  }

  filteredVendors(): Vendor[] {
    if (this.tab() === 'pending') {
      return this.vendors().filter(v => v.vendorStatus === 'PENDING');
    }
    return this.vendors();
  }

  approveVendor(vendor: Vendor): void {
    if (!vendor.id) return;
    this.adminService.approveVendor(vendor.id).subscribe({
      next: () => {
        this.toast.success(`Vendor ${vendor.username} approved!`);
        this.loadVendors();
      },
      error: (err) => this.toast.error(err.error?.message || 'Error approving vendor')
    });
  }

  rejectVendor(vendor: Vendor): void {
    const reason = prompt('Enter rejection reason:');
    if (!reason || !vendor.id) return;
    this.adminService.rejectVendor(vendor.id, reason).subscribe({
      next: () => {
        this.toast.success(`Vendor ${vendor.username} rejected!`);
        this.loadVendors();
      },
      error: (err) => this.toast.error(err.error?.message || 'Error rejecting vendor')
    });
  }
}
