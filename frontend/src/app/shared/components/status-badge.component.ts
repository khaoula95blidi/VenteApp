import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="'badge-' + status">
      {{ formatStatus(status) }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-PENDING {
      background-color: #fff3cd;
      color: #856404;
    }

    .badge-APPROVED {
      background-color: #d4edda;
      color: #155724;
    }

    .badge-REJECTED {
      background-color: #f8d7da;
      color: #721c24;
    }

    .badge-CONFIRMED {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .badge-SHIPPED {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .badge-DELIVERED {
      background-color: #d4edda;
      color: #155724;
    }

    .badge-CANCELLED {
      background-color: #f8d7da;
      color: #721c24;
    }

    .badge-ACTIVE,
    .badge-true {
      background-color: #d4edda;
      color: #155724;
    }

    .badge-INACTIVE,
    .badge-false {
      background-color: #f8d7da;
      color: #721c24;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  formatStatus(status: string): string {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
