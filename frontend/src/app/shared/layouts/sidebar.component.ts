import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  children?: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <button (click)="toggleCollapse()" class="collapse-btn">
          {{ isCollapsed ? '→' : '←' }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <div *ngFor="let item of items" class="nav-group">
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: false }"
            class="nav-item"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span *ngIf="!isCollapsed" class="nav-label">{{ item.label }}</span>
          </a>

          <div *ngIf="item.children && !isCollapsed" class="nav-submenu">
            <a
              *ngFor="let child of item.children"
              [routerLink]="child.route"
              routerLinkActive="active"
              class="nav-subitem"
            >
              <span class="nav-icon">{{ child.icon }}</span>
              <span class="nav-label">{{ child.label }}</span>
            </a>
          </div>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #34495e;
      color: white;
      min-height: calc(100vh - 60px);
      padding-top: 0;
      transition: all 0.3s ease;
      position: sticky;
      top: 60px;
      overflow-y: auto;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: flex-end;
    }

    .collapse-btn {
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      padding: 4px 8px;
      transition: all 0.2s;
    }

    .collapse-btn:hover {
      color: #3498db;
    }

    .sidebar-nav {
      padding: 16px 0;
    }

    .nav-group {
      margin-bottom: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: #ecf0f1;
      text-decoration: none;
      transition: all 0.2s;
      font-size: 14px;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active {
      background-color: #3498db;
      color: white;
      font-weight: 600;
      border-left: 4px solid #2980b9;
    }

    .nav-icon {
      font-size: 18px;
      min-width: 20px;
      text-align: center;
    }

    .nav-label {
      flex: 1;
      white-space: nowrap;
    }

    .nav-submenu {
      background-color: rgba(0, 0, 0, 0.2);
      margin: 0;
    }

    .nav-subitem {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px 10px 40px;
      color: #bdc3c7;
      text-decoration: none;
      transition: all 0.2s;
      font-size: 13px;
    }

    .nav-subitem:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.05);
    }

    .nav-subitem.active {
      color: #3498db;
      font-weight: 600;
    }

    .sidebar.collapsed .nav-label {
      display: none;
    }

    .sidebar.collapsed .nav-submenu {
      display: none;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 70px;
      }

      .sidebar.collapsed {
        display: none;
      }

      .nav-label {
        display: none;
      }

      .sidebar-header {
        padding: 12px;
      }

      .nav-item {
        padding: 12px 8px;
        justify-content: center;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() items: SidebarItem[] = [];
  isCollapsed = false;

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
