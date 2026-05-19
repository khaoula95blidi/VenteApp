import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit, Client, Vente, Categorie, Dashboard, StatutVente } from '../models/models';

const BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Produit[]> { return this.http.get<Produit[]>(`${BASE}/produits`); }
  getActifs(): Observable<Produit[]> { return this.http.get<Produit[]>(`${BASE}/produits/actifs`); }
  getById(id: number): Observable<Produit> { return this.http.get<Produit>(`${BASE}/produits/${id}`); }
  create(p: Produit): Observable<Produit> { return this.http.post<Produit>(`${BASE}/produits`, p); }
  update(id: number, p: Produit): Observable<Produit> { return this.http.put<Produit>(`${BASE}/produits/${id}`, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/produits/${id}`); }
  getStockFaible(): Observable<Produit[]> { return this.http.get<Produit[]>(`${BASE}/produits/stock-faible`); }
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> { return this.http.get<Client[]>(`${BASE}/clients`); }
  getById(id: number): Observable<Client> { return this.http.get<Client>(`${BASE}/clients/${id}`); }
  search(q: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${BASE}/clients/search`, { params: new HttpParams().set('q', q) });
  }
  create(c: Client): Observable<Client> { return this.http.post<Client>(`${BASE}/clients`, c); }
  update(id: number, c: Client): Observable<Client> { return this.http.put<Client>(`${BASE}/clients/${id}`, c); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/clients/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class VenteService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Vente[]> { return this.http.get<Vente[]>(`${BASE}/ventes`); }
  getById(id: number): Observable<Vente> { return this.http.get<Vente>(`${BASE}/ventes/${id}`); }
  create(v: Vente): Observable<Vente> { return this.http.post<Vente>(`${BASE}/ventes`, v); }
  updateStatut(id: number, statut: StatutVente): Observable<Vente> {
    return this.http.patch<Vente>(`${BASE}/ventes/${id}/statut?statut=${statut}`, {});
  }
  annuler(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/ventes/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}
  getDashboard(): Observable<Dashboard> { return this.http.get<Dashboard>(`${BASE}/dashboard`); }
}

@Injectable({ providedIn: 'root' })
export class CategorieService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<Categorie[]> { return this.http.get<Categorie[]>(`${BASE}/categories`); }
}
