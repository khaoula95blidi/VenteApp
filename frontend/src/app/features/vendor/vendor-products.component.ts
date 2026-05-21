import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { VendorService } from '../../core/services/vendor.service';
import { PublicService } from '../../core/services/public.service';
import { ToastService } from '../../core/services/toast.service';
import { Produit, Categorie } from '../../core/models/models';

interface ProductForm {
  nom: string;
  description?: string;
  prix: number;
  stock: number;
  categorieId?: number;
  imageUrl?: string;
  actif: boolean;
}

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ProductCardComponent],
  template: `
    <div class="vendor-products">
      <div class="header">
        <h1>My Products</h1>
        <button class="btn-add" (click)="openAddModal()">+ Add Product</button>
      </div>

      <app-loading-spinner [isLoading]="loading()"></app-loading-spinner>

      <div *ngIf="!loading()" class="products-grid">
        <app-product-card
          *ngFor="let product of products()"
          [product]="product"
          (view)="editProduct($event)"
        ></app-product-card>
      </div>

      <div *ngIf="!loading() && products().length === 0" class="empty-state">
        <p>No products yet. Add your first product!</p>
      </div>

      <!-- Add Product Modal -->
      <div *ngIf="isModalOpen()" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Add New Product</h2>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>

          <form (ngSubmit)="createProduct()" #productForm="ngForm" class="product-form">
            <div class="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="nom"
                [(ngModel)]="formData.nom"
                placeholder="Enter product name"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea
                name="description"
                [(ngModel)]="formData.description"
                placeholder="Enter product description"
                rows="4"
                class="form-input"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Price (TND) *</label>
                <input
                  type="number"
                  name="prix"
                  [(ngModel)]="formData.prix"
                  placeholder="0.00"
                  required
                  step="0.01"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  [(ngModel)]="formData.stock"
                  placeholder="0"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <select
                  name="categorieId"
                  [(ngModel)]="formData.categorieId"
                  class="form-input"
                >
                  <option value="">Select a category</option>
                  <option *ngFor="let cat of categories()" [value]="cat.id">
                    {{ cat.nom }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Active</label>
                <input
                  type="checkbox"
                  name="actif"
                  [(ngModel)]="formData.actif"
                  class="form-checkbox"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="imageUrl"
                [(ngModel)]="formData.imageUrl"
                placeholder="https://example.com/image.jpg"
                class="form-input"
              />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" (click)="closeModal()">
                Cancel
              </button>
              <button
                type="submit"
                class="btn-submit"
                [disabled]="submitting() || !productForm.form.valid"
              >
                @if (submitting()) {
                  <span>Adding...</span>
                } @else {
                  <span>Add Product</span>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vendor-products {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    h1 {
      margin: 0;
      color: #2c3e50;
    }

    .btn-add {
      padding: 10px 20px;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-add:hover {
      background-color: #27ae60;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 32px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      margin: 0;
      color: #2c3e50;
      font-size: 24px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 28px;
      color: #999;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    .close-btn:hover {
      color: #333;
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    label {
      font-size: 13px;
      font-weight: 600;
      color: #2c3e50;
    }

    .form-input,
    select {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    .form-input:focus,
    select:focus {
      outline: none;
      border-color: #2ecc71;
      box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
    }

    textarea {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
    }

    textarea:focus {
      outline: none;
      border-color: #2ecc71;
      box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
    }

    .form-checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-top: 6px;
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
      border-top: 1px solid #eee;
      padding-top: 24px;
    }

    .btn-cancel {
      padding: 10px 20px;
      background-color: #ecf0f1;
      color: #2c3e50;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background-color: #bdc3c7;
    }

    .btn-submit {
      padding: 10px 24px;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-submit:hover:not(:disabled) {
      background-color: #27ae60;
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 600px) {
      .modal-content {
        padding: 20px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-footer {
        flex-direction: column;
      }

      .btn-cancel,
      .btn-submit {
        width: 100%;
      }
    }
  `]
})
export class VendorProductsComponent implements OnInit {
  products = signal<Produit[]>([]);
  categories = signal<Categorie[]>([]);
  loading = signal(true);
  submitting = signal(false);
  isModalOpen = signal(false);

  formData: ProductForm = {
    nom: '',
    description: '',
    prix: 0,
    stock: 0,
    categorieId: undefined,
    imageUrl: '',
    actif: true
  };

  constructor(
    private vendorService: VendorService,
    private publicService: PublicService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.vendorService.getVendorProducts().subscribe({
      next: (res) => {
        this.products.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.toast.error('Failed to load products');
        this.loading.set(false);
      }
    });
  }

  loadCategories(): void {
    this.publicService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: (err) => {
        this.toast.error('Failed to load categories');
      }
    });
  }

  openAddModal(): void {
    this.resetForm();
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      nom: '',
      description: '',
      prix: 0,
      stock: 0,
      categorieId: undefined,
      imageUrl: '',
      actif: true
    };
  }

  createProduct(): void {
    if (!this.formData.nom || this.formData.prix <= 0 || this.formData.stock < 0) {
      this.toast.error('Please fill in all required fields');
      return;
    }

    this.submitting.set(true);

    const productPayload: Produit = {
      nom: this.formData.nom,
      description: this.formData.description,
      prix: this.formData.prix,
      stock: this.formData.stock,
      categorieId: this.formData.categorieId,
      actif: this.formData.actif,
      reference: `REF-${Date.now()}`
    };

    this.vendorService.createProduct(productPayload).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.toast.success('Produit ajouté avec succès');
        this.closeModal();
        this.loadProducts();
      },
      error: (err) => {
        this.submitting.set(false);
        const errorMsg = err.error?.message || 'Erreur lors de l\'ajout du produit';
        this.toast.error(errorMsg);
      }
    });
  }

  editProduct(product: Produit): void {
    console.log('Edit product:', product);
  }
}
