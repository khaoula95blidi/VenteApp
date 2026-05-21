import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VendorDashboard, Produit, Order, OrderStatus, Notification } from '../models/models';

const API = 'http://localhost:8085/api/vendor';

@Injectable({ providedIn: 'root' })
export class VendorService {
  constructor(private http: HttpClient) {}

  getVendorDashboard(): Observable<VendorDashboard> {
    return this.http.get<VendorDashboard>(`${API}/dashboard`);
  }

  getVendorProducts(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${API}/products`);
  }

  createProduct(dto: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${API}/products`, dto);
  }

  updateProduct(id: number, dto: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${API}/products/${id}`, dto);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/products/${id}`);
  }

  getVendorOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API}/orders`);
  }

  getOrderDetail(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${API}/orders/${orderId}`);
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${API}/orders/${orderId}/status?status=${status}`, {});
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API}/notifications`);
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API}/notifications/unread`);
  }

  markNotificationRead(notificationId: number): Observable<Notification> {
    return this.http.patch<Notification>(`${API}/notifications/${notificationId}/read`, {});
  }
}
