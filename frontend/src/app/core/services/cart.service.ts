import { Injectable, signal } from '@angular/core';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  vendorId: number;
}

export interface Cart {
  vendorId: number | null;
  items: CartItem[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'venteapp_cart';
  private cartSignal = signal<Cart>(this.getCartFromStorage());

  addToCart(product: any, vendorId: number): { success: boolean; conflict?: boolean } {
    const cart = this.getCartFromStorage();

    // Check vendor mismatch
    if (cart.vendorId && cart.vendorId !== vendorId) {
      return { success: false, conflict: true };
    }

    cart.vendorId = vendorId;
    const existing = cart.items.find(i => i.productId === product.id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.items.push({
        productId: product.id,
        name: product.nom,
        price: product.prix,
        quantity: 1,
        vendorId: vendorId
      });
    }

    this.saveCartToStorage(cart);
    this.cartSignal.set(cart);
    return { success: true };
  }

  getCart(): Cart {
    return this.cartSignal();
  }

  getItemCount(): number {
    return this.getCart().items.reduce((sum, item) => sum + item.quantity, 0);
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
    this.cartSignal.set({ vendorId: null, items: [] });
  }

  removeItem(productId: number): void {
    const cart = this.getCartFromStorage();
    cart.items = cart.items.filter(i => i.productId !== productId);
    this.saveCartToStorage(cart);
    this.cartSignal.set(cart);
  }

  removeFromCart(productId: number): void {
    const cart = this.getCartFromStorage();
    cart.items = cart.items.filter(i => i.productId !== productId);
    if (cart.items.length === 0) {
      cart.vendorId = null;
    }
    this.saveCartToStorage(cart);
    this.cartSignal.set(cart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCartFromStorage();
    const item = cart.items.find(i => i.productId === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCartToStorage(cart);
      this.cartSignal.set(cart);
    }
  }

  private getCartFromStorage(): Cart {
    const raw = localStorage.getItem(this.cartKey);
    return raw ? JSON.parse(raw) : { vendorId: null, items: [] };
  }

  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }
}
