import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { AdminService } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';
import { Categorie } from '../../core/models/models';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="category-management">
      <h1>Category Management</h1>

      <div class="form-section">
        <h3>Add New Category</h3>
        <div class="form-group">
          <input [(ngModel)]="newCategory.nom" placeholder="Category Name" class="input">
          <textarea [(ngModel)]="newCategory.description" placeholder="Description" class="input" rows="3"></textarea>
          <button (click)="addCategory()" class="btn-primary">Add Category</button>
        </div>
      </div>

      <div class="categories-section">
        <h3>Categories</h3>
        <app-loading-spinner [isLoading]="loading()"></app-loading-spinner>

        <div *ngIf="!loading() && categories().length > 0" class="categories-list">
          <div *ngFor="let cat of categories()" class="category-item">
            <div class="category-info">
              <h4>{{ cat.nom }}</h4>
              <p>{{ cat.description }}</p>
              <small>{{ cat.nombreProduits || 0 }} products</small>
            </div>
            <div class="category-actions">
              <button (click)="deleteCategory(cat.id!)" class="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-management {
      padding: 40px 20px;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 32px;
    }

    .form-section {
      background: white;
      padding: 24px;
      border-radius: 10px;
      margin-bottom: 32px;
    }

    h3 {
      margin-top: 0;
      color: #2c3e50;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .btn-primary {
      padding: 10px 20px;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .category-item {
      background: white;
      padding: 16px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-info h4 {
      margin: 0;
      color: #2c3e50;
    }

    .category-info p {
      margin: 4px 0;
      color: #7f8c8d;
      font-size: 13px;
    }

    .btn-danger {
      padding: 8px 16px;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class CategoryManagementComponent implements OnInit {
  categories = signal<Categorie[]>([]);
  loading = signal(true);
  newCategory = { nom: '', description: '' };

  constructor(private adminService: AdminService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.toast.error('Failed to load categories');
        this.loading.set(false);
      }
    });
  }

  addCategory(): void {
    if (!this.newCategory.nom.trim()) return;
    this.adminService.createCategory(this.newCategory as any).subscribe({
      next: () => {
        this.toast.success('Category added!');
        this.newCategory = { nom: '', description: '' };
        this.loadCategories();
      },
      error: (err) => this.toast.error(err.error?.message || 'Error adding category')
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('Delete this category?')) return;
    this.adminService.deleteCategory(id).subscribe({
      next: () => {
        this.toast.success('Category deleted!');
        this.loadCategories();
      },
      error: (err) => this.toast.error('Error deleting category')
    });
  }
}
