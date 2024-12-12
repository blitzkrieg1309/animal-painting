import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private productsUrl = environment.apiUrl + '/products.php';
  private addProductUrl = environment.apiUrl + '/add_product.php';
  private ordersUrl = environment.apiUrl + '/ordersAdmin.php';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token is missing! Please log in again.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Product Methods
  getProducts(): Observable<any> {
    return this.http.get(this.productsUrl, {
      headers: this.getHeaders(),
    });
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.productsUrl, product, {
      headers: this.getHeaders(),
    });
  }

  addProductAdmin(formData: FormData): Observable<any> {
    return this.http.post(this.addProductUrl, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  // Order Methods
  getOrder(): Observable<any> {
    return this.http.get(this.ordersUrl, {
      headers: this.getHeaders(),
    });
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.post(
      this.ordersUrl,
      { order_id: orderId, status },
      {
        headers: this.getHeaders(),
      }
    );
  }
}
