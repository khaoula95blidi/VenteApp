import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/api.services';
import { Dashboard } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="top-bar">
      <div class="page-title">Tableau de bord</div>
      <div class="top-actions">
        <span style="font-size:12px;color:var(--text-muted)">{{ today }}</span>
      </div>
    </div>

    <div class="page-content">
      @if (loading()) {
        <div class="flex-center" style="height:300px">
          <div style="text-align:center;color:var(--text-muted)">
            <span class="material-icons" style="font-size:48px;display:block;margin-bottom:12px;opacity:.3">sync</span>
            Chargement...
          </div>
        </div>
      }

      @if (!loading() && data()) {
        <!-- Stats Grid -->
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(249,115,22,.1)">
              <span class="material-icons" style="color:var(--accent)">payments</span>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ data()!.chiffreAffaires | currency:'TND':'symbol':'1.0-0':'fr' }}</div>
              <div class="stat-label">Chiffre d'affaires total</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(59,130,246,.1)">
              <span class="material-icons" style="color:var(--info)">trending_up</span>
            </div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--info)">{{ data()!.chiffreAffairesMois | currency:'TND':'symbol':'1.0-0':'fr' }}</div>
              <div class="stat-label">CA ce mois</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(34,197,94,.1)">
              <span class="material-icons" style="color:var(--success)">receipt_long</span>
            </div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--success)">{{ data()!.nombreVentes }}</div>
              <div class="stat-label">Ventes totales</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(139,92,246,.1)">
              <span class="material-icons" style="color:#8b5cf6">people</span>
            </div>
            <div class="stat-info">
              <div class="stat-value" style="color:#8b5cf6">{{ data()!.nombreClients }}</div>
              <div class="stat-label">Clients actifs</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(245,158,11,.1)">
              <span class="material-icons" style="color:var(--warning)">inventory_2</span>
            </div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--warning)">{{ data()!.nombreProduits }}</div>
              <div class="stat-label">Produits actifs</div>
            </div>
          </div>

          <div class="stat-card" [style.border-color]="data()!.produitStockFaible > 0 ? 'var(--danger)' : 'var(--border)'">
            <div class="stat-icon" style="background:rgba(239,68,68,.1)">
              <span class="material-icons" style="color:var(--danger)">warning_amber</span>
            </div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--danger)">{{ data()!.produitStockFaible }}</div>
              <div class="stat-label">Stock faible</div>
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
          <!-- Monthly Chart -->
          <div class="card">
            <h3 style="font-family:var(--font-display);font-size:15px;font-weight:700;margin-bottom:20px">
              Ventes par mois — {{ currentYear }}
            </h3>
            <div style="display:flex;align-items:flex-end;gap:6px;height:140px">
              @for (stat of data()!.statsParMois; track stat.mois) {
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
                  <div [style.height.px]="getBarHeight(stat.total)"
                       [style.background]="stat.mois === currentMonth ? 'var(--accent)' : 'var(--border)'"
                       style="width:100%;border-radius:4px 4px 0 0;transition:all .3s;min-height:2px">
                  </div>
                  <div style="font-size:9px;color:var(--text-muted)">{{ stat.nomMois }}</div>
                </div>
              }
            </div>
          </div>

          <!-- Recent Ventes -->
          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
              <h3 style="font-family:var(--font-display);font-size:15px;font-weight:700">Dernières ventes</h3>
              <a routerLink="/ventes" style="font-size:12px;color:var(--accent);text-decoration:none;font-weight:600">Voir tout →</a>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px">
              @for (vente of data()!.dernieresVentes; track vente.id) {
                <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--bg);border-radius:8px">
                  <div>
                    <div style="font-size:13px;font-weight:600">{{ vente.numero }}</div>
                    <div style="font-size:11px;color:var(--text-muted)">{{ vente.clientNom }}</div>
                  </div>
                  <div style="text-align:right">
                    <div style="font-size:13px;font-weight:700;color:var(--accent)">{{ vente.totalTtc | currency:'TND':'symbol':'1.2-2':'fr' }}</div>
                    <span class="badge" [class]="getStatutClass(vente.statut!)">{{ vente.statut }}</span>
                  </div>
                </div>
              }
              @if (!data()!.dernieresVentes.length) {
                <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px">Aucune vente</div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  data = signal<Dashboard | null>(null);
  loading = signal(true);
  today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  maxTotal = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboard().subscribe({
      next: d => {
        this.data.set(d);
        this.maxTotal = Math.max(...d.statsParMois.map(s => s.total), 1);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getBarHeight(total: number): number {
    return Math.max(2, (total / this.maxTotal) * 120);
  }

  getStatutClass(statut: string): string {
    const map: Record<string, string> = {
      'EN_ATTENTE': 'badge-warning', 'CONFIRMEE': 'badge-info',
      'PAYEE': 'badge-success', 'LIVREE': 'badge-success', 'ANNULEE': 'badge-danger'
    };
    return map[statut] || 'badge-neutral';
  }
}
