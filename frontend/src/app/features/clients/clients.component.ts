import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/api.services';
import { Client } from '../../core/models/models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="top-bar">
      <div class="page-title">Clients</div>
      <div class="top-actions">
        <div class="search-bar">
          <span class="material-icons">search</span>
          <input [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Rechercher un client...">
        </div>
        <button class="btn btn-primary" (click)="openModal()">
          <span class="material-icons">person_add</span> Nouveau client
        </button>
      </div>
    </div>

    <div class="page-content">
      <!-- Stats row -->
      <div style="display:flex;gap:16px;margin-bottom:24px">
        <div class="card" style="flex:1;padding:16px 20px;display:flex;align-items:center;gap:14px">
          <div style="width:42px;height:42px;background:rgba(139,92,246,.1);border-radius:10px;display:flex;align-items:center;justify-content:center">
            <span class="material-icons" style="color:#8b5cf6;font-size:20px">people</span>
          </div>
          <div>
            <div style="font-family:var(--font-display);font-size:22px;font-weight:700">{{ clients().length }}</div>
            <div style="font-size:12px;color:var(--text-muted)">Total clients</div>
          </div>
        </div>
        <div class="card" style="flex:1;padding:16px 20px;display:flex;align-items:center;gap:14px">
          <div style="width:42px;height:42px;background:rgba(34,197,94,.1);border-radius:10px;display:flex;align-items:center;justify-content:center">
            <span class="material-icons" style="color:var(--success);font-size:20px">how_to_reg</span>
          </div>
          <div>
            <div style="font-family:var(--font-display);font-size:22px;font-weight:700;color:var(--success)">{{ activeCount() }}</div>
            <div style="font-size:12px;color:var(--text-muted)">Clients actifs</div>
          </div>
        </div>
      </div>

      <div class="card" style="padding:0">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Contact</th>
                <th>Ville</th>
                <th>Ventes</th>
                <th>Total achats</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (c of filtered(); track c.id) {
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#f59e0b);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;color:#fff;font-size:13px;flex-shrink:0">
                        {{ (c.prenom[0] + c.nom[0]).toUpperCase() }}
                      </div>
                      <div>
                        <div style="font-weight:600;font-size:13px">{{ c.prenom }} {{ c.nom }}</div>
                        @if (c.numFiscal) {
                          <div style="font-size:11px;color:var(--text-muted)">MF: {{ c.numFiscal }}</div>
                        }
                      </div>
                    </div>
                  </td>
                  <td>
                    @if (c.email) { <div style="font-size:12px">{{ c.email }}</div> }
                    @if (c.telephone) { <div style="font-size:12px;color:var(--text-muted)">{{ c.telephone }}</div> }
                  </td>
                  <td style="font-size:13px">{{ c.ville || '—' }}</td>
                  <td>
                    <span style="font-weight:600;font-size:13px">{{ c.nombreVentes || 0 }}</span>
                  </td>
                  <td style="font-weight:600;color:var(--accent)">
                    {{ (c.totalAchats || 0) | currency:'TND':'symbol':'1.3-3':'fr' }}
                  </td>
                  <td>
                    <span class="badge" [class]="c.actif ? 'badge-success' : 'badge-neutral'">
                      {{ c.actif ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn btn-secondary btn-sm" (click)="edit(c)" title="Modifier">
                        <span class="material-icons" style="font-size:14px">edit</span>
                      </button>
                      <button class="btn btn-danger btn-sm" (click)="confirmDelete(c)" title="Supprimer">
                        <span class="material-icons" style="font-size:14px">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
              @if (!filtered().length) {
                <tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted)">
                  <span class="material-icons" style="font-size:32px;display:block;opacity:.3;margin-bottom:8px">people</span>
                  Aucun client trouvé
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
            <h3>{{ editing() ? 'Modifier le client' : 'Nouveau client' }}</h3>
            <button class="close-btn" (click)="closeModal()"><span class="material-icons">close</span></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="form">
              <div class="form-grid">
                <div class="form-group">
                  <label>Prénom *</label>
                  <input type="text" formControlName="prenom" placeholder="Prénom">
                </div>
                <div class="form-group">
                  <label>Nom *</label>
                  <input type="text" formControlName="nom" placeholder="Nom de famille">
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" formControlName="email" placeholder="email@exemple.com">
                </div>
                <div class="form-group">
                  <label>Téléphone</label>
                  <input type="tel" formControlName="telephone" placeholder="+216 XX XXX XXX">
                </div>
                <div class="form-group" style="grid-column:1/-1">
                  <label>Adresse</label>
                  <input type="text" formControlName="adresse" placeholder="Adresse complète">
                </div>
                <div class="form-group">
                  <label>Ville</label>
                  <input type="text" formControlName="ville" placeholder="Tunis">
                </div>
                <div class="form-group">
                  <label>Code postal</label>
                  <input type="text" formControlName="codePostal" placeholder="1000">
                </div>
                <div class="form-group">
                  <label>Pays</label>
                  <input type="text" formControlName="pays" placeholder="Tunisie">
                </div>
                <div class="form-group">
                  <label>N° Fiscal (MF)</label>
                  <input type="text" formControlName="numFiscal" placeholder="XXXX/X/XXX/XXX">
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
export class ClientsComponent implements OnInit {
  clients = signal<Client[]>([]);
  filtered = signal<Client[]>([]);
  showModal = signal(false);
  editing = signal<Client | null>(null);
  saving = signal(false);
  formError = signal('');
  searchQuery = '';
  activeCount = signal(0);

  form: FormGroup;

  constructor(private clientService: ClientService, private fb: FormBuilder) {
    this.form = this.fb.group({
      prenom: ['', Validators.required],
      nom:    ['', Validators.required],
      email:     ['', Validators.email],
      telephone: [''],
      adresse:   [''],
      ville:     [''],
      codePostal:[''],
      pays:      ['Tunisie'],
      numFiscal: ['']
    });
  }

  ngOnInit() { this.load(); }

  load() {
    this.clientService.getAll().subscribe(data => {
      this.clients.set(data);
      this.filtered.set(data);
      this.activeCount.set(data.filter(c => c.actif).length);
    });
  }

  onSearch() {
    const q = this.searchQuery.toLowerCase();
    this.filtered.set(!q ? this.clients() : this.clients().filter(c =>
      `${c.prenom} ${c.nom}`.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.telephone || '').includes(q)
    ));
  }

  openModal() {
    this.editing.set(null);
    this.form.reset({ pays: 'Tunisie' });
    this.formError.set('');
    this.showModal.set(true);
  }

  edit(c: Client) {
    this.editing.set(c);
    this.form.patchValue(c);
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  save() {
    if (this.form.invalid) { this.formError.set('Veuillez remplir les champs obligatoires.'); return; }
    this.saving.set(true);
    const dto: Client = { ...this.form.value };

    const obs = this.editing()
      ? this.clientService.update(this.editing()!.id!, dto)
      : this.clientService.create(dto);

    obs.subscribe({
      next: () => { this.closeModal(); this.load(); this.saving.set(false); },
      error: err => { this.formError.set(err.error?.message || 'Erreur'); this.saving.set(false); }
    });
  }

  confirmDelete(c: Client) {
    if (confirm(`Désactiver le client "${c.prenom} ${c.nom}" ?`)) {
      this.clientService.delete(c.id!).subscribe(() => this.load());
    }
  }
}
