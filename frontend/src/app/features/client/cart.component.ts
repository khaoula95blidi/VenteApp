import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="cart">
      <h1>Shopping Cart</h1>

      <div *ngIf="cartItems.length === 0" class="empty-message">
        <p>Your cart is empty.</p>
        <a routerLink="/client/vendors" class="btn-continue">Continue Shopping</a>
      </div>

      <div *ngIf="cartItems.length > 0" class="cart-content">
        <div class="cart-items">
          <div *ngFor="let item of cartItems" class="cart-item">
            <div class="item-info">
              <h3>{{ item.name }}</h3>
              <p class="item-price">{{ item.price | currency }}</p>
            </div>

            <div class="item-quantity">
              <button (click)="decrementQuantity(item.productId)" class="qty-btn">−</button>
              <input type="number" [(ngModel)]="item.quantity" (change)="updateQuantity(item.productId, item.quantity)" class="qty-input" min="1">
              <button (click)="incrementQuantity(item.productId)" class="qty-btn">+</button>
            </div>

            <div class="item-subtotal">
              {{ item.price * item.quantity | currency }}
            </div>

            <button (click)="removeItem(item.productId)" class="btn-remove">Remove</button>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>{{ subtotal | currency }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>{{ total | currency }}</span>
          </div>

          <button (click)="checkout()" class="btn-checkout">Proceed to Checkout</button>
          <a routerLink="/client/vendors" class="btn-continue-shopping">Continue Shopping</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart { padding: 40px 20px; max-width: 1000px; margin: 0 auto; }
    h1 { color: #2c3e50; margin-bottom: 32px; }

    .empty-message { text-align: center; padding: 40px; }
    .btn-continue { display: inline-block; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 6px; }

    .cart-content { display: grid; grid-template-columns: 1fr 300px; gap: 30px; }

    .cart-items { display: flex; flex-direction: column; gap: 16px; }

    .cart-item {
      display: grid;
      grid-template-columns: 1fr 120px 120px 100px;
      gap: 16px;
      align-items: center;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      background-color: #f9f9f9;
    }

    .item-info h3 { margin: 0; color: #2c3e50; font-size: 16px; }
    .item-price { margin: 4px 0 0 0; color: #7f8c8d; font-size: 13px; }

    .item-quantity { display: flex; align-items: center; gap: 8px; }
    .qty-btn { width: 32px; height: 32px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px; font-weight: bold; }
    .qty-btn:hover { background-color: #f0f0f0; }
    .qty-input { width: 50px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; text-align: center; }

    .item-subtotal { text-align: right; font-weight: 600; color: #2ecc71; }

    .btn-remove { padding: 6px 12px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .btn-remove:hover { background-color: #c0392b; }

    .cart-summary {
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 20px;
      background-color: #f9f9f9;
      height: fit-content;
    }

    .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .summary-row.total { font-size: 18px; font-weight: bold; color: #2c3e50; border-top: 2px solid #e0e0e0; padding-top: 12px; margin-top: 12px; }

    .btn-checkout {
      width: 100%;
      padding: 12px;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 16px;
    }
    .btn-checkout:hover { background-color: #27ae60; }

    .btn-continue-shopping {
      display: block;
      text-align: center;
      padding: 10px;
      color: #3498db;
      text-decoration: none;
      margin-top: 12px;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .cart-content { grid-template-columns: 1fr; }
      .cart-item { grid-template-columns: 1fr; }
      .item-subtotal { text-align: left; }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  total = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const cart = this.cartService.getCart();
    this.cartItems = cart.items;
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    this.total = this.subtotal;
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.loadCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateQuantity(productId, quantity);
    this.loadCart();
  }

  incrementQuantity(productId: number): void {
    const item = this.cartItems.find(i => i.productId === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId: number): void {
    const item = this.cartItems.find(i => i.productId === productId);
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  checkout(): void {
    this.router.navigate(['/client/checkout']);
  }
}
