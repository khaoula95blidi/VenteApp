import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor, Categorie, AdminDashboard } from '../models/models';

const API = 'http://localhost:8085/api/admin';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getVendors(page = 0, size = 10): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${API}/vendors?page=${page}&size=${size}`);
  }

  getPendingVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${API}/vendors/pending`);
  }

  getVendor(vendorId: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${API}/vendors/${vendorId}`);
  }

  approveVendor(vendorId: number): Observable<Vendor> {
    return this.http.patch<Vendor>(`${API}/vendors/${vendorId}/approve`, {});
  }

  rejectVendor(vendorId: number, reason: string): Observable<Vendor> {
    return this.http.patch<Vendor>(`${API}/vendors/${vendorId}/reject?reason=${reason}`, {});
  }

  getAdminDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${API}/dashboard`);
  }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${API}/categories`);
  }

  createCategory(dto: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${API}/categories`, dto);
  }

  updateCategory(id: number, dto: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${API}/categories/${id}`, dto);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/categories/${id}`);
  }
}
