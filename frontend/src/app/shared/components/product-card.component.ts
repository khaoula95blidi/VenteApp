import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produit } from '../../core/models/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card">
      <div class="product-header">
        <span class="product-category">{{ product.categorieNom || 'Uncategorized' }}</span>
        <span *ngIf="product.stockFaible" class="low-stock-badge">Low Stock</span>
      </div>

      <div class="product-body">
        <h3 class="product-name">{{ product.nom }}</h3>
        <p class="product-description">{{ product.description || 'No description' }}</p>

        <div class="product-details">
          <div class="detail-item">
            <span class="label">Reference:</span>
            <span class="value">{{ product.reference }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Stock:</span>
            <span class="value" [ngClass]="{ 'stock-low': product.stock < 5 }">
              {{ product.stock }} units
            </span>
          </div>
        </div>

        <div class="product-price">
          <span class="price">{{ product.prix | currency }}</span>
          <span *ngIf="product.prixAchat" class="cost">Cost: {{ product.prixAchat | currency }}</span>
        </div>
      </div>

      <div class="product-footer">
        <button
          (click)="onViewClick()"
          class="btn-primary"
          [disabled]="!product.actif"
        >
          {{ product.actif ? 'View Details' : 'Inactive' }}
        </button>
        <button
          *ngIf="showAddToCart"
          (click)="onAddToCart()"
          class="btn-secondary"
          [disabled]="!product.actif || product.stock < 1"
        >
          Add to Cart
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
    }

    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #3498db;
    }

    .product-header {
      padding: 12px;
      background-color: #f5f5f5;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .product-category {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 600;
    }

    .low-stock-badge {
      background-color: #ff9800;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }

    .product-body {
      padding: 16px;
      flex: 1;
    }

    .product-name {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .product-description {
      margin: 0 0 12px 0;
      font-size: 13px;
      color: #666;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-details {
      margin-bottom: 12px;
      font-size: 12px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .label {
      color: #999;
      font-weight: 500;
    }

    .value {
      color: #333;
      font-weight: 600;
    }

    .stock-low {
      color: #ff9800;
    }

    .product-price {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin: 12px 0;
      padding-top: 12px;
      border-top: 1px solid #eee;
    }

    .price {
      font-size: 18px;
      font-weight: bold;
      color: #2ecc71;
    }

    .cost {
      font-size: 12px;
      color: #999;
    }

    .product-footer {
      padding: 12px;
      background-color: #f9f9f9;
      display: flex;
      gap: 8px;
      border-top: 1px solid #e0e0e0;
    }

    .btn-primary,
    .btn-secondary {
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

    .btn-primary:hover:not(:disabled) {
      background-color: #2980b9;
    }

    .btn-secondary {
      background-color: #2ecc71;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #27ae60;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Produit;
  @Input() showAddToCart = false;
  @Output() view = new EventEmitter<Produit>();
  @Output() addToCart = new EventEmitter<Produit>();

  onViewClick(): void {
    this.view.emit(this.product);
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
