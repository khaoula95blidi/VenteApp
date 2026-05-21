import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { VendorRegisterRequest } from '../../core/models/models';

@Component({
  selector: 'app-vendor-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-circle">🏪</div>
          <h1>Devenir Vendeur</h1>
          <p>Rejoignez VenteApp Marketplace</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label>Nom d'utilisateur</label>
              <input type="text" formControlName="username" placeholder="vendor.name">
            </div>
            <div class="form-group">
              <label>Nom complet</label>
              <input type="text" formControlName="fullName" placeholder="Jean Dupont">
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="vendor@example.com">
          </div>

          <div class="form-group">
            <label>Nom de l'entreprise</label>
            <input type="text" formControlName="companyName" placeholder="Mon Entreprise">
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input [type]="showPwd() ? 'text' : 'password'" formControlName="password" placeholder="••••••••">
          </div>

          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }

          <button type="submit" class="btn btn-primary btn-lg" [disabled]="loading()">
            @if (loading()) {
              <span>Inscription...</span>
            } @else {
              <span>S'inscrire comme Vendeur</span>
            }
          </button>
        </form>

        <div class="auth-link">
          Déjà vendeur ?
          <a routerLink="/login">Se connecter</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100%;
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 500px;
    }

    .auth-logo {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-circle {
      font-size: 48px;
      margin-bottom: 16px;
    }

    h1 {
      margin: 12px 0 4px;
      font-size: 24px;
      color: #2c3e50;
    }

    p {
      color: #95a5a6;
      font-size: 14px;
      margin: 0;
    }

    form {
      margin: 24px 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }

    label {
      font-size: 13px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 6px;
    }

    input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 6px;
      font-size: 13px;
      margin-bottom: 16px;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: #2ecc71;
      color: white;
      width: 100%;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #27ae60;
    }

    .btn-lg {
      font-size: 14px;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-link {
      text-align: center;
      font-size: 13px;
      color: #95a5a6;
      margin-top: 20px;
    }

    .auth-link a {
      color: #3498db;
      font-weight: 600;
      text-decoration: none;
      margin-left: 4px;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .auth-card {
        padding: 20px;
      }
    }
  `]
})
export class VendorSignupComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  showPwd = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const req: VendorRegisterRequest = this.form.value;
    this.auth.registerVendor(req).subscribe({
      next: (res) => {
        this.toast.success('Inscription réussie! Veuillez attendre l\'approbation de l\'administrateur.');
        this.router.navigate(['/pending']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors de l\'inscription');
        this.loading.set(false);
      }
    });
  }
}
