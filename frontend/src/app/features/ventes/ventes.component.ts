import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VenteService, ClientService, ProduitService } from '../../core/services/api.services';
import { Vente, Client, Produit, LigneVente, StatutVente, ModePaiement } from '../../core/models/models';

@Component({
  selector: 'app-ventes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="top-bar">
      <div class="page-title">Ventes</div>
      <div class="top-actions">
        <div class="search-bar">
          <span class="material-icons">search</span>
          <input [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="N° vente, client...">
        </div>
        <select [(ngModel)]="filterStatut" (change)="onSearch()"
          style="padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;outline:none;color:var(--text)">
          <option value="">Tous les statuts</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="CONFIRMEE">Confirmée</option>
          <option value="PAYEE">Payée</option>
          <option value="LIVREE">Livrée</option>
          <option value="ANNULEE">Annulée</option>
        </select>
        <button class="btn btn-primary" (click)="openModal()">
          <span class="material-icons">add</span> Nouvelle vente
        </button>
      </div>
    </div>

    <div class="page-content">
      <div class="card" style="padding:0">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>N° Vente</th>
                <th>Client</th>
                <th>Date</th>
                <th>Articles</th>
                <th>Total TTC</th>
                <th>Paiement</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (v of filtered(); track v.id) {
                <tr>
                  <td>
                    <span style="font-family:monospace;font-weight:700;font-size:12px;background:var(--bg);padding:3px 8px;border-radius:6px">
                      {{ v.numero }}
                    </span>
                  </td>
                  <td>
                    <div style="font-weight:600;font-size:13px">{{ v.clientNom }}</div>
                    @if (v.vendeurUsername) {
                      <div style="font-size:11px;color:var(--text-muted)">par {{ v.vendeurUsername }}</div>
                    }
                  </td>
                  <td style="font-size:12px;color:var(--text-muted)">
                    {{ v.dateVente | date:'dd/MM/yyyy HH:mm':'':'fr' }}
                  </td>
                  <td style="font-size:13px">{{ v.lignes?.length || 0 }} article(s)</td>
                  <td style="font-weight:700;font-size:14px;color:var(--accent)">
                    {{ v.totalTtc | currency:'TND':'symbol':'1.3-3':'fr' }}
                  </td>
                  <td>
                    @if (v.modePaiement) {
                      <span class="badge badge-neutral">{{ paiementLabel(v.modePaiement) }}</span>
                    } @else { <span style="color:var(--text-muted);font-size:12px">—</span> }
                  </td>
                  <td>
                    <span class="badge" [class]="statutClass(v.statut!)">{{ statutLabel(v.statut!) }}</span>
                  </td>
                  <td>
                    <div style="display:flex;gap:5px">
                      <button class="btn btn-secondary btn-sm" (click)="viewDetail(v)" title="Détails">
                        <span class="material-icons" style="font-size:14px">visibility</span>
                      </button>
                      @if (v.statut === 'EN_ATTENTE') {
                        <button class="btn btn-success btn-sm" (click)="changerStatut(v,'CONFIRMEE')" title="Confirmer">
                          <span class="material-icons" style="font-size:14px">check_circle</span>
                        </button>
                        <button class="btn btn-danger btn-sm" (click)="annuler(v)" title="Annuler">
                          <span class="material-icons" style="font-size:14px">cancel</span>
                        </button>
                      }
                      @if (v.statut === 'CONFIRMEE') {
                        <button class="btn btn-success btn-sm" (click)="changerStatut(v,'PAYEE')" title="Marquer payée">
                          <span class="material-icons" style="font-size:14px">payments</span>
                        </button>
                      }
                      @if (v.statut === 'PAYEE') {
                        <button class="btn btn-secondary btn-sm" (click)="changerStatut(v,'LIVREE')" title="Marquer livrée">
                          <span class="material-icons" style="font-size:14px">local_shipping</span>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
              @if (!filtered().length) {
                <tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted)">
                  <span class="material-icons" style="font-size:32px;display:block;opacity:.3;margin-bottom:8px">receipt_long</span>
                  Aucune vente trouvée
                </td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Vente Modal -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3><span class="material-icons" style="vertical-align:middle;margin-right:8px;color:var(--accent)">receipt_long</span>Nouvelle vente</h3>
            <button class="close-btn" (click)="closeModal()"><span class="material-icons">close</span></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="form">
              <div class="form-grid">
                <div class="form-group">
                  <label>Client *</label>
                  <select formControlName="clientId">
                    <option value="">— Sélectionner un client —</option>
                    @for (c of clients(); track c.id) {
                      <option [value]="c.id">{{ c.prenom }} {{ c.nom }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label>Mode de paiement</label>
                  <select formControlName="modePaiement">
                    <option value="">— Sélectionner —</option>
                    <option value="ESPECES">Espèces</option>
                    <option value="CHEQUE">Chèque</option>
                    <option value="VIREMENT">Virement</option>
                    <option value="CARTE">Carte bancaire</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>TVA (%)</label>
                  <input type="number" formControlName="tauxTva" placeholder="19">
                </div>
                <div class="form-group">
                  <label>Remise globale (TND)</label>
                  <input type="number" formControlName="montantRemise" placeholder="0.000">
                </div>
                <div class="form-group" style="grid-column:1/-1">
                  <label>Notes / Observations</label>
                  <textarea formControlName="notes" placeholder="Informations complémentaires..."></textarea>
                </div>
              </div>
            </form>

            <!-- Lignes -->
            <div style="margin-top:20px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                <h4 style="font-family:var(--font-display);font-size:14px;font-weight:700">Articles</h4>
                <button class="btn btn-secondary btn-sm" (click)="addLigne()">
                  <span class="material-icons" style="font-size:14px">add</span> Ajouter article
                </button>
              </div>

              @if (lignes().length === 0) {
                <div style="text-align:center;padding:24px;background:var(--bg);border-radius:8px;color:var(--text-muted);font-size:13px">
                  <span class="material-icons" style="font-size:24px;display:block;opacity:.3;margin-bottom:6px">add_shopping_cart</span>
                  Aucun article — cliquez "Ajouter article"
                </div>
              }

              @for (ligne of lignes(); track $index; let i = $index) {
                <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:10px;align-items:end;margin-bottom:10px;background:var(--bg);padding:12px;border-radius:8px">
                  <div class="form-group" style="margin:0">
                    <label style="font-size:10px">Produit *</label>
                    <select [(ngModel)]="lignes()[i].produitId" (change)="onProduitChange(i)" style="width:100%;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;outline:none">
                      <option [value]="0">— Sélectionner —</option>
                      @for (p of produits(); track p.id) {
                        <option [value]="p.id">{{ p.nom }} (Stock: {{ p.stock }})</option>
                      }
                    </select>
                  </div>
                  <div class="form-group" style="margin:0">
                    <label style="font-size:10px">Qté *</label>
                    <input type="number" [(ngModel)]="lignes()[i].quantite" (input)="recalcTotal()" min="1"
                      style="width:100%;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;outline:none">
                  </div>
                  <div class="form-group" style="margin:0">
                    <label style="font-size:10px">Prix unitaire</label>
                    <input type="number" [(ngModel)]="lignes()[i].prixUnitaire" (input)="recalcTotal()" step="0.001"
                      style="width:100%;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;outline:none">
                  </div>
                  <div class="form-group" style="margin:0">
                    <label style="font-size:10px">Remise %</label>
                    <input type="number" [(ngModel)]="lignes()[i].remise" (input)="recalcTotal()" min="0" max="100"
                      style="width:100%;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;outline:none">
                  </div>
                  <button class="btn btn-danger btn-sm" (click)="removeLigne(i)" style="margin-bottom:0">
                    <span class="material-icons" style="font-size:14px">delete</span>
                  </button>
                </div>
              }

              <!-- Totaux -->
              @if (lignes().length > 0) {
                <div style="background:var(--primary);color:#fff;border-radius:10px;padding:16px 20px;margin-top:12px">
                  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
                    <div style="text-align:center">
                      <div style="font-size:11px;opacity:.6;text-transform:uppercase;letter-spacing:.5px">Sous-total HT</div>
                      <div style="font-family:var(--font-display);font-size:18px;font-weight:700;margin-top:4px">
                        {{ sousTotal() | currency:'TND':'symbol':'1.3-3':'fr' }}
                      </div>
                    </div>
                    <div style="text-align:center;border-left:1px solid rgba(255,255,255,.15);border-right:1px solid rgba(255,255,255,.15)">
                      <div style="font-size:11px;opacity:.6;text-transform:uppercase;letter-spacing:.5px">TVA ({{ form.value.tauxTva || 19 }}%)</div>
                      <div style="font-family:var(--font-display);font-size:18px;font-weight:700;margin-top:4px">
                        {{ montantTva() | currency:'TND':'symbol':'1.3-3':'fr' }}
                      </div>
                    </div>
                    <div style="text-align:center">
                      <div style="font-size:11px;opacity:.6;text-transform:uppercase;letter-spacing:.5px">Total TTC</div>
                      <div style="font-family:var(--font-display);font-size:22px;font-weight:800;margin-top:2px;color:var(--accent)">
                        {{ totalTtc() | currency:'TND':'symbol':'1.3-3':'fr' }}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            @if (formError()) {
              <div style="color:var(--danger);font-size:12px;margin-top:12px;padding:10px;background:rgba(239,68,68,.08);border-radius:8px">
                {{ formError() }}
              </div>
            }
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Annuler</button>
            <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
              <span class="material-icons">save</span> {{ saving() ? 'Enregistrement...' : 'Créer la vente' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Detail Modal -->
    @if (detailVente()) {
      <div class="modal-overlay" (click)="detailVente.set(null)">
        <div class="modal modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Détail vente — <span style="color:var(--accent)">{{ detailVente()!.numero }}</span></h3>
            <button class="close-btn" (click)="detailVente.set(null)"><span class="material-icons">close</span></button>
          </div>
          <div class="modal-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
              <div style="background:var(--bg);padding:14px;border-radius:10px">
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Informations</div>
                <div style="font-size:13px"><strong>Client:</strong> {{ detailVente()!.clientNom }}</div>
                <div style="font-size:13px;margin-top:4px"><strong>Date:</strong> {{ detailVente()!.dateVente | date:'dd/MM/yyyy HH:mm':'':'fr' }}</div>
                <div style="font-size:13px;margin-top:4px"><strong>Vendeur:</strong> {{ detailVente()!.vendeurUsername || '—' }}</div>
              </div>
              <div style="background:var(--bg);padding:14px;border-radius:10px">
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Paiement</div>
                <div style="font-size:13px"><strong>Mode:</strong> {{ detailVente()!.modePaiement ? paiementLabel(detailVente()!.modePaiement!) : '—' }}</div>
                <div style="margin-top:6px">
                  <span class="badge" [class]="statutClass(detailVente()!.statut!)">{{ statutLabel(detailVente()!.statut!) }}</span>
                </div>
              </div>
            </div>

            <div class="table-wrapper">
              <table>
                <thead>
                  <tr><th>Produit</th><th>Réf.</th><th style="text-align:right">P.U.</th><th style="text-align:center">Qté</th><th style="text-align:right">Remise</th><th style="text-align:right">S/Total</th></tr>
                </thead>
                <tbody>
                  @for (l of detailVente()!.lignes; track l.id) {
                    <tr>
                      <td style="font-weight:600;font-size:13px">{{ l.produitNom }}</td>
                      <td><code style="font-size:11px;background:var(--bg);padding:2px 6px;border-radius:4px">{{ l.produitReference }}</code></td>
                      <td style="text-align:right;font-size:13px">{{ l.prixUnitaire | currency:'TND':'symbol':'1.3-3':'fr' }}</td>
                      <td style="text-align:center;font-weight:600">{{ l.quantite }}</td>
                      <td style="text-align:right;color:var(--success)">{{ l.remise || 0 }}%</td>
                      <td style="text-align:right;font-weight:700">{{ l.sousTotal | currency:'TND':'symbol':'1.3-3':'fr' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin-top:16px;padding:16px;background:var(--bg);border-radius:10px">
              <div style="font-size:13px;color:var(--text-muted)">Sous-total HT: <strong>{{ detailVente()!.sousTotal | currency:'TND':'symbol':'1.3-3':'fr' }}</strong></div>
              <div style="font-size:13px;color:var(--text-muted)">TVA ({{ detailVente()!.tauxTva }}%): <strong>{{ detailVente()!.montantTva | currency:'TND':'symbol':'1.3-3':'fr' }}</strong></div>
              @if ((detailVente()!.montantRemise || 0) > 0) {
                <div style="font-size:13px;color:var(--success)">Remise: -<strong>{{ detailVente()!.montantRemise | currency:'TND':'symbol':'1.3-3':'fr' }}</strong></div>
              }
              <div style="font-size:18px;font-family:var(--font-display);font-weight:800;color:var(--accent)">
                Total TTC: {{ detailVente()!.totalTtc | currency:'TND':'symbol':'1.3-3':'fr' }}
              </div>
            </div>

            @if (detailVente()!.notes) {
              <div style="margin-top:12px;padding:12px 14px;background:rgba(59,130,246,.06);border-radius:8px;font-size:13px;color:var(--text-muted)">
                <strong>Notes:</strong> {{ detailVente()!.notes }}
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class VentesComponent implements OnInit {
  ventes   = signal<Vente[]>([]);
  filtered = signal<Vente[]>([]);
  clients  = signal<Client[]>([]);
  produits = signal<Produit[]>([]);
  showModal  = signal(false);
  detailVente = signal<Vente | null>(null);
  saving     = signal(false);
  formError  = signal('');
  searchQuery  = '';
  filterStatut = '';

  lignes = signal<LigneVente[]>([]);
  sousTotal  = signal(0);
  montantTva = signal(0);
  totalTtc   = signal(0);

  form: FormGroup;

  constructor(
    private venteService: VenteService,
    private clientService: ClientService,
    private produitService: ProduitService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      clientId:      ['', Validators.required],
      modePaiement:  [''],
      tauxTva:       [19],
      montantRemise: [0],
      notes:         ['']
    });
  }

  ngOnInit() {
    this.load();
    this.clientService.getAll().subscribe(d  => this.clients.set(d.filter(c => c.actif)));
    this.produitService.getActifs().subscribe(d => this.produits.set(d));
  }

  load() {
    this.venteService.getAll().subscribe(data => {
      this.ventes.set(data);
      this.filtered.set(data);
    });
  }

  onSearch() {
    const q = this.searchQuery.toLowerCase();
    const s = this.filterStatut;
    this.filtered.set(this.ventes().filter(v =>
      (!q || (v.numero || '').toLowerCase().includes(q) || (v.clientNom || '').toLowerCase().includes(q)) &&
      (!s || v.statut === s)
    ));
  }

  openModal() {
    this.form.reset({ tauxTva: 19, montantRemise: 0 });
    this.lignes.set([]);
    this.recalcTotal();
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  viewDetail(v: Vente) {
    this.venteService.getById(v.id!).subscribe(detail => this.detailVente.set(detail));
  }

  addLigne() {
    this.lignes.update(l => [...l, { produitId: 0, quantite: 1, prixUnitaire: 0, remise: 0 }]);
  }

  removeLigne(i: number) {
    this.lignes.update(l => l.filter((_, idx) => idx !== i));
    this.recalcTotal();
  }

  onProduitChange(i: number) {
    const p = this.produits().find(p => p.id === +this.lignes()[i].produitId);
    if (p) {
      this.lignes.update(l => {
        l[i].prixUnitaire = p.prix;
        return [...l];
      });
      this.recalcTotal();
    }
  }

  recalcTotal() {
    const tva = +(this.form.value.tauxTva || 19);
    const remise = +(this.form.value.montantRemise || 0);
    const st = this.lignes().reduce((acc, l) => {
      const base = (l.prixUnitaire || 0) * (l.quantite || 0);
      const disc = base * ((l.remise || 0) / 100);
      return acc + (base - disc);
    }, 0);
    const mt = st * (tva / 100);
    this.sousTotal.set(st);
    this.montantTva.set(mt);
    this.totalTtc.set(st + mt - remise);
  }

  save() {
    if (this.form.invalid) { this.formError.set('Veuillez sélectionner un client.'); return; }
    if (!this.lignes().length) { this.formError.set('Ajoutez au moins un article.'); return; }
    const invalid = this.lignes().find(l => !l.produitId || !l.quantite || l.quantite < 1);
    if (invalid) { this.formError.set('Vérifiez les articles (produit et quantité requis).'); return; }

    this.saving.set(true);
    const dto: Vente = {
      ...this.form.value,
      lignes: this.lignes().map(l => ({ ...l, produitId: +l.produitId }))
    };

    this.venteService.create(dto).subscribe({
      next: () => { this.closeModal(); this.load(); this.saving.set(false); },
      error: err => { this.formError.set(err.error?.message || 'Erreur lors de la création.'); this.saving.set(false); }
    });
  }

  changerStatut(v: Vente, statut: StatutVente) {
    this.venteService.updateStatut(v.id!, statut).subscribe(() => this.load());
  }

  annuler(v: Vente) {
    if (confirm(`Annuler la vente ${v.numero} ? Le stock sera restitué.`)) {
      this.venteService.annuler(v.id!).subscribe(() => this.load());
    }
  }

  statutLabel(s: StatutVente): string {
    const map: Record<string,string> = {
      EN_ATTENTE:'En attente', CONFIRMEE:'Confirmée', PAYEE:'Payée', LIVREE:'Livrée', ANNULEE:'Annulée'
    };
    return map[s] || s;
  }

  statutClass(s: StatutVente): string {
    const map: Record<string,string> = {
      EN_ATTENTE:'badge-warning', CONFIRMEE:'badge-info', PAYEE:'badge-success', LIVREE:'badge-success', ANNULEE:'badge-danger'
    };
    return map[s] || 'badge-neutral';
  }

  paiementLabel(m: ModePaiement): string {
    const map: Record<string,string> = {
      ESPECES:'Espèces', CHEQUE:'Chèque', VIREMENT:'Virement', CARTE:'Carte', AUTRE:'Autre'
    };
    return map[m] || m;
  }
}
