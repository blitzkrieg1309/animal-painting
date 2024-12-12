import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiCartUrl = environment.apiUrl;
  private apiCheckoutUrl = environment.apiUrl + '/checkout.php';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing! Please log in again.');
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    const body = { product_id: productId, quantity };
    return this.http.post<any>(this.apiCartUrl + '/add_to_cart.php', body, {
      headers: this.getHeaders(),
    });
  }

  getCartItems(): Observable<any> {
    return this.http.get<any>(this.apiCartUrl + 'get_cart_items.php', {
      headers: this.getHeaders(),
    });
  }

  softDeleteCartItem(cartId: number): Observable<any> {
    const body = { cart_id: cartId };
    return this.http.post<any>(`${this.apiCartUrl}/clear_cart.php`, body, {
      headers: this.getHeaders(),
    });
  }

  checkOut(cartItems: any[]): Observable<any> {
    const body = cartItems;
    return this.http.post<any>(`${this.apiCheckoutUrl}`, body, {
      headers: this.getHeaders(),
    });
  }
}
