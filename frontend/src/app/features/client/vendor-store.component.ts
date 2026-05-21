import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { PublicService } from '../../core/services/public.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Vendor, Produit } from '../../core/models/models';

@Component({
  selector: 'app-vendor-store',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ProductCardComponent],
  template: `
    <div class="vendor-store">
      <app-loading-spinner [isLoading]="loading()"></app-loading-spinner>

      <div *ngIf="!loading() && vendor()">
        <div class="vendor-header">
          <h1>{{ vendor()?.companyName }}</h1>
          <p>{{ products().length }} products available</p>
        </div>

        <div class="products-grid">
          <app-product-card
            *ngFor="let product of products()"
            [product]="product"
            [showAddToCart]="true"
            (addToCart)="addToCart($event)"
          ></app-product-card>
        </div>

        <div *ngIf="products().length === 0" class="empty-state">
          <p>No products from this vendor yet.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vendor-store { padding: 40px 20px; max-width: 1200px; margin: 0 auto; }
    .vendor-header { margin-bottom: 40px; }
    .vendor-header h1 { margin: 0; color: #2c3e50; font-size: 32px; }
    .vendor-header p { margin: 8px 0 0 0; color: #7f8c8d; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .empty-state { text-align: center; padding: 40px; }
  `]
})
export class VendorStoreComponent implements OnInit {
  vendor = signal<Vendor | null>(null);
  products = signal<Produit[]>([]);
  loading = signal(true);
  vendorId: number | null = null;

  constructor(
    private publicService: PublicService,
    private cartService: CartService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.vendorId = +params['id'];
      if (this.vendorId) this.loadVendor();
    });
  }

  loadVendor(): void {
    if (!this.vendorId) return;
    this.publicService.getVendorProfile(this.vendorId).subscribe({
      next: (vendor) => {
        this.vendor.set(vendor);
        this.loadProducts();
      },
      error: () => this.loading.set(false)
    });
  }

  loadProducts(): void {
    if (!this.vendorId) return;
    this.publicService.getVendorProducts(this.vendorId).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart(product: Produit): void {
    if (!this.vendorId) return;

    const result = this.cartService.addToCart(product, this.vendorId);

    if (result.conflict) {
      const clearCart = confirm(
        'Votre panier contient des produits d\'un autre vendeur. Voulez-vous vider le panier et continuer?'
      );

      if (clearCart) {
        this.cartService.clearCart();
        const clearResult = this.cartService.addToCart(product, this.vendorId);
        if (clearResult.success) {
          this.toastService.success('Produit ajouté au panier');
        }
      }
    } else if (result.success) {
      this.toastService.success('Produit ajouté au panier');
    }
  }
}
