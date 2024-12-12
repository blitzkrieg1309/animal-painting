import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { CartService } from '../../cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  standalone: false,

  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'], // Perbaiki `styleUrls`
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortOrder: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Fetch products dari API
    this.productService.getProducts().subscribe(
      (data) => {
        // console.log('Data received from API:', data); // Debug respons API
        if (data && data.success && Array.isArray(data.products)) {
          this.products = data.products; // Ambil array `products` dari respons
          this.filteredProducts = data.products; // Set array `products` ke filteredProducts
          // console.log(this.filteredProducts);
        } else {
          console.error('Invalid API response format:', data);
        }
      },
      (error) => {
        console.error('Error fetching products:', error); // Debug jika terjadi error
      }
    );
  }

  // Menambahkan produk ke cart
  addToCart(product: Product): void {
    const productId = product.id; // Ambil ID produk
    const quantity = 1; // Default quantity, bisa diubah sesuai kebutuhan

    this.cartService.addToCart(productId, quantity).subscribe({
      next: (response) => {
        console.log('Added to cart response:', response); // Debug respons API
        this.snackBar.open('Added to Cart', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (error) => {
        console.error('Error adding to cart:', error); // Debug jika terjadi error
        this.snackBar.open('Failed to Add to Cart', '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  // Filter produk berdasarkan input pencarian
  applyFilter(event: Event): void {
    let searchTearm = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(searchTearm)
    );

    this.sortProduct(this.sortOrder);
  }

  // Mengurutkan produk berdasarkan harga
  sortProduct(sortValue: string): void {
    this.sortOrder = sortValue;

    if (this.sortOrder === 'priceLowHigh') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'priceHighLow') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }
  }
}
