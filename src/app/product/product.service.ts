import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductApiResponse } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl + 'fetch_products.php';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductApiResponse> {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage

    // Tambahkan header Authorization
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<ProductApiResponse>(this.apiUrl, { headers });
  }
}
