import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="client-home">
      <div class="hero-section">
        <h1>Welcome to VenteApp</h1>
        <p>Discover products from multiple vendors</p>
      </div>

      <div class="action-cards">
        <div class="action-card">
          <span class="icon">🛍️</span>
          <h3>Browse Vendors</h3>
          <p>Explore our marketplace of trusted vendors</p>
          <a routerLink="/client/vendors" class="btn-action">View Vendors</a>
        </div>

        <div class="action-card">
          <span class="icon">🛒</span>
          <h3>My Cart</h3>
          <p>Check your shopping cart and proceed to checkout</p>
          <a routerLink="/client/cart" class="btn-action">Go to Cart</a>
        </div>

        <div class="action-card">
          <span class="icon">📦</span>
          <h3>Order History</h3>
          <p>View your previous orders and track shipments</p>
          <a routerLink="/client/orders" class="btn-action">View Orders</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .client-home {
      padding: 40px 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .hero-section h1 {
      font-size: 32px;
      color: #2c3e50;
      margin: 0 0 12px 0;
    }

    .hero-section p {
      font-size: 18px;
      color: #7f8c8d;
      margin: 0;
    }

    .action-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .action-card {
      background: white;
      border-radius: 10px;
      padding: 28px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      text-align: center;
      transition: all 0.3s;
    }

    .action-card:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-4px);
    }

    .icon {
      font-size: 48px;
      display: block;
      margin-bottom: 16px;
    }

    .action-card h3 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 20px;
    }

    .action-card p {
      margin: 0 0 16px 0;
      color: #7f8c8d;
      font-size: 14px;
      line-height: 1.6;
    }

    .btn-action {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-action:hover {
      background-color: #2980b9;
    }
  `]
})
export class ClientHomeComponent {}
