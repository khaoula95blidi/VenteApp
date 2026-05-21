import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo-circle">✨</div>
          <h1>Créer un compte</h1>
          <p>Rejoignez VenteApp dès maintenant</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nom complet</label>
            <input type="text" formControlName="fullName" placeholder="Prénom Nom">
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Nom d'utilisateur</label>
              <input type="text" formControlName="username" placeholder="utilisateur">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="email@exemple.com">
            </div>
          </div>
          <div class="form-group">
            <label>Mot de passe (min. 6 caractères)</label>
            <input type="password" formControlName="password" placeholder="••••••••">
          </div>

          @if (error()) {
            <div style="background:rgba(239,68,68,.1);color:#ef4444;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;">
              {{ error() }}
            </div>
          }

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;margin-top:8px" [disabled]="loading()">
            @if (loading()) { <span>Inscription...</span> }
            @else { <span class="material-icons">person_add</span> S'inscrire }
          </button>
        </form>

        <div style="text-align:center;margin-top:20px;font-size:13px;color:var(--text-muted)">
          Déjà inscrit ?
          <a routerLink="/login" style="color:var(--accent);font-weight:600;text-decoration:none;margin-left:4px">Se connecter</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      fullName: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('Compte créé avec succès, veuillez vous connecter');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors de l\'inscription');
        this.loading.set(false);
      }
    });
  }
}
