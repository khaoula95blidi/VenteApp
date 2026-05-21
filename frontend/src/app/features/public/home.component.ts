import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page">
      <section class="hero">
        <div class="hero-content">
          <h1>Bienvenue sur VenteApp Marketplace</h1>
          <p>La plateforme multi-vendeur pour développer votre commerce</p>
          <div class="hero-buttons">
            <a routerLink="/login" class="btn btn-primary">Se connecter</a>
            <a routerLink="/register" class="btn btn-secondary">S'inscrire comme Client</a>
            <a routerLink="/vendor-signup" class="btn btn-secondary">Devenir Vendeur</a>
          </div>
        </div>
      </section>

      <section class="features">
        <h2>Nos Services</h2>
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">🏪</span>
            <h3>Pour les Vendeurs</h3>
            <p>Créez votre boutique, gérez vos produits et vos commandes facilement.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🛍️</span>
            <h3>Pour les Clients</h3>
            <p>Découvrez une variété de produits de plusieurs vendeurs en un seul endroit.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🔒</span>
            <h3>Sécurité</h3>
            <p>Transactions sécurisées et protection de vos données personnelles.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">📊</span>
            <h3>Analytique</h3>
            <p>Tableaux de bord détaillés pour suivre vos ventes et performances.</p>
          </div>
        </div>
      </section>

      <section class="cta">
        <h2>Rejoignez VenteApp Aujourd'hui</h2>
        <p>Commencez à vendre ou acheter maintenant</p>
        <a routerLink="/vendor-signup" class="btn btn-large">Commencer comme Vendeur</a>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100%;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 40px;
      text-align: center;
    }

    .hero-content h1 {
      font-size: 42px;
      margin: 0 0 16px 0;
      font-weight: 700;
    }

    .hero-content > p {
      font-size: 18px;
      margin: 0 0 32px 0;
      opacity: 0.9;
    }

    .hero-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      display: inline-block;
    }

    .btn-primary {
      background-color: white;
      color: #667eea;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .features {
      padding: 60px 40px;
      background-color: #f9f9f9;
    }

    .features h2 {
      text-align: center;
      font-size: 36px;
      margin: 0 0 40px 0;
      color: #2c3e50;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: white;
      padding: 32px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
    }

    .feature-card:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-4px);
    }

    .feature-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 16px;
    }

    .feature-card h3 {
      font-size: 20px;
      margin: 0 0 12px 0;
      color: #2c3e50;
    }

    .feature-card p {
      margin: 0;
      color: #7f8c8d;
      line-height: 1.6;
    }

    .cta {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;
      padding: 60px 40px;
      text-align: center;
    }

    .cta h2 {
      font-size: 36px;
      margin: 0 0 12px 0;
    }

    .cta p {
      font-size: 18px;
      margin: 0 0 24px 0;
      opacity: 0.9;
    }

    .btn-large {
      padding: 14px 40px;
      font-size: 16px;
      background-color: white;
      color: #2ecc71;
    }

    .btn-large:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .hero {
        padding: 40px 20px;
      }

      .hero-content h1 {
        font-size: 28px;
      }

      .hero-buttons {
        flex-direction: column;
      }

      .features {
        padding: 40px 20px;
      }

      .features h2 {
        font-size: 28px;
      }
    }
  `]
})
export class HomeComponent {}
