import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,

  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  orders: any[] = [];
  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      // image: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // this.loadProducts();
    this.loadOrders();
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('File selected:', this.selectedFile); // Debug file yang dipilih
    }
  }

  onSubmit(): void {
    console.log('Form status:', this.productForm.valid); // Log status validasi form
    console.log('Form values:', this.productForm.value); // Log nilai form
    console.log('Selected file:', this.selectedFile); // Log file yang dipilih

    if (this.productForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.productForm.value.name);
      formData.append('price', this.productForm.value.price);
      formData.append('image', this.selectedFile);

      this.adminService.addProductAdmin(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Product added successfully!', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.productForm.reset();
          this.selectedFile = null; // reset file input
        },
        error: (err) => {
          console.error('Error adding product: ', err);
          this.snackBar.open('Failed add to product', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
    } else {
      this.snackBar.open('Please Complate the form', '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }

  loadProducts(): void {
    this.adminService.getProducts().subscribe((data) => {
      if (data.success) {
        this.products = data.products;
      }
    });
  }

  loadOrders(): void {
    this.adminService.getOrder().subscribe({
      next: (data) => {
        if (data.success) {
          this.orders = data.orders.map((order: any) => ({
            ...order,
            items: JSON.parse(order.items), // Parse JSON string to array
          }));
        }
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      },
    });
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    if (!newStatus) {
      console.error('No status selected');
      return;
    }

    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (response) => {
        console.log('Order status updated', response.message);
        // reload orders
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating status', error);
      },
    });
  }
}
