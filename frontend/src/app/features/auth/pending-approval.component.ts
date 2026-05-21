import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pending-container">
      <div class="pending-card">
        <div class="pending-icon">⏳</div>
        <h1>Inscription en attente</h1>
        <p class="pending-text">
          Votre demande d'enregistrement en tant que vendeur a été reçue avec succès.
        </p>

        <div class="pending-details">
          <div class="detail-item">
            <span class="label">Nom d'utilisateur:</span>
            <span class="value">{{ user()?.username }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Entreprise:</span>
            <span class="value">{{ user()?.companyName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Email:</span>
            <span class="value">{{ user()?.email }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Statut:</span>
            <span class="value status-pending">{{ user()?.vendorStatus }}</span>
          </div>
        </div>

        <div class="pending-message">
          <h3>Ce qui se passe ensuite ?</h3>
          <ol>
            <li>Un administrateur va examiner votre demande</li>
            <li>Vous recevrez un email de confirmation ou de rejet</li>
            <li>Une fois approuvé, vous pourrez accéder à votre tableau de bord vendeur</li>
          </ol>
          <p style="color: #e74c3c; margin-top: 12px;">⏱️ Cette approbation peut prendre 24 à 48 heures.</p>
        </div>

        <button (click)="logout()" class="btn-logout">Se déconnecter</button>
      </div>
    </div>
  `,
  styles: [`
    .pending-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100%;
      padding: 20px;
    }

    .pending-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 600px;
      text-align: center;
    }

    .pending-icon {
      font-size: 64px;
      margin-bottom: 24px;
    }

    h1 {
      color: #2c3e50;
      margin: 0 0 12px 0;
      font-size: 28px;
    }

    .pending-text {
      color: #7f8c8d;
      font-size: 15px;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .pending-details {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
      text-align: left;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .detail-item:last-child {
      border-bottom: none;
    }

    .label {
      color: #7f8c8d;
      font-weight: 600;
      font-size: 13px;
    }

    .value {
      color: #2c3e50;
      font-weight: 600;
    }

    .status-pending {
      background-color: #fff3cd;
      color: #856404;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      text-transform: uppercase;
    }

    .pending-message {
      background-color: #e8f4f8;
      border-left: 4px solid #3498db;
      padding: 20px;
      border-radius: 8px;
      text-align: left;
      margin: 24px 0;
    }

    .pending-message h3 {
      margin: 0 0 12px 0;
      color: #2c3e50;
      font-size: 16px;
    }

    .pending-message ol {
      margin: 0;
      padding-left: 20px;
      color: #555;
    }

    .pending-message li {
      margin-bottom: 8px;
      font-size: 14px;
    }

    .btn-logout {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 24px;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      background-color: #c0392b;
    }

    @media (max-width: 600px) {
      .pending-card {
        padding: 20px;
      }

      h1 {
        font-size: 22px;
      }
    }
  `]
})
export class PendingApprovalComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (currentUser.vendorStatus === 'APPROVED') {
      this.router.navigate(['/vendor/dashboard']);
      return;
    }

    if (currentUser.role !== 'ROLE_VENDOR' || currentUser.vendorStatus !== 'PENDING') {
      this.router.navigate(['/login']);
      return;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
