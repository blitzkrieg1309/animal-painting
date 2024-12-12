import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-order-status',
  standalone: false,

  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.css',
})
export class OrderStatusComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrder().subscribe({
      next: (response) => {
        if (response.success) {
          this.orders = response.orders;
        }
      },
    });
  }

  getProgressPercentage(status: string): number {
    switch (status.toLowerCase()) {
      case 'on process':
        return 25; // 25% untuk "on process"
      case 'shipped':
        return 50; // 50% untuk "shipped"
      case 'received':
        return 100; // 100% untuk "received"
      case 'cancelled by seller':
        return 0; // 0% untuk "cancelled by seller"
      default:
        return 0; // Default jika status tidak dikenali
    }
  }

  getProgressColor(status: string): string {
    switch (status) {
      case 'on process':
        return '#212529'; // Hitam
      case 'shipped':
        return 'orange'; // orange
      case 'received':
        return 'green'; // Hijau
      case 'cancelled by seller':
        return 'red'; // Merah
      default:
        return '#ccc'; // Default warna abu-abu
    }
  }

  getProgressLabel(status: string): string[] {
    if (status === 'cancelled by seller') {
      return ['Order Cancelled'];
    }
    return ['On Process', 'Shipped', 'Delivered'];
  }
}
