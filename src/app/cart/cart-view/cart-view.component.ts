import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../../models/product';
import { toArray } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-view',
  standalone: false,

  templateUrl: './cart-view.component.html',
  styleUrl: './cart-view.component.css',
})
export class CartViewComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  totalItems: number = 0;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCartItems().subscribe((response) => {
      console.log('Cart items response:', response); // Debug respons API
      if (response.success) {
        this.cartItems = response.cart_items.map((item: any) => ({
          ...item,
          product_id: item.product_id || item.id, // Pastikan `product_id` ada
        }));
        // hitung totalPrice
        this.totalPrice = this.cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        this.totalItems = this.cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      }
    });
  }

  clearCart(cartId: number): void {
    this.cartService.softDeleteCartItem(cartId).subscribe((response) => {
      if (response.success) {
        // Filter item yang dihapus dari tampilan
        this.cartItems = this.cartItems.filter(
          (item) => item.cart_id !== cartId
        );

        // perbarui totalPrice dan totalItems
        this.updateCartSummary();
      }
    });
  }

  checkOut(): void {
    const payload = this.cartItems.map((item) => ({
      product_id: item.product_id, // Pastikan `product_id` ada
      quantity: item.quantity,
      price: parseFloat(item.price), // Pastikan `price` adalah angka
    }));

    this.cartService.checkOut(payload).subscribe({
      next: (response) => {
        console.log('Checkout successful:', response);
        this.cartItems = []; // Bersihkan keranjang setelah checkout
        this.updateCartSummary();
      },
      error: (error) => {
        console.error('Checkout failed:', error);
      },
    });
  }

  updateCartSummary(): void {
    // Hitung total harga
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0 // Nilai awal untuk reduce
    );

    // Hitung total item
    this.totalItems = this.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0 // Nilai awal untuk reduce
    );
  }
}
