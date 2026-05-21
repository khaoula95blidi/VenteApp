import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { ClientService } from '../../core/services/client.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-container">
      <h1>Checkout</h1>

      <div *ngIf="cartItems.length === 0" class="empty-message">
        <p>Your cart is empty.</p>
        <a routerLink="/client/cart" class="btn-back">Back to Cart</a>
      </div>

      <div *ngIf="cartItems.length > 0" class="checkout-content">
        <!-- Order Summary (Left) -->
        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="summary-items">
            <div *ngFor="let item of cartItems" class="summary-item">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-qty">x{{ item.quantity }}</div>
              <div class="item-price">{{ item.price * item.quantity | currency }}</div>
            </div>
          </div>

          <div class="summary-total">
            <span>Total Amount:</span>
            <span class="total-price">{{ total | currency }}</span>
          </div>
        </div>

        <!-- Delivery Form (Right) -->
        <div class="delivery-form">
          <h2>Delivery Address</h2>

          <form (ngSubmit)="confirmOrder()">
            <div class="form-group">
              <label for="street">Street Address</label>
              <input
                type="text"
                id="street"
                [(ngModel)]="deliveryAddress.street"
                name="street"
                placeholder="123 Main Street"
                required
              >
            </div>

            <div class="form-group">
              <label for="city">City</label>
              <input
                type="text"
                id="city"
                [(ngModel)]="deliveryAddress.city"
                name="city"
                placeholder="Paris"
                required
              >
            </div>

            <div class="form-group">
              <label for="zipCode">ZIP Code</label>
              <input
                type="text"
                id="zipCode"
                [(ngModel)]="deliveryAddress.zipCode"
                name="zipCode"
                placeholder="75001"
                required
              >
            </div>

            <button
              type="submit"
              class="btn-confirm"
              [disabled]="isLoading"
            >
              {{ isLoading ? 'Processing...' : 'Confirm Order' }}
            </button>

            <a routerLink="/client/cart" class="btn-back">Back to Cart</a>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      padding: 40px 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 32px;
      font-size: 28px;
    }

    .empty-message {
      text-align: center;
      padding: 40px;
    }

    .btn-back {
      display: inline-block;
      padding: 10px 20px;
      background-color: #95a5a6;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 16px;
      font-size: 14px;
    }

    .btn-back:hover {
      background-color: #7f8c8d;
    }

    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .order-summary {
      background-color: #f9f9f9;
      padding: 24px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      height: fit-content;
    }

    .order-summary h2 {
      color: #2c3e50;
      font-size: 18px;
      margin: 0 0 20px 0;
    }

    .summary-items {
      margin-bottom: 20px;
      max-height: 400px;
      overflow-y: auto;
    }

    .summary-item {
      display: grid;
      grid-template-columns: 1fr 60px 100px;
      gap: 12px;
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      align-items: center;
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .item-name {
      color: #2c3e50;
      font-weight: 500;
      word-break: break-word;
    }

    .item-qty {
      text-align: center;
      color: #7f8c8d;
      font-size: 13px;
    }

    .item-price {
      text-align: right;
      color: #2ecc71;
      font-weight: 600;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 2px solid #e0e0e0;
      font-size: 18px;
      font-weight: bold;
      color: #2c3e50;
    }

    .total-price {
      color: #2ecc71;
    }

    .delivery-form {
      background-color: white;
      padding: 24px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .delivery-form h2 {
      color: #2c3e50;
      font-size: 18px;
      margin: 0 0 20px 0;
    }

    .form-group {
      margin-bottom: 16px;
    }

    label {
      display: block;
      margin-bottom: 6px;
      color: #2c3e50;
      font-weight: 500;
      font-size: 14px;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"] {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    input:invalid {
      border-color: #e74c3c;
    }

    .btn-confirm {
      width: 100%;
      padding: 12px;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 16px;
      margin-top: 24px;
      transition: all 0.2s;
    }

    .btn-confirm:hover:not(:disabled) {
      background-color: #27ae60;
    }

    .btn-confirm:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .btn-confirm + .btn-back {
      display: block;
      text-align: center;
    }

    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .summary-item {
        grid-template-columns: 1fr 40px;
        gap: 8px;
      }

      .item-price {
        grid-column: 1 / -1;
        text-align: right;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  isLoading = false;

  deliveryAddress = {
    street: '',
    city: '',
    zipCode: ''
  };

  constructor(
    private cartService: CartService,
    private clientService: ClientService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const cart = this.cartService.getCart();
    this.cartItems = cart.items;
    this.total = this.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    if (this.cartItems.length === 0) {
      this.toastService.warning('Your cart is empty');
    }
  }

  confirmOrder(): void {
    if (!this.validateForm()) return;

    const cart = this.cartService.getCart();
    if (!cart.vendorId) {
      this.toastService.error('No vendor in cart');
      return;
    }

    const orderDto = {
      vendorId: cart.vendorId,
      items: cart.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity
      })),
      deliveryAddress: `${this.deliveryAddress.street}, ${this.deliveryAddress.city}, ${this.deliveryAddress.zipCode}`
    };

    this.isLoading = true;
    this.clientService.createOrder(orderDto).subscribe({
      next: (order) => {
        this.toastService.success('Commande passée avec succès!');
        this.cartService.clearCart();
        setTimeout(() => {
          this.router.navigate(['/client/orders']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Failed to create order';
        this.toastService.error(errorMessage);
      }
    });
  }

  private validateForm(): boolean {
    if (!this.deliveryAddress.street.trim()) {
      this.toastService.error('Please enter a street address');
      return false;
    }
    if (!this.deliveryAddress.city.trim()) {
      this.toastService.error('Please enter a city');
      return false;
    }
    if (!this.deliveryAddress.zipCode.trim()) {
      this.toastService.error('Please enter a ZIP code');
      return false;
    }
    return true;
  }
}
