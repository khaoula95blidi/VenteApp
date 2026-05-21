import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../core/services/vendor.service';
import { Notification } from '../../core/models/models';

@Component({
  selector: 'app-vendor-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications">
      <h1>Notifications</h1>
      <div *ngIf="notifications().length > 0" class="notifications-list">
        <div *ngFor="let notif of notifications()" class="notification-item" [class.unread]="!notif.isRead">
          <div class="notif-content">
            <h4>{{ notif.title }}</h4>
            <p>{{ notif.message }}</p>
            <small>{{ notif.createdAt | date }}</small>
          </div>
          <button *ngIf="!notif.isRead" (click)="markAsRead(notif)" class="btn-mark">Mark Read</button>
        </div>
      </div>
      <div *ngIf="notifications().length === 0" class="empty-state">
        <p>No notifications.</p>
      </div>
    </div>
  `,
  styles: [`
    .notifications { padding: 20px; }
    h1 { color: #2c3e50; margin-bottom: 24px; }
    .notifications-list { display: flex; flex-direction: column; gap: 12px; }
    .notification-item { background: white; padding: 16px; border-radius: 6px; border-left: 4px solid #3498db; }
    .notification-item.unread { background-color: #f0f8ff; }
    .notif-content h4 { margin: 0 0 8px 0; }
    .notif-content p { margin: 0 0 8px 0; color: #7f8c8d; }
    .btn-mark { padding: 6px 12px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .empty-state { text-align: center; padding: 40px; }
  `]
})
export class VendorNotificationsComponent implements OnInit {
  notifications = signal<Notification[]>([]);

  constructor(private vendorService: VendorService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.vendorService.getNotifications().subscribe({
      next: (res) => this.notifications.set(res),
      error: () => {}
    });
  }

  markAsRead(notif: Notification): void {
    if (!notif.id) return;
    this.vendorService.markNotificationRead(notif.id).subscribe({
      next: () => this.loadNotifications(),
      error: () => {}
    });
  }
}
