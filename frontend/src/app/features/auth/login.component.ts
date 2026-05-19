import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-circle">🛒</div>
          <h1>Bienvenue</h1>
          <p>Connectez-vous à VenteApp</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nom d'utilisateur</label>
            <input type="text" formControlName="username" placeholder="votre.nom" autocomplete="username">
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input [type]="showPwd() ? 'text' : 'password'" formControlName="password" placeholder="••••••••">
          </div>

          @if (error()) {
            <div style="background:rgba(239,68,68,.1);color:#ef4444;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;">
              {{ error() }}
            </div>
          }

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;margin-top:8px" [disabled]="loading()">
            @if (loading()) {
              <span>Connexion...</span>
            } @else {
              <span class="material-icons">login</span> Se connecter
            }
          </button>
        </form>

        <div style="text-align:center;margin-top:20px;font-size:13px;color:var(--text-muted)">
          Pas encore de compte ?
          <a routerLink="/auth/register" style="color:var(--accent);font-weight:600;text-decoration:none;margin-left:4px">S'inscrire</a>
        </div>

        <div style="margin-top:24px;padding:16px;background:var(--bg);border-radius:10px;font-size:12px;color:var(--text-muted)">
          <strong style="color:var(--text)">Comptes de démonstration :</strong><br>
          admin / Admin123! &nbsp;|&nbsp; manager / Manager123! &nbsp;|&nbsp; vendeur / Vendeur123!
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  showPwd = signal(false);

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err.error?.message || 'Identifiants incorrects');
        this.loading.set(false);
      }
    });
  }
}
