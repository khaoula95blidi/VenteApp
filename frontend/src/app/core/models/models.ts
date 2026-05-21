// src/app/core/models/auth.models.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  vendorStatus?: string;
  companyName?: string;
}

export interface CurrentUser {
  username: string;
  email: string;
  fullName: string;
  role: string;
  token: string;
  vendorStatus?: string;
  companyName?: string;
}

export interface VendorRegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  companyName: string;
}

export interface ClientRegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

// src/app/core/models/produit.models.ts
export interface Produit {
  id?: number;
  nom: string;
  description?: string;
  reference: string;
  prix: number;
  prixAchat?: number;
  stock: number;
  stockMinimum?: number;
  categorieId?: number;
  categorieNom?: string;
  actif: boolean;
  createdAt?: string;
  stockFaible?: boolean;
}

// src/app/core/models/client.models.ts
export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  numFiscal?: string;
  actif?: boolean;
  createdAt?: string;
  nombreVentes?: number;
  totalAchats?: number;
}

// src/app/core/models/vente.models.ts
export interface LigneVente {
  id?: number;
  produitId: number;
  produitNom?: string;
  produitReference?: string;
  quantite: number;
  prixUnitaire: number;
  remise?: number;
  sousTotal?: number;
}

export interface Vente {
  id?: number;
  numero?: string;
  clientId: number;
  clientNom?: string;
  vendeurUsername?: string;
  statut?: StatutVente;
  modePaiement?: ModePaiement;
  lignes: LigneVente[];
  sousTotal?: number;
  tauxTva?: number;
  montantTva?: number;
  montantRemise?: number;
  totalTtc?: number;
  notes?: string;
  dateVente?: string;
}

export type StatutVente = 'EN_ATTENTE' | 'CONFIRMEE' | 'PAYEE' | 'LIVREE' | 'ANNULEE';
export type ModePaiement = 'ESPECES' | 'CHEQUE' | 'VIREMENT' | 'CARTE' | 'AUTRE';

export interface Categorie {
  id?: number;
  nom: string;
  description?: string;
  nombreProduits?: number;
}

// src/app/core/models/dashboard.models.ts
export interface Dashboard {
  chiffreAffaires: number;
  chiffreAffairesMois: number;
  nombreVentes: number;
  nombreVentesMois: number;
  nombreClients: number;
  nombreProduits: number;
  produitStockFaible: number;
  dernieresVentes: Vente[];
  statsParMois: StatsMois[];
}

export interface StatsMois {
  mois: number;
  nomMois: string;
  total: number;
}

// ===== MARKETPLACE MODELS =====

export type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type NotificationType = 'LOW_STOCK_ALERT' | 'ORDER_RECEIVED' | 'ORDER_UPDATED' | 'VENDOR_APPROVED' | 'VENDOR_REJECTED';

export interface Vendor {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  companyName: string;
  vendorStatus?: VendorStatus;
  registeredAt?: string;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
}

export interface Order {
  id?: number;
  orderNumber: string;
  clientId: number;
  vendorId: number;
  clientNom?: string;
  vendorCompanyName?: string;
  status?: OrderStatus;
  items?: OrderItem[];
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  shippingAddress?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName?: string;
  productReference?: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export interface Notification {
  id?: number;
  vendorId: number;
  type: NotificationType;
  title: string;
  message: string;
  productId?: number;
  productName?: string;
  orderId?: number;
  orderNumber?: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface AdminDashboard {
  totalVendors: number;
  approvedVendors: number;
  pendingVendors: number;
  totalClients: number;
  totalProducts: number;
  totalCategories: number;
}

export interface VendorDashboard {
  vendorId: number;
  vendorName: string;
  totalProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface ClientProfile {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  registeredAt?: string;
}

export interface CartItem {
  vendorId: number;
  vendorName: string;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}
