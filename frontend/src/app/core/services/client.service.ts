import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientProfile, Order } from '../models/models';

const API = 'http://localhost:8085/api/client';

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private http: HttpClient) {}

  getClientProfile(): Observable<ClientProfile> {
    return this.http.get<ClientProfile>(`${API}/profile`);
  }

  updateProfile(dto: Partial<ClientProfile>): Observable<ClientProfile> {
    return this.http.put<ClientProfile>(`${API}/profile`, dto);
  }

  getClientOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API}/orders`);
  }

  getOrderDetail(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${API}/orders/${orderId}`);
  }

  createOrder(dto: any): Observable<Order> {
    return this.http.post<Order>(`${API}/orders`, dto);
  }

  cancelOrder(orderId: number): Observable<void> {
    return this.http.patch<void>(`${API}/orders/${orderId}/cancel`, {});
  }
}
