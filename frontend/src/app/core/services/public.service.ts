import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor, Produit, Categorie } from '../models/models';

const API = 'http://localhost:8085/api/public';

@Injectable({ providedIn: 'root' })
export class PublicService {
  constructor(private http: HttpClient) {}

  getApprovedVendors(page = 0, size = 10): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${API}/vendors?page=${page}&size=${size}`);
  }

  getVendorProfile(vendorId: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${API}/vendors/${vendorId}`);
  }

  getVendorProducts(vendorId: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${API}/vendors/${vendorId}/products`);
  }

  getProduct(productId: number): Observable<Produit> {
    return this.http.get<Produit>(`${API}/products/${productId}`);
  }

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${API}/categories`);
  }
}
