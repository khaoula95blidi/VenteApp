import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProduitService, CategorieService } from '../../core/services/api.services';
import { Produit, Categorie } from '../../core/models/models';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="top-bar">
      <div class="page-title">Produits</div>
      <div class="top-actions">
        <div class="search-bar">
          <span class="material-icons">search</span>
          <input [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Rechercher..." [ngModelOptions]="{standalone:true}">
        </div>
        <button class="btn btn-primary" (click)="openModal()">
          <span class="material-icons">add</span> Nouveau produit
        </button>
      </div>
    </div>

    <div class="page-content">
      <!-- Stock faible alert -->
      @if (stockFaibleCount() > 0) {
        <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:10px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px;font-size:13px;color:#ef4444">
          <span class="material-icons" style="font-size:18px">warning_amber</span>
          <strong>{{ stockFaibleCount() }} produit(s)</strong> en stock faible — pensez à réapprovisionner.
        </div>
      }

      <div class="card" style="padding:0">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Référence</th>
                <th>Catégorie</th>
                <th>Prix TTC</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (p of filtered(); track p.id) {
                <tr>
                  <td>
                    <div style="font-weight:600;font-size:13px">{{ p.nom }}</div>
                    @if (p.description) {
                      <div style="font-size:11px;color:var(--text-muted);max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ p.description }}</div>
                    }
                  </td>
                  <td><code style="font-size:11px;background:var(--bg);padding:2px 6px;border-radius:4px">{{ p.reference }}</code></td>
                  <td>
                    @if (p.categorieNom) {
                      <span class="badge badge-info">{{ p.categorieNom }}</span>
                    } @else {
                      <span style="color:var(--text-muted);font-size:12px">—</span>
                    }
                  </td>
                  <td style="font-weight:600">{{ p.prix | currency:'TND':'symbol':'1.2-2':'fr' }}</td>
                  <td>
                    <div class="stock-bar">
                      <div class="bar-track">
                        <div class="bar-fill" [style.width.%]="getStockPct(p)"
                             [style.background]="p.stockFaible ? 'var(--danger)' : 'var(--success)'"></div>
                      </div>
                      <span [style.color]="p.stockFaible ? 'var(--danger)' : 'var(--text)'" style="font-size:13px;font-weight:600">{{ p.stock }}</span>
                      @if (p.stockFaible) {
                        <span class="material-icons" style="font-size:14px;color:var(--danger)">warning</span>
                      }
                    </div>
                  </td>
                  <td>
                    <span class="badge" [class]="p.actif ? 'badge-success' : 'badge-neutral'">
                      {{ p.actif ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn btn-secondary btn-sm" (click)="edit(p)">
                        <span class="material-icons" style="font-size:14px">edit</span>
                      </button>
                      <button class="btn btn-danger btn-sm" (click)="confirmDelete(p)">
                        <span class="material-icons" style="font-size:14px">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
              @if (!filtered().length) {
                <tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted)">
                  <span class="material-icons" style="font-size:32px;display:block;opacity:.3;margin-bottom:8px">inventory_2</span>
                  Aucun produit trouvé
                </td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editing() ? 'Modifier' : 'Nouveau' }} produit</h3>
            <button class="close-btn" (click)="closeModal()"><span class="material-icons">close</span></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="form">
              <div class="form-grid">
                <div class="form-group" style="grid-column:1/-1">
                  <label>Nom du produit *</label>
                  <input type="text" formControlName="nom" placeholder="Ex: Ordinateur Portable Dell">
                </div>
                <div class="form-group">
                  <label>Référence *</label>
                  <input type="text" formControlName="reference" placeholder="PROD-001">
                </div>
                <div class="form-group">
                  <label>Catégorie</label>
                  <select formControlName="categorieId">
                    <option value="">— Aucune —</option>
                    @for (c of categories(); track c.id) {
                      <option [value]="c.id">{{ c.nom }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label>Prix de vente TTC *</label>
                  <input type="number" formControlName="prix" placeholder="0.000" step="0.001">
                </div>
                <div class="form-group">
                  <label>Prix d'achat HT</label>
                  <input type="number" formControlName="prixAchat" placeholder="0.000" step="0.001">
                </div>
                <div class="form-group">
                  <label>Stock initial</label>
                  <input type="number" formControlName="stock" placeholder="0">
                </div>
                <div class="form-group">
                  <label>Stock minimum (alerte)</label>
                  <input type="number" formControlName="stockMinimum" placeholder="5">
                </div>
                <div class="form-group" style="grid-column:1/-1">
                  <label>Description</label>
                  <textarea formControlName="description" placeholder="Description du produit..."></textarea>
                </div>
              </div>
              @if (formError()) {
                <div style="color:var(--danger);font-size:12px;margin-top:8px">{{ formError() }}</div>
              }
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Annuler</button>
            <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
              <span class="material-icons">save</span> {{ saving() ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ProduitsComponent implements OnInit {
  produits = signal<Produit[]>([]);
  categories = signal<Categorie[]>([]);
  filtered = signal<Produit[]>([]);
  showModal = signal(false);
  editing = signal<Produit | null>(null);
  saving = signal(false);
  formError = signal('');
  searchQuery = '';
  stockFaibleCount = signal(0);

  form: FormGroup;

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      reference: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      prixAchat: [''],
      stock: [0, Validators.min(0)],
      stockMinimum: [5],
      categorieId: [''],
      description: ['']
    });
  }

  ngOnInit() {
    this.load();
    this.categorieService.getAll().subscribe(c => this.categories.set(c));
  }

  load() {
    this.produitService.getAll().subscribe(data => {
      this.produits.set(data);
      this.filtered.set(data);
      this.stockFaibleCount.set(data.filter(p => p.stockFaible).length);
    });
  }

  onSearch() {
    const q = this.searchQuery.toLowerCase();
    this.filtered.set(!q ? this.produits() : this.produits().filter(p =>
      p.nom.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q)
    ));
  }

  openModal() {
    this.editing.set(null);
    this.form.reset({ stock: 0, stockMinimum: 5 });
    this.formError.set('');
    this.showModal.set(true);
  }

  edit(p: Produit) {
    this.editing.set(p);
    this.form.patchValue({ ...p, categorieId: p.categorieId || '' });
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  save() {
    if (this.form.invalid) { this.formError.set('Veuillez remplir les champs obligatoires'); return; }
    this.saving.set(true);
    const val = this.form.value;
    const dto: Produit = { ...val, categorieId: val.categorieId || null, actif: true };

    const obs = this.editing()
      ? this.produitService.update(this.editing()!.id!, dto)
      : this.produitService.create(dto);

    obs.subscribe({
      next: () => { this.closeModal(); this.load(); this.saving.set(false); },
      error: (err) => { this.formError.set(err.error?.message || 'Erreur'); this.saving.set(false); }
    });
  }

  confirmDelete(p: Produit) {
    if (confirm(`Désactiver "${p.nom}" ?`)) {
      this.produitService.delete(p.id!).subscribe(() => this.load());
    }
  }

  getStockPct(p: Produit): number {
    const max = Math.max(p.stock, (p.stockMinimum || 5) * 4);
    return Math.min(100, (p.stock / max) * 100);
  }
}
