import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { VendorCardComponent } from '../../shared/components/vendor-card.component';
import { PublicService } from '../../core/services/public.service';
import { Vendor } from '../../core/models/models';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, VendorCardComponent],
  template: `
    <div class="vendor-list">
      <h1>Approved Vendors</h1>

      <app-loading-spinner [isLoading]="loading()" message="Loading vendors..."></app-loading-spinner>

      <div *ngIf="!loading()" class="vendors-grid">
        <app-vendor-card
          *ngFor="let vendor of vendors()"
          [vendor]="vendor"
          (view)="viewVendor($event)"
        ></app-vendor-card>
      </div>

      <div *ngIf="!loading() && vendors().length === 0" class="empty-state">
        <p>No vendors available yet.</p>
      </div>

      <div *ngIf="error()" class="error-message">
        {{ error() }}
      </div>
    </div>
  `,
  styles: [`
    .vendor-list {
      padding: 40px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 32px;
      font-size: 32px;
    }

    .vendors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 10px;
      color: #7f8c8d;
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
export class VendorListComponent implements OnInit {
  vendors = signal<Vendor[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(private publicService: PublicService, private router: Router) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.publicService.getApprovedVendors().subscribe({
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

  viewVendor(vendor: Vendor): void {
    this.router.navigate(['/client/vendors', vendor.id]);
  }
}
